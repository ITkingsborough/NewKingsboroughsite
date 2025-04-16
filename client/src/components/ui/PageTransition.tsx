import { useEffect, useRef, ReactNode } from 'react';
import { gsap } from 'gsap';
import { useLocation } from 'wouter';

interface PageTransitionProps {
  children: ReactNode;
}

const PageTransition = ({ children }: PageTransitionProps) => {
  const [location] = useLocation();
  const pageRef = useRef<HTMLDivElement>(null);
  const prevLocationRef = useRef<string>(location);

  useEffect(() => {
    // Only run transition animation if location has changed
    if (prevLocationRef.current !== location && pageRef.current) {
      // Save current location
      prevLocationRef.current = location;
      
      // Timeline for the transition
      const timeline = gsap.timeline();
      
      // Fade out
      timeline.to(pageRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.3,
        ease: 'power2.out'
      });
      
      // Fade in
      timeline.to(pageRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power2.out'
      });
      
      // Scroll to top on page change
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location]);

  // Initial animation on mount
  useEffect(() => {
    if (pageRef.current) {
      gsap.fromTo(
        pageRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      );
    }
  }, []);

  return (
    <div ref={pageRef} className="page-transition">
      {children}
    </div>
  );
};

export default PageTransition;