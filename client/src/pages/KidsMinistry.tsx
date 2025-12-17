import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Baby, Heart, BookOpen, Gamepad2, Music, Shield } from "lucide-react";
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

const KidsMinistry = () => {
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

  const programs = [
    {
      icon: Baby,
      title: "Nursery (0-2 years)",
      description: "A safe, loving environment where our littlest ones are cared for with gentleness and attention."
    },
    {
      icon: Gamepad2,
      title: "Toddlers (2-4 years)",
      description: "Interactive play and simple Bible stories introduce children to God's love through fun activities."
    },
    {
      icon: BookOpen,
      title: "Elementary (5-11 years)",
      description: "Engaging lessons, worship, and activities that help kids grow in their faith and understand the Bible."
    },
    {
      icon: Music,
      title: "Kids Worship",
      description: "Fun, energetic worship times where children learn to praise God with songs and movement."
    }
  ];

  const values = [
    {
      icon: Shield,
      title: "Safety First",
      description: "All volunteers are background checked and trained. We use secure check-in systems to ensure your child's safety."
    },
    {
      icon: Heart,
      title: "Love & Care",
      description: "Every child is valued and loved. Our team creates a welcoming atmosphere where kids feel they belong."
    },
    {
      icon: BookOpen,
      title: "Biblical Foundation",
      description: "Age-appropriate Bible teaching helps children build a strong foundation of faith from an early age."
    }
  ];

  return (
    <>
      <Helmet>
        <title>Kids Ministry | Kingsborough Church</title>
        <meta name="description" content="A fun, safe environment where children learn about God's love through engaging activities and age-appropriate Bible teaching at Kingsborough Church." />
      </Helmet>
      
      <div className="min-h-screen">
        <section 
          ref={heroRef}
          className="relative h-screen flex items-center justify-center bg-cover bg-center bg-fixed"
          style={{
            backgroundImage: `linear-gradient(rgba(76,0,109,0.7), rgba(76,0,109,0.5)), url('https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`,
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
              <Baby className="w-20 h-20 text-gold" />
            </motion.div>
            <motion.h1 
              initial="hidden"
              animate="visible"
              variants={slideUp(0.1)}
              className="text-5xl md:text-7xl font-montserrat font-bold mb-6"
            >
              Kids Ministry
            </motion.h1>
            <motion.p 
              initial="hidden"
              animate="visible"
              variants={slideUp(0.2)}
              className="text-xl md:text-2xl font-light leading-relaxed"
            >
              Where children discover God's love through fun, friendship, and faith
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
                  About Kids Ministry
                </h2>
                <p className="text-xl text-gray-700 leading-relaxed mb-6">
                  At Kingsborough Kids, we believe that children are not just the church of tomorrow—they're 
                  an important part of our church family today! Our ministry is designed to create a fun, 
                  safe environment where kids can learn about Jesus in age-appropriate ways.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Through creative teaching, interactive activities, and genuine relationships, we help 
                  children build a foundation of faith that will last a lifetime. Parents can worship 
                  confidently knowing their children are in good hands.
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
                  src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Children learning and playing" 
                  className="rounded-lg shadow-xl w-full"
                />
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-br from-gold/10 to-purple-100">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={slideUp()}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-montserrat font-bold mb-6 text-deepPurple">
                Our Programs
              </h2>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                Age-appropriate environments designed to meet children where they are
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {programs.map((program, index) => (
                <motion.div
                  key={program.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={slideUp(index * 0.1)}
                  className="bg-white p-8 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow"
                >
                  <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <program.icon className="w-8 h-8 text-gold" />
                  </div>
                  <h3 className="text-xl font-montserrat font-bold mb-4 text-deepPurple">
                    {program.title}
                  </h3>
                  <p className="text-gray-600">
                    {program.description}
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
                Our Values
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={slideUp(index * 0.1)}
                  className="text-center"
                >
                  <div className="w-20 h-20 bg-deepPurple rounded-full flex items-center justify-center mx-auto mb-6">
                    <value.icon className="w-10 h-10 text-gold" />
                  </div>
                  <h3 className="text-2xl font-montserrat font-bold mb-4 text-deepPurple">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 text-lg">
                    {value.description}
                  </p>
                </motion.div>
              ))}
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
                Service Times
              </h2>
            </motion.div>

            <div className="max-w-2xl mx-auto">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={slideUp(0.1)}
                className="bg-white p-8 rounded-lg shadow-xl"
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                    <span className="font-montserrat font-semibold text-deepPurple">Sunday Service</span>
                    <span className="text-gray-600">10:00 AM - 12:00 PM</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-montserrat font-semibold text-deepPurple">Check-in Opens</span>
                    <span className="text-gray-600">9:30 AM</span>
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
                Volunteer With Us
              </h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
                Love working with children? Join our team of dedicated volunteers who are shaping 
                the next generation. Training and support provided!
              </p>
              <a 
                href="/contact" 
                className="inline-block bg-gold text-white px-8 py-4 rounded-lg font-montserrat font-semibold hover:bg-gold/90 transition-colors"
              >
                Sign Up to Serve
              </a>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default KidsMinistry;
