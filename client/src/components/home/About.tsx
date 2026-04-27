import { motion } from "framer-motion";
import { Link } from "wouter";
import { slideUp } from "@/lib/animations";

const About = () => {
  const impactStats = [
    { value: "1985", label: "Year Founded" },
    { value: "12", label: "Original Members" },
    { value: "1", label: "Shared Mission" },
  ];

  return (
    <section
      id="about"
      data-nav-theme="dark"
      className="py-24 bg-gradient-to-b from-deepPurple via-deepPurple to-black overflow-hidden"
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            className="relative"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={slideUp()}
          >
            <span className="inline-flex items-center px-4 py-2 mb-5 rounded-full border border-gold/40 text-gold text-xs font-montserrat font-semibold tracking-[0.2em] uppercase">
              Our Story
            </span>
            <h2 className="text-4xl md:text-5xl font-montserrat font-bold leading-tight text-white mb-6">
              A Living Story of Faith,
              <span className="text-gold"> Community</span>, and Purpose.
            </h2>
            <p className="text-lg leading-relaxed mb-6 text-white/85">
              Founded in 1985, Kingsborough Church began as a small gathering in
              a living room with a vision to create a church that welcomes
              everyone, regardless of their background or journey.
            </p>
            <p className="text-lg leading-relaxed mb-6 text-white/85">
              What started with just 12 dedicated members has grown into a
              vibrant community of believers passionate about making a
              difference in our city and beyond.
            </p>
            <p className="text-lg leading-relaxed mb-10 text-white/85">
              Our mission remains the same: to help people know God, find
              freedom, discover purpose, and make a difference.
            </p>

            <div className="grid grid-cols-3 gap-3 mb-10">
              {impactStats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white/10 border border-white/20 rounded-xl p-4 text-center"
                >
                  <div className="text-2xl md:text-3xl font-montserrat font-bold text-gold">
                    {stat.value}
                  </div>
                  <div className="text-xs md:text-sm text-white/75 mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/about"
              className="inline-flex items-center justify-center px-8 py-3 bg-gold text-deepPurple font-montserrat font-semibold rounded-full hover:bg-gold/90 transition-colors"
            >
              Explore Our Full Story
            </Link>
          </motion.div>

          <motion.div
            className="relative min-h-[420px] lg:min-h-[520px]"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={slideUp(0.3)}
          >
            <div className="absolute inset-0 rounded-3xl overflow-hidden border border-white/20">
              <img
                src="/uploads/gallery/HOP.jpg"
                alt="Kingsborough Church worship gathering"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
            </div>

            <motion.div
              className="absolute -bottom-6 -left-4 md:left-6 bg-lilac text-deepPurple rounded-2xl p-5 md:p-6 border border-white/40 shadow-2xl max-w-[280px]"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <p className="text-sm md:text-base font-semibold leading-relaxed">
                "We are building a Christ-centered family where everyone can
                belong and grow."
              </p>
            </motion.div>

            <motion.div
              className="absolute -top-6 right-0 md:right-6 w-44 h-44 md:w-52 md:h-52 rounded-2xl overflow-hidden border-4 border-deepPurple shadow-xl"
              initial={{ y: -20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: 0.35 }}
            >
              <img
                src="/uploads/gallery/HOP2.JPG"
                alt="Kingsborough Church community"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
