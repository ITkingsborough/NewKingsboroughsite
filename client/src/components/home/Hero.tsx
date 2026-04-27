import { useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { gsap } from 'gsap';
import heroVideo from '@assets/Background_video_1768994478570.mp4';

const Hero = () => {
  const headingText = 'Welcome to Kingsborough Church';
  const splitChars = headingText.split('');
  const contentRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
    const chars = headingRef.current?.querySelectorAll('.hero-char') || [];

    gsap.set(chars, { yPercent: 120, opacity: 0, rotateX: -50, transformOrigin: '50% 100%' });

    tl.to(chars, {
      yPercent: 0,
      opacity: 1,
      rotateX: 0,
      duration: 0.9,
      stagger: 0.03,
      ease: 'back.out(1.7)',
    }, 0.15)
    .fromTo(
      paragraphRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 },
      0.85
    )
    .fromTo(
      buttonsRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 },
      1.05
    );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section id="home" data-nav-theme="dark" className="relative h-screen flex items-center justify-center overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={heroVideo} type="video/mp4" />
      </video>
      
      <div className="absolute inset-0 bg-black/30"></div>
      
      <div className="relative z-10 container mx-auto px-4 lg:px-8">
        <div 
          ref={contentRef}
          className="w-full mx-auto text-center"
        >
          <h1 
            ref={headingRef}
            aria-label={headingText}
            className="w-full text-center text-[clamp(1.8rem,5vw,4.2rem)] font-montserrat font-bold text-white mb-4 tracking-tight text-shadow whitespace-nowrap"
          >
            <span className="sr-only">{headingText}</span>
            <span aria-hidden="true">
              {splitChars.map((char, index) => (
                <span
                  key={`${char}-${index}`}
                  className="hero-char inline-block"
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </span>
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
            <Link href="/about" className="px-8 py-3 bg-gold text-white font-montserrat font-semibold rounded-full hover:bg-gold/90 transition-colors">
              Learn More
            </Link>
            <Link href="/events" className="px-8 py-3 border-2 border-white text-white font-montserrat font-semibold rounded-full hover:bg-white hover:text-deepPurple transition-colors">
              Join Us This Week
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
