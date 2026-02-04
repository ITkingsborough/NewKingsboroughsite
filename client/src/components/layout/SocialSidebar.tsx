import { motion } from 'framer-motion';
import { SiFacebook, SiInstagram, SiYoutube } from 'react-icons/si';

const socialLinks = [
  { icon: SiFacebook, href: 'https://www.facebook.com/kingsboroughuk', label: 'Facebook', color: 'hover:bg-[#1877F2]' },
  { icon: SiInstagram, href: 'https://www.instagram.com/kingsboroughuk/', label: 'Instagram', color: 'hover:bg-[#E4405F]' },
  { icon: SiYoutube, href: 'https://www.youtube.com/@KingsboroughLiveTv', label: 'YouTube', color: 'hover:bg-[#FF0000]' },
];

const SocialSidebar = () => {
  return (
    <>
      {/* Desktop - Left sidebar */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="fixed left-0 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col"
      >
        <div className="bg-deepPurple rounded-r-xl shadow-lg overflow-hidden">
          {socialLinks.map((social, index) => (
            <a
              key={index}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className={`flex items-center justify-center w-12 h-12 text-white transition-all duration-300 ${social.color} hover:w-14`}
            >
              <social.icon className="w-5 h-5" />
            </a>
          ))}
        </div>
      </motion.div>

      {/* Mobile - Bottom bar */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="fixed bottom-0 left-0 right-0 z-40 md:hidden"
      >
        <div className="bg-deepPurple shadow-lg flex justify-center">
          {socialLinks.map((social, index) => (
            <a
              key={index}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className={`flex items-center justify-center w-14 h-14 text-white transition-all duration-300 ${social.color}`}
            >
              <social.icon className="w-5 h-5" />
            </a>
          ))}
        </div>
      </motion.div>
    </>
  );
};

export default SocialSidebar;
