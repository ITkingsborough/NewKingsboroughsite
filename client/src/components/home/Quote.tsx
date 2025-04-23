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

    // Create text reveal animation using word-by-word approach instead of character-by-character
    const quoteText = quoteRef.current.textContent || '';
    
    // Clear the quote text temporarily
    quoteRef.current.textContent = '';
    
    // Split into words and create spans for each word
    const words = quoteText.split(' ').filter(word => word.length > 0);
    const wordSpans = words.map((word, index) => {
      const span = document.createElement('span');
      span.textContent = word;
      span.style.opacity = '0';
      span.style.display = 'inline-block';
      
      // Add the word to the quote
      quoteRef.current?.appendChild(span);
      
      // Add a space after each word except the last one
      if (index < words.length - 1) {
        const space = document.createTextNode(' ');
        quoteRef.current?.appendChild(space);
      }
      
      return span;
    });
    
    // Animate each word with a stagger effect
    tl.to(wordSpans, {
      opacity: 1,
      stagger: 0.15, // Time between each word animation
      duration: 0.2,
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
      className="h-[500px] flex items-center justify-center"
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          ref={containerRef}
          className="w-full max-w-3xl px-6"
        >
          <div className="text-center">
            <blockquote 
              ref={quoteRef}
              className="font-playfair text-3xl md:text-5xl text-white italic mb-8 text-shadow leading-relaxed mx-auto"
            >
              "For where two or three gather in my name, there am I with them."
            </blockquote>
            <p 
              ref={sourceRef}
              className="text-white text-xl font-montserrat opacity-0"
            >
              Matthew 18:20
            </p>
          </div>
        </div>
      </div>
    </ParallaxSection>
  );
};

export default Quote;
