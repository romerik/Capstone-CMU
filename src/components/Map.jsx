// src/components/RobotMap.jsx
import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for Leaflet marker icons in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Custom robot icon
const createRobotIcon = () => {
  return L.divIcon({
    className: 'robot-marker',
    html: `
      <div class="p-2 rounded-full bg-blue-500 text-white shadow-lg animate-pulse flex items-center justify-center" style="width: 40px; height: 40px;">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
          <path d="M6 12.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5M3 8.062C3 6.76 4.235 5.765 5.53 5.886a26.58 26.58 0 0 0 4.94 0C11.765 5.765 13 6.76 13 8.062v1.157a.933.933 0 0 1-.765.935c-.845.147-2.34.346-4.235.346-1.895 0-3.39-.2-4.235-.346A.933.933 0 0 1 3 9.219zm4.542-.827a.25.25 0 0 0-.217.068l-.92.9a24.767 24.767 0 0 1-1.871-.183.25.25 0 0 0-.068.495c.55.076 1.232.149 2.02.193a.25.25 0 0 0 .189-.071l.754-.736.847 1.71a.25.25 0 0 0 .404.062l.932-.97a25.286 25.286 0 0 0 1.922-.188.25.25 0 0 0-.068-.495c-.538.074-1.207.145-1.98.189a.25.25 0 0 0-.166.076l-.754.785-.842-1.7a.25.25 0 0 0-.182-.135"/>
          <path d="M8.5 1.866a1 1 0 1 0-1 0V3h-2A4.5 4.5 0 0 0 1 7.5V8a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1v1a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1v-.5A4.5 4.5 0 0 0 10.5 3h-2zM2 7.5A3.5 3.5 0 0 1 5.5 4h5A3.5 3.5 0 0 1 14 7.5v5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 12.5zm13-1a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1z"/>
        </svg>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20]
  });
};

// Custom destination icon
const createDestinationIcon = () => {
  return L.divIcon({
    className: 'destination-marker',
    html: `
      <div class="p-2 rounded-full bg-green-500 text-white shadow-lg flex items-center justify-center" style="width: 36px; height: 36px;">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6"/>
        </svg>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18]
  });
};

// Custom depot icon
const createDepotIcon = () => {
  return L.divIcon({
    className: 'depot-marker',
    html: `
      <div class="p-2 rounded-full bg-coffee-dark text-white shadow-lg flex items-center justify-center" style="width: 36px; height: 36px;">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M2.97 1.35A1 1 0 0 1 3.73 1h8.54a1 1 0 0 1 .76.35l2.609 3.044A1.5 1.5 0 0 1 16 5.37v.255a2.375 2.375 0 0 1-4.25 1.458A2.371 2.371 0 0 1 9.875 8 2.37 2.37 0 0 1 8 7.083 2.37 2.37 0 0 1 6.125 8a2.37 2.37 0 0 1-1.875-.917A2.375 2.375 0 0 1 0 5.625V5.37a1.5 1.5 0 0 1 .361-.976l2.61-3.045zm1.78 4.275a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 1 0 2.75 0V5.37a.5.5 0 0 0-.12-.325L12.27 2H3.73L1.12 5.045A.5.5 0 0 0 1 5.37v.255a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0M1.5 8.5A.5.5 0 0 1 2 9v6h12V9a.5.5 0 0 1 1 0v6h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1V9a.5.5 0 0 1 .5-.5m2 .5a.5.5 0 0 1 .5.5V13h8V9.5a.5.5 0 0 1 1 0V13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5a.5.5 0 0 1 .5-.5"/>
        </svg>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18]
  });
};

const RobotMap = ({ 
  robotStatus, 
  locationHistory = [], 
  pathVisible = true,
  startPoint = null, // Starting point (depot) coordinates
  endPoint = null,   // Destination coordinates 
  simulateMovement = false, // Whether to simulate robot movement
  completionPercentage = 0, // Progress along the route (0-100)
  isDeliveryCompleted = false // Whether delivery is completed
}) => {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const robotMarkerRef = useRef(null);
  const destinationMarkerRef = useRef(null);
  const depotMarkerRef = useRef(null);
  const pathLayerRef = useRef(null);
  const simulatedPathRef = useRef(null);
  const animationRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);
  const [routePoints, setRoutePoints] = useState([]);
  const [simulationProgress, setSimulationProgress] = useState(0);

  // Initialize map when component mounts
  useEffect(() => {
    if (!mapRef.current && mapContainer.current) {
      initializeMap();
    }
    
    // Cleanup on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Generate route when start and end points change
  useEffect(() => {
    if (mapRef.current && mapReady && startPoint && endPoint) {
      generateRoute(startPoint, endPoint);
    }
  }, [startPoint, endPoint, mapReady]);

  // Update robot position based on simulation or actual data
  useEffect(() => {
    if (mapRef.current && mapReady && routePoints.length > 0) {
      if (simulateMovement) {
        // Use provided completion percentage for simulation
        const progress = completionPercentage || simulationProgress;
        updateRobotPositionSimulation(progress);
      } else if (robotStatus) {
        // Use actual robot status
        updateRobotMarker(robotStatus.location);
      }
    }
  }, [robotStatus, simulateMovement, completionPercentage, simulationProgress, routePoints, mapReady]);

  // Handle delivery completion
  useEffect(() => {
    if (isDeliveryCompleted && mapRef.current && robotMarkerRef.current) {
      // Return robot to depot when delivery is completed
      if (startPoint) {
        const returnPath = [...routePoints].reverse();
        animateReturnToDepot(returnPath);
      }
    }
  }, [isDeliveryCompleted]);

  const initializeMap = () => {
    // Default coordinates if not provided
    const initialLat = startPoint?.latitude || 48.8566;
    const initialLng = startPoint?.longitude || 2.3522;
    
    // Create map
    mapRef.current = L.map(mapContainer.current, {
      center: [initialLat, initialLng],
      zoom: 14,
      layers: [
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        })
      ]
    });
    
    // Add scale control
    L.control.scale({ imperial: false }).addTo(mapRef.current);
    
    // Create path layer for the route
    pathLayerRef.current = L.polyline([], {
      color: '#4B2E2B',
      weight: 3,
      opacity: 0.8,
      lineJoin: 'round'
    }).addTo(mapRef.current);

    // Create simulated path layer (completed portion)
    simulatedPathRef.current = L.polyline([], {
      color: '#82ca9d',
      weight: 4,
      opacity: 1,
      lineJoin: 'round'
    }).addTo(mapRef.current);
    
    setMapReady(true);
  };

  const generateRoute = (start, end) => {
    // In a real app, you would use a routing API
    // For this demo, we'll create a direct line with intermediate points
    
    const startLatLng = [start.latitude, start.longitude];
    const endLatLng = [end.latitude, end.longitude];
    
    // Create some waypoints between start and end
    const points = createIntermediatePoints(startLatLng, endLatLng, 10);
    setRoutePoints(points);
    
    // Update path layer with the route
    pathLayerRef.current.setLatLngs(points);
    
    // Add start marker (depot)
    if (!depotMarkerRef.current) {
      depotMarkerRef.current = L.marker(startLatLng, { 
        icon: createDepotIcon() 
      })
        .bindPopup('<div><strong>Robot Depot</strong><br/>Starting Point</div>')
        .addTo(mapRef.current);
    } else {
      depotMarkerRef.current.setLatLng(startLatLng);
    }
    
    // Add end marker (destination)
    if (!destinationMarkerRef.current) {
      destinationMarkerRef.current = L.marker(endLatLng, { 
        icon: createDestinationIcon() 
      })
        .bindPopup(`<div><strong>Destination</strong><br/>${end.name || 'Delivery Point'}</div>`)
        .addTo(mapRef.current);
    } else {
      destinationMarkerRef.current.setLatLng(endLatLng);
    }
    
    // Fit map to show the route
    const bounds = L.latLngBounds([startLatLng, endLatLng]);
    mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    
    // Add robot at start point
    updateRobotMarker({ latitude: start.latitude, longitude: start.longitude });
    
    // Start simulation if enabled
    if (simulateMovement && completionPercentage === 0) {
      startSimulation();
    }
  };
  
  const createIntermediatePoints = (start, end, numPoints) => {
    const points = [];
    
    // Add starting point
    points.push(start);
    
    // Add some randomness to make the route look more natural
    const deltaLat = end[0] - start[0];
    const deltaLng = end[1] - start[1];
    
    for (let i = 1; i < numPoints; i++) {
      const ratio = i / numPoints;
      
      // Add slight random variation
      const randomLat = (Math.random() - 0.5) * 0.001;
      const randomLng = (Math.random() - 0.5) * 0.001;
      
      const lat = start[0] + deltaLat * ratio + randomLat;
      const lng = start[1] + deltaLng * ratio + randomLng;
      
      points.push([lat, lng]);
    }
    
    // Add end point
    points.push(end);
    
    return points;
  };
  
  const updateRobotMarker = (location) => {
    if (!mapRef.current) return;
    
    const lat = location.latitude;
    const lng = location.longitude;
    
    // If marker doesn't exist, create it
    if (!robotMarkerRef.current) {
      robotMarkerRef.current = L.marker([lat, lng], { 
        icon: createRobotIcon(),
        zIndexOffset: 1000 // Make sure robot is above other markers
      })
        .bindPopup(`
          <div>
            <strong>Delivery Robot</strong>
            <br/>
            ID: ${robotStatus?.id || 'RBT-1234'}
          </div>
        `)
        .addTo(mapRef.current);
    } else {
      // Update existing marker position
      robotMarkerRef.current.setLatLng([lat, lng]);
    }
    
    // Update popup content if robot status exists
    if (robotStatus) {
      robotMarkerRef.current.setPopupContent(`
        <div>
          <strong>Delivery Robot</strong>
          <br/>
          ID: ${robotStatus.id || 'RBT-1234'}
          <br/>
          Status: ${robotStatus.status || 'Active'}
        </div>
      `);
    }
  };
  
  const updateRobotPositionSimulation = (progress) => {
    if (!mapRef.current || routePoints.length === 0) return;
    
    // Calculate index based on progress
    const index = Math.min(
      Math.floor((routePoints.length - 1) * (progress / 100)),
      routePoints.length - 1
    );
    
    // Get position
    const position = routePoints[index];
    
    // Update robot marker
    if (robotMarkerRef.current) {
      robotMarkerRef.current.setLatLng(position);
    } else {
      robotMarkerRef.current = L.marker(position, { 
        icon: createRobotIcon(),
        zIndexOffset: 1000
      })
        .bindPopup(`
          <div>
            <strong>Delivery Robot</strong>
            <br/>
            ID: ${robotStatus?.id || 'RBT-1234'}
            <br/>
            Progress: ${Math.round(progress)}%
          </div>
        `)
        .addTo(mapRef.current);
    }
    
    // Update the completed path portion
    const completedPath = routePoints.slice(0, index + 1);
    simulatedPathRef.current.setLatLngs(completedPath);
    
    // Center map on robot with smooth animation
    mapRef.current.setView(position, mapRef.current.getZoom(), {
      animate: true,
      duration: 0.5
    });
  };
  
  const startSimulation = () => {
    let progress = 0;
    let lastTimestamp = 0;
    const duration = 30000; // 30 seconds for full route
    
    const animate = (timestamp) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const elapsed = timestamp - lastTimestamp;
      
      // Update progress
      progress += (elapsed / duration) * 100;
      
      if (progress <= 100) {
        setSimulationProgress(progress);
        lastTimestamp = timestamp;
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setSimulationProgress(100);
      }
    };
    
    animationRef.current = requestAnimationFrame(animate);
  };
  
  const animateReturnToDepot = (path) => {
    if (!path || path.length === 0) return;
    
    let step = 0;
    const totalSteps = path.length;
    const interval = 500; // milliseconds between steps
    
    const moveRobot = () => {
      if (step < totalSteps) {
        // Update robot position
        if (robotMarkerRef.current) {
          robotMarkerRef.current.setLatLng(path[step]);
        }
        
        // Update completed path
        simulatedPathRef.current.setLatLngs(path.slice(0, step + 1));
        
        step++;
        setTimeout(moveRobot, interval);
      }
    };
    
    // Start animation
    moveRobot();
  };
  
  return (
    <div className="relative h-full">
      <div ref={mapContainer} className="h-full w-full" />
      
      {/* Map loading fallback */}
      {!mapReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-70">
          <div className="text-center p-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coffee-dark mx-auto"></div>
            <p className="mt-2 text-coffee-dark">Loading map...</p>
          </div>
        </div>
      )}
      
      {/* Simulation progress indicator */}
      {simulateMovement && mapReady && (
        <div className="absolute top-4 right-4 bg-white p-3 rounded shadow-md z-[1000]">
          <div className="text-sm font-medium mb-1">Delivery Progress</div>
          <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500 transition-all duration-500"
              style={{ width: `${completionPercentage || simulationProgress}%` }}
            ></div>
          </div>
          <div className="text-xs mt-1 text-right">
            {Math.round(completionPercentage || simulationProgress)}%
          </div>
        </div>
      )}
      
      {/* Map legend */}
      <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 p-2 rounded shadow-md text-xs z-[1000]">
        <div className="flex items-center mb-1">
          <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
          <span>Robot</span>
        </div>
        <div className="flex items-center mb-1">
          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
          <span>Destination</span>
        </div>
        <div className="flex items-center mb-1">
          <div className="w-3 h-3 rounded-full bg-coffee-dark mr-2"></div>
          <span>Depot</span>
        </div>
        <div className="flex items-center mb-1">
          <div className="w-6 h-1 bg-coffee-dark mr-2"></div>
          <span>Planned Route</span>
        </div>
        <div className="flex items-center">
          <div className="w-6 h-1 bg-green-500 mr-2"></div>
          <span>Completed Path</span>
        </div>
      </div>
    </div>
  );
};

export default RobotMap;