import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { slideUp, staggerContainer } from '@/lib/animations';
import { useState, useEffect } from 'react';

const Hadassah = () => {
  // Slideshow images for Our Purpose section
  const purposeImages = [
    {
      src: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "Women in fellowship"
    },
    {
      src: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "Women in prayer circle"
    },
    {
      src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "Women's Bible study"
    },
    {
      src: "https://images.unsplash.com/photo-1522621032211-ac0031dfab5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "Women's retreat gathering"
    }
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-advance slideshow every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % purposeImages.length
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [purposeImages.length]);

  return (
    <>
      <Helmet>
        <title>Hadassah Women's Ministry | Kingsborough Church</title>
        <meta name="description" content="Join Hadassah, the vibrant women's ministry at Kingsborough Church. Empowering women through fellowship, prayer, and spiritual growth." />
      </Helmet>
      <div className="pt-24">
        {/* Hero Section */}
        <section className="relative h-96 md:h-[500px] flex items-center parallax" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')` }}>
          <div className="absolute inset-0 overlay-lilac"></div>
          <div className="container mx-auto px-4 lg:px-8 z-10">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={slideUp()}
              className="max-w-4xl"
            >
              <h1 className="text-5xl md:text-6xl font-montserrat font-bold text-white mb-6 tracking-tight text-shadow">Hadassah</h1>
              <p className="text-2xl text-white opacity-90 font-light mb-4">
                Women's Ministry
              </p>
              <p className="text-xl text-white opacity-80 max-w-3xl">
                Empowering women through faith, fellowship, and spiritual growth in the heart of our community
              </p>
            </motion.div>
          </div>
        </section>

        {/* About Hadassah Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={staggerContainer()}
              className="max-w-4xl mx-auto text-center"
            >
              <motion.h2 
                variants={slideUp()}
                className="text-4xl md:text-5xl font-montserrat font-bold mb-8 text-deepPurple"
              >
                About Hadassah
              </motion.h2>
              <motion.p 
                variants={slideUp(0.1)}
                className="text-xl leading-relaxed mb-12 text-gray-700"
              >
                Hadassah is our vibrant women's ministry, named after the biblical Queen Esther, whose Hebrew name was Hadassah. 
                Like Queen Esther, we believe every woman has been placed "for such a time as this" to make a significant impact 
                in God's kingdom and in our community.
              </motion.p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={slideUp()}
                className="relative"
              >
                <div className="relative overflow-hidden rounded-lg shadow-lg">
                  {purposeImages.map((image, index) => (
                    <motion.img
                      key={index}
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-80 object-cover"
                      initial={{ opacity: 0 }}
                      animate={{ 
                        opacity: index === currentImageIndex ? 1 : 0,
                        scale: index === currentImageIndex ? 1 : 1.1
                      }}
                      transition={{ duration: 1, ease: "easeInOut" }}
                      style={{
                        position: index === 0 ? 'relative' : 'absolute',
                        top: index === 0 ? 'auto' : 0,
                        left: index === 0 ? 'auto' : 0,
                        right: index === 0 ? 'auto' : 0,
                        bottom: index === 0 ? 'auto' : 0
                      }}
                    />
                  ))}
                  
                  {/* Slideshow indicators */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {purposeImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                          index === currentImageIndex 
                            ? 'bg-white' 
                            : 'bg-white/50 hover:bg-white/70'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={slideUp(0.2)}
                className="space-y-6"
              >
                <h3 className="text-3xl font-montserrat font-bold text-deepPurple">Our Purpose</h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Hadassah exists to create a safe and nurturing environment where women can grow spiritually, 
                  build meaningful relationships, and discover their God-given purpose. We believe in the power 
                  of sisterhood and the strength that comes from walking together in faith.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-gold flex items-center justify-center mr-3 mt-1">
                      <i className="fas fa-heart text-white text-sm"></i>
                    </div>
                    <p><strong>Fellowship:</strong> Building deep, authentic relationships among women</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-gold flex items-center justify-center mr-3 mt-1">
                      <i className="fas fa-praying-hands text-white text-sm"></i>
                    </div>
                    <p><strong>Prayer:</strong> Supporting one another through intercession and spiritual warfare</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-gold flex items-center justify-center mr-3 mt-1">
                      <i className="fas fa-seedling text-white text-sm"></i>
                    </div>
                    <p><strong>Growth:</strong> Encouraging spiritual maturity and personal development</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* What We Do Section */}
        <section className="py-20 bg-lightLilac">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={slideUp()}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-montserrat font-bold mb-6 text-deepPurple">
                What We Do
              </h2>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                Our ministry offers various opportunities for women to connect, grow, and serve together
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={slideUp()}
                className="bg-white rounded-lg shadow-lg p-8 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-lilac bg-opacity-20 flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-users text-gold text-2xl"></i>
                </div>
                <h3 className="text-2xl font-montserrat font-semibold mb-4 text-deepPurple">Monthly Gatherings</h3>
                <p className="text-gray-700 leading-relaxed">
                  Join us for inspiring monthly meetings featuring guest speakers, worship, and fellowship. 
                  A time to be refreshed and encouraged in your faith journey.
                </p>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={slideUp(0.1)}
                className="bg-white rounded-lg shadow-lg p-8 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-lilac bg-opacity-20 flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-book-open text-gold text-2xl"></i>
                </div>
                <h3 className="text-2xl font-montserrat font-semibold mb-4 text-deepPurple">Bible Study</h3>
                <p className="text-gray-700 leading-relaxed">
                  Dive deeper into God's Word through our weekly Bible study sessions. 
                  Explore Scripture together and discover how it applies to your daily life.
                </p>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={slideUp(0.2)}
                className="bg-white rounded-lg shadow-lg p-8 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-lilac bg-opacity-20 flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-hands-helping text-gold text-2xl"></i>
                </div>
                <h3 className="text-2xl font-montserrat font-semibold mb-4 text-deepPurple">Community Outreach</h3>
                <p className="text-gray-700 leading-relaxed">
                  Serve our community through various outreach programs, charity drives, and volunteer opportunities. 
                  Making a difference together in Jesus' name.
                </p>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={slideUp(0.3)}
                className="bg-white rounded-lg shadow-lg p-8 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-lilac bg-opacity-20 flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-praying-hands text-gold text-2xl"></i>
                </div>
                <h3 className="text-2xl font-montserrat font-semibold mb-4 text-deepPurple">Prayer Ministry</h3>
                <p className="text-gray-700 leading-relaxed">
                  Experience the power of prayer through our dedicated prayer times, prayer walks, 
                  and intercession sessions for our families and community.
                </p>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={slideUp(0.4)}
                className="bg-white rounded-lg shadow-lg p-8 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-lilac bg-opacity-20 flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-coffee text-gold text-2xl"></i>
                </div>
                <h3 className="text-2xl font-montserrat font-semibold mb-4 text-deepPurple">Social Events</h3>
                <p className="text-gray-700 leading-relaxed">
                  Enjoy fun social gatherings, retreats, and special events designed to build friendships 
                  and create lasting memories together.
                </p>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={slideUp(0.5)}
                className="bg-white rounded-lg shadow-lg p-8 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-lilac bg-opacity-20 flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-heart text-gold text-2xl"></i>
                </div>
                <h3 className="text-2xl font-montserrat font-semibold mb-4 text-deepPurple">Mentorship</h3>
                <p className="text-gray-700 leading-relaxed">
                  Connect with spiritual mothers and sisters who can guide, support, and encourage you 
                  in your personal and spiritual growth journey.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={slideUp()}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-montserrat font-bold mb-6 text-deepPurple">
                Our Journey Together
              </h2>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                Take a look at some of our memorable moments, outings, and fellowship gatherings
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={slideUp()}
                className="relative group overflow-hidden rounded-lg shadow-lg"
              >
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Hadassah Fellowship Gathering" 
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="font-semibold">Fellowship Gathering</h3>
                    <p className="text-sm opacity-90">Monthly sisterhood meeting</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={slideUp(0.1)}
                className="relative group overflow-hidden rounded-lg shadow-lg"
              >
                <img 
                  src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Hadassah Prayer Circle" 
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="font-semibold">Prayer Circle</h3>
                    <p className="text-sm opacity-90">United in prayer and worship</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={slideUp(0.2)}
                className="relative group overflow-hidden rounded-lg shadow-lg"
              >
                <img 
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Hadassah Bible Study" 
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="font-semibold">Bible Study</h3>
                    <p className="text-sm opacity-90">Growing in God's Word together</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={slideUp(0.3)}
                className="relative group overflow-hidden rounded-lg shadow-lg"
              >
                <img 
                  src="https://images.unsplash.com/photo-1593113630400-ea4288922497?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Hadassah Community Outreach" 
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="font-semibold">Community Outreach</h3>
                    <p className="text-sm opacity-90">Serving our local community</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={slideUp(0.4)}
                className="relative group overflow-hidden rounded-lg shadow-lg"
              >
                <img 
                  src="https://images.unsplash.com/photo-1522621032211-ac0031dfab5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Hadassah Retreat Weekend" 
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="font-semibold">Annual Retreat</h3>
                    <p className="text-sm opacity-90">Weekend of renewal and rest</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={slideUp(0.5)}
                className="relative group overflow-hidden rounded-lg shadow-lg"
              >
                <img 
                  src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Hadassah Social Event" 
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="font-semibold">Social Fellowship</h3>
                    <p className="text-sm opacity-90">Building lasting friendships</p>
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={slideUp(0.6)}
              className="text-center mt-12"
            >
              <p className="text-lg text-gray-600 mb-6">
                Want to see more of our community in action? Visit our main gallery page.
              </p>
              <a 
                href="/gallery" 
                className="btn-outline"
              >
                View Full Gallery
              </a>
            </motion.div>
          </div>
        </section>

        {/* Meeting Times Section */}
        <section className="py-20 bg-lightLilac">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={slideUp()}
              >
                <h2 className="text-4xl md:text-5xl font-montserrat font-bold mb-8 text-deepPurple">
                  Join Us
                </h2>
                <p className="text-xl text-gray-700 leading-relaxed mb-8">
                  Whether you're new to faith or have been walking with Christ for years, Hadassah welcomes you 
                  with open arms. Come as you are and discover the joy of sisterhood in Christ.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="w-12 h-12 rounded-full bg-lilac bg-opacity-20 flex items-center justify-center mr-4">
                      <i className="fas fa-calendar text-gold text-xl"></i>
                    </div>
                    <div>
                      <h3 className="text-xl font-montserrat font-semibold mb-2">Monthly Meetings</h3>
                      <p className="text-gray-700">First Saturday of every month at 10:00 AM</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-12 h-12 rounded-full bg-lilac bg-opacity-20 flex items-center justify-center mr-4">
                      <i className="fas fa-book text-gold text-xl"></i>
                    </div>
                    <div>
                      <h3 className="text-xl font-montserrat font-semibold mb-2">Bible Study</h3>
                      <p className="text-gray-700">Every Wednesday at 7:00 PM</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-12 h-12 rounded-full bg-lilac bg-opacity-20 flex items-center justify-center mr-4">
                      <i className="fas fa-map-marker-alt text-gold text-xl"></i>
                    </div>
                    <div>
                      <h3 className="text-xl font-montserrat font-semibold mb-2">Location</h3>
                      <p className="text-gray-700">Kingsborough Church<br />No 4, New Windsor Street, Uxbridge UB8 2TU</p>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={slideUp(0.2)}
              >
                <img 
                  src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Women praying together" 
                  className="rounded-lg shadow-lg w-full"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-gradient-to-r from-lilac to-gold text-white">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={slideUp()}
              className="max-w-4xl mx-auto"
            >
              <h2 className="text-4xl md:text-5xl font-montserrat font-bold mb-6">
                "For such a time as this"
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Join a community of women who are passionate about growing in faith, building relationships, 
                and making a difference in the world around them.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/contact" 
                  className="btn-secondary bg-white text-deepPurple hover:bg-gray-50"
                >
                  Get In Touch
                </a>
                <a 
                  href="#" 
                  className="btn-outline border-white text-white hover:bg-white hover:text-deepPurple"
                >
                  Learn More
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Hadassah;