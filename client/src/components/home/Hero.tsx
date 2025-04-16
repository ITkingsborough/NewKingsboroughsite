import { useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { gsap } from 'gsap';
import ParallaxSection from '@/components/ui/ParallaxSection';
import { scrollToElement } from '@/hooks/use-smooth-scroll';

const Hero = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const scrollIconRef = useRef<HTMLDivElement>(null);

  // Set up GSAP animations for the hero content
  useEffect(() => {
    if (!contentRef.current) return;

    // Create a timeline for entrance animations
    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

    // Animate elements sequentially
    tl.fromTo(
      headingRef.current,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 },
      0.2
    )
    .fromTo(
      paragraphRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 },
      0.5
    )
    .fromTo(
      buttonsRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 },
      0.8
    )
    .fromTo(
      scrollIconRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1 },
      1.2
    );

    // Create the bouncing animation for the scroll icon
    gsap.to(scrollIconRef.current, {
      y: 10,
      duration: 0.8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    // Cleanup
    return () => {
      tl.kill();
    };
  }, []);

  // Handle scroll down button click
  const handleScrollDown = () => {
    scrollToElement('welcome', 1.2, 80);
  };

  return (
    <ParallaxSection 
      id="home" 
      backgroundUrl="https://images.unsplash.com/photo-1529070538774-1843cb3265df?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
      overlayClass="overlay-purple"
      speed={0.8}
      className="h-screen flex items-center"
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div 
          ref={contentRef}
          className="mx-auto text-center max-w-4xl"
        >
          <h1 
            ref={headingRef}
            className="text-5xl md:text-7xl lg:text-8xl font-montserrat font-bold text-white mb-6 tracking-tight text-shadow opacity-0 whitespace-nowrap"
          >
            Welcome to Kingsborough Church
          </h1>
          
          <p 
            ref={paragraphRef}
            className="text-2xl md:text-3xl lg:text-4xl text-white opacity-0 mb-10 font-light"
          >
            A place to belong, believe, and become.
          </p>
          
          <div 
            ref={buttonsRef}
            className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 opacity-0"
          >
            <Link href="/about" className="btn-primary text-xl px-8 py-4">
              Learn More
            </Link>
            <Link href="/events" className="btn-outline text-xl px-8 py-4">
              Join Us This Week
            </Link>
          </div>
        </div>
      </div>
      
      <div 
        ref={scrollIconRef}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white cursor-pointer opacity-0"
        onClick={handleScrollDown}
      >
        <i className="fas fa-chevron-down"></i>
      </div>
    </ParallaxSection>
  );
};

export default Hero;
