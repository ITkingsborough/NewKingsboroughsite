import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Menu, X } from 'lucide-react';
import churchLogo from '@assets/Untitled_design_(43)_1765446173985.png';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mediaOpen, setMediaOpen] = useState(false);
  const [involvedOpen, setInvolvedOpen] = useState(false);
  const [isDarkBackground, setIsDarkBackground] = useState(true);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [location] = useLocation();
  const mediaRef = useRef<HTMLDivElement>(null);
  const involvedRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  const checkBackgroundColor = useCallback(() => {
    if (!headerRef.current) return;
    
    const headerRect = headerRef.current.getBoundingClientRect();
    const headerMiddle = headerRect.top + headerRect.height / 2;
    
    const sections = Array.from(document.querySelectorAll('[data-nav-theme]'));
    
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      const rect = section.getBoundingClientRect();
      if (rect.top <= headerMiddle && rect.bottom >= headerMiddle) {
        const theme = section.getAttribute('data-nav-theme');
        setIsDarkBackground(theme === 'dark');
        return;
      }
    }
    
    setIsDarkBackground(window.scrollY < 100);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      checkBackgroundColor();
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (mediaRef.current && !mediaRef.current.contains(event.target as Node)) {
        setMediaOpen(false);
      }
      if (involvedRef.current && !involvedRef.current.contains(event.target as Node)) {
        setInvolvedOpen(false);
      }
    };

    checkBackgroundColor();
    
    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [checkBackgroundColor]);

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
    { href: '/community', label: 'Community' },
  ];

  return (
    <header 
      ref={headerRef}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'py-2' : 'py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <motion.div
          animate={{ borderRadius: mobileMenuOpen ? '36px' : '9999px' }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className={`shadow-lg ${
            isDarkBackground ? 'bg-white/95 backdrop-blur-sm' : 'bg-deepPurple/95 backdrop-blur-sm'
          }`}
        >
        <div className="flex items-center px-6 py-3">
        <Link href="/" onClick={closeMenu} className="flex items-center flex-shrink-0">
          <img src={churchLogo} alt="Kingsborough Church Logo" className="h-12 w-auto mr-3" />
          <div className="flex flex-col">
            <div className="flex items-baseline">
              <span className="text-gold font-montserrat font-bold text-xl tracking-tight">Kingsborough</span>
              <span className={`font-montserrat ml-1 font-bold text-xl transition-colors duration-500 ${isDarkBackground ? 'text-deepPurple' : 'text-white'}`}>Church</span>
            </div>
            <span className={`text-xs font-light italic hidden sm:block transition-colors duration-500 ${isDarkBackground ? 'text-gray-500' : 'text-white/70'}`}>Transforming Lives, Shaping Destinies</span>
          </div>
        </Link>
        
        <div className="lg:hidden ml-auto">
          <button 
            onClick={toggleMobileMenu} 
            className={`p-2 transition-colors duration-500 ${isDarkBackground ? 'text-gray-700' : 'text-white'}`}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        
        <nav
          className="hidden lg:flex items-center justify-center flex-1 gap-1"
          onMouseLeave={() => setHoveredItem(null)}
        >
          {/* Home */}
          <div className="relative" onMouseEnter={() => setHoveredItem('home')}>
            {hoveredItem === 'home' && (
              <motion.div
                layoutId="nav-pill"
                className={`absolute inset-0 rounded-full ${isDarkBackground ? 'bg-black' : 'bg-white'}`}
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
            <Link
              href="/"
              className={`relative z-10 block font-montserrat text-base font-medium px-4 py-2 rounded-full transition-colors duration-150 ${
                hoveredItem === 'home'
                  ? isDarkBackground ? 'text-white' : 'text-deepPurple'
                  : isDarkBackground ? 'text-gray-700' : 'text-white'
              }`}
            >
              Home
            </Link>
          </div>

          {/* About */}
          <div className="relative" onMouseEnter={() => setHoveredItem('about')}>
            {hoveredItem === 'about' && (
              <motion.div
                layoutId="nav-pill"
                className={`absolute inset-0 rounded-full ${isDarkBackground ? 'bg-black' : 'bg-white'}`}
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
            <Link
              href="/about"
              className={`relative z-10 block font-montserrat text-base font-medium px-4 py-2 rounded-full transition-colors duration-150 ${
                hoveredItem === 'about'
                  ? isDarkBackground ? 'text-white' : 'text-deepPurple'
                  : isDarkBackground ? 'text-gray-700' : 'text-white'
              }`}
            >
              About
            </Link>
          </div>

          {/* Media dropdown */}
          <div className="relative" ref={mediaRef} onMouseEnter={() => setHoveredItem('media')}>
            {hoveredItem === 'media' && (
              <motion.div
                layoutId="nav-pill"
                className={`absolute inset-0 rounded-full ${isDarkBackground ? 'bg-black' : 'bg-white'}`}
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
            <button
              onClick={() => { setMediaOpen(!mediaOpen); setInvolvedOpen(false); }}
              className={`relative z-10 flex items-center font-montserrat text-base font-medium px-4 py-2 rounded-full transition-colors duration-150 ${
                hoveredItem === 'media'
                  ? isDarkBackground ? 'text-white' : 'text-deepPurple'
                  : isDarkBackground ? 'text-gray-700' : 'text-white'
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

          {/* Get Involved dropdown */}
          <div className="relative" ref={involvedRef} onMouseEnter={() => setHoveredItem('involved')}>
            {hoveredItem === 'involved' && (
              <motion.div
                layoutId="nav-pill"
                className={`absolute inset-0 rounded-full ${isDarkBackground ? 'bg-black' : 'bg-white'}`}
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
            <button
              onClick={() => { setInvolvedOpen(!involvedOpen); setMediaOpen(false); }}
              className={`relative z-10 flex items-center font-montserrat text-base font-medium px-4 py-2 rounded-full transition-colors duration-150 ${
                hoveredItem === 'involved'
                  ? isDarkBackground ? 'text-white' : 'text-deepPurple'
                  : isDarkBackground ? 'text-gray-700' : 'text-white'
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

          {/* Events */}
          <div className="relative" onMouseEnter={() => setHoveredItem('events')}>
            {hoveredItem === 'events' && (
              <motion.div
                layoutId="nav-pill"
                className={`absolute inset-0 rounded-full ${isDarkBackground ? 'bg-black' : 'bg-white'}`}
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
            <Link
              href="/events"
              className={`relative z-10 block font-montserrat text-base font-medium px-4 py-2 rounded-full transition-colors duration-150 ${
                hoveredItem === 'events'
                  ? isDarkBackground ? 'text-white' : 'text-deepPurple'
                  : isDarkBackground ? 'text-gray-700' : 'text-white'
              }`}
            >
              Events
            </Link>
          </div>

          {/* Enquiries */}
          <div className="relative" onMouseEnter={() => setHoveredItem('contact')}>
            {hoveredItem === 'contact' && (
              <motion.div
                layoutId="nav-pill"
                className={`absolute inset-0 rounded-full ${isDarkBackground ? 'bg-black' : 'bg-white'}`}
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
            <Link
              href="/contact"
              className={`relative z-10 block font-montserrat text-base font-medium px-4 py-2 rounded-full transition-colors duration-150 ${
                hoveredItem === 'contact'
                  ? isDarkBackground ? 'text-white' : 'text-deepPurple'
                  : isDarkBackground ? 'text-gray-700' : 'text-white'
              }`}
            >
              Enquiries
            </Link>
          </div>

          <div className="flex items-center space-x-3 ml-2">
            <Link
              href="/giving"
              className="px-5 py-2 bg-gold text-white font-montserrat text-sm font-semibold rounded-full hover:bg-gold/90 transition-colors"
            >
              Give
            </Link>
          </div>
        </nav>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className="lg:hidden overflow-hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className={`px-6 pb-5 pt-3 flex flex-col space-y-1 border-t ${isDarkBackground ? 'border-gray-100' : 'border-white/20'}`}>
                <Link
                  href="/"
                  onClick={closeMenu}
                  className={`block font-montserrat font-medium py-3 px-2 rounded-lg ${
                    isActive('/') ? 'text-gold' : isDarkBackground ? 'text-gray-700 hover:text-gold hover:bg-gold/5' : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Home
                </Link>
                <Link
                  href="/about"
                  onClick={closeMenu}
                  className={`block font-montserrat font-medium py-3 px-2 rounded-lg ${
                    isActive('/about') ? 'text-gold' : isDarkBackground ? 'text-gray-700 hover:text-gold hover:bg-gold/5' : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  About
                </Link>

                <div className={`border-t pt-2 mt-1 ${isDarkBackground ? 'border-gray-100' : 'border-white/20'}`}>
                  <span className={`text-xs font-montserrat uppercase tracking-wider px-2 ${isDarkBackground ? 'text-gray-400' : 'text-white/40'}`}>Media</span>
                  {mediaLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={closeMenu}
                      className={`block font-montserrat font-medium py-3 px-4 rounded-lg ${
                        isActive(link.href) ? 'text-gold' : isDarkBackground ? 'text-gray-700 hover:text-gold hover:bg-gold/5' : 'text-white/80 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>

                <div className={`border-t pt-2 mt-1 ${isDarkBackground ? 'border-gray-100' : 'border-white/20'}`}>
                  <span className={`text-xs font-montserrat uppercase tracking-wider px-2 ${isDarkBackground ? 'text-gray-400' : 'text-white/40'}`}>Get Involved</span>
                  {involvedLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={closeMenu}
                      className={`block font-montserrat font-medium py-3 px-4 rounded-lg ${
                        isActive(link.href) ? 'text-gold' : isDarkBackground ? 'text-gray-700 hover:text-gold hover:bg-gold/5' : 'text-white/80 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>

                <div className={`border-t pt-2 mt-1 ${isDarkBackground ? 'border-gray-100' : 'border-white/20'}`}>
                  <Link
                    href="/events"
                    onClick={closeMenu}
                    className={`block font-montserrat font-medium py-3 px-2 rounded-lg ${
                      isActive('/events') ? 'text-gold' : isDarkBackground ? 'text-gray-700 hover:text-gold hover:bg-gold/5' : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    Events
                  </Link>
                  <Link
                    href="/contact"
                    onClick={closeMenu}
                    className={`block font-montserrat font-medium py-3 px-2 rounded-lg ${
                      isActive('/contact') ? 'text-gold' : isDarkBackground ? 'text-gray-700 hover:text-gold hover:bg-gold/5' : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    Enquiries
                  </Link>
                </div>

                <div className={`pt-3 mt-1 border-t ${isDarkBackground ? 'border-gray-100' : 'border-white/20'}`}>
                  <Link
                    href="/giving"
                    onClick={closeMenu}
                    className="block w-full text-center py-3 bg-gold text-white font-montserrat font-semibold rounded-full"
                  >
                    Give
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        </motion.div>
      </div>
    </header>
  );
};

export default Header;
