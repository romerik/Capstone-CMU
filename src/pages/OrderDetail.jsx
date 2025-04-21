// src/pages/OrderDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaMapMarkerAlt, FaClock, FaClipboardCheck, FaRobot, FaReceipt, FaExclamationTriangle, FaPrint, FaShoppingBag, FaCreditCard, FaInfoCircle } from 'react-icons/fa';
import { getOrderById } from '../utils/orders';

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showReceipt, setShowReceipt] = useState(false);
  
  useEffect(() => {
    // Fetch order details
    setTimeout(() => {
      const orderDetails = getOrderById(orderId);
      
      if (orderDetails) {
        setOrder(orderDetails);
      }
      
      setIsLoading(false);
    }, 600);
  }, [orderId]);
  
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleString('en-US', options);
  };
  
  // Get status badge styling
  const getStatusInfo = (status) => {
    switch (status) {
      case 'completed':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: <FaClipboardCheck className="mr-2" />,
          text: 'Completed',
          description: 'This order has been successfully completed.'
        };
      case 'in-progress':
        return {
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: <FaRobot className="mr-2" />,
          text: 'In Progress',
          description: 'Your order is being prepared and will be ready soon.'
        };
      case 'delivered':
        return {
          color: 'bg-purple-100 text-purple-800 border-purple-200',
          icon: <FaShoppingBag className="mr-2" />,
          text: 'Delivered',
          description: 'This order has been delivered successfully.'
        };
      case 'cancelled':
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: <FaExclamationTriangle className="mr-2" />,
          text: 'Cancelled',
          description: 'This order was cancelled.'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: <FaClock className="mr-2" />,
          text: status,
          description: 'Order status information.'
        };
    }
  };
  
  if (isLoading) {
    return (
      <div className="bg-[#FFF8F0] min-h-screen py-16 px-4 sm:px-6 lg:px-8 flex justify-center">
        <div className="w-16 h-16 border-t-4 border-[#D7B49E] border-solid rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!order) {
    return (
      <div className="bg-[#FFF8F0] min-h-screen py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-8 text-center">
          <FaExclamationTriangle className="w-16 h-16 text-[#D7B49E] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#2C1A1D] mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-6">
            We couldn't find the order you're looking for. It may have been removed or the link might be incorrect.
          </p>
          <Link 
            to="/order-history" 
            className="inline-flex items-center bg-[#2C1A1D] text-white px-6 py-3 rounded-lg hover:bg-[#3E2723] transition-colors"
          >
            <FaArrowLeft className="mr-2" /> Back to Order History
          </Link>
        </div>
      </div>
    );
  }
  
  const statusInfo = getStatusInfo(order.status);
  
  return (
    <div className="bg-[#FFF8F0] min-h-screen mt-24 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate('/order-history')}
            className="mr-3 text-[#2C1A1D] hover:text-[#D7B49E] transition-colors flex items-center"
          >
            <FaArrowLeft className="mr-2" />
          </button>
          <h1 className="text-2xl font-bold text-[#2C1A1D]">Order Details</h1>
        </div>
        
        {/* Order Header */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center">
              <div>
                <div className="flex items-center mb-2">
                  <h2 className="font-bold text-xl text-[#2C1A1D]">Order #{order.orderNumber}</h2>
                  <span className={`ml-3 px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color} flex items-center`}>
                    {statusInfo.icon} {statusInfo.text}
                  </span>
                </div>
                <p className="text-gray-600">{formatDate(order.date)}</p>
              </div>
              
              <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
                {order.status === 'in-progress' && (
                  <Link 
                    to={`/robot?order=${order.id}`}
                    className="inline-flex items-center px-4 py-2 bg-[#2C1A1D] text-white rounded-lg hover:bg-[#3E2723] transition-colors"
                  >
                    <FaRobot className="mr-2" /> Track Order
                  </Link>
                )}
                
                <button
                  onClick={() => setShowReceipt(!showReceipt)}
                  className="inline-flex items-center px-4 py-2 border-2 border-[#2C1A1D] text-[#2C1A1D] rounded-lg hover:bg-[#2C1A1D] hover:text-white transition-colors"
                >
                  <FaReceipt className="mr-2" /> {showReceipt ? 'Hide Receipt' : 'View Receipt'}
                </button>
              </div>
            </div>
          </div>
          
          {/* Status Information */}
          <div className={`p-4 ${statusInfo.color} border-l-4 mx-6 my-4 rounded-r-lg`}>
            <div className="flex">
              <div className="flex-shrink-0">
                <FaInfoCircle className="h-5 w-5" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{statusInfo.description}</p>
              </div>
            </div>
          </div>
          
          {/* Order Information */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Delivery Details</h3>
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <FaMapMarkerAlt className="h-5 w-5 text-[#D7B49E]" />
                </div>
                <div className="ml-3">
                  {/* <p className="font-medium">{order.location}</p> */}
                  {/* Cas où order.address est un objet */}
                    {order.location && typeof order.location === 'object' ? (
                    <p className="text-xs text-gray-500 mt-1">
                        {order.location.location}
                    </p>
                    ) : (
                    <p className="text-xs text-gray-500 mt-1">{order.location}</p>
                    )}
                  <p className="text-gray-600 text-sm">{order.address}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Payment</h3>
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <FaCreditCard className="h-5 w-5 text-[#D7B49E]" />
                </div>
                <div className="ml-3">
                  <p className="font-medium">Credit Card</p>
                  <p className="text-gray-600 text-sm">**** **** **** 4242</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Contact</h3>
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <svg className="h-5 w-5 text-[#D7B49E]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="font-medium">help@neocafe.com</p>
                  <p className="text-gray-600 text-sm">Contact us for support</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Order Items */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div className="p-4 bg-[#2C1A1D] text-white">
            <h2 className="font-semibold">Order Items</h2>
          </div>
          
          <div className="divide-y divide-gray-100">
            {order.items.map((item, index) => (
              <div key={index} className="p-4 flex items-center">
                <div className="w-16 h-16 bg-[#F5F0E8] rounded-lg overflow-hidden flex-shrink-0">
                  <img 
                    src={`/images/coffee-items/${item.id}.jpg`} 
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/espresso.jpg';
                    }}
                  />
                </div>
                
                <div className="ml-4 flex-1">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium text-[#2C1A1D]">{item.name}</h3>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-[#2C1A1D]">${(item.price * item.quantity).toFixed(2)}</p>
                      <p className="text-xs text-gray-500">${item.price.toFixed(2)} each</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Receipt (conditionally shown) */}
        {showReceipt && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
            <div className="p-4 bg-gray-100 flex justify-between items-center">
              <h2 className="font-semibold text-[#2C1A1D] flex items-center">
                <FaReceipt className="mr-2 text-[#D7B49E]" /> Receipt
              </h2>
              <button 
                onClick={() => window.print()} 
                className="text-[#D7B49E] hover:text-[#2C1A1D] transition-colors flex items-center text-sm"
              >
                <FaPrint className="mr-1" /> Print
              </button>
            </div>
            
            <div className="p-6">
              <div className="text-center mb-6">
                <h3 className="font-bold text-xl mb-1">Neo Cafe</h3>
                <p className="text-gray-600">123 Coffee Street, New York, NY 10001</p>
                <p className="text-gray-600">Tel: (555) 123-4567</p>
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Order #:</span>
                  <span>{order.orderNumber}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Date:</span>
                  <span>{formatDate(order.date)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Location:</span>
                  <span>{order.location}</span>
                </div>
              </div>
              
              <div className="border-t border-b border-dashed border-gray-200 py-4 mb-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 font-medium">Item</th>
                      <th className="text-center py-2 font-medium">Qty</th>
                      <th className="text-right py-2 font-medium">Price</th>
                      <th className="text-right py-2 font-medium">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, index) => (
                      <tr key={index} className="border-b border-gray-100 last:border-b-0">
                        <td className="py-2">{item.name}</td>
                        <td className="py-2 text-center">{item.quantity}</td>
                        <td className="py-2 text-right">${item.price.toFixed(2)}</td>
                        <td className="py-2 text-right">${(item.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Delivery Fee:</span>
                  {order.deliveryFee > 0 ? (
                    <span>${order.deliveryFee.toFixed(2)}</span>
                  ) : (
                    <span>Free</span>
                  )}
                </div>
                <div className="flex justify-between text-sm">
                  <span>Taxes:</span>
                  <span>${order.taxes.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold mt-2 pt-2 border-t border-gray-200">
                  <span>Total:</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="text-center text-sm text-gray-500">
                <p>Thank you for your order!</p>
                <p className="mt-1">www.neocafe.com</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Actions */}
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            to="/menu"
            className="inline-flex items-center px-4 py-2 bg-[#2C1A1D] text-white rounded-lg hover:bg-[#3E2723] transition-colors"
          >
            <FaShoppingBag className="mr-2" /> Order Again
          </Link>
          
          <Link
            to="/contact"
            className="inline-flex items-center px-4 py-2 border-2 border-[#2C1A1D] text-[#2C1A1D] rounded-lg hover:bg-[#2C1A1D] hover:text-white transition-colors"
          >
            Need Help?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;