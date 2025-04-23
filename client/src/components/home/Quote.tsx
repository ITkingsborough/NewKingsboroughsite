import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import ParallaxSection from '@/components/ui/ParallaxSection';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const Quote = () => {
  const quoteRef = useRef<HTMLQuoteElement>(null);
  const sourceRef = useRef<HTMLParagraphElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!quoteRef.current || !sourceRef.current || !containerRef.current) return;

    // Create the animation timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 70%',
        end: 'bottom 20%',
        toggleActions: 'play none none none'
      }
    });
    
    // Simple fade-in animation for the entire quote
    tl.fromTo(
      quoteRef.current,
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.8, ease: 'power2.out' }
    )
    .fromTo(
      sourceRef.current,
      { opacity: 0, x: 20 },
      { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' },
      '-=0.3' // Start slightly before the quote finishes
    );

    // Clean up
    return () => {
      if (tl.scrollTrigger) {
        tl.scrollTrigger.kill();
      }
    };
  }, []);

  return (
    <ParallaxSection 
      backgroundUrl="https://images.unsplash.com/photo-1455044372794-d981761b5bc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
      overlayClass="overlay-gold"
      speed={1.0}
      className="h-64 flex items-center justify-center"
    >
      <div className="container mx-auto flex items-center justify-center">
        <div 
          ref={containerRef}
          className="text-center w-full max-w-4xl mx-auto px-4"
        >
          <div className="flex flex-col md:flex-row items-center justify-center md:space-x-4">
            <blockquote 
              ref={quoteRef}
              className="font-playfair text-xl md:text-3xl text-white italic text-shadow mb-2 md:mb-0"
            >
              "For where two or three gather in my name, there am I with them."
            </blockquote>
            <p 
              ref={sourceRef}
              className="text-white text-lg md:text-xl font-montserrat opacity-0 whitespace-nowrap shrink-0"
            >
              - Matthew 18:20
            </p>
          </div>
        </div>
      </div>
    </ParallaxSection>
  );
};

export default Quote;
