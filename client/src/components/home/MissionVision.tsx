import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { slideUp } from "@/lib/animations";

const InlinePhoto = ({ images, alt, interval = 3000 }: { images: string[]; alt: string; interval?: number }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, interval);
    return () => clearInterval(timer);
  }, [images.length, interval]);

  return (
    <span className="relative inline-block align-middle h-14 md:h-20 w-24 md:w-36 rounded-md overflow-hidden mx-1 md:mx-2 -translate-y-0.5">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.img
          key={images[index]}
          src={images[index]}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          loading="lazy"
        />
      </AnimatePresence>
    </span>
  );
};

const MissionVision = () => {
  return (
    <section data-nav-theme="light" className="bg-[#F7F5F0] py-16 md:py-20">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={slideUp()}
          className="max-w-7xl mx-auto text-center"
        >
          <span className="inline-flex items-center px-4 py-2 mb-8 rounded-full border border-gold/40 text-gold text-xs font-montserrat font-semibold tracking-[0.2em] uppercase">
            Who We Are
          </span>
          <p className="relative z-10 font-bebas text-[50px] md:text-[56px] leading-relaxed tracking-[0.04em] text-gray-800 text-center">
            At Kingsborough, we are
            <InlinePhoto
              images={["/uploads/gallery/Apst Preaching.JPG", "/uploads/gallery/PS.jpg", "/uploads/gallery/PC.jpg"]}
              alt="Preaching at Kingsborough Church"
              interval={2800}
            />
            teaching and revealing Jesus Christ and His unending grace to all people,
            <InlinePhoto
              images={["/uploads/gallery/MEDIA.jpg", "/uploads/gallery/HOP.jpg", "/uploads/gallery/HOP2.JPG"]}
              alt="Worship at Kingsborough Church"
              interval={3400}
            />
            building authentic community and creating positive change in our city.
            <InlinePhoto
              images={["/uploads/gallery/Moyo and Van.JPG", "/uploads/gallery/IMG_7832.JPG", "/uploads/gallery/IMG_1177.JPG"]}
              alt="Community at Kingsborough Church"
              interval={4000}
            />
            We believe in leading people into a growing relationship with Jesus Christ through worship, discipleship, and service to others.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={slideUp(0.25)}
          className="flex justify-center mt-10"
        >
          <Link
            href="/about"
            className="inline-flex items-center justify-center bg-deepPurple hover:bg-deepPurple/90 text-white font-montserrat font-semibold text-sm md:text-base px-8 py-4 rounded-lg transition-colors duration-300"
          >
            Learn More About Us
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default MissionVision;

