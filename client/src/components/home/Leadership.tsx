import { motion } from 'framer-motion';
import { slideUp, staggerContainer } from '@/lib/animations';
import { leaders } from '@/lib/data';

const Leadership = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={slideUp()}
        >
          <h2 className="text-3xl md:text-4xl font-montserrat font-bold mb-6 text-deepPurple">
            Our Leadership Team
          </h2>
          <p className="text-lg max-w-3xl mx-auto">
            Meet the dedicated individuals who guide our church with wisdom, compassion, and a heart for serving our community.
          </p>
        </motion.div>
        
        <motion.div 
          className="flex flex-col items-center justify-center max-w-5xl mx-auto"
          variants={staggerContainer()}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {leaders.map((leader, index) => (
              <motion.div 
                key={leader.id} 
                className="card-hover text-center"
                variants={slideUp((index + 1) * 0.1)}
                whileHover={{ 
                  y: -5,
                  boxShadow: "0px 10px 20px rgba(0,0,0,0.1)",
                  transition: { duration: 0.3 }
                }}
              >
                <div className="rounded-lg overflow-hidden mb-4 max-w-[300px] mx-auto">
                  <img 
                    src={leader.image} 
                    alt={leader.name} 
                    className="w-full h-72 object-cover"
                    loading="lazy"
                  />
                </div>
                <h3 className="text-xl font-montserrat font-semibold mb-1">{leader.name}</h3>
                <p className="text-gold mb-3">{leader.role}</p>
                <p className="text-sm max-w-md mx-auto">{leader.bio}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Leadership;
