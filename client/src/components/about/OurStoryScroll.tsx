import { useRef, useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

const STEPS = ['CONNECT', 'EQUIP', 'DEPLOY'];

const BG_IMAGES = [
  '/uploads/gallery/Footer/_NM_1686.JPG',
  '/uploads/gallery/Equip.jpg',
  '/uploads/gallery/WhatsApp Image 2026-02-04 at 10.21.28.jpeg',
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
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-px w-8 bg-gold" />
            <span className="text-gold font-montserrat text-xs font-semibold tracking-[0.3em] uppercase">
              Our Mission
            </span>
          </div>

          {/* Progressive Connect → Equip → Deploy */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 md:gap-x-8 gap-y-2">
            {STEPS.map((word, i) => {
              const visible = i <= activeImg;
              return (
                <div key={word} className="flex items-center gap-x-4 md:gap-x-8">
                  {i > 0 && (
                    <ArrowRight
                      className="text-gold transition-all duration-700 ease-out w-[clamp(2rem,6vw,5rem)] h-[clamp(2rem,6vw,5rem)]"
                      strokeWidth={2.5}
                      style={{
                        opacity: visible ? 1 : 0,
                        transform: visible ? 'translateX(0)' : 'translateX(-20px)',
                      }}
                    />
                  )}
                  <span
                    className="text-gold transition-all duration-700 ease-out"
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: 'clamp(3.5rem, 11vw, 9rem)',
                      letterSpacing: '0.05em',
                      lineHeight: 1,
                      opacity: visible ? 1 : 0,
                      transform: visible ? 'translateY(0)' : 'translateY(30px)',
                    }}
                  >
                    {word}
                  </span>
                </div>
              );
            })}
          </div>
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

