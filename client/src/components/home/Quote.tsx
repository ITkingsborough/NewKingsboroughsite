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

    // Create text reveal animation using character-by-character approach
    const quoteText = quoteRef.current.textContent || '';
    
    // Clear the quote text temporarily
    quoteRef.current.textContent = '';
    
    // Create individual spans for each character
    const chars = Array.from(quoteText).map(char => {
      const span = document.createElement('span');
      span.textContent = char;
      span.style.opacity = '0';
      span.style.display = 'inline-block';
      quoteRef.current?.appendChild(span);
      return span;
    });
    
    // Animate each character with a stagger effect
    tl.to(chars, {
      opacity: 1,
      stagger: 0.03, // Time between each character animation
      duration: 0.1,
      ease: 'power2.out',
    })
    .fromTo(
      sourceRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
      '-=0.2' // Start slightly before the quote finishes
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
      className="h-96 flex items-center justify-center"
    >
      <div className="container mx-auto px-4 lg:px-8 text-center">
        <div 
          ref={containerRef}
          className="max-w-3xl mx-auto"
        >
          <blockquote 
            ref={quoteRef}
            className="font-playfair text-2xl md:text-4xl text-white italic mb-6 text-shadow"
          >
            "For where two or three gather in my name, there am I with them."
          </blockquote>
          <p 
            ref={sourceRef}
            className="text-white text-lg font-montserrat opacity-0"
          >
            Matthew 18:20
          </p>
        </div>
      </div>
    </ParallaxSection>
  );
};

export default Quote;
