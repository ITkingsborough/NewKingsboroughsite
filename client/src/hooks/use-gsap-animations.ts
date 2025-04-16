import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

/**
 * Hook for creating scroll-based animations using GSAP and ScrollTrigger
 */
export function useGsapAnimations() {
  const animationRef = useRef<{ scrollTriggers: ScrollTrigger[] }>({
    scrollTriggers: []
  });

  /**
   * Creates a scroll-triggered animation for an element
   * @param element - The element to animate
   * @param animation - GSAP animation properties
   * @param trigger - ScrollTrigger configuration
   */
  const createScrollAnimation = (
    element: string | Element,
    animation: gsap.TweenVars,
    trigger: ScrollTrigger.Vars
  ) => {
    // Default ScrollTrigger settings
    const defaultTrigger = {
      trigger: element,
      start: 'top 80%',
      end: 'bottom 20%',
      toggleActions: 'play none none reverse',
      ...trigger
    };

    // Create the animation with ScrollTrigger
    const tween = gsap.to(element, {
      ...animation,
      scrollTrigger: defaultTrigger
    });

    // Store the ScrollTrigger instance for cleanup
    if (tween.scrollTrigger) {
      animationRef.current.scrollTriggers.push(tween.scrollTrigger);
    }

    return tween;
  };

  /**
   * Creates a parallax scrolling effect for an element
   * @param element - The element to apply parallax effect to
   * @param speed - Parallax speed multiplier (default: 0.5)
   * @param direction - Direction of parallax effect (default: 'vertical')
   */
  const createParallaxEffect = (
    element: string | Element,
    speed: number = 0.5,
    direction: 'vertical' | 'horizontal' = 'vertical'
  ) => {
    const prop = direction === 'vertical' ? 'y' : 'x';
    const movement = 100 * speed; // Amount of movement in pixels
    
    return createScrollAnimation(
      element,
      { [prop]: movement, ease: 'none' },
      {
        scrub: true,
        start: 'top bottom',
        end: 'bottom top'
      }
    );
  };

  /**
   * Creates a reveal animation for an element when it comes into view
   * @param element - The element to reveal
   * @param direction - Direction from which to reveal (default: 'bottom')
   * @param distance - Distance to travel during reveal, in pixels (default: 50)
   * @param duration - Animation duration in seconds (default: 0.8)
   */
  const createRevealAnimation = (
    element: string | Element,
    direction: 'left' | 'right' | 'top' | 'bottom' = 'bottom',
    distance: number = 50,
    duration: number = 0.8
  ) => {
    // Set initial position based on direction
    let fromVars: gsap.TweenVars = { opacity: 0 };
    
    switch (direction) {
      case 'left':
        fromVars.x = -distance;
        break;
      case 'right':
        fromVars.x = distance;
        break;
      case 'top':
        fromVars.y = -distance;
        break;
      case 'bottom':
        fromVars.y = distance;
        break;
    }
    
    // Set initial state
    gsap.set(element, fromVars);
    
    // Create reveal animation
    return createScrollAnimation(
      element,
      { 
        opacity: 1, 
        x: 0, 
        y: 0, 
        duration, 
        ease: 'power2.out' 
      },
      {
        once: true,
        toggleActions: 'play none none none'
      }
    );
  };

  /**
   * Clean up all ScrollTrigger instances on component unmount
   */
  useEffect(() => {
    return () => {
      // Kill all ScrollTrigger instances to prevent memory leaks
      animationRef.current.scrollTriggers.forEach((trigger) => {
        trigger.kill();
      });
    };
  }, []);

  return {
    createScrollAnimation,
    createParallaxEffect,
    createRevealAnimation
  };
}