import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { fadeIn, slideUp } from '@/lib/animations';

const Hero = () => {
  return (
    <section 
      id="home" 
      className="relative h-screen flex items-center parallax" 
      style={{ backgroundImage: `url('https://images.unsplash.com/photo-1529070538774-1843cb3265df?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')` }}
    >
      <div className="absolute inset-0 overlay-purple"></div>
      <div className="container mx-auto px-4 lg:px-8 z-10">
        <motion.div 
          className="max-w-3xl"
          initial="hidden"
          animate="visible"
          variants={fadeIn()}
        >
          <motion.h1 
            className="text-4xl md:text-6xl font-montserrat font-bold text-white mb-4 tracking-tight text-shadow"
            variants={slideUp(0.2)}
          >
            Welcome to Kingsborough Church
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-white opacity-90 mb-8 font-light"
            variants={slideUp(0.4)}
          >
            A place to belong, believe, and become.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
            variants={slideUp(0.6)}
          >
            <Link href="/about" className="btn-primary">
              Learn More
            </Link>
            <Link href="/events" className="btn-outline">
              Join Us This Week
            </Link>
          </motion.div>
        </motion.div>
      </div>
      
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <i className="fas fa-chevron-down"></i>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
