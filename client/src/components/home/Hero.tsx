import { useEffect, useRef, useState } from 'react';
import { Link } from 'wouter';
import { gsap } from 'gsap';
import heroVideo from '@assets/Background_video_1768994478570.mp4';

const CYCLING_WORDS = ['belong', 'believe', 'become'];

const Hero = () => {
  const headingText = 'Welcome to Kingsborough Church';
  // Split into words so each word pushes up as a unit
  const splitWords = headingText.split(' ');
  const contentRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const cyclingWordRef = useRef<HTMLSpanElement>(null);
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    if (!contentRef.current) return;

    const words = headingRef.current?.querySelectorAll('.hero-word') || [];

    // Start each word below its clip boundary
    gsap.set(words, { yPercent: 110, opacity: 0 });

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.to(words, {
      yPercent: 0,
      opacity: 1,
      duration: 0.75,
      stagger: 0.1,
      ease: 'power3.out',
    }, 0.1)
    .fromTo(
      paragraphRef.current,
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7 },
      0.6
    )
    .fromTo(
      buttonsRef.current,
      { y: 18, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7 },
      0.8
    );

    return () => { tl.kill(); };
  }, []);

  // Cycle the word every 2s after initial animation
  useEffect(() => {
    const interval = setInterval(() => {
      const el = cyclingWordRef.current;
      if (!el) return;
      gsap.to(el, {
        yPercent: -110,
        opacity: 0,
        duration: 0.35,
        ease: 'power2.in',
        onComplete: () => {
          setWordIndex(prev => (prev + 1) % CYCLING_WORDS.length);
          gsap.fromTo(el,
            { yPercent: 110, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: 0.4, ease: 'power3.out' }
          );
        },
      });
    }, 2000);
    return () => clearInterval(interval);
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
            className="w-full text-center text-[clamp(2.2rem,6.5vw,5.5rem)] font-montserrat font-bold text-white mb-4 tracking-[0.06em] text-shadow mt-24"
          >
            <span className="sr-only">{headingText}</span>
            <span aria-hidden="true" className="inline-flex flex-wrap justify-center gap-x-[0.28em]">
              {splitWords.map((word, index) => (
                <span key={index} className="overflow-hidden inline-block leading-tight">
                  <span className="hero-word inline-block">
                    {word}
                  </span>
                </span>
              ))}
            </span>
          </h1>
          
          <p 
            ref={paragraphRef}
            className="text-xl md:text-2xl text-white opacity-0 mb-6 font-light inline-flex flex-wrap items-baseline justify-center gap-x-[0.3em]"
          >
            <span>A place to</span>
            <span className="overflow-hidden inline-block leading-none" style={{ verticalAlign: 'baseline' }}>
              <span ref={cyclingWordRef} className="inline-block text-gold font-semibold">
                {CYCLING_WORDS[wordIndex]}
              </span>
            </span>
          </p>
          
          
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
