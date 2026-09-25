import { useLayoutEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Helmet } from "react-helmet";
import { ExternalLink } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/all";
import { slideUp } from "@/lib/animations";
import { leaders } from "@/lib/data";
import { scrollToElement } from "@/hooks/use-smooth-scroll";

gsap.registerPlugin(ScrollTrigger);

// Each chapter takes over the pinned stage in turn; "highlight" words are stripped of
// punctuation before matching so entries like "PRAYER," still light up correctly.
const VISION_CHAPTERS = [
  { text: "HE BELIEVED THE GOSPEL IS THE POWER OF GOD TO TRANSFORM LIVES.", highlight: ["TRANSFORM"] },
  { text: "HE ENVISIONED A CHURCH ROOTED IN PRAYER, TRUTH, AND DISCIPLESHIP.", highlight: ["PRAYER"] },
  { text: "HE DREAMED OF GENERATIONS WALKING BOLDLY IN THEIR GOD-GIVEN PURPOSE.", highlight: ["PURPOSE"] },
];

const ACCOMPLISHMENTS = [
  {
    title: "Founded Kingsborough Church",
    text: "Planted the church from a small gathering of believers into a thriving, multi-generational community of faith.",
  },
  {
    title: "Raised Generations of Disciples",
    text: "Mentored countless leaders, pastors, and ministers who now serve faithfully across the UK and beyond.",
  },
  {
    title: "Established Kingsborough Centre",
    text: "Built a permanent home for worship, outreach, and community impact that continues to serve the city.",
  },
  {
    title: "Launched Global Outreach",
    text: "Extended the church's reach through missions, media ministry, and community programmes across nations.",
  },
  {
    title: "A Legacy of Teaching",
    text: "Left a body of biblical teaching, sermons, and publications that continue to disciple new generations.",
  },
  {
    title: "Built a Culture of Prayer",
    text: "Championed a lifestyle of prayer and intercession that remains the spiritual anchor of the church today.",
  },
];

const GOALS = [
  {
    title: "Raise a Prophetic Generation",
    text: "Continuing his desire to see believers equipped with spiritual authority, discernment, and boldness.",
  },
  {
    title: "Expand Community Impact",
    text: "Growing outreach efforts so more people encounter God's love beyond the walls of the church.",
  },
  {
    title: "Strengthen Discipleship",
    text: "Deepening pathways for every member to grow in faith, character, and purpose.",
  },
  {
    title: "Complete the Building Project",
    text: "Fulfilling his vision of a permanent home for worship and community for generations to come.",
  },
];

const PILLARS = [
  {
    title: "What He Believed",
    text: "He believed the Gospel is the power of God for transformation, and that every life can be restored through Christ.",
  },
  {
    title: "His Vision",
    text: "He envisioned a church that was prayerful, evangelistic, and deeply rooted in biblical truth and practical discipleship.",
  },
  {
    title: "His Values",
    text: "His ministry was shaped by humility, integrity, compassion, prayer, and a relentless desire to see people flourish in purpose.",
  },
];

// Set to a YouTube video ID (e.g. "dQw4w9WgXcQ") to embed the documentary. Leave empty to show "coming soon".
const DOCUMENTARY_VIDEO_ID = "";

const MEMORIAL_GALLERY = [
  "/uploads/gallery/Apst Preaching.JPG",
  "/uploads/gallery/Kingsborough Ordination/02_K3A0384.jpg",
  "/uploads/gallery/Kingsborough Ordination/04_K3A9888.jpg",
  "/uploads/gallery/Kingsborough Ordination/06_K3A0343.jpg",
  "/uploads/gallery/Kingsborough Ordination/09_K3A0363.jpg",
  "/uploads/gallery/Kingsborough Ordination/12_K3A0232.jpg",
  "/uploads/gallery/Kingsborough Ordination/16_K3A0115.jpg",
  "/uploads/gallery/Kingsborough Ordination/25_K3A0001.jpg",
];

const Apostle = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const visionSectionRef = useRef<HTMLDivElement>(null);
  const chapterRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const teaserRef = useRef<HTMLParagraphElement>(null);
  const accomplishmentsRef = useRef<HTMLDivElement>(null);
  const goalsRef = useRef<HTMLDivElement>(null);
  const pillarsRef = useRef<HTMLDivElement>(null);

  const apostle = leaders[0];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance
      gsap.from(heroContentRef.current, {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: "power2.out",
      });
      gsap.to(scrollIndicatorRef.current, {
        y: 10,
        repeat: -1,
        yoyo: true,
        duration: 1.5,
        ease: "power1.inOut",
      });

      // "Who He Was" split reveal
      if (storyRef.current) {
        const image = storyRef.current.querySelector(".story-image");
        const content = storyRef.current.querySelector(".story-content");
        if (image) {
          gsap.from(image, {
            opacity: 0,
            x: -60,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: { trigger: storyRef.current, start: "top 75%" },
          });
        }
        if (content) {
          gsap.from(content, {
            opacity: 0,
            x: 60,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: { trigger: storyRef.current, start: "top 75%" },
          });
        }
      }

      // Cinematic multi-chapter vision reveal, pinned while scrolling
      if (visionSectionRef.current) {
        const chapters = chapterRefs.current.filter(Boolean) as HTMLElement[];
        const dots = dotRefs.current.filter(Boolean) as HTMLElement[];
        const teaser = teaserRef.current;

        gsap.set(chapters, { opacity: 0, y: 40, scale: 0.96 });
        gsap.set(chapters[0], { opacity: 1, y: 0, scale: 1 });
        gsap.set(dots, { backgroundColor: "rgba(255,255,255,0.2)", scale: 1 });
        gsap.set(dots[0], { backgroundColor: "#D4AF37", scale: 1.4 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: visionSectionRef.current,
            start: "top top",
            end: `+=${chapters.length * 700}`,
            scrub: 0.6,
            pin: true,
          },
        });

        chapters.forEach((chapter, i) => {
          tl.to({}, { duration: 1 }); // hold on the current chapter
          if (i < chapters.length - 1) {
            const label = `swap${i}`;
            tl.addLabel(label);
            tl.to(chapter, { opacity: 0, y: -40, scale: 0.96, duration: 0.5 }, label);
            tl.to(chapters[i + 1], { opacity: 1, y: 0, scale: 1, duration: 0.5 }, label);
            tl.to(dots[i], { backgroundColor: "rgba(255,255,255,0.2)", scale: 1, duration: 0.3 }, label);
            tl.to(dots[i + 1], { backgroundColor: "#D4AF37", scale: 1.4, duration: 0.3 }, label);
            if (teaser) {
              tl.to(teaser, { opacity: 0, y: -8, duration: 0.25 }, label);
              tl.call(
                () => {
                  const upcoming = VISION_CHAPTERS[i + 2];
                  if (teaser) teaser.textContent = upcoming ? upcoming.text : "";
                },
                undefined,
                `${label}+=0.25`
              );
              tl.to(teaser, { opacity: VISION_CHAPTERS[i + 2] ? 0.3 : 0, y: 0, duration: 0.25 }, `${label}+=0.25`);
            }
          }
        });

        // Ambient floating particles and drifting glow orbs, independent of scroll
        gsap.utils.toArray<HTMLElement>(".vision-particle").forEach((el, i) => {
          gsap.to(el, {
            y: `+=${20 + (i % 5) * 8}`,
            x: `+=${(i % 2 === 0 ? 1 : -1) * (10 + (i % 4) * 6)}`,
            opacity: 0.2 + (i % 3) * 0.2,
            duration: 3 + (i % 4),
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: i * 0.15,
          });
        });
        gsap.to(".vision-orb", {
          x: 30,
          y: -20,
          duration: 8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          stagger: 1.5,
        });
      }

      // Accomplishments — staggered cards
      if (accomplishmentsRef.current) {
        gsap.from(accomplishmentsRef.current.children, {
          opacity: 0,
          y: 50,
          duration: 0.7,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: { trigger: accomplishmentsRef.current, start: "top 85%" },
        });
      }

      // Goals — staggered cards
      if (goalsRef.current) {
        gsap.from(goalsRef.current.children, {
          opacity: 0,
          y: 50,
          duration: 0.7,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: { trigger: goalsRef.current, start: "top 85%" },
        });
      }

      // Pillars — staggered cards
      if (pillarsRef.current) {
        gsap.from(pillarsRef.current.children, {
          opacity: 0,
          y: 30,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: { trigger: pillarsRef.current, start: "top 85%" },
        });
      }
    }, rootRef);

    const refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 1000);

    return () => {
      clearTimeout(refreshTimer);
      ctx.revert();
    };
  }, []);

  return (
    <div ref={rootRef}>
      <Helmet>
        <title>Apostle Tunde Balogun | Kingsborough Church</title>
        <meta
          name="description"
          content="The life, vision, and legacy of Apostle Tunde Balogun, founder of Kingsborough Church — his accomplishments, his goals, and the faith he poured into generations."
        />
      </Helmet>

      {/* Hero */}
      <section data-nav-theme="dark" className="relative h-screen w-full overflow-hidden">
        <img
          src={apostle.image}
          alt={apostle.name}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: "50% 20%" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />

        <div
          ref={heroContentRef}
          className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center"
        >
          <span className="mb-5 inline-block rounded-full border border-[#d4af37]/50 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#d4af37]">
            In Loving Memory
          </span>
          <h1 className="font-montserrat text-4xl font-bold uppercase tracking-tight text-white md:text-6xl lg:text-7xl">
            {apostle.name}
          </h1>
          <p className="mt-4 font-montserrat text-lg tracking-widest text-white/60">
            {apostle.years}
          </p>
          <p className="mt-2 font-montserrat text-sm font-semibold uppercase tracking-[0.2em] text-[#d4af37]">
            {apostle.role}, Kingsborough Church
          </p>
        </div>

        <div
          ref={scrollIndicatorRef}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer"
          onClick={() => scrollToElement("apostle-story")}
        >
          <div className="mb-2 text-sm font-light tracking-wider text-white">HIS STORY</div>
          <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full border-2 border-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* Who He Was */}
      <section id="apostle-story" ref={storyRef} className="overflow-hidden bg-white py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col items-center gap-10 lg:flex-row lg:gap-16">
            <div className="story-image w-full overflow-hidden rounded-lg shadow-2xl lg:w-1/2">
              <img
                src="/uploads/gallery/Apst Preaching.JPG"
                alt="Apostle Tunde Balogun preaching"
                className="h-96 w-full object-cover lg:h-[520px]"
                loading="lazy"
              />
            </div>
            <div className="story-content w-full lg:w-1/2">
              <span className="mb-3 inline-block text-xs font-montserrat font-bold uppercase tracking-[0.3em] text-gold">
                Who He Was
              </span>
              <h2 className="mb-6 font-montserrat text-3xl font-bold text-deepPurple md:text-5xl">
                A Man of Faith &amp; Vision
              </h2>
              <div className="h-1 w-24 bg-gold mb-8" />
              <p className="mb-6 text-lg leading-relaxed text-gray-700">{apostle.bio}</p>
            </div>
          </div>
        </div>
      </section>

      {/* His Vision — cinematic multi-chapter scroll reveal */}
      <section ref={visionSectionRef} className="relative h-screen w-full overflow-hidden bg-[#05040a]">
        {/* Ambient glow orbs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="vision-orb absolute -left-20 -top-32 h-96 w-96 rounded-full bg-gold/10 blur-3xl" />
          <div className="vision-orb absolute -right-10 bottom-0 h-[28rem] w-[28rem] rounded-full bg-deepPurple/50 blur-3xl" />
          <div className="vision-orb absolute right-1/4 top-1/3 h-64 w-64 rounded-full bg-gold/5 blur-2xl" />
        </div>

        {/* Floating gold particles */}
        <div className="pointer-events-none absolute inset-0">
          {Array.from({ length: 18 }).map((_, i) => (
            <span
              key={i}
              className="vision-particle absolute block h-1 w-1 rounded-full bg-gold/60"
              style={{ left: `${(i * 37) % 100}%`, top: `${(i * 53) % 100}%` }}
            />
          ))}
        </div>

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center lg:px-16">
          <div className="mb-10 flex items-center gap-3">
            <div className="h-px w-8 bg-gold" />
            <span className="font-montserrat text-xs font-semibold uppercase tracking-[0.3em] text-gold">
              His Vision
            </span>
            <div className="h-px w-8 bg-gold" />
          </div>

          <div className="relative flex h-[45vh] w-full max-w-5xl items-center justify-center">
            {VISION_CHAPTERS.map((chapter, i) => (
              <p
                key={chapter.text}
                ref={(el) => (chapterRefs.current[i] = el)}
                className="absolute inset-x-0 font-montserrat font-bold text-white"
                style={{ fontSize: "clamp(1.8rem, 4.5vw, 3.8rem)", lineHeight: 1.25 }}
              >
                {chapter.text.split(" ").map((word, w) => {
                  const bare = word.replace(/[^A-Z]/g, "");
                  const isKey = chapter.highlight.includes(bare);
                  return (
                    <span key={w} className="mr-[0.2em] inline-block" style={{ color: isKey ? "#D4AF37" : undefined }}>
                      {word}
                    </span>
                  );
                })}
              </p>
            ))}
          </div>

          {/* Standby line — the next chapter waiting in the wings, dimmed until it's called up */}
          <p
            ref={teaserRef}
            className="mt-6 max-w-2xl font-montserrat text-sm uppercase tracking-[0.15em] text-white/30"
          >
            {VISION_CHAPTERS[1].text}
          </p>
        </div>

        {/* Chapter progress dots */}
        <div className="absolute bottom-10 left-1/2 flex -translate-x-1/2 gap-2">
          {VISION_CHAPTERS.map((_, i) => (
            <span
              key={i}
              ref={(el) => (dotRefs.current[i] = el)}
              className="h-1.5 w-1.5 rounded-full bg-white/20"
            />
          ))}
        </div>
      </section>

      {/* Accomplishments */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={slideUp()}
            className="mb-14 text-center"
          >
            <h2 className="font-montserrat text-3xl font-bold text-deepPurple md:text-5xl">
              His Accomplishments
            </h2>
            <div className="mx-auto mt-6 h-1 w-20 bg-gold" />
          </motion.div>

          <div ref={accomplishmentsRef} className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {ACCOMPLISHMENTS.map((item, i) => (
              <div
                key={item.title}
                className="rounded-xl border border-gray-100 bg-gray-50 p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <span className="mb-3 block font-montserrat text-sm font-bold text-gold">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mb-2 font-montserrat text-lg font-bold text-deepPurple">{item.title}</h3>
                <p className="text-sm leading-relaxed text-gray-600">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Goals for the future */}
      <section className="bg-deepPurple/5 py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={slideUp()}
            className="mb-14 text-center"
          >
            <h2 className="font-montserrat text-3xl font-bold text-deepPurple md:text-5xl">
              Carrying His Goals Forward
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-600">
              His vision did not end with his passing — the church continues to pursue the goals he set in motion.
            </p>
            <div className="mx-auto mt-6 h-1 w-20 bg-gold" />
          </motion.div>

          <div ref={goalsRef} className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {GOALS.map((goal) => (
              <div key={goal.title} className="rounded-xl border-t-4 border-gold bg-white p-8 shadow-lg">
                <h3 className="mb-3 font-montserrat text-xl font-bold text-deepPurple">{goal.title}</h3>
                <p className="leading-relaxed text-gray-700">{goal.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="bg-[#070707] py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={slideUp()}
            className="mb-14 text-center"
          >
            <h2 className="font-montserrat text-3xl font-bold text-white md:text-5xl">His Legacy in Three Words</h2>
            <div className="mx-auto mt-6 h-1 w-20 bg-gold" />
          </motion.div>

          <div ref={pillarsRef} className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {PILLARS.map((pillar) => (
              <div key={pillar.title} className="rounded-lg border border-white/10 bg-white/5 p-6">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold">{pillar.title}</p>
                <p className="text-sm leading-relaxed text-white/70">{pillar.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Documentary & Pictures */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={slideUp()}
            className="mb-14 text-center"
          >
            <h2 className="font-montserrat text-3xl font-bold text-deepPurple md:text-5xl">
              His Life in Pictures &amp; Film
            </h2>
            <div className="mx-auto mt-6 h-1 w-20 bg-gold" />
          </motion.div>

          <div className="mx-auto mb-16 max-w-4xl">
            {DOCUMENTARY_VIDEO_ID ? (
              <div className="relative w-full overflow-hidden rounded-xl shadow-lg" style={{ paddingTop: "56.25%" }}>
                <iframe
                  src={`https://www.youtube.com/embed/${DOCUMENTARY_VIDEO_ID}`}
                  title="Apostle Tunde Balogun Documentary"
                  className="absolute inset-0 h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="flex aspect-video items-center justify-center rounded-xl border-2 border-dashed border-gold/40 bg-gray-50 px-6 text-center">
                <p className="text-gray-500">Documentary video coming soon.</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {MEMORIAL_GALLERY.map((src, i) => (
              <div key={src} className="aspect-square overflow-hidden rounded-lg">
                <img
                  src={src}
                  alt={`Apostle Tunde Balogun ${i + 1}`}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-20 text-center">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="mb-6 font-montserrat text-2xl font-bold text-deepPurple md:text-3xl">
            His Life Touched Many. Read Their Stories.
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/about"
              className="inline-flex items-center justify-center rounded-full border-2 border-deepPurple px-8 py-3 font-montserrat font-medium text-deepPurple transition-colors hover:bg-deepPurple hover:text-white"
            >
              About Kingsborough Church
            </Link>
            <a
              href="https://www.forevermissed.com/apostletunde-balogun/tributes"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gold px-8 py-3 font-montserrat font-medium text-deepPurple transition-colors hover:bg-gold/90"
            >
              View All Tributes
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Apostle;
