import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Sermons from './Sermons';
import Magazines from './Magazines';
import Giving from './Giving';
import Contact from './Contact';

gsap.registerPlugin(ScrollTrigger);

const HorizontalScrollSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !wrapperRef.current) return;

    const sections = wrapperRef.current.children;
    const totalWidth = wrapperRef.current.scrollWidth - window.innerWidth;

    const ctx = gsap.context(() => {
      gsap.to(wrapperRef.current, {
        x: -totalWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: () => `+=${totalWidth}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div ref={containerRef} className="overflow-hidden">
      <div 
        ref={wrapperRef} 
        className="flex"
        style={{ width: 'fit-content' }}
      >
        <div className="w-screen flex-shrink-0">
          <Sermons />
        </div>
        <div className="w-screen flex-shrink-0">
          <Magazines />
        </div>
        <div className="w-screen flex-shrink-0">
          <Giving />
        </div>
        <div className="w-screen flex-shrink-0">
          <Contact />
        </div>
      </div>
    </div>
  );
};

export default HorizontalScrollSection;
