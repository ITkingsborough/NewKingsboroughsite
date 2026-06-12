'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';

const leftCol = [
  '/uploads/gallery/WhatsApp Image 2026-02-04 at 10.21.23.jpeg',
  '/uploads/gallery/HOP.jpg',
  '/uploads/gallery/IMG_7832.JPG',
  '/uploads/gallery/WhatsApp Image 2026-02-04 at 10.21.26.jpeg',
  '/uploads/gallery/New Audi (1).jpeg',
];

const middleCol = [
  '/uploads/gallery/67993630bb7f463a5b9c6b0a_worship-672c02982a03e589238fc443_62f285c4f9aa3441840257d6_nathan-mullet-pmiW630yDPE-unsplash.jpeg',
  '/uploads/gallery/Apst Preaching.JPG',
  '/uploads/gallery/HOP2.JPG',
];

const rightCol = [
  '/uploads/gallery/IMG_1177.JPG',
  '/uploads/gallery/WhatsApp Image 2026-02-04 at 10.21.27.jpeg',
  '/uploads/gallery/New Audi (2).jpeg',
  '/uploads/gallery/WhatsApp Image 2026-02-04 at 10.21.28.jpeg',
  '/uploads/gallery/New Audi (3).jpeg',
];

const HomeGallery = () => {
  return (
    <section className="bg-black text-white overflow-hidden">
      {/* Header */}
      <div className="sticky top-0 z-10 h-screen w-full bg-black grid place-content-center">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0d_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0d_1px,transparent_1px)] bg-[size:54px_54px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-8"
        >
          <p className="text-gold font-montserrat text-sm uppercase tracking-widest mb-4">
            Life at Kingsborough
          </p>
          <h2 className="text-5xl md:text-7xl font-montserrat font-bold leading-tight">
            Our Community <br /> in Pictures
          </h2>
          <p className="mt-6 text-white/60 text-lg max-w-xl mx-auto">
            Moments of worship, fellowship, and faith — captured as we grow together.
          </p>
          <p className="mt-8 text-white/30 text-sm animate-bounce">Scroll down ↓</p>
        </motion.div>
      </div>

      {/* Sticky-scroll grid */}
      <div className="grid grid-cols-3 gap-2 px-2 pb-2">
        {/* Left — scrolls normally */}
        <div className="flex flex-col gap-2">
          {leftCol.map((src, i) => (
            <figure key={i} className="w-full overflow-hidden rounded-md">
              <img
                src={src}
                alt={`Gallery image ${i + 1}`}
                className="w-full h-80 md:h-96 object-cover transition-transform duration-500 hover:scale-105"
                loading="lazy"
              />
            </figure>
          ))}
        </div>

        {/* Middle — sticky */}
        <div className="sticky top-0 h-screen flex flex-col gap-2">
          {middleCol.map((src, i) => (
            <figure key={i} className="flex-1 overflow-hidden rounded-md min-h-0">
              <img
                src={src}
                alt={`Gallery image ${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                loading="lazy"
              />
            </figure>
          ))}
        </div>

        {/* Right — scrolls normally */}
        <div className="flex flex-col gap-2">
          {rightCol.map((src, i) => (
            <figure key={i} className="w-full overflow-hidden rounded-md">
              <img
                src={src}
                alt={`Gallery image ${i + 1}`}
                className="w-full h-80 md:h-96 object-cover transition-transform duration-500 hover:scale-105"
                loading="lazy"
              />
            </figure>
          ))}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-black py-16 flex flex-col items-center gap-6 rounded-tl-[3rem] rounded-tr-[3rem] relative -mt-4">
        <h3 className="text-2xl md:text-3xl font-montserrat font-semibold text-white text-center">
          Want to see more?
        </h3>
        <Link
          href="/gallery"
          className="px-8 py-3 border border-white/30 rounded-full text-white font-montserrat font-medium hover:bg-white hover:text-black transition-all duration-300"
        >
          View Full Gallery
        </Link>
      </div>
    </section>
  );
};

export default HomeGallery;
