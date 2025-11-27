import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/all';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const Welcome = () => {
  // Refs for DOM elements
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const featureRefs = useRef<(HTMLDivElement | null)[]>([]);

  const features = [
    {
      icon: "fas fa-church",
      title: "Sunday Services",
      description: "Join us at 10:00 AM for worship that inspires and messages that transform."
    },
    {
      icon: "fas fa-hands-helping",
      title: "Community Groups",
      description: "Connect with others in meaningful relationships through our various small groups and ministries."
    },
    {
      icon: "fas fa-child",
      title: "Family Ministry",
      description: "We provide a safe, fun environment for children and teens to learn and grow in faith."
    }
  ];

  // Set up GSAP animations
  useEffect(() => {
    if (!sectionRef.current) return;

    // Create a timeline for animations
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none none"
      }
    });

    // Animate heading and text
    tl.fromTo(
      headingRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
    ).fromTo(
      textRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
      "-=0.5" // Overlap with previous animation
    );

    // Animate feature cards with staggered effect
    featureRefs.current.forEach((feature, index) => {
      if (!feature) return;
      
      tl.fromTo(
        feature,
        { y: 50, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.6, 
          ease: "power2.out" 
        },
        `-=${index === 0 ? 0.2 : 0.4}` // Stagger the animations
      );
    });

    // Cleanup
    return () => {
      if (tl.scrollTrigger) {
        tl.scrollTrigger.kill();
      }
    };
  }, []);

  return (
    <section ref={sectionRef} id="welcome" className="py-20 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 
            ref={headingRef} 
            className="text-3xl md:text-4xl font-montserrat font-bold mb-6 text-deepPurple opacity-0"
          >
            Your Journey Starts Here
          </h2>
          <p 
            ref={textRef} 
            className="text-lg text-darkGray leading-relaxed mb-10 opacity-0"
          >
            At Kingsborough Church, we believe in authentic community, purposeful worship, and embracing everyone exactly where they are. No matter your background or where you are on your spiritual journey, there's a place for you here.
          </p>
          
          <div 
            ref={featuresRef} 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
          >
            {features.map((feature, index) => (
              <div 
                key={index} 
                ref={el => featureRefs.current[index] = el}
                className="flex flex-col items-center opacity-0"
              >
                <div className="w-20 h-20 rounded-full bg-lilac bg-opacity-20 flex items-center justify-center mb-4">
                  <i className={`${feature.icon} text-gold text-3xl`}></i>
                </div>
                <h3 className="text-xl font-montserrat font-semibold mb-2">{feature.title}</h3>
                <p className="text-center">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Welcome;
