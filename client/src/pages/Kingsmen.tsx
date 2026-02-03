import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Shield, Users, Heart, BookOpen, Compass, Mountain } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const slideUp = (delay: number = 0) => ({
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, delay, ease: "easeOut" } 
  }
});

const Kingsmen = () => {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!heroRef.current) return;

    // Hero background parallax effect
    gsap.to(heroRef.current, {
      backgroundPosition: "50% 100%",
      ease: "none",
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="relative h-screen flex items-center justify-center bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.3)), url('https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`,
          backgroundPosition: "50% 50%"
        }}
      >
        <div className="text-center text-white px-4 max-w-4xl mx-auto">
          <motion.h1 
            initial="hidden"
            animate="visible"
            variants={slideUp()}
            className="text-5xl md:text-7xl font-montserrat font-bold mb-6"
          >
            Kingsmen
          </motion.h1>
          <motion.p 
            initial="hidden"
            animate="visible"
            variants={slideUp(0.2)}
            className="text-xl md:text-2xl font-light leading-relaxed"
          >
            Men of faith, courage, and authentic Christian brotherhood
          </motion.p>
        </div>
      </section>

      {/* About Kingsmen Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={slideUp()}
            >
              <h2 className="text-4xl md:text-5xl font-montserrat font-bold mb-8 text-deepPurple">
                About Kingsmen
              </h2>
              <p className="text-xl text-gray-700 leading-relaxed mb-6">
                Kingsmen is a vibrant men's ministry at Kingsborough Church, dedicated to building 
                authentic Christian masculinity through fellowship, discipleship, and service. We believe 
                that men are called to be leaders, protectors, and servants in their families, 
                communities, and the kingdom of God.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Our brotherhood is built on the foundation of Christ's love, where men can share their 
                struggles, celebrate victories, and grow together in faith. We're not about perfection; 
                we're about progress and authentic relationships that challenge us to become the men 
                God has called us to be.
              </p>
            </motion.div>
            
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={slideUp(0.2)}
              className="relative"
            >
              <img 
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Men in prayer and fellowship" 
                className="rounded-lg shadow-xl w-full"
              />
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
              Our ministry focuses on building strong Christian men through various activities and programs
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={slideUp()}
              className="bg-white p-8 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow duration-300"
            >
              <div className="w-16 h-16 bg-deepPurple bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-deepPurple" />
              </div>
              <h3 className="text-2xl font-montserrat font-bold mb-4 text-deepPurple">Brotherhood Gatherings</h3>
              <p className="text-gray-600 leading-relaxed">
                Monthly meetings featuring guest speakers, testimonies, and open discussions 
                about faith, leadership, and life challenges in a supportive environment.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={slideUp(0.1)}
              className="bg-white p-8 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow duration-300"
            >
              <div className="w-16 h-16 bg-deepPurple bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-8 h-8 text-deepPurple" />
              </div>
              <h3 className="text-2xl font-montserrat font-bold mb-4 text-deepPurple">Men's Bible Study</h3>
              <p className="text-gray-600 leading-relaxed">
                Weekly Bible studies focusing on biblical masculinity, character development, 
                and practical application of God's Word in daily life and relationships.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={slideUp(0.2)}
              className="bg-white p-8 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow duration-300"
            >
              <div className="w-16 h-16 bg-deepPurple bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-deepPurple" />
              </div>
              <h3 className="text-2xl font-montserrat font-bold mb-4 text-deepPurple">Service Projects</h3>
              <p className="text-gray-600 leading-relaxed">
                Community service initiatives including home repairs for elderly members, 
                food bank volunteering, and supporting local families in need.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={slideUp(0.3)}
              className="bg-white p-8 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow duration-300"
            >
              <div className="w-16 h-16 bg-deepPurple bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mountain className="w-8 h-8 text-deepPurple" />
              </div>
              <h3 className="text-2xl font-montserrat font-bold mb-4 text-deepPurple">Adventure & Sports</h3>
              <p className="text-gray-600 leading-relaxed">
                Outdoor activities, sports events, and adventure trips that build camaraderie 
                while enjoying God's creation and developing lasting friendships.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={slideUp(0.4)}
              className="bg-white p-8 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow duration-300"
            >
              <div className="w-16 h-16 bg-deepPurple bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Compass className="w-8 h-8 text-deepPurple" />
              </div>
              <h3 className="text-2xl font-montserrat font-bold mb-4 text-deepPurple">Mentorship Program</h3>
              <p className="text-gray-600 leading-relaxed">
                Pairing experienced Christian men with younger men for guidance in faith, 
                career, relationships, and personal development through one-on-one relationships.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={slideUp(0.5)}
              className="bg-white p-8 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow duration-300"
            >
              <div className="w-16 h-16 bg-deepPurple bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-deepPurple" />
              </div>
              <h3 className="text-2xl font-montserrat font-bold mb-4 text-deepPurple">Men's Retreats</h3>
              <p className="text-gray-600 leading-relaxed">
                Annual retreats and quarterly getaways for deeper fellowship, spiritual growth, 
                and renewal away from daily distractions and responsibilities.
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
              Brotherhood in Action
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              See our men's ministry in action through fellowship, service, and growth opportunities
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
                src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Kingsmen Fellowship Meeting" 
                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="font-semibold">Brotherhood Meeting</h3>
                  <p className="text-sm opacity-90">Monthly fellowship gathering</p>
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
                src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Kingsmen Bible Study" 
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
              variants={slideUp(0.2)}
              className="relative group overflow-hidden rounded-lg shadow-lg"
            >
              <img 
                src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Kingsmen Service Project" 
                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="font-semibold">Service Project</h3>
                  <p className="text-sm opacity-90">Serving our community together</p>
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
                src="https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Kingsmen Adventure Activity" 
                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="font-semibold">Adventure Outing</h3>
                  <p className="text-sm opacity-90">Building bonds through adventure</p>
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
                src="https://images.unsplash.com/photo-1547036967-23d11aacaee0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Kingsmen Sports Event" 
                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="font-semibold">Sports Fellowship</h3>
                  <p className="text-sm opacity-90">Competition and camaraderie</p>
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
                src="https://images.unsplash.com/photo-1522621032211-ac0031dfab5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Kingsmen Annual Retreat" 
                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="font-semibold">Annual Retreat</h3>
                  <p className="text-sm opacity-90">Spiritual renewal and growth</p>
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
              Want to see more of our brotherhood in action? Visit our main gallery page.
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
                Join the Brotherhood
              </h2>
              <p className="text-xl text-gray-700 leading-relaxed mb-8">
                Whether you're a new believer or a seasoned Christian, Kingsmen welcomes you 
                to join our brotherhood. Come and experience authentic Christian fellowship 
                where men support each other in faith and life.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-lilac bg-opacity-20 flex items-center justify-center mr-4">
                    <Users className="w-6 h-6 text-deepPurple" />
                  </div>
                  <div>
                    <h3 className="text-xl font-montserrat font-semibold text-deepPurple mb-2">
                      Monthly Brotherhood Meeting
                    </h3>
                    <p className="text-gray-600">
                      First Saturday of every month at 8:00 AM
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-lilac bg-opacity-20 flex items-center justify-center mr-4">
                    <BookOpen className="w-6 h-6 text-deepPurple" />
                  </div>
                  <div>
                    <h3 className="text-xl font-montserrat font-semibold text-deepPurple mb-2">
                      Weekly Bible Study
                    </h3>
                    <p className="text-gray-600">
                      Every Tuesday at 7:30 PM
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-lilac bg-opacity-20 flex items-center justify-center mr-4">
                    <Compass className="w-6 h-6 text-deepPurple" />
                  </div>
                  <div>
                    <h3 className="text-xl font-montserrat font-semibold text-deepPurple mb-2">
                      Location
                    </h3>
                    <p className="text-gray-600">
                      Kingsborough Church<br />
                      215 High Street, Yiewsley<br />
                      West Drayton, UB7 7QP
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <a 
                  href="/contact" 
                  className="btn-primary"
                >
                  Get Connected
                </a>
              </div>
            </motion.div>
            
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={slideUp(0.2)}
              className="relative"
            >
              <img 
                src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Men in prayer" 
                className="rounded-lg shadow-xl w-full"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-deepPurple text-white">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={slideUp()}
          >
            <h2 className="text-4xl md:text-5xl font-montserrat font-bold mb-6">
              Ready to Join the Kingsmen?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Take the next step in your spiritual journey. Connect with our men's ministry 
              and discover the brotherhood you've been looking for.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/contact" 
                className="btn-secondary"
              >
                Contact Us
              </a>
              <a 
                href="/about" 
                className="btn-outline-white"
              >
                Learn More About Our Church
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Kingsmen;