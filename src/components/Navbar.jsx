// src/components/Navbar.jsx
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { logout, isAuthenticated, getUserRole } from '../utils/auth';
import { FaCoffee, FaUser, FaSignOutAlt, FaBars, FaTimes, FaShoppingCart, FaHistory, FaBell } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { getCartItems } from '../utils/orders';

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  
  useEffect(() => {
    // Update cart count when navigating or when cart changes
    updateCartCount();
    
    // Check for scroll position
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);
  
  // Load mock notifications
  useEffect(() => {
    if (isAuthenticated()) {
      const mockNotifications = [
        { id: 1, text: "Your order #ORD-123456 is out for delivery", isRead: false, time: "10 min ago" },
        { id: 2, text: "New seasonal items added to our menu!", isRead: true, time: "2 hours ago" },
        { id: 3, text: "Your loyalty reward is ready to redeem", isRead: false, time: "Yesterday" }
      ];
      setNotifications(mockNotifications);
    }
  }, [user]);
  
  const updateCartCount = () => {
    const cart = getCartItems();
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    setCartItemsCount(count);
  };
  
  const handleLogout = () => {
    logout();
    setUser(null);
    navigate('/');
  };
  
  const isAdmin = user && user.role === 'admin';
  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;
  
  // Determine if we're on a page where we should use transparent navbar
  const isTransparentPage = location.pathname === '/' || location.pathname === '/about';
  const shouldBeTransparent = isTransparentPage && !isScrolled && !isMenuOpen;
  
  // Close mobile menu when navigating
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);
  
  // Function to mark a notification as read
  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
  };
  
  return (
    <nav className={`fixed top-0 left-0 right-0 z-[999999] transition-all duration-300 ${
      'bg-[#2C1A1D] shadow-lg'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <FaCoffee className={`${shouldBeTransparent ? 'text-white' : 'text-[#D7B49E]'} text-2xl`} />
            <span className={`font-bold text-xl ${shouldBeTransparent ? 'text-white' : 'text-white'}`}>Neo Cafe</span>
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-6">
            <Link 
              to="/menu" 
              className={`${shouldBeTransparent ? 'text-white hover:text-[#D7B49E]' : 'text-[#D7B49E] hover:text-white'} transition-colors font-medium`}
            >
              Menu
            </Link>
            {!isAuthenticated() &&<>
              <Link 
                to="/about" 
                className={`${shouldBeTransparent ? 'text-white hover:text-[#D7B49E]' : 'text-[#D7B49E] hover:text-white'} transition-colors font-medium`}
              >
                About Us
              </Link>
              <Link 
                to="/contact" 
                className={`${shouldBeTransparent ? 'text-white hover:text-[#D7B49E]' : 'text-[#D7B49E] hover:text-white'} transition-colors font-medium`}
              >
                Contact
              </Link></>}
            
            {isAuthenticated() ? (
              <div className="flex items-center space-x-4">
                {/* Cart Icon with badge */}
                <Link to="/orders" className="relative group">
                  <div className={`p-2 rounded-full ${shouldBeTransparent ? 'text-white hover:bg-white hover:bg-opacity-20' : 'text-[#D7B49E] hover:bg-[#3E2723]'} transition-colors`}>
                    <FaShoppingCart size={20} className="group-hover:scale-110 transition-transform" />
                    {cartItemsCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-[#D7B49E] text-[#2C1A1D] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {cartItemsCount}
                      </span>
                    )}
                  </div>
                </Link>
                
                {/* Notification Bell */}
                <div className="relative">
                  <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className={`p-2 rounded-full ${shouldBeTransparent ? 'text-white hover:bg-white hover:bg-opacity-20' : 'text-[#D7B49E] hover:bg-[#3E2723]'} transition-colors relative`}
                  >
                    <FaBell size={20} />
                    {unreadNotificationsCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadNotificationsCount}
                      </span>
                    )}
                  </button>
                  
                  {/* Notification Dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50 overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-medium text-[#2C1A1D]">Notifications</h3>
                        <button className="text-xs text-[#D7B49E] hover:text-[#2C1A1D]">
                          Mark all as read
                        </button>
                      </div>
                      
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-4 text-center text-gray-500">
                            No notifications
                          </div>
                        ) : (
                          <div>
                            {notifications.map(notification => (
                              <div 
                                key={notification.id} 
                                className={`px-4 py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 ${notification.isRead ? '' : 'bg-blue-50'}`}
                                onClick={() => markAsRead(notification.id)}
                              >
                                <p className="text-sm text-[#2C1A1D]">{notification.text}</p>
                                <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="px-4 py-2 border-t border-gray-100 text-center">
                        <Link to="/notifications" className="text-xs text-[#D7B49E] hover:text-[#2C1A1D]">
                          View all notifications
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Order History */}
                <Link 
                  to="/order-history" 
                  className={`p-2 rounded-full ${shouldBeTransparent ? 'text-white hover:bg-white hover:bg-opacity-20' : 'text-[#D7B49E] hover:bg-[#3E2723]'} transition-colors`}
                >
                  <FaHistory size={20} />
                </Link>
                
                {/* User Dropdown */}
                <div className="relative group">
                  <button className={`flex items-center space-x-1 ${shouldBeTransparent ? 'text-white' : 'text-[#D7B49E]'} font-medium pl-1 pr-2 py-1 rounded-full transition-colors border border-transparent group-hover:border-[#D7B49E]`}>
                    <FaUser className="mr-1" />
                    <span className="hidden xl:inline">{user?.username}</span>
                  </button>
                  
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-50 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-1">
                    <div className="px-4 py-3 border-b max-w-42 truncate border-gray-100">
                      <p className="text-sm font-medium text-[#2C1A1D]">{user?.username}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    
                    <div className="py-1">
                      <Link 
                        to="/order-history" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Order History
                      </Link>
                      {isAdmin && (
                        <Link 
                          to="/dashboard" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Dashboard
                        </Link>
                      )}
                      <button 
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className={`${shouldBeTransparent ? 'text-white hover:text-[#D7B49E]' : 'text-[#D7B49E] hover:text-white'} transition-colors font-medium`}
                >
                  Log In
                </Link>
                <Link 
                  to="/signup" 
                  className={`${
                    shouldBeTransparent 
                      ? 'bg-white text-[#2C1A1D] hover:bg-opacity-90' 
                      : 'bg-[#D7B49E] text-[#2C1A1D] hover:bg-white'
                  } px-4 py-2 rounded-full transition-colors font-medium`}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile Cart Icon */}
          {isAuthenticated() && (
            <div className="lg:hidden flex items-center mr-2">
              <Link to="/orders" className="relative">
                <div className={`p-2 rounded-full ${shouldBeTransparent ? 'text-white' : 'text-[#D7B49E]'}`}>
                  <FaShoppingCart size={20} />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#D7B49E] text-[#2C1A1D] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItemsCount}
                    </span>
                  )}
                </div>
              </Link>
            </div>
          )}
          
          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden text-white p-2 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? (
              <FaTimes size={24} className="text-white cursor-pointer" />
            ) : (
              <FaBars size={24} className={shouldBeTransparent ? "text-white" : "text-[#D7B49E]"} />
            )}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-[#3E2723] animate-fadeIn">
            <div className="flex flex-col space-y-3">
              <Link 
                to="/menu" 
                className="text-white hover:text-[#D7B49E] transition-colors py-2 flex items-center"
              >
                <span className="w-8">🍽️</span> Menu
              </Link>
              {!isAuthenticated() && <><Link 
                to="/about" 
                className="text-white hover:text-[#D7B49E] transition-colors py-2 flex items-center"
              >
                <span className="w-8">ℹ️</span> About Us
              </Link>
              <Link 
                to="/contact" 
                className="text-white hover:text-[#D7B49E] transition-colors py-2 flex items-center"
              >
                <span className="w-8">📞</span> Contact
              </Link></>}
              
              {isAuthenticated() ? (
                <>
                  <div className="border-t border-[#3E2723] my-2"></div>
                  
                  <Link 
                    to="/order-history" 
                    className="text-white hover:text-[#D7B49E] transition-colors py-2 flex items-center"
                  >
                    <span className="w-8"><FaHistory /></span> Order History
                  </Link>
                  
                  {isAdmin && (
                    <Link 
                      to="/dashboard" 
                      className="text-white hover:text-[#D7B49E] transition-colors py-2 flex items-center"
                    >
                      <span className="w-8">📊</span> Dashboard
                    </Link>
                  )}
                  
                  <button 
                    onClick={handleLogout}
                    className="text-white hover:text-[#D7B49E] transition-colors py-2 flex items-center"
                  >
                    <span className="w-8"><FaSignOutAlt /></span> Sign Out
                  </button>
                </>
              ) : (
                <>
                  <div className="border-t border-[#3E2723] my-2"></div>
                  
                  <Link 
                    to="/login" 
                    className="text-white hover:text-[#D7B49E] transition-colors py-2 flex items-center"
                  >
                    <span className="w-8">🔑</span> Log In
                  </Link>
                  <Link 
                    to="/signup" 
                    className="bg-[#D7B49E] text-[#2C1A1D] px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors mt-2 text-center font-medium"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Add animation keyframes */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease forwards;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;