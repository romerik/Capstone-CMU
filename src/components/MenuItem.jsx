// src/components/MenuItem.jsx
import { useState } from 'react';
import { FaPlus, FaMinus, FaShoppingBag, FaTimes } from 'react-icons/fa';
import { addToCart } from '../utils/orders';
import Modal from './Modal';

const MenuItem = ({ item, onCartUpdate }) => {
  const [showModal, setShowModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  
  const handleAddToCart = () => {
    addToCart(item, quantity);
    setShowModal(false);
    setQuantity(1);
    
    if (onCartUpdate) {
      onCartUpdate();
    }
  };
  
  // Get category badge
  const getCategoryBadge = () => {
    let color = '';
    let label = '';
    
    switch(item.category) {
      case 'drinks':
        color = 'bg-blue-100 text-blue-800';
        label = 'Drink';
        break;
      case 'food':
        color = 'bg-green-100 text-green-800';
        label = 'Food';
        break;
      case 'desserts':
        color = 'bg-pink-100 text-pink-800';
        label = 'Dessert';
        break;
      case 'specials':
        color = 'bg-purple-100 text-purple-800';
        label = 'Special';
        break;
      default:
        color = 'bg-gray-100 text-gray-800';
        label = item.category;
    }
    
    return (
      <span className={`text-xs font-medium px-2 py-1 rounded-full ${color}`}>
        {label}
      </span>
    );
  };
  
  return (
    <>
      <div 
        className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative h-48 overflow-hidden bg-[#F5F0E8]">
          <img 
            src={item.image || '/images/coffee-items/default.jpg'} 
            alt={item.name}
            className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
            onError={(e) => {
              e.target.src = '/images/coffee-items/default.jpg';
            }}
          />
          <div className="absolute top-2 left-2">
            {getCategoryBadge()}
          </div>
          {item.isNew && (
            <div className="absolute top-2 right-2 bg-[#D7B49E] text-[#2C1A1D] text-xs font-bold uppercase px-2 py-1 rounded-full">
              New
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-[#2C1A1D] text-lg">{item.name}</h3>
            <span className="font-bold text-[#D7B49E] text-lg">${item.price.toFixed(2)}</span>
          </div>
          <p className="text-sm text-gray-600 min-h-[40px]">{item.description}</p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-3 w-full bg-[#2C1A1D] text-white cursor-pointer py-2 rounded-lg hover:bg-[#3E2723] transition-colors flex items-center justify-center"
          >
            <FaShoppingBag className="mr-2" /> Add to Cart
          </button>
        </div>
      </div>
      
      {/* Modal for adding to cart */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setQuantity(1);
        }}
        title={item.name}
      >
        <div className="p-6">
          <div className="mb-6">
            <img 
              src={item.image || '/images/coffee-items/default.jpg'} 
              alt={item.name}
              className="w-full h-56 object-cover rounded-lg shadow-md"
              onError={(e) => {
                e.target.src = '/images/coffee-items/default.jpg';
              }}
            />
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-xl text-[#2C1A1D]">{item.name}</h4>
                {getCategoryBadge()}
              </div>
              <p className="font-bold text-[#D7B49E] text-xl">${item.price.toFixed(2)}</p>
            </div>
            <p className="text-gray-600 mt-3">{item.description}</p>
          </div>
          
          {/* Customization options could go here */}
          
          {/* Quantity selector */}
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 mb-2">Quantity</p>
            <div className="flex items-center">
              <button
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                className="bg-[#F5F0E8] cursor-pointer text-[#2C1A1D] w-10 h-10 rounded-l-lg flex items-center justify-center hover:bg-[#D7B49E] transition-colors"
              >
                <FaMinus className='cursor-pointer' />
              </button>
              <span className="bg-white px-4 py-2 border-t border-b border-[#F5F0E8] w-16 text-center font-medium">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(prev => prev + 1)}
                className="bg-[#F5F0E8] text-[#2C1A1D] cursor-pointer w-10 h-10 rounded-r-lg flex items-center justify-center hover:bg-[#D7B49E] transition-colors"
              >
                <FaPlus className='cursor-pointer' />
              </button>
            </div>
          </div>
          
          {/* Total */}
          <div className="mb-6 bg-[#F5F0E8] p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-[#2C1A1D] font-medium">Total:</span>
              <span className="font-bold text-[#2C1A1D] text-xl">${(item.price * quantity).toFixed(2)}</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between gap-3">
            <button
              onClick={() => {
                setShowModal(false);
                setQuantity(1);
              }}
              className="px-4 py-3 border-2 cursor-pointer border-[#2C1A1D] text-[#2C1A1D] rounded-lg hover:bg-[#2C1A1D] hover:text-white transition-colors flex items-center justify-center sm:w-1/3"
            >
              <FaTimes className="mr-2 cursor-pointer" /> Cancel
            </button>
            <button
              onClick={handleAddToCart}
              className="px-4 py-3 bg-[#2C1A1D] text-white cursor-pointer rounded-lg hover:bg-[#3E2723] transition-colors flex items-center justify-center sm:w-2/3"
            >
              <FaShoppingBag className="mr-2" /> Add to Cart - ${(item.price * quantity).toFixed(2)}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default MenuItem;