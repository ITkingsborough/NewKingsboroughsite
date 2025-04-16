import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { magazines } from '@/lib/data';
import { slideUp, slideRight } from '@/lib/animations';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/all';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const Magazines = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const magazineRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    // Heading and text animations
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        toggleActions: "play none none none"
      }
    });

    tl.fromTo(
      headingRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
    ).fromTo(
      textRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
      "-=0.5"
    );

    // Clean up ScrollTrigger instances
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-24 bg-white"
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 
            ref={headingRef}
            className="text-3xl md:text-4xl font-montserrat font-bold mb-4 text-deepPurple"
          >
            Monthly Magazines
          </h2>
          <p 
            ref={textRef}
            className="text-lg max-w-2xl mx-auto text-darkGray"
          >
            Explore our monthly publications filled with inspiring articles, testimonies, and spiritual insights from our leadership.
          </p>
        </div>

        <div className="space-y-16">
          {magazines.map((magazine, index) => (
            <motion.div 
              key={magazine.id}
              ref={el => magazineRefs.current[index] = el}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={index % 2 === 0 ? slideRight() : slideRight(0.3)}
              className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-8 lg:gap-16`}
            >
              <div className="w-full lg:w-1/2">
                <div className="relative group">
                  <div className="absolute inset-0 bg-deepPurple rounded-lg transform translate-x-3 translate-y-3 group-hover:translate-x-5 group-hover:translate-y-5 transition-transform duration-300"></div>
                  <img 
                    src={magazine.coverImage}
                    alt={`${magazine.title} Magazine Cover`}
                    className="relative w-full h-auto rounded-lg shadow-xl z-10 transform group-hover:scale-105 transition-all duration-300"
                  />
                  <div className="absolute top-4 right-4 bg-gold text-white text-sm font-semibold py-1 px-3 rounded-full z-20">
                    {magazine.date}
                  </div>
                </div>
              </div>
              
              <div className="w-full lg:w-1/2">
                <h3 className="text-2xl md:text-3xl font-montserrat font-bold mb-4 text-deepPurple">
                  {magazine.title}
                </h3>
                <p className="text-darkGray mb-8 text-lg leading-relaxed">
                  {magazine.summary}
                </p>
                <Link href={magazine.pdfUrl} className="inline-flex items-center justify-center bg-gold hover:bg-deepPurple text-white font-medium py-3 px-8 rounded-lg transition-colors duration-300 transform hover:scale-105">
                  Read Now
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Magazines;