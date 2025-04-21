// src/pages/Contact.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaCoffee, FaPaperPlane } from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    }, 1500);
  };
  
  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      {/* Hero Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[url('/contact-hero.jpg')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-[#2C1A1D] bg-opacity-70"></div>
        <div className="max-w-5xl mx-auto relative z-10 text-center py-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            Get In Touch
          </h1>
          <p className="mt-6 text-xl sm:text-2xl text-[#D7B49E] font-light max-w-3xl mx-auto leading-relaxed">
            We'd love to hear from you. Questions, feedback, or just want to say hello?
          </p>
        </div>
      </section>
      
      {/* Contact Info Cards */}
      <section className="py-12 -mt-16 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-[#2C1A1D] rounded-full p-4 inline-block">
                  <FaPhone className="h-6 w-6 text-[#D7B49E]" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-[#2C1A1D] mb-2">Call Us</h3>
              <p className="text-gray-600">Customer Service:</p>
              <p className="text-[#2C1A1D] font-medium">+1 (555) 123-4567</p>
              <p className="text-gray-600 mt-2">Order Support:</p>
              <p className="text-[#2C1A1D] font-medium">+1 (555) 765-4321</p>
            </div>
            
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-[#2C1A1D] rounded-full p-4 inline-block">
                  <FaEnvelope className="h-6 w-6 text-[#D7B49E]" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-[#2C1A1D] mb-2">Email Us</h3>
              <p className="text-gray-600">General Inquiries:</p>
              <p className="text-[#2C1A1D] font-medium">info@neocafe.com</p>
              <p className="text-gray-600 mt-2">Customer Support:</p>
              <p className="text-[#2C1A1D] font-medium">support@neocafe.com</p>
            </div>
            
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-[#2C1A1D] rounded-full p-4 inline-block">
                  <FaMapMarkerAlt className="h-6 w-6 text-[#D7B49E]" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-[#2C1A1D] mb-2">Visit Us</h3>
              <p className="text-gray-600">Main Location:</p>
              <p className="text-[#2C1A1D] font-medium">123 Coffee Street</p>
              <p className="text-[#2C1A1D] font-medium">New York, NY 10001</p>
              <Link to="/locations" className="inline-block text-[#D7B49E] hover:text-[#2C1A1D] mt-2 font-medium">
                View All Locations →
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Contact Form and Hours */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold text-[#2C1A1D] mb-6">Send Us a Message</h2>
              <p className="text-gray-600 mb-8">We'll get back to you as soon as possible.</p>
              
              {submitSuccess ? (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6" role="alert">
                  <strong className="font-bold">Thank you!</strong>
                  <span className="block sm:inline"> Your message has been sent successfully. We'll be in touch soon.</span>
                </div>
              ) : null}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#D7B49E] focus:ring-0 transition-colors"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Your Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#D7B49E] focus:ring-0 transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#D7B49E] focus:ring-0 transition-colors"
                    placeholder="How can we help you?"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="6"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#D7B49E] focus:ring-0 transition-colors resize-none"
                    placeholder="Please provide as much detail as possible..."
                  ></textarea>
                </div>
                
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-[#2C1A1D] hover:bg-[#3E2723] focus:outline-none transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane className="mr-2" /> Send Message
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-[#FFF8F0] rounded-xl p-8 h-full">
                <div className="flex items-center mb-6">
                  <FaCoffee className="h-8 w-8 text-[#D7B49E]" />
                  <h3 className="text-2xl font-bold text-[#2C1A1D] ml-2">Neo Cafe</h3>
                </div>
                
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-[#2C1A1D] mb-3 flex items-center">
                    <FaClock className="mr-2 text-[#D7B49E]" /> Hours of Operation
                  </h4>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex justify-between">
                      <span>Monday - Friday</span>
                      <span className="font-medium">7:00 AM - 8:00 PM</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Saturday</span>
                      <span className="font-medium">8:00 AM - 8:00 PM</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Sunday</span>
                      <span className="font-medium">9:00 AM - 6:00 PM</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-[#2C1A1D] mb-3">Follow Us</h4>
                  <div className="flex space-x-4">
                    <a href="#" className="w-10 h-10 rounded-full bg-[#2C1A1D] flex items-center justify-center text-white hover:bg-[#D7B49E] hover:text-[#2C1A1D] transition-colors">
                      <i className="fab fa-facebook-f"></i>
                    </a>
                    <a href="#" className="w-10 h-10 rounded-full bg-[#2C1A1D] flex items-center justify-center text-white hover:bg-[#D7B49E] hover:text-[#2C1A1D] transition-colors">
                      <i className="fab fa-twitter"></i>
                    </a>
                    <a href="#" className="w-10 h-10 rounded-full bg-[#2C1A1D] flex items-center justify-center text-white hover:bg-[#D7B49E] hover:text-[#2C1A1D] transition-colors">
                      <i className="fab fa-instagram"></i>
                    </a>
                    <a href="#" className="w-10 h-10 rounded-full bg-[#2C1A1D] flex items-center justify-center text-white hover:bg-[#D7B49E] hover:text-[#2C1A1D] transition-colors">
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                  </div>
                </div>
                
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h4 className="text-lg font-semibold text-[#2C1A1D] mb-3">Need Immediate Assistance?</h4>
                  <p className="text-gray-600 mb-4">Our customer service team is available during business hours.</p>
                  <a href="tel:+15551234567" className="inline-flex items-center justify-center w-full px-4 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-[#D7B49E] hover:bg-[#2C1A1D] focus:outline-none transition-colors">
                    <FaPhone className="mr-2" /> Call Now
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      
      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#2C1A1D] mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600">
              Can't find what you're looking for? Feel free to contact us directly.
            </p>
          </div>
          
          <div className="space-y-6">
            {[
              {
                question: "How does the robot delivery work?",
                answer: "Our autonomous robots navigate city streets using advanced AI and sensors. They keep your order at the perfect temperature and notify you when they're approaching. Just meet the robot at your door or designated meeting point and use the app to unlock your order."
              },
              {
                question: "What areas do you currently deliver to?",
                answer: "We currently deliver within a 2-mile radius of each Neo Cafe location. You can check if your address is within our delivery zone by entering it in our app or website before placing an order."
              },
              {
                question: "How do I track my order?",
                answer: "Once you've placed an order, you can track its status in real-time through our mobile app or website. You'll receive notifications when your order is being prepared, when it's out for delivery, and when it's about to arrive."
              },
              {
                question: "Do you offer catering services?",
                answer: "Yes, we offer catering for events of all sizes. Please contact us at catering@neocafe.com or fill out the form above at least 48 hours in advance to discuss your specific requirements."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-[#FFF8F0] rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-[#2C1A1D] mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
          
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-[#2C1A1D] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to experience Neo Cafe?</h2>
          <p className="text-xl text-[#D7B49E] mb-10 max-w-3xl mx-auto">
            Download our app to browse our menu, place orders, and track your delivery in real-time.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-[#D7B49E] text-base font-medium rounded-full shadow-lg text-[#2C1A1D] bg-[#D7B49E] hover:bg-transparent hover:text-white transition-all duration-300"
            >
              Sign Up Free
            </Link>
            <Link
              to="/menu"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-[#D7B49E] text-base font-medium rounded-full shadow-lg text-white bg-transparent hover:bg-[#D7B49E] hover:text-[#2C1A1D] transition-all duration-300"
            >
              Explore Our Menu
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;