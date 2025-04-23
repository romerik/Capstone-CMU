// src/pages/RobotTracker.jsx
import { useState, useEffect, useRef } from 'react';
import { 
  FaRobot, 
  FaBatteryHalf, 
  FaStop, 
  FaHome, 
  FaExclamationTriangle, 
  FaBolt, 
  FaPlay,
  FaPause,
  FaMapMarkerAlt
} from 'react-icons/fa';
import RobotMap from '../components/Map';
import LoadingSpinner from '../components/LoadingSpinner';

// API configuration - replace with your actual API endpoints
const API_URL = 'https://api.example.com';

const RobotTracker = () => {
  const [robotStatus, setRobotStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [activeTab, setActiveTab] = useState('status');
  const [simulationActive, setSimulationActive] = useState(false);
  const [deliveryCompleted, setDeliveryCompleted] = useState(false);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const simulationInterval = useRef(null);
  const statusInterval = useRef(null);
  
  // Delivery points (in a real app, these would come from the API)
  const [deliveryPoints, setDeliveryPoints] = useState({
    start: {
      latitude: 48.8566,
      longitude: 2.3522,
      name: "Coffee Robot Depot"
    },
    end: {
      latitude: 48.8606,
      longitude: 2.3376,
      name: "Customer Location"
    }
  });
  
  useEffect(() => {
    // Load initial robot status
    updateRobotStatus();
    
    // Update status every 10 seconds if not in simulation mode
    statusInterval.current = setInterval(() => {
      if (!simulationActive) {
        updateRobotStatus();
      }
    }, 10000);
    
    return () => {
      if (statusInterval.current) {
        clearInterval(statusInterval.current);
      }
      if (simulationInterval.current) {
        clearInterval(simulationInterval.current);
      }
    };
  }, [simulationActive]);
  
  const updateRobotStatus = async () => {
    setIsLoading(prevLoading => !robotStatus || prevLoading);
    setErrorMessage('');
    
    try {
      // In a real app, fetch from API: const response = await fetch(`${API_URL}/robot/status`);
      // For demo, use simulated data
      const status = mockRobotStatusAPI();
      setRobotStatus(status);
    } catch (error) {
      console.error('Error fetching robot status:', error);
      setErrorMessage('Failed to fetch robot status. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCommand = async (command) => {
    try {
      // In a real app: const response = await fetch(`${API_URL}/robot/command`, { method: 'POST', body: JSON.stringify({ command }) });
      // For demo, simulate API response
      const result = mockCommandAPI(command);
      
      if (result.success) {
        setSuccessMessage(result.message);
        setTimeout(() => setSuccessMessage(''), 3000);
        
        // Handle special commands
        if (command === 'start_simulation') {
          startSimulation();
        } else if (command === 'stop_simulation') {
          stopSimulation();
          setCompletionPercentage(0); // Reset to 0 when stopping
        } else if (command === 'emergency' || command === 'stop') {
          stopSimulation();
          setCompletionPercentage(0);
        } else if (command === 'return') {
          setDeliveryCompleted(true);
        }
      } else {
        setErrorMessage(result.error || 'Command failed. Please try again.');
      }
      
    } catch (error) {
      console.error('Error sending command:', error);
      setErrorMessage('Failed to send command. Please try again.');
    }
  };
  
  const startSimulation = () => {
    // Clear any existing simulation
    if (simulationInterval.current) {
      clearInterval(simulationInterval.current);
    }
    
    setSimulationActive(true);
    setDeliveryCompleted(false);
    setCompletionPercentage(0);
    
    // Update completion percentage every 300ms
    simulationInterval.current = setInterval(() => {
      setCompletionPercentage(prev => {
        // Log for debugging
        console.log("Current percentage:", prev);
        
        const newValue = prev + 1;
        if (newValue >= 100) {
          // When complete, clear interval and mark as completed
          clearInterval(simulationInterval.current);
          simulationInterval.current = null;
          setDeliveryCompleted(true);
          setSimulationActive(false);
          return 100;
        }
        return newValue;
      });
    }, 300); // Speed of simulation - 300ms increments
  };
  
  const stopSimulation = () => {
    if (simulationInterval.current) {
      clearInterval(simulationInterval.current);
      simulationInterval.current = null;
    }
    setSimulationActive(false);
  };
  
  const pauseSimulation = () => {
    if (simulationInterval.current) {
      clearInterval(simulationInterval.current);
      simulationInterval.current = null;
    }
    setSimulationActive(false);
  };
  
  const resumeSimulation = () => {
    if (completionPercentage < 100) {
      setSimulationActive(true);
      
      // Make sure any existing interval is cleared first
      if (simulationInterval.current) {
        clearInterval(simulationInterval.current);
      }
      
      simulationInterval.current = setInterval(() => {
        setCompletionPercentage(prev => {
          const newValue = prev + 1;
          if (newValue >= 100) {
            clearInterval(simulationInterval.current);
            simulationInterval.current = null;
            setDeliveryCompleted(true);
            setSimulationActive(false);
            return 100;
          }
          return newValue;
        });
      }, 300);
    }
  };
  
  // Determine status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'delivering':
        return 'text-blue-500';
      case 'returning':
        return 'text-yellow-500';
      case 'idle':
        return 'text-green-500';
      case 'charging':
        return 'text-purple-500';
      case 'emergency':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };
  
  // Translate status to English
  const getStatusText = (status) => {
    switch (status) {
      case 'delivering':
        return 'Delivering';
      case 'returning':
        return 'Returning to depot';
      case 'idle':
        return 'Standby';
      case 'charging':
        return 'Charging';
      case 'emergency':
        return 'Emergency mode';
      default:
        return 'Unknown';
    }
  };
  
  // Determine battery color
  const getBatteryColor = (level) => {
    if (level > 70) return 'text-green-500';
    if (level > 30) return 'text-yellow-500';
    return 'text-red-500';
  };
  
  // Mock API responses for demo
  const mockRobotStatusAPI = () => {
    // Generate position based on simulation progress if active
    let latitude, longitude;
    
    if (simulationActive || completionPercentage > 0) {
      // Interpolate between start and end based on completion percentage
      const progress = completionPercentage / 100;
      latitude = deliveryPoints.start.latitude + (deliveryPoints.end.latitude - deliveryPoints.start.latitude) * progress;
      longitude = deliveryPoints.start.longitude + (deliveryPoints.end.longitude - deliveryPoints.start.longitude) * progress;
      
      // Log position for debugging
      console.log("Calculated position:", { latitude, longitude, progress });
    } else {
      // Default position at depot
      latitude = deliveryPoints.start.latitude;
      longitude = deliveryPoints.start.longitude;
    }
    
    // Determine status based on simulation
    let status = 'idle';
    if (simulationActive || (completionPercentage > 0 && completionPercentage < 100)) {
      status = 'delivering';
    } else if (deliveryCompleted) {
      status = 'returning';
    }
    
    return {
      id: 'RBT-1234',
      status: status,
      batteryLevel: 75 - Math.floor(completionPercentage / 4), // Battery decreases during delivery
      location: {
        latitude: latitude,
        longitude: longitude
      },
      speed: simulationActive ? 5 + Math.floor(Math.random() * 3) : 0, // km/h
      lastUpdated: new Date().toISOString(),
      estimatedTimeMinutes: Math.max(1, Math.floor((100 - completionPercentage) / 10)),
      currentOrder: simulationActive || completionPercentage > 0 ? 'ORD-7890' : null,
      destination: deliveryPoints.end
    };
  };
  
  const mockCommandAPI = (command) => {
    // Simulate API response
    switch (command) {
      case 'start_simulation':
        return { 
          success: true, 
          message: 'Delivery simulation started' 
        };
      case 'stop_simulation':
        return { 
          success: true, 
          message: 'Simulation stopped' 
        };
      case 'stop':
        return { 
          success: true, 
          message: 'Robot has been stopped successfully' 
        };
      case 'return':
        return { 
          success: true, 
          message: 'Robot is now returning to depot' 
        };
      case 'emergency':
        return { 
          success: true, 
          message: 'Emergency protocol activated' 
        };
      case 'recharge':
        return { 
          success: true, 
          message: 'Robot will proceed to nearest charging station' 
        };
      default:
        return { 
          success: false, 
          error: 'Unknown command' 
        };
    }
  };
  
  return (
    <div className="py-6 mt-24">
      <h1 className="text-4xl font-bold text-coffee-dark mb-6">Delivery Tracking</h1>
      
      {successMessage && (
        <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative animate-pulse">
          {successMessage}
        </div>
      )}
      
      {errorMessage && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative animate-pulse">
          {errorMessage}
        </div>
      )}
      
      {/* Simulation controls */}
      <div className="mb-6 hidden bg-white rounded-lg shadow-md p-4 border border-coffee-latte">
        <h2 className="font-semibold text-lg mb-2">Delivery Simulation</h2>
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1 w-full">
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                    Progress
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-blue-600">
                    {completionPercentage}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                <div 
                  style={{ width: `${completionPercentage}%` }} 
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-300"
                ></div>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            {!simulationActive && completionPercentage === 0 && (
              <button
                onClick={() => handleCommand('start_simulation')}
                className="flex items-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              >
                <FaPlay className="mr-2" />
                Start Simulation
              </button>
            )}
            
            {simulationActive && (
              <button
                onClick={() => pauseSimulation()}
                className="flex items-center px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
              >
                <FaPause className="mr-2" />
                Pause
              </button>
            )}
            
            {!simulationActive && completionPercentage > 0 && completionPercentage < 100 && (
              <button
                onClick={() => resumeSimulation()}
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                <FaPlay className="mr-2" />
                Resume
              </button>
            )}
            
            {(simulationActive || completionPercentage > 0) && (
              <button
                onClick={() => handleCommand('stop_simulation')}
                className="flex items-center px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                <FaStop className="mr-2" />
                Reset
              </button>
            )}
          </div>
        </div>
        
        {/* Debug info - remove in production */}
        <div className="mt-3 text-xs text-gray-500">
          Simulation Active: {simulationActive ? 'Yes' : 'No'} | 
          Completion: {completionPercentage}% | 
          Delivery Completed: {deliveryCompleted ? 'Yes' : 'No'}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map tracking area */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md border border-coffee-latte overflow-hidden">
            <div className="p-4 bg-coffee-dark text-white flex justify-between items-center">
              <div className="flex items-center">
                <FaMapMarkerAlt className="mr-2" />
                <h2 className="font-semibold">Robot Location</h2>
              </div>
              <div>
                <button 
                  onClick={updateRobotStatus} 
                  className="text-sm bg-white text-coffee-dark px-3 py-1 rounded hover:bg-gray-100 transition-colors"
                  disabled={simulationActive}
                >
                  Refresh
                </button>
              </div>
            </div>
            
            <div className="h-[500px]">
              {isLoading && !robotStatus ? (
                <div className="h-full flex items-center justify-center">
                  <LoadingSpinner size="large" />
                </div>
              ) : (
                <RobotMap 
                  robotStatus={robotStatus}
                  pathVisible={true}
                  startPoint={deliveryPoints.start}
                  endPoint={deliveryPoints.end}
                  simulateMovement={true}
                  completionPercentage={completionPercentage}
                  isDeliveryCompleted={deliveryCompleted}
                />
              )}
            </div>
          </div>
        </div>
        
        {/* Robot information panel */}
        <div>
          <div className="bg-white rounded-lg shadow-md border border-coffee-latte overflow-hidden sticky top-6">
            <div className="p-4 bg-coffee-dark text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FaRobot className="mr-2" />
                  <h2 className="font-semibold">Robot Status</h2>
                </div>
                {robotStatus && (
                  <div className="text-xs bg-white text-coffee-dark px-2 py-1 rounded">
                    ID: {robotStatus.id}
                  </div>
                )}
              </div>
            </div>
            
            {/* Tab navigation */}
            <div className="flex border-b border-coffee-latte">
              <button 
                className={`flex-1 py-2 px-4 text-sm font-medium ${activeTab === 'status' ? 'text-coffee-dark border-b-2 border-coffee-dark' : 'text-gray-500 hover:text-coffee-dark'}`}
                onClick={() => setActiveTab('status')}
              >
                Status
              </button>
              <button 
                className={`flex-1 py-2 px-4 text-sm font-medium ${activeTab === 'controls' ? 'text-coffee-dark border-b-2 border-coffee-dark' : 'text-gray-500 hover:text-coffee-dark'}`}
                onClick={() => setActiveTab('controls')}
              >
                Controls
              </button>
            </div>
            
            <div className="p-4">
              {isLoading && !robotStatus ? (
                <div className="h-40 flex items-center justify-center">
                  <LoadingSpinner size="medium" />
                </div>
              ) : robotStatus ? (
                <div>
                  {/* Status Tab */}
                  {activeTab === 'status' && (
                    <div className="space-y-4">
                      {/* Status */}
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Status</div>
                        <div className="flex items-center">
                          <div className={`h-3 w-3 rounded-full ${
                            getStatusColor(robotStatus.status).replace('text', 'bg')
                          } mr-2`}></div>
                          <span className={`font-medium ${getStatusColor(robotStatus.status)}`}>
                            {getStatusText(robotStatus.status)}
                          </span>
                        </div>
                      </div>
                      
                      {/* Battery */}
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Battery Level</div>
                        <div className="flex items-center">
                          <FaBatteryHalf className={`mr-2 ${getBatteryColor(robotStatus.batteryLevel)}`} />
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${
                                robotStatus.batteryLevel > 70 ? 'bg-green-500' :
                                robotStatus.batteryLevel > 30 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${robotStatus.batteryLevel}%` }}
                            ></div>
                          </div>
                          <span className={`ml-2 font-medium ${getBatteryColor(robotStatus.batteryLevel)}`}>
                            {robotStatus.batteryLevel}%
                          </span>
                        </div>
                      </div>
                      
                      {/* GPS Coordinates */}
                      <div>
                        <div className="text-sm text-gray-500 mb-1">GPS Coordinates</div>
                        <div className="text-coffee-dark font-mono text-sm">
                          Lat: {robotStatus.location.latitude.toFixed(6)}<br />
                          Long: {robotStatus.location.longitude.toFixed(6)}
                        </div>
                      </div>
                      
                      {/* Current Order */}
                      {robotStatus.currentOrder && (
                        <div>
                          <div className="text-sm text-gray-500 mb-1">Current Order</div>
                          <div className="text-coffee-dark font-medium">
                            {robotStatus.currentOrder}
                          </div>
                        </div>
                      )}
                      
                      {/* Speed */}
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Speed</div>
                        <div className="text-coffee-dark font-medium">
                          {robotStatus.speed} km/h
                        </div>
                      </div>
                      
                      {/* Estimated arrival */}
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Estimated Arrival Time</div>
                        <div className="text-coffee-dark font-medium">
                          {robotStatus.estimatedTimeMinutes} minutes
                        </div>
                      </div>
                      
                      {/* Delivery destination */}
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Destination</div>
                        <div className="text-coffee-dark">
                          {robotStatus.destination?.name || 'No destination set'}
                        </div>
                      </div>
                      
                      {/* Last updated */}
                      <div className="text-xs text-gray-500 mt-4">
                        Last updated: {new Date(robotStatus.lastUpdated).toLocaleString()}
                      </div>
                    </div>
                  )}
                  
                  {/* Controls Tab */}
                  {activeTab === 'controls' && (
                    <div className="space-y-4">
                      <div className="text-sm font-medium text-coffee-dark mb-2">Quick Actions</div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => handleCommand('stop')}
                          className="flex items-center justify-center space-x-1 bg-red-100 text-red-600 py-2 px-3 rounded hover:bg-red-200 transition-colors"
                          disabled={simulationActive && completionPercentage === 0}
                        >
                          <FaStop size={12} />
                          <span>Stop</span>
                        </button>
                        <button
                          onClick={() => handleCommand('return')}
                          className="flex items-center justify-center space-x-1 bg-yellow-100 text-yellow-600 py-2 px-3 rounded hover:bg-yellow-200 transition-colors"
                          disabled={simulationActive && completionPercentage === 0}
                        >
                          <FaHome size={12} />
                          <span>Return</span>
                        </button>
                        <button
                          onClick={() => handleCommand('emergency')}
                          className="flex items-center justify-center space-x-1 bg-orange-100 text-orange-600 py-2 px-3 rounded hover:bg-orange-200 transition-colors"
                        >
                          <FaExclamationTriangle size={12} />
                          <span>Emergency</span>
                        </button>
                        <button
                          onClick={() => handleCommand('recharge')}
                          className="flex items-center justify-center space-x-1 bg-purple-100 text-purple-600 py-2 px-3 rounded hover:bg-purple-200 transition-colors"
                          disabled={simulationActive}
                        >
                          <FaBolt size={12} />
                          <span>Recharge</span>
                        </button>
                      </div>
                      
                      <div className="mt-4 text-xs text-gray-500 bg-yellow-50 p-3 rounded border border-yellow-200">
                        <strong>Note:</strong> In a real environment, these commands would be sent to the actual robot through the API.
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Unable to retrieve robot information
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RobotTracker;