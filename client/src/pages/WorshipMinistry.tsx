import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Music, Heart, Users, Mic2, Piano, Guitar } from "lucide-react";
import { Helmet } from "react-helmet";

gsap.registerPlugin(ScrollTrigger);

const slideUp = (delay: number = 0) => ({
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, delay, ease: "easeOut" } 
  }
});

const WorshipMinistry = () => {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!heroRef.current) return;

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

  const teams = [
    {
      icon: Mic2,
      title: "Vocal Team",
      description: "Lead worship through singing, harmonies, and vocal excellence that draws hearts to God's presence."
    },
    {
      icon: Piano,
      title: "Musicians",
      description: "Skilled instrumentalists who create the musical foundation for our worship experiences."
    },
    {
      icon: Guitar,
      title: "Band Members",
      description: "Guitarists, bassists, and drummers who bring energy and passion to every service."
    },
    {
      icon: Users,
      title: "Production Team",
      description: "Sound engineers, lighting technicians, and media operators who ensure excellence in every service."
    }
  ];

  return (
    <>
      <Helmet>
        <title>Worship Ministry | Kingsborough Church</title>
        <meta name="description" content="Join our Worship Ministry at Kingsborough Church. Use your musical gifts to lead others into God's presence." />
      </Helmet>
      
      <div className="min-h-screen">
        <section 
          ref={heroRef}
          className="relative h-screen flex items-center justify-center bg-cover bg-center bg-fixed"
          style={{
            backgroundImage: `linear-gradient(rgba(76,0,109,0.7), rgba(76,0,109,0.5)), url('https://images.unsplash.com/photo-1603073163308-9654c3fb70b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`,
            backgroundPosition: "50% 50%"
          }}
        >
          <div className="text-center text-white px-4 max-w-4xl mx-auto">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={slideUp()}
              className="flex justify-center mb-6"
            >
              <Music className="w-20 h-20 text-gold" />
            </motion.div>
            <motion.h1 
              initial="hidden"
              animate="visible"
              variants={slideUp(0.1)}
              className="text-5xl md:text-7xl font-montserrat font-bold mb-6"
            >
              Worship Ministry
            </motion.h1>
            <motion.p 
              initial="hidden"
              animate="visible"
              variants={slideUp(0.2)}
              className="text-xl md:text-2xl font-light leading-relaxed"
            >
              Creating atmospheres where heaven meets earth through music and praise
            </motion.p>
          </div>
        </section>

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
                  About Our Worship Ministry
                </h2>
                <p className="text-xl text-gray-700 leading-relaxed mb-6">
                  Our Worship Ministry exists to lead our congregation into authentic encounters with God 
                  through music, song, and creative expression. We believe worship is more than just 
                  singing—it's a lifestyle of surrender and devotion to our Creator.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Whether you're a seasoned musician or just discovering your gifts, there's a place for 
                  you on our team. We value excellence, humility, and a heart that truly seeks after God. 
                  Together, we create moments where people can experience the transforming presence of Jesus.
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
                  src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Worship team leading praise" 
                  className="rounded-lg shadow-xl w-full"
                />
              </motion.div>
            </div>
          </div>
        </section>

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
                Our Teams
              </h2>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                Multiple teams working together to create powerful worship experiences
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teams.map((team, index) => (
                <motion.div
                  key={team.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={slideUp(index * 0.1)}
                  className="bg-white p-8 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow"
                >
                  <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <team.icon className="w-8 h-8 text-gold" />
                  </div>
                  <h3 className="text-xl font-montserrat font-bold mb-4 text-deepPurple">
                    {team.title}
                  </h3>
                  <p className="text-gray-600">
                    {team.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

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
                Rehearsal Schedule
              </h2>
            </motion.div>

            <div className="max-w-2xl mx-auto">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={slideUp(0.1)}
                className="bg-gradient-to-r from-deepPurple to-purple-800 text-white p-8 rounded-lg shadow-xl"
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-white/20 pb-4">
                    <span className="font-montserrat font-semibold">Band Rehearsal</span>
                    <span>Thursdays @ 7:00 PM</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-white/20 pb-4">
                    <span className="font-montserrat font-semibold">Vocal Practice</span>
                    <span>Saturdays @ 4:00 PM</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-montserrat font-semibold">Full Team Rehearsal</span>
                    <span>Sundays @ 8:00 AM</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-deepPurple text-white">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={slideUp()}
            >
              <Heart className="w-16 h-16 text-gold mx-auto mb-8" />
              <h2 className="text-4xl md:text-5xl font-montserrat font-bold mb-6">
                Join Our Team
              </h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
                Do you have a passion for worship and a heart to serve? We'd love to connect with you 
                and help you discover where your gifts can be used.
              </p>
              <a 
                href="/contact" 
                className="inline-block bg-gold text-white px-8 py-4 rounded-lg font-montserrat font-semibold hover:bg-gold/90 transition-colors"
              >
                Get In Touch
              </a>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default WorshipMinistry;
