import { useRef, useState, useEffect } from 'react';

const FULL_TEXT =
  'WE CONNECT PEOPLE TO FAITH AND TO EACH OTHER. WE EQUIP EVERY BELIEVER TO GROW AND LEAD. WE DEPLOY THEM INTO THE WORLD TO MAKE A DIFFERENCE.';

const WORDS = FULL_TEXT.split(' ');

// Words to highlight in gold when lit
const HIGHLIGHTED = new Set(['CONNECT', 'EQUIP', 'DEPLOY']);

const BG_IMAGES = [
  '/uploads/gallery/HOP.jpg',
  '/uploads/gallery/Kingsmen.png',
  '/uploads/gallery/PE.jpg',
];

export default function OurStoryScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const { top, height } = el.getBoundingClientRect();
      const viewH = window.innerHeight;
      const scrollable = height - viewH;
      if (scrollable <= 0) return;
      const scrolled = Math.max(0, -top);
      setProgress(Math.min(1, scrolled / scrollable));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const litCount = Math.round(progress * WORDS.length);
  const activeImg = progress < 0.33 ? 0 : progress < 0.66 ? 1 : 2;

  return (
    <section ref={containerRef} style={{ height: '300vh' }} className="relative">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center">

        {/* Background images — opacity crossfade, no filter on individual layers */}
        <div className="absolute inset-0">
          {BG_IMAGES.map((src, i) => (
            <div
              key={i}
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url('${src}')`,
                opacity: activeImg === i ? 1 : 0,
                transition: 'opacity 1.2s ease-in-out',
              }}
            />
          ))}
          {/* Single unified dark overlay */}
          <div className="absolute inset-0 bg-black/55" />
        </div>

        {/* Gradient vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/60 pointer-events-none z-10" />

        <div className="relative z-20 container mx-auto px-6 lg:px-16">
          {/* Section eyebrow */}
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px w-8 bg-gold" />
            <span className="text-gold font-montserrat text-xs font-semibold tracking-[0.3em] uppercase">
              Our Story
            </span>
          </div>

          {/* Progressive word-by-word text */}
          <p
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(2.6rem, 6.5vw, 7rem)',
              letterSpacing: '0.05em',
              lineHeight: 1.08,
            }}
          >
            {WORDS.map((word, i) => {
              const isLit = i < litCount;
              // Strip trailing punctuation to check against the set
              const bare = word.replace(/[^A-Z]/g, '');
              const isKey = HIGHLIGHTED.has(bare);
              return (
                <span
                  key={i}
                  className="inline-block mr-[0.18em] transition-colors duration-300"
                  style={{
                    color: isLit
                      ? isKey ? '#D4AF37' : '#ffffff'
                      : 'rgba(255,255,255,0.15)',
                    transitionDelay: `${Math.min(i * 8, 120)}ms`,
                  }}
                >
                  {word}
                </span>
              );
            })}
          </p>
        </div>

        {/* Gold scroll progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/10 z-20">
          <div
            className="h-full bg-gold transition-all duration-100"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>
    </section>
  );
}

