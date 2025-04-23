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
  FaStar
} from 'react-icons/fa';
import { getChatHistory, saveMessage, clearChatHistory } from '../utils/chat';
import { useNavigate } from 'react-router-dom';

import { getItemsByCategory, getCategories } from '../utils/menu';

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
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [frequentOrders, setFrequentOrders] = useState([]);
  const [hasOrderHistory, setHasOrderHistory] = useState(false);
  
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  
  // Load message history and initialize data
  useEffect(() => {
    const history = getChatHistory();
    setMessages(history);
    
    // Group messages by conversation
    const convos = groupMessagesByConversation(history);
    setConversations(convos);
    
    // Check if there's an ongoing order in localStorage
    const savedOrder = JSON.parse(localStorage.getItem('currentOrder'));
    if (savedOrder) {
      setCurrentOrder(savedOrder);
    }
    
    // Load order history for "as usual" functionality
    loadOrderHistory();
    
    // Play welcome sound and send a message if user data exists
    sendWelcomeMessage();

    // Load cart items
    loadCartItems();
    
    // Set up cart storage listener to update the cart in real-time
    window.addEventListener('cart-updated', loadCartItems);
    
    return () => {
      window.removeEventListener('cart-updated', loadCartItems);
    };
  }, []);

  // Load order history for the "as usual" functionality
  const loadOrderHistory = () => {
    try {
      const orderHistory = JSON.parse(localStorage.getItem('orderHistory')) || [];
      
      if (orderHistory.length > 0) {
        setHasOrderHistory(true);
        
        // Count occurrences of each product to find frequent orders
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
          .sort((a, b) => b.count - a.count)
          .slice(0, 3); // Get top 3 frequent items
          
        setFrequentOrders(frequentProducts);
      }
    } catch (error) {
      console.error("Error loading order history:", error);
      setHasOrderHistory(false);
    }
  };

  // Refresh messages when chat is opened
  useEffect(() => {
    if (isOpen) {
      // Load cart items each time the chat is opened
      loadCartItems();
      
      // Refresh order history
      loadOrderHistory();
    }
  }, [isOpen]);

  // Function to load cart items and update state
  const loadCartItems = () => {
    try {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      setCartItems(cart);
      
      // Calculate total price
      const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      setTotalPrice(total);
    } catch (error) {
      console.error("Error loading cart:", error);
    }
  };

  // Custom event dispatcher for cart updates
  const dispatchCartUpdate = () => {
    const event = new Event('cart-updated');
    window.dispatchEvent(event);
  };

  // Function to send a welcome message
  const sendWelcomeMessage = () => {
    const userData = JSON.parse(localStorage.getItem('userInfo')) || {};
    
    if (userData.name) {
      // Play welcome sound
      playWelcomeSound();
      
      // Create and add welcome message
      const welcomeMessage = {
        id: Date.now().toString(),
        sender: 'bot',
        text: userData.isReturningUser 
          ? `👋 Welcome back, ${userData.name}! Great to see you again at Neo Café. How can I help you today?` 
          : `👋 Hello ${userData.name}! Welcome to Neo Café. How can I help you today?`,
        timestamp: new Date().toISOString()
      };
      
      saveMessage(welcomeMessage);
      setMessages(prev => [welcomeMessage, ...prev]);
      
      // Update user
      if (!userData.isReturningUser) {
        localStorage.setItem('userInfo', JSON.stringify({
          ...userData,
          isReturningUser: true
        }));
      }
    }
  };

  // Play a simple sound
  const playWelcomeSound = () => {
    if (isMuted) return;
    
    try {
      const audio = new Audio();
      audio.src = 'https://www.soundjay.com/buttons/sounds/button-09.mp3';
      audio.volume = 0.5;
      audio.play().catch(err => console.log("Could not play audio:", err));
    } catch (e) {
      console.error('Audio play error:', e);
    }
  };
  
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
  
  // Function to get products with robust error handling
  const getAllProducts = () => {
    try {
      const storedItems = localStorage.getItem('menuItems');
      
      if (storedItems) {
        const parsedItems = JSON.parse(storedItems);
        if (Array.isArray(parsedItems) && parsedItems.length > 0) {
          return parsedItems;
        }
      }
      
      // If localStorage data is invalid, use categories to get products
      const categories = getCategories();
      let allProducts = [];
      
      categories.forEach(category => {
        const categoryProducts = getCategoryProducts(category);
        if (categoryProducts && categoryProducts.length) {
          allProducts = [...allProducts, ...categoryProducts];
        }
      });
      
      if (allProducts.length > 0) {
        return allProducts;
      }
    } catch (error) {
      console.error("Error fetching menu items:", error);
    }
    
    // Fallback: minimal product list
    return [
      { id: '1', name: 'Espresso', price: 2.50, category: 'drinks', image: '/espresso.jpg', description: 'Strong black coffee' },
      { id: '2', name: 'Cappuccino', price: 3.50, category: 'drinks', image: '/cappuccino.jpg', description: 'Espresso with steamed milk and foam' },
      { id: '3', name: 'Latte', price: 3.75, category: 'drinks', image: '/latte.jpg', description: 'Espresso with lots of steamed milk' },
      { id: 'p1', name: 'Croissant', price: 2.95, category: 'food', image: '/croissant.jpg', description: 'Buttery, flaky pastry' }
    ];
  };

  // Function to get products for a category
  const getCategoryProducts = (category) => {
    try {
      // Use the imported function directly
      return getItemsByCategory(category);
    } catch (error) {
      console.log(`Could not get products for category ${category}:`, error);
      
      // Fallback: if the imported function fails, try filtering products directly
      try {
        const storedItems = localStorage.getItem('menuItems');
        if (storedItems) {
          const items = JSON.parse(storedItems);
          if (Array.isArray(items)) {
            return items.filter(item => item.category === category);
          }
        }
      } catch (err) {
        console.error("Error filtering products by category:", err);
      }
    }
    
    return [];
  };

  // Function to add a product to the cart with error handling
  const addToCart = (productName, quantity = 1) => {
    try {
      // Get all products
      const products = getAllProducts();
      if (!products || !Array.isArray(products) || products.length === 0) {
        return "Sorry, our product catalog is currently unavailable.";
      }
      
      // Search for product by name (flexible search)
      const normalizedName = productName.toLowerCase().trim();
      
      // Try exact match first
      let productToAdd = products.find(product => 
        product.name.toLowerCase() === normalizedName
      );
      
      // If not found, try partial match
      if (!productToAdd) {
        productToAdd = products.find(product => 
          product.name.toLowerCase().includes(normalizedName)
        );
      }
      
      // If still not found, try with alternative keywords
      if (!productToAdd) {
        // Alternative keywords for common products
        const alternatives = {
          'coffee': ['espresso', 'americano', 'latte', 'cappuccino', 'mocha'],
          'tea': ['earl grey', 'green tea', 'chamomile'],
          'pastry': ['croissant', 'muffin', 'scone']
        };
        
        // Search in alternatives
        for (const [key, values] of Object.entries(alternatives)) {
          if (normalizedName.includes(key)) {
            // Suggest the first available alternative product
            for (const alt of values) {
              const altProduct = products.find(p => 
                p.name.toLowerCase().includes(alt)
              );
              if (altProduct) {
                return `We don't have exactly "${productName}", but would you like a ${altProduct.name} instead?`;
              }
            }
          }
        }
      }
      
      // If product not found after all attempts
      if (!productToAdd) {
        return `Sorry, I couldn't find "${productName}" in our menu. Would you like to see our available options?`;
      }
      
      // Get current cart safely
      let cart = [];
      try {
        const cartData = localStorage.getItem('cart');
        if (cartData) {
          cart = JSON.parse(cartData);
          if (!Array.isArray(cart)) cart = [];
        }
      } catch (error) {
        console.error("Error reading cart:", error);
        cart = [];
      }
      
      // Check if the product is already in the cart
      const existingItemIndex = cart.findIndex(item => item.id === productToAdd.id);
      
      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        cart[existingItemIndex].quantity += quantity;
      } else {
        // Add a new item with quantity
        cart.push({
          ...productToAdd,
          quantity
        });
      }
      
      // Save the cart
      localStorage.setItem('cart', JSON.stringify(cart));
      
      // Update cart state
      setCartItems(cart);
      const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      setTotalPrice(total);
      
      // Dispatch custom event for cart updates
      dispatchCartUpdate();
      
      return `Added ${quantity}x ${productToAdd.name} to your cart! Would you like anything else?`;
    } catch (error) {
      console.error("Error adding to cart:", error);
      return "Sorry, I couldn't add that to your cart right now. Please try again later.";
    }
  };

  // Function to get delivery locations with proper icons
  const getDeliveryLocations = () => {
    try {
      // Try to get locations from localStorage
      const storedLocations = localStorage.getItem('deliveryLocations');
      if (storedLocations) {
        return JSON.parse(storedLocations);
      }
    } catch (error) {
      console.error("Error reading delivery locations:", error);
    }
    
    // Use predefined locations with text icons (emojis)
    return [
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

  // Function to handle the "as usual" request
  const handleUsualOrder = () => {
    // Check if user has order history
    if (!hasOrderHistory || frequentOrders.length === 0) {
      return {
        success: false,
        message: "I don't see any previous orders from you yet. Would you like to see our menu so you can place your first order?"
      };
    }
    
    // Get the most frequently ordered item
    const topItem = frequentOrders[0];
    
    // Add the top item to the cart
    try {
      // Create a clean cart with just the usual item
      const usualOrder = [{
        ...topItem,
        quantity: 1
      }];
      
      // Save to cart
      localStorage.setItem('cart', JSON.stringify(usualOrder));
      
      // Update state
      setCartItems(usualOrder);
      setTotalPrice(topItem.price);
      
      // Dispatch event
      dispatchCartUpdate();
      
      return {
        success: true,
        message: `I've added your usual order to the cart: 1 ${topItem.name}. Would you like to add anything else or proceed to checkout?`,
        item: topItem
      };
    } catch (error) {
      console.error("Error adding usual order to cart:", error);
      return {
        success: false,
        message: "I'm sorry, I had trouble adding your usual order to the cart. Would you like to try ordering manually?"
      };
    }
  };

  // Function to add all frequent items to cart
  const addAllFrequentItems = () => {
    if (!hasOrderHistory || frequentOrders.length === 0) {
      return {
        success: false,
        message: "You don't have any order history yet. Would you like to browse our menu?"
      };
    }
    
    try {
      // Create cart with all frequent items
      const frequentCart = frequentOrders.map(item => ({
        ...item,
        quantity: 1  // Start with quantity 1 for each item
      }));
      
      // Save to cart
      localStorage.setItem('cart', JSON.stringify(frequentCart));
      
      // Update state
      setCartItems(frequentCart);
      const total = frequentCart.reduce((sum, item) => sum + item.price, 0);
      setTotalPrice(total);
      
      // Dispatch event
      dispatchCartUpdate();
      
      // Create a readable list of items
      const itemsList = frequentCart.map(item => item.name).join(', ');
      
      return {
        success: true,
        message: `I've added your favorite items to the cart: ${itemsList}. Would you like to proceed to checkout?`,
        items: frequentCart
      };
    } catch (error) {
      console.error("Error adding frequent items to cart:", error);
      return {
        success: false,
        message: "I'm sorry, I had trouble adding your favorite items to the cart. Would you like to try ordering manually?"
      };
    }
  };

  // Function to suggest frequent orders
  const suggestFrequentOrders = () => {
    if (!hasOrderHistory || frequentOrders.length === 0) {
      return {
        success: false,
        message: "I don't see any order history yet. Would you like me to help you with your first order?",
        firstTime: true
      };
    }
    
    // Format suggestions
    const suggestions = frequentOrders.map(item => `${item.name} ($${item.price.toFixed(2)})`).join(', ');
    
    return {
      success: true,
      message: `Based on your previous orders, you might like: ${suggestions}. Would you like me to add any of these to your cart?`,
      items: frequentOrders
    };
  };

  // Utility function to find a product in text
  const findProductInText = (text) => {
    const products = getAllProducts();
    const normalizedText = text.toLowerCase();
    
    // List of products to search for
    const productNames = products.map(p => p.name.toLowerCase());
    
    // Find the first product mentioned in the text
    for (const productName of productNames) {
      if (normalizedText.includes(productName)) {
        return productName;
      }
    }
    
    // More flexible search (partial words)
    for (const product of products) {
      const words = product.name.toLowerCase().split(' ');
      for (const word of words) {
        if (word.length > 3 && normalizedText.includes(word)) {
          return product.name;
        }
      }
    }
    
    return null;
  };

  // Function to remove a product from the cart
  const removeFromCart = (productId) => {
    try {
      // Get current cart
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      
      // Find the item to remove
      const itemToRemove = cart.find(item => item.id === productId);
      
      if (!itemToRemove) {
        return "Item not found in cart.";
      }
      
      // Filter out the item
      const updatedCart = cart.filter(item => item.id !== productId);
      
      // Save the cart
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      
      // Update local state
      setCartItems(updatedCart);
      const total = updatedCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      setTotalPrice(total);
      
      // Dispatch custom event for cart updates
      dispatchCartUpdate();

      return `Removed ${itemToRemove.name} from your cart.`;
    } catch (error) {
      console.error("Error removing from cart:", error);
      return "Sorry, I couldn't remove that item from your cart right now.";
    }
  };

  // Function to modify a product quantity
  const updateItemQuantity = (productId, newQuantity) => {
    try {
      if (newQuantity <= 0) {
        return removeFromCart(productId);
      }

      // Get current cart
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      
      // Find the item to update
      const itemIndex = cart.findIndex(item => item.id === productId);
      
      if (itemIndex === -1) {
        return "Item not found in cart.";
      }
      
      // Update the quantity
      cart[itemIndex].quantity = newQuantity;
      
      // Save the cart
      localStorage.setItem('cart', JSON.stringify(cart));
      
      // Update local state
      setCartItems(cart);
      const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      setTotalPrice(total);
      
      // Dispatch custom event for cart updates
      dispatchCartUpdate();

      return `Updated ${cart[itemIndex].name} quantity to ${newQuantity}.`;
    } catch (error) {
      console.error("Error updating quantity:", error);
      return "Sorry, I couldn't update that item's quantity right now.";
    }
  };
  
  // Submit the user's message and get a response
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (inputValue.trim() === '') return;
    
    // Add the user's message
    const userMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputValue,
      timestamp: new Date().toISOString()
    };
    
    saveMessage(userMessage);
    setMessages(prev => [...prev, userMessage]);
    
    // Keep a copy of the message and clear the input
    const userInput = inputValue.toLowerCase();
    setInputValue('');
    setIsLoading(true);
    
    try {
      // Process the user message with simplified logic
      let botResponseText = '';
      let shouldShowCart = false;
      let shouldShowLocations = false;
      let shouldShowUsualItems = false;
      
      // Check for "as usual" or similar phrases
      if (userInput.includes('as usual') || 
          userInput.includes('the usual') || 
          userInput.includes('my usual') || 
          userInput.includes('regular order') ||
          userInput.includes('same as always') ||
          userInput.includes('same as last time')) {
        
        const usualOrderResult = handleUsualOrder();
        botResponseText = usualOrderResult.message;
        shouldShowCart = usualOrderResult.success;
      }
      // Check for frequent orders or recommendations
      else if (userInput.includes('recommend') || 
               userInput.includes('suggestion') || 
               userInput.includes('popular') ||
               userInput.includes('what do people order') ||
               userInput.includes('what should i get')) {
        
        const suggestions = suggestFrequentOrders();
        botResponseText = suggestions.message;
        shouldShowUsualItems = suggestions.success && !suggestions.firstTime;
      } 
      // Check for favorite orders
      else if (userInput.includes('my favorite') || 
               userInput.includes('i usually get') ||
               userInput.includes('my favorites')) {
      
        const favorites = suggestFrequentOrders();
        if (favorites.success) {
          botResponseText = `Your favorite items are: ${favorites.items.map(item => item.name).join(', ')}. Would you like me to add them to your cart?`;
          shouldShowUsualItems = true;
        } else {
          botResponseText = favorites.message;
        }
      }
      // Standard keyword processing
      else if (userInput.includes('hello') || userInput.includes('hi') || userInput.includes('hey')) {
        botResponseText = "Hello! How can I help you today? Would you like to see our menu, order something, or check your cart?";
      } 
      else if (userInput.includes('menu') || userInput.includes('what do you have') || userInput.includes('what can i order')) {
        botResponseText = "Here's our menu:\n\n☕ **Coffee**\n- Espresso ($2.50)\n- Cappuccino ($3.50)\n- Latte ($3.75)\n- Americano ($2.75)\n- Mocha ($4.25)\n\n🍵 **Tea**\n- Earl Grey ($2.25)\n- Green Tea ($2.25)\n- Chamomile ($2.50)\n\n🥐 **Pastries**\n- Croissant ($2.95)\n- Chocolate Muffin ($3.25)\n- Blueberry Scone ($3.50)\n\nWhat would you like to order?";
      }
      else if (userInput.includes('cart') || userInput.includes('show cart') || userInput.includes('my order')) {
        shouldShowCart = true;
        if (cartItems.length === 0) {
          botResponseText = "Your cart is currently empty. Would you like to see our menu to add something?";
        } else {
          botResponseText = "Here's your current cart. You can adjust quantities or proceed to checkout.";
        }
      }
      else if (userInput.includes('location') || userInput.includes('deliver') || userInput.includes('where')) {
        shouldShowLocations = true;
        botResponseText = "Where would you like your order to be delivered? Please select a location:";
      }
      else if (userInput.includes('espresso')) {
        const response = addToCart('Espresso');
        botResponseText = response + " Would you like anything else?";
        shouldShowCart = true;
      }
      else if (userInput.includes('cappuccino')) {
        const response = addToCart('Cappuccino');
        botResponseText = response + " Would you like anything else?";
        shouldShowCart = true;
      }
      else if (userInput.includes('latte')) {
        const response = addToCart('Latte');
        botResponseText = response + " Would you like anything else?";
        shouldShowCart = true;
      }
      else if (userInput.includes('americano')) {
        const response = addToCart('Americano');
        botResponseText = response + " Would you like anything else?";
        shouldShowCart = true;
      }
      else if (userInput.includes('mocha')) {
        const response = addToCart('Mocha');
        botResponseText = response + " Would you like anything else?";
        shouldShowCart = true;
      }
      else if (userInput.includes('earl grey') || userInput.includes('earl gray')) {
        const response = addToCart('Earl Grey');
        botResponseText = response + " Would you like anything else?";
        shouldShowCart = true;
      }
      else if (userInput.includes('green tea')) {
        const response = addToCart('Green Tea');
        botResponseText = response + " Would you like anything else?";
        shouldShowCart = true;
      }
      else if (userInput.includes('chamomile')) {
        const response = addToCart('Chamomile');
        botResponseText = response + " Would you like anything else?";
        shouldShowCart = true;
      }
      else if (userInput.includes('croissant')) {
        const response = addToCart('Croissant');
        botResponseText = response + " Would you like anything else?";
        shouldShowCart = true;
      }
      else if (userInput.includes('muffin') || userInput.includes('chocolate muffin')) {
        const response = addToCart('Chocolate Muffin');
        botResponseText = response + " Would you like anything else?";
        shouldShowCart = true;
      }
      else if (userInput.includes('scone') || userInput.includes('blueberry scone')) {
        const response = addToCart('Blueberry Scone');
        botResponseText = response + " Would you like anything else?";
        shouldShowCart = true;
      }
      else if (userInput.includes('checkout') || userInput.includes('pay') || userInput.includes('place order')) {
        if (cartItems.length === 0) {
          botResponseText = "Your cart is empty. Please add items before checking out.";
        } else {
          botResponseText = "Great! To complete your order, please choose a delivery location.";
          shouldShowLocations = true;
        }
      }
      else if (userInput.includes('thank')) {
        botResponseText = "You're welcome! Is there anything else I can help you with?";
      }
      else {
        botResponseText = "I'm not sure I understand. Would you like to see our menu, check your cart, or place an order?";
      }

      // Create bot response
      const botResponse = {
        id: Date.now().toString() + 1,
        sender: 'bot',
        text: botResponseText,
        timestamp: new Date().toISOString(),
        showCart: shouldShowCart,
        showLocations: shouldShowLocations,
        showUsualItems: shouldShowUsualItems,
        frequentItems: shouldShowUsualItems ? frequentOrders : []
      };
      
      saveMessage(botResponse);
      setMessages(prev => [...prev, botResponse]);
      
      // Update the conversation list
      const updatedHistory = [...messages, userMessage, botResponse];
      setConversations(groupMessagesByConversation(updatedHistory));
      
    } catch (error) {
      console.error('Error processing message:', error);
      
      // Add an error message
      const errorResponse = {
        id: Date.now().toString() + 1,
        sender: 'bot',
        text: "I'm having trouble understanding. Could you please try again?",
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

  // Handle click on a delivery location
  const handleLocationSelect = (location) => {
    // Create or update the order
    if (cartItems.length > 0) {
      const order = {
        id: `ORD-${Date.now().toString().slice(-6)}`,
        items: cartItems,
        status: 'Processing',
        timestamp: new Date().toISOString(),
        total: totalPrice,
        location: location,
        estimatedDelivery: new Date(Date.now() + location.eta * 60000).toISOString()
      };
      
      localStorage.setItem('currentOrder', JSON.stringify(order));
      setCurrentOrder(order);
      
      // Add to order history for future "as usual" functionality
      try {
        const orderHistory = JSON.parse(localStorage.getItem('orderHistory')) || [];
        orderHistory.push(order);
        localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
        
        // Update the frequent orders
        setHasOrderHistory(true);
        loadOrderHistory();
      } catch (error) {
        console.error("Error saving to order history:", error);
      }
      
      // Add a confirmation message
      const confirmationMessage = {
        id: Date.now().toString(),
        sender: 'bot',
        text: `Thank you! Your order has been placed and will be delivered to ${location.name} in approximately ${location.eta} minutes. Your order number is ${order.id}.`,
        timestamp: new Date().toISOString(),
        showOrder: true,
        order: order
      };
      
      saveMessage(confirmationMessage);
      setMessages(prev => [...prev, confirmationMessage]);
      
      // Clear the cart
      localStorage.setItem('cart', JSON.stringify([]));
      setCartItems([]);
      setTotalPrice(0);
      
      // Dispatch custom event for cart updates
      dispatchCartUpdate();
    }
  };

  // Navigate to tracking page
  const navigateToTracking = () => {
    setIsOpen(false);
    navigate('/robot');
  };
  
  // Handle adding a frequent item to cart
  const handleAddFrequentItem = (item) => {
    addToCart(item.name);
    
    // Add a confirmation message
    const confirmationMessage = {
      id: Date.now().toString(),
      sender: 'bot',
      text: `I've added 1 ${item.name} to your cart. Would you like anything else or are you ready to proceed to checkout?`,
      timestamp: new Date().toISOString(),
      showCart: true
    };
    
    saveMessage(confirmationMessage);
    setMessages(prev => [...prev, confirmationMessage]);
  };
  
  // Handle adding all frequent items to cart
  const handleAddAllFrequentItems = () => {
    const result = addAllFrequentItems();
    
    // Add a confirmation message
    const confirmationMessage = {
      id: Date.now().toString(),
      sender: 'bot',
      text: result.message,
      timestamp: new Date().toISOString(),
      showCart: result.success
    };
    
    saveMessage(confirmationMessage);
    setMessages(prev => [...prev, confirmationMessage]);
  };
  
  // Render a bot message
  const renderBotMessage = (message) => {
    return (
      <div className="flex items-start flex-row">
        <div className="rounded-full p-2 mx-2 flex-shrink-0 bg-gray-200 text-gray-700">
          <FaRobot size={14} />
        </div>
        
        <div>
          <div className="inline-block rounded-lg px-4 py-2 bg-gray-100 text-gray-800 max-w-[280px]">
            {/* Render message text */}
            <div className="mb-3">
              {message.text.split('\n').map((text, i) => {
                // Simple support for markdown (bold)
                const boldText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                return (
                  <p 
                    key={i} 
                    className={i > 0 ? 'mt-1' : ''}
                    dangerouslySetInnerHTML={{ __html: boldText }}
                  />
                );
              })}
            </div>
            
            {/* Show frequent order suggestions */}
            {message.showUsualItems && message.frequentItems && message.frequentItems.length > 0 && (
              <div className="mt-3">
                <p className="font-medium mb-2">Your favorite items:</p>
                <div className="space-y-2">
                  {message.frequentItems.map(item => (
                    <div key={item.id} className="bg-white rounded-lg p-2 shadow-sm flex justify-between items-center">
                      <div className="flex items-center">
                        <FaStar className="text-yellow-500 mr-2" size={14} />
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs text-gray-500">${item.price.toFixed(2)}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleAddFrequentItem(item)}
                        className="bg-[#4B2E2B] text-white rounded px-2 py-1 text-xs"
                      >
                        Add to cart
                      </button>
                    </div>
                  ))}
                  
                  {/* Add all button */}
                  <button
                    onClick={handleAddAllFrequentItems}
                    className="w-full bg-[#4B2E2B] text-white rounded py-2 text-sm"
                  >
                    Add all to cart
                  </button>
                </div>
              </div>
            )}
            
            {/* Show cart if requested */}
            {message.showCart && cartItems.length > 0 && (
              <div className="mt-3">
                <p className="font-medium mb-2">Your Cart:</p>
                <div className="bg-white rounded p-3 shadow-sm">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-center">
                        <div className="flex flex-col">
                          <span className="font-medium">{item.quantity}× {item.name}</span>
                          <div className="flex mt-1">
                            <button 
                              onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                              className="text-xs bg-gray-100 hover:bg-gray-200 rounded-l px-2 py-1 text-gray-700"
                            >
                              <FaPlus size={8} />
                            </button>
                            <button 
                              onClick={() => {
                                if (item.quantity > 1) {
                                  updateItemQuantity(item.id, item.quantity - 1);
                                } else {
                                  removeFromCart(item.id);
                                }
                              }}
                              className="text-xs bg-gray-100 hover:bg-gray-200 rounded-r px-2 py-1 text-gray-700 border-l border-white"
                            >
                              <FaMinus size={8} />
                            </button>
                            <button 
                              onClick={() => removeFromCart(item.id)}
                              className="text-xs bg-red-50 hover:bg-red-100 rounded px-2 py-1 text-red-600 ml-1"
                            >
                              <FaTrash size={8} />
                            </button>
                          </div>
                        </div>
                      </div>
                      <span className="font-medium text-[#4B2E2B]">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="pt-2 mt-2 border-t border-dashed border-gray-200 flex justify-between items-center">
                    <span className="font-bold">Total:</span>
                    <span className="font-bold text-[#4B2E2B] text-lg">${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => {
                      const checkoutMessage = {
                        id: Date.now().toString(),
                        sender: 'user',
                        text: "I want to checkout",
                        timestamp: new Date().toISOString()
                      };
                      saveMessage(checkoutMessage);
                      setMessages(prev => [...prev, checkoutMessage]);
                      
                      // Simulate response
                      setTimeout(() => {
                        const botResponse = {
                          id: Date.now().toString() + 1,
                          sender: 'bot',
                          text: "Great! To complete your order, please choose a delivery location:",
                          timestamp: new Date().toISOString(),
                          showLocations: true
                        };
                        
                        saveMessage(botResponse);
                        setMessages(prev => [...prev, botResponse]);
                      }, 500);
                    }}
                    className="bg-[#4B2E2B] hover:bg-opacity-90 text-white py-2 px-3 rounded text-center"
                  >
                    Checkout
                  </button>
                  <button 
                    onClick={() => {
                      const menuMessage = {
                        id: Date.now().toString(),
                        sender: 'user',
                        text: "Show me the menu",
                        timestamp: new Date().toISOString()
                      };
                      saveMessage(menuMessage);
                      setMessages(prev => [...prev, menuMessage]);
                      
                      // Simulate response
                      setTimeout(() => {
                        setInputValue("Show me the menu");
                        handleSubmit({ preventDefault: () => {} });
                      }, 100);
                    }}
                    className="border border-[#4B2E2B] text-[#4B2E2B] py-2 px-3 rounded text-center"
                  >
                    Add more
                  </button>
                </div>
              </div>
            )}
            
            {/* Show location options */}
            {message.showLocations && (
              <div className="mt-3">
                <p className="font-medium mb-2">Select delivery location:</p>
                <div className="grid grid-cols-1 gap-2">
                  {getDeliveryLocations().map(location => (
                    <button
                      key={location.id}
                      onClick={() => handleLocationSelect(location)}
                      className="bg-[#4B2E2B] hover:bg-opacity-90 text-white py-2 px-3 rounded flex items-center justify-between"
                    >
                      <span>{location.icon} {location.name}</span>
                      <span className="text-xs bg-white text-[#4B2E2B] rounded-full px-2 py-1">
                        {location.eta} min
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Show order summary */}
            {message.showOrder && message.order && (
              <div className="mt-3">
                <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                  <div className="font-medium mb-2 text-green-700">Order Confirmed!</div>
                  <div className="text-sm text-gray-700">
                    <div><span className="font-medium">Order ID:</span> {message.order.id}</div>
                    <div><span className="font-medium">Delivery:</span> {message.order.location.name}</div>
                    <div><span className="font-medium">ETA:</span> {new Date(message.order.estimatedDelivery).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                  </div>
                  
                  <button 
                    onClick={navigateToTracking}
                    className="mt-2 w-full bg-[#4B2E2B] hover:bg-opacity-90 text-white py-2 rounded flex items-center justify-center"
                  >
                    <FaLocationArrow className="mr-2" /> Track Order
                  </button>
                </div>
              </div>
            )}
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
  
  // Render a message based on sender
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
      <div className="fixed bottom-6 right-6 z-[99999999]">
        {/* Chat button */}
        <button
          onClick={() => {
            setIsOpen(!isOpen);
            // Refresh cart items each time the chat is opened
            if (!isOpen) {
              loadCartItems();
              loadOrderHistory(); // Refresh order history
              
              // Add welcome message if first load
              if (messages.length === 0) {
                sendWelcomeMessage();
              }
            }
          }}
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
                <button 
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-white hover:text-gray-300 transition-colors"
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? <FaVolumeMute size={16} /> : <FaVolumeUp size={16} />}
                </button>
                <button 
                  onClick={() => setIsExpanded(!isExpanded)}
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
            
            {/* Current order status - if it exists */}
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
                    onClick={navigateToTracking}
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
                <h4 className="font-medium text-[#4B2E2B] mb-3">Conversation History</h4>
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
                        <div className="font-medium text-[#4B2E2B]">{convo.date}</div>
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
                    
                    <div className="mt-5 flex flex-wrap justify-center gap-2">
                      {["Show me the menu", "I'd like a coffee", "What can I order?", "The usual, please"].map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setInputValue(suggestion);
                            setTimeout(() => {
                              handleSubmit({ preventDefault: () => {} });
                            }, 100);
                          }}
                          className="bg-white text-[#4B2E2B] border border-[#4B2E2B] rounded-full px-3 py-1 text-sm hover:bg-[#4B2E2B] hover:text-white transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                      
                      {/* Show "The usual" button only if user has order history */}
                      {hasOrderHistory && (
                        <button
                          onClick={() => {
                            // Directly trigger the usual order
                            const usualResult = handleUsualOrder();
                            
                            // Add a user message
                            const userMessage = {
                              id: Date.now().toString(),
                              sender: 'user',
                              text: "I'll have my usual order, please.",
                              timestamp: new Date().toISOString()
                            };
                            saveMessage(userMessage);
                            setMessages(prev => [...prev, userMessage]);
                            
                            // Add bot response
                            const botResponse = {
                              id: Date.now().toString() + 1,
                              sender: 'bot',
                              text: usualResult.message,
                              timestamp: new Date().toISOString(),
                              showCart: usualResult.success
                            };
                            saveMessage(botResponse);
                            setMessages(prev => [...prev, botResponse]);
                          }}
                          className="bg-[#D7B49E] text-[#4B2E2B] border border-[#D7B49E] rounded-full px-3 py-1 text-sm hover:bg-[#4B2E2B] hover:text-white transition-colors"
                        >
                          Order my usual
                        </button>
                      )}
                    </div>
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
              
              {/* Quick suggestion chips */}
              {!showHistory && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {hasOrderHistory && (
                    <button
                      onClick={() => {
                        setInputValue("I'll have my usual");
                        setTimeout(() => handleSubmit({ preventDefault: () => {} }), 100);
                      }}
                      className="text-xs text-[#4B2E2B] bg-gray-100 hover:bg-gray-200 rounded-full px-2 py-1"
                    >
                      My usual
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setInputValue("What's popular today?");
                      setTimeout(() => handleSubmit({ preventDefault: () => {} }), 100);
                    }}
                    className="text-xs text-[#4B2E2B] bg-gray-100 hover:bg-gray-200 rounded-full px-2 py-1"
                  >
                    What's popular?
                  </button>
                  <button
                    onClick={() => {
                      setInputValue("Show me the menu");
                      setTimeout(() => handleSubmit({ preventDefault: () => {} }), 100);
                    }}
                    className="text-xs text-[#4B2E2B] bg-gray-100 hover:bg-gray-200 rounded-full px-2 py-1"
                  >
                    Menu
                  </button>
                </div>
              )}
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default Chatbot;