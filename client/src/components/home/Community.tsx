import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

interface CommunityCardProps {
  title: string;
  image: string;
  description: string;
  link: string;
}

const communityCards: CommunityCardProps[] = [
  {
    title: "Hillingdon Foodbank",
    image: "https://images.unsplash.com/photo-1593113630400-ea4288922497?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    description: "Supporting those in need with essential food and supplies in the Hillingdon community.",
    link: "/ministries"
  },
  {
    title: "CMC Nursery",
    image: "https://images.unsplash.com/photo-1542037104857-ffbb0b9155fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    description: "Providing nurturing childcare and early education in a Christ-centered environment.",
    link: "/ministries"
  },
  {
    title: "Hadassah",
    image: "https://images.unsplash.com/photo-1505455184862-554165e5f6ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    description: "A women's ministry empowering and supporting ladies through faith and fellowship.",
    link: "/ministries"
  },
  {
    title: "Kingsmen",
    image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    description: "Men's fellowship focusing on faith, leadership and authentic Christian masculinity.",
    link: "/ministries"
  },
  {
    title: "The Crown",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    description: "Youth ministry helping young people navigate life's challenges through faith and community.",
    link: "/ministries"
  }
];

const Community = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  // Calculate total number of pages (showing 2 items per page)
  const totalPages = Math.ceil(communityCards.length / 2);

  // Navigate to the next page
  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  // Navigate to the previous page
  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  // Get current page items (2 per page)
  const getCurrentPageItems = () => {
    const startIndex = currentPage * 2;
    return communityCards.slice(startIndex, startIndex + 2);
  };

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
      className="py-20 bg-slate-50 overflow-hidden"
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-14">
          <h2 
            ref={headingRef}
            className="text-3xl md:text-4xl font-montserrat font-bold mb-4 text-deepPurple"
          >
            Find Your Community
          </h2>
          <p 
            ref={textRef}
            className="text-lg max-w-2xl mx-auto text-darkGray"
          >
            At Kingsborough Church, we believe that life is better when we do it together. 
            Browse our community groups and find the perfect place to belong.
          </p>
        </div>

        <div 
          ref={carouselRef}
          className="relative"
        >
          {/* Navigation Arrows */}
          <button 
            onClick={prevPage}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/80 hover:bg-gold/90 shadow-lg text-deepPurple hover:text-white transition-colors -ml-4 lg:-ml-6"
            aria-label="Previous communities"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button 
            onClick={nextPage}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/80 hover:bg-gold/90 shadow-lg text-deepPurple hover:text-white transition-colors -mr-4 lg:-mr-6"
            aria-label="Next communities"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Carousel Content */}
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentPage}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="px-8 py-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {getCurrentPageItems().map((card, index) => (
                  <Link href={card.link} key={index} className="block">
                    <div className="group cursor-pointer transition-all duration-300 transform hover:translate-y-[-10px]">
                      <div className="relative overflow-hidden rounded-lg shadow-lg">
                        {/* Image container with overlay */}
                        <div className="h-64 md:h-80 overflow-hidden">
                          {/* Background image */}
                          <img 
                            src={card.image} 
                            alt={card.title}
                            className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                          />
                          
                          {/* Overlay gradient */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300"></div>
                        </div>
                        
                        {/* Description on hover */}
                        <div className="absolute inset-0 flex items-center justify-center px-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <p className="text-gold text-center text-sm md:text-base font-medium max-w-xs bg-black/70 p-3 rounded-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                            {card.description}
                          </p>
                        </div>
                        
                        {/* Title at the bottom */}
                        <div className="absolute bottom-0 left-0 right-0 px-6 py-4 text-center">
                          <h3 className="text-xl md:text-2xl font-montserrat font-bold text-white group-hover:text-gold transition-colors duration-300">
                            {card.title}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Carousel indicators */}
          <div className="flex justify-center mt-10 space-x-2">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${idx === currentPage ? 'bg-gold w-8' : 'bg-gray-300 hover:bg-gold/50'}`}
                aria-label={`Go to page ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Community;