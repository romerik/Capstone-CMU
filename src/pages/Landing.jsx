// src/pages/Landing.jsx
import { Link } from 'react-router-dom';
import { FaCoffee, FaUtensils, FaRobot, FaArrowRight, FaInstagram, FaTwitter, FaFacebook, FaStar, FaQuoteLeft, FaLeaf, FaShippingFast, FaCreditCard } from 'react-icons/fa';
import { isAuthenticated } from '../utils/auth';
import { useState, useEffect } from 'react';

const Landing = () => {
  const isLoggedIn = isAuthenticated();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Auto-rotate testimonials
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, []);

  const testimonials = [
    {
      name: "Emmanuel Adjei",
      role: "Coffee Enthusiast",
      image: "/1.jpg",
      quote: "Fast delivery and always accurate orders. The coffee arrives hot and fresh every single time. Neo Cafe has changed my mornings."
    },
    {
      name: "Lynn Ahabwe",
      role: "Regular Customer",
      image: "/2.jpg",
      quote: "The AI assistant recommended a coffee I'd never tried before. Now it's my favorite! Neo Cafe knows exactly what I need."
    },
    {
      name: "Romerik Lokossou",
      role: "Barista Apprentice",
      image: "/3.jpg",
      quote: "The quality of the coffee at Neo Cafe is unmatched. From bean to cup, you can taste the attention to detail in every sip."
    }
  ];
  
  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      {/* Floating Navigation */}

      {/* Hero Section with Advanced Animation */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('/hero.jpg')] bg-cover bg-center transform scale-105 transition-transform duration-10000 ease-in-out animate-slow-zoom"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#00000099] via-[#00000066] to-[#00000099]"></div>
        
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-[#000000AA] to-transparent"></div>
          <div className="absolute -bottom-5 left-0 w-full h-40 bg-gradient-to-t from-[#2C1A1D] to-transparent"></div>
          
          {/* Animated Coffee Particles */}
          <div className="coffee-steam absolute top-1/4 left-1/4 opacity-40">
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
          </div>
          
          <div className="coffee-steam absolute top-1/3 right-1/4 opacity-30">
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
          </div>
        </div>
        
        <div className="max-w-5xl mx-auto relative z-10 text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-4 tracking-tight drop-shadow-lg animate-fade-in-up">
            <span className="block transform transition-transform duration-700">Neo Cafe</span>
          </h1>
          <p className="mt-6 text-xl sm:text-2xl text-white font-light max-w-2xl mx-auto leading-relaxed drop-shadow-lg opacity-0 animate-fade-in-up animation-delay-300">
            <span className="bg-gradient-to-r from-[#D7B49E] to-white bg-clip-text text-transparent">Authentic flavor, delivered by modern technology</span>
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center opacity-0 animate-fade-in-up animation-delay-600">
            <Link
              to={isLoggedIn ? '/menu' : '/signup'}
              className="group inline-flex items-center px-8 py-4 border-2 border-[#D7B49E] text-base font-medium rounded-full shadow-lg text-white bg-transparent hover:bg-[#D7B49E] hover:text-[#2C1A1D] transition-all duration-300"
            >
              <span className="relative overflow-hidden">
                <span className="absolute w-full h-full top-0 left-0 bg-[#D7B49E] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
                <span className="relative z-10 group-hover:text-[#2C1A1D] transition-colors duration-300">{isLoggedIn ? 'View Menu' : 'Get Started'}</span>
              </span>
              <FaArrowRight className="ml-2 group-hover:text-[#2C1A1D] transition-colors duration-300" />
            </Link>
            <Link
              to="/about"
              className="group inline-flex items-center px-8 py-4 text-base font-medium rounded-full shadow-lg text-[#2C1A1D] bg-[#D7B49E] hover:bg-transparent hover:text-white border-2 border-[#D7B49E] transition-all duration-300"
            >
              <span className="relative overflow-hidden">
                <span className="absolute w-full h-full top-0 left-0 bg-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                <span className="relative z-10">Learn More</span>
              </span>
            </Link>
          </div>
        </div>
        
        <div className="absolute bottom-10 left-0 right-0 flex justify-center animate-bounce opacity-0 animate-fade-in animation-delay-900">
          <a href="#features" className="text-white hover:text-[#D7B49E] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </a>
        </div>
      </section>
      
      {/* Highlight Bar */}
      <section className="bg-[#2C1A1D] text-white py-8 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center justify-center p-4 hover:bg-[#3E2723] rounded-lg transition-colors">
              <FaLeaf className="h-8 w-8 text-[#D7B49E] mb-3" />
              <h3 className="text-lg font-medium">Ethically Sourced</h3>
              <p className="text-sm text-[#D7B49E]">Direct trade with farmers</p>
            </div>
            <div className="flex flex-col items-center justify-center p-4 hover:bg-[#3E2723] rounded-lg transition-colors">
              <FaCoffee className="h-8 w-8 text-[#D7B49E] mb-3" />
              <h3 className="text-lg font-medium">Freshly Roasted</h3>
              <p className="text-sm text-[#D7B49E]">In-house master roasters</p>
            </div>
            <div className="flex flex-col items-center justify-center p-4 hover:bg-[#3E2723] rounded-lg transition-colors">
              <FaShippingFast className="h-8 w-8 text-[#D7B49E] mb-3" />
              <h3 className="text-lg font-medium">Fast Delivery</h3>
              <p className="text-sm text-[#D7B49E]">30 minutes or less</p>
            </div>
            <div className="flex flex-col items-center justify-center p-4 hover:bg-[#3E2723] rounded-lg transition-colors">
              <FaCreditCard className="h-8 w-8 text-[#D7B49E] mb-3" />
              <h3 className="text-lg font-medium">Secure Payment</h3>
              <p className="text-sm text-[#D7B49E]">Multiple options</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section with Animations */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            {/* <span className="inline-block text-[#D7B49E] font-semibold mb-2 uppercase tracking-wider">Our Offerings</span> */}
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#2C1A1D] relative inline-block">
              Why Choose Neo Cafe
              <span className="absolute -bottom-3 left-0 right-0 h-1 bg-[#D7B49E]"></span>
            </h2>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600">
              A unique coffee experience, from order to delivery
            </p>
          </div>
          
          <div className="mt-16">
            <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
              <div className="bg-[#FFF8F0] rounded-xl p-8 text-center shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-20 h-20 bg-[#D7B49E] transform translate-x-10 -translate-y-10 rotate-45 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="flex justify-center relative z-10">
                  <div className="bg-[#2C1A1D] rounded-full p-4 inline-block shadow-lg group-hover:bg-[#3E2723] transition-colors">
                    <FaCoffee className="h-8 w-8 text-[#D7B49E]" />
                  </div>
                </div>
                <h3 className="mt-6 text-xl font-semibold text-[#2C1A1D] relative z-10">
                  Premium Coffee
                </h3>
                <p className="mt-4 text-base text-gray-600 leading-relaxed relative z-10">
                  Our beans are carefully selected and roasted to perfection for an exceptional flavor experience in every cup.
                </p>
                <div className="mt-6 relative z-10">
                  <Link to="/menu" className="inline-block text-[#2C1A1D] hover:text-[#D7B49E] font-medium transition-colors">
                    Explore Menu <span className="ml-1">→</span>
                  </Link>
                </div>
              </div>
              
              <div className="bg-[#FFF8F0] rounded-xl p-8 text-center shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-20 h-20 bg-[#D7B49E] transform translate-x-10 -translate-y-10 rotate-45 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="flex justify-center relative z-10">
                  <div className="bg-[#2C1A1D] rounded-full p-4 inline-block shadow-lg group-hover:bg-[#3E2723] transition-colors">
                    <FaUtensils className="h-8 w-8 text-[#D7B49E]" />
                  </div>
                </div>
                <h3 className="mt-6 text-xl font-semibold text-[#2C1A1D] relative z-10">
                  Diverse Menu
                </h3>
                <p className="mt-4 text-base text-gray-600 leading-relaxed relative z-10">
                  From classic coffee to original creations, complemented by a selection of homemade pastries and snacks.
                </p>
                <div className="mt-6 relative z-10">
                  <Link to="/menu" className="inline-block text-[#2C1A1D] hover:text-[#D7B49E] font-medium transition-colors">
                    See Full Menu <span className="ml-1">→</span>
                  </Link>
                </div>
              </div>
              
              <div className="bg-[#FFF8F0] rounded-xl p-8 text-center shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-20 h-20 bg-[#D7B49E] transform translate-x-10 -translate-y-10 rotate-45 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="flex justify-center relative z-10">
                  <div className="bg-[#2C1A1D] rounded-full p-4 inline-block shadow-lg group-hover:bg-[#3E2723] transition-colors">
                    <FaRobot className="h-8 w-8 text-[#D7B49E]" />
                  </div>
                </div>
                <h3 className="mt-6 text-xl font-semibold text-[#2C1A1D] relative z-10">
                  Robotic Delivery
                </h3>
                <p className="mt-4 text-base text-gray-600 leading-relaxed relative z-10">
                  Your order delivered promptly by our intelligent robots, with real-time tracking and zero carbon footprint.
                </p>
                <div className="mt-6 relative z-10">
                  <Link to="/robot-tracker" className="inline-block text-[#2C1A1D] hover:text-[#D7B49E] font-medium transition-colors">
                    Track Your Order <span className="ml-1">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Testimonials Section with Carousel */}
      <section className="py-24 bg-[#2C1A1D] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white relative inline-block">
              Customer Testimonials
              <span className="absolute -bottom-3 left-0 right-0 h-1 bg-[#D7B49E]"></span>
            </h2>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-[#D7B49E]">
              Don't just take our word for it
            </p>
          </div>
          
          <div className="relative">
            <div className="overflow-hidden">
              <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${activeTestimonial * 100}%)` }}>
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-4">
                    <div className="bg-[#3E2723] rounded-xl p-8 shadow-lg relative max-w-3xl mx-auto">
                      <div className="absolute -top-5 left-8 text-4xl text-[#D7B49E] opacity-50">
                        <FaQuoteLeft />
                      </div>
                      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mt-4">
                        <div className="flex-shrink-0">
                          <div className="h-24 w-24 rounded-full bg-[#D7B49E] flex items-center justify-center overflow-hidden border-4 border-[#D7B49E]">
                            <img src={testimonial.image} alt={testimonial.name} className="h-full w-full object-cover" />
                          </div>
                        </div>
                        <div className="flex-grow text-center md:text-left">
                          <p className="text-lg leading-relaxed mb-6">{testimonial.quote}</p>
                          <div className="mt-4">
                            <h4 className="text-xl font-semibold text-white">{testimonial.name}</h4>
                            <p className="text-sm text-[#D7B49E]">{testimonial.role}</p>
                            <div className="mt-2 flex justify-center md:justify-start text-yellow-500">
                              {[...Array(5)].map((_, i) => (
                                <FaStar key={i} className="mr-1" />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full ${activeTestimonial === index ? 'bg-[#D7B49E]' : 'bg-[#D7B49E] bg-opacity-30'} transition-colors`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
      
      
      {/* Call to Action Section */}
      <section className="py-20 bg-[#2C1A1D] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/beans-pattern.jpg')] bg-repeat opacity-5"></div>
        
        {/* Animated Coffee Elements */}
        <div className="absolute top-10 left-10 text-[#D7B49E] opacity-10 animate-float">
          <FaCoffee className="h-20 w-20" />
        </div>
        <div className="absolute bottom-10 right-10 text-[#D7B49E] opacity-10 animate-float-delayed">
          <FaCoffee className="h-16 w-16" />
        </div>
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-6">
              Ready to experience Neo Cafe?
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-[#D7B49E]">
              Create an account and order now. Your first delivery is on us!
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to={isLoggedIn ? '/menu' : '/signup'}
                className="group relative inline-flex items-center justify-center px-8 py-4 overflow-hidden font-medium rounded-full bg-[#D7B49E] text-[#2C1A1D] shadow-lg"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#D7B49E] via-[#E8C7A9] to-[#D7B49E]"></span>
                <span className="absolute bottom-0 right-0 block w-64 h-64 mb-32 mr-4 transition-all duration-500 origin-bottom-left transform rotate-45 translate-x-24 bg-[#2C1A1D] opacity-30 group-hover:rotate-90 ease-out"></span>
                <span className="relative">{isLoggedIn ? 'View Menu' : 'Sign Up Free'}</span>
              </Link>
              <Link
                to="/menu"
                className="group relative inline-flex items-center justify-center px-8 py-4 overflow-hidden text-[#D7B49E] border-2 border-[#D7B49E] font-medium rounded-full hover:text-white"
              >
                <span className="absolute left-0 block w-full h-0 transition-all bg-[#D7B49E] opacity-100 group-hover:h-full top-1/2 group-hover:top-0 duration-400 ease"></span>
                <span className="absolute right-0 flex items-center justify-start w-10 h-10 duration-300 transform translate-x-full group-hover:translate-x-0 ease">
                  <FaArrowRight />
                </span>
                <span className="relative">Explore Our Menu</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Add CSS for animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes slowZoom {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }
        
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
          100% {
            transform: translateY(0px);
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease forwards;
        }
        
        .animate-fade-in {
          animation: fadeIn 0.8s ease forwards;
        }
        
        .animate-slow-zoom {
          animation: slowZoom 15s infinite ease-in-out;
        }
        
        .animate-float {
          animation: float 6s infinite ease-in-out;
        }
        
        .animate-float-delayed {
          animation: float 8s infinite ease-in-out;
          animation-delay: 2s;
        }
        
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
        
        .animation-delay-600 {
          animation-delay: 0.6s;
        }
        
        .animation-delay-900 {
          animation-delay: 0.9s;
        }
        
        .coffee-steam {
          position: absolute;
          width: 60px;
        }
        
        .particle {
          position: absolute;
          width: 8px;
          height: 8px;
          background-color: white;
          border-radius: 50%;
          animation: float 4s infinite ease-in-out;
        }
        
        .particle:nth-child(1) {
          left: 10px;
          animation-duration: 4s;
        }
        
        .particle:nth-child(2) {
          left: 25px;
          animation-duration: 6s;
          animation-delay: 1s;
        }
        
        .particle:nth-child(3) {
          left: 40px;
          animation-duration: 5s;
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default Landing;