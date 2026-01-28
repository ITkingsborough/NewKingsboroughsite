import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Menu, X } from 'lucide-react';
import churchLogo from '@assets/Untitled_design_(43)_1765446173985.png';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mediaOpen, setMediaOpen] = useState(false);
  const [involvedOpen, setInvolvedOpen] = useState(false);
  const [location] = useLocation();
  const mediaRef = useRef<HTMLDivElement>(null);
  const involvedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (mediaRef.current && !mediaRef.current.contains(event.target as Node)) {
        setMediaOpen(false);
      }
      if (involvedRef.current && !involvedRef.current.contains(event.target as Node)) {
        setInvolvedOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMenu = () => {
    setMobileMenuOpen(false);
    setMediaOpen(false);
    setInvolvedOpen(false);
  };

  const isActive = (path: string) => {
    return location === path;
  };

  const mediaLinks = [
    { href: '/sermons', label: 'Sermons' },
    { href: '/gallery', label: 'Gallery' },
  ];

  const involvedLinks = [
    { href: '/ministries', label: 'Ministries' },
    { href: '/community', label: 'Community' },
  ];

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled ? 'py-2' : 'py-4'
    }`}>
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-full shadow-lg px-6 py-3 flex items-center">
        <Link href="/" onClick={closeMenu} className="flex items-center flex-shrink-0">
          <img src={churchLogo} alt="Kingsborough Church Logo" className="h-12 w-auto mr-3" />
          <div className="flex flex-col">
            <div className="flex items-baseline">
              <span className="text-gold font-montserrat font-bold text-xl tracking-tight">Kingsborough</span>
              <span className="font-montserrat ml-1 text-deepPurple font-bold text-xl">Church</span>
            </div>
            <span className="text-xs text-gray-500 font-light italic hidden sm:block">Transforming Lives, Shaping Destinies</span>
          </div>
        </Link>
        
        <div className="lg:hidden ml-auto">
          <button 
            onClick={toggleMobileMenu} 
            className="text-gray-700 p-2"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        
        <nav className="hidden lg:flex items-center justify-center flex-1 space-x-8">
          <Link 
            href="/" 
            className={`font-montserrat text-base font-medium transition-colors duration-300 ${isActive('/') ? 'text-gold' : 'text-gray-700 hover:text-gold'}`}
          >
            Home
          </Link>
          <Link 
            href="/about" 
            className={`font-montserrat text-base font-medium transition-colors duration-300 ${isActive('/about') ? 'text-gold' : 'text-gray-700 hover:text-gold'}`}
          >
            About
          </Link>
          
          <div className="relative" ref={mediaRef}>
            <button 
              onClick={() => { setMediaOpen(!mediaOpen); setInvolvedOpen(false); }}
              className={`flex items-center font-montserrat text-base font-medium transition-colors duration-300 ${
                isActive('/sermons') || isActive('/gallery') ? 'text-gold' : 'text-gray-700 hover:text-gold'
              }`}
            >
              Media
              <ChevronDown className={`ml-1 w-4 h-4 transition-transform ${mediaOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {mediaOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg py-2 min-w-[160px] border border-gray-100"
                >
                  {mediaLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={closeMenu}
                      className={`block px-4 py-2 text-sm font-montserrat transition-colors ${
                        isActive(link.href) ? 'text-gold bg-gold/5' : 'text-gray-700 hover:text-gold hover:bg-gold/5'
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="relative" ref={involvedRef}>
            <button 
              onClick={() => { setInvolvedOpen(!involvedOpen); setMediaOpen(false); }}
              className={`flex items-center font-montserrat text-base font-medium transition-colors duration-300 ${
                isActive('/ministries') || isActive('/community') ? 'text-gold' : 'text-gray-700 hover:text-gold'
              }`}
            >
              Get Involved
              <ChevronDown className={`ml-1 w-4 h-4 transition-transform ${involvedOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {involvedOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg py-2 min-w-[160px] border border-gray-100"
                >
                  {involvedLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={closeMenu}
                      className={`block px-4 py-2 text-sm font-montserrat transition-colors ${
                        isActive(link.href) ? 'text-gold bg-gold/5' : 'text-gray-700 hover:text-gold hover:bg-gold/5'
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <Link 
            href="/events" 
            className={`font-montserrat text-base font-medium transition-colors duration-300 ${isActive('/events') ? 'text-gold' : 'text-gray-700 hover:text-gold'}`}
          >
            Events
          </Link>
          <Link 
            href="/contact" 
            className={`font-montserrat text-base font-medium transition-colors duration-300 ${isActive('/contact') ? 'text-gold' : 'text-gray-700 hover:text-gold'}`}
          >
            Contact
          </Link>
          
          <div className="flex items-center space-x-3 ml-2">
            <Link 
              href="/shop" 
              className="px-5 py-2 border-2 border-deepPurple text-deepPurple font-montserrat text-sm font-semibold rounded-full hover:bg-deepPurple hover:text-white transition-colors"
            >
              Shop
            </Link>
            <Link 
              href="/giving" 
              className="px-5 py-2 bg-gold text-white font-montserrat text-sm font-semibold rounded-full hover:bg-gold/90 transition-colors"
            >
              Give
            </Link>
          </div>
        </nav>
        </div>
      </div>
      
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            className="lg:hidden bg-white w-full py-4 shadow-md border-t border-gray-100"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container mx-auto px-4 flex flex-col space-y-1">
              <Link 
                href="/" 
                onClick={closeMenu}
                className={`block font-montserrat font-medium py-3 px-2 rounded ${isActive('/') ? 'text-gold bg-gold/5' : 'hover:text-gold hover:bg-gold/5'}`}
              >
                Home
              </Link>
              <Link 
                href="/about" 
                onClick={closeMenu}
                className={`block font-montserrat font-medium py-3 px-2 rounded ${isActive('/about') ? 'text-gold bg-gold/5' : 'hover:text-gold hover:bg-gold/5'}`}
              >
                About
              </Link>
              
              <div className="border-t border-gray-100 pt-2 mt-2">
                <span className="text-xs text-gray-400 font-montserrat uppercase tracking-wider px-2">Media</span>
                {mediaLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMenu}
                    className={`block font-montserrat font-medium py-3 px-4 rounded ${
                      isActive(link.href) ? 'text-gold bg-gold/5' : 'hover:text-gold hover:bg-gold/5'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              
              <div className="border-t border-gray-100 pt-2 mt-2">
                <span className="text-xs text-gray-400 font-montserrat uppercase tracking-wider px-2">Get Involved</span>
                {involvedLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMenu}
                    className={`block font-montserrat font-medium py-3 px-4 rounded ${
                      isActive(link.href) ? 'text-gold bg-gold/5' : 'hover:text-gold hover:bg-gold/5'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              
              <div className="border-t border-gray-100 pt-2 mt-2">
                <Link 
                  href="/events" 
                  onClick={closeMenu}
                  className={`block font-montserrat font-medium py-3 px-2 rounded ${isActive('/events') ? 'text-gold bg-gold/5' : 'hover:text-gold hover:bg-gold/5'}`}
                >
                  Events
                </Link>
                <Link 
                  href="/contact" 
                  onClick={closeMenu}
                  className={`block font-montserrat font-medium py-3 px-2 rounded ${isActive('/contact') ? 'text-gold bg-gold/5' : 'hover:text-gold hover:bg-gold/5'}`}
                >
                  Contact
                </Link>
              </div>
              
              <div className="flex space-x-3 pt-4 mt-2 border-t border-gray-100">
                <Link 
                  href="/shop" 
                  onClick={closeMenu}
                  className="flex-1 text-center py-3 border-2 border-deepPurple text-deepPurple font-montserrat font-semibold rounded-full"
                >
                  Shop
                </Link>
                <Link 
                  href="/giving" 
                  onClick={closeMenu}
                  className="flex-1 text-center py-3 bg-gold text-white font-montserrat font-semibold rounded-full"
                >
                  Give
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
