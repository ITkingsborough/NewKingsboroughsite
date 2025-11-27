import { motion } from "framer-motion";
import { Link } from "wouter";
import { slideUp, staggerContainer } from "@/lib/animations";
import { ministries } from "@/lib/data";

const Ministries = () => {
  return (
    <section id="ministries" className="py-20 bg-lilac bg-opacity-10">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={slideUp()}
        >
          <h2 className="text-3xl md:text-4xl font-montserrat font-bold mb-6 text-white">
            Our Ministries
          </h2>
          <p className="text-lg max-w-3xl mx-auto text-white">
            Discover the various ways you can connect, grow, and serve within
            our church community.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={staggerContainer()}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {ministries.map((ministry, index) => (
            <motion.div
              key={ministry.id}
              className="bg-white rounded-lg shadow-md overflow-hidden card-hover"
              variants={slideUp(((index % 3) + 1) * 0.1)}
              whileHover={{
                y: -5,
                boxShadow: "0px 10px 20px rgba(0,0,0,0.1)",
                transition: { duration: 0.3 },
              }}
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={ministry.image}
                  alt={ministry.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-montserrat font-semibold mb-3">
                  {ministry.title}
                </h3>
                <p className="mb-4">{ministry.description}</p>
                <Link
                  href={`/ministries?id=${ministry.id}`}
                  className="text-gold font-montserrat font-medium hover:underline inline-flex items-center"
                >
                  Learn More <i className="fas fa-arrow-right ml-2 text-sm"></i>
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="text-center mt-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={slideUp(0.3)}
        >
          <Link href="/ministries" className="btn-primary">
            View All Ministries
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Ministries;
