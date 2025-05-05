# Robot Delivery API

This repository contains a FastAPI server for controlling the Unitree Go2 robot delivery process.

## Prerequisites

- Python 3.8 or higher
- Unitree SDK for Python
- Network connection to the Unitree Go2 robot

## Installation

2. Install the required Python packages:

```bash
pip install fastapi uvicorn pydantic
```

3. Install the Unitree SDK:

```bash
# Install Unitree SDK dependencies
sudo apt-get install build-essential cmake git

# Clone the Unitree SDK repository
git clone https://github.com/unitreerobotics/unitree_sdk2.git

# Build and install the SDK
cd unitree_sdk2
mkdir build
cd build
cmake ..
make
sudo make install

# Install the Python bindings
cd ../python
pip install -e .
```

## Configuration

Before running the server, ensure:

1. Your robot is powered on and connected to the same network as your computer
2. You have identified the correct network interface (e.g., `en7`, `eth0`, `wlan0`) to communicate with the robot

You can check your network interfaces with:

```bash
ifconfig
# or
ip addr
```

## Running the Server

Start the API server with:

```bash
python api_server.py [PORT]
```

Where:
- `[PORT]` is optional (default: 8001)

The server will start and you can access:
- API documentation: http://localhost:8001/docs
- Health check: http://localhost:8001/api/health

## API Endpoints

- `POST /api/delivery/start`: Start a new delivery process
- `GET /api/delivery/status/{delivery_id}`: Check delivery status
- `GET /api/health`: Health check endpoint

## Example Usage

Start a delivery:

```bash
curl -X POST "http://localhost:8001/api/delivery/start" \
  -H "Content-Type: application/json" \
  -d '{"interface_name": "eth0", "description": "Test delivery"}'
```

Check status:

```bash
curl "http://localhost:8001/api/delivery/status/1"
```

## Troubleshooting

- If you encounter "Module not found" errors related to `unitree_sdk2py`, ensure the SDK is properly installed.
- If the robot doesn't respond, check your network connection and verify the correct interface name.
- Ensure `deliver_return.py` is in the same directory as `api_server.py`.

## Robot Control Commands

For manual control of the robot, you can use the robot control script directly:

```bash
python robot_control.py <interface_name> <command_id> [additional_args]
```

Example:
```bash
# Make the robot stand up
python robot_control.py eth0 1

# Move forward 2 meters
python robot_control.py eth0 20 2
```

Run the script without arguments to see all available commands:
```bash
python robot_control.py
```