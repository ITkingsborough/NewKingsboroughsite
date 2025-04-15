import { motion } from 'framer-motion';
import { slideUp } from '@/lib/animations';
import { leaders } from '@/lib/data';
import { Helmet } from 'react-helmet';

const About = () => {
  const timeline = [
    {
      year: "1985",
      title: "Our Beginnings",
      description: "Kingsborough Church began as a small gathering in a living room with just 12 members."
    },
    {
      year: "1990",
      title: "First Building",
      description: "Moved into our first dedicated building after years of meeting in homes and rented spaces."
    },
    {
      year: "2000",
      title: "Growing Community",
      description: "Surpassed 500 members and expanded our community outreach initiatives."
    },
    {
      year: "2010",
      title: "New Campus",
      description: "Built and moved into our current main campus to accommodate our growing congregation."
    },
    {
      year: "2020",
      title: "Digital Ministry",
      description: "Launched online services reaching thousands beyond our physical location."
    },
    {
      year: "Today",
      title: "Looking Forward",
      description: "Continuing to grow and serve with a focus on community impact and spiritual growth."
    }
  ];

  return (
    <>
      <Helmet>
        <title>About Us | Kingsborough Church</title>
        <meta name="description" content="Learn about Kingsborough Church's history, mission, vision, and leadership team." />
      </Helmet>
      <div className="pt-24">
        {/* Hero Section */}
        <section className="relative h-80 md:h-96 flex items-center parallax" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1536888248180-1904226e159c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')` }}>
          <div className="absolute inset-0 overlay-gold"></div>
          <div className="container mx-auto px-4 lg:px-8 z-10">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={slideUp()}
              className="max-w-3xl"
            >
              <h1 className="text-4xl md:text-5xl font-montserrat font-bold text-white mb-4 tracking-tight text-shadow">About Us</h1>
              <p className="text-xl text-white opacity-90 font-light">Our story, mission, and the people who make our church a home.</p>
            </motion.div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div 
              className="max-w-4xl mx-auto"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={slideUp()}
            >
              <h2 className="text-3xl md:text-4xl font-montserrat font-bold mb-6 text-deepPurple text-center">Our Story</h2>
              <p className="text-lg leading-relaxed mb-8">
                Kingsborough Church was founded in 1985 with a simple mission: to create a church that welcomes everyone, helps people encounter God, and makes a difference in the community. What began as a small gathering of 12 people in a living room has grown into a thriving community of believers.
              </p>
              <p className="text-lg leading-relaxed mb-8">
                Over the years, we've seen countless lives transformed through God's love. Through seasons of growth and change, our commitment to authentic faith and meaningful community has remained steadfast.
              </p>
              <p className="text-lg leading-relaxed mb-8">
                Today, we continue to be a church that embraces people exactly where they are while encouraging them to grow in their relationship with God and others. We believe that the church should be the most welcoming place on earth, where every person can find hope, purpose, and family.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Mission & Vision Section */}
        <section className="py-20 bg-lilac bg-opacity-10">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={slideUp()}
              >
                <h2 className="text-3xl font-montserrat font-bold mb-6 text-deepPurple">Our Mission</h2>
                <div className="h-1 w-20 bg-gold mb-6"></div>
                <p className="text-lg leading-relaxed">
                  To help people know God, find freedom, discover purpose, and make a difference. We believe that through authentic community and practical teaching, lives can be transformed by the power of God's love.
                </p>
              </motion.div>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={slideUp(0.2)}
              >
                <h2 className="text-3xl font-montserrat font-bold mb-6 text-deepPurple">Our Vision</h2>
                <div className="h-1 w-20 bg-gold mb-6"></div>
                <p className="text-lg leading-relaxed">
                  To be a church that makes a lasting impact in our city and beyond by creating environments where people from all walks of life can experience God's presence, build meaningful relationships, and grow in their faith journey.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={slideUp()}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-montserrat font-bold mb-6 text-deepPurple">Our Journey</h2>
              <p className="text-lg max-w-3xl mx-auto">A look at the key moments that have shaped our church throughout the years.</p>
            </motion.div>
            
            <div className="relative max-w-4xl mx-auto">
              {/* Timeline line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-lilac opacity-50"></div>
              
              {/* Timeline events */}
              {timeline.map((event, index) => (
                <motion.div 
                  key={index}
                  className={`relative flex items-center mb-12 ${index % 2 === 0 ? 'flex-row-reverse' : ''}`}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={slideUp(index * 0.1)}
                >
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pl-12' : 'pr-12 text-right'}`}>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <h3 className="text-xl font-montserrat font-semibold mb-1">{event.title}</h3>
                      <p className="text-gold font-semibold mb-3">{event.year}</p>
                      <p>{event.description}</p>
                    </div>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-gold"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Leadership Team Section */}
        <section className="py-20 bg-lilac bg-opacity-10">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={slideUp()}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-montserrat font-bold mb-6 text-deepPurple">Our Leadership Team</h2>
              <p className="text-lg max-w-3xl mx-auto">Meet the dedicated individuals who guide our church with wisdom, compassion, and a heart for serving our community.</p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {leaders.map((leader, index) => (
                <motion.div 
                  key={leader.id} 
                  className="card-hover"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                  variants={slideUp((index % 4 + 1) * 0.1)}
                  whileHover={{ 
                    y: -5,
                    boxShadow: "0px 10px 20px rgba(0,0,0,0.1)",
                    transition: { duration: 0.3 }
                  }}
                >
                  <div className="rounded-lg overflow-hidden mb-4">
                    <img 
                      src={leader.image} 
                      alt={leader.name} 
                      className="w-full h-72 object-cover"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="text-xl font-montserrat font-semibold mb-1">{leader.name}</h3>
                  <p className="text-gold mb-3">{leader.role}</p>
                  <p className="text-sm">{leader.bio}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={slideUp()}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-montserrat font-bold mb-6 text-deepPurple">Our Core Values</h2>
              <p className="text-lg max-w-3xl mx-auto">These principles guide everything we do as a church community.</p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: "fas fa-heart",
                  title: "Love Without Limits",
                  description: "We believe in loving God and loving others without conditions or exceptions."
                },
                {
                  icon: "fas fa-hands-helping",
                  title: "Servant Leadership",
                  description: "We lead by putting others first and serving with humility and compassion."
                },
                {
                  icon: "fas fa-users",
                  title: "Authentic Community",
                  description: "We create spaces where people can be real, build relationships, and grow together."
                },
                {
                  icon: "fas fa-book-open",
                  title: "Biblical Teaching",
                  description: "We are committed to teaching God's Word in ways that are relevant and applicable to daily life."
                },
                {
                  icon: "fas fa-child",
                  title: "Generational Impact",
                  description: "We invest in the next generation because we believe they are not just the future, but also the present."
                },
                {
                  icon: "fas fa-globe-americas",
                  title: "Missional Living",
                  description: "We empower people to live on mission in their neighborhoods, workplaces, and around the world."
                }
              ].map((value, index) => (
                <motion.div 
                  key={index} 
                  className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                  variants={slideUp((index % 3 + 1) * 0.1)}
                >
                  <div className="w-16 h-16 rounded-full bg-lilac bg-opacity-20 flex items-center justify-center mb-4">
                    <i className={`${value.icon} text-gold text-2xl`}></i>
                  </div>
                  <h3 className="text-xl font-montserrat font-semibold mb-3">{value.title}</h3>
                  <p>{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default About;
