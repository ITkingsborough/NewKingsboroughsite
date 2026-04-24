import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { Link } from 'wouter';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

interface CommunityCardProps {
  title: string;
  image: string;
  description: string;
  link: string;
}

const communityCards: CommunityCardProps[] = [
  {
    title: "Hillingdon Foodbank",
    image: "https://images.unsplash.com/photo-1593113630400-ea4288922497?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    description: "Supporting those in need with essential food and supplies in the Hillingdon community.",
    link: "https://hillingdon.foodbank.org.uk/"
  },
  {
    title: "CMC Nursery",
    image: "https://images.unsplash.com/photo-1542037104857-ffbb0b9155fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    description: "Providing nurturing childcare and early education in a Christ-centered environment.",
    link: "https://test.cmcnursery.co.uk/"
  },
  {
    title: "Hadassah",
    image: "/uploads/gallery/WhatsApp Image 2026-02-04 at 10.21.26.jpeg",
    description: "A women's ministry empowering and supporting ladies through faith and fellowship.",
    link: "/hadassah"
  },
  {
    title: "Kingsmen",
    image: "/uploads/gallery/Kingsmen.png",
    description: "Men's fellowship focusing on faith, leadership and authentic Christian masculinity.",
    link: "/kingsmen"
  },
  {
    title: "Centre Point",
    image: "/uploads/gallery/IMG_7832.JPG",
    description: "Young adults ministry pursuing purpose, passion, and the presence of God.",
    link: "/crown"
  }
];

const Community = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        toggleActions: "play none none none"
      }
    });

    tl.fromTo(
      headingRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
    ).fromTo(
      textRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
      "-=0.5"
    );

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      data-nav-theme="light"
      className="flex flex-col bg-slate-50 overflow-hidden h-screen"
    >
      <div className="w-full flex flex-col h-full">
        <div className="text-center px-4 lg:px-8 py-6">
          <h2
            ref={headingRef}
            className="text-3xl md:text-4xl font-montserrat font-bold mb-4 text-deepPurple"
          >
            Find Your Community
          </h2>
          <p
            ref={textRef}
            className="text-lg max-w-2xl mx-auto text-darkGray"
          >
            At Kingsborough Church, we believe that life is better when we do it together.
            Browse our community groups and find the perfect place to belong.
          </p>
        </div>

        {/* Horizontal Accordion */}
        <div className="flex flex-1 w-full min-h-0 overflow-hidden">
          {communityCards.map((card, index) => {
            const isActive = activeIndex === index;
            const isExternal = card.link.startsWith('http');

            const inner = (
              <div className="relative w-full h-full overflow-hidden">
                {/* Background image */}
                <img
                  src={card.image}
                  alt={card.title}
                  className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ${isActive ? 'scale-105' : 'scale-100'}`}
                  loading="lazy"
                />

                {/* Dark gradient always visible */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Gold border when active */}
                <div
                  className={`absolute inset-0 border-4 transition-all duration-500 pointer-events-none ${isActive ? 'border-gold' : 'border-transparent'}`}
                />

                {/* Collapsed label shown when not active */}
                <div
                  className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isActive ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                >
                  <span
                    className="text-white font-montserrat font-bold text-sm md:text-lg tracking-widest uppercase whitespace-nowrap drop-shadow-lg"
                    style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)' }}
                  >
                    {card.title}
                  </span>
                </div>

                {/* Expanded content */}
                <div
                  className={`absolute bottom-0 left-0 right-0 p-6 transition-all duration-500 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'}`}
                >
                  <h3 className="text-2xl md:text-4xl font-montserrat font-bold text-white mb-2">
                    {card.title}
                  </h3>
                  <div className="h-0.5 w-12 bg-gold mb-3" />
                  <p className="text-white/90 text-base md:text-xl leading-relaxed">
                    {card.description}
                  </p>
                  <span className="inline-block mt-4 text-gold font-semibold text-base md:text-lg uppercase tracking-wide border-b border-gold/50 pb-0.5">
                    Learn More —
                  </span>
                </div>
              </div>
            );

            return (
              <div
                key={index}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                className="relative cursor-pointer overflow-hidden"
                style={{
                  flex: isActive ? '4 1 0%' : '1 1 0%',
                  transition: 'flex 0.5s ease-in-out',
                  minWidth: 0
                }}
              >
                {isExternal ? (
                  <a href={card.link} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                    {inner}
                  </a>
                ) : (
                  <Link href={card.link} className="block w-full h-full">
                    {inner}
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Community;
