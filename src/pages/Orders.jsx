// src/pages/Orders.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaTrash, FaPlus, FaMinus, FaArrowLeft, FaCreditCard, FaClock, FaMapMarkerAlt, FaExclamationCircle, FaBuilding, FaChair, FaHome } from 'react-icons/fa';
import { getCartItems, updateQuantity, removeFromCart, placeOrder } from '../utils/orders';

const Orders = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [customAddress, setCustomAddress] = useState('');
  const [deliveryError, setDeliveryError] = useState('');
  const [showLocationError, setShowLocationError] = useState(false);

  useEffect(() => {
    
    
   const updateCar = () => {
      const cartItems = getCartItems();
      setCartItems(cartItems);
    };
    
    // Vérification périodique
    const intervalId = setInterval(updateCar, 1000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, []);
  
  const locations = [
    {"label": "Office 1", "value": "Office 1", "icon": <FaBuilding />},
    {"label": "Office 2", "value": "Office 2", "icon": <FaBuilding />},
    {"label": "Office 3", "value": "Office 3", "icon": <FaBuilding />},
    {"label": "Office 4", "value": "Office 4", "icon": <FaBuilding />},
    {"label": "Office 5", "value": "Office 5", "icon": <FaBuilding />},
    {"label": "Counter", "value": "Counter", "icon": <FaChair />},
    {"label": "Outdoor Patio", "value": "Outdoor Patio", "icon": <FaChair />},
    {"label": "Delivery", "value": "Delivery", "icon": <FaHome />}
  ];
  
  useEffect(() => {
    // Load cart items
    const items = getCartItems();
    setCartItems(items);
  }, []);
  
  const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const deliveryFee = selectedLocation === 'Delivery' ? 2.50 : 0;
  const taxes = totalPrice * 0.2;
  const orderTotal = totalPrice + deliveryFee + taxes;
  
  const handleUpdateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveItem(itemId);
      return;
    }
    
    const updatedCart = updateQuantity(itemId, newQuantity);
    setCartItems(updatedCart);
  };
  
  const handleRemoveItem = (itemId) => {
    const updatedCart = removeFromCart(itemId);
    setCartItems(updatedCart);
  };
  
  const validateOrder = () => {
    // Reset errors
    setDeliveryError('');
    setShowLocationError(false);
    
    // Check if location is selected
    if (!selectedLocation) {
      setShowLocationError(true);
      return false;
    }
    
    // Validate delivery address if delivery is selected
    if (selectedLocation === 'Delivery') {
      if (!customAddress.trim()) {
        setDeliveryError('Please enter your delivery address');
        return false;
      }
      
      // Basic validation for address format
      if (customAddress.trim().length < 10) {
        setDeliveryError('Please enter a complete address');
        return false;
      }
    }
    
    return true;
  };
  
  const handlePlaceOrder = () => {
    // Check if cart is empty
    if (cartItems.length === 0) {
      return;
    }
    
    // Validate order details
    if (!validateOrder()) {
      // Scroll to the location section if there's an error
      document.getElementById('location-section').scrollIntoView({ behavior: 'smooth' });
      return;
    }
    
    setIsLoading(true);
    
    // Prepare delivery details
    const deliveryDetails = {
      location: selectedLocation,
      address: selectedLocation === 'Delivery' ? customAddress : null,
      instructions: document.getElementById('delivery-instructions')?.value || ''
    };
    
    // Simulate processing delay
    // setTimeout(() => {
    //   const result = placeOrder(deliveryDetails);
      
    //   if (result.success) {
    //     navigate('/robot');
    //   } else {
    //     alert(result.message || 'An error occurred. Please try again.');
    //     setIsLoading(false);
    //   }
    // }, 1000);
    // const result = placeOrder(deliveryDetails);
    fetch('https://2e19-41-216-98-178.ngrok-free.app/api/delivery/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ interface_name: "en7" })
    })
    .then(response => response.json())
    .then(data => {
      console.log('Tracking started:', data)
      setIsLoading(false);
      navigate('/robot');
    })
    .catch(error => console.error('Error starting tracking:', error));
  };
  
  return (
    <div className="bg-[#FFF8F0] min-h-screen mt-24 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/menu')}
            className="mr-3 text-[#2C1A1D] hover:text-[#D7B49E] transition-colors flex items-center"
          >
            <FaArrowLeft className="mr-2" />
          </button>
          <h1 className="text-3xl font-bold text-[#2C1A1D]">Complete Your Order</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 mb-8">
              <div className="p-4 bg-[#2C1A1D] text-white flex items-center">
                <FaShoppingCart className="mr-2 text-[#D7B49E]" />
                <h2 className="font-semibold">Items in Your Cart</h2>
              </div>
              
              {cartItems.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-20 h-20 bg-[#F5F0E8] rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaShoppingCart className="text-[#D7B49E] text-3xl" />
                  </div>
                  <p className="text-gray-500 mb-4">Your cart is empty.</p>
                  <button
                    onClick={() => navigate('/menu')}
                    className="px-6 py-2 bg-[#2C1A1D] text-white rounded-lg hover:bg-[#3E2723] transition-colors"
                  >
                    Return to Menu
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {cartItems.map(item => (
                    <div key={item.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center">
                      <div className="w-20 h-20 bg-[#F5F0E8] rounded-lg overflow-hidden flex-shrink-0">
                        <img 
                          src={item.image || '/images/coffee-items/default.jpg'} 
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = '/images/coffee-items/default.jpg';
                          }}
                        />
                      </div>
                      
                      <div className="sm:ml-4 flex-1 mt-3 sm:mt-0">
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                          <h3 className="font-semibold text-[#2C1A1D]">{item.name}</h3>
                          <span className="font-bold text-[#D7B49E] mt-1 sm:mt-0">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">${item.price.toFixed(2)} per item</p>
                      </div>
                      
                      <div className="flex items-center mt-3 sm:mt-0 sm:ml-6 self-end sm:self-auto">
                        <div className="flex items-center border border-gray-200 rounded-lg bg-[#F5F0E8]">
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            className="px-3 py-1 text-[#2C1A1D] hover:text-[#D7B49E] transition-colors"
                          >
                            <FaMinus size={12} className='cursor-pointer' />
                          </button>
                          <span className="px-3 font-medium">{item.quantity}</span>
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            className="px-3 py-1 text-[#2C1A1D] hover:text-[#D7B49E] transition-colors"
                          >
                            <FaPlus size={12} className='cursor-pointer' />
                          </button>
                        </div>
                        
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="ml-4 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <FaTrash className='cursor-pointer' />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Delivery Location Section */}
            {cartItems.length > 0 && (
              <div id="location-section" className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 mb-8">
                <div className="p-4 bg-[#2C1A1D] text-white flex items-center">
                  <FaMapMarkerAlt className="mr-2 text-[#D7B49E]" />
                  <h2 className="font-semibold">Delivery Location</h2>
                </div>
                
                <div className="p-6">
                  <p className="text-gray-600 mb-4">
                    Please select where you'd like to receive your order:
                  </p>
                  
                  {showLocationError && !selectedLocation && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start">
                      <FaExclamationCircle className="text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                      <p className="text-sm text-red-700">Please select a delivery location</p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
                    {locations.map(location => (
                      <button
                        key={location.value}
                        className={`p-4 rounded-lg border-2 ${
                          selectedLocation === location.value 
                            ? 'border-[#D7B49E] bg-[#D7B49E] bg-opacity-10' 
                            : 'border-gray-200 hover:border-[#D7B49E]'
                        } transition-colors flex flex-col items-center`}
                        onClick={() => {
                          setSelectedLocation(location.value);
                          setShowLocationError(false);
                        }}
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                          selectedLocation === location.value 
                            ? 'bg-[#D7B49E] text-[#2C1A1D]' 
                            : 'bg-[#F5F0E8] text-[#2C1A1D]'
                        }`}>
                          {location.icon}
                        </div>
                        <span className="font-medium text-[#2C1A1D]">{location.label}</span>
                      </button>
                    ))}
                  </div>
                  
                  {/* Delivery Address (only shown if Delivery is selected) */}
                  {selectedLocation === 'Delivery' && (
                    <div className="mt-4">
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                        Delivery Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="address"
                        value={customAddress}
                        onChange={(e) => {
                          setCustomAddress(e.target.value);
                          if (e.target.value.trim()) {
                            setDeliveryError('');
                          }
                        }}
                        placeholder="Enter your full address"
                        className={`w-full px-4 py-3 rounded-lg border ${
                          deliveryError ? 'border-red-500' : 'border-gray-200'
                        } focus:outline-none focus:ring-2 focus:ring-[#D7B49E] focus:border-transparent`}
                      />
                      {deliveryError && (
                        <p className="mt-1 text-sm text-red-600">{deliveryError}</p>
                      )}
                      <p className="mt-2 text-xs text-gray-500">
                        We currently deliver within a 3-mile radius of our location.
                      </p>
                    </div>
                  )}
                  
                  {/* Delivery Instructions */}
                  {selectedLocation && (
                    <div className="mt-4">
                      <label htmlFor="delivery-instructions" className="block text-sm font-medium text-gray-700 mb-2">
                        Delivery Instructions (Optional)
                      </label>
                      <textarea
                        id="delivery-instructions"
                        rows="3"
                        placeholder={selectedLocation === 'Delivery' 
                          ? "Any special instructions for delivery? (e.g., gate code, landmark, etc.)" 
                          : "Any special instructions for your order?"}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#D7B49E] focus:border-transparent"
                      ></textarea>
                    </div>
                  )}
                  
                  {/* Estimated Time */}
                  {selectedLocation && (
                    <div className="mt-6 flex items-center text-sm text-gray-600 bg-[#F5F0E8] p-3 rounded-lg">
                      <FaClock className="mr-2 text-[#D7B49E]" />
                      <span>
                        Estimated {selectedLocation === 'Delivery' ? 'delivery' : 'preparation'} time:
                        <span className="font-medium text-[#2C1A1D] ml-1">
                          {selectedLocation === 'Delivery' ? '25-35 min' : '10-15 min'}
                        </span>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-xl shadow-md overflow-hidden sticky top-24">
              <div className="p-4 bg-[#2C1A1D] text-white">
                <h2 className="font-semibold">Order Summary</h2>
              </div>
              
              <div className="p-6">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Delivery Fee</span>
                    {deliveryFee > 0 ? (
                      <span>${deliveryFee.toFixed(2)}</span>
                    ) : (
                      <span className="text-green-600">Free</span>
                    )}
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Taxes</span>
                    <span>${taxes.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-dashed border-gray-200 pt-3 mt-3 flex justify-between font-bold">
                    <span>Total</span>
                    <span className="text-[#D7B49E]">
                      ${orderTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={handlePlaceOrder}
                  disabled={isLoading || cartItems.length === 0}
                  className={`w-full cursor-pointer bg-[#2C1A1D] text-white py-3 rounded-lg font-medium flex items-center justify-center ${
                    isLoading || cartItems.length === 0
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-[#3E2723]'
                  } transition-colors`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <FaCreditCard className="mr-2" /> Place Order
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => navigate('/menu')}
                  className="w-full mt-3 cursor-pointer border-2 border-[#2C1A1D] text-[#2C1A1D] py-2 rounded-lg hover:bg-[#F5F0E8] transition-colors"
                >
                  Continue Shopping
                </button>
                
                <div className="mt-6 text-xs text-center text-gray-500">
                  By placing your order, you agree to our
                  <a href="#" className="text-[#D7B49E] hover:underline ml-1">Terms of Service</a>
                  <span className="mx-1">and</span>
                  <a href="#" className="text-[#D7B49E] hover:underline">Privacy Policy</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;