import { motion } from 'framer-motion';
import { slideUp } from '@/lib/animations';
import { ministries } from '@/lib/data';
import { Helmet } from 'react-helmet';
import { useLocation } from 'wouter';

const Ministries = () => {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1]);
  const ministryId = searchParams.get('id');

  const selectedMinistry = ministryId 
    ? ministries.find(m => m.id === parseInt(ministryId)) 
    : null;

  return (
    <>
      <Helmet>
        <title>Ministries | Kingsborough Church</title>
        <meta name="description" content="Discover our various ministries and how you can get involved in our church community." />
      </Helmet>
      <div className="pt-24">
        {/* Hero Section */}
        <section className="relative h-80 md:h-96 flex items-center parallax" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1606041008023-472dfb5e530f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')` }}>
          <div className="absolute inset-0 overlay-purple"></div>
          <div className="container mx-auto px-4 lg:px-8 z-10">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={slideUp()}
              className="max-w-3xl"
            >
              <h1 className="text-4xl md:text-5xl font-montserrat font-bold text-white mb-4 tracking-tight text-shadow">Our Ministries</h1>
              <p className="text-xl text-white opacity-90 font-light">
                Discover ways to connect, grow, and serve in our church community.
              </p>
            </motion.div>
          </div>
        </section>

        {selectedMinistry ? (
          // Single Ministry View
          <section className="py-20 bg-white">
            <div className="container mx-auto px-4 lg:px-8">
              <motion.div 
                className="max-w-4xl mx-auto"
                initial="hidden"
                animate="visible"
                variants={slideUp()}
              >
                <div className="mb-8">
                  <button 
                    onClick={() => window.history.back()} 
                    className="flex items-center text-gold hover:underline"
                  >
                    <i className="fas fa-arrow-left mr-2"></i> Back to All Ministries
                  </button>
                </div>
                
                <div className="rounded-lg overflow-hidden mb-8 h-80">
                  <img 
                    src={selectedMinistry.image} 
                    alt={selectedMinistry.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <h2 className="text-3xl md:text-4xl font-montserrat font-bold mb-6 text-deepPurple">
                  {selectedMinistry.title}
                </h2>
                
                <p className="text-lg leading-relaxed mb-8">
                  {selectedMinistry.description}
                </p>
                
                <div className="bg-lilac bg-opacity-10 p-8 rounded-lg mb-8">
                  <h3 className="text-2xl font-montserrat font-semibold mb-4">Get Involved</h3>
                  <p className="mb-6">
                    We'd love for you to be a part of our {selectedMinistry.title}. Here's how you can get started:
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <i className="fas fa-check-circle text-gold mt-1 mr-3"></i>
                      <span>Attend our next gathering and meet the team</span>
                    </li>
                    <li className="flex items-start">
                      <i className="fas fa-check-circle text-gold mt-1 mr-3"></i>
                      <span>Fill out a connection card on Sunday</span>
                    </li>
                    <li className="flex items-start">
                      <i className="fas fa-check-circle text-gold mt-1 mr-3"></i>
                      <span>Email us at {selectedMinistry.title.toLowerCase().replace(/\s+/g, '')}@kingsboroughchurch.org</span>
                    </li>
                  </ul>
                </div>
                
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <button className="btn-primary">Join This Ministry</button>
                  <button className="btn-outline">Contact Ministry Leader</button>
                </div>
              </motion.div>
            </div>
          </section>
        ) : (
          // All Ministries View
          <section className="py-20 bg-white">
            <div className="container mx-auto px-4 lg:px-8">
              <motion.div 
                className="max-w-4xl mx-auto text-center mb-16"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={slideUp()}
              >
                <h2 className="text-3xl md:text-4xl font-montserrat font-bold mb-6 text-deepPurple">Find Your Place to Serve</h2>
                <p className="text-lg">
                  We believe that everyone has unique gifts and abilities. Our ministries provide opportunities for you to use your talents to serve God and others while building meaningful relationships.
                </p>
              </motion.div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {ministries.map((ministry, index) => (
                  <motion.div 
                    key={ministry.id} 
                    className="bg-white rounded-lg shadow-md overflow-hidden card-hover"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    variants={slideUp((index % 3 + 1) * 0.1)}
                    whileHover={{ 
                      y: -5,
                      boxShadow: "0px 10px 20px rgba(0,0,0,0.1)",
                      transition: { duration: 0.3 }
                    }}
                  >
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={ministry.image} 
                        alt={ministry.title} 
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-montserrat font-semibold mb-3">{ministry.title}</h3>
                      <p className="mb-4">{ministry.description}</p>
                      <a 
                        href={`/ministries?id=${ministry.id}`}
                        className="text-gold font-montserrat font-medium hover:underline inline-flex items-center"
                      >
                        Learn More <i className="fas fa-arrow-right ml-2 text-sm"></i>
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div 
                className="text-center mt-16"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={slideUp(0.3)}
              >
                <h3 className="text-2xl font-montserrat font-semibold mb-6">Not sure where to start?</h3>
                <p className="mb-8 max-w-2xl mx-auto">
                  We're here to help you find the perfect place to serve based on your passions, gifts, and availability. Let us help you get connected!
                </p>
                <button className="btn-primary">Talk to a Ministry Coordinator</button>
              </motion.div>
            </div>
          </section>
        )}
      </div>
    </>
  );
};

export default Ministries;
