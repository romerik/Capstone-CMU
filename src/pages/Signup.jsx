// src/pages/Signup.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../utils/auth';
import { FaCoffee, FaUser, FaLock, FaIdCard, FaSpinner, FaCheck, FaTimes } from 'react-icons/fa';

const Signup = ({ setUser }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    role: 'user'
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  
  // Password criteria checks
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false
  });

  const validatePassword = (password) => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password)
    };
    
    setPasswordChecks(checks);
    
    // Calculate password strength (0-100)
    const passedChecks = Object.values(checks).filter(Boolean).length;
    setPasswordStrength(passedChecks * 25);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing again
    if (error) setError('');
    
    // Validate password strength
    if (name === 'password') {
      validatePassword(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check that passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    // Check password strength
    if (passwordStrength < 50) {
      setError('Password is too weak. Please follow the recommendations.');
      return;
    }
    
    setIsLoading(true);
    setError('');

    // Log signup attempt for analytics
    logSignupAttempt(formData.username, formData.role);

    // Simulate network delay
    setTimeout(() => {
      const result = signup({
        username: formData.username,
        password: formData.password,
        role: formData.role
      });
      
      if (result.success) {
        setUser(result.user);
        navigate('/menu');
      } else {
        setError(result.message || 'Error creating account');
      }
      
      setIsLoading(false);
    }, 800);
  };

  // Log signup activity to localStorage for dashboard statistics
  const logSignupAttempt = (username, role) => {
    try {
      const now = new Date();
      const signupLog = JSON.parse(localStorage.getItem('signupActivity') || '[]');
      
      signupLog.push({
        timestamp: now.toISOString(),
        username,
        role,
        success: false, // Will be updated to true if signup succeeds
        device: navigator.userAgent
      });
      
      // Keep only the last 50 signups
      if (signupLog.length > 50) {
        signupLog.shift();
      }
      
      localStorage.setItem('signupActivity', JSON.stringify(signupLog));
    } catch (err) {
      console.error('Failed to log signup activity:', err);
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
            Create Account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <Link to="/login" className="font-medium text-coffee-accent hover:text-opacity-90 transition-colors">
              sign in to your existing account
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
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-coffee-accent mt-6">
                <FaUser />
              </div>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={formData.username}
                onChange={handleChange}
                className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-coffee-latte rounded-md focus:outline-none focus:ring-2 focus:ring-coffee-accent focus:border-coffee-accent transition-colors"
                placeholder="Username"
              />
            </div>
            
            <div className="relative group">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-coffee-accent mt-6">
                <FaLock />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-coffee-latte rounded-md focus:outline-none focus:ring-2 focus:ring-coffee-accent focus:border-coffee-accent transition-colors"
                placeholder="Password"
              />
              
              {/* Password strength meter */}
              {formData.password && (
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        passwordStrength < 25 ? 'bg-red-500' : 
                        passwordStrength < 50 ? 'bg-yellow-500' : 
                        passwordStrength < 75 ? 'bg-yellow-400' : 'bg-green-500'
                      }`}
                      style={{ width: `${passwordStrength}%` }}
                    ></div>
                  </div>
                  
                  {/* Password requirements checklist */}
                  <div className="mt-2 grid grid-cols-2 gap-1 text-xs">
                    <div className={`flex items-center ${passwordChecks.length ? 'text-green-600' : 'text-gray-500'}`}>
                      {passwordChecks.length ? <FaCheck className="mr-1" /> : <FaTimes className="mr-1 cursor-pointer" />}
                      At least 8 characters
                    </div>
                    <div className={`flex items-center ${passwordChecks.uppercase ? 'text-green-600' : 'text-gray-500'}`}>
                      {passwordChecks.uppercase ? <FaCheck className="mr-1" /> : <FaTimes className="mr-1 cursor-pointer" />}
                      Uppercase letter
                    </div>
                    <div className={`flex items-center ${passwordChecks.lowercase ? 'text-green-600' : 'text-gray-500'}`}>
                      {passwordChecks.lowercase ? <FaCheck className="mr-1" /> : <FaTimes className="mr-1 cursor-pointer" />}
                      Lowercase letter
                    </div>
                    <div className={`flex items-center ${passwordChecks.number ? 'text-green-600' : 'text-gray-500'}`}>
                      {passwordChecks.number ? <FaCheck className="mr-1" /> : <FaTimes className="mr-1 cursor-pointer" />}
                      Number
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="relative group">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-coffee-accent mt-6">
                <FaLock />
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-coffee-latte rounded-md focus:outline-none focus:ring-2 focus:ring-coffee-accent focus:border-coffee-accent transition-colors"
                placeholder="Confirm password"
              />
              {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">Passwords do not match</p>
              )}
            </div>
            
            <div className="relative group">
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-coffee-accent mt-6">
                <FaIdCard />
              </div>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-coffee-latte rounded-md focus:outline-none focus:ring-2 focus:ring-coffee-accent focus:border-coffee-accent transition-colors"
              >
                <option value="user">Customer</option>
                <option value="admin">Administrator</option>
              </select>
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
                  Creating account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </div>
          
          <div className="text-center text-sm">
            <Link to="/" className="text-coffee-accent hover:text-opacity-90 transition-colors">
              Back to home
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;