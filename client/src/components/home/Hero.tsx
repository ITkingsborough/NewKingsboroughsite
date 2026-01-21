import { useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { gsap } from 'gsap';
import ParallaxSection from '@/components/ui/ParallaxSection';

const Hero = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

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
    );

    // Cleanup
    return () => {
      tl.kill();
    };
  }, []);

  return (
    <ParallaxSection 
      id="home" 
      backgroundUrl="https://images.unsplash.com/photo-1529070538774-1843cb3265df?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
      overlayClass="bg-black/30"
      speed={0.8}
      className="h-screen flex items-center justify-center"
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div 
          ref={contentRef}
          className="max-w-3xl mx-auto text-center"
        >
          <h1 
            ref={headingRef}
            className="text-4xl md:text-6xl font-montserrat font-bold text-white mb-4 tracking-tight text-shadow opacity-0"
          >
            Welcome to Kingsborough Church
          </h1>
          
          <p 
            ref={paragraphRef}
            className="text-xl md:text-2xl text-white opacity-0 mb-6 font-light"
          >
            A place to belong, believe, and become.
          </p>
          
          <div className="flex items-center justify-center mb-8 text-white">
            <div className="bg-gold/20 backdrop-blur-sm border border-gold/30 rounded-lg px-6 py-3 inline-flex items-center">
              <i className="fas fa-clock text-gold mr-3"></i>
              <div>
                <span className="font-semibold">Sunday Service:</span>
                <span className="ml-2">10:00 AM</span>
              </div>
            </div>
          </div>
          
          <div 
            ref={buttonsRef}
            className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 opacity-0"
          >
            <Link href="/about" className="btn-primary">
              Learn More
            </Link>
            <Link href="/events" className="btn-outline">
              Join Us This Week
            </Link>
          </div>
        </div>
      </div>
    </ParallaxSection>
  );
};

export default Hero;
