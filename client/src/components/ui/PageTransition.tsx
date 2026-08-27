import { useEffect, useLayoutEffect, useRef, ReactNode } from 'react';
import { gsap } from 'gsap';
import { useLocation } from 'wouter';

interface PageTransitionProps {
  children: ReactNode;
}

const PageTransition = ({ children }: PageTransitionProps) => {
  const [location] = useLocation();
  const pageRef = useRef<HTMLDivElement>(null);
  const prevLocationRef = useRef<string>(location);

  useLayoutEffect(() => {
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
      
      // Reset scroll before the next paint so the new page opens at the top
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
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