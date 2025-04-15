import { motion } from 'framer-motion';
import { slideUp, staggerContainer } from '@/lib/animations';

const Welcome = () => {
  const features = [
    {
      icon: "fas fa-church",
      title: "Sunday Services",
      description: "Join us at 9:00 AM and 11:00 AM for worship that inspires and messages that transform."
    },
    {
      icon: "fas fa-hands-helping",
      title: "Community Groups",
      description: "Connect with others in meaningful relationships through our various small groups and ministries."
    },
    {
      icon: "fas fa-child",
      title: "Family Ministry",
      description: "We provide a safe, fun environment for children and teens to learn and grow in faith."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={slideUp()}
        >
          <h2 className="text-3xl md:text-4xl font-montserrat font-bold mb-6 text-deepPurple">
            Your Journey Starts Here
          </h2>
          <p className="text-lg text-darkGray leading-relaxed mb-10">
            At Kingsborough Church, we believe in authentic community, purposeful worship, and embracing everyone exactly where they are. No matter your background or where you are on your spiritual journey, there's a place for you here.
          </p>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
            variants={staggerContainer(0.1)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {features.map((feature, index) => (
              <motion.div 
                key={index} 
                className="flex flex-col items-center"
                variants={slideUp((index + 1) * 0.1)}
              >
                <div className="w-20 h-20 rounded-full bg-lilac bg-opacity-20 flex items-center justify-center mb-4">
                  <i className={`${feature.icon} text-gold text-3xl`}></i>
                </div>
                <h3 className="text-xl font-montserrat font-semibold mb-2">{feature.title}</h3>
                <p className="text-center">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Welcome;
