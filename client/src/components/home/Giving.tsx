import { motion } from 'framer-motion';
import { slideUp } from '@/lib/animations';
import { Link } from 'wouter';

const Giving = () => {
  return (
    <section 
      id="giving" 
      className="parallax py-24 relative" 
      style={{ backgroundImage: `url('https://images.unsplash.com/photo-1504025468847-0e438279542c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')` }}
    >
      <div className="absolute inset-0 overlay-purple"></div>
      <div className="container mx-auto px-4 lg:px-8 z-10 relative">
        <motion.div 
          className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-8 md:p-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={slideUp()}
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-montserrat font-bold mb-6 text-deepPurple">Give</h2>
            <p className="text-lg">
              Your generosity helps fuel our mission to reach people with the love of Christ and make a difference in our community and beyond.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-montserrat font-semibold mb-4">Ways to Give</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <i className="fas fa-church text-gold mt-1 mr-3"></i>
                  <div>
                    <p className="font-semibold">In Person</p>
                    <p className="text-sm">During our Sunday services</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-mobile-alt text-gold mt-1 mr-3"></i>
                  <div>
                    <p className="font-semibold">Text to Give</p>
                    <p className="text-sm">Text "GIVE" to 555-123-4567</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-calendar-check text-gold mt-1 mr-3"></i>
                  <div>
                    <p className="font-semibold">Recurring Giving</p>
                    <p className="text-sm">Set up automatic donations</p>
                  </div>
                </li>
              </ul>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-montserrat font-semibold mb-4">Where Your Gift Goes</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <i className="fas fa-hands-helping text-gold mt-1 mr-3"></i>
                  <div>
                    <p className="font-semibold">Local Outreach</p>
                    <p className="text-sm">Supporting those in need in our community</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-globe-americas text-gold mt-1 mr-3"></i>
                  <div>
                    <p className="font-semibold">Global Missions</p>
                    <p className="text-sm">Partnering with missionaries around the world</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-church text-gold mt-1 mr-3"></i>
                  <div>
                    <p className="font-semibold">Church Operations</p>
                    <p className="text-sm">Maintaining our facilities and supporting ministries</p>
                  </div>
                </li>
              </ul>
            </motion.div>
          </div>
          
          <motion.div 
            className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Link href="/giving" className="btn-primary">Give Now</Link>
            <Link href="/giving?recurring=true" className="btn-secondary">Set Up Recurring Gift</Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Giving;
