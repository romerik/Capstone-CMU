// src/pages/About.jsx
import { Link } from 'react-router-dom';
import { FaCoffee, FaLeaf, FaRobot, FaMugHot, FaUsers, FaMapMarkedAlt } from 'react-icons/fa';
import { isAuthenticated } from '../utils/auth';

const About = () => {
  const isLoggedIn = isAuthenticated();

  return (
    <div className="min-h-screen bg-[#FFF1E0]">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[url('/images/backgrounds/about-hero.jpg')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-[#4B2E2B] bg-opacity-70"></div>
        <div className="max-w-5xl mx-auto relative z-10 text-center py-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            About Neo Cafe
          </h1>
          <p className="mt-6 text-xl sm:text-2xl text-[#D7C0AE] font-light max-w-3xl mx-auto leading-relaxed">
            Where tradition meets technology for an extraordinary coffee experience
          </p>
        </div>
      </section>
      
      {/* Our Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#4B2E2B] mb-6 relative inline-block">
                Our Mission
                <span className="absolute -bottom-3 left-0 right-0 h-1 bg-[#8FB996]"></span>
              </h2>
              <p className="text-[#2E2E2E] mb-6 leading-relaxed">
                At Neo Cafe, we're on a mission to revolutionize the coffee experience by blending the artisanal traditions of coffee-making with cutting-edge technology.
              </p>
              <p className="text-[#2E2E2E] mb-6 leading-relaxed">
                We believe that exceptional coffee shouldn't be limited by conventional delivery methods. Our robotic delivery system ensures that every cup reaches you at the perfect temperature, exactly when you want it.
              </p>
              <p className="text-[#2E2E2E] leading-relaxed">
                Beyond serving great coffee, we're committed to sustainability, fair trade practices, and creating a unique experience that honors coffee's rich heritage while embracing the future.
              </p>
            </div>
            <div className="relative">
              <img src="/hero.jpg" alt="Neo Cafe Mission" className="rounded-lg h-[400px] w-full object-cover shadow-xl" />
              <div className="absolute -bottom-6 -left-6 bg-[#4B2E2B] rounded-lg p-4 shadow-lg">
                <FaCoffee className="h-10 w-10 text-[#FFF1E0]" />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Our Story Section */}
      <section className="py-20 bg-[#FFF1E0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#4B2E2B] relative inline-block">
              Our Story
              <span className="absolute -bottom-3 left-0 right-0 h-1 bg-[#8FB996]"></span>
            </h2>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-[#2E2E2E]">
              The journey from concept to café
            </p>
          </div>
          
          {/* Timeline */}
          <div className="relative">
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-[#D7C0AE]"></div>
            
            <div className="space-y-20">
              
              {/* Year 3 */}
              <div className="md:grid md:grid-cols-2 md:gap-8 md:items-center">
                <div className="md:text-right md:pr-12">
                  <div className="md:block absolute left-1/2 transform -translate-x-1/2 pt-1 w-10 h-10 rounded-full bg-[#4B2E2B] border-4 border-[#D7C0AE] z-10 flex items-center justify-center">
                    <span className="text-[#FFF1E0] text-center p-3 font-bold">3</span>
                  </div>
                  <h3 className="text-2xl font-semibold text-[#4B2E2B] mb-4">Launch (2024)</h3>
                  <p className="text-[#2E2E2E] leading-relaxed">
                    Neo Cafe opened its doors with a hybrid model: in-store enjoyment with robotic precision and the industry's first autonomous coffee delivery service. The response was overwhelming, with customers delighted by both the quality and the novelty.
                  </p>
                </div>
              </div>
              
              {/* Year 4 */}
              <div className="md:grid md:grid-cols-2 md:gap-8 md:items-center">
                <div className="order-last md:order-first md:pr-12">
                </div>
                <div className="mt-6 md:mt-0 md:pl-12">
                  <div className="md:block absolute left-1/2 transform -translate-x-1/2 pt-1 w-10 h-10 rounded-full bg-[#4B2E2B] border-4 border-[#D7C0AE] z-10 flex items-center justify-center">
                    <span className="text-[#FFF1E0] w-full text-center p-3 font-bold">4</span>
                  </div>
                  <h3 className="text-2xl font-semibold text-[#4B2E2B] mb-4">Today (2025)</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Core Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#4B2E2B] relative inline-block">
              Our Core Values
              <span className="absolute -bottom-3 left-0 right-0 h-1 bg-[#8FB996]"></span>
            </h2>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-[#2E2E2E]">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#FFF1E0] rounded-xl p-8 shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300">
              <div className="flex justify-center mb-6">
                <div className="bg-[#4B2E2B] rounded-full p-4 inline-block">
                  <FaMugHot className="h-8 w-8 text-[#FFF1E0]" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-[#4B2E2B] text-center mb-4">Exceptional Quality</h3>
              <p className="text-[#2E2E2E] leading-relaxed">
                We never compromise on quality. From the beans we source to the technology we develop, every aspect of our operation is designed to deliver an extraordinary coffee experience.
              </p>
            </div>
            
            <div className="bg-[#FFF1E0] rounded-xl p-8 shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300">
              <div className="flex justify-center mb-6">
                <div className="bg-[#4B2E2B] rounded-full p-4 inline-block">
                  <FaRobot className="h-8 w-8 text-[#FFF1E0]" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-[#4B2E2B] text-center mb-4">Innovative Spirit</h3>
              <p className="text-[#2E2E2E] leading-relaxed">
                We embrace technology not as a replacement for human craftsmanship, but as a tool to enhance it. Our robots are programmed with the expertise of champion baristas to ensure consistency and precision.
              </p>
            </div>
            
            <div className="bg-[#FFF1E0] rounded-xl p-8 shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300">
              <div className="flex justify-center mb-6">
                <div className="bg-[#4B2E2B] rounded-full p-4 inline-block">
                  <FaLeaf className="h-8 w-8 text-[#FFF1E0]" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-[#4B2E2B] text-center mb-4">Sustainability</h3>
              <p className="text-[#2E2E2E] leading-relaxed">
                Our robot delivery system isn't just convenient—it's eco-friendly. Zero-emission deliveries, compostable packaging, and direct relationships with sustainable farms are just part of our commitment to the planet.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Team Section */}
      <section className="py-20 bg-[#FFF1E0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#4B2E2B] relative inline-block">
              Meet Our Team
              <span className="absolute -bottom-3 left-0 right-0 h-1 bg-[#8FB996]"></span>
            </h2>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-[#2E2E2E]">
              The passionate people behind your perfect cup
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Romerik Lokossou",
                role: "Founder & Robotics Lead",
                image: "3.jpg",
                bio: "Three-time national barista champion with a vision to make exceptional coffee accessible to everyone."
              },
              {
                name: "Dr. Sarah Chen",
                role: "Co-Founder & AI Engineer",
                image: "2.jpg",
                bio: "Former MIT robotics researcher who brings precision engineering to the art of coffee delivery."
              },
              {
                name: "Emmanuel Adjei",
                role: "Co-Founder & AI Engineer",
                image: "1.jpg",
                bio: "Third-generation coffee farmer who ensures we source only the finest beans through sustainable relationships."
              },
            ].map((member, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="h-64 overflow-hidden">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover object-center transform hover:scale-110 transition-all duration-500" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-[#4B2E2B]">{member.name}</h3>
                  <p className="text-sm text-[#8FB996] font-medium mt-1">{member.role}</p>
                  {/* <p className="mt-4 text-[#2E2E2E]">{member.bio}</p> */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Tech Behind section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-last lg:order-first">
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-square bg-[#D7C0AE] rounded-lg p-6 flex items-center justify-center">
                  <FaRobot className="h-16 w-16 text-[#4B2E2B]" />
                </div>
                <div className="aspect-square bg-[#FFF1E0] rounded-lg p-6 flex items-center justify-center">
                  <FaMugHot className="h-16 w-16 text-[#4B2E2B]" />
                </div>
                <div className="aspect-square bg-[#FFF1E0] rounded-lg p-6 flex items-center justify-center">
                  <FaMapMarkedAlt className="h-16 w-16 text-[#4B2E2B]" />
                </div>
                <div className="aspect-square bg-[#D7C0AE] rounded-lg p-6 flex items-center justify-center">
                  <FaUsers className="h-16 w-16 text-[#4B2E2B]" />
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#4B2E2B] mb-6 relative inline-block">
                The Technology Behind Our Service
                <span className="absolute -bottom-3 left-0 right-0 h-1 bg-[#8FB996]"></span>
              </h2>
              <p className="text-[#2E2E2E] mb-6 leading-relaxed">
                Our robot delivery system combines precision engineering with artificial intelligence to ensure your coffee arrives at the perfect temperature and exactly when you want it.
              </p>
              <p className="text-[#2E2E2E] mb-6 leading-relaxed">
                Each robot is equipped with thermal regulation technology, obstacle avoidance systems, and real-time tracking capabilities. They're programmed to navigate urban environments efficiently while keeping your order secure.
              </p>
              <p className="text-[#2E2E2E] leading-relaxed">
                Our app gives you complete visibility of your order, from preparation to delivery, with the ability to communicate with both our staff and the delivery robot if needed.
              </p>
              <div className="mt-8">
                {/* <Link to="/robot" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-[#4B2E2B] hover:bg-opacity-90 transition-colors">
                  Learn more about our robots
                </Link> */}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action Section */}
      <section className="py-16 bg-[#4B2E2B] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/backgrounds/beans-pattern.jpg')] bg-repeat opacity-10"></div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Experience Neo Cafe Today
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-[#D7C0AE]">
              Join us for a coffee experience that combines tradition with innovation
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to={isLoggedIn ? '/menu' : '/signup'}
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-[#D7C0AE] text-base font-medium rounded-full shadow-lg text-[#4B2E2B] bg-[#D7C0AE] hover:bg-transparent hover:text-white transition-all duration-300"
              >
                {isLoggedIn ? 'Browse Our Menu' : 'Sign Up Now'}
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-[#D7C0AE] text-base font-medium rounded-full shadow-lg text-white bg-transparent hover:bg-[#D7C0AE] hover:text-[#4B2E2B] transition-all duration-300"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;