import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/all';

gsap.registerPlugin(ScrollTrigger);

const serviceTimes = [
  {
    day: "Sunday",
    services: [
      { name: "Express Service", time: "8:30AM - 9:30AM" },
      { name: "Celebration Service", time: "10AM - 12PM" }
    ]
  },
  {
    day: "Wednesday",
    services: [
      { name: "Bible Study", time: "7:00PM - 8:30PM" }
    ]
  },
  {
    day: "Friday",
    services: [
      { name: "Vigil Service (Every 3rd Friday of the Month) ", time: "9PM - 12AM" }
    ]
  }
];

const Welcome = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        toggleActions: "play none none none"
      }
    });

    tl.fromTo(headingRef.current, { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.9, ease: "power2.out" })
      .fromTo(textRef.current,    { x:  40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.9, ease: "power2.out" }, "-=0.7")
      .fromTo(cardsRef.current,   { y:  40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power2.out" }, "-=0.4");

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="welcome"
      data-nav-theme="light"
      className="py-20 bg-white overflow-hidden"
    >
      <div className="container mx-auto px-6 lg:px-16 max-w-6xl">

        {/* Top row: title left, blurb right */}
        <div className="flex flex-col md:flex-row md:items-start gap-10 mb-16">
          <div className="md:w-1/3 shrink-0">
            <h2
              ref={headingRef}
              className="text-5xl md:text-6xl font-montserrat font-bold leading-none tracking-tight text-deepPurple uppercase opacity-0 whitespace-nowrap"
            >
              Service Times
            </h2>
            <div className="h-1 w-16 bg-gold mt-5" />
          </div>
          <div ref={textRef} className="opacity-0 md:pt-2 md:w-2/3">
            <p className="text-darkGray text-base md:text-lg leading-relaxed">
              At Kingsborough Church, we believe in authentic community, purposeful worship, and embracing everyone exactly where they are. No matter your background or where you are on your spiritual journey, there's a place for you here. Come as you are — you are always welcome.
            </p>
          </div>
        </div>

        {/* Service time cards */}
        <div ref={cardsRef} className="grid grid-cols-3 gap-2 md:gap-6 opacity-0">
          {serviceTimes.map((item, i) => (
            <div
              key={i}
              className="min-w-0 rounded-xl border border-deepPurple/20 bg-white px-2 py-5 md:px-8 md:py-10 hover:border-gold hover:shadow-lg transition-all duration-300 group"
            >
              <h3 className="text-[0.95rem] sm:text-xl md:text-4xl font-montserrat font-bold text-deepPurple mb-2 md:mb-4 group-hover:text-gold transition-colors duration-300 break-words">
                {item.day}
              </h3>
              <div className="h-0.5 w-6 md:w-10 bg-gold mb-2 md:mb-4" />
              {item.services.map((s, j) => (
                <p key={j} className="text-darkGray text-[0.65rem] sm:text-xs md:text-base leading-snug break-words">
                  <span className="font-semibold text-deepPurple">{s.name}:</span><br />
                  {s.time}
                </p>
              ))}
            </div>
          ))}
        </div>

        <a
          href="https://www.google.com/maps/search/?api=1&query=No.+4+New+Windsor+Street,+Uxbridge,+UB8+2TU"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 flex flex-wrap items-center justify-center gap-x-2 text-center text-darkGray text-sm md:text-base hover:text-gold transition-colors duration-300 group/address"
        >
          <i className="fas fa-map-marker-alt text-gold"></i>
          <span className="font-semibold text-deepPurple group-hover/address:text-gold">Location:</span>
          <span className="underline decoration-transparent group-hover/address:decoration-gold underline-offset-4">
            No. 4 New Windsor Street, Uxbridge, UB8 2TU
          </span>
        </a>

      </div>
    </section>
  );
};

export default Welcome;
