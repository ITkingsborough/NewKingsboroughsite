import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { slideUp } from '@/lib/animations';

const Footer = () => {
  return (
    <footer className="bg-deepPurple text-white py-12">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={slideUp(0)}
          >
            <h3 className="text-gold font-montserrat font-semibold text-lg mb-4">Kingsborough Church</h3>
            <p className="mb-4 text-gray-300">A place to belong, believe, and become</p>
            <div className="flex space-x-4">
              <a 
                href="https://www.facebook.com/kingsboroughuk/?locale=en_GB" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-white hover:text-gold transition-colors duration-300"
                aria-label="Facebook"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              <a 
                href="https://www.instagram.com/kingsboroughuk/?hl=en-gb" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-white hover:text-gold transition-colors duration-300"
                aria-label="Instagram"
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a 
                href="https://www.youtube.com/@KingsboroughLiveTv" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-white hover:text-gold transition-colors duration-300"
                aria-label="YouTube"
              >
                <i className="fab fa-youtube"></i>
              </a>
      
            </div>
          </motion.div>
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={slideUp(0.1)}
          >
            <h3 className="text-gold font-montserrat font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors duration-300">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/ministries" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Ministries
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/sermons" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Sermons
                </Link>
              </li>
              <li>
                <Link href="/giving" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Giving
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Prayer Requests
                </Link>
              </li>
            </ul>
          </motion.div>
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={slideUp(0.2)}
          >
            <h3 className="text-gold font-montserrat font-semibold text-lg mb-4">Visit Us</h3>
            <p className="text-gray-300 mb-2">No 4, New Windsor Street <br/>Uxbridge, UB8 2TU</p>
            <p className="text-gray-300 mb-4">
              <strong>Sunday Services:</strong><br/>10:00 AM - 12:00 PM
            </p>
            <p className="text-gray-300">
              <strong>Office Hours:</strong><br/>Mon-Fri: 9:00 AM - 6:00 PM
            </p>
          </motion.div>
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={slideUp(0.3)}
          >
            <h3 className="text-gold font-montserrat font-semibold text-lg mb-4">Contact</h3>
            <p className="text-gray-300 mb-2">
              <i className="fas fa-phone mr-2"></i> 01895252224 or 07848237072 (Monday to Friday)
            </p>
            <p className="text-gray-300 mb-4">
              <i className="fas fa-envelope mr-2"></i> info@kingsboroughchurch.org
            </p>
            <Link 
              href="/contact" 
              className="inline-block text-white bg-gold px-4 py-2 rounded font-montserrat font-medium hover:bg-opacity-90 transition-all duration-300"
            >
              Contact Us
            </Link>
          </motion.div>
        </div>
        
        <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
          <p className="mb-2">&copy; {new Date().getFullYear()} Kingsborough Church. All Rights Reserved.</p>
          <p>
            <Link 
              href="/" 
              className="text-gold hover:text-white transition-colors duration-300"
            >
        
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
