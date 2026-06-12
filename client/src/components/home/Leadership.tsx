import { motion } from 'framer-motion';
import { slideUp } from '@/lib/animations';
import { leaders } from '@/lib/data';

const Leadership = () => {
  return (
    <section data-nav-theme="dark" className="overflow-hidden">
      {/* Senior Pastors — image left, text right */}
      <div className="relative min-h-[80vh] flex flex-col lg:flex-row overflow-hidden">
        {/* Image */}
        <div className="lg:w-1/2 relative min-h-[50vh] lg:min-h-full overflow-hidden">
          <img
            src={leaders[0].image}
            alt={leaders[0].name}
            className="absolute inset-0 w-full h-full object-cover object-top scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/30 lg:block hidden" />
        </div>

        {/* Text */}
        <div className="lg:w-1/2 bg-black flex items-end lg:items-center px-8 md:px-16 py-16">
          <motion.div
            className="max-w-xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={slideUp()}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-montserrat font-bold text-white mb-8 leading-tight">
              {leaders[0].name}
            </h2>
            <div className="border-l-4 border-gold pl-6 space-y-4">
              <p className="text-gold font-semibold text-xl">{leaders[0].role}</p>
              <p className="text-white/85 text-lg leading-relaxed">{leaders[0].bio}</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Resident Pastor — image right, text left */}
      <div className="relative min-h-[80vh] flex flex-col-reverse lg:flex-row overflow-hidden">
        {/* Text */}
        <div className="lg:w-1/2 bg-deepPurple flex items-end lg:items-center px-8 md:px-16 py-16">
          <motion.div
            className="max-w-xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={slideUp()}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-montserrat font-bold text-white mb-8 leading-tight">
              {leaders[1].name}
            </h2>
            <div className="border-l-4 border-gold pl-6 space-y-4">
              <p className="text-gold font-semibold text-xl">{leaders[1].role}</p>
              <p className="text-white/85 text-lg leading-relaxed">{leaders[1].bio}</p>
            </div>
          </motion.div>
        </div>

        {/* Image */}
        <div className="lg:w-1/2 relative min-h-[50vh] lg:min-h-full overflow-hidden">
          <img
            src={leaders[1].image}
            alt={leaders[1].name}
            className="absolute inset-0 w-full h-full object-cover object-top scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-deepPurple/30 lg:block hidden" />
        </div>
      </div>
    </section>
  );
};

export default Leadership;
