import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { slideUp, staggerContainer } from '@/lib/animations';
import { sermons } from '@/lib/data';

const Sermons = () => {
  return (
    <section id="sermons" className="py-20 bg-lilac bg-opacity-10">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={slideUp()}
        >
          <h2 className="text-3xl md:text-4xl font-montserrat font-bold mb-6 text-deepPurple">
            Recent Sermons
          </h2>
          <p className="text-lg max-w-3xl mx-auto">
            Missed a Sunday? Catch up on our latest messages or explore our sermon archive.
          </p>
        </motion.div>
        
        <motion.div 
          className="flex justify-center"
          variants={staggerContainer()}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl">
            {sermons.map((sermon, index) => (
              <motion.div 
                key={sermon.id} 
                className="bg-white rounded-lg shadow-md overflow-hidden card-hover text-center"
                variants={slideUp((index + 1) * 0.1)}
                whileHover={{ 
                  y: -5,
                  boxShadow: "0px 10px 20px rgba(0,0,0,0.1)",
                  transition: { duration: 0.3 }
                }}
              >
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={sermon.image} 
                    alt={sermon.title} 
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-deepPurple bg-opacity-40 flex items-center justify-center">
                    <a 
                      href="#" 
                      className="text-white bg-gold bg-opacity-90 rounded-full w-14 h-14 flex items-center justify-center"
                      onClick={(e) => e.preventDefault()}
                      aria-label="Play sermon"
                    >
                      <i className="fas fa-play"></i>
                    </a>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-center items-center mb-3 flex-wrap gap-2">
                    <h3 className="text-xl font-montserrat font-semibold">{sermon.title}</h3>
                    {sermon.series && (
                      <span className="text-xs bg-lilac bg-opacity-30 text-deepPurple px-2 py-1 rounded ml-2">
                        Series
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    <i className="far fa-user mr-2"></i> {sermon.speaker}
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    <i className="far fa-calendar-alt mr-2"></i> {sermon.date}
                  </p>
                  <p className="mb-6 text-sm">{sermon.description}</p>
                  <div className="flex justify-center space-x-4">
                    <a 
                      href="#" 
                      className="text-gold font-montserrat font-medium hover:underline inline-flex items-center"
                      onClick={(e) => e.preventDefault()}
                    >
                      <i className="fas fa-play-circle mr-1"></i> Watch
                    </a>
                    <a 
                      href="#" 
                      className="text-gold font-montserrat font-medium hover:underline inline-flex items-center"
                      onClick={(e) => e.preventDefault()}
                    >
                      <i className="fas fa-headphones mr-1"></i> Listen
                    </a>
                    <a 
                      href="#" 
                      className="text-gold font-montserrat font-medium hover:underline inline-flex items-center"
                      onClick={(e) => e.preventDefault()}
                    >
                      <i className="fas fa-file-alt mr-1"></i> Notes
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        <motion.div 
          className="text-center mt-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={slideUp(0.3)}
        >
          <Link href="/sermons" className="btn-primary">View Sermon Archive</Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Sermons;
