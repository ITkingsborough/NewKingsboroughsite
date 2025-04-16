import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/all';

// Register the ScrollToPlugin with GSAP
gsap.registerPlugin(ScrollToPlugin);

/**
 * A hook that provides smooth scrolling functionality using GSAP.
 */
export function useSmoothScroll() {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Function to handle anchor link clicks for smooth scrolling
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      
      if (!anchor) return;
      
      const href = anchor.getAttribute('href');
      
      // Only handle anchor links that start with "#"
      if (href && href.startsWith('#')) {
        e.preventDefault();
        
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          // Use GSAP to animate scroll
          gsap.to(window, {
            duration: 1, // Animation duration in seconds
            scrollTo: {
              y: targetElement,
              offsetY: 80 // Offset to account for fixed header
            },
            ease: 'power2.out' // Smooth easing function
          });
        }
      }
    };

    // Add event listener for anchor clicks
    document.addEventListener('click', handleAnchorClick);
    
    // Clean up event listener on component unmount
    return () => {
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  return scrollRef;
}

/**
 * A function to programmatically scroll to an element with animation
 * @param elementId - The ID of the element to scroll to
 * @param duration - Animation duration in seconds (default: 1)
 * @param offset - Offset from the top in pixels (default: 80)
 */
export function scrollToElement(elementId: string, duration = 1, offset = 80) {
  const targetElement = document.getElementById(elementId);
  
  if (targetElement) {
    gsap.to(window, {
      duration,
      scrollTo: {
        y: targetElement,
        offsetY: offset
      },
      ease: 'power2.out'
    });
  }
}