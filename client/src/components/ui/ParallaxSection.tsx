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
        scrub: true
      }
    });

    // Move background slower than scroll speed to create parallax
    parallaxTl.to(backgroundRef.current, {
      y: `${30 * speed}%`,
      ease: 'none'
    });

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
        style={{ backgroundImage: `url('${backgroundUrl}')`, transform: 'translateY(0)' }}
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