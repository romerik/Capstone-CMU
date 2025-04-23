// src/utils/orders.js
export const getCartItems = () => {
    return JSON.parse(localStorage.getItem('cart') || '[]');
  };
  
  export const addToCart = (item, quantity = 1) => {
    const cart = getCartItems();
    
    // Vérifier si l'élément est déjà dans le panier
    const existingItemIndex = cart.findIndex(cartItem => cartItem.id === item.id);
    
    if (existingItemIndex >= 0) {
      // Mettre à jour la quantité
      cart[existingItemIndex].quantity += quantity;
    } else {
      // Ajouter un nouvel élément
      cart.push({ ...item, quantity });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    return cart;
  };
  
  export const removeFromCart = (itemId) => {
    let cart = getCartItems();
    cart = cart.filter(item => item.id !== itemId);
    localStorage.setItem('cart', JSON.stringify(cart));
    return cart;
  };
  
  export const updateQuantity = (itemId, quantity) => {
    const cart = getCartItems();
    const itemIndex = cart.findIndex(item => item.id === itemId);
    
    if (itemIndex >= 0) {
      if (quantity <= 0) {
        // Si la quantité est 0 ou négative, supprimer l'élément
        return removeFromCart(itemId);
      }
      
      cart[itemIndex].quantity = quantity;
      localStorage.setItem('cart', JSON.stringify(cart));
    }
    
    return cart;
  };
  
  export const clearCart = () => {
    localStorage.setItem('cart', '[]');
    return [];
  };

  // Add this to src/utils/orders.js

// Get order history from localStorage
export const getOrderHistory = () => {
  const storedHistory = localStorage.getItem('orderHistory');
  
  if (storedHistory) {
    return JSON.parse(storedHistory);
  }
  
  // Generate mock order history if none exists
  const mockOrderHistory = generateMockOrderHistory();
  localStorage.setItem('orderHistory', JSON.stringify(mockOrderHistory));
  
  return mockOrderHistory;
};

// Get a specific order by ID
export const getOrderById = (orderId) => {
  const history = getOrderHistory();
  return history.find(order => order.id === orderId);
};

// Add a new order to history
export const addOrderToHistory = (order) => {
  const history = getOrderHistory();
  const updatedHistory = [order, ...history];
  localStorage.setItem('orderHistory', JSON.stringify(updatedHistory));
  return updatedHistory;
};

// Update the status of an order
export const updateOrderStatus = (orderId, newStatus) => {
  const history = getOrderHistory();
  const updatedHistory = history.map(order => {
    if (order.id === orderId) {
      return { ...order, status: newStatus };
    }
    return order;
  });
  localStorage.setItem('orderHistory', JSON.stringify(updatedHistory));
  return updatedHistory;
};

// Update the placeOrder function to add orders to history
export const placeOrder = (location = 'Delivery') => {
  const cartItems = getCartItems();
  
  if (cartItems.length === 0) {
    return {
      success: false,
      message: 'Your cart is empty. Please add items before placing an order.'
    };
  }
  
  try {
    // Calculate order total
    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const deliveryFee = location === 'Delivery' ? 2.50 : 0;
    const taxes = subtotal * 0.2;
    const total = subtotal + deliveryFee + taxes;
    
    // Generate a random order number
    const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;
    
    // Get current timestamp
    const date = new Date().toISOString();
    
    // Create the order object
    const newOrder = {
      id: `order-${Date.now()}`,
      orderNumber,
      date,
      items: cartItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      location,
      address: getAddressForLocation(location),
      subtotal,
      deliveryFee,
      taxes,
      total,
      status: 'in-progress'
    };
    
    // Add to order history
    addOrderToHistory(newOrder);
    
    // Clear the cart
    localStorage.setItem('cartItems', JSON.stringify([]));
    
    return {
      success: true,
      orderId: newOrder.id,
      orderNumber
    };
  } catch (error) {
    return {
      success: false,
      message: 'An error occurred while processing your order. Please try again.'
    };
  }
};

// Helper function to get address based on location
const getAddressForLocation = (location) => {
  switch (location) {
    case 'Delivery':
      return '123 Main St, Your City';
    case 'Office 1':
    case 'Office 2':
    case 'Office 3':
    case 'Office 4':
    case 'Office 5':
      return `Neo Cafe - ${location}`;
    case 'Counter':
      return 'Neo Cafe - Counter Service';
    case 'Outdoor Patio':
      return 'Neo Cafe - Outdoor Patio';
    default:
      return 'Neo Cafe';
  }
};

// Helper function to generate mock order history
const generateMockOrderHistory = () => {
  const now = new Date();
  const mockMenuItems = [
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
  ];
  
  const locations = [
    'Delivery',
    'Office 1',
    'Office 2',
    'Office 3',
    'Counter',
    'Outdoor Patio'
  ];
  
  const statuses = ['completed', 'in-progress', 'delivered', 'cancelled'];
  
  // Generate 10 random orders for the past 2 months
  return Array.from({ length: 10 }, (_, i) => {
    // Random date within the last 60 days
    const orderDate = new Date(now);
    orderDate.setDate(now.getDate() - Math.floor(Math.random() * 60));
    
    // Random items (1-4 items per order)
    const itemCount = Math.floor(Math.random() * 4) + 1;
    const orderItems = [];
    
    for (let j = 0; j < itemCount; j++) {
      const item = mockMenuItems[Math.floor(Math.random() * mockMenuItems.length)];
      const quantity = Math.floor(Math.random() * 3) + 1;
      
      // Check if item already exists in order
      const existingItem = orderItems.find(oi => oi.id === item.id);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        orderItems.push({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity
        });
      }
    }
    
    // Calculate total
    const subtotal = orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const location = locations[Math.floor(Math.random() * locations.length)];
    const deliveryFee = location === 'Delivery' ? 2.50 : 0;
    const taxes = subtotal * 0.2;
    const total = subtotal + deliveryFee + taxes;
    
    // More recent orders are more likely to be in progress
    let status;
    if (i < 2) {
      status = 'in-progress';
    } else {
      status = statuses[Math.floor(Math.random() * (statuses.length - 1)) + (i < 3 ? 0 : 1)];
    }
    
    return {
      id: `order-${Date.now() - i * 86400000}`,
      orderNumber: `ORD-${(100000 + i).toString().slice(-6)}`,
      date: orderDate.toISOString(),
      items: orderItems,
      location,
      address: getAddressForLocation(location),
      subtotal,
      deliveryFee,
      taxes,
      total,
      status
    };
  });
};