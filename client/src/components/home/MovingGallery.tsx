import { motion } from 'framer-motion';

const g = '/uploads/gallery';
const ord = `${g}/Kingsborough Ordination`;

const topRow = [
  `${g}/Moyo and Van.JPG`,
  `${ord}/03_K3A0462.jpg`,
  `${g}/WhatsApp Image 2026-02-04 at 10.21.23.jpeg`,
  `${g}/Apst Preaching.JPG`,
  `${g}/About US pics/IMG_9633.jpg`,
  `${g}/New Audi (1).jpeg`,
  `${ord}/10_K3A0167.jpg`,
  `${g}/Ss/IMG_1465.jpg`,
];

const bottomRow = [
  `${g}/Kingsmen.png`,
  `${g}/WhatsApp Image 2026-02-04 at 10.21.27.jpeg`,
  `${ord}/13_K3A0056.jpg`,
  `${g}/Equip.jpg`,
  `${g}/About US pics/IMG_0215.jpg`,
  `${g}/New Audi (2).jpeg`,
  `${g}/Deploy.JPG`,
  `${ord}/18_K3A0034.jpg`,
];

const MarqueeRow = ({ images, reverse = false }: { images: string[]; reverse?: boolean }) => (
  <div className="overflow-hidden">
    {/* Track holds two copies so -50% is a seamless loop */}
    <motion.div
      className="flex w-max gap-3 md:gap-4"
      animate={{ x: reverse ? ['-50%', '0%'] : ['0%', '-50%'] }}
      transition={{ duration: 60, ease: 'linear', repeat: Infinity }}
    >
      {[...images, ...images].map((src, i) => (
        <img
          key={i}
          src={src}
          alt=""
          aria-hidden={i >= images.length}
          className="h-48 w-72 shrink-0 rounded-xl object-cover shadow-md md:h-64 md:w-96"
          loading="lazy"
        />
      ))}
    </motion.div>
  </div>
);

const MovingGallery = () => (
  <section className="overflow-hidden bg-[#F7F5F0] py-16 md:py-24">
    <div className="space-y-3 md:space-y-4">
      <MarqueeRow images={topRow} />
      <MarqueeRow images={bottomRow} reverse />
    </div>
  </section>
);

export default MovingGallery;
