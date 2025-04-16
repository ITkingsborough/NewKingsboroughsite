import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import { slideUp } from '@/lib/animations';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { useQuery } from '@tanstack/react-query';
import { MagazineItem } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { magazines as staticMagazines } from '@/lib/data'; // fallback data

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const Magazines = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const magazineRef = useRef<HTMLDivElement>(null);

  // Fetch magazines from API with featured magazines first
  const { data: magazinesData, isLoading, error } = useQuery<{ success: boolean; data: MagazineItem[] }>({
    queryKey: ['/api/magazines/featured'],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Use fetched data or fallback to static data, ensuring the most recent one is first
  const magazines = magazinesData?.data?.length 
    ? magazinesData.data 
    : staticMagazines;

  // Navigate to the next magazine
  const nextMagazine = () => {
    setCurrentIndex((prev) => (prev + 1) % magazines.length);
  };

  // Navigate to the previous magazine
  const prevMagazine = () => {
    setCurrentIndex((prev) => (prev - 1 + magazines.length) % magazines.length);
  };

  // Get the current magazine
  const currentMagazine = magazines[currentIndex];

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
      className="py-24 bg-white overflow-hidden"
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-14">
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

        <div ref={carouselRef} className="relative">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-12 w-12 animate-spin text-gold mb-4" />
              <p className="text-darkGray">Loading magazines...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="rounded-full bg-red-100 p-3 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-deepPurple mb-2">Unable to load magazines</h3>
              <p className="text-darkGray">Please try again later or contact our church office.</p>
            </div>
          ) : magazines.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="rounded-full bg-blue-100 p-3 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-deepPurple mb-2">No magazines available</h3>
              <p className="text-darkGray">Check back soon for our upcoming publications!</p>
            </div>
          ) : (
            <>
              {/* Navigation Arrows */}
              <button 
                onClick={prevMagazine}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/80 hover:bg-gold/90 shadow-lg text-deepPurple hover:text-white transition-colors -ml-4 lg:-ml-6"
                aria-label="Previous magazine"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button 
                onClick={nextMagazine}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/80 hover:bg-gold/90 shadow-lg text-deepPurple hover:text-white transition-colors -mr-4 lg:-mr-6"
                aria-label="Next magazine"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Carousel Content */}
              <AnimatePresence mode="wait">
                <motion.div 
                  key={currentIndex}
                  ref={magazineRef}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16 px-8"
                >
                  <div className="w-full lg:w-2/5">
                    <Link href={currentMagazine.pdfUrl} className="block">
                      <div className="relative group perspective-[1000px] cursor-pointer">
                        {/* A4 aspect ratio container - 1:1.414 (width:height) */}
                        <div className="aspect-[1/1.414] rounded-lg overflow-hidden transform group-hover:rotate-y-1 group-hover:rotate-z-1 transition-transform duration-500 z-10 max-w-sm mx-auto">
                          {/* Spine effect */}
                          <div className="absolute left-0 top-0 h-full w-3 bg-gray-700 z-20"></div>
                          
                          {/* Page effect */}
                          <div className="absolute right-0 h-full w-[3px] bg-gradient-to-l from-gray-300 to-transparent z-20"></div>
                          
                          {/* Cover shadow effect */}
                          <div className="absolute inset-0 bg-deepPurple rounded-lg transform translate-x-3 translate-y-3 group-hover:translate-x-5 group-hover:translate-y-5 transition-transform duration-300"></div>
                          
                          {/* Magazine cover with proper A4 aspect ratio */}
                          <img 
                            src={currentMagazine.coverImage}
                            alt={`${currentMagazine.title} Magazine Cover`}
                            className="relative w-full h-full object-cover rounded-lg shadow-xl z-10 transform group-hover:scale-105 transition-all duration-500"
                          />
                          
                          {/* Realistic magazine cover effect with gloss and texture */}
                          <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/20 mix-blend-overlay rounded-lg z-10"></div>
                          
                          {/* Date badge */}
                          <div className="absolute top-4 right-4 bg-gold text-white text-sm font-semibold py-1 px-3 rounded-full z-30 shadow-md">
                            {currentMagazine.date}
                          </div>
                        </div>
                        
                        {/* Interactive hover effect hint */}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/80 text-deepPurple text-xs px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30 shadow-md">
                          Click to read
                        </div>
                      </div>
                    </Link>
                  </div>
                  
                  <div className="w-full lg:w-1/2">
                    <h3 className="text-2xl md:text-3xl font-montserrat font-bold mb-4 text-deepPurple">
                      {currentMagazine.title}
                    </h3>
                    <p className="text-darkGray mb-8 text-lg leading-relaxed">
                      {currentMagazine.summary}
                    </p>
                    <Link href={currentMagazine.pdfUrl} className="inline-flex items-center justify-center bg-gold hover:bg-deepPurple text-white font-medium py-3 px-8 rounded-lg transition-colors duration-300 transform hover:scale-105">
                      Read Now
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Carousel indicators */}
              <div className="flex justify-center mt-12 space-x-2">
                {magazines.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-gold w-8' : 'bg-gray-300 hover:bg-gold/50'}`}
                    aria-label={`Go to magazine ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Magazines;