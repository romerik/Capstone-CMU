// src/pages/Login.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../utils/auth';
import { FaCoffee, FaUser, FaLock, FaSpinner } from 'react-icons/fa';

const Login = ({ setUser }) => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [rememberMe, setRememberMe] = useState(false);

  // Check for saved username on initial load
  useEffect(() => {
    const savedUsername = localStorage.getItem('savedUsername');
    if (savedUsername) {
      setCredentials(prev => ({
        ...prev,
        username: savedUsername
      }));
      setRememberMe(true);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing again
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validate inputs
    if (!credentials.username.trim() || !credentials.password.trim()) {
      setError('Please enter both username and password');
      setIsLoading(false);
      return;
    }

    // Simulate network delay
    setTimeout(() => {
      const result = login(credentials);
      
      if (result.success) {
        // Save username if remember me is checked
        if (rememberMe) {
          localStorage.setItem('savedUsername', credentials.username);
        } else {
          localStorage.removeItem('savedUsername');
        }

        // Log login activity for the dashboard
        logLoginActivity(credentials.username);
        
        // Update user state and redirect
        setUser(result.user);
        navigate('/menu');
      } else {
        // Increment login attempts
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);
        
        // Show appropriate error message
        if (newAttempts >= 3) {
          setError('Too many failed attempts. Please try again later or reset your password.');
        } else {
          setError(result.message || 'Invalid credentials');
        }
      }
      
      setIsLoading(false);
    }, 800);
  };

  // Log login activity to localStorage for dashboard statistics
  const logLoginActivity = (username) => {
    try {
      const now = new Date();
      const loginLog = JSON.parse(localStorage.getItem('loginActivity') || '[]');
      
      loginLog.push({
        timestamp: now.toISOString(),
        username: username,
        device: navigator.userAgent
      });
      
      // Keep only the last 50 logins
      if (loginLog.length > 50) {
        loginLog.shift();
      }
      
      localStorage.setItem('loginActivity', JSON.stringify(loginLog));
    } catch (err) {
      console.error('Failed to log login activity:', err);
    }
  };

  return (
    <div className="min-h-[calc(100vh-76px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md border border-coffee-latte transform transition-all duration-300 hover:shadow-lg">
        <div className="text-center">
          <div className="flex justify-center">
            <FaCoffee className="text-coffee-dark text-4xl" />
          </div>
          <h2 className="mt-4 text-3xl font-extrabold text-coffee-dark">
            Sign In
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <Link to="/signup" className="font-medium text-coffee-accent hover:text-opacity-90 transition-colors">
              create a new account
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-md text-center border border-red-200 animate-pulse">
              {error}
            </div>
          )}
          
          <div className="rounded-md space-y-4">
            <div className="relative group">
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-coffee-accent">
                <FaUser />
              </div>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={credentials.username}
                onChange={handleChange}
                className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-coffee-latte rounded-md focus:outline-none focus:ring-2 focus:ring-coffee-accent focus:border-coffee-accent transition-colors"
                placeholder="Username"
              />
            </div>
            
            <div className="relative group">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-coffee-accent">
                <FaLock />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={credentials.password}
                onChange={handleChange}
                className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-coffee-latte rounded-md focus:outline-none focus:ring-2 focus:ring-coffee-accent focus:border-coffee-accent transition-colors"
                placeholder="Password"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="h-4 w-4 text-coffee-accent focus:ring-coffee-accent border-coffee-latte rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link to="/forgot-password" className="font-medium text-coffee-accent hover:text-opacity-90 transition-colors">
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-md text-white bg-[#4B2E2B] focus:outline-none transition-colors ${
                isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-opacity-90'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <FaSpinner className="animate-spin mr-2" />
                  Signing in...
                </span>
              ) : (
                'Sign in'
              )}
            </button>
          </div>
          
          <div className="text-center text-sm">
            <Link to="/" className="text-coffee-accent hover:text-opacity-90 transition-colors">
              Back to homepage
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;