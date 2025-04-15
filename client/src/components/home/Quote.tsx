import { motion } from 'framer-motion';
import { slideUp } from '@/lib/animations';

const Quote = () => {
  return (
    <section 
      className="parallax h-96 flex items-center justify-center relative" 
      style={{ backgroundImage: `url('https://images.unsplash.com/photo-1455044372794-d981761b5bc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')` }}
    >
      <div className="absolute inset-0 overlay-gold"></div>
      <div className="container mx-auto px-4 lg:px-8 z-10 text-center">
        <motion.div 
          className="max-w-3xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={slideUp()}
        >
          <motion.blockquote 
            className="font-playfair text-2xl md:text-4xl text-white italic mb-6 text-shadow"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            "For where two or three gather in my name, there am I with them."
          </motion.blockquote>
          <motion.p 
            className="text-white text-lg font-montserrat"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            Matthew 18:20
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default Quote;
