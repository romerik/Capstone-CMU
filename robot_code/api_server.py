#!/usr/bin/env python3
import subprocess
import sys
import os
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import uvicorn

# Create FastAPI app
app = FastAPI(
    title="Robot Delivery API",
    description="API to control the Unitree Go2 robot delivery process",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Models
class DeliveryRequest(BaseModel):
    interface_name: str = "en7"  # Default to en7, can be overridden
    description: Optional[str] = None  # Optional description of the delivery

class DeliveryResponse(BaseModel):
    status: str
    message: str
    delivery_id: Optional[str] = None

# Store for tracking deliveries
delivery_status = {}
current_delivery_id = 0

def run_delivery_process(delivery_id: int, interface_name: str):
    """
    Run the delivery process as a background task
    """
    try:
        delivery_status[delivery_id] = "in_progress"
        
        # Run the delivery script
        result = subprocess.run(
            ["python", "deliver_return.py", interface_name],
            capture_output=True,
            text=True,
            check=True
        )
        
        # Update status on success
        delivery_status[delivery_id] = "completed"
        print(f"Delivery {delivery_id} completed successfully")
        print(f"Output: {result.stdout}")
        
    except subprocess.CalledProcessError as e:
        # Update status on failure
        delivery_status[delivery_id] = "failed"
        print(f"Delivery {delivery_id} failed with error: {e}")
        print(f"Error output: {e.stderr}")
        
    except Exception as e:
        # Update status on other exceptions
        delivery_status[delivery_id] = "failed"
        print(f"Delivery {delivery_id} failed with unexpected error: {str(e)}")

@app.post("/api/delivery/start", response_model=DeliveryResponse, tags=["Delivery Control"])
async def start_delivery(delivery_request: DeliveryRequest, background_tasks: BackgroundTasks):
    """
    Start a new delivery process using the robot.
    
    - **interface_name**: Network interface to use (default: en7)
    - **description**: Optional description of the delivery
    
    Returns the status of the delivery request and a delivery ID for tracking.
    """
    global current_delivery_id
    
    # Check if a delivery is already in progress
    for delivery_id, status in delivery_status.items():
        if status == "in_progress":
            return DeliveryResponse(
                status="error",
                message="A delivery is already in progress. Please try again later."
            )
    
    # Generate a new delivery ID
    current_delivery_id += 1
    delivery_id = current_delivery_id
    
    # Add the task to run in the background
    background_tasks.add_task(
        run_delivery_process, 
        delivery_id=delivery_id,
        interface_name=delivery_request.interface_name
    )
    
    return DeliveryResponse(
        status="accepted",
        message="Delivery process started",
        delivery_id=str(delivery_id)
    )

@app.get("/api/delivery/status/{delivery_id}", response_model=DeliveryResponse, tags=["Delivery Control"])
async def get_delivery_status(delivery_id: str):
    """
    Get the status of a specific delivery.
    
    - **delivery_id**: The ID of the delivery to check
    
    Returns the current status of the delivery.
    """
    try:
        delivery_id_int = int(delivery_id)
        if delivery_id_int in delivery_status:
            status = delivery_status[delivery_id_int]
            return DeliveryResponse(
                status=status,
                message=f"Delivery {delivery_id} is {status}",
                delivery_id=delivery_id
            )
        else:
            raise HTTPException(status_code=404, detail=f"Delivery {delivery_id} not found")
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid delivery ID format")

@app.get("/api/health", tags=["System"])
async def health_check():
    """
    Simple health check endpoint.
    
    Returns OK status if the API is running.
    """
    return {"status": "OK", "message": "API is running"}

if __name__ == "__main__":
    # Get port from command line arguments or use default 8000
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8001
    
    print(f"Starting Robot Delivery API on port {port}")
    print(f"Access Swagger documentation at http://localhost:{port}/docs")
    
    # Check if the delivery script exists
    if not os.path.isfile("deliver_return.py"):
        print("WARNING: deliver_return.py not found in the current directory.")
        print("Make sure the delivery script is in the same directory as this API.")
    
    # Run the FastAPI app
    uvicorn.run(app, host="0.0.0.0", port=port)