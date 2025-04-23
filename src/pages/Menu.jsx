// src/pages/Menu.jsx
import { useState, useEffect } from 'react';
import { FaShoppingCart, FaFilter, FaCoffee, FaUtensils, FaBirthdayCake, FaStar } from 'react-icons/fa';
import MenuItem from '../components/MenuItem';
import PopupCart from '../components/PopupCart';
import { getMenuItems, getCategories } from '../utils/menu';
import { getCartItems } from '../utils/orders';

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCart, setShowCart] = useState(false);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    // Load menu items
    const items = getMenuItems();
    setMenuItems(items);
    
    // Load categories
    const cats = getCategories();
    setCategories(cats);
    
    // Update cart counter
    updateCartCount();
  }, []);
  
  const updateCartCount = () => {
    const cart = getCartItems();
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    setCartItemsCount(count);
  };

  useEffect(() => {
    // Fonction pour mettre à jour le compteur
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      const count = cart.reduce((total, item) => total + item.quantity, 0);
      setCartItemsCount(count);
    };
    
    // Mettre à jour initialement
    updateCartCount();
    
    // Écouter les événements de mise à jour du panier
    const handleCartUpdated = (event) => {
      if (event.detail && event.detail.cart) {
        const count = event.detail.cart.reduce((total, item) => total + item.quantity, 0);
        setCartItemsCount(count);
      } else {
        updateCartCount();
      }
    };
    
    // Écouter les changements de localStorage
    const handleStorageChange = (e) => {
      if (e.key === 'cart') {
        updateCartCount();
      }
    };
    
    window.addEventListener('cartUpdated', handleCartUpdated);
    window.addEventListener('storage', handleStorageChange);
    
    // Vérification périodique
    const intervalId = setInterval(updateCartCount, 1000);
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdated);
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(intervalId);
    };
  }, []);
  
  // Get category icon
  const getCategoryIcon = (category) => {
    switch(category) {
      case 'drinks': return <FaCoffee className="mr-2" />;
      case 'food': return <FaUtensils className="mr-2" />;
      case 'desserts': return <FaBirthdayCake className="mr-2" />;
      case 'specials': return <FaStar className="mr-2" />;
      default: return null;
    }
  };
  
  // Get category label
  const getCategoryLabel = (category) => {
    switch(category) {
      case 'drinks': return 'Drinks';
      case 'food': return 'Food';
      case 'desserts': return 'Desserts';
      case 'specials': return 'Specials';
      default: return category;
    }
  };
  
  // Filter menu items by category and search query
  const filteredItems = menuItems
    .filter(item => selectedCategory === 'all' || item.category === selectedCategory)
    .filter(item => 
      searchQuery === '' || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  
  return (
    <div className="bg-[#FFF8F0] mt-24 min-h-screen">
      {/* Hero Section */}
      <div className="bg-[#2C1A1D] text-white py-12 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-[url('/menu-bg.jpg')] bg-cover bg-center opacity-20"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="text-4xl font-bold mb-4">Our Menu</h1>
          <p className="text-[#D7B49E] text-xl max-w-2xl">
            Discover our selection of premium coffee, artisanal food, and delicious desserts - all available for robotic delivery.
          </p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Cart */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="relative w-full md:w-auto flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search our menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-full border-2 border-[#D7B49E] focus:border-[#2C1A1D] focus:ring-0 bg-white"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#2C1A1D]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#2C1A1D]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          
          <button
            onClick={() => setShowCart(true)}
            className="group flex items-center cursor-pointer space-x-2 bg-[#2C1A1D] text-white px-6 py-3 rounded-full hover:bg-[#3E2723] transition-all duration-300 shadow-lg relative"
          >
            <span className="absolute -top-2 -right-2 w-6 h-6 bg-[#D7B49E] rounded-full flex items-center justify-center text-xs font-bold text-[#2C1A1D]">
              {cartItemsCount}
            </span>
            <FaShoppingCart className="text-[#D7B49E] group-hover:animate-bounce" />
            <span>View Cart</span>
          </button>
        </div>
        
        {/* Category Filters */}
        <div className="mb-8 overflow-x-auto pb-2 scrollbar-hide">
          <div className="inline-flex items-center space-x-3 w-full">
            <div className="text-[#2C1A1D] flex items-center text-sm font-medium mr-2">
              <FaFilter className="mr-2" /> Filter by:
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 cursor-pointer rounded-full text-sm font-medium ${
                  selectedCategory === 'all'
                    ? 'bg-[#2C1A1D] text-white shadow-md'
                    : 'bg-white text-[#2C1A1D] border border-[#D7B49E] hover:bg-[#FFF8F0]'
                } transition-colors duration-300`}
              >
                All
              </button>
              
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 cursor-pointer rounded-full text-sm font-medium flex items-center ${
                    selectedCategory === category
                      ? 'bg-[#2C1A1D] text-white shadow-md'
                      : 'bg-white text-[#2C1A1D] border border-[#D7B49E] hover:bg-[#FFF8F0]'
                  } transition-colors duration-300 whitespace-nowrap`}
                >
                  {getCategoryIcon(category)}
                  {getCategoryLabel(category)}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Active Filters */}
        {(selectedCategory !== 'all' || searchQuery) && (
          <div className="mb-6 flex items-center">
            <span className="text-sm text-gray-600 mr-2">Active filters:</span>
            {selectedCategory !== 'all' && (
              <span className="bg-[#D7B49E] text-[#2C1A1D] text-xs font-medium px-3 py-1 rounded-full flex items-center mr-2">
                {getCategoryLabel(selectedCategory)}
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="ml-2 cursor-pointer text-[#2C1A1D] hover:text-[#3E2723]"
                >
                  ×
                </button>
              </span>
            )}
            {searchQuery && (
              <span className="bg-[#D7B49E] text-[#2C1A1D] text-xs font-medium px-3 py-1 rounded-full flex items-center">
                "{searchQuery}"
                <button
                  onClick={() => setSearchQuery('')}
                  className="ml-2 text-[#2C1A1D] hover:text-[#3E2723]"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        )}
        
        {/* Menu Items */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-[#2C1A1D] text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-medium text-[#2C1A1D] mb-2">No items found</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              We couldn't find any menu items matching your search. Try adjusting your filters or search terms.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 bg-[#D7B49E] text-[#2C1A1D] rounded-lg hover:bg-[#2C1A1D] hover:text-white transition-colors duration-300"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map(item => (
                <MenuItem 
                  key={item.id} 
                  item={item} 
                  onCartUpdate={updateCartCount} 
                />
              ))}
            </div>
            
            {/* Summary counts */}
            <div className="mt-8 text-sm text-gray-600 text-right">
              Showing {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
              {selectedCategory !== 'all' && ` in ${getCategoryLabel(selectedCategory)}`}
              {searchQuery && ` matching "${searchQuery}"`}
            </div>
          </>
        )}
      </div>
      
      {/* Popup Cart */}
      <PopupCart 
        isOpen={showCart} 
        onClose={() => {
          setShowCart(false);
          updateCartCount();
        }} 
      />
      
      {/* Add a subtle background pattern */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default Menu;