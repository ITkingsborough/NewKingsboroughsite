import { motion, useScroll, useTransform } from "framer-motion";
import {
  slideUp,
  slideRight,
  fadeIn,
  staggerContainer,
} from "@/lib/animations";
import { leaders } from "@/lib/data";
import { Helmet } from "react-helmet";
import { useRef, useEffect } from "react";
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
  const valuesRef = useRef<HTMLDivElement>(null);
  const teamRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  // Parallax scroll refs
  const parallaxBgRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  // Scroll animation for hero section using framer-motion
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.1], [0, 100]);

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
      icon: "fas fa-heart",
      title: "Love",
      description:
        "Demonstrating Christ's unconditional love in everything we do, to everyone we meet.",
    },
    {
      icon: "fas fa-hands-helping",
      title: "Service",
      description:
        "Serving others with humility and compassion as an expression of our faith.",
    },
    {
      icon: "fas fa-seedling",
      title: "Growth",
      description:
        "Fostering spiritual, personal, and communal growth through discipleship and learning.",
    },
    {
      icon: "fas fa-users",
      title: "Community",
      description:
        "Building authentic relationships where people belong, connect, and support each other.",
    },
    {
      icon: "fas fa-globe-africa",
      title: "Impact",
      description:
        "Making a meaningful difference in our city, nation, and world through purposeful action.",
    },
    {
      icon: "fas fa-church",
      title: "Worship",
      description:
        "Celebrating God's presence through passionate, authentic expressions of worship.",
    },
  ];

  // Add GSAP animations on component mount
  useEffect(() => {
    // Hero section parallax effect
    if (parallaxBgRef.current) {
      createParallaxEffect(parallaxBgRef.current, 0.3, "vertical");
    }

    // Who We Are section animations
    if (whoWeAreRef.current) {
      const section = whoWeAreRef.current;
      const image = section.querySelector(".section-image");
      const content = section.querySelector(".section-content");

      if (image) {
        createScrollAnimation(
          image,
          { scale: 1.05, opacity: 0.8 },
          {
            trigger: section,
            scrub: 0.5,
            start: "top bottom",
            end: "bottom center",
          },
        );
      }

      if (content) {
        gsap.from(content, {
          x: -50,
          opacity: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
            end: "center center",
            toggleActions: "play none none reverse",
          },
        });
      }
    }

    // Timeline animations
    if (timelineRef.current) {
      const timelineItems =
        timelineRef.current.querySelectorAll(".timeline-item");

      timelineItems.forEach((item, index) => {
        const direction = index % 2 === 0 ? -30 : 30;

        gsap.from(item, {
          x: direction,
          opacity: 0,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: item,
            start: "top 80%",
            end: "center center",
            toggleActions: "play none none reverse",
          },
        });
      });

      // Timeline connector line animation
      const connector = timelineRef.current.querySelector(
        ".timeline-connector",
      );
      if (connector) {
        gsap.from(connector, {
          height: 0,
          duration: 1.5,
          ease: "none",
          scrollTrigger: {
            trigger: timelineRef.current,
            start: "top 70%",
            end: "bottom 80%",
            scrub: true,
          },
        });
      }
    }

    // Mission & Vision reveal animations
    if (missionVisionRef.current) {
      const cards = missionVisionRef.current.querySelectorAll(".mv-card");

      cards.forEach((card, index) => {
        createRevealAnimation(card, index === 0 ? "left" : "right", 50);
      });
    }

    // Core values animation
    if (valuesRef.current) {
      const cards = valuesRef.current.querySelectorAll(".value-card");

      gsap.from(cards, {
        y: 50,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: valuesRef.current,
          start: "top 70%",
          end: "center center",
          toggleActions: "play none none reverse",
        },
      });
    }

    // Team section image hover animations
    if (teamRef.current) {
      const teamCards = teamRef.current.querySelectorAll(".team-card");

      teamCards.forEach((card) => {
        const img = card.querySelector("img");
        const content = card.querySelector(".hover-content");

        card.addEventListener("mouseenter", () => {
          gsap.to(img, { scale: 1.1, duration: 0.4 });
          gsap.to(content, { opacity: 1, y: 0, duration: 0.3 });
        });

        card.addEventListener("mouseleave", () => {
          gsap.to(img, { scale: 1, duration: 0.4 });
          gsap.to(content, { opacity: 0, y: 20, duration: 0.3 });
        });
      });
    }

    // CTA section parallax
    if (ctaRef.current) {
      const ctaBg = ctaRef.current.querySelector(".cta-bg");
      if (ctaBg) {
        createParallaxEffect(ctaBg, 0.2, "vertical");
      }
    }

    // Scroll indicator animation
    if (scrollIndicatorRef.current) {
      gsap.to(scrollIndicatorRef.current, {
        y: 10,
        repeat: -1,
        duration: 1.5,
        ease: "power1.inOut",
        yoyo: true,
      });
    }

    // Clean up ScrollTrigger instances
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
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

      {/* 1. Full-Screen Hero Section */}
      <div
        ref={heroRef}
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Parallax Background Video/Image */}
        <div
          ref={parallaxBgRef}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')`,
            backgroundAttachment: "fixed",
          }}
        ></div>

        {/* Gold Tinted Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-gold/50 to-deepPurple/60"></div>

        {/* Content */}
        <motion.div
          ref={heroContentRef}
          className="container relative z-10 px-4 lg:px-8 text-center"
          style={{ opacity: heroOpacity, y: heroY }}
        >
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-montserrat font-bold text-white mb-6 tracking-tight"
          >
            We Are A Light In The City
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="text-xl md:text-2xl text-white font-light max-w-3xl mx-auto"
          >
            Building a community where faith is lived, love is experienced, and
            everyone is valued.
          </motion.p>
        </motion.div>

        {/* Animated Scroll Indicator */}
        <motion.div
          ref={scrollIndicatorRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
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
        </motion.div>
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
                src="https://images.unsplash.com/photo-1526413232644-8a40f03cc03b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="Kingsborough Church community worship service"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Our Story Timeline Section */}
      <section ref={timelineRef} className="py-20 bg-deepPurple overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={slideUp()}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-montserrat font-bold mb-4 text-white">
              Our Story
            </h2>
            <div className="h-1 w-20 bg-gold mx-auto mb-6"></div>
            <p className="text-lg md:text-xl max-w-3xl mx-auto text-white/90">
              A journey of faith, growth, and impact through the years
            </p>
          </motion.div>

          {/* Horizontal Timeline */}
          <div className="max-w-5xl mx-auto relative">
            {/* Timeline connector line */}
            <div className="timeline-connector absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gold transform md:-translate-x-1/2"></div>

            {/* Timeline Events */}
            {timeline.map((event, index) => (
              <div
                key={index}
                className={`timeline-item relative flex flex-col md:flex-row ${
                  index % 2 !== 0 ? "md:flex-row-reverse" : ""
                } items-start mb-16 last:mb-0`}
              >
                {/* Timeline Node */}
                <div className="absolute left-8 md:left-1/2 top-0 w-6 h-6 rounded-full bg-gold shadow-lg transform translate-x-[-50%] md:translate-x-[-50%] z-10"></div>

                {/* Content Card */}
                <div
                  className={`ml-16 md:ml-0 md:w-[calc(50%-2rem)] ${
                    index % 2 !== 0 ? "md:pl-8" : "md:pr-8"
                  }`}
                >
                  <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-gold">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                      <h3 className="text-xl md:text-2xl font-montserrat font-semibold text-deepPurple">
                        {event.title}
                      </h3>
                      <span className="inline-block bg-gold/20 text-gold font-semibold px-3 py-1 rounded-full text-sm mt-2 md:mt-0">
                        {event.year}
                      </span>
                    </div>
                    <p className="text-gray-700">{event.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

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

      {/* 5. Core Values Grid Section */}
      <section ref={valuesRef} className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={slideUp()}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-montserrat font-bold mb-4 text-deepPurple">
              Core Values
            </h2>
            <div className="h-1 w-20 bg-gold mx-auto mb-6"></div>
            <p className="text-lg md:text-xl max-w-3xl mx-auto text-gray-700">
              The fundamental beliefs that guide all we do
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer()}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
          >
            {coreValues.map((value, index) => (
              <motion.div
                key={index}
                variants={fadeIn(index * 0.1)}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                className="value-card bg-white rounded-xl p-6 shadow-lg border border-gray-100 flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 rounded-full flex items-center justify-center bg-deepPurple/100 mb-5">
                  <i className={`${value.icon} text-gold text-2xl`}></i>
                </div>
                <h3 className="text-2xl font-montserrat font-bold mb-3 text-deepPurple">
                  {value.title}
                </h3>
                <p className="text-gray-700">{value.description}</p>
                <div className="h-0.5 w-12 bg-gold/60 mt-5"></div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 6. Meet the Team Section */}
      <section ref={teamRef} className="py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={slideUp()}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-montserrat font-bold mb-4 text-deepPurple">
              Meet Our Leadership
            </h2>
            <div className="h-1 w-20 bg-gold mx-auto mb-6"></div>
            <p className="text-lg md:text-xl max-w-3xl mx-auto text-gray-700">
              The dedicated team guiding our church with vision and compassion
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {leaders.map((leader, index) => (
              <motion.div
                key={leader.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={slideUp(index * 0.1)}
                className="team-card relative rounded-xl overflow-hidden shadow-xl group cursor-pointer"
              >
                {/* Team member image */}
                <div className="h-80 overflow-hidden">
                  <img
                    src={leader.image}
                    alt={leader.name}
                    className="w-full h-full object-cover transition-transform duration-700"
                    loading="lazy"
                  />
                </div>

                {/* Gold border overlay on hover */}
                <div className="absolute inset-0 border-0 group-hover:border-4 border-gold transition-all duration-300 pointer-events-none"></div>

                {/* Card content - visible always */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6">
                  <h3 className="text-xl font-montserrat font-bold text-white mb-1">
                    {leader.name}
                  </h3>
                  <p className="text-gold font-medium text-sm">{leader.role}</p>
                </div>

                {/* Hover content - Bio text */}
                <div className="hover-content absolute inset-0 bg-deepPurple/95 flex items-center opacity-0 translate-y-10">
                  <div className="p-6">
                    <h3 className="text-xl font-montserrat font-bold text-white mb-2">
                      {leader.name}
                    </h3>
                    <p className="text-gold font-medium mb-3 text-sm">
                      {leader.role}
                    </p>
                    <div className="h-0.5 w-12 bg-gold mb-4"></div>
                    <p className="text-white/90 leading-relaxed text-sm">
                      {leader.bio}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Call to Action Section */}
      <section ref={ctaRef} className="py-24 relative overflow-hidden">
        {/* Background Image with Parallax */}
        <div
          className="cta-bg absolute inset-0 bg-cover bg-center brightness-50"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')`,
          }}
        ></div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-deepPurple/80 to-gold/60 mix-blend-multiply"></div>

        <div className="container relative z-10 px-4 lg:px-8 mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeIn()}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-5xl font-montserrat font-bold mb-6 text-white">
              Join Our Story
            </h2>
            <p className="text-xl md:text-2xl text-white/90 font-light mb-10">
              Be part of a community that's making a difference. Walk the
              journey with us. Experience the transformation.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/contact"
                className="px-8 py-4 bg-gold text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-white hover:text-gold transition-colors duration-300 transform hover:scale-105"
              >
                Plan Your Visit
              </a>
              <a
                href="/sermons"
                className="px-8 py-4 bg-transparent border-2 border-white text-white text-lg font-semibold rounded-lg hover:bg-white hover:text-deepPurple transition-colors duration-300"
              >
                Watch a Service
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default About;
