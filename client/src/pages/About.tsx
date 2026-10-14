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

const STORY_SLIDES = [
  { src: "/uploads/gallery/Ss/IMG_0209.jpg", alt: "Kingsborough Church" },
  { src: "/uploads/gallery/Ss/IMG_1465.jpg", alt: "Kingsborough Church community" },
  { src: "/uploads/gallery/Ss/460627826_8710621418948057_4032063906934036991_n.jpg", alt: "Kingsborough Church family" },
  { src: "/uploads/gallery/Ss/460627945_8710621442281388_1143079453560872202_n.jpg", alt: "Kingsborough Church gathering" },
  { src: "/uploads/gallery/Ss/WhatsApp Image 2025-07-16 at 17.47.35.jpg", alt: "Kingsborough Church moments" },
];

const About = () => {
  const { createScrollAnimation, createParallaxEffect, createRevealAnimation } =
    useGsapAnimations();

  // Create refs for scroll animations
  const heroRef = useRef<HTMLDivElement>(null);
  const whoWeAreRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const missionVisionRef = useRef<HTMLDivElement>(null);
  const teamRef = useRef<HTMLDivElement>(null);

  // Our Story slideshow
  const [storySlide, setStorySlide] = useState(0);
  useEffect(() => {
    const timer = setInterval(
      () => setStorySlide((s) => (s + 1) % STORY_SLIDES.length),
      5000,
    );
    return () => clearInterval(timer);
  }, [storySlide]);

  // Parallax scroll refs
  const heroContentRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  // Hero zoom-parallax images — the first image is the one scrolled into
  const heroImages = [
    { src: "/uploads/about-hero.jpg", alt: "Kingsborough Church community" },
    { src: "/uploads/gallery/About US pics/IMG_9633.jpg", alt: "Kingsborough Church family" },
    { src: "/uploads/gallery/About US pics/IMG_0215.jpg", alt: "Church gathering" },
    { src: "/uploads/gallery/About US pics/IMG_0246.jpg", alt: "Kingsborough community" },
    { src: "/uploads/gallery/About US pics/IMG_9968.jpg", alt: "Worship service" },
    { src: "/uploads/gallery/About US pics/Connect2.jpg", alt: "Kingsborough Church connecting" },
    { src: "/uploads/gallery/Moyo and Van.JPG", alt: "Moyo and Van" },
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

  const missionPillars = [
    {
      title: "Connect",
      headline:
        "We create opportunities for people to connect with God, one another and their purpose.",
      description:
        "Through worship, fellowship and genuine relationships, we want everyone who comes through our doors to experience a community where they are seen, valued and welcomed.",
    },
    {
      title: "Equip",
      headline: "We help people grow in faith and in life.",
      description:
        "Through biblical teaching, prayer, discipleship, mentoring and development opportunities, we encourage people to discover their gifts, strengthen their relationship with God and become equipped for every area of life.",
    },
    {
      title: "Deploy",
      headline:
        "We encourage people to take their faith beyond the walls of the church.",
      description:
        "Whether through family life, careers, business, education, leadership, ministry or community service, we want people to use their gifts and influence to bring hope, positive change and the love of Christ wherever they go.",
    },
  ];

  // Core values
  const coreValues = [
    {
      letter: "F",
      title: "Fun",
      description: [
        "We believe following Jesus is a journey filled with joy. Church should be a place where friendships are formed, memories are made and people genuinely enjoy doing life together.",
      ],
    },
    {
      letter: "I",
      title: "Inclusive",
      description: [
        "Kingsborough is home to people from many cultures, generations and walks of life.",
        "We celebrate that diversity.",
        "We want everyone who walks through our doors to feel welcomed, respected and valued. Whatever your background or where you are on your journey of faith, there is room for you here.",
      ],
    },
    {
      letter: "C",
      title: "Christlike",
      description: [
        "Jesus is at the centre of everything we do.",
        "Through prayer, worship, studying God's Word and serving others, we seek to become more like Christ and reflect His love, compassion and character in our everyday lives.",
      ],
    },
    {
      letter: "E",
      title: "Excellence",
      description: [
        "We believe in bringing our best to what God has entrusted to us.",
        "For us, excellence isn't about perfection, it's about continually growing, learning and serving people well.",
      ],
    },
    {
      letter: "P",
      title: "Passion",
      description: [
        "We are passionate about Jesus, people and making a difference.",
        "That passion inspires us to serve generously, love wholeheartedly and use our gifts to help others flourish.",
      ],
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

      {/* Our Story — written narrative */}
      <section
        id="our-story"
        data-nav-theme="dark"
        className="bg-[#0c0c0e] overflow-hidden"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={slideUp()}
              className="px-6 py-12 lg:py-14 lg:pl-10 lg:pr-12 flex flex-col justify-center"
            >
              <span className="block text-gold font-montserrat text-xs font-bold tracking-[0.3em] uppercase mb-3">
                Since 2003
              </span>
              <h2
                className="text-[#F5F2EA] uppercase"
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "clamp(2.5rem, 5vw, 3.75rem)",
                  lineHeight: 0.95,
                  letterSpacing: "0.02em",
                }}
              >
                Our Story
              </h2>
              <div className="h-1 w-24 bg-gold mt-4 mb-6"></div>

              <h3
                className="text-gold uppercase mb-5"
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "clamp(1.6rem, 2.6vw, 2.4rem)",
                  lineHeight: 1.05,
                  letterSpacing: "0.02em",
                }}
              >
                Love God. Serve People. Add Value.
              </h3>

              <p className="text-base leading-relaxed text-white/85 mb-4">
                Kingsborough began in February 2003 with a simple but powerful
                vision: to create a church that would love God, serve people
                and add value to the community. What started with humble
                beginnings has grown into a thriving church and community
                organisation committed to seeing individuals, families and
                communities flourish.
              </p>
              <p className="text-base leading-relaxed text-white/85 mb-6">
                Over the years, our vision has expanded beyond what happens on a
                Sunday. Through worship, teaching, community initiatives,
                outreach, leadership development and practical support, we seek
                to meet people where they are and help them move towards where
                God has called them to be.
              </p>

              <div className="border-t border-white/15 pt-4">
                <p
                  className="text-gold uppercase"
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "clamp(1.4rem, 2.2vw, 1.9rem)",
                    letterSpacing: "0.02em",
                  }}
                >
                  Giving reason and adding value to lives.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={slideUp(0.2)}
              className="relative w-full h-64 sm:h-80 lg:h-auto lg:min-h-[420px] overflow-hidden"
            >
              <AnimatePresence initial={false}>
                <motion.img
                  key={storySlide}
                  src={STORY_SLIDES[storySlide].src}
                  alt={STORY_SLIDES[storySlide].alt}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </AnimatePresence>
              <div className="absolute bottom-4 left-0 right-0 z-10 flex justify-center gap-2">
                {STORY_SLIDES.map((slide, i) => (
                  <button
                    key={slide.src}
                    type="button"
                    aria-label={`Show slide ${i + 1}`}
                    onClick={() => setStorySlide(i)}
                    className={`h-2 rounded-full transition-all ${
                      i === storySlide ? "w-6 bg-gold" : "w-2 bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </motion.div>
        </div>
      </section>

      {/* 4. Our Story — Scroll-Driven Section */}
      <OurStoryScroll />

      {/* Our Mission — Connect / Equip / Deploy */}
      <section id="our-mission" className="py-24 lg:py-32 bg-[#F5F2EA] overflow-hidden">
        <div className="container mx-auto px-6 lg:px-16 max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={slideUp()}
            className="mb-14 lg:mb-20"
          >
            <h2
              className="uppercase mb-4"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
                lineHeight: 0.95,
                letterSpacing: "0.02em",
              }}
            >
              <span className="text-black">Our </span>
              <span className="text-gold">Mission</span>
            </h2>
            <p
              className="text-deepPurple uppercase"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(1.75rem, 3.5vw, 3rem)",
                lineHeight: 1,
                letterSpacing: "0.01em",
              }}
            >
              Connect. Equip. Deploy.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12">
            {missionPillars.map((pillar, index) => (
              <motion.div
                key={pillar.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={slideUp(index * 0.15)}
                className="border-t-2 border-deepPurple pt-8"
              >
                <div className="flex items-baseline gap-3 mb-5">
                  <span
                    className="text-[#8a6d12]"
                    style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.25rem" }}
                  >
                    0{index + 1}
                  </span>
                  <h3
                    className="text-[#111] uppercase"
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: "clamp(2.5rem, 4vw, 3.5rem)",
                      lineHeight: 1,
                    }}
                  >
                    {pillar.title}
                  </h3>
                </div>
                <p className="text-lg font-bold leading-snug mb-4 text-[#111]">
                  {pillar.headline}
                </p>
                <p className="text-base leading-relaxed text-gray-600">
                  {pillar.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Core Values — simple numbered list */}
      <section className="py-24 bg-gray-100 relative">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <h2 className="text-5xl md:text-6xl font-montserrat font-extrabold uppercase mb-14">
            <span className="text-black">What matters to </span>
            <span className="text-gold">Us</span>
          </h2>

          <div className="relative border-t border-black/70">
            {coreValues.map((value, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={slideUp(index * 0.05)}
                className="grid grid-cols-[auto_1fr] sm:grid-cols-[auto_220px_1fr] gap-4 sm:gap-8 items-baseline py-6 border-b border-black/70 cursor-default"
              >
                <span className="font-montserrat font-bold text-sm">{index + 1}</span>
                <h3 className="font-montserrat font-extrabold text-xl md:text-2xl uppercase col-span-2 sm:col-span-1">
                  {value.title}
                </h3>
                <div className="text-gray-600 text-base md:text-lg col-span-2 sm:col-span-1 space-y-3">
                  {value.description.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </motion.div>
            ))}
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
        <div className="relative min-h-[70vh] lg:min-h-0 lg:aspect-[2/1] flex flex-col lg:flex-row overflow-hidden">
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
              src="/uploads/gallery/Apostle%20Toyin.png"
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
