import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { slideUp } from '@/lib/animations';

const About = () => {
  const images = [
    {
      src: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      alt: "Church community",
      className: "h-64 overflow-hidden rounded-lg"
    },
    {
      src: "https://images.unsplash.com/photo-1507274301387-7702e1fbfbaa?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      alt: "Church worship",
      className: "h-64 overflow-hidden rounded-lg mt-12"
    },
    {
      src: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      alt: "Church event",
      className: "h-64 overflow-hidden rounded-lg"
    },
    {
      src: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      alt: "Church service",
      className: "h-64 overflow-hidden rounded-lg mt-12"
    }
  ];

  return (
    <section id="about" className="py-20 bg-lilac bg-opacity-10">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <motion.div 
            className="max-w-3xl mb-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={slideUp()}
          >
            <h2 className="text-3xl md:text-4xl font-montserrat font-bold mb-6 text-deepPurple">
              Our Story
            </h2>
            <p className="text-lg leading-relaxed mb-6">
              Founded in 1985, Kingsborough Church began as a small gathering in a living room with a vision to create a church that welcomes everyone, regardless of their background or journey.
            </p>
            <p className="text-lg leading-relaxed mb-6">
              What started with just 12 dedicated members has grown into a vibrant community of believers passionate about making a difference in our city and beyond.
            </p>
            <p className="text-lg leading-relaxed mb-10">
              Our mission remains the same: to help people know God, find freedom, discover purpose, and make a difference.
            </p>
            <Link href="/about" className="btn-primary">Learn More About Us</Link>
          </motion.div>
          
          <motion.div 
            className="max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-4 mt-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={slideUp(0.3)}
          >
            {images.map((image, index) => (
              <motion.div 
                key={index} 
                className="h-40 md:h-48 overflow-hidden rounded-lg"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.5 }}
              >
                <img 
                  src={image.src} 
                  alt={image.alt} 
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
