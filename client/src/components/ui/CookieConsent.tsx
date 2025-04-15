import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already provided consent
    const consentGiven = localStorage.getItem('cookieConsent');
    if (!consentGiven) {
      // Wait a short time before showing the banner to avoid immediate popups on page load
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setIsVisible(false);
  };

  const declineCookies = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className="fixed bottom-0 left-0 w-full bg-white shadow-lg p-4 z-50 flex flex-col sm:flex-row justify-between items-center gap-4"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm pr-4">
            We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.
          </p>
          <div className="flex space-x-2">
            <button 
              onClick={acceptCookies} 
              className="bg-gold text-white px-4 py-2 rounded text-sm font-medium"
            >
              Accept
            </button>
            <button 
              onClick={declineCookies} 
              className="border border-gray-300 px-4 py-2 rounded text-sm font-medium"
            >
              Decline
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
