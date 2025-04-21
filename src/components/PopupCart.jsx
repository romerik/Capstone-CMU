// src/components/PopupCart.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCartItems, removeFromCart, updateQuantity } from '../utils/orders';
import { FaShoppingCart, FaTrash, FaPlus, FaMinus, FaTimes, FaArrowRight, FaShoppingBag } from 'react-icons/fa';

const PopupCart = ({ isOpen, onClose }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isRemoving, setIsRemoving] = useState(null);
  const [isUpdating, setIsUpdating] = useState(null);
  
  // Calculate total price
  const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  // Load cart items when the popup opens
  useEffect(() => {
    if (isOpen) {
      setCartItems(getCartItems());
    }
  }, [isOpen]);
  
  // Don't render anything if the popup is closed
  if (!isOpen) return null;
  
  const handleQuantityUpdate = (id, newQuantity) => {
    // Prevent negative quantities
    if (newQuantity <= 0) {
      handleRemoveItem(id);
      return;
    }
    
    // Set the updating state for animation
    setIsUpdating(id);
    
    // Update quantity in the cart
    updateQuantity(id, newQuantity);
    
    // Update the local state
    setCartItems(getCartItems());
    
    // Clear the updating state after a delay
    setTimeout(() => {
      setIsUpdating(null);
    }, 300);
  };
  
  const handleRemoveItem = (id) => {
    // Set the removing state for animation
    setIsRemoving(id);
    
    // Remove the item after a short delay for animation
    setTimeout(() => {
      removeFromCart(id);
      setCartItems(getCartItems());
      setIsRemoving(null);
    }, 300);
  };
  
  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-[#00000088] bg-opacity-50 flex justify-center items-center p-4 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all animate-scaleIn">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-[#F5F0E8] rounded-t-xl">
          <h3 className="font-bold text-lg text-[#2C1A1D] flex items-center">
            <FaShoppingCart className="mr-2 text-[#D7B49E]" /> Your Cart
          </h3>
          <button
            onClick={onClose}
            className="text-[#2C1A1D] hover:text-[#D7B49E] transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#2C1A1D] hover:bg-opacity-10"
            aria-label="Close cart"
          >
            <FaTimes size={18} className='cursor-pointer' />
          </button>
        </div>
        
        {/* Cart Contents */}
        <div className="overflow-auto max-h-[60vh] p-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-12 flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-[#F5F0E8] flex items-center justify-center mb-4">
                <FaShoppingBag className="text-[#D7B49E] text-3xl" />
              </div>
              <p className="text-gray-500 mb-2">Your cart is empty</p>
              <p className="text-sm text-gray-400">Add items from our menu to get started</p>
              <button
                onClick={onClose}
                className="mt-6 px-4 py-2 bg-[#2C1A1D] text-white rounded-lg hover:bg-[#3E2723] transition-colors flex items-center"
              >
                Browse Menu <FaArrowRight className="ml-2" />
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map(item => (
                <div 
                  key={item.id} 
                  className={`flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0 transition-all duration-300 ${
                    isRemoving === item.id ? 'opacity-0 transform -translate-x-10' : 'opacity-100'
                  }`}
                >
                  <div className="flex items-center">
                    <div className="w-16 h-16 bg-[#F5F0E8] rounded-lg overflow-hidden">
                      <img 
                        src={item.image || '/images/coffee-items/default.jpg'} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = '/images/coffee-items/default.jpg';
                        }}
                      />
                    </div>
                    <div className="ml-3">
                      <h4 className="font-semibold text-[#2C1A1D]">{item.name}</h4>
                      <p className="text-sm text-gray-600">${item.price.toFixed(2)} × {item.quantity}</p>
                      <p className="text-sm font-medium text-[#D7B49E]">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="flex items-center mr-3 bg-[#F5F0E8] rounded-lg">
                      <button
                        onClick={() => handleQuantityUpdate(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-[#2C1A1D] hover:bg-[#D7B49E] hover:text-[#2C1A1D] transition-colors rounded-l-lg"
                        aria-label="Decrease quantity"
                      >
                        <FaMinus size={12} className='cursor-pointer' />
                      </button>
                      <span className={`w-8 text-center font-medium transition-all duration-200 ${isUpdating === item.id ? 'scale-125 text-[#D7B49E]' : ''}`}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityUpdate(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-[#2C1A1D] hover:bg-[#D7B49E] hover:text-[#2C1A1D] transition-colors rounded-r-lg"
                        aria-label="Increase quantity"
                      >
                        <FaPlus size={12} className='cursor-pointer' />
                      </button>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50"
                      aria-label="Remove item"
                    >
                      <FaTrash size={14} className='cursor-pointer' />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Footer with Total and Checkout */}
        <div className="p-4 border-t border-gray-200">
          {/* Delivery Fee and Subtotal */}
          {cartItems.length > 0 && (
            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>Subtotal:</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>Delivery Fee:</span>
                <span>$2.00</span>
              </div>
              <div className="flex justify-between items-center font-semibold text-[#2C1A1D] pt-2 border-t border-dashed border-gray-200">
                <span>Total:</span>
                <span>${(totalPrice + 2).toFixed(2)}</span>
              </div>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onClose}
              className="px-4 py-3 border-2 cursor-pointer border-[#2C1A1D] text-[#2C1A1D] rounded-lg hover:bg-[#2C1A1D] hover:text-white transition-colors flex-1 flex items-center justify-center"
            >
              Continue Shopping
            </button>
            <Link
              to="/orders"
              onClick={cartItems.length > 0 ? onClose : (e) => e.preventDefault()}
              className={`px-4 py-3 bg-[#2C1A1D] text-white rounded-lg flex-1 flex items-center justify-center ${
                cartItems.length === 0 ? 'opacity-50 cursor-not-allowed bg-gray-400' : 'hover:bg-[#3E2723]'
              } transition-colors`}
            >
              <FaShoppingBag className="mr-2" /> Checkout
            </Link>
          </div>
          
          {/* Free Delivery Notice */}
          {cartItems.length > 0 && totalPrice < 20 && (
            <div className="mt-4 text-xs text-center text-gray-500">
              Add ${(20 - totalPrice).toFixed(2)} more to qualify for free delivery
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1 overflow-hidden">
                <div 
                  className="bg-[#D7B49E] h-1.5 rounded-full" 
                  style={{ width: `${Math.min(100, (totalPrice / 20) * 100)}%` }}
                ></div>
              </div>
            </div>
          )}
          
          {cartItems.length > 0 && totalPrice >= 20 && (
            <div className="mt-4 text-xs text-center text-green-600 font-medium">
              You've qualified for free delivery! 🎉
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PopupCart;