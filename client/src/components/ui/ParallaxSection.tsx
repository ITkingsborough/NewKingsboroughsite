import { useEffect, useRef, ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/all';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

interface ParallaxSectionProps {
  children: ReactNode;
  backgroundUrl: string;
  overlayClass?: string;
  speed?: number;
  className?: string;
  id?: string;
}

const ParallaxSection = ({
  children,
  backgroundUrl,
  overlayClass = 'overlay-purple',
  speed = 0.2,
  className = '',
  id
}: ParallaxSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !backgroundRef.current) return;

    // Create parallax effect for background image
    const parallaxTl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.5, // More responsive parallax effect
        markers: false, // Set to true for debugging
        invalidateOnRefresh: true // Handle resize events properly
      }
    });

    // Move background slower than scroll speed to create parallax
    parallaxTl.fromTo(backgroundRef.current, 
      { y: `-${15 * speed}%` }, 
      { 
        y: `${50 * speed}%`, 
        ease: 'none',
        immediateRender: false
      }
    );
    
    // Debug info - uncomment to see what's happening with the animation
    // console.log(`Parallax effect from ${-15 * speed}% to ${50 * speed}% with speed ${speed}`);

    // Cleanup
    return () => {
      if (parallaxTl.scrollTrigger) {
        parallaxTl.scrollTrigger.kill();
      }
    };
  }, [speed]);

  return (
    <div 
      ref={sectionRef}
      id={id}
      className={`relative overflow-hidden ${className}`}
    >
      {/* Background with parallax effect */}
      <div 
        ref={backgroundRef}
        className="absolute inset-0 bg-center bg-no-repeat bg-cover"
        style={{ 
          backgroundImage: `url('${backgroundUrl}')`, 
          transform: 'translateY(0)', 
          height: '120%',  // Extra height to ensure no gaps during parallax
          top: '-10%'      // Offset to center the background
        }}
      />
      
      {/* Optional overlay */}
      {overlayClass && <div className={`absolute inset-0 ${overlayClass}`} />}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default ParallaxSection;