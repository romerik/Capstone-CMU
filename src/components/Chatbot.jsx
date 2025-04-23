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
  FaShoppingCart,
  FaLocationArrow,
  FaExpand,
  FaVolumeMute,
  FaVolumeUp
} from 'react-icons/fa';
import { getChatHistory, saveMessage, clearChatHistory } from '../utils/chat';
import { useNavigate } from 'react-router-dom';
import OpenAI from 'openai';

// // UI Components
// import MenuProductCard from './MenuProductCard';
// import LocationOption from './LocationOption';
// import OrderSummary from './OrderSummary';
// import TrackingButton from './TrackingButton';
// import CartSummary from './CartSummary';

// Chatbot component
const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasPlayedWelcome, setHasPlayedWelcome] = useState(false);
  
  const messagesEndRef = useRef(null);
  const audioRef = useRef(null);
  const navigate = useNavigate();
  
  // Initialize OpenAI client
  const openai = useRef(
    new OpenAI({
      apiKey: "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",
      dangerouslyAllowBrowser: true
    })
  ).current;
  
  // Load message history and initialize data
  useEffect(() => {
    const history = getChatHistory();
    setMessages(history);
    
    // Group messages by conversation
    const convos = groupMessagesByConversation(history);
    setConversations(convos);
    
    // Check for existing order in localStorage
    const savedOrder = JSON.parse(localStorage.getItem('currentOrder'));
    if (savedOrder) {
      setCurrentOrder(savedOrder);
    }
    
    // Play welcome sound and send welcome message if user data exists
    const userData = JSON.parse(localStorage.getItem('userInfo')) || {};
    if (userData.name && !hasPlayedWelcome && !isMuted) {
      setHasPlayedWelcome(true);
      
      setTimeout(() => {
        // Play welcome sound
        if (audioRef.current && !isMuted) {
          audioRef.current.play().catch(e => console.error("Audio play failed:", e));
        }
        
        // Send welcome message
        const welcomeMessage = {
          id: Date.now().toString(),
          sender: 'bot',
          text: userData.isReturningUser 
            ? `Welcome back, ${userData.name}! Great to see you again at Neo Café. How can I help you today?` 
            : `Hello ${userData.name}! Welcome to Neo Café. How can I help you today?`,
          timestamp: new Date().toISOString()
        };
        
        saveMessage(welcomeMessage);
        setMessages(prev => [...prev, welcomeMessage]);
        
        // Update user as returning user
        if (!userData.isReturningUser) {
          localStorage.setItem('userInfo', JSON.stringify({
            ...userData,
            isReturningUser: true
          }));
        }
      }, 500);
    }
  }, []);
  
  // Scroll to latest message
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
  
  // Define OpenAI tools
  const getOpenAITools = () => [
    {
      type: "function",
      function: {
        name: "menu_tool",
        description: "Manages the user's cart for Neo Café products",
        parameters: {
          type: "object",
          properties: {
            action: {
              type: "string",
              enum: ["get_products", "add_to_cart", "remove_from_cart", "get_cart", "clear_cart", "calculate_total"],
              description: "The action to perform with the menu tool"
            },
            product_id: {
              type: "string",
              description: "ID of the product to add or remove (only for add_to_cart and remove_from_cart actions)"
            },
            product_name: {
              type: "string",
              description: "Name of the product to add to cart (used when product_id is not available)"
            },
            quantity: {
              type: "integer",
              description: "Number of items to add to cart (only for add_to_cart action)"
            },
            show_menu: {
              type: "boolean",
              description: "Whether to display the full menu to the user"
            }
          },
          required: ["action"]
        }
      }
    },
    {
      type: "function",
      function: {
        name: "welcome_tool",
        description: "Manages user personalization and welcome experience",
        parameters: {
          type: "object",
          properties: {
            action: {
              type: "string",
              enum: ["get_user_info", "update_user_info", "play_welcome_sound"],
              description: "The action to perform with the welcome tool"
            },
            user_name: {
              type: "string",
              description: "Name of the user to store (only for update_user_info action)"
            },
            preferences: {
              type: "array",
              items: {
                type: "string"
              },
              description: "User preferences to store (only for update_user_info action)"
            }
          },
          required: ["action"]
        }
      }
    },
    {
      type: "function",
      function: {
        name: "order_tool",
        description: "Handles order creation and management",
        parameters: {
          type: "object",
          properties: {
            action: {
              type: "string",
              enum: ["create_order", "get_order", "update_order_status", "get_order_history"],
              description: "The action to perform with the order tool"
            },
            order_id: {
              type: "string",
              description: "ID of the order to update (only for update_order_status action)"
            },
            new_status: {
              type: "string",
              enum: ["Processing", "Preparing", "Out for delivery", "Delivered"],
              description: "New status for the order (only for update_order_status action)"
            },
            create_from_cart: {
              type: "boolean",
              description: "Whether to create an order from the current cart (only for create_order action)"
            }
          },
          required: ["action"]
        }
      }
    },
    {
      type: "function",
      function: {
        name: "confirmation_tool",
        description: "Handles order confirmation process",
        parameters: {
          type: "object",
          properties: {
            action: {
              type: "string",
              enum: ["confirm_order", "cancel_order", "ask_confirmation"],
              description: "The action to perform with the confirmation tool"
            },
            order_id: {
              type: "string",
              description: "ID of the order to confirm or cancel"
            }
          },
          required: ["action"]
        }
      }
    },
    {
      type: "function",
      function: {
        name: "location_tool",
        description: "Manages delivery location selection",
        parameters: {
          type: "object",
          properties: {
            action: {
              type: "string",
              enum: ["get_delivery_locations", "set_delivery_location", "show_location_options"],
              description: "The action to perform with the location tool"
            },
            order_id: {
              type: "string",
              description: "ID of the order to update with location (only for set_delivery_location action)"
            },
            location_id: {
              type: "string",
              description: "ID of the selected location (only for set_delivery_location action)"
            }
          },
          required: ["action"]
        }
      }
    },
    {
      type: "function",
      function: {
        name: "navigation_tool",
        description: "Handles redirections to other pages",
        parameters: {
          type: "object",
          properties: {
            action: {
              type: "string",
              enum: ["redirect_to_cart", "redirect_to_tracking", "redirect_to_menu"],
              description: "The action to perform with the navigation tool"
            }
          },
          required: ["action"]
        }
      }
    },
    {
      type: "function",
      function: {
        name: "usual_order_tool",
        description: "Provides intelligent order recommendations based on user history",
        parameters: {
          type: "object",
          properties: {
            action: {
              type: "string",
              enum: ["get_frequent_orders", "get_time_recommendations", "create_usual_order"],
              description: "The action to perform with the usual order tool"
            }
          },
          required: ["action"]
        }
      }
    },
    {
      type: "function",
      function: {
        name: "ui_tool",
        description: "Controls the chat UI enhancements",
        parameters: {
          type: "object",
          properties: {
            action: {
              type: "string",
              enum: ["toggle_chat_size", "toggle_sound_mute"],
              description: "The action to perform with the UI tool"
            }
          },
          required: ["action"]
        }
      }
    }
  ];
  
  // Implement tool function handlers
  const handleToolFunctions = async (toolCalls) => {
    const results = [];
    
    for (const toolCall of toolCalls) {
      const functionName = toolCall.function.name;
      const args = JSON.parse(toolCall.function.arguments);
      
      let result;
      
      switch (functionName) {
        case "menu_tool":
          result = await handleMenuTool(args);
          break;
        case "welcome_tool":
          result = await handleWelcomeTool(args);
          break;
        case "order_tool":
          result = await handleOrderTool(args);
          break;
        case "confirmation_tool":
          result = await handleConfirmationTool(args);
          break;
        case "location_tool":
          result = await handleLocationTool(args);
          break;
        case "navigation_tool":
          result = await handleNavigationTool(args);
          break;
        case "usual_order_tool":
          result = await handleUsualOrderTool(args);
          break;
        case "ui_tool":
          result = await handleUITool(args);
          break;
        default:
          result = { error: `Unknown function: ${functionName}` };
      }
      
      results.push({
        tool_call_id: toolCall.id,
        output: JSON.stringify(result)
      });
    }
    
    return results;
  };
  
  // Handle menu tool functions
  const handleMenuTool = async (args) => {
    const { action, product_id, product_name, quantity = 1, show_menu } = args;
    
    // Retrieve products from localStorage
    const getProducts = () => {
      return JSON.parse(localStorage.getItem('products')) || {
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
    };
    
    // Get cart from localStorage
    const getCart = () => {
      return JSON.parse(localStorage.getItem('cart')) || [];
    };
    
    // Save cart to localStorage
    const saveCart = (cart) => {
      localStorage.setItem('cart', JSON.stringify(cart));
      return cart;
    };
    
    switch (action) {
      case "get_products":
        return { products: getProducts(), success: true };
        
      case "add_to_cart": {
        const products = getProducts();
        const cart = getCart();
        
        // Find product either by ID or by name
        let productToAdd = null;
        
        if (product_id) {
          // Search by ID across all categories
          for (const category of Object.values(products)) {
            const found = category.find(p => p.id === product_id);
            if (found) {
              productToAdd = found;
              break;
            }
          }
        } else if (product_name) {
          // Search by name across all categories
          const normalizedName = product_name.toLowerCase();
          for (const category of Object.values(products)) {
            const found = category.find(p => p.name.toLowerCase() === normalizedName || 
                                          p.name.toLowerCase().includes(normalizedName));
            if (found) {
              productToAdd = found;
              break;
            }
          }
        }
        
        // If product not found
        if (!productToAdd) {
          return { 
            success: false, 
            error: "Product not found",
            products: getProducts()
          };
        }
        
        // Check if item already exists in cart
        const existingItemIndex = cart.findIndex(item => item.id === productToAdd.id);
        
        if (existingItemIndex >= 0) {
          // Update quantity if item exists
          cart[existingItemIndex].quantity += quantity;
        } else {
          // Add new item with quantity
          cart.push({
            ...productToAdd,
            quantity
          });
        }
        
        saveCart(cart);
        
        return {
          success: true,
          cart: cart,
          product: productToAdd,
          message: `Added ${quantity}x ${productToAdd.name} to your cart`
        };
      }
        
      case "remove_from_cart": {
        if (!product_id) {
          return { success: false, error: "Product ID is required" };
        }
        
        const cart = getCart();
        const updatedCart = cart.filter(item => item.id !== product_id);
        
        saveCart(updatedCart);
        
        return {
          success: true,
          cart: updatedCart,
          message: "Item removed from cart"
        };
      }
        
      case "get_cart":
        return { 
          cart: getCart(),
          success: true,
          total: getCart().reduce((sum, item) => sum + (item.price * item.quantity), 0)
        };
        
      case "clear_cart":
        saveCart([]);
        return { 
          success: true, 
          message: "Cart cleared",
          cart: []
        };
        
      case "calculate_total": {
        const cart = getCart();
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        return { 
          success: true,
          total: total,
          cart: cart
        };
      }
        
      default:
        return { success: false, error: `Unknown action: ${action}` };
    }
  };
  
  // Handle welcome tool functions
  const handleWelcomeTool = async (args) => {
    const { action, user_name, preferences } = args;
    
    switch (action) {
      case "get_user_info":
        return { 
          success: true, 
          user_info: JSON.parse(localStorage.getItem('userInfo')) || {
            name: '',
            preferences: [],
            isReturningUser: false
          }
        };
        
      case "update_user_info": {
        const currentInfo = JSON.parse(localStorage.getItem('userInfo')) || {};
        const updatedInfo = {
          ...currentInfo,
          ...(user_name ? { name: user_name } : {}),
          ...(preferences ? { preferences } : {})
        };
        
        localStorage.setItem('userInfo', JSON.stringify(updatedInfo));
        
        return { success: true, user_info: updatedInfo };
      }
        
      case "play_welcome_sound":
        if (audioRef.current && !isMuted) {
          try {
            await audioRef.current.play();
            return { success: true, message: "Welcome sound played" };
          } catch (error) {
            return { success: false, error: "Failed to play welcome sound" };
          }
        }
        return { success: false, error: "Audio not available or muted" };
        
      default:
        return { success: false, error: `Unknown action: ${action}` };
    }
  };
  
  // Handle order tool functions
  const handleOrderTool = async (args) => {
    const { action, order_id, new_status, create_from_cart } = args;
    
    switch (action) {
      case "create_order": {
        if (create_from_cart) {
          const cart = JSON.parse(localStorage.getItem('cart')) || [];
          
          if (cart.length === 0) {
            return { success: false, error: "Cart is empty" };
          }
          
          const order = {
            id: `ORD-${Date.now().toString().slice(-6)}`,
            items: cart,
            status: 'Processing',
            timestamp: new Date().toISOString(),
            total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            estimatedDelivery: new Date(Date.now() + 20 * 60000).toISOString()
          };
          
          localStorage.setItem('currentOrder', JSON.stringify(order));
          setCurrentOrder(order);
          
          return { success: true, order: order };
        }
        
        return { success: false, error: "No cart specified" };
      }
        
      case "get_order": {
        const currentOrder = JSON.parse(localStorage.getItem('currentOrder'));
        return { 
          success: true, 
          order: currentOrder,
          has_order: !!currentOrder
        };
      }
        
      case "update_order_status": {
        if (!order_id || !new_status) {
          return { success: false, error: "Order ID and new status are required" };
        }
        
        const currentOrder = JSON.parse(localStorage.getItem('currentOrder'));
        
        if (!currentOrder || currentOrder.id !== order_id) {
          return { success: false, error: "Order not found" };
        }
        
        currentOrder.status = new_status;
        localStorage.setItem('currentOrder', JSON.stringify(currentOrder));
        setCurrentOrder(currentOrder);
        
        return { success: true, order: currentOrder };
      }
        
      case "get_order_history":
        return { 
          success: true, 
          history: JSON.parse(localStorage.getItem('orderHistory')) || []
        };
        
      default:
        return { success: false, error: `Unknown action: ${action}` };
    }
  };
  
  // Handle confirmation tool functions
  const handleConfirmationTool = async (args) => {
    const { action, order_id } = args;
    
    switch (action) {
      case "confirm_order": {
        if (!order_id) {
          return { success: false, error: "Order ID is required" };
        }
        
        const currentOrder = JSON.parse(localStorage.getItem('currentOrder'));
        
        if (!currentOrder || currentOrder.id !== order_id) {
          return { success: false, error: "Order not found" };
        }
        
        const confirmedOrder = {
          ...currentOrder,
          status: 'Confirmed',
          confirmedAt: new Date().toISOString()
        };
        
        localStorage.setItem('currentOrder', JSON.stringify(confirmedOrder));
        setCurrentOrder(confirmedOrder);
        
        // Add to order history
        const history = JSON.parse(localStorage.getItem('orderHistory')) || [];
        history.push(confirmedOrder);
        localStorage.setItem('orderHistory', JSON.stringify(history));
        
        // Clear cart
        localStorage.setItem('cart', JSON.stringify([]));
        
        return { success: true, order: confirmedOrder };
      }
        
      case "cancel_order": {
        if (!order_id) {
          return { success: false, error: "Order ID is required" };
        }
        
        const currentOrder = JSON.parse(localStorage.getItem('currentOrder'));
        
        if (!currentOrder || currentOrder.id !== order_id) {
          return { success: false, error: "Order not found" };
        }
        
        localStorage.removeItem('currentOrder');
        setCurrentOrder(null);
        
        return { success: true, message: "Order cancelled" };
      }
        
      case "ask_confirmation": {
        return { 
          success: true,
          show_confirmation: true,
          message: "Confirmation requested"
        };
      }
        
      default:
        return { success: false, error: `Unknown action: ${action}` };
    }
  };
  
  // Handle location tool functions
  const handleLocationTool = async (args) => {
    const { action, order_id, location_id } = args;
    
    // Get delivery locations from localStorage
    const getDeliveryLocations = () => {
      return JSON.parse(localStorage.getItem('deliveryLocations')) || [
        { id: 'loc1', name: 'Campus Main Building', eta: 10 },
        { id: 'loc2', name: 'Library', eta: 15 },
        { id: 'loc3', name: 'Student Center', eta: 12 },
        { id: 'loc4', name: 'Dormitory A', eta: 18 },
        { id: 'loc5', name: 'Dormitory B', eta: 20 }
      ];
    };
    
    switch (action) {
      case "get_delivery_locations":
        return { 
          success: true,
          locations: getDeliveryLocations()
        };
        
      case "set_delivery_location": {
        if (!order_id || !location_id) {
          return { success: false, error: "Order ID and location ID are required" };
        }
        
        const locations = getDeliveryLocations();
        const selectedLocation = locations.find(loc => loc.id === location_id);
        
        if (!selectedLocation) {
          return { success: false, error: "Location not found" };
        }
        
        const currentOrder = JSON.parse(localStorage.getItem('currentOrder'));
        
        if (!currentOrder || currentOrder.id !== order_id) {
          return { success: false, error: "Order not found" };
        }
        
        const updatedOrder = {
          ...currentOrder,
          deliveryLocation: selectedLocation,
          estimatedDelivery: new Date(Date.now() + selectedLocation.eta * 60000).toISOString()
        };
        
        localStorage.setItem('currentOrder', JSON.stringify(updatedOrder));
        setCurrentOrder(updatedOrder);
        
        return { 
          success: true,
          order: updatedOrder,
          location: selectedLocation
        };
      }
        
      case "show_location_options":
        return {
          success: true,
          show_locations: true,
          locations: getDeliveryLocations()
        };
        
      default:
        return { success: false, error: `Unknown action: ${action}` };
    }
  };
  
  // Handle navigation tool functions
  const handleNavigationTool = async (args) => {
    const { action } = args;
    
    switch (action) {
      case "redirect_to_cart":
        // Close the chatbot and navigate to cart page
        setIsOpen(false);
        navigate('/cart');
        return { success: true, message: "Redirecting to cart" };
        
      case "redirect_to_tracking":
        // Close the chatbot and navigate to tracking page
        setIsOpen(false);
        navigate('/robot');
        return { success: true, message: "Redirecting to tracking" };
        
      case "redirect_to_menu":
        // Close the chatbot and navigate to menu page
        setIsOpen(false);
        navigate('/menu');
        return { success: true, message: "Redirecting to menu" };
        
      default:
        return { success: false, error: `Unknown action: ${action}` };
    }
  };
  
  // Handle usual order tool functions
  const handleUsualOrderTool = async (args) => {
    const { action } = args;
    
    switch (action) {
      case "get_frequent_orders": {
        const orderHistory = JSON.parse(localStorage.getItem('orderHistory')) || [];
        
        if (orderHistory.length === 0) {
          return { success: true, frequent_orders: [], has_history: false };
        }
        
        // Count occurrences of each product
        const productCounts = {};
        
        orderHistory.forEach(order => {
          order.items.forEach(item => {
            if (!productCounts[item.id]) {
              productCounts[item.id] = {
                ...item,
                count: 0,
                lastOrdered: null
              };
            }
            productCounts[item.id].count += item.quantity;
            productCounts[item.id].lastOrdered = order.timestamp;
          });
        });
        
        // Convert to array and sort by count
        const frequentProducts = Object.values(productCounts)
          .sort((a, b) => b.count - a.count);
          
        return { 
          success: true,
          frequent_orders: frequentProducts.slice(0, 3),
          has_history: true
        };
      }
        
      case "get_time_recommendations": {
        const hour = new Date().getHours();
        const dayOfWeek = new Date().getDay();
        
        // Time-based recommendations
        let timeBasedRecs = [];
        
        if (hour >= 6 && hour < 11) {
          // Morning recommendations
          timeBasedRecs = [
            {id: 'c2', name: 'Cappuccino', recommendation: 'Perfect breakfast coffee'},
            {id: 'p1', name: 'Croissant', recommendation: 'Fresh baked this morning'}
          ];
        } else if (hour >= 11 && hour < 14) {
          // Lunch time
          timeBasedRecs = [
            {id: 'c3', name: 'Latte', recommendation: 'Great with lunch'},
            {id: 'p2', name: 'Chocolate Muffin', recommendation: 'Midday treat'}
          ];
        } else if (hour >= 14 && hour < 18) {
          // Afternoon
          timeBasedRecs = [
            {id: 'c4', name: 'Americano', recommendation: 'Afternoon pick-me-up'},
            {id: 't2', name: 'Green Tea', recommendation: 'Light afternoon refreshment'}
          ];
        } else {
          // Evening
          timeBasedRecs = [
            {id: 't3', name: 'Chamomile', recommendation: 'Relaxing evening tea'},
            {id: 'p3', name: 'Blueberry Scone', recommendation: 'Evening snack'}
          ];
        }
        
        // Weekend vs Weekday recommendations
        if (dayOfWeek === 0 || dayOfWeek === 6) {
          // Weekend special
          timeBasedRecs.push({
            id: 'c5', name: 'Mocha', recommendation: 'Weekend special'
          });
        }
        
        return { 
          success: true,
          recommendations: timeBasedRecs,
          time_of_day: hour < 12 ? 'morning' : (hour < 18 ? 'afternoon' : 'evening'),
          is_weekend: dayOfWeek === 0 || dayOfWeek === 6
        };
      }
        
      case "create_usual_order": {
        const frequentOrdersResult = await handleUsualOrderTool({ action: "get_frequent_orders" });
        
        if (!frequentOrdersResult.has_history || frequentOrdersResult.frequent_orders.length === 0) {
          return { 
            success: false, 
            error: "No order history found",
            has_recommendations: true,
            recommendations: (await handleUsualOrderTool({ action: "get_time_recommendations" })).recommendations
          };
        }
        
        // Add top item to cart
        const topItem = frequentOrdersResult.frequent_orders[0];
        const usualItems = [{
          ...topItem,
          quantity: 1
        }];
        
        localStorage.setItem('cart', JSON.stringify(usualItems));
        
        return { 
          success: true,
          items: usualItems,
          message: `Added your usual ${topItem.name} to cart`
        };
      }
        
      default:
        return { success: false, error: `Unknown action: ${action}` };
    }
  };
  
  // Handle UI tool functions
  const handleUITool = async (args) => {
    const { action } = args;
    
    switch (action) {
      case "toggle_chat_size":
        setIsExpanded(!isExpanded);
        return { 
          success: true,
          is_expanded: !isExpanded,
          message: !isExpanded ? "Chat expanded" : "Chat collapsed"
        };
        
      case "toggle_sound_mute":
        setIsMuted(!isMuted);
        return { 
          success: true,
          is_muted: !isMuted,
          message: !isMuted ? "Sound muted" : "Sound unmuted"
        };
        
      default:
        return { success: false, error: `Unknown action: ${action}` };
    }
  };
  
  // Submit user message and get AI response
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
    
    try {
      // Get conversation history for context
      const recentMessages = messages.slice(-5).map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));
      
      // Add current user message
      recentMessages.push({
        role: 'user',
        content: inputValue
      });
      
      // Get user info for personalization
      const userData = JSON.parse(localStorage.getItem('userInfo')) || {};
      
      // Create initial OpenAI request
      const chatCompletion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are a helpful Neo Café assistant. Be friendly and concise.
              
              Current date and time: ${new Date().toLocaleString()}
              ${userData.name ? `User's name: ${userData.name}` : ''}
              ${userData.preferences && userData.preferences.length > 0 ? 
                `User's preferences: ${userData.preferences.join(', ')}` : ''}
                
              Always use tools when appropriate to interact with the system.
              When adding items to cart, make sure to find the correct product name or ID.
              When managing orders, always use the order ID for updates.
              `
          },
          ...recentMessages
        ],
        tools: getOpenAITools(),
        tool_choice: "auto"
      });
      
      // Process response
      let responseToUser = chatCompletion.choices[0].message;
      
      // Handle tool calls if any
      if (responseToUser.tool_calls && responseToUser.tool_calls.length > 0) {
        // Execute tool calls
        const toolResults = await handleToolFunctions(responseToUser.tool_calls);
        
        // Get final response with tool results
        const finalResponse = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: `You are a helpful Neo Café assistant. Be friendly and concise.`
            },
            ...recentMessages,
            responseToUser,
            ...toolResults.map(result => ({
              role: "tool",
              tool_call_id: result.tool_call_id,
              content: result.output
            }))
          ]
        });
        
        responseToUser = finalResponse.choices[0].message;
      }
      
      // Create bot response
      const botResponse = {
        id: Date.now().toString(),
        sender: 'bot',
        text: responseToUser.content,
        timestamp: new Date().toISOString(),
        // Store any tool call results for rendering
        toolResults: responseToUser.tool_calls ? await handleToolFunctions(responseToUser.tool_calls) : null
      };
      
      saveMessage(botResponse);
      setMessages(prev => [...prev, botResponse]);
      
      // Update conversations list
      const updatedHistory = [...messages, userMessage, botResponse];
      setConversations(groupMessagesByConversation(updatedHistory));
      
      // Update current order if changed
      const savedOrder = JSON.parse(localStorage.getItem('currentOrder'));
      if (savedOrder && (!currentOrder || savedOrder.id !== currentOrder.id)) {
        setCurrentOrder(savedOrder);
      }
    } catch (error) {
      console.error('Error getting chatbot response:', error);
      
      // Add error message
      const errorResponse = {
        id: Date.now().toString(),
        sender: 'bot',
        text: "I'm sorry, I couldn't process your request. Please try again later.",
        timestamp: new Date().toISOString()
      };
      
      saveMessage(errorResponse);
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Clear chat history
  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all chat history?')) {
      clearChatHistory();
      setMessages([]);
      setConversations([]);
    }
  };
  
  // Load a specific conversation
  const loadConversation = (conversationDate) => {
    const convo = conversations.find(c => c.date === conversationDate);
    if (convo) {
      setMessages(convo.messages);
      setShowHistory(false);
    }
  };
  
  // Render a bot message
  const renderBotMessage = (message) => {
    // Check if message has special tool results that need custom rendering
    if (message.toolResults) {
      // Parse the tool results to determine what UI components to show
      const toolResponses = message.toolResults.map(result => JSON.parse(result.output));
      
      // Find specific results we might want to render specially
      const locationResult = toolResponses.find(r => r.show_locations);
      const cartResult = toolResponses.find(r => r.cart && r.cart.length > 0);
      const orderResult = toolResponses.find(r => r.order);
      
      // Render custom components based on tool results
      return (
        <div className="flex items-start flex-row">
          <div className="rounded-full p-2 mx-2 flex-shrink-0 bg-gray-200 text-gray-700">
            <FaRobot size={14} />
          </div>
          
          <div>
            <div className="inline-block rounded-lg px-4 py-2 bg-gray-100 text-gray-800 max-w-[280px]">
              {/* Render the message text */}
              <div className="mb-3">
                {message.text.split('\n').map((text, i) => (
                  <p key={i} className={i > 0 ? 'mt-1' : ''}>{text}</p>
                ))}
              </div>
              
              {/* Render location selection if present */}
              {locationResult && (
                <div className="mt-3">
                  <p className="font-medium mb-2">Select a delivery location:</p>
                  <div className="grid grid-cols-1 gap-2">
                    {locationResult.locations.map(location => (
                      <button
                        key={location.id}
                        onClick={() => handleLocationTool({
                          action: "set_delivery_location",
                          order_id: orderResult?.order?.id,
                          location_id: location.id
                        })}
                        className="bg-coffee-dark hover:bg-opacity-90 text-white py-2 px-3 rounded flex items-center justify-between"
                      >
                        <span>{location.name}</span>
                        <span className="text-xs bg-white text-coffee-dark rounded-full px-2 py-1">
                          {location.eta} min
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Render cart if present */}
              {cartResult && (
                <div className="mt-3">
                  <p className="font-medium mb-2">Your cart:</p>
                  <div className="bg-white rounded p-2">
                    {cartResult.cart.map(item => (
                      <div key={item.id} className="flex justify-between items-center py-1">
                        <span>{item.quantity}x {item.name}</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="border-t mt-2 pt-2 font-medium flex justify-between">
                      <span>Total:</span>
                      <span>${cartResult.total ? cartResult.total.toFixed(2) : '0.00'}</span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleNavigationTool({ action: "redirect_to_cart" })}
                    className="bg-coffee-dark hover:bg-opacity-90 text-white py-2 px-4 rounded flex items-center justify-center w-full mt-2"
                  >
                    <FaShoppingCart className="mr-2" /> View Cart
                  </button>
                </div>
              )}
              
              {/* Render tracking button if we have an order */}
              {orderResult && orderResult.order && (
                <button 
                  onClick={() => handleNavigationTool({ action: "redirect_to_tracking" })}
                  className="bg-coffee-dark hover:bg-opacity-90 text-white py-2 px-4 rounded flex items-center justify-center w-full mt-3"
                >
                  <FaLocationArrow className="mr-2" /> Track Order
                </button>
              )}
            </div>
            
            <div className="text-xs text-gray-500 mt-1 ml-1">
              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
      );
    }
    
    // Default rendering for normal messages
    return (
      <div className="flex items-start flex-row">
        <div className="rounded-full p-2 mx-2 flex-shrink-0 bg-gray-200 text-gray-700">
          <FaRobot size={14} />
        </div>
        
        <div>
          <div className="inline-block rounded-lg px-4 py-2 bg-gray-100 text-gray-800 max-w-[280px]">
            {message.text.split('\n').map((text, i) => (
              <p key={i} className={i > 0 ? 'mt-1' : ''}>{text}</p>
            ))}
          </div>
          <div className="text-xs text-gray-500 mt-1 ml-1">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    );
  };
  
  // Render a user message
  const renderUserMessage = (message) => {
    return (
      <div className="flex items-start flex-row-reverse">
        <div className="rounded-full p-2 mx-2 flex-shrink-0 bg-[#4B2E2B] text-[#000]">
          <FaUser size={14} className="text-[#fff]" />
        </div>
        
        <div>
          <div className="inline-block rounded-lg px-4 py-2 bg-[#4B2E2B] text-[#fff] max-w-[280px]">
            {message.text}
          </div>
          <div className="text-xs text-gray-500 mt-1 mr-1 text-right">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    );
  };
  
  // Render message based on sender
  const renderMessage = (message) => {
    return (
      <div 
        key={message.id}
        className={`mb-3 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}
      >
        {message.sender === 'user' 
          ? renderUserMessage(message)
          : renderBotMessage(message)
        }
      </div>
    );
  };
  
  return (
    <>
      {/* Audio element for welcome sound */}
      <audio ref={audioRef} src={"https://www.myinstants.com/media/sounds/pop${2}.mp3"} />
      
      <div className="fixed bottom-6 right-6 z-[99999999]">
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
          <div 
            className={`absolute bottom-20 right-0 ${isExpanded 
              ? 'w-96 md:w-[50vw] h-[70vh]' // Slightly wider when expanded
              : 'w-80 md:w-96'
            } bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200`}
          >
            {/* Header */}
            <div className="bg-coffee-dark text-[#000] p-4 flex justify-between items-center">
              <div>
                <h3 className="font-semibold">Neo Café Assistant</h3>
                <p className="text-xs text-gray-800">How can I help you today?</p>
              </div>
              <div className="flex space-x-8">
                <button 
                  onClick={() => handleUITool({ action: "toggle_sound_mute" })}
                  className="text-[#000] hover:text-gray-400 transition-colors"
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? <FaVolumeMute size={16} /> : <FaVolumeUp size={16} />}
                </button>
                <button 
                  onClick={() => handleUITool({ action: "toggle_chat_size" })}
                  className="text-[#000] hover:text-gray-400 transition-colors"
                  title={isExpanded ? "Collapse" : "Expand"}
                >
                  <FaExpand size={16} />
                </button>
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
                    onClick={() => handleNavigationTool({ action: "redirect_to_tracking" })}
                    className="ml-1 text-[#4B2E2B] hover:underline"
                  >
                    Track
                  </button>
                </div>
              </div>
            )}
            
            {/* Conversation history view */}
            {showHistory ? (
              <div className="h-[55vh] overflow-y-auto p-4 bg-gray-50">
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
              <div className="h-[55vh] overflow-y-auto p-4 bg-gray-50">
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
    </>
  );
};

// Note: These components are mentioned in the code but would be implemented separately
// Here are simple implementations for reference:

// MenuProductCard component
const MenuProductCard = ({ product, onAddToCart }) => (
  <div className="p-3 border rounded-lg mb-2">
    <div className="flex justify-between">
      <div>
        <h4 className="font-medium">{product.name}</h4>
        <p className="text-sm text-gray-600">{product.description}</p>
      </div>
      <div className="text-right">
        <p className="font-medium">${product.price.toFixed(2)}</p>
        <button 
          onClick={() => onAddToCart(product)}
          className="bg-coffee-dark text-white text-xs px-2 py-1 rounded mt-1"
        >
          Add
        </button>
      </div>
    </div>
  </div>
);

// LocationOption component
const LocationOption = ({ location, onSelect }) => (
  <button
    onClick={() => onSelect(location.id)}
    className="bg-coffee-dark hover:bg-opacity-90 text-white py-2 px-3 rounded flex items-center justify-between w-full mb-2"
  >
    <span>{location.name}</span>
    <span className="text-xs bg-white text-coffee-dark rounded-full px-2 py-1">
      {location.eta} min
    </span>
  </button>
);

// OrderSummary component
const OrderSummary = ({ order }) => (
  <div className="bg-white rounded p-3 mb-3">
    <h4 className="font-medium mb-2">Order #{order.id}</h4>
    {order.items.map(item => (
      <div key={item.id} className="flex justify-between text-sm py-1">
        <span>{item.quantity}x {item.name}</span>
        <span>${(item.price * item.quantity).toFixed(2)}</span>
      </div>
    ))}
    <div className="border-t mt-2 pt-2 font-medium flex justify-between">
      <span>Total:</span>
      <span>${order.total.toFixed(2)}</span>
    </div>
    <div className="mt-2 text-sm text-gray-500">
      <div>Status: {order.status}</div>
      {order.deliveryLocation && (
        <div>Delivery to: {order.deliveryLocation.name}</div>
      )}
      <div>
        Estimated delivery: {new Date(order.estimatedDelivery).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  </div>
);

// TrackingButton component
const TrackingButton = ({ onClick }) => (
  <button 
    onClick={onClick}
    className="bg-coffee-dark hover:bg-opacity-90 text-white py-2 px-4 rounded flex items-center justify-center w-full"
  >
    <FaLocationArrow className="mr-2" /> View Tracking
  </button>
);

// CartSummary component
const CartSummary = ({ cart, total, onViewCart }) => (
  <div className="bg-white rounded p-2 mb-2">
    {cart.map(item => (
      <div key={item.id} className="flex justify-between items-center py-1">
        <span>{item.quantity}x {item.name}</span>
        <span>${(item.price * item.quantity).toFixed(2)}</span>
      </div>
    ))}
    <div className="border-t mt-2 pt-2 font-medium flex justify-between">
      <span>Total:</span>
      <span>${total.toFixed(2)}</span>
    </div>
    <button 
      onClick={onViewCart}
      className="bg-coffee-dark hover:bg-opacity-90 text-white py-2 px-4 rounded flex items-center justify-center w-full mt-2"
    >
      <FaShoppingCart className="mr-2" /> View Cart
    </button>
  </div>
);

export default Chatbot;