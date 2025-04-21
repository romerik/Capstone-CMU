// src/utils/chat.js

/**
 * Gets the chat history from localStorage
 * @returns {Array} Array of message objects
 */
export const getChatHistory = () => {
  try {
    const history = JSON.parse(localStorage.getItem('chatHistory') || '[]');
    return Array.isArray(history) ? history : [];
  } catch (error) {
    console.error('Error loading chat history:', error);
    return [];
  }
};

/**
 * Saves a message to localStorage and updates the chat history
 * @param {Object} message - Message object to save
 */
export const saveMessage = (message) => {
  try {
    const history = getChatHistory();
    const updatedHistory = [...history, message];
    
    // Only keep the last 100 messages to avoid localStorage size limits
    const limitedHistory = updatedHistory.slice(-100);
    
    localStorage.setItem('chatHistory', JSON.stringify(limitedHistory));
  } catch (error) {
    console.error('Error saving message:', error);
  }
};

/**
 * Clears all chat history from localStorage
 */
export const clearChatHistory = () => {
  try {
    localStorage.removeItem('chatHistory');
  } catch (error) {
    console.error('Error clearing chat history:', error);
  }
};

/**
 * Searches for messages in chat history containing the query
 * @param {string} query - Text to search for
 * @returns {Array} Array of matching message objects
 */
export const searchChatHistory = (query) => {
  if (!query || typeof query !== 'string') return [];
  
  const history = getChatHistory();
  const searchTerm = query.toLowerCase();
  
  return history.filter(message => 
    message.text.toLowerCase().includes(searchTerm)
  );
};

/**
 * Gets the common questions/topics from chat history
 * Useful for suggesting topics to users
 * @returns {Array} Array of common topics
 */
export const getCommonTopics = () => {
  const history = getChatHistory();
  
  // Only consider user messages
  const userMessages = history.filter(msg => msg.sender === 'user');
  
  // Extract keywords (simple implementation - could be improved)
  const topics = {};
  
  userMessages.forEach(msg => {
    const words = msg.text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3);
      
    words.forEach(word => {
      topics[word] = (topics[word] || 0) + 1;
    });
  });
  
  // Convert to array and sort by frequency
  return Object.entries(topics)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([topic]) => topic);
};

/**
 * Gets the most recent conversation date
 * @returns {string|null} Date string or null if no history
 */
export const getLastConversationDate = () => {
  const history = getChatHistory();
  
  if (history.length === 0) return null;
  
  // Get the most recent timestamp
  const timestamps = history.map(msg => new Date(msg.timestamp).getTime());
  const mostRecent = new Date(Math.max(...timestamps));
  
  return mostRecent.toLocaleDateString();
};

/**
 * Groups messages by conversation (based on time gaps)
 * @returns {Array} Array of conversation objects
 */
export const getConversations = () => {
  const history = getChatHistory();
  
  if (history.length === 0) return [];
  
  // Sort messages by timestamp
  const sortedMessages = [...history].sort(
    (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
  );
  
  const conversations = [];
  let currentConvo = [];
  let lastMsgTime = null;
  
  sortedMessages.forEach(msg => {
    const msgTime = new Date(msg.timestamp).getTime();
    
    // If more than 30 minutes have passed, start a new conversation
    if (lastMsgTime && (msgTime - lastMsgTime) > 30 * 60 * 1000) {
      if (currentConvo.length > 0) {
        conversations.push([...currentConvo]);
        currentConvo = [];
      }
    }
    
    currentConvo.push(msg);
    lastMsgTime = msgTime;
  });
  
  // Add the last conversation
  if (currentConvo.length > 0) {
    conversations.push(currentConvo);
  }
  
  // Format conversations with metadata
  return conversations.map(convo => {
    const startTime = new Date(convo[0].timestamp);
    const userMessages = convo.filter(msg => msg.sender === 'user');
    
    return {
      id: startTime.getTime().toString(),
      date: startTime.toLocaleDateString(),
      time: startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      messages: convo,
      preview: userMessages.length > 0 ? userMessages[0].text : 'Conversation',
      messageCount: convo.length
    };
  }).sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date (newest first)
};