// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { FaUsers, FaClipboardList, FaShoppingCart, FaRobot, FaChartLine } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import StatCard from '../components/StatCard';
import OrderTimeline from '../components/OrderTimeline';
import { getOrderHistory } from '../utils/orders';

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [historicalData, setHistoricalData] = useState([]);
  const [timeframe, setTimeframe] = useState('30days'); // '7days', '30days', '90days'
  
  useEffect(() => {
    // Load order history
    const orderHistory = getOrderHistory();
    setOrders(orderHistory);
    
    // Load chat history from localStorage
    try {
      const chatHistory = JSON.parse(localStorage.getItem('chatHistory') || '[]');
      setChatMessages(chatHistory);
    } catch (error) {
      console.error('Error loading chat history:', error);
      setChatMessages([]);
    }
    
    // Generate or load historical data
    loadHistoricalData();
  }, []);
  
  // Load or generate historical data based on timeframe
  const loadHistoricalData = (selectedTimeframe = timeframe) => {
    // In a real app, this would come from an API or localStorage
    // For now, we'll generate realistic sample data
    const days = selectedTimeframe === '7days' ? 7 : selectedTimeframe === '30days' ? 30 : 90;
    const data = generateHistoricalData(days);
    setHistoricalData(data);
    setTimeframe(selectedTimeframe);
  };
  
  // Generate historical data (in a real app, this would be actual data from localStorage or an API)
  const generateHistoricalData = (days) => {
    const data = [];
    const now = new Date();
    
    // Create a base trend with some randomness
    let orderTrend = 5; // Starting point
    let revenueTrend = 100;
    
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(now.getDate() - i);
      
      // Add some realistic variation with weekly patterns
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      
      // Weekends typically have more orders
      const weekendFactor = isWeekend ? 1.5 : 1;
      
      // Add some randomness but maintain a trend
      orderTrend = Math.max(1, orderTrend + (Math.random() - 0.48) * 2);
      revenueTrend = Math.max(50, revenueTrend + (Math.random() - 0.48) * 20);
      
      const dailyOrders = Math.floor(orderTrend * weekendFactor);
      const revenue = (revenueTrend * weekendFactor).toFixed(2);
      const customerCount = Math.floor(dailyOrders * (1 + Math.random() * 0.5));
      
      data.push({
        date: date.toISOString().split('T')[0],
        orders: dailyOrders,
        revenue: parseFloat(revenue),
        customers: customerCount
      });
    }
    
    return data;
  };
  
  // Calculate statistics
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalItems = orders.reduce((sum, order) => sum + order.items.length, 0);
  const activeRobots = 1; // Mock for demo
  
  // Calculate period-over-period changes for stats
  const calculateChange = (metric) => {
    if (historicalData.length === 0) return 0;
    
    const midpoint = Math.floor(historicalData.length / 2);
    const recentData = historicalData.slice(midpoint);
    const previousData = historicalData.slice(0, midpoint);
    
    const recentSum = recentData.reduce((sum, item) => sum + item[metric], 0);
    const previousSum = previousData.reduce((sum, item) => sum + item[metric], 0);
    
    if (previousSum === 0) return 100;
    return Math.round(((recentSum - previousSum) / previousSum) * 100);
  };
  
  // Format date for chart display
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  return (
    <div className="py-6 mt-24">
      <h1 className="text-4xl font-bold text-coffee-dark mb-6">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Orders" 
          value={totalOrders}
          icon={<FaClipboardList />}
          color="bg-blue-500"
          percentage={calculateChange('orders')}
        />
        <StatCard 
          title="Revenue" 
          value={`${totalRevenue.toFixed(2)} €`}
          icon={<FaChartLine />}
          color="bg-green-500"
          percentage={calculateChange('revenue')}
        />
        <StatCard 
          title="Items Sold" 
          value={totalItems}
          icon={<FaShoppingCart />}
          color="bg-amber-500"
          percentage={calculateChange('orders')}
        />
        <StatCard 
          title="Active Robots" 
          value={activeRobots}
          icon={<FaRobot />}
          color="bg-purple-500"
          percentage={Math.floor(Math.random() * 20) - 5}
        />
      </div>
      
      {/* Charts Section */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-coffee-latte mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg">Sales Performance</h3>
          <div className="flex space-x-2">
            <button 
              onClick={() => loadHistoricalData('7days')}
              className={`px-3 py-1 rounded text-sm ${timeframe === '7days' ? 'bg-coffee-dark text-white' : 'bg-gray-100'}`}
            >
              7 Days
            </button>
            <button 
              onClick={() => loadHistoricalData('30days')}
              className={`px-3 py-1 rounded text-sm ${timeframe === '30days' ? 'bg-coffee-dark text-white' : 'bg-gray-100'}`}
            >
              30 Days
            </button>
            <button 
              onClick={() => loadHistoricalData('90days')}
              className={`px-3 py-1 rounded text-sm ${timeframe === '90days' ? 'bg-coffee-dark text-white' : 'bg-gray-100'}`}
            >
              90 Days
            </button>
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={historicalData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatDate}
              tick={{ fontSize: 12 }}
              tickCount={7}
            />
            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
            <Tooltip 
              formatter={(value, name) => [
                name === 'revenue' ? `€${value}` : value,
                name === 'revenue' ? 'Revenue' : 'Orders'
              ]}
              labelFormatter={(label) => `Date: ${formatDate(label)}`}
            />
            <Legend />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="orders" 
              stroke="#8884d8" 
              name="Orders"
              strokeWidth={2}
              dot={{ r: 2 }}
              activeDot={{ r: 6 }}
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="revenue" 
              stroke="#82ca9d" 
              name="Revenue (€)"
              strokeWidth={2}
              dot={{ r: 2 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <OrderTimeline orders={orders} />
        </div>
        
        {/* Customer Distribution Chart */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-coffee-latte">
          <h3 className="font-semibold text-lg mb-4">Customer Activity</h3>
          
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={historicalData.slice(-7)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip 
                formatter={(value) => [`${value}`, 'Customers']}
                labelFormatter={(label) => `Date: ${formatDate(label)}`}
              />
              <Bar dataKey="customers" fill="#4B2E2B" name="Customers" />
            </BarChart>
          </ResponsiveContainer>
          
          {/* Chat History */}
          <h3 className="font-semibold text-lg my-4">Recent Chats</h3>
          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {chatMessages.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No recent messages
              </div>
            ) : (
              chatMessages.map((message) => (
                <div 
                  key={message.id}
                  className="p-3 rounded-lg border flex flex-col"
                  style={{
                    borderColor: message.sender === 'user' ? '#4B2E2B' : '#8FB996',
                    backgroundColor: message.sender === 'user' ? '#FFF1E0' : '#F5F5F5'
                  }}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">
                      {message.sender === 'user' ? 'Customer' : 'Chatbot'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(message.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm">{message.text}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;