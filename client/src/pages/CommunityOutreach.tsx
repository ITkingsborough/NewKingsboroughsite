import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HandHeart, Home, Utensils, Users, Package, Heart } from "lucide-react";
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

const CommunityOutreach = () => {
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

  const initiatives = [
    {
      icon: Utensils,
      title: "Hillingdon Foodbank",
      description: "Partnering with the local foodbank to provide essential food supplies to families in need throughout our community."
    },
    {
      icon: Home,
      title: "Homeless Support",
      description: "Regular outreach to provide meals, clothing, and companionship to those experiencing homelessness in our area."
    },
    {
      icon: Package,
      title: "Care Packages",
      description: "Assembling and distributing care packages to the elderly, single parents, and vulnerable members of our community."
    },
    {
      icon: Users,
      title: "Community Events",
      description: "Hosting free community events that bring people together and provide practical support and resources."
    }
  ];

  const impactStats = [
    { number: "500+", label: "Families Served Monthly" },
    { number: "2,000+", label: "Meals Distributed" },
    { number: "100+", label: "Active Volunteers" },
    { number: "10+", label: "Community Partners" }
  ];

  return (
    <>
      <Helmet>
        <title>Community Outreach | Kingsborough Church</title>
        <meta name="description" content="Making a difference in our community through practical love and service. Join Kingsborough Church in serving those in need." />
      </Helmet>
      
      <div className="min-h-screen">
        <section 
          ref={heroRef}
          className="relative h-screen flex items-center justify-center bg-cover bg-center bg-fixed"
          style={{
            backgroundImage: `linear-gradient(rgba(76,0,109,0.7), rgba(76,0,109,0.5)), url('/uploads/gallery/16a79bb9-e14d-4375-9610-73efa97e6223.jpg')`,
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
              <HandHeart className="w-20 h-20 text-gold" />
            </motion.div>
            <motion.h1 
              initial="hidden"
              animate="visible"
              variants={slideUp(0.1)}
              className="text-5xl md:text-7xl font-montserrat font-bold mb-6"
            >
              Community Outreach
            </motion.h1>
            <motion.p 
              initial="hidden"
              animate="visible"
              variants={slideUp(0.2)}
              className="text-xl md:text-2xl font-light leading-relaxed"
            >
              Being the hands and feet of Jesus in our neighborhood and beyond
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
                  Our Mission
                </h2>
                <p className="text-xl text-gray-700 leading-relaxed mb-6">
                  At Kingsborough Church, we believe that faith without action is incomplete. Our Community 
                  Outreach ministry exists to demonstrate God's love through practical service to those 
                  in need—whether that's providing food, offering support, or simply being present.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  We partner with local organizations, businesses, and government agencies to maximize 
                  our impact and ensure that no one in our community goes without. Together, we're 
                  building bridges of hope and transforming lives one act of kindness at a time.
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
                  src="/uploads/gallery/HOP.jpg" 
                  alt="Volunteers serving community" 
                  className="rounded-lg shadow-xl w-full"
                />
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-deepPurple text-white">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={slideUp()}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-montserrat font-bold mb-6">
                Our Impact
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-4 gap-8">
              {impactStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={slideUp(index * 0.1)}
                  className="text-center"
                >
                  <div className="text-5xl md:text-6xl font-montserrat font-bold text-gold mb-4">
                    {stat.number}
                  </div>
                  <p className="text-lg opacity-90">{stat.label}</p>
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
                Our Initiatives
              </h2>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                Multiple ways we're serving and supporting our local community
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {initiatives.map((initiative, index) => (
                <motion.div
                  key={initiative.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={slideUp(index * 0.1)}
                  className="bg-white p-8 rounded-lg shadow-lg flex gap-6 hover:shadow-xl transition-shadow"
                >
                  <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <initiative.icon className="w-8 h-8 text-gold" />
                  </div>
                  <div>
                    <h3 className="text-xl font-montserrat font-bold mb-3 text-deepPurple">
                      {initiative.title}
                    </h3>
                    <p className="text-gray-600">
                      {initiative.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={slideUp(0.2)}
                className="relative order-2 lg:order-1"
              >
                <img 
                  src="/uploads/gallery/16a79bb9-e14d-4375-9610-73efa97e6223.jpg" 
                  alt="Foodbank distribution" 
                  className="rounded-lg shadow-xl w-full"
                />
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={slideUp()}
                className="order-1 lg:order-2"
              >
                <h2 className="text-4xl md:text-5xl font-montserrat font-bold mb-8 text-deepPurple">
                  Hillingdon Foodbank Partnership
                </h2>
                <p className="text-xl text-gray-700 leading-relaxed mb-6">
                  Our church serves as a distribution center for the Hillingdon Foodbank, helping to 
                  ensure that families in crisis have access to nutritious food and essential supplies.
                </p>
                <div className="bg-lightLilac p-6 rounded-lg">
                  <h3 className="font-montserrat font-bold text-deepPurple mb-4">Distribution Hours</h3>
                  <div className="space-y-2 text-gray-700">
                    <p><strong>Tuesday:</strong> 10:00 AM - 12:00 PM</p>
                    <p><strong>Thursday:</strong> 2:00 PM - 4:00 PM</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gold text-white">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={slideUp()}
            >
              <Heart className="w-16 h-16 mx-auto mb-8" />
              <h2 className="text-4xl md:text-5xl font-montserrat font-bold mb-6">
                Get Involved
              </h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
                Whether you can give an hour a week or want to lead a project, there's a place for you 
                in our outreach ministry. Together, we can make a real difference.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/contact" 
                  className="inline-block bg-white text-gold px-8 py-4 rounded-lg font-montserrat font-semibold hover:bg-gray-100 transition-colors"
                >
                  Volunteer Now
                </a>
                <a 
                  href="/giving" 
                  className="inline-block bg-deepPurple text-white px-8 py-4 rounded-lg font-montserrat font-semibold hover:bg-deepPurple/90 transition-colors"
                >
                  Support Our Work
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default CommunityOutreach;
