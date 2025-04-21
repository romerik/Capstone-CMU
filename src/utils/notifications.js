// Add this to src/utils/notifications.js

// Get user notifications from localStorage
export const getUserNotifications = () => {
    const storedNotifications = localStorage.getItem('userNotifications');
    
    if (storedNotifications) {
      return JSON.parse(storedNotifications);
    }
    
    // Generate mock notifications if none exist
    const mockNotifications = generateMockNotifications();
    localStorage.setItem('userNotifications', JSON.stringify(mockNotifications));
    
    return mockNotifications;
  };
  
  // Mark a notification as read
  export const markNotificationAsRead = (id) => {
    const notifications = getUserNotifications();
    const updatedNotifications = notifications.map(notification => {
      if (notification.id === id) {
        return { ...notification, isRead: true };
      }
      return notification;
    });
    
    localStorage.setItem('userNotifications', JSON.stringify(updatedNotifications));
    return updatedNotifications;
  };
  
  // Mark all notifications as read
  export const markAllNotificationsAsRead = () => {
    const notifications = getUserNotifications();
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      isRead: true
    }));
    
    localStorage.setItem('userNotifications', JSON.stringify(updatedNotifications));
    return updatedNotifications;
  };
  
  // Delete a notification
  export const deleteNotification = (id) => {
    const notifications = getUserNotifications();
    const updatedNotifications = notifications.filter(notification => notification.id !== id);
    
    localStorage.setItem('userNotifications', JSON.stringify(updatedNotifications));
    return updatedNotifications;
  };
  
  // Add a new notification
  export const addNotification = (notification) => {
    const notifications = getUserNotifications();
    const newNotification = {
      id: `notification-${Date.now()}`,
      date: new Date().toISOString(),
      isRead: false,
      ...notification
    };
    
    const updatedNotifications = [newNotification, ...notifications];
    localStorage.setItem('userNotifications', JSON.stringify(updatedNotifications));
    
    return updatedNotifications;
  };
  
  // Get unread notifications count
  export const getUnreadNotificationsCount = () => {
    const notifications = getUserNotifications();
    return notifications.filter(notification => !notification.isRead).length;
  };
  
  // Helper function to generate mock notifications
  const generateMockNotifications = () => {
    const now = new Date();
    
    return [
      {
        id: 'notification-1',
        type: 'order_status',
        title: 'Your order has been delivered',
        message: 'Your order #ORD-123456 has been successfully delivered. Enjoy!',
        date: new Date(now.getTime() - 30 * 60000).toISOString(), // 30 minutes ago
        isRead: false,
        orderId: 'order-123456',
        link: '/order-details/order-123456'
      },
      {
        id: 'notification-2',
        type: 'promo',
        title: 'New seasonal menu items available!',
        message: 'Check out our new autumn-inspired drinks and pastries. Available for a limited time only.',
        date: new Date(now.getTime() - 5 * 3600000).toISOString(), // 5 hours ago
        isRead: true,
        link: '/menu'
      },
      {
        id: 'notification-3',
        type: 'rewards',
        title: 'You earned a free coffee!',
        message: 'Congratulations! You\'ve earned a free coffee. Your reward has been added to your account.',
        date: new Date(now.getTime() - 24 * 3600000).toISOString(), // 1 day ago
        isRead: false,
        link: '/profile/rewards'
      },
      {
        id: 'notification-4',
        type: 'order_status',
        title: 'Your order is in progress',
        message: 'Your order #ORD-789012 is being prepared and will be ready for pickup soon.',
        date: new Date(now.getTime() - 45 * 60000).toISOString(), // 45 minutes ago
        isRead: true,
        orderId: 'order-789012',
        link: '/order-details/order-789012'
      },
      {
        id: 'notification-5',
        type: 'system',
        title: 'App update available',
        message: 'A new version of the Neo Cafe app is available with exciting new features!',
        date: new Date(now.getTime() - 3 * 24 * 3600000).toISOString(), // 3 days ago
        isRead: true,
        link: null
      },
      {
        id: 'notification-6',
        type: 'promo',
        title: 'Happy Hour: 50% off all coffees!',
        message: 'Join us today from 2-4pm for half price on all coffee drinks. Don\'t miss out!',
        date: new Date(now.getTime() - 8 * 3600000).toISOString(), // 8 hours ago
        isRead: false,
        link: '/menu'
      },
      {
        id: 'notification-7',
        type: 'rewards',
        title: 'Your loyalty status has increased',
        message: 'Congratulations! You are now a Gold Member. Enjoy 10% off all orders and exclusive perks.',
        date: new Date(now.getTime() - 2 * 24 * 3600000).toISOString(), // 2 days ago
        isRead: true,
        link: '/profile/rewards'
      },
      {
        id: 'notification-8',
        type: 'order_status',
        title: 'Your order is ready for pickup',
        message: 'Your order #ORD-345678 is ready! Please come to the counter to collect your items.',
        date: new Date(now.getTime() - 2 * 3600000).toISOString(), // 2 hours ago
        isRead: false,
        orderId: 'order-345678',
        link: '/order-details/order-345678'
      },
      {
        id: 'notification-9',
        type: 'system',
        title: 'Payment method expired',
        message: 'Your saved payment method has expired. Please update your payment information.',
        date: new Date(now.getTime() - 4 * 24 * 3600000).toISOString(), // 4 days ago
        isRead: true,
        link: '/profile/payment-methods'
      },
      {
        id: 'notification-10',
        type: 'promo',
        title: 'Weekend special: Buy one, get one free',
        message: 'This weekend only: Buy any pastry and get a second one free. Valid in-store only.',
        date: new Date(now.getTime() - 36 * 3600000).toISOString(), // 36 hours ago
        isRead: false,
        link: '/menu'
      }
    ];
  };