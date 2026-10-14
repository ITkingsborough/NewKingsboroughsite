import { useRef } from 'react';
import { Link } from 'wouter';
import { motion, useScroll, useTransform } from 'framer-motion';

const LifeCollage = () => {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Zoom into the center image as the section scrolls, pushing the side columns off-screen
  const scale = useTransform(scrollYProgress, [0, 0.75], [1, 2.6]);
  const overlayOpacity = useTransform(scrollYProgress, [0.45, 0.75], [0, 1]);
  const textOpacity = useTransform(scrollYProgress, [0.55, 0.85], [0, 1]);
  const textY = useTransform(scrollYProgress, [0.55, 0.85], [24, 0]);

  return (
    <section ref={containerRef} className="relative" style={{ height: '220vh' }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#F7F5F0]">
        <motion.div
          style={{ scale }}
          className="flex items-center justify-center gap-2 md:gap-3 w-[112%] h-full -ml-[6%] origin-center"
        >
          {/* Column 1 â€” bleeds off the left edge */}
          <div className="w-[16%] shrink-0">
            <img
              src="/uploads/gallery/Footer/web/_NM_1686.jpg"
              alt="Fellowship at Kingsborough Church"
              className="w-full h-[60vh] md:h-[75vh] object-cover rounded-2xl"
              loading="lazy"
              decoding="async"
            />
          </div>

          {/* Column 2 â€” two stacked images */}
          <div className="flex flex-col gap-2 md:gap-3 w-[19%] shrink-0 h-[75vh] md:h-[88vh]">
            <img
              src="/uploads/gallery/Footer/web/_NM_1700.jpg"
              alt="Worship at Kingsborough Church"
              className="w-full h-[45%] object-cover rounded-2xl"
              loading="lazy"
              decoding="async"
            />
            <img
              src="/uploads/gallery/Footer/web/_NM_1701.jpg"
              alt="Ministry at Kingsborough Church"
              className="w-full h-[55%] object-cover rounded-2xl"
              loading="lazy"
              decoding="async"
            />
          </div>

          {/* Center column â€” the image we zoom into */}
          <div className="w-[34%] shrink-0">
            <img
              src="/uploads/gallery/Footer/web/_NM_1752.jpg"
              alt="Congregation at Kingsborough Church"
              className="w-full h-[80vh] md:h-[92vh] object-cover rounded-2xl"
              loading="lazy"
              decoding="async"
            />
          </div>

          {/* Column 4 â€” two stacked images, top one dimmed */}
          <div className="flex flex-col gap-2 md:gap-3 w-[19%] shrink-0 h-[75vh] md:h-[88vh]">
            <img
              src="/uploads/gallery/Footer/web/_NM_1739.jpg"
              alt="Kingsborough Church event"
              className="w-full h-[45%] object-cover rounded-2xl opacity-50"
              loading="lazy"
              decoding="async"
            />
            <img
              src="/uploads/gallery/Footer/web/_NM_1725.jpg"
              alt="Community at Kingsborough Church"
              className="w-full h-[55%] object-cover rounded-2xl"
              loading="lazy"
              decoding="async"
            />
          </div>

          {/* Column 5 â€” bleeds off the right edge */}
          <div className="w-[16%] shrink-0">
            <img
              src="/uploads/gallery/Footer/web/_NM_1745.jpg"
              alt="Kingsborough Church gathering"
              className="w-full h-[60vh] md:h-[75vh] object-cover rounded-2xl"
              loading="lazy"
              decoding="async"
            />
          </div>
        </motion.div>

        {/* Dark overlay revealed as the center image fills the screen */}
        <motion.div
          style={{ opacity: overlayOpacity }}
          className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none"
        />

        {/* Caption + CTA that appear once the image has become a full-bleed banner */}
        <motion.div
          style={{ opacity: textOpacity, y: textY }}
          className="absolute inset-x-0 bottom-0 p-8 md:p-16"
        >
          <p className="text-white font-montserrat font-bold text-2xl md:text-4xl max-w-2xl mb-6">
            A community worth being part of.
          </p>
          <Link
            href="/gallery"
            className="inline-block border-2 border-white text-white px-6 py-2.5 rounded-full hover:bg-white hover:text-deepPurple transition-colors font-montserrat font-medium text-sm"
          >
            View Full Gallery
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default LifeCollage;
