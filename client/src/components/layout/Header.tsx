import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMenu = () => {
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <header className={`fixed top-0 w-full z-50 bg-white bg-opacity-90 transition-all duration-300 ${
      scrolled ? 'py-2 shadow-md backdrop-blur-md' : 'py-3'
    }`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" onClick={closeMenu} className="flex items-center">
          <span className="text-gold font-montserrat font-bold text-2xl tracking-tight">Kingsborough</span>
          <span className="font-montserrat ml-1 text-deepPurple">Church</span>
        </Link>
        
        <div className="lg:hidden">
          <button 
            onClick={toggleMobileMenu} 
            className="text-darkGray p-2"
            aria-label="Toggle mobile menu"
          >
            <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
          </button>
        </div>
        
        <nav className="hidden lg:flex items-center space-x-8">
          <Link 
            href="/" 
            className={`font-montserrat font-medium transition-colors duration-300 ${isActive('/') ? 'text-gold' : 'hover:text-gold'}`}
          >
            Home
          </Link>
          <Link 
            href="/about" 
            className={`font-montserrat font-medium transition-colors duration-300 ${isActive('/about') ? 'text-gold' : 'hover:text-gold'}`}
          >
            About
          </Link>
          <Link 
            href="/ministries" 
            className={`font-montserrat font-medium transition-colors duration-300 ${isActive('/ministries') ? 'text-gold' : 'hover:text-gold'}`}
          >
            Ministries
          </Link>
          <Link 
            href="/events" 
            className={`font-montserrat font-medium transition-colors duration-300 ${isActive('/events') ? 'text-gold' : 'hover:text-gold'}`}
          >
            Events
          </Link>
          <Link 
            href="/sermons" 
            className={`font-montserrat font-medium transition-colors duration-300 ${isActive('/sermons') ? 'text-gold' : 'hover:text-gold'}`}
          >
            Sermons
          </Link>
          <Link 
            href="/gallery" 
            className={`font-montserrat font-medium transition-colors duration-300 ${isActive('/gallery') ? 'text-gold' : 'hover:text-gold'}`}
          >
            Gallery
          </Link>
          <Link 
            href="/hadassah" 
            className={`font-montserrat font-medium transition-colors duration-300 ${isActive('/hadassah') ? 'text-gold' : 'hover:text-gold'}`}
          >
            Hadassah
          </Link>
          <Link 
            href="/contact" 
            className={`font-montserrat font-medium transition-colors duration-300 ${isActive('/contact') ? 'text-gold' : 'hover:text-gold'}`}
          >
            Contact
          </Link>
          <Link href="/giving" className="btn-primary">Give</Link>
        </nav>
      </div>
      
      {/* Mobile menu */}
      <motion.div 
        className={`lg:hidden bg-white w-full py-4 shadow-md overflow-hidden ${!mobileMenuOpen && 'hidden'}`}
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: mobileMenuOpen ? 'auto' : 0, opacity: mobileMenuOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="container mx-auto px-4 flex flex-col space-y-3">
          <Link 
            href="/" 
            onClick={closeMenu}
            className={`block font-montserrat font-medium py-2 ${isActive('/') ? 'text-gold' : 'hover:text-gold'}`}
          >
            Home
          </Link>
          <Link 
            href="/about" 
            onClick={closeMenu}
            className={`block font-montserrat font-medium py-2 ${isActive('/about') ? 'text-gold' : 'hover:text-gold'}`}
          >
            About
          </Link>
          <Link 
            href="/ministries" 
            onClick={closeMenu}
            className={`block font-montserrat font-medium py-2 ${isActive('/ministries') ? 'text-gold' : 'hover:text-gold'}`}
          >
            Ministries
          </Link>
          <Link 
            href="/events" 
            onClick={closeMenu}
            className={`block font-montserrat font-medium py-2 ${isActive('/events') ? 'text-gold' : 'hover:text-gold'}`}
          >
            Events
          </Link>
          <Link 
            href="/sermons" 
            onClick={closeMenu}
            className={`block font-montserrat font-medium py-2 ${isActive('/sermons') ? 'text-gold' : 'hover:text-gold'}`}
          >
            Sermons
          </Link>
          <Link 
            href="/gallery" 
            onClick={closeMenu}
            className={`block font-montserrat font-medium py-2 ${isActive('/gallery') ? 'text-gold' : 'hover:text-gold'}`}
          >
            Gallery
          </Link>
          <Link 
            href="/kingsmen" 
            onClick={closeMenu}
            className={`block font-montserrat font-medium py-2 ${isActive('/kingsmen') ? 'text-gold' : 'hover:text-gold'}`}
          >
            Kingsmen
          </Link>
          <Link 
            href="/contact" 
            onClick={closeMenu}
            className={`block font-montserrat font-medium py-2 ${isActive('/contact') ? 'text-gold' : 'hover:text-gold'}`}
          >
            Contact
          </Link>
          <Link 
            href="/giving" 
            onClick={closeMenu}
            className="block w-full text-center py-3 bg-gold text-white font-montserrat font-medium rounded"
          >
            Give
          </Link>
        </div>
      </motion.div>
    </header>
  );
};

export default Header;
