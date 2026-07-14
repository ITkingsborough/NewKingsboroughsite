import {
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
  useState,
} from 'react';
import styles from './ScrollJourney.module.css';

// ── Types ──────────────────────────────────────────────────────────────────────

export type JourneyItem = {
  id: number;
  eyebrow: string;
  title: string;
  description: string;
  image?: string;
};

// ── Sample data (replace with real content) ────────────────────────────────────

const journeyItems: JourneyItem[] = [
  {
    id: 1,
    eyebrow: 'The Beginning',
    title: 'A Vision Is Born',
    description:
      'What began as a small prayer meeting in a living room ignited a movement. A handful of passionate believers gathered with one conviction: that God was calling them to build a church that would transform lives and shape destinies.',
    image: '/uploads/gallery/Our Story.jpg',
  },
  {
    id: 2,
    eyebrow: 'First Roots',
    title: 'Finding a Home',
    description:
      "We moved into our first permanent space — a humble hall that quickly became a house of encounter. The walls couldn't contain what God was doing. Every Sunday, more lives were changed.",
    image: '/uploads/gallery/HOP.jpg',
  },
  {
    id: 3,
    eyebrow: 'Growing Family',
    title: 'A Community Formed',
    description:
      'Families were restored. Ministries were born. Kingsborough grew not just in numbers but in depth and purpose. Hadassah, Kingsmen, and the youth ministry each found their voice and their calling.',
    image: '/uploads/gallery/HOP2.JPG',
  },
  {
    id: 4,
    eyebrow: 'Reaching Further',
    title: 'City & Beyond',
    description:
      'Our vision expanded beyond our walls. Community outreach, missions partnerships, and digital ministry carried the message across cities and nations, with thousands joining our online family.',
    image: '/uploads/gallery/WhatsApp Image 2026-02-04 at 10.21.23.jpeg',
  },
  {
    id: 5,
    eyebrow: 'Today & Tomorrow',
    title: 'The Story Continues',
    description:
      'Kingsborough Church stands today as a vibrant, diverse community of believers — still growing, still hungry, still believing for more. The best chapters are still ahead of us.',
    image: '/uploads/gallery/Kingsborough Ordination/02_K3A0384.jpg',
  },
];

// ── Component ──────────────────────────────────────────────────────────────────

export default function ScrollJourney() {
  // ── DOM refs
  const sectionRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const bgPathRef = useRef<SVGPathElement>(null);
  const fgPathRef = useRef<SVGPathElement>(null);
  const glowRef = useRef<SVGCircleElement>(null);
  const markerEls = useRef<(HTMLDivElement | null)[]>([]);

  // ── Scroll / RAF state refs
  const rafRef = useRef<number>(0);
  const isNearRef = useRef(false);
  const frameScheduledRef = useRef(false);
  const pathLengthRef = useRef(0);
  const scrollProgressRef = useRef(0);
  const latestScrollYRef = useRef(0);
  const sectionTopRef = useRef(0);
  const sectionHeightRef = useRef(0);

  // ── React state (only active milestone index — changes are infrequent)
  const [activeIndex, setActiveIndex] = useState(-1);

  // ── Reduced-motion check
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Cache section measurements ─────────────────────────────────────────────
  const measureSection = useCallback(() => {
    const el = sectionRef.current;
    if (!el) return;
    sectionTopRef.current = el.getBoundingClientRect().top + window.scrollY;
    sectionHeightRef.current = el.offsetHeight;
  }, []);

  // ── Build SVG path through marker centres ──────────────────────────────────
  const computePath = useCallback(() => {
    const section = sectionRef.current;
    const svg = svgRef.current;
    const bg = bgPathRef.current;
    const fg = fgPathRef.current;
    if (!section || !svg || !bg || !fg) return;

    const w = section.offsetWidth;
    const h = section.offsetHeight;
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);

    const sRect = section.getBoundingClientRect();

    const pts: { x: number; y: number }[] = [];
    for (const el of markerEls.current) {
      if (!el) continue;
      const r = el.getBoundingClientRect();
      pts.push({
        x: r.left + r.width / 2 - sRect.left,
        y: r.top + r.height / 2 - sRect.top,
      });
    }
    if (pts.length < 2) return;

    const first = pts[0];
    const last = pts[pts.length - 1];
    const isMobile = w < 768;
    // Subtle horizontal wiggle on desktop, straight on mobile
    const wiggle = isMobile ? 0 : 28;

    let d = `M ${first.x} 0 L ${first.x} ${first.y} `;
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1];
      const b = pts[i];
      const dy = b.y - a.y;
      const side = i % 2 === 0 ? 1 : -1;
      const cp1x = a.x + side * wiggle;
      const cp2x = b.x - side * wiggle;
      d += `C ${cp1x} ${a.y + dy * 0.4} ${cp2x} ${b.y - dy * 0.4} ${b.x} ${b.y} `;
    }
    d += `L ${last.x} ${h}`;

    bg.setAttribute('d', d);
    fg.setAttribute('d', d);

    const len = fg.getTotalLength();
    pathLengthRef.current = len;

    if (prefersReducedMotion) {
      fg.style.strokeDasharray = '';
      fg.style.strokeDashoffset = '';
    } else {
      const progress = scrollProgressRef.current;
      fg.style.strokeDasharray = String(len);
      fg.style.strokeDashoffset = String(len * (1 - progress));
    }
  }, [prefersReducedMotion]);

  // ── Single animation-frame tick: update line + glow + active index ─────────
  const tick = useCallback(() => {
    frameScheduledRef.current = false;

    const scrollY = latestScrollYRef.current;
    const sTop = sectionTopRef.current;
    const sH = sectionHeightRef.current;
    const vH = window.innerHeight;

    const start = sTop - vH * 0.5;
    const end = sTop + sH - vH * 0.5;
    const raw = (scrollY - start) / (end - start);
    const progress = Math.min(Math.max(raw, 0), 1);
    scrollProgressRef.current = progress;

    if (!prefersReducedMotion) {
      const len = pathLengthRef.current;
      const fg = fgPathRef.current;
      if (fg && len > 0) {
        fg.style.strokeDashoffset = String(len * (1 - progress));
      }

      // Glow dot follows path tip
      const glow = glowRef.current;
      if (glow && fg && len > 0) {
        if (progress > 0.01 && progress < 0.99) {
          const pt = fg.getPointAtLength(len * progress);
          glow.setAttribute('cx', String(pt.x));
          glow.setAttribute('cy', String(pt.y));
          glow.style.opacity = '1';
        } else {
          glow.style.opacity = '0';
        }
      }
    }

    // Milestone activation (sparse state update)
    const n = journeyItems.length;
    let next = -1;
    for (let i = 0; i < n; i++) {
      if (progress >= i / (n - 1)) next = i;
    }
    setActiveIndex((prev) => (prev !== next ? next : prev));
  }, [prefersReducedMotion]);

  // ── Schedule a frame (deduplicated) ───────────────────────────────────────
  const scheduleFrame = useCallback(() => {
    if (!frameScheduledRef.current && isNearRef.current) {
      frameScheduledRef.current = true;
      rafRef.current = requestAnimationFrame(tick);
    }
  }, [tick]);

  const onScroll = useCallback(() => {
    latestScrollYRef.current = window.scrollY;
    scheduleFrame();
  }, [scheduleFrame]);

  // ── Initial synchronous measurement (before paint) ─────────────────────────
  useLayoutEffect(() => {
    measureSection();
    computePath();
    latestScrollYRef.current = window.scrollY;
    isNearRef.current = true;
    // Force-run tick synchronously so initial state is correct
    const sTop = sectionTopRef.current;
    const sH = sectionHeightRef.current;
    const vH = window.innerHeight;
    const start = sTop - vH * 0.5;
    const end = sTop + sH - vH * 0.5;
    const raw = (window.scrollY - start) / (end - start);
    const progress = Math.min(Math.max(raw, 0), 1);
    scrollProgressRef.current = progress;
    if (prefersReducedMotion) {
      setActiveIndex(journeyItems.length - 1);
    }
  }, []); // intentionally empty — runs once after first render

  // ── Persistent effects: listeners, ResizeObserver, IntersectionObserver ───
  useEffect(() => {
    window.addEventListener('scroll', onScroll, { passive: true });

    const ro = new ResizeObserver(() => {
      measureSection();
      computePath();
      latestScrollYRef.current = window.scrollY;
      scheduleFrame();
    });
    const section = sectionRef.current;
    if (section) ro.observe(section);

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          isNearRef.current = e.isIntersecting;
          if (e.isIntersecting) {
            latestScrollYRef.current = window.scrollY;
            scheduleFrame();
          }
        });
      },
      { rootMargin: '400px 0px 400px 0px' },
    );
    if (section) io.observe(section);

    document.fonts.ready.then(() => {
      measureSection();
      computePath();
      scheduleFrame();
    });

    return () => {
      window.removeEventListener('scroll', onScroll);
      ro.disconnect();
      io.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
  }, [onScroll, computePath, measureSection, scheduleFrame]);

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <section
      ref={sectionRef}
      className={styles.journey}
      aria-label="Kingsborough Church Journey Timeline"
    >
      {/* Decorative SVG journey line — hidden from assistive tech */}
      <svg
        ref={svgRef}
        className={styles.svg}
        aria-hidden="true"
        focusable="false"
      >
        <path ref={bgPathRef} className={styles.bgPath} />
        <path ref={fgPathRef} className={styles.fgPath} />
        <circle
          ref={glowRef}
          r="7"
          className={styles.glowDot}
          style={{ opacity: 0 }}
          aria-hidden="true"
        />
      </svg>

      {/* Section header */}
      <header className={styles.header}>
        <span className={styles.eyebrow}>Our Journey</span>
        <h2 className={styles.heading}>The Story So Far</h2>
        <p className={styles.subheading}>
          From a living room gathering to a city-wide movement —&nbsp;here is how we got here.
        </p>
      </header>

      {/* Timeline rows */}
      <div className={styles.milestones} role="list">
        {journeyItems.map((item, i) => {
          const isActive = i <= activeIndex;
          const isLeft = i % 2 === 0;

          return (
            <article
              key={item.id}
              role="listitem"
              className={`${styles.milestoneRow} ${isLeft ? styles.rowLeft : styles.rowRight}`}
            >
              {/* Milestone content card */}
              <div className={`${styles.card} ${isActive ? styles.cardActive : ''}`}>
                {item.image && (
                  <div className={styles.cardImgWrap}>
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className={styles.cardImg}
                      onLoad={() => {
                        measureSection();
                        computePath();
                        scheduleFrame();
                      }}
                    />
                  </div>
                )}
                <div className={styles.cardBody}>
                  <span className={styles.cardEyebrow}>{item.eyebrow}</span>
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                  <p className={styles.cardDesc}>{item.description}</p>
                </div>
              </div>

              {/* Milestone marker (positioned on the SVG line) */}
              <div className={styles.markerWrap}>
                <div
                  ref={(el) => { markerEls.current[i] = el; }}
                  className={`${styles.marker} ${isActive ? styles.markerActive : ''}`}
                  aria-label={`Step ${i + 1}: ${item.title}`}
                >
                  <span className={styles.markerNum}>{i + 1}</span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
