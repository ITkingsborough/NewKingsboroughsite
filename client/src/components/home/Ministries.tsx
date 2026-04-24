import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { slideUp } from "@/lib/animations";
import { ministries } from "@/lib/data";
import { ArrowLeft, ArrowRight } from "lucide-react";

const Ministries = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward
  const activeMinistry = ministries[currentSlide];

  useEffect(() => {
    const autoplay = setInterval(() => {
      setDirection(1);
      setCurrentSlide((prev) => (prev + 1) % ministries.length);
    }, 5000);

    return () => clearInterval(autoplay);
  }, []);

  const goNext = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % ministries.length);
  };

  const goPrevious = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + ministries.length) % ministries.length);
  };

  return (
    <section id="ministries" data-nav-theme="dark" className="py-20 bg-deepPurple overflow-hidden">
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
          <p className="text-lg max-w-3xl mx-auto text-white/90">
            Discover the various ways you can connect, grow, and serve within
            our church community.
          </p>
        </motion.div>

      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={slideUp(0.1)}
        className="relative w-full"
      >
          <div className="overflow-hidden">
          <AnimatePresence mode="popLayout" custom={direction}>
            <motion.article
              key={activeMinistry.id}
              custom={direction}
              className="grid grid-cols-1 lg:grid-cols-2 w-full"
              initial={(d: number) => ({ x: `${d * 100}%` })}
              animate={{ x: 0 }}
              exit={(d: number) => ({ x: `${d * -100}%` })}
              transition={{ duration: 0.45, ease: "easeInOut" }}
            >
              <div
                className={`relative h-[280px] lg:h-[380px] overflow-hidden ${
                  currentSlide % 2 !== 0 ? "lg:order-2" : ""
                }`}
              >
                <img
                  src={activeMinistry.image}
                  alt={activeMinistry.title}
                  className="w-full h-full object-cover object-center"
                  loading="lazy"
                />
              </div>

              <div
                className={`flex flex-col justify-center p-6 md:p-8 lg:p-10 ${
                  currentSlide % 2 === 0
                    ? "bg-black text-white"
                    : "bg-lilac text-deepPurple"
                }`}
              >
                <h3 className="text-3xl md:text-4xl font-montserrat font-bold uppercase leading-tight mb-4">
                  {activeMinistry.title}
                </h3>
                <p
                  className={`text-base md:text-lg max-w-xl mb-8 ${
                    currentSlide % 2 === 0 ? "text-white/80" : "text-deepPurple/80"
                  }`}
                >
                  {activeMinistry.description}
                </p>
                <Link
                  href={`/ministries?id=${activeMinistry.id}`}
                  className="inline-flex w-fit items-center gap-2 bg-gold text-deepPurple px-6 py-3 rounded-none font-montserrat font-bold uppercase tracking-wider hover:bg-gold/90 transition-colors"
                >
                  Join Us <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.article>
          </AnimatePresence>
          </div>

          <div className="absolute top-1/2 left-6 right-6 lg:left-10 lg:right-10 -translate-y-1/2 flex justify-between pointer-events-none">
            <button
              type="button"
              onClick={goPrevious}
              className="pointer-events-auto bg-black/45 text-white border border-white/30 hover:bg-black/70 transition-colors rounded-full w-10 h-10 inline-flex items-center justify-center"
              aria-label="Previous ministry"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="pointer-events-auto bg-black/45 text-white border border-white/30 hover:bg-black/70 transition-colors rounded-full w-10 h-10 inline-flex items-center justify-center"
              aria-label="Next ministry"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="flex justify-center items-center gap-2 mt-5">
            {ministries.map((ministry, index) => (
              <button
                key={ministry.id}
                type="button"
                onClick={() => {
                  setDirection(index > currentSlide ? 1 : -1);
                  setCurrentSlide(index);
                }}
                className={`h-2.5 rounded-full transition-all ${
                  index === currentSlide ? "w-8 bg-gold" : "w-2.5 bg-white/40 hover:bg-white/70"
                }`}
                aria-label={`Go to ${ministry.title}`}
              />
            ))}
          </div>
      </motion.div>

      <div className="container mx-auto px-4 lg:px-8">
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
