import { motion } from 'framer-motion';
import { slideUp } from '@/lib/animations';
import { Link } from 'wouter';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const Giving = () => {
  return (
    <section 
      id="giving" 
      className="parallax py-24 relative" 
      style={{ backgroundImage: `url('/uploads/gallery/Givii.png')` }}
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

          <Dialog>
            <motion.div 
              className="flex justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <DialogTrigger asChild>
                <button type="button" className="btn-primary">Give Now</button>
              </DialogTrigger>
            </motion.div>

            <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-montserrat font-bold text-deepPurple">Give</DialogTitle>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-2">
                <div>
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
                      <i className="fas fa-calendar-check text-gold mt-1 mr-3"></i>
                      <div>
                        <p className="font-semibold">Recurring Giving</p>
                        <p className="text-sm">Set up automatic donations</p>
                      </div>
                    </li>
                  </ul>

                  {/* QR Code */}
                  <div className="mt-6 flex flex-col items-start">
                    <p className="text-sm font-semibold mb-2 text-deepPurple">Scan to Give</p>
                    <img
                      src="/images/QR%20CODE.png"
                      alt="Scan QR code to give"
                      className="w-36 h-36 object-contain border border-gray-200 rounded-xl p-1"
                    />
                  </div>
                </div>

                <div>
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
                </div>
              </div>

              <div className="flex justify-center mt-6">
                <Link href="/giving" className="btn-primary">Give Now</Link>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>
      </div>
    </section>
  );
};

export default Giving;
