import { motion } from 'framer-motion';
import { SiFacebook, SiInstagram, SiYoutube, SiTiktok } from 'react-icons/si';

const socialLinks = [
  { icon: SiFacebook, href: 'https://facebook.com', label: 'Facebook', color: 'hover:bg-[#1877F2]' },
  { icon: SiInstagram, href: 'https://instagram.com', label: 'Instagram', color: 'hover:bg-[#E4405F]' },
  { icon: SiYoutube, href: 'https://youtube.com', label: 'YouTube', color: 'hover:bg-[#FF0000]' },
  { icon: SiTiktok, href: 'https://tiktok.com', label: 'TikTok', color: 'hover:bg-[#000000]' },
];

const SocialSidebar = () => {
  return (
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
  );
};

export default SocialSidebar;
