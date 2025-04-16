import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger, Draggable } from 'gsap/all';
import { Link } from 'wouter';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, Draggable);

interface CommunityCardProps {
  title: string;
  image: string;
  description: string;
  link: string;
}

const communityCards: CommunityCardProps[] = [
  {
    title: "Small Groups",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    description: "Connect with others in a small, welcoming environment where you can grow in faith together.",
    link: "/ministries"
  },
  {
    title: "Volunteer Teams",
    image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    description: "Use your gifts and talents to serve others and make a difference in our community.",
    link: "/ministries"
  },
  {
    title: "Youth Fellowship",
    image: "https://images.unsplash.com/photo-1536337005238-94b997371b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    description: "A vibrant community where youth can build relationships and grow in their faith journey.",
    link: "/ministries"
  },
  {
    title: "Family Ministries",
    image: "https://images.unsplash.com/photo-1542037104857-ffbb0b9155fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    description: "Resources and activities designed to strengthen families and nurture spiritual growth at home.",
    link: "/ministries"
  },
  {
    title: "Outreach Programs",
    image: "https://images.unsplash.com/photo-1593113630400-ea4288922497?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    description: "Serving our local and global community through compassionate action and support.",
    link: "/ministries"
  },
  {
    title: "Prayer Circle",
    image: "https://images.unsplash.com/photo-1505455184862-554165e5f6ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    description: "A dedicated group that meets regularly to pray for the church, community, and world needs.",
    link: "/ministries"
  }
];

const Community = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current || !carouselRef.current || !cardsRef.current) return;

    // Heading and text animations
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

    // Card animations
    cardRefs.current.forEach((card, index) => {
      if (!card) return;
      
      gsap.fromTo(
        card,
        { 
          x: 50, 
          opacity: 0 
        },
        { 
          x: 0, 
          opacity: 1, 
          duration: 0.6, 
          delay: 0.2 + (index * 0.1), 
          ease: "power2.out",
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 80%",
            toggleActions: "play none none none"
          }
        }
      );
    });

    // Horizontal scroll interaction
    const cards = cardsRef.current;
    const cardsWidth = cards.scrollWidth;
    const containerWidth = carouselRef.current.offsetWidth;
    
    // Only enable dragging if content overflows
    if (cardsWidth > containerWidth) {
      // Make cards draggable for smooth scrolling
      Draggable.create(cards, {
        type: "x",
        bounds: {
          minX: -cardsWidth + containerWidth,
          maxX: 0
        },
        inertia: true,
        dragClickables: true,
        edgeResistance: 0.9,
        throwResistance: 2500, // Lower value = more slide after release
        overshootTolerance: 0.5,
        snap: { // Snap to card boundaries for a cleaner end position
          x: function(endValue) {
            // Calculate card width including gap
            const cardWidth = 320 + 20; // Card width + gap
            // Snap to the closest card boundary
            return Math.round(endValue / cardWidth) * cardWidth;
          }
        }
      });
    }

    // Clean up
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      Draggable.get(cards)?.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef} 
      className="py-20 bg-slate-50"
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <h2 
            ref={headingRef}
            className="text-3xl md:text-4xl font-montserrat font-bold mb-4 text-deepPurple opacity-0"
          >
            Find Your Community
          </h2>
          <p 
            ref={textRef}
            className="text-lg max-w-2xl mx-auto text-darkGray opacity-0"
          >
            At Kingsborough Church, we believe that life is better when we do it together. 
            Browse our community groups and find the perfect place to belong.
          </p>
        </div>

        <div 
          ref={carouselRef}
          className="relative"
        >
          <div 
            ref={cardsRef}
            className="flex space-x-5 pb-4 cursor-grab active:cursor-grabbing overflow-x-auto scrollbar-hide"
            style={{ 
              willChange: "transform",
              touchAction: "pan-y",
              scrollBehavior: "smooth", 
              scrollbarWidth: "none", /* Firefox */
              WebkitOverflowScrolling: "touch", /* iOS momentum scrolling */
              transform: "translate3d(0,0,0)", /* Hardware acceleration */
              perspective: "1000px",
              backfaceVisibility: "hidden" as "hidden"
            }}
          >
            {communityCards.map((card, index) => (
              <div 
                key={index}
                ref={el => cardRefs.current[index] = el}
                className="flex-shrink-0 w-80 bg-white rounded-lg shadow-md overflow-hidden opacity-0 transition-all duration-200 hover:shadow-lg"
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src={card.image} 
                    alt={card.title} 
                    className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-110"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-montserrat font-semibold mb-2">{card.title}</h3>
                  <p className="text-darkGray mb-4">{card.description}</p>
                  <Link 
                    href={card.link}
                    className="text-gold font-medium hover:text-deepPurple transition-colors"
                  >
                    Learn More →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-6 space-x-2">
            <p className="text-sm text-gray-500 italic">
              <span className="hidden sm:inline">Drag the cards to explore more</span>
              <span className="inline sm:hidden">Swipe to see more</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Community;