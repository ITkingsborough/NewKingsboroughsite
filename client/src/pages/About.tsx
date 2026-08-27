import { motion, AnimatePresence } from "framer-motion";
import {
  slideUp,
  slideRight,
  fadeIn,
} from "@/lib/animations";
import OurStoryScroll from "@/components/about/OurStoryScroll";
import { ZoomParallax } from "@/components/ui/zoom-parallax";
import { leaders } from "@/lib/data";
import { Helmet } from "react-helmet";
import { useRef, useEffect, useState, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useGsapAnimations } from "@/hooks/use-gsap-animations";
import { scrollToElement } from "@/hooks/use-smooth-scroll";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const { createScrollAnimation, createParallaxEffect, createRevealAnimation } =
    useGsapAnimations();

  // Create refs for scroll animations
  const heroRef = useRef<HTMLDivElement>(null);
  const whoWeAreRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const missionVisionRef = useRef<HTMLDivElement>(null);
  const teamRef = useRef<HTMLDivElement>(null);

  // Hover-reveal image for the Values list
  const [hoverValueImage, setHoverValueImage] = useState<string | null>(null);
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });

  // Parallax scroll refs
  const heroContentRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  // Hero zoom-parallax images — the first image is the one scrolled into
  const heroImages = [
    { src: "/uploads/about-hero.jpg", alt: "Kingsborough Church community" },
    { src: "/uploads/gallery/Apst Preaching.JPG", alt: "Apostle preaching" },
    { src: "/uploads/gallery/HOP.jpg", alt: "Church gathering" },
    { src: "/uploads/gallery/Kingsmen.png", alt: "Kingsmen ministry" },
    { src: "/uploads/gallery/Moyo and Van.JPG", alt: "Worship service" },
    { src: "/uploads/gallery/New Audi (1).jpeg", alt: "Inside Kingsborough Church" },
    { src: "/uploads/gallery/MEDIA.jpg", alt: "Media ministry" },
  ];

  // Timeline data
  const timeline = [
    {
      year: "2010",
      title: "Church Foundation",
      description:
        "Kingsborough Church was founded with a vision to be a light in the city, starting with just a handful of committed believers.",
    },
    {
      year: "2013",
      title: "First Home",
      description:
        "Moved into our first permanent location, enabling us to expand our community outreach initiatives.",
    },
    {
      year: "2016",
      title: "Community Growth",
      description:
        "Surpassed 500 members and launched our first satellite campus to reach more neighborhoods.",
    },
    {
      year: "2020",
      title: "Digital Ministry",
      description:
        "Pioneered our digital ministry, reaching thousands globally through online services and resources.",
    },
  ];

  // Core values
  const coreValues = [
    {
      letter: "F",
      title: "Fun",
      image: "/uploads/gallery/IMG_7832.JPG",
      description:
        "We create joyful spaces where people can laugh, connect, and experience church as life-giving.",
    },
    {
      letter: "I",
      title: "Inclusivity",
      image: "/uploads/gallery/HOP.jpg",
      description:
        "Everyone is welcomed, valued, and embraced regardless of background, story, or season of life.",
    },
    {
      letter: "C",
      title: "Christlike",
      image: "/uploads/gallery/Kingsmen.png",
      description:
        "We pursue a deeper relationship with God through worship, prayer, and the Word.",
    },
    {
      letter: "E",
      title: "Excellence",
      image: "/uploads/gallery/Excellence.jpg",
      description:
        "We honour God by giving our best in every area of ministry, leadership, and service.",
    },
    {
      letter: "P",
      title: "Passion",
      image: "/uploads/gallery/MEDIA.jpg",
      description:
        "We serve with energy, commitment, and love for people and the presence of God.",
    },
  ];

  // Combine all GSAP animations into one layout effect for stability
  // ── All other page animations ─────────────────────────────────────────────
  useLayoutEffect(() => {
    let gsapCtx = gsap.context(() => {
      // Page Animations
      if (whoWeAreRef.current) {
        const whoSection = whoWeAreRef.current;
        const image = whoSection.querySelector(".section-image");
        const content = whoSection.querySelector(".section-content");

        if (image) {
          createScrollAnimation(image, { scale: 1.05, opacity: 0.8 }, {
            trigger: whoSection, scrub: 0.5, start: "top bottom", end: "bottom center"
          });
        }

        if (content) {
          gsap.from(content, {
            x: -50, opacity: 0, duration: 1, ease: "power2.out",
            scrollTrigger: {
              trigger: whoSection, start: "top 70%", end: "center center", toggleActions: "play none none reverse"
            }
          });
        }
      }

      if (timelineRef.current) {
        const timelineItems = timelineRef.current.querySelectorAll(".timeline-item");
        timelineItems.forEach((item, index) => {
          const direction = index % 2 === 0 ? -30 : 30;
          gsap.from(item, {
            x: direction, opacity: 0, duration: 0.7, ease: "power2.out",
            scrollTrigger: {
              trigger: item, start: "top 80%", end: "center center", toggleActions: "play none none reverse"
            }
          });
        });

        const connector = timelineRef.current.querySelector(".timeline-connector");
        if (connector) {
          gsap.from(connector, {
            height: 0, duration: 1.5, ease: "none",
            scrollTrigger: {
              trigger: timelineRef.current, start: "top 70%", end: "bottom 80%", scrub: true
            }
          });
        }
      }

      if (missionVisionRef.current) {
        const cards = missionVisionRef.current.querySelectorAll(".mv-card");
        cards.forEach((card, index) => {
          createRevealAnimation(card, index === 0 ? "left" : "right", 50);
        });
      }

      if (teamRef.current) {
        const teamCards = teamRef.current.querySelectorAll(".team-card");
        teamCards.forEach((card) => {
          const img = card.querySelector("img");
          const hoverContent = card.querySelector(".hover-content");
          card.addEventListener("mouseenter", () => {
            gsap.to(img, { scale: 1.1, duration: 0.4 });
            gsap.to(hoverContent, { opacity: 1, y: 0, duration: 0.3 });
          });
          card.addEventListener("mouseleave", () => {
            gsap.to(img, { scale: 1, duration: 0.4 });
            gsap.to(hoverContent, { opacity: 0, y: 20, duration: 0.3 });
          });
        });
      }

      if (scrollIndicatorRef.current) {
        gsap.to(scrollIndicatorRef.current, {
          y: 10, repeat: -1, duration: 1.5, ease: "power1.inOut", yoyo: true
        });
      }
    });

    // Essential refresh
    const refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 1000);

    return () => {
      clearTimeout(refreshTimer);
      gsapCtx.revert();
    };
  }, [createScrollAnimation, createParallaxEffect, createRevealAnimation]);

  return (
    <>
      <Helmet>
        <title>About Us | Kingsborough Church</title>
        <meta
          name="description"
          content="Discover Kingsborough Church's story, mission, and leadership. Learn about our heart for the community and vision to be a light in the city."
        />
      </Helmet>

      {/* 1. Full-Screen Hero Section — Zoom Parallax into the hero image */}
      <div ref={heroRef} data-nav-theme="dark" className="relative">
        <ZoomParallax
          images={heroImages}
          overlay={
            <div className="relative h-full w-full pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-r from-gold/40 to-deepPurple/50"></div>

              {/* Content */}
              <div
                ref={heroContentRef}
                className="relative z-10 h-full container mx-auto px-4 lg:px-8 flex items-center justify-center text-center"
              >
                <div>
                  <h1 className="text-5xl md:text-7xl lg:text-8xl font-montserrat font-bold text-white mb-6 tracking-[0.06em]">
                    We Are A Light In The City
                  </h1>
                  <p className="text-xl md:text-2xl text-white font-light max-w-3xl mx-auto">
                    Building a community where faith is lived, love is experienced, and
                    everyone is valued.
                  </p>
                </div>
              </div>

              {/* Scroll Indicator */}
              <div
                ref={scrollIndicatorRef}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer pointer-events-auto"
                onClick={() => scrollToElement("who-we-are")}
              >
                <div className="text-white text-sm mb-2 font-light tracking-wider">
                  DISCOVER OUR STORY
                </div>
                <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center mx-auto">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </div>
              </div>
            </div>
          }
        />
      </div>

      {/* 2. "Who We Are" Split Layout Section */}
      <section
        id="who-we-are"
        ref={whoWeAreRef}
        className="py-20 bg-white overflow-hidden"
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center lg:items-stretch gap-8 lg:gap-16">
            {/* Left: Content */}
            <div className="w-full lg:w-1/2 section-content">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={slideUp()}
              >
                <h2 className="text-3xl md:text-5xl font-montserrat font-bold mb-6 text-deepPurple">
                  Who We Are
                </h2>
                <div className="h-1 w-24 bg-gold mb-8"></div>
                <p className="text-lg md:text-xl leading-relaxed mb-8 text-gray-700">
                  Kingsborough Church is a vibrant community of believers
                  passionate about encountering God, growing together, and
                  making a positive impact in our city and beyond.
                </p>
                <p className="text-lg leading-relaxed mb-8 text-gray-700">
                  Founded on the principles of authentic faith and genuine love,
                  we are committed to creating an environment where everyone
                  feels welcome, regardless of background or life stage.
                </p>
                <p className="text-lg leading-relaxed mb-10 text-gray-700">
                  Our community is diverse yet united - a spiritual family where
                  honest relationships thrive and where we support each other
                  through life's journey.
                </p>

                {/* Logo Watermark (Low Opacity) */}
                <div className="opacity-10 absolute bottom-0 left-0 w-72 hidden lg:block">
                  <svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M20,50 L40,20 L60,50 L80,20 L100,50 L120,20 L140,50 L160,20 L180,50"
                      stroke="#000"
                      strokeWidth="5"
                      fill="none"
                    />
                    <path
                      d="M40,80 L160,80"
                      stroke="#000"
                      strokeWidth="5"
                      fill="none"
                    />
                  </svg>
                </div>
              </motion.div>
            </div>

            {/* Right: Full-height Image */}
            <div className="w-full lg:w-1/2 relative rounded-lg overflow-hidden shadow-2xl h-96 lg:h-auto section-image">
              <img
                src="/uploads/gallery/Moyo and Van.JPG"
                alt="Kingsborough Church community worship service"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4. Our Story — Scroll-Driven Section */}
      <OurStoryScroll />

      {/* 4. Our Vision & Mission Section */}
      <section
        ref={missionVisionRef}
        className="py-24 bg-white overflow-hidden"
      >
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={slideUp()}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-montserrat font-bold mb-4 text-deepPurple">
              Our Vision & Mission
            </h2>
            <div className="h-1 w-20 bg-gold mx-auto mb-6"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
            {/* Vision Card */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={slideRight(0)}
              className="mv-card bg-deepPurple/5 rounded-xl p-8 md:p-10 shadow-lg border-t-4 border-gold"
            >
              <h3 className="text-3xl md:text-4xl font-montserrat font-bold mb-6 text-deepPurple">
                Our Vision
              </h3>
              <p className="text-lg md:text-xl leading-relaxed text-gray-700 mb-6">
                To be a light in our city, transforming lives through faith,
                building authentic community, and creating positive change in
                our society.
              </p>
              <div className="h-0.5 w-16 bg-gold mt-auto"></div>
            </motion.div>

            {/* Mission Card */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={slideRight(0.3)}
              className="mv-card bg-deepPurple/5 rounded-xl p-8 md:p-10 shadow-lg border-t-4 border-gold"
            >
              <h3 className="text-3xl md:text-4xl font-montserrat font-bold mb-6 text-deepPurple">
                Our Mission
              </h3>
              <p className="text-lg md:text-xl leading-relaxed text-gray-700 mb-6">
                To lead people into a growing relationship with Jesus Christ
                through worship, community, discipleship, and service to others.
              </p>
              <div className="h-0.5 w-16 bg-gold mt-auto"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. Core Values — simple numbered list */}
      <section className="py-24 bg-gray-100 relative">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <h2 className="text-5xl md:text-6xl font-montserrat font-extrabold uppercase mb-14">
            <span className="text-black">Our </span>
            <span className="text-gold">Values</span>
          </h2>

          <div
            className="relative border-t border-black/70"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setHoverPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
            }}
          >
            {coreValues.map((value, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={slideUp(index * 0.05)}
                onMouseEnter={() => setHoverValueImage(value.image)}
                onMouseLeave={() => setHoverValueImage(null)}
                className="grid grid-cols-[auto_1fr] sm:grid-cols-[auto_220px_1fr] gap-4 sm:gap-8 items-baseline py-6 border-b border-black/70 cursor-default"
              >
                <span className="font-montserrat font-bold text-sm">{index + 1}</span>
                <h3 className="font-montserrat font-extrabold text-xl md:text-2xl uppercase col-span-2 sm:col-span-1">
                  {value.title}
                </h3>
                <p className="text-gray-600 text-base md:text-lg col-span-2 sm:col-span-1">
                  {value.description}
                </p>
              </motion.div>
            ))}

            {/* Floating image that follows the cursor while hovering a value row */}
            <AnimatePresence>
              {hoverValueImage && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="hidden lg:block absolute z-50 pointer-events-none w-64 h-40 rounded-xl overflow-hidden shadow-2xl ring-1 ring-gold/50"
                  style={{ left: hoverPos.x + 28, top: hoverPos.y - 90 }}
                >
                  <img src={hoverValueImage} alt="" className="w-full h-full object-cover" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* 6. Meet the Team Section */}
      <section ref={teamRef} className="overflow-hidden">
        {/* Section Header */}
        <div className="py-16 bg-white text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={slideUp()}
          >
            <h2 className="text-3xl md:text-5xl font-montserrat font-bold mb-4 text-deepPurple">
              Meet Our Leadership
            </h2>
            <div className="h-1 w-20 bg-gold mx-auto mb-6"></div>
            <p className="text-lg md:text-xl max-w-3xl mx-auto text-gray-700">
              The dedicated team guiding our church with vision and compassion
            </p>
          </motion.div>
        </div>

        {/* Senior Pastors — image left, text right */}
        <div className="relative min-h-[80vh] flex flex-col lg:flex-row overflow-hidden">
          {/* Image */}
          <div className="lg:w-1/2 relative min-h-[50vh] lg:min-h-full overflow-hidden">
            <img
              src={leaders[0].image}
              alt={leaders[0].name}
              className="absolute inset-0 w-full h-full object-cover object-top"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/30 lg:block hidden" />
          </div>
          {/* Text */}
          <div className="lg:w-1/2 bg-black flex items-center px-8 md:px-16 py-16">
            <motion.div
              className="max-w-xl"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={slideUp()}
            >
              <span className="inline-block text-xs font-montserrat font-bold tracking-[0.3em] uppercase text-gold/80 border border-gold/40 px-3 py-1 rounded-full mb-4">
                In Loving Memory
              </span>
              <h3 className="text-4xl md:text-5xl lg:text-6xl font-montserrat font-bold text-white mb-2 leading-tight">
                {leaders[0].name}
              </h3>
              {leaders[0].years && (
                <p className="text-white/50 font-montserrat text-lg mb-6 tracking-widest">{leaders[0].years}</p>
              )}
              <div className="border-l-4 border-gold pl-6 space-y-4">
                <p className="text-gold font-semibold text-xl">{leaders[0].role}</p>
                <p className="text-white/85 text-lg leading-relaxed">{leaders[0].bio}</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Resident Pastor — text left, image right */}
        <div className="relative min-h-[80vh] flex flex-col-reverse lg:flex-row overflow-hidden">
          {/* Text */}
          <div className="lg:w-1/2 bg-deepPurple flex items-center px-8 md:px-16 py-16">
            <motion.div
              className="max-w-xl"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={slideUp()}
            >
              <h3 className="text-4xl md:text-5xl lg:text-6xl font-montserrat font-bold text-white mb-8 leading-tight">
                {leaders[1].name}
              </h3>
              <div className="border-l-4 border-gold pl-6 space-y-4">
                <p className="text-gold font-semibold text-xl">{leaders[1].role}</p>
                <p className="text-white/85 text-lg leading-relaxed">{leaders[1].bio}</p>
              </div>
            </motion.div>
          </div>
          {/* Image */}
          <div className="lg:w-1/2 relative min-h-[50vh] lg:min-h-full overflow-hidden">
            <img
              src={leaders[1].image}
              alt={leaders[1].name}
              className="absolute inset-0 w-full h-full object-cover object-top"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-deepPurple/30 lg:block hidden" />
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
