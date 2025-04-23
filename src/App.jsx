// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Menu from './pages/Menu';
import Orders from './pages/Orders';
import RobotTracker from './pages/RobotTracker';
import Navbar from './components/Navbar';
import Chatbot from './components/Chatbot';
import { isAuthenticated, getUserRole } from './utils/auth';
import About from './pages/About';
import Contact from './pages/Contact';
import { FaCoffee, FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import OrderHistory from './pages/OrderHistory';
import Notifications from './pages/Notifications';
import OrderDetail from './pages/OrderDetail';

function App() {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    if (isAuthenticated()) {
      const userData = JSON.parse(localStorage.getItem('user'));
      setUser(userData);
    } // user?.username
  }, []);

  // Route protégée pour les pages qui nécessitent une authentification
  const ProtectedRoute = ({ children, adminOnly = false }) => {
    if (!isAuthenticated()) {
      return <Navigate to="/login" />;
    }
    
    // Si la route est réservée aux administrateurs
    if (adminOnly && getUserRole() !== 'admin') {
      return <Navigate to="/menu" />;
    }
    
    return children;
  };

  return (
    <Router>
      <div className="min-h-screen bg-coffee-cream">
        <Navbar user={user} setUser={setUser} />
        
        <main className="container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/signup" element={<Signup setUser={setUser} />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/dashboard" element={
              <ProtectedRoute adminOnly={true}>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/menu" element={
              <ProtectedRoute>
                <Menu />
              </ProtectedRoute>
            } />
            <Route path="/notifications" element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            } />
            <Route path="/order-details/:orderId" element={
              <ProtectedRoute>
                <OrderDetail />
              </ProtectedRoute>
            } />
            <Route path="/order-history" element={
              <ProtectedRoute>
                <OrderHistory />
              </ProtectedRoute>
            } />
            <Route path="/orders" element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            } />
            <Route path="/robot" element={
              <ProtectedRoute>
                <RobotTracker />
              </ProtectedRoute>
            } />
          </Routes>
        </main>

        {/* Footer Section */}
        <footer className="bg-[#1A1210] text-white pt-16 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <Link to="/" className="flex items-center mb-4">
                  <FaCoffee className="h-8 w-8 text-[#D7B49E]" />
                  <h3 className="text-2xl font-bold text-white ml-2">Neo Cafe</h3>
                </Link>
                <p className="text-gray-400 mb-4">
                  Bringing together the best of traditional coffee craftsmanship and cutting-edge technology.
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-400 hover:text-[#D7B49E] transition-colors">
                    <FaInstagram className="h-6 w-6" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-[#D7B49E] transition-colors">
                    <FaTwitter className="h-6 w-6" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-[#D7B49E] transition-colors">
                    <FaFacebook className="h-6 w-6" />
                  </a>
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-[#D7B49E] mb-4">Quick Links</h4>
                <ul className="space-y-2">
                  <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
                  <li><Link to="/menu" className="text-gray-400 hover:text-white transition-colors">Menu</Link></li>
                  <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
                  <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-[#D7B49E] mb-4">Opening Hours</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>Monday - Friday: 7am - 8pm</li>
                  <li>Saturday: 8am - 8pm</li>
                  <li>Sunday: 9am - 6pm</li>
                </ul>
                <div className="mt-4">
                  <h4 className="text-lg font-semibold text-[#D7B49E] mb-2">Contact</h4>
                  <p className="text-gray-400">info@neocafe.com</p>
                  <p className="text-gray-400">+1 (555) 123-4567</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-[#D7B49E] mb-4">Contact</h4>
                <p className="text-gray-400 mb-4">
                  Subscribe to receive updates, access to exclusive deals, and more.
                </p>
                <form className="flex flex-col lg:flex-row gap-2">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="px-4 py-2 bg-[#2A2017] border border-[#3E2723] rounded-md focus:outline-none focus:ring-2 focus:ring-[#D7B49E] text-white"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#D7B49E] text-[#2C1A1D] rounded-md hover:bg-[#E8C7A9] transition-colors font-medium"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
            
            <div className="mt-12 pt-8 border-t border-[#3E2723] text-center text-gray-500">
              <p>&copy; {new Date().getFullYear()} Neo Cafe. All rights reserved.</p>
              {/* <div className="mt-4 flex justify-center space-x-6">
                <Link to="/privacy" className="text-gray-500 hover:text-gray-400 transition-colors">Privacy Policy</Link>
                <Link to="/terms" className="text-gray-500 hover:text-gray-400 transition-colors">Terms of Service</Link>
              </div> */}
            </div>
          </div>
        </footer>
        
        {/* Chatbot flottant */}
        {isAuthenticated() && <Chatbot />}
      </div>
    </Router>
  );
}

export default App;