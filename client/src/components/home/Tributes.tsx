import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { ExternalLink, Quote } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface Tribute {
  name: string;
  date: string;
  message: string;
}

// ── To add a new tribute: copy a tribute from forevermissed.com/apostletunde-balogun/tributes
// ── and paste the name, date, and message text below. ─────────────────────────────────────
const TRIBUTES: Tribute[] = [
  {
    name: "Prince Boluwatifekori O. Adesina",
    date: "Saturday, 23rd May 2026",
    message:
      "Today, with a heavy heart, I pay tribute to a man whose love, kindness, and generosity shaped the course of my life. Your late father adopted me and treated me not as an outsider, but as his own grandchild. Through him and the entire family, I found love, guidance, support, and a foundation that became the bedrock of who I am today. You all believed in me when life was still uncertain. You sent me to Film School to study what I love…",
  },
  {
    name: "Emmanuel Daudu",
    date: "Thursday, 21st May 2026",
    message:
      "I met Apostle Tunde Balogun in 2011, and from the very beginning, what endeared my family and me to him was his authenticity and humility. He was a man of genuine faith whose life consistently reflected the Christ he preached. Apostle Tunde was a visionary leader with a clear God-given mandate, which he pursued faithfully, strategically, and doggedly through every season. His passion for God's Kingdom was evident not only in what he said, but in everything he did…",
  },
];

const Tributes = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const tributes = TRIBUTES;

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      );

      if (gridRef.current) {
        gsap.fromTo(
          gridRef.current.children,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.12,
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 85%',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [tributes]);

  return (
    <section ref={sectionRef} className="bg-[#0f0a1e] py-20 px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-900/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-900/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Heading */}
        <div ref={headingRef} className="text-center mb-14">
          <div className="w-10 h-0.5 bg-amber-400 mx-auto mb-5" />
          <p className="text-amber-400 font-montserrat font-semibold text-sm uppercase tracking-widest mb-3">
            Lives Touched
          </p>
          <h2 className="text-3xl md:text-4xl font-montserrat font-bold text-white mb-4">
            Tributes to Apostle Tunde Balogun
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto text-base leading-relaxed">
            Messages of love and remembrance shared by those whose lives were transformed
            through his ministry and service.
          </p>
        </div>

        {/* Tributes grid */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tributes.map((tribute, index) => (
              <div
                key={index}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-4 hover:border-amber-400/30 hover:bg-white/[0.07] transition-all duration-300 group"
              >
                <Quote className="w-6 h-6 text-amber-400/60 flex-shrink-0" />
                <p className="text-white/75 text-sm leading-relaxed flex-1">
                  {tribute.message}
                  {tribute.message.length >= 300 && (
                    <span className="text-white/40 italic"> …</span>
                  )}
                </p>
                <div className="border-t border-white/10 pt-4 flex items-center justify-between">
                  <div>
                    <p className="text-white font-semibold text-sm">{tribute.name}</p>
                    {tribute.date && (
                      <p className="text-white/40 text-xs mt-0.5">{tribute.date}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

        {/* View all link */}
          <div className="text-center mt-10">
            <a
              href="https://www.forevermissed.com/apostletunde-balogun/tributes"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-amber-400/50 text-amber-400 hover:bg-amber-400 hover:text-black transition-all duration-300 rounded-full px-7 py-3 text-sm font-semibold font-montserrat"
            >
              View All Tributes
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
      </div>
    </section>
  );
};

export default Tributes;
