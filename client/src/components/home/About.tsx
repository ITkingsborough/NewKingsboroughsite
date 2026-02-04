import { motion } from "framer-motion";
import { Link } from "wouter";
import { slideUp } from "@/lib/animations";

const About = () => {
  const images = [
    {
      src: "/uploads/gallery/HOP.jpg",
      alt: "Church community",
      className: "h-64 overflow-hidden rounded-lg",
    },
    {
      src: "/uploads/gallery/HOP2.JPG",
      alt: "Church worship",
      className: "h-64 overflow-hidden rounded-lg mt-12",
    },
    {
      src: "/uploads/gallery/IMG_1177.JPG",
      alt: "Church event",
      className: "h-64 overflow-hidden rounded-lg",
    },
    {
      src: "/uploads/gallery/IMG_7839 (1).jpg",
      alt: "Church service",
      className: "h-64 overflow-hidden rounded-lg mt-12",
    },
  ];

  return (
    <section id="about" data-nav-theme="dark" className="py-20 bg-deepPurple">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center">
          <motion.div
            className="lg:w-1/2 mb-10 lg:mb-0 lg:pr-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={slideUp()}
          >
            <h2 className="text-3xl md:text-4xl font-Montserrat font-medium mb-6 text-white">
              Our Story
            </h2>
            <p className="text-lg leading-relaxed mb-6 text-white/90">
              Founded in 1985, Kingsborough Church began as a small gathering in
              a living room with a vision to create a church that welcomes
              everyone, regardless of their background or journey.
            </p>
            <p className="text-lg leading-relaxed mb-6 text-white/90">
              What started with just 12 dedicated members has grown into a
              vibrant community of believers passionate about making a
              difference in our city and beyond.
            </p>
            <p className="text-lg leading-relaxed mb-10 text-white/90">
              Our mission remains the same: to help people know God, find
              freedom, discover purpose, and make a difference.
            </p>
            <Link href="/about" className="btn-primary">
              Learn More About Us
            </Link>
          </motion.div>

          <motion.div
            className="lg:w-1/2 grid grid-cols-2 gap-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={slideUp(0.3)}
          >
            {images.map((image, index) => (
              <motion.div
                key={index}
                className={image.className}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.5 }}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
