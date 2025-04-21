// src/components/Chatbot.jsx
import { useState, useEffect, useRef } from 'react';
import { 
  FaCommentDots, 
  FaTimes, 
  FaPaperPlane, 
  FaHistory, 
  FaTrash, 
  FaRobot, 
  FaUser,
  FaShoppingCart
} from 'react-icons/fa';
import { getChatHistory, saveMessage, clearChatHistory } from '../utils/chat';
import { useNavigate } from 'react-router-dom';
import OpenAI from 'openai';

// Initialize OpenAI with your API key
const openai = new OpenAI({
  apiKey: "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",
  dangerouslyAllowBrowser: true // Note: In production, you should proxy requests through your backend
});

// Coffee shop product catalog
const PRODUCTS = {
  coffee: [
    { id: 'c1', name: 'Espresso', price: 2.50, description: 'Strong black coffee' },
    { id: 'c2', name: 'Cappuccino', price: 3.50, description: 'Espresso with steamed milk and foam' },
    { id: 'c3', name: 'Latte', price: 3.75, description: 'Espresso with lots of steamed milk' },
    { id: 'c4', name: 'Americano', price: 2.75, description: 'Espresso with hot water' },
    { id: 'c5', name: 'Mocha', price: 4.25, description: 'Espresso with chocolate and steamed milk' }
  ],
  tea: [
    { id: 't1', name: 'Earl Grey', price: 2.25, description: 'Black tea with bergamot flavor' },
    { id: 't2', name: 'Green Tea', price: 2.25, description: 'Traditional green tea' },
    { id: 't3', name: 'Chamomile', price: 2.50, description: 'Herbal tea with calming effects' }
  ],
  pastries: [
    { id: 'p1', name: 'Croissant', price: 2.95, description: 'Buttery, flaky pastry' },
    { id: 'p2', name: 'Chocolate Muffin', price: 3.25, description: 'Rich chocolate muffin' },
    { id: 'p3', name: 'Blueberry Scone', price: 3.50, description: 'Scone with fresh blueberries' }
  ]
};

// Order status options
const ORDER_STATUSES = ['Processing', 'Preparing', 'Out for delivery', 'Delivered'];

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  
  // Load message history when component mounts
  useEffect(() => {
    const history = getChatHistory();
    setMessages(history);
    
    // Group messages by conversation (based on date)
    const convos = groupMessagesByConversation(history);
    setConversations(convos);
    
    // Check for existing order in localStorage
    const savedOrder = localStorage.getItem('currentOrder');
    if (savedOrder) {
      try {
        setCurrentOrder(JSON.parse(savedOrder));
      } catch (e) {
        console.error('Error parsing saved order', e);
      }
    }
  }, []);
  
  // Scroll to the latest message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);
  
  // Group messages by day for conversation history
  const groupMessagesByConversation = (messages) => {
    const groups = {};
    
    messages.forEach(message => {
      const date = new Date(message.timestamp).toLocaleDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    
    return Object.entries(groups).map(([date, msgs]) => ({
      date,
      messages: msgs,
      preview: msgs.find(m => m.sender === 'user')?.text || 'New conversation',
      id: date
    })).sort((a, b) => new Date(b.date) - new Date(a.date));
  };
  
  // Create a new order
  const createOrder = (items) => {
    const order = {
      id: `ORD-${Date.now().toString().slice(-6)}`,
      items: items,
      status: 'Processing',
      timestamp: new Date().toISOString(),
      total: items.reduce((sum, item) => sum + item.price, 0),
      estimatedDelivery: new Date(Date.now() + 20 * 60000).toISOString() // 20 mins from now
    };
    
    setCurrentOrder(order);
    localStorage.setItem('currentOrder', JSON.stringify(order));
    
    return order;
  };
  
  // Process a message to check for ordering intent
  const processOrderIntent = (message) => {
    const lowerMessage = message.toLowerCase();
    
    // Check if this is an order intent
    if (
      (lowerMessage.includes('order') || 
       lowerMessage.includes('buy') || 
       lowerMessage.includes('get') || 
       lowerMessage.includes('purchase')) && 
      (lowerMessage.includes('coffee') || 
       lowerMessage.includes('tea') || 
       lowerMessage.includes('pastry') || 
       lowerMessage.includes('croissant') || 
       lowerMessage.includes('cappuccino'))
    ) {
      // Try to extract product from message
      let foundProducts = [];
      
      // Check each product category
      Object.values(PRODUCTS).forEach(category => {
        category.forEach(product => {
          if (lowerMessage.includes(product.name.toLowerCase())) {
            foundProducts.push(product);
          }
        });
      });
      
      return foundProducts.length > 0 ? foundProducts : null;
    }
    
    // Check for tracking intent
    if (
      (lowerMessage.includes('track') || 
       lowerMessage.includes('where') || 
       lowerMessage.includes('status') || 
       lowerMessage.includes('delivery')) && 
      (lowerMessage.includes('order') || 
       lowerMessage.includes('robot'))
    ) {
      return 'tracking';
    }
    
    return null;
  };
  
  // Get AI response using OpenAI API
  const getAIResponse = async (userInput) => {
    // First check for ordering or tracking intent
    const orderIntent = processOrderIntent(userInput);
    
    if (orderIntent === 'tracking') {
      // Handle tracking request
      if (currentOrder) {
        return {
          id: Date.now().toString(),
          sender: 'bot',
          text: `Your order #${currentOrder.id} is currently ${currentOrder.status}. Estimated delivery time: ${new Date(currentOrder.estimatedDelivery).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}. Would you like to view detailed tracking?`,
          timestamp: new Date().toISOString(),
          action: 'tracking',
          order: currentOrder
        };
      } else {
        return {
          id: Date.now().toString(),
          sender: 'bot',
          text: "I don't see any active orders for you. Would you like to place an order?",
          timestamp: new Date().toISOString()
        };
      }
    } else if (Array.isArray(orderIntent) && orderIntent.length > 0) {
      // Handle order creation
      const order = createOrder(orderIntent);
      
      // Format items as a list
      const itemsList = orderIntent.map(item => `- ${item.name} ($${item.price.toFixed(2)})`).join('\n');
      
      return {
        id: Date.now().toString(),
        sender: 'bot',
        text: `I've placed your order #${order.id}:\n${itemsList}\n\nTotal: $${order.total.toFixed(2)}\n\nYour order is being prepared and will be delivered by our robot soon. Would you like to track your order?`,
        timestamp: new Date().toISOString(),
        action: 'order_created',
        order: order
      };
    }
    
    // If no special intent, use OpenAI
    try {
      // Get recent conversation context (last 5 messages)
      const recentMessages = messages.slice(-5).map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));
      
      // Add current user input
      recentMessages.push({
        role: 'user',
        content: userInput
      });
      
      // Prepare system message with product info
      const productInfo = `
        Our coffee shop offers:
        - Coffee: ${PRODUCTS.coffee.map(p => p.name).join(', ')}
        - Tea: ${PRODUCTS.tea.map(p => p.name).join(', ')}
        - Pastries: ${PRODUCTS.pastries.map(p => p.name).join(', ')}
        
        Users can order these items for delivery by our robot.
        If they ask to track their order, offer to show them the tracking page.
        Current date and time: ${new Date().toLocaleString()}
      `;
      
      // Call OpenAI API
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { 
            role: "system", 
            content: `You are a helpful coffee shop assistant. Be friendly and concise. ${productInfo}` 
          },
          ...recentMessages
        ],
        max_tokens: 150
      });
      
      const responseText = completion.choices[0].message.content.trim();
      
      return {
        id: Date.now().toString(),
        sender: 'bot',
        text: responseText,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching AI response:', error);
      
      // Fallback response
      return {
        id: Date.now().toString(),
        sender: 'bot',
        text: "I'm sorry, I couldn't process your request. Please try again later.",
        timestamp: new Date().toISOString()
      };
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (inputValue.trim() === '') return;
    
    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputValue,
      timestamp: new Date().toISOString()
    };
    
    saveMessage(userMessage);
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    // Get AI response
    try {
      const botResponse = await getAIResponse(inputValue);
      saveMessage(botResponse);
      setMessages(prev => [...prev, botResponse]);
      
      // Handle special actions
      if (botResponse.action === 'tracking' && botResponse.order) {
        // Add a button in a follow-up message to go to tracking
        setTimeout(() => {
          const trackingMessage = {
            id: Date.now().toString(),
            sender: 'bot',
            text: 'Click below to view detailed tracking:',
            timestamp: new Date().toISOString(),
            action: 'tracking_button'
          };
          saveMessage(trackingMessage);
          setMessages(prev => [...prev, trackingMessage]);
        }, 1000);
      }
      
      // Update conversations list
      const updatedHistory = [...messages, userMessage, botResponse];
      setConversations(groupMessagesByConversation(updatedHistory));
    } catch (error) {
      console.error('Error getting chatbot response', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const loadConversation = (conversationDate) => {
    const convo = conversations.find(c => c.date === conversationDate);
    if (convo) {
      setMessages(convo.messages);
      setShowHistory(false);
    }
  };
  
  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all chat history?')) {
      clearChatHistory();
      setMessages([]);
      setConversations([]);
    }
  };
  
  const handleViewTracking = () => {
    // Close chatbot and navigate to tracking page
    setIsOpen(false);
    navigate('/robot-tracker');
  };
  
  // Render message with appropriate icon and styling
  const renderMessage = (message) => {
    return (
      <div 
        key={message.id}
        className={`mb-3 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}
      >
        <div className={`flex items-start ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
          <div className={`rounded-full p-2 mx-2 flex-shrink-0 ${
            message.sender === 'user' 
              ? 'bg-[#4B2E2B] text-[#000]' 
              : 'bg-gray-200 text-gray-700'
          }`}>
            {message.sender === 'user' 
              ? <FaUser size={14} className='text-[#fff]' /> 
              : <FaRobot size={14} />
            }
          </div>
          
          <div>
            <div 
              className={`inline-block rounded-lg px-4 py-2 max-w-[220px] ${
                message.sender === 'user' 
                  ? 'bg-[#4B2E2B] text-[#fff]' 
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {/* If message has action tracking_button, show a button */}
              {message.action === 'tracking_button' ? (
                <div>
                  <p className="mb-2">{message.text}</p>
                  <button 
                    onClick={handleViewTracking}
                    className="bg-coffee-dark hover:bg-opacity-90 text-[#000] py-2 px-4 rounded flex items-center justify-center w-full"
                  >
                    <FaShoppingCart className="mr-2" /> View Tracking
                  </button>
                </div>
              ) : (
                message.text
              )}
            </div>
            <div className="text-xs text-gray-500 mt-1 ml-1">
              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-colors ${
          isOpen ? 'bg-[#4B2E2B] text-[#fff]' : 'bg-[#4B2E2B] text-[#fff]'
        } hover:shadow-xl`}
      >
        {isOpen ? <FaTimes className='cursor-pointer' size={20} /> : <FaCommentDots className='cursor-pointer' size={20} />}
      </button>
      
      {/* Chat window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-80 md:w-96 bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-coffee-dark text-[#000] p-4 flex justify-between items-center">
            <div>
              <h3 className="font-semibold">Coffee Shop Assistant</h3>
              <p className="text-xs text-gray-800">How can I help you today?</p>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => setShowHistory(!showHistory)}
                className="text-[#000] hover:text-gray-400 transition-colors"
                title="View history"
              >
                <FaHistory size={16} />
              </button>
              <button 
                onClick={handleClearHistory}
                className="text-[#000] hover:text-red-300 transition-colors"
                title="Clear history"
              >
                <FaTrash size={16} className='cursor-pointer' />
              </button>
            </div>
          </div>
          
          {/* Current order status - if exists */}
          {currentOrder && !showHistory && (
            <div className="bg-green-50 border-t border-b border-green-100 p-2 text-xs text-green-700 flex items-center">
              <FaShoppingCart className="mr-2" />
              <div>
                Order #{currentOrder.id} • {currentOrder.status} • 
                <button 
                  onClick={handleViewTracking}
                  className="ml-1 text-[#4B2E2B] hover:underline"
                >
                  Track
                </button>
              </div>
            </div>
          )}
          
          {/* Conversation history view */}
          {showHistory ? (
            <div className="h-80 overflow-y-auto p-4 bg-gray-50">
              <h4 className="font-medium text-coffee-dark mb-3">Conversation History</h4>
              {conversations.length === 0 ? (
                <div className="text-center text-gray-500 mt-10">
                  <p>No previous conversations</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {conversations.map(convo => (
                    <div
                      key={convo.id}
                      className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => loadConversation(convo.date)}
                    >
                      <div className="font-medium text-coffee-dark">{convo.date}</div>
                      <div className="text-sm text-gray-500 truncate">{convo.preview}</div>
                      <div className="text-xs text-gray-400 mt-1">{convo.messages.length} messages</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Messages view */
            <div className="h-80 overflow-y-auto p-4 bg-gray-50">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 mt-20">
                  <p className="mb-2">Start a conversation</p>
                  <p className="text-xs text-gray-400">Try asking about our coffee, tea, or ordering a drink!</p>
                </div>
              ) : (
                messages.map(message => renderMessage(message))
              )}
              {isLoading && (
                <div className="text-left mb-3">
                  <div className="flex items-start">
                    <div className="rounded-full p-2 mx-2 bg-gray-200 text-gray-700">
                      <FaRobot size={14} />
                    </div>
                    <div className="inline-block rounded-lg px-4 py-2 bg-gray-100 text-gray-800">
                      <div className="flex space-x-1">
                        <div className="animate-bounce">.</div>
                        <div className="animate-bounce delay-100">.</div>
                        <div className="animate-bounce delay-200">.</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
          
          {/* Input form */}
          <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-gray-200">
            <div className="flex items-center">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-[#4B2E2B] focus:border-[#4B2E2B]"
                disabled={showHistory}
              />
              <button
                type="submit"
                disabled={isLoading || inputValue.trim() === '' || showHistory}
                className={`bg-[#4B2E2B] text-[#fff] p-[11px] rounded-r-lg ${
                  isLoading || inputValue.trim() === '' || showHistory
                    ? 'opacity-80 cursor-not-allowed' 
                    : 'hover:opacity-100'
                }`}
              >
                <FaPaperPlane className='text-[#fff]' size={20} />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;