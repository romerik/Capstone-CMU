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
  FaVolumeUp,
  FaPlus,
  FaMinus,
  FaStar,
  FaGlobe
} from 'react-icons/fa';
import { getChatHistory, saveMessage, clearChatHistory } from '../utils/chat';
import { useNavigate } from 'react-router-dom';
import OpenAI from 'openai';

import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';

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
  const [language, setLanguage] = useState('en'); // Default language is English
  
  const messagesEndRef = useRef(null);
  const audioRef = useRef(null);
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
    
  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
  }, []);
  
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

    // Initialiser le menu si non existant
    const menuItems = localStorage.getItem('menuItems');
    if (!menuItems) {
      const defaultMenu = [
        // ☕️ Drinks
        {
          id: '1',
          name: 'Espresso',
          price: 2.5,
          category: 'drinks',
          image: '/espresso.jpg',
          description: 'Intense and bold coffee shot with rich crema',
          isNew: false,
          isFeatured: true
        },
        {
          id: '2',
          name: 'Cappuccino',
          price: 4.0,
          category: 'drinks',
          image: '/cappuccino.jpg',
          description: 'Espresso with steamed milk and velvety foam',
          isNew: false,
          isFeatured: true
        },
        {
          id: '3',
          name: 'Latte',
          price: 4.5,
          category: 'drinks',
          image: '/latte.jpg',
          description: 'Espresso with steamed milk and a light layer of foam',
          isNew: false,
          isFeatured: false
        },
        {
          id: '4',
          name: 'Americano',
          price: 3.0,
          category: 'drinks',
          image: '/americano.jpg',
          description: 'Espresso diluted with hot water for a milder flavor',
          isNew: false,
          isFeatured: false
        },
        {
          id: '5',
          name: 'Macchiato',
          price: 3.5,
          category: 'drinks',
          image: '/macchiato.jpg',
          description: 'Espresso "stained" with a touch of foamed milk',
          isNew: false,
          isFeatured: false
        },
        {
          id: '6',
          name: 'Flat White',
          price: 4.0,
          category: 'drinks',
          image: '/flatwhite.jpg',
          description: 'Smooth espresso with steamed milk and minimal foam',
          isNew: false,
          isFeatured: false
        },
        {
          id: '7',
          name: 'Mocha',
          price: 4.5,
          category: 'drinks',
          image: '/mocha.jpg',
          description: 'Espresso with chocolate, steamed milk and whipped cream',
          isNew: false,
          isFeatured: true
        },
        {
          id: '8',
          name: 'Cold Brew',
          price: 4.0,
          category: 'drinks',
          image: '/coldbrew.jpg',
          description: 'Smooth cold coffee brewed over 12+ hours',
          isNew: false,
          isFeatured: false
        },
        {
          id: '9',
          name: 'Chai Latte',
          price: 4.0,
          category: 'drinks',
          image: '/chai-latte.jpg',
          description: 'Spiced tea blend with steamed milk and foam',
          isNew: false,
          isFeatured: false
        },
        {
          id: '10',
          name: 'Green Tea',
          price: 3.0,
          category: 'drinks',
          image: '/green-tea.jpg',
          description: 'Aromatic green tea brewed to perfection',
          isNew: false,
          isFeatured: false
        },
      
        // 🥐 Food
        {
          id: '11',
          name: 'Butter Croissant',
          price: 3.0,
          category: 'food',
          image: '/croissant.jpg',
          description: 'Flaky and buttery French pastry',
          isNew: false,
          isFeatured: true
        },
        {
          id: '12',
          name: 'Blueberry Muffin',
          price: 3.5,
          category: 'food',
          image: '/blueberry-muffin.jpg',
          description: 'Moist muffin filled with blueberries',
          isNew: false,
          isFeatured: false
        },
        {
          id: '13',
          name: 'Chocolate Muffin',
          price: 3.5,
          category: 'food',
          image: '/chocolate-muffin.jpg',
          description: 'Rich and fluffy chocolate muffin',
          isNew: false,
          isFeatured: false
        },
        {
          id: '14',
          name: 'Avocado Toast',
          price: 6.0,
          category: 'food',
          image: '/avocado-toast.jpg',
          description: 'Multigrain toast topped with smashed avocado',
          isNew: false,
          isFeatured: true
        },
        {
          id: '15',
          name: 'Breakfast Sandwich',
          price: 5.5,
          category: 'food',
          image: '/breakfast-sandwich.jpg',
          description: 'Egg, cheese and sausage on toasted bun',
          isNew: true,
          isFeatured: false
        },
        {
          id: '16',
          name: 'Chicken Panini',
          price: 7.5,
          category: 'food',
          image: '/chicken-panini.jpg',
          description: 'Grilled panini with chicken, cheese, and veggies',
          isNew: true,
          isFeatured: true
        },
        {
          id: '17',
          name: 'Vegetable Wrap',
          price: 6.5,
          category: 'food',
          image: '/vegetable-wrap.jpg',
          description: 'Fresh veggie wrap with hummus and greens',
          isNew: false,
          isFeatured: false
        },
      
        // 🎂 Specials / Hero Items
        {
          id: '18',
          name: 'Pumpkin Spice Latte',
          price: 5.0,
          category: 'specials',
          image: '/pumpkin-spice.jpg',
          description: 'Seasonal favorite with pumpkin, spices, and espresso',
          isNew: true,
          isFeatured: true
        }
      ];
      localStorage.setItem('menuItems', JSON.stringify(defaultMenu));
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
              enum: ["get_products", "add_to_cart", "remove_from_cart", "get_cart", "clear_cart", "calculate_total", "update_quantity"],
              description: "The action to perform with the menu tool"
            },
            product_id: {
              type: "string",
              description: "ID of the product to add or remove (only for add_to_cart, remove_from_cart, and update_quantity actions)"
            },
            product_name: {
              type: "string",
              description: "Name of the product to add to cart (used when product_id is not available)"
            },
            quantity: {
              type: "integer",
              description: "Number of items to add to cart (only for add_to_cart action) or new quantity to set (for update_quantity action)"
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
              enum: ["create_order", "get_order", "update_order_status", "get_order_history", "place_order"],
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
              enum: ["toggle_chat_size", "toggle_sound_mute", "change_language"],
              description: "The action to perform with the UI tool"
            },
            language: {
              type: "string",
              enum: ["en", "fr", "es", "de", "it", "ja", "zh", "ar", "sw","rw "],
              description: "Language code to switch to (only for change_language action)"
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
      let args = {};
      
      try {
        args = JSON.parse(toolCall.function.arguments);
      } catch (error) {
        console.error("Error parsing tool arguments:", error);
        results.push({
          tool_call_id: toolCall.id,
          output: JSON.stringify({ success: false, error: "Invalid arguments format" })
        });
        continue;
      }
      
      let result;
      
      try {
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
      } catch (error) {
        console.error(`Error executing ${functionName}:`, error);
        result = { success: false, error: `Function execution failed: ${error.message || 'Unknown error'}` };
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
      const menuItems = JSON.parse(localStorage.getItem('menuItems'));
      
      if (!menuItems) {
        return [];
      }
      
      return menuItems;
    };
    
    // Get cart from localStorage
    const getCart = () => {
      return JSON.parse(localStorage.getItem('cart')) || [];
    };
    
    // Save cart to localStorage
    const saveCart = (cart) => {
      localStorage.setItem('cart', JSON.stringify(cart));
      
      // Trigger UI update
      const event = new CustomEvent('cartUpdated', { 
        detail: { cart: cart } 
      });
      window.dispatchEvent(event);
      
      return cart;
    };
    
    // Find product by ID or name
    const findProduct = (products, id, name) => {
      if (!products || !Array.isArray(products)) {
        return null;
      }
      
      if (id) {
        return products.find(p => p.id === id);
      }
      
      if (name) {
        const normalizedName = name.toLowerCase();
        // Try exact match first
        let product = products.find(p => p.name.toLowerCase() === normalizedName);
        
        // Then try partial match
        if (!product) {
          product = products.find(p => p.name.toLowerCase().includes(normalizedName));
        }
        
        return product;
      }
      
      return null;
    };
    
    switch (action) {
      case "get_products":
        return { products: getProducts(), success: true };
        
      case "add_to_cart": {
        const products = getProducts();
        const cart = getCart();
        
        // Find product either by ID or by name
        let productToAdd = findProduct(products, product_id, product_name);
        
        if (!productToAdd) {
          return { 
            success: false, 
            error: "Product not found",
            products: products
          };
        }
        
        // Check if item already exists in cart
        const existingItemIndex = cart.findIndex(item => item.id === productToAdd.id);
        
        if (existingItemIndex >= 0) {
          // Update quantity if item exists
          cart[existingItemIndex].quantity += parseInt(quantity);
        } else {
          // Add new item with quantity
          cart.push({
            ...productToAdd,
            quantity: parseInt(quantity)
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
      
      case "update_quantity": {
        if (!product_id) {
          return { success: false, error: "Product ID is required" };
        }
        
        const cart = getCart();
        const existingItemIndex = cart.findIndex(item => item.id === product_id);
        
        if (existingItemIndex === -1) {
          return { success: false, error: "Product not found in cart" };
        }
        
        const product = cart[existingItemIndex];
        
        // If quantity is 0 or less, remove the item
        if (quantity <= 0) {
          cart.splice(existingItemIndex, 1);
        } else {
          // Otherwise, update the quantity
          cart[existingItemIndex].quantity = quantity;
        }
        
        saveCart(cart);
        
        return {
          success: true,
          cart: cart,
          message: quantity <= 0 
            ? `Removed ${product.name} from your cart` 
            : `Updated ${product.name} quantity to ${quantity}`
        };
      }
        
      case "remove_from_cart": {
        if (!product_id && !product_name) {
          return { success: false, error: "Product ID or name is required" };
        }
        
        const cart = getCart();
        let updatedCart = [...cart];
        let removedItem = null;
        
        if (product_id) {
          removedItem = cart.find(item => item.id === product_id);
          updatedCart = cart.filter(item => item.id !== product_id);
        } else if (product_name) {
          const normalizedName = product_name.toLowerCase();
          removedItem = cart.find(item => item.name.toLowerCase().includes(normalizedName));
          updatedCart = cart.filter(item => !item.name.toLowerCase().includes(normalizedName));
        }
        
        saveCart(updatedCart);
        
        return {
          success: true,
          cart: updatedCart,
          message: removedItem 
            ? `${removedItem.name} removed from cart` 
            : "Item removed from cart"
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
    const { action, order_id, new_status } = args;
    
    switch (action) {
      case "create_order":
      case "place_order": {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        if (cart.length === 0) {
          return { 
            success: false, 
            error: "Cart is empty",
            message: "Your cart is empty. Please add items before placing an order."
          };
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
        
        // Get locations to show immediately
        const locationsResult = await handleLocationTool({ action: "get_delivery_locations" });

        // Vider le panier après avoir créé la commande
        localStorage.setItem('cart', JSON.stringify([]));

        // Envoyer un événement pour mettre à jour l'interface
        const event = new CustomEvent('cartUpdated', { 
          detail: { cart: [] } 
        });
        window.dispatchEvent(event);
        
        return { 
          success: true, 
          order: order,
          show_locations: true,
          locations: locationsResult.locations,
          message: "Order created successfully. Please select a delivery location."
        };
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
        const event = new CustomEvent('cartUpdated', { 
          detail: { cart: [] } 
        });
        window.dispatchEvent(event);

        
        // If no delivery location, get locations to show immediately
        if (!confirmedOrder.deliveryLocation) {
          const locationsResult = await handleLocationTool({ action: "get_delivery_locations" });
          
          return { 
            success: true, 
            order: confirmedOrder,
            show_locations: true,
            locations: locationsResult.locations,
            message: "Order confirmed. Please select a delivery location."
          };
        }
        
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
    
    // Get delivery locations from localStorage or defaults
    const getDeliveryLocations = () => {
      return JSON.parse(localStorage.getItem('deliveryLocations')) || [
        { id: 'loc1', name: 'Office 1', eta: 10, icon: '🏢' },
        { id: 'loc2', name: 'Office 2', eta: 12, icon: '🏢' },
        { id: 'loc3', name: 'Office 3', eta: 15, icon: '🏢' },
        { id: 'loc4', name: 'Office 4', eta: 18, icon: '🏢' },
        { id: 'loc5', name: 'Office 5', eta: 20, icon: '🏢' },
        { id: 'loc6', name: 'Counter', eta: 5, icon: '🪑' },
        { id: 'loc7', name: 'Outdoor Patio', eta: 8, icon: '🌳' },
        { id: 'loc8', name: 'Delivery', eta: 25, icon: '🏠' }
      ];
    };
    
    switch (action) {
      case "get_delivery_locations":
        return { 
          success: true,
          locations: getDeliveryLocations()
        };
        
        case "set_delivery_location": {
          if (!location_id) {
            return { success: false, error: "Location ID is required" };
          }
          
          const locations = getDeliveryLocations();
          const selectedLocation = locations.find(loc => loc.id === location_id);
          
          if (!selectedLocation) {
            return { success: false, error: "Location not found" };
          }
          
          let currentOrder = JSON.parse(localStorage.getItem('currentOrder'));
          
          // If order_id is provided, verify it matches the current order
          if (order_id && currentOrder && currentOrder.id !== order_id) {
            return { success: false, error: "Order ID mismatch" };
          }
          
          // If no current order but location is selected, create an order from cart
          if (!currentOrder) {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            
            if (cart.length === 0) {
              return { success: false, error: "Cart is empty, cannot create order" };
            }
            
            currentOrder = {
              id: `ORD-${Date.now().toString().slice(-6)}`,
              items: cart,
              status: 'Processing',
              timestamp: new Date().toISOString(),
              total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
            };
          }
          
          const updatedOrder = {
            ...currentOrder,
            deliveryLocation: selectedLocation,
            estimatedDelivery: new Date(Date.now() + selectedLocation.eta * 60000).toISOString()
          };
          
          localStorage.setItem('currentOrder', JSON.stringify(updatedOrder));
          setCurrentOrder(updatedOrder);

          localStorage.setItem('cart', JSON.stringify([]));
          const event = new CustomEvent('cartUpdated', { 
            detail: { cart: [] } 
          });
          window.dispatchEvent(event);

          fetch('https://2e19-41-216-98-178.ngrok-free.app/api/delivery/start', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ interface_name: "en7" })
          })
          .then(response => response.json())
          .then(data => {
            console.log('Tracking started:', data)
            navigate('/robot');
          })
          .catch(error => console.error('Error starting tracking:', error));
          
          return { 
            success: true,
            order: updatedOrder,
            location: selectedLocation,
            message: `Delivery location set to ${selectedLocation.name}. Estimated delivery time: ${selectedLocation.eta} minutes.`
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
          if (order.items && Array.isArray(order.items)) {
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
          }
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
            {id: '2', name: 'Cappuccino', recommendation: 'Perfect breakfast coffee', price: 4.0},
            {id: '11', name: 'Croissant', recommendation: 'Fresh baked this morning', price: 3.0}
          ];
        } else if (hour >= 11 && hour < 14) {
          // Lunch time
          timeBasedRecs = [
            {id: '3', name: 'Latte', recommendation: 'Great with lunch', price: 4.5},
            {id: '11', name: 'Croissant', recommendation: 'Fresh and flaky', price: 3.0}
          ];
        } else if (hour >= 14 && hour < 18) {
          // Afternoon
          timeBasedRecs = [
            {id: '1', name: 'Espresso', recommendation: 'Afternoon pick-me-up', price: 2.5},
            {id: '11', name: 'Croissant', recommendation: 'Afternoon snack', price: 3.0}
          ];
        } else {
          // Evening
          timeBasedRecs = [
            {id: '3', name: 'Latte', recommendation: 'Evening comfort', price: 4.5},
            {id: '11', name: 'Croissant', recommendation: 'Evening treat', price: 3.0}
          ];
        }
        
        // Weekend vs Weekday recommendations
        if (dayOfWeek === 0 || dayOfWeek === 6) {
          // Weekend special
          timeBasedRecs.push({
            id: '2', name: 'Cappuccino', recommendation: 'Weekend special', price: 4.0
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
        
        // Trigger UI update
        const event = new CustomEvent('cartUpdated', { 
          detail: { cart: usualItems } 
        });
        window.dispatchEvent(event);
        
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
    const { action, language: newLanguage } = args;
    
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
      
      case "change_language":
        if (newLanguage) {
          setLanguage(newLanguage);
          return {
            success: true,
            language: newLanguage,
            message: `Language changed to ${getLanguageName(newLanguage)}`
          };
        }
        return {
          success: false,
          error: "No language specified"
        };
        
      default:
        return { success: false, error: `Unknown action: ${action}` };
    }
  };

  // Helper function to get language name from code
  const getLanguageName = (code) => {
    const languageMap = {
      'en': 'English',
      'fr': 'French',
      'es': 'Spanish',
      'de': 'German',
      'it': 'Italian',
      'ja': 'Japanese',
      'zh': 'Chinese',
      'ar': 'Arabic',
      'sw': "Swahili",
      'rw': "Kinyarwanda"
    };
    return languageMap[code] || code;
  };
  
  // Get available languages
  const getAvailableLanguages = () => {
    return [
      { code: 'en', name: 'English' },
      { code: 'fr', name: 'Français' },
      { code: 'es', name: 'Español' },
      { code: 'de', name: 'Deutsch' },
      { code: 'it', name: 'Italiano' },
      { code: 'ja', name: '日本語' },
      { code: 'zh', name: '中文' },
      { code: 'ar', name: 'العربية' },
      { code: 'sw', name: 'Swahili' },
      { code: 'rw', name: "Kinyarwanda" }
    ];
  };
  
  // Add event listener for cart updates
  useEffect(() => {
    const handleCartUpdated = (event) => {
      const updatedCart = event.detail.cart;
      
      setMessages(prev => {
        // Find the message containing the cart and update it
        const newMessages = [...prev];
        
        for (let i = newMessages.length - 1; i >= 0; i--) {
          if (newMessages[i].toolResults) {
            const toolResponses = newMessages[i].toolResults.map(result => {
              try {
                const output = JSON.parse(result.output);
                if (output.cart) {
                  // Update the cart
                  const newOutput = { 
                    ...output, 
                    cart: updatedCart,
                    total: updatedCart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
                  };
                  return { ...result, output: JSON.stringify(newOutput) };
                }
                return result;
              } catch (e) {
                console.error("Error updating cart in tool result:", e);
                return result;
              }
            });
            
            if (toolResponses.some(r => {
              try {
                return JSON.parse(r.output).cart;
              } catch (e) {
                return false;
              }
            })) {
              newMessages[i] = { ...newMessages[i], toolResults: toolResponses };
              break;
            }
          }
        }
        
        return newMessages;
      });
    };
    
    window.addEventListener('cartUpdated', handleCartUpdated);
    return () => window.removeEventListener('cartUpdated', handleCartUpdated);
  }, []);
  
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
      
      // Get current cart and order info for context
      const currentCartInfo = await handleMenuTool({ action: "get_cart" });
      const currentOrderInfo = await handleOrderTool({ action: "get_order" });
      
      // Create initial OpenAI request
      const chatCompletion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a helpful Neo Café assistant. Be friendly, concise, and personalized.
              
              Current date and time: ${new Date().toLocaleString()}
              Current language: ${getLanguageName(language)}
              ${userData.name ? `User's name: ${userData.name}` : ''}
              ${userData.preferences && userData.preferences.length > 0 ? 
                `User's preferences: ${userData.preferences.join(', ')}` : ''}
                
              Cart status: ${currentCartInfo.cart.length > 0 ? 
                `Contains ${currentCartInfo.cart.length} items. Total: $${currentCartInfo.total.toFixed(2)}` : 
                'Empty'}
              
              Order status: ${currentOrderInfo.has_order ? 
                `Order ${currentOrderInfo.order.id} - Status: ${currentOrderInfo.order.status}` : 
                'No active order'}

              Location list: $ {[
                { id: 'loc1', name: 'Office 1', eta: 10, icon: '🏢' },
                { id: 'loc2', name: 'Office 2', eta: 12, icon: '🏢' },
                { id: 'loc3', name: 'Office 3', eta: 15, icon: '🏢' },
                { id: 'loc4', name: 'Office 4', eta: 18, icon: '🏢' },
                { id: 'loc5', name: 'Office 5', eta: 20, icon: '🏢' },
                { id: 'loc6', name: 'Counter', eta: 5, icon: '🪑' },
                { id: 'loc7', name: 'Outdoor Patio', eta: 8, icon: '🌳' },
                { id: 'loc8', name: 'Delivery', eta: 25, icon: '🏠' }
              ]}
                
              IMPORTANT INSTRUCTIONS:
              - Always use tools when appropriate to interact with the system.
              - When user wants to add multiple items, use the correct quantity in the menu_tool action.
              - When user asks to remove or modify quantities, use the specific product_id or product_name.
              - If user mentions placing, completing, or finalizing an order, use order_tool with action "place_order".
              - When a user confirms an order, automatically show location options.
              - Your responses should be in the user's chosen language (${language}).
              
              You can help users switch languages using the ui_tool with the change_language action.
              Format your responses using Markdown for better readability.
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
        try {
          // Execute tool calls
          const toolResults = await handleToolFunctions(responseToUser.tool_calls);
          
          // Check if there are locations to show from tool results
          const hasLocationOptions = toolResults.some(result => {
            try {
              const output = JSON.parse(result.output);
              return output.show_locations === true;
            } catch (e) {
              return false;
            }
          });
          
          // If order was created or confirmed but no location options shown,
          // add location options automatically
          const needsLocationOptions = toolResults.some(result => {
            try {
              const output = JSON.parse(result.output);
              if (output.success && output.order && !output.show_locations && 
                  (output.order.status === 'Processing' || output.order.status === 'Confirmed') && 
                  !output.order.deliveryLocation) {
                return true;
              }
              return false;
            } catch (e) {
              return false;
            }
          });
          
          if (needsLocationOptions && !hasLocationOptions) {
            // Add location options
            const locationResult = await handleLocationTool({ action: "show_location_options" });
            toolResults.push({
              tool_call_id: `location-${Date.now()}`,
              output: JSON.stringify(locationResult)
            });
          }
          
          // Get final response with tool results
          const finalResponse = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
              {
                role: "system",
                content: `You are a helpful Neo Café assistant. Be friendly, concise, and personalized. 
                Respond in the user's chosen language (${language}).
                
                If locations are being shown, always encourage the user to select a delivery location.`
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
        } catch (error) {
          console.error("Error processing tool calls:", error);
          throw new Error("Failed to process tools: " + (error.message || "Unknown error"));
        }
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
      try {
        // Parse the tool results to determine what UI components to show
        const toolResponses = message.toolResults.map(result => {
          try {
            return JSON.parse(result.output);
          } catch (e) {
            console.error("Error parsing tool result:", e);
            return {};
          }
        });
        
        // Find specific results we might want to render specially
        const locationResult = toolResponses.find(r => r.show_locations);
        const cartResult = toolResponses.find(r => r.cart && r.cart.length > 0);
        const orderResult = toolResponses.find(r => r.order);
        const usualOrderResult = toolResponses.find(r => r.items && r.items.length > 0);
        
        // Render custom components based on tool results
        return (
          <div className="flex items-start flex-row">
            <div className="rounded-full p-2 mx-2 flex-shrink-0 bg-gray-200 text-gray-700">
              <FaRobot size={14} />
            </div>
            
            <div>
              <div className="inline-block rounded-lg px-4 py-2 bg-gray-100 text-gray-800 max-w-[280px]">
                {/* Render the message text - support for basic markdown */}
                <div className="mb-3 markdown-content">
                  <ReactMarkdown rehypePlugins={[rehypeSanitize]}>
                    {message.text}
                  </ReactMarkdown>
                </div>
                
                {/* Render location selection if present */}
                {locationResult && locationResult.show_locations && (
                  <div className="mt-3">
                    <p className="font-medium mb-2">Select a delivery location:</p>
                    <div className="grid grid-cols-1 gap-2">
                      {locationResult.locations && locationResult.locations.map(location => (
                        <button
                          key={location.id}
                          onClick={() => handleLocationTool({
                            action: "set_delivery_location",
                            order_id: currentOrder?.id || "new_order",
                            location_id: location.id
                          })}
                          className="bg-[#4B2E2B] hover:bg-opacity-90 text-white py-2 px-3 rounded flex items-center justify-between"
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
                {cartResult && cartResult.cart && cartResult.cart.length > 0 && (
                  <div className="mt-3">
                    <p className="font-medium mb-2">Your cart:</p>
                    <div className="bg-white rounded p-2">
                      {cartResult.cart.map(item => (
                        <div key={item.id} className="flex justify-between items-center py-1">
                          <div className="flex items-center">
                            <span>{item.quantity}x {item.name}</span>
                            <div className="flex ml-2">
                              <button 
                                onClick={() => handleMenuTool({
                                  action: "add_to_cart",
                                  product_id: item.id,
                                  quantity: 1
                                })}
                                className="text-xs bg-gray-100 hover:bg-gray-200 rounded-l p-1 text-gray-700"
                              >
                                <FaPlus size={8} />
                              </button>
                              <button 
                                onClick={() => {
                                  if (item.quantity > 1) {
                                    // Reduce quantity
                                    handleMenuTool({
                                      action: "update_quantity",
                                      product_id: item.id,
                                      quantity: item.quantity - 1
                                    });
                                  } else {
                                    // If quantity = 1, remove the item
                                    handleMenuTool({
                                      action: "remove_from_cart",
                                      product_id: item.id
                                    });
                                  }
                                }}
                                className="text-xs bg-gray-100 hover:bg-gray-200 rounded-r p-1 text-gray-700"
                              >
                                <FaMinus size={8} />
                              </button>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <span className="mr-2">${(item.price * item.quantity).toFixed(2)}</span>
                            <button
                              onClick={() => handleMenuTool({
                                action: "remove_from_cart",
                                product_id: item.id
                              })}
                              className="text-xs text-red-500 hover:text-red-700"
                              title="Remove item"
                            >
                              <FaTrash size={10} />
                            </button>
                          </div>
                        </div>
                      ))}
                      <div className="border-t mt-2 pt-2 font-medium flex justify-between">
                        <span>Total:</span>
                        <span>${cartResult.total ? cartResult.total.toFixed(2) : '0.00'}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 mt-2">
                      <button 
                        onClick={() => handleOrderTool({ 
                          action: "place_order"
                        })}
                        className="flex-1 bg-[#4B2E2B] hover:bg-opacity-90 text-white py-2 px-4 rounded flex items-center justify-center"
                      >
                        <FaShoppingCart className="mr-2" /> Place Order
                      </button>
                      <button 
                        onClick={() => handleMenuTool({ action: "clear_cart" })}
                        className="flex-1 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white py-2 px-4 rounded flex items-center justify-center transition-colors"
                      >
                        Clear Cart
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Render usual order suggestions if present */}
                {usualOrderResult && usualOrderResult.items && (
                  <div className="mt-3">
                    <p className="font-medium mb-2">Your favorites:</p>
                    <div className="space-y-2">
                      {usualOrderResult.items.map(item => (
                        <div key={item.id} className="bg-white rounded-lg p-2 shadow-sm flex justify-between items-center">
                          <div className="flex items-center">
                            <FaStar className="text-yellow-500 mr-2" size={14} />
                            <div>
                              <div className="font-medium">{item.name}</div>
                              <div className="text-xs text-gray-500">${item.price.toFixed(2)}</div>
                            </div>
                          </div>
                          <button
                            onClick={() => handleMenuTool({
                              action: "add_to_cart",
                              product_id: item.id,
                              quantity: 1
                            })}
                            className="bg-[#4B2E2B] text-white rounded px-2 py-1 text-xs"
                          >
                            Add to cart
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Render tracking button if we have an order */}
                {orderResult && orderResult.order && (
                  <button 
                    onClick={() => handleNavigationTool({ action: "redirect_to_tracking" })}
                    className="bg-[#4B2E2B] hover:bg-opacity-90 text-white py-2 px-4 rounded flex items-center justify-center w-full mt-3"
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
      } catch (error) {
        console.error("Error rendering bot message:", error);
        // Fallback to simple message
        return renderSimpleMessage(message);
      }
    }
    
    return renderSimpleMessage(message);
  };
  
  // Render a simple message without interactive components
  const renderSimpleMessage = (message) => {
    return (
      <div className="flex items-start flex-row">
        <div className="rounded-full p-2 mx-2 flex-shrink-0 bg-gray-200 text-gray-700">
          <FaRobot size={14} />
        </div>
        
        <div>
          <div className="inline-block rounded-lg px-4 py-2 bg-gray-100 text-gray-800 max-w-[280px]">
            <div className="markdown-content">
              <ReactMarkdown rehypePlugins={[rehypeSanitize]}>
                {message.text}
              </ReactMarkdown>
            </div>
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
  
  // Suggestions for quick replies based on language
  const getSuggestions = () => {
    const suggestions = {
      'en': ['Show me the menu', 'I\'d like 3 coffees', 'Place my order', 'Track my order'],
      'fr': ['Montrez-moi le menu', 'Je voudrais 3 cafés', 'Passer ma commande', 'Suivre ma commande'],
      'es': ['Muéstrame el menú', 'Quiero 3 cafés', 'Hacer mi pedido', 'Rastrear mi pedido'],
      'de': ['Zeigen Sie mir die Speisekarte', 'Ich hätte gerne 3 Kaffees', 'Bestellung aufgeben', 'Bestellung verfolgen'],
      'it': ['Mostrami il menu', 'Vorrei 3 caffè', 'Effettua l\'ordine', 'Traccia il mio ordine'],
      'ja': ['メニューを見せて', 'コーヒーを3つください', '注文を確定', '注文を追跡'],
      'zh': ['给我看看菜单', '我想要3杯咖啡', '下单', '跟踪我的订单'],
      'ar': ['أرني القائمة', 'أريد 3 قهوة', 'تأكيد الطلب', 'تتبع طلبي']
    };
    
    return suggestions[language] || suggestions['en'];
  };

  return (
    <>
      {/* Audio element for welcome sound */}
      <audio ref={audioRef} src={"https://www.myinstants.com/media/sounds/pop2.mp3"} />
      
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
            <div className="bg-[#4B2E2B] text-white p-4 flex justify-between items-center">
              <div>
                <h3 className="font-semibold">Neo Café Assistant</h3>
                <p className="text-xs text-gray-200">How can I help you today?</p>
              </div>
              <div className="flex space-x-4">
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const dropdown = document.getElementById('language-dropdown');
                      dropdown.classList.toggle('hidden');
                    }}
                    className="text-white hover:text-gray-300 mt-2 transition-colors"
                    title="Change language"
                  >
                    <FaGlobe size={16} />
                  </button>
                  
                  {/* Language dropdown */}
                  <div id="language-dropdown" className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10 hidden">
                    <div className="py-1">
                      {getAvailableLanguages().map(lang => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            handleUITool({ action: "change_language", language: lang.code });
                            document.getElementById('language-dropdown').classList.add('hidden');
                          }}
                          className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left ${
                            language === lang.code ? 'bg-gray-100 font-medium' : ''
                          }`}
                        >
                          {lang.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={() => handleUITool({ action: "toggle_sound_mute" })}
                  className="text-white hover:text-gray-300 transition-colors"
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? <FaVolumeMute size={16} /> : <FaVolumeUp size={16} />}
                </button>
                <button 
                  onClick={() => handleUITool({ action: "toggle_chat_size" })}
                  className="text-white hover:text-gray-300 transition-colors"
                  title={isExpanded ? "Collapse" : "Expand"}
                >
                  <FaExpand size={16} />
                </button>
                <button 
                  onClick={() => setShowHistory(!showHistory)}
                  className="text-white hover:text-gray-300 transition-colors"
                  title="View history"
                >
                  <FaHistory size={16} />
                </button>
                <button 
                  onClick={handleClearHistory}
                  className="text-white hover:text-red-300 transition-colors"
                  title="Clear history"
                >
                  <FaTrash size={16} className='cursor-pointer' />
                </button>
              </div>
            </div>
            
            {/* Current order status - if exists */}
            {currentOrder && !showHistory && (
              <div className="bg-green-50 border-t border-b border-green-100 p-3 text-xs text-green-700 flex justify-between items-center">
                <div className="flex items-center">
                  <FaShoppingCart className="mr-2" />
                  <div>
                    Order #{currentOrder.id} • <span className="font-medium">{currentOrder.status}</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <button 
                    onClick={() => handleNavigationTool({ action: "redirect_to_tracking" })}
                    className="mr-3 text-[#4B2E2B] hover:underline font-medium"
                  >
                    Track
                  </button>
                  <button 
                    onClick={() => {
                      setCurrentOrder(null);
                      localStorage.removeItem('currentOrder');
                    }}
                    className="text-gray-500 hover:text-red-500"
                    title="Dismiss"
                  >
                    <FaTimes size={12} />
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
                  <div className="text-center text-gray-600 mt-16 px-4">
                    <div className="text-4xl mb-3">☕️ 👋</div>
                    <p className="mb-3 font-medium">
                      {user?.username 
                        ? `Hello ${user.username}! Ready for a delicious coffee?` 
                        : "Welcome to Neo Café!"}
                    </p>    
                    <p className="text-sm text-gray-500 mb-4">
                      You can ask me for our menu, order your favorite coffee,
                      or discover our daily specials!
                    </p>
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
                  className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-coffee-dark focus:border-coffee-dark"
                  disabled={showHistory}
                />
                <button
                  type="submit"
                  disabled={isLoading || inputValue.trim() === '' || showHistory}
                  className={`bg-[#4B2E2B] text-white p-[11px] rounded-r-lg ${
                    isLoading || inputValue.trim() === '' || showHistory
                      ? 'opacity-80 cursor-not-allowed' 
                      : 'hover:opacity-100'
                  }`}
                >
                  <FaPaperPlane size={20} />
                </button>
              </div>
              
              {/* Quick suggestions based on current language */}
              {!showHistory && (
                <div className="flex flex-wrap mt-2 gap-1">
                  {getSuggestions().map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setInputValue(suggestion);
                        setTimeout(() => handleSubmit({ preventDefault: () => {} }), 100);
                      }}
                      className="bg-gray-100 hover:bg-gray-200 text-coffee-dark rounded-full px-3 py-1 text-xs"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </form>
          </div>
        )}
      </div>
      
      {/* Add styles for markdown content */}
      <style jsx>{`
        .markdown-content strong {
          font-weight: bold;
        }
        .markdown-content em {
          font-style: italic;
        }
        .markdown-content code {
          font-family: monospace;
          background-color: #f0f0f0;
          padding: 0 0.2rem;
          border-radius: 3px;
        }
        .markdown-content ul {
          list-style-type: disc;
          padding-left: 1.5rem;
        }
        .markdown-content ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
        }
      `}</style>
    </>
  );
};

export default Chatbot;