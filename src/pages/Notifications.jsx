// src/pages/Notifications.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaBell, FaExclamationCircle, FaCoffee, FaTruck, FaCheckCircle, FaTags, FaClock, FaTrash, FaEllipsisH } from 'react-icons/fa';
import { getUserNotifications, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification } from '../utils/notifications';

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [showDropdownId, setShowDropdownId] = useState(null);
  
  useEffect(() => {
    // Load notifications
    setTimeout(() => {
      const userNotifications = getUserNotifications();
      setNotifications(userNotifications);
      setIsLoading(false);
    }, 600);
    
    // Close dropdown when clicking outside
    const handleClickOutside = () => setShowDropdownId(null);
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
  
  // Format notification date
  const formatNotificationDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    }
    
    // For older notifications, use the actual date
    const options = { month: 'short', day: 'numeric' };
    if (date.getFullYear() !== now.getFullYear()) {
      options.year = 'numeric';
    }
    
    return date.toLocaleDateString('en-US', options);
  };
  
  // Get icon for notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order_status':
        return <FaTruck className="text-blue-500" />;
      case 'promo':
        return <FaTags className="text-purple-500" />;
      case 'system':
        return <FaExclamationCircle className="text-red-500" />;
      case 'rewards':
        return <FaCoffee className="text-[#D7B49E]" />;
      default:
        return <FaBell className="text-gray-500" />;
    }
  };
  
  // Handle marking a notification as read
  const handleMarkAsRead = (e, id) => {
    e.stopPropagation();
    const updatedNotifications = markNotificationAsRead(id);
    setNotifications(updatedNotifications);
    setShowDropdownId(null);
  };
  
  // Handle deleting a notification
  const handleDelete = (e, id) => {
    e.stopPropagation();
    const updatedNotifications = deleteNotification(id);
    setNotifications(updatedNotifications);
    setShowDropdownId(null);
  };
  
  // Handle marking all notifications as read
  const handleMarkAllAsRead = () => {
    const updatedNotifications = markAllNotificationsAsRead();
    setNotifications(updatedNotifications);
  };
  
  // Toggle dropdown menu
  const toggleDropdown = (e, id) => {
    e.stopPropagation();
    setShowDropdownId(showDropdownId === id ? null : id);
  };
  
  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    if (filterType === 'all') return true;
    if (filterType === 'unread') return !notification.isRead;
    return notification.type === filterType;
  });
  
  // Calculate counts for filter tabs
  const counts = {
    all: notifications.length,
    unread: notifications.filter(n => !n.isRead).length,
    order_status: notifications.filter(n => n.type === 'order_status').length,
    promo: notifications.filter(n => n.type === 'promo').length,
    rewards: notifications.filter(n => n.type === 'rewards').length,
    system: notifications.filter(n => n.type === 'system').length
  };
  
  // Navigate to appropriate page when clicking a notification
  const handleNotificationClick = (notification) => {
    // Mark as read
    if (!notification.isRead) {
      markNotificationAsRead(notification.id);
      setNotifications(getUserNotifications());
    }
    
    // Navigate based on notification type and link
    if (notification.link) {
      navigate(notification.link);
    }
  };
  
  return (
    <div className="bg-[#FFF8F0] min-h-screen mt-24 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="mr-3 text-[#2C1A1D] hover:text-[#D7B49E] transition-colors flex items-center"
          >
            <FaArrowLeft className="mr-2" />
          </button>
          <h1 className="text-3xl font-bold text-[#2C1A1D]">Notifications</h1>
        </div>
        
        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div className="p-4 sm:p-0 overflow-x-auto">
            <div className="flex whitespace-nowrap sm:grid sm:grid-cols-6">
              <button
                onClick={() => setFilterType('all')}
                className={`flex-1 py-3 px-4 text-sm font-medium relative ${
                  filterType === 'all' ? 'text-[#D7B49E]' : 'text-gray-500 hover:text-[#2C1A1D]'
                } transition-colors`}
              >
                All
                {counts.all > 0 && (
                  <span className="ml-1 text-xs bg-gray-100 text-gray-700 rounded-full px-2 py-0.5">
                    {counts.all}
                  </span>
                )}
                {filterType === 'all' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D7B49E]"></span>
                )}
              </button>
              <button
                onClick={() => setFilterType('unread')}
                className={`flex-1 py-3 px-4 text-sm font-medium relative ${
                  filterType === 'unread' ? 'text-[#D7B49E]' : 'text-gray-500 hover:text-[#2C1A1D]'
                } transition-colors`}
              >
                Unread
                {counts.unread > 0 && (
                  <span className="ml-1 text-xs bg-red-100 text-red-700 rounded-full px-2 py-0.5">
                    {counts.unread}
                  </span>
                )}
                {filterType === 'unread' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D7B49E]"></span>
                )}
              </button>
              <button
                onClick={() => setFilterType('order_status')}
                className={`flex-1 py-3 px-4 text-sm font-medium relative ${
                  filterType === 'order_status' ? 'text-[#D7B49E]' : 'text-gray-500 hover:text-[#2C1A1D]'
                } transition-colors`}
              >
                Orders
                {counts.order_status > 0 && (
                  <span className="ml-1 text-xs bg-blue-100 text-blue-700 rounded-full px-2 py-0.5">
                    {counts.order_status}
                  </span>
                )}
                {filterType === 'order_status' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D7B49E]"></span>
                )}
              </button>
              <button
                onClick={() => setFilterType('rewards')}
                className={`flex-1 py-3 px-4 text-sm font-medium relative ${
                  filterType === 'rewards' ? 'text-[#D7B49E]' : 'text-gray-500 hover:text-[#2C1A1D]'
                } transition-colors`}
              >
                Rewards
                {counts.rewards > 0 && (
                  <span className="ml-1 text-xs bg-[#FFF8F0] text-[#2C1A1D] rounded-full px-2 py-0.5">
                    {counts.rewards}
                  </span>
                )}
                {filterType === 'rewards' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D7B49E]"></span>
                )}
              </button>
              <button
                onClick={() => setFilterType('promo')}
                className={`flex-1 py-3 px-4 text-sm font-medium relative ${
                  filterType === 'promo' ? 'text-[#D7B49E]' : 'text-gray-500 hover:text-[#2C1A1D]'
                } transition-colors`}
              >
                Promos
                {counts.promo > 0 && (
                  <span className="ml-1 text-xs bg-purple-100 text-purple-700 rounded-full px-2 py-0.5">
                    {counts.promo}
                  </span>
                )}
                {filterType === 'promo' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D7B49E]"></span>
                )}
              </button>
              <button
                onClick={() => setFilterType('system')}
                className={`flex-1 py-3 px-4 text-sm font-medium relative ${
                  filterType === 'system' ? 'text-[#D7B49E]' : 'text-gray-500 hover:text-[#2C1A1D]'
                } transition-colors`}
              >
                System
                {counts.system > 0 && (
                  <span className="ml-1 text-xs bg-red-100 text-red-700 rounded-full px-2 py-0.5">
                    {counts.system}
                  </span>
                )}
                {filterType === 'system' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D7B49E]"></span>
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Notifications List */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-semibold text-[#2C1A1D] flex items-center">
              <FaBell className="mr-2 text-[#D7B49E]" /> Your Notifications
            </h2>
            {counts.unread > 0 && (
              <button 
                onClick={handleMarkAllAsRead}
                className="text-sm text-[#D7B49E] hover:text-[#2C1A1D] transition-colors flex items-center"
              >
                <FaCheckCircle className="mr-1" /> Mark all as read
              </button>
            )}
          </div>
          
          {isLoading ? (
            <div className="p-12 text-center">
              <div className="w-12 h-12 mx-auto border-t-4 border-[#D7B49E] border-solid rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-500">Loading notifications...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-[#F5F0E8] rounded-full flex items-center justify-center mx-auto mb-4">
                <FaBell className="text-gray-400 text-3xl" />
              </div>
              <h3 className="text-xl font-medium text-[#2C1A1D] mb-2">No notifications</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                {filterType === 'all' 
                  ? "You don't have any notifications yet." 
                  : "You don't have any notifications in this category."}
              </p>
              {filterType !== 'all' && (
                <button
                  onClick={() => setFilterType('all')}
                  className="mt-4 text-[#D7B49E] hover:text-[#2C1A1D] transition-colors"
                >
                  View all notifications
                </button>
              )}
            </div>
          ) : (
            <div>
              {filteredNotifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`border-b border-gray-100 last:border-b-0 relative transition-colors ${
                    notification.isRead ? 'bg-white' : 'bg-blue-50'
                  } hover:bg-gray-50 cursor-pointer`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  {!notification.isRead && (
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full"></span>
                  )}
                  
                  <div className="p-4 pl-7 pr-12">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-3 mt-1 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div>
                        <p className={`${notification.isRead ? 'text-gray-800' : 'text-[#2C1A1D] font-medium'}`}>
                          {notification.title}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        <div className="flex items-center mt-2">
                          <span className="text-xs text-gray-500 flex items-center">
                            <FaClock className="mr-1" size={10} />
                            {formatNotificationDate(notification.date)}
                          </span>
                          
                          {notification.orderId && (
                            <Link
                              to={`/order-details/${notification.orderId}`}
                              className="ml-3 text-xs text-[#D7B49E] hover:text-[#2C1A1D] transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              View Order
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Dropdown */}
                  <div className="absolute top-3 right-3">
                    <button
                      onClick={(e) => toggleDropdown(e, notification.id)}
                      className="p-2 text-gray-400 hover:text-[#2C1A1D] rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <FaEllipsisH size={14} />
                    </button>
                    
                    {showDropdownId === notification.id && (
                      <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg z-10 py-1 border border-gray-200">
                        {!notification.isRead && (
                          <button
                            onClick={(e) => handleMarkAsRead(e, notification.id)}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                          >
                            <FaCheckCircle className="mr-2 text-green-500" size={14} />
                            Mark as read
                          </button>
                        )}
                        <button
                          onClick={(e) => handleDelete(e, notification.id)}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                        >
                          <FaTrash className="mr-2 cursor-pointer" size={14} />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Notification Preferences Link */}
        {/* <div className="mt-6 text-center">
          <Link 
            to="/profile/notification-preferences" 
            className="text-[#D7B49E] hover:text-[#2C1A1D] transition-colors text-sm"
          >
            Manage Notification Preferences
          </Link>
        </div> */}
      </div>
    </div>
  );
};

export default Notifications;