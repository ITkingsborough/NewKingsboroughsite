import { motion } from 'framer-motion';
import { slideUp, slideRight } from '@/lib/animations';
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
            Our Pastoral Leadership
          </h2>
          <p className="text-lg max-w-3xl mx-auto">
            Meet the dedicated leaders who guide our church with wisdom, compassion, and a heart for serving our community.
          </p>
        </motion.div>
        
        {/* Featured pastoral team with text on right */}
        <motion.div 
          className="flex flex-col lg:flex-row gap-12 mb-16 items-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {/* Left column - Styled div instead of image */}
          <motion.div 
            className="lg:w-1/2 relative"
            variants={slideUp(0.1)}
          >
            <div className="relative max-w-lg mx-auto">
              {/* Styled div with gradient background instead of image */}
              <div className="rounded-xl overflow-hidden border-4 border-gold shadow-xl aspect-[4/3]">
                <div 
                  className="w-full h-full flex items-center justify-center bg-gradient-to-br from-deepPurple to-purple-900 p-6"
                >
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gold/20 flex items-center justify-center">
                      <i className="fas fa-church text-gold text-3xl"></i>
                    </div>
                    <h4 className="text-white text-xl font-medium mb-2">Serving Since 2001</h4>
                    <p className="text-white/80 text-sm">
                      Leading with vision, wisdom, and compassion
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Caption overlay at bottom */}
              <div className="absolute bottom-0 left-0 right-0 bg-deepPurple/90 text-center py-4 px-4">
                <h3 className="text-2xl md:text-3xl font-montserrat font-bold text-white mb-1">
                  Apostle Tunde & Toyin Balogun
                </h3>
                <p className="text-gold text-lg font-medium">
                  (Senior Pastors)
                </p>
              </div>
            </div>
          </motion.div>
          
          {/* Right column - Text content */}
          <motion.div 
            className="lg:w-1/2"
            variants={slideRight(0.2)}
          >
            <div className="max-w-lg">
              <h3 className="text-2xl md:text-3xl font-montserrat font-bold mb-6 text-deepPurple">
                Visionary Leadership
              </h3>
              
              <div className="space-y-6 text-lg">
                <p>
                  Under the anointed leadership of Apostle Tunde and Toyin Balogun, Kingsborough Church has flourished as a beacon of hope, faith, and transformation in our community.
                </p>
                
                <p>
                  Their passion for God's Word, prophetic insight, and heart for people has created a church where lives are changed, families are restored, and disciples are raised to impact the world.
                </p>
                
                <p>
                  With over two decades of ministry experience, they lead with integrity, compassion, and a compelling vision to see people discover their purpose and walk in divine destiny.
                </p>
                
                <p className="italic text-deepPurple font-medium">
                  "Our mission is to create an atmosphere where God's presence transforms lives, equipping believers to fulfill their God-given purpose and make a difference in their world."
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Leadership;
