// src/utils/auth.js
export const isAuthenticated = () => {
    return localStorage.getItem('user') !== null;
  };
  
  export const getUserRole = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.role || 'user';
  };
  
  export const login = (credentials) => {
    // Dans une vraie application, ceci ferait un appel API
    // Ici, nous simulons une authentification avec localStorage
    
    // Vérifier si l'utilisateur existe déjà
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.username === credentials.username);
    
    if (user && user.password === credentials.password) {
      // Stocker l'utilisateur connecté (sans le mot de passe)
      const loggedUser = { 
        id: user.id,
        username: user.username,
        role: user.role
      };
      localStorage.setItem('user', JSON.stringify(loggedUser));
      return { success: true, user: loggedUser };
    }
    
    return { success: false, message: 'Incorrect credentials' };
  };
  
  export const signup = (userData) => {
    // Récupérer la liste des utilisateurs existants
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Vérifier si l'utilisateur existe déjà
    if (users.some(user => user.username === userData.username)) {
      return { success: false, message: 'Cet utilisateur existe déjà' };
    }
    
    // Créer un nouvel utilisateur
    const newUser = {
      id: Date.now().toString(),
      username: userData.username,
      password: userData.password,
      role: userData.role || 'user' // Par défaut, un nouvel utilisateur a le rôle 'user'
    };
    
    // Ajouter l'utilisateur à la liste
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Connecter automatiquement l'utilisateur
    const loggedUser = { 
      id: newUser.id,
      username: newUser.username,
      role: newUser.role
    };
    localStorage.setItem('user', JSON.stringify(loggedUser));
    
    return { success: true, user: loggedUser };
  };
  
  export const logout = () => {
    localStorage.removeItem('user');
  };