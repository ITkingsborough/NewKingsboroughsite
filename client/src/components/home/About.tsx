import { motion } from "framer-motion";
import { Link } from "wouter";
import { slideUp } from "@/lib/animations";

const About = () => {
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
                src="/uploads/gallery/Our Story.jpg"
                alt="Kingsborough Church - Our Story"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
