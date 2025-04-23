// src/pages/OrderHistory.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHistory, FaClock, FaMapMarkerAlt, FaUtensils, FaCheckCircle, FaTruck, FaExclamationCircle, FaSearch, FaCalendarAlt, FaFilter } from 'react-icons/fa';
import { getOrderHistory } from '../utils/orders';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedDateRange, setSelectedDateRange] = useState('all');
  
  useEffect(() => {
    // Load order history with a small delay to simulate API fetch
    setTimeout(() => {
      const history = getOrderHistory();
      setOrders(history);
      setFilteredOrders(history);
      setIsLoading(false);
    }, 800);
  }, []);
  
  useEffect(() => {
    // Apply filters whenever filter criteria change
    applyFilters();
  }, [searchQuery, filterStatus, selectedDateRange, orders]);
  
  const applyFilters = () => {
    let result = [...orders];
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(order => 
        order.orderNumber.toLowerCase().includes(query) || 
        order.items.some(item => item.name.toLowerCase().includes(query))
      );
    }
    
    // Filter by status
    if (filterStatus !== 'all') {
      result = result.filter(order => order.status === filterStatus);
    }
    
    // Filter by date range
    if (selectedDateRange !== 'all') {
      const now = new Date();
      const today = new Date(now.setHours(0, 0, 0, 0));
      
      switch (selectedDateRange) {
        case 'today':
          result = result.filter(order => {
            const orderDate = new Date(order.date);
            return orderDate >= today;
          });
          break;
        case 'week':
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          result = result.filter(order => {
            const orderDate = new Date(order.date);
            return orderDate >= weekAgo;
          });
          break;
        case 'month':
          const monthAgo = new Date();
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          result = result.filter(order => {
            const orderDate = new Date(order.date);
            return orderDate >= monthAgo;
          });
          break;
        default:
          break;
      }
    }
    
    setFilteredOrders(result);
  };
  
  // Get status badge styling
  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return {
          color: 'bg-green-100 text-green-800',
          icon: <FaCheckCircle className="mr-1" />,
          text: 'Completed'
        };
      case 'in-progress':
        return {
          color: 'bg-blue-100 text-blue-800',
          icon: <FaUtensils className="mr-1" />,
          text: 'In Progress'
        };
      case 'delivered':
        return {
          color: 'bg-purple-100 text-purple-800',
          icon: <FaTruck className="mr-1" />,
          text: 'Delivered'
        };
      case 'cancelled':
        return {
          color: 'bg-red-100 text-red-800',
          icon: <FaExclamationCircle className="mr-1" />,
          text: 'Cancelled'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800',
          icon: <FaClock className="mr-1" />,
          text: status
        };
    }
  };
  
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleString('en-US', options);
  };
  
  console.log(filteredOrders)

  return (
    <div className="bg-[#FFF8F0] min-h-screen mt-24 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#2C1A1D] flex items-center">
              <FaHistory className="mr-3 text-[#D7B49E]" /> Order History
            </h1>
            <p className="text-gray-600 mt-2">View and track your past orders</p>
          </div>
          
          <Link 
            to="/menu" 
            className="inline-flex items-center bg-[#2C1A1D] text-white px-4 py-2 rounded-lg hover:bg-[#3E2723] transition-colors self-start"
          >
            Order Again
          </Link>
        </div>
        
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-3 py-2 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D7B49E] focus:border-transparent"
              />
            </div>
            
            {/* Status Filter */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaFilter className="text-gray-400" />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-10 pr-3 py-2 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D7B49E] focus:border-transparent appearance-none"
              >
                <option value="all">All Statuses</option>
                <option value="completed">Completed</option>
                <option value="in-progress">In Progress</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            
            {/* Date Range Filter */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaCalendarAlt className="text-gray-400" />
              </div>
              <select
                value={selectedDateRange}
                onChange={(e) => setSelectedDateRange(e.target.value)}
                className="pl-10 pr-3 py-2 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D7B49E] focus:border-transparent appearance-none"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Orders List */}
        {isLoading ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="w-16 h-16 mx-auto border-t-4 border-[#D7B49E] border-solid rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-500">Loading your order history...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="w-20 h-20 bg-[#F5F0E8] rounded-full flex items-center justify-center mx-auto mb-4">
              <FaHistory className="text-[#D7B49E] text-3xl" />
            </div>
            <h3 className="text-xl font-medium text-[#2C1A1D] mb-2">No orders found</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {orders.length === 0 
                ? "You haven't placed any orders yet. Browse our menu to place your first order!"
                : "No orders match your current filter criteria. Try adjusting your filters."}
            </p>
            <div className="mt-6">
              {orders.length === 0 ? (
                <Link 
                  to="/menu" 
                  className="inline-flex items-center bg-[#2C1A1D] text-white px-6 py-2 rounded-lg hover:bg-[#3E2723] transition-colors"
                >
                  Browse Menu
                </Link>
              ) : (
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setFilterStatus('all');
                    setSelectedDateRange('all');
                  }}
                  className="inline-flex items-center bg-[#2C1A1D] text-white px-6 py-2 rounded-lg hover:bg-[#3E2723] transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map(order => {
              const statusBadge = getStatusBadge(order.status);
              
              return (
                <div key={order.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                  {/* Order Header */}
                  <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center">
                        <h3 className="font-semibold text-[#2C1A1D]">Order #{order.orderNumber}</h3>
                        <span className={`ml-3 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center ${statusBadge.color}`}>
                          {statusBadge.icon} {statusBadge.text}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1 flex items-center">
                        <FaClock className="mr-1 text-[#D7B49E]" /> {formatDate(order.date)}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Total</p>
                        <p className="font-bold text-[#D7B49E]">${order.total.toFixed(2)}</p>
                      </div>
                      <Link
                        to={`/order-details/${order.id}`}
                        className="inline-flex items-center px-3 py-1.5 border-2 border-[#2C1A1D] text-[#2C1A1D] rounded-lg hover:bg-[#2C1A1D] hover:text-white transition-colors text-sm"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                  
                  {/* Order Summary */}
                  <div className="p-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-4">
                        <div className="bg-[#F5F0E8] rounded-lg p-3">
                          <FaMapMarkerAlt className="text-[#D7B49E]" size={20} />
                        </div>
                      </div>
                      {order ? <div>
                        <p className="text-sm font-medium text-[#2C1A1D]">{order.location.location}</p>
                        <p className="text-xs text-gray-500 mt-1">{order.address || order.location.address}</p>
                      </div> : ""}
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <h4 className="text-sm font-medium text-[#2C1A1D] mb-2">Order Items</h4>
                      <div className="flex flex-wrap gap-2">
                        {order.items.map((item, index) => (
                          <span key={index} className="text-xs bg-[#F5F0E8] text-[#2C1A1D] px-2 py-1 rounded-full">
                            {item.quantity}× {item.name}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-2">
                      <Link 
                        to={`/order-details/${order.id}`}
                        className="text-sm text-[#D7B49E] hover:text-[#2C1A1D] transition-colors"
                      >
                        View Receipt
                      </Link>
                      {order.status === 'delivered' && (
                        <button className="text-sm text-[#D7B49E] hover:text-[#2C1A1D] transition-colors ml-4">
                          Reorder
                        </button>
                      )}
                      {order.status === 'in-progress' && (
                        <Link 
                          to={`/robot?order=${order.id}`}
                          className="text-sm text-[#D7B49E] hover:text-[#2C1A1D] transition-colors ml-4"
                        >
                          Track Delivery
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            
            <div className="text-center text-sm text-gray-500 py-2">
              Showing {filteredOrders.length} of {orders.length} orders
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;