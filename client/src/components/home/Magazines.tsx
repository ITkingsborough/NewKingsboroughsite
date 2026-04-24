import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { MagazineItem } from '@/lib/types';
import { magazines as staticMagazines } from '@/lib/data';

gsap.registerPlugin(ScrollTrigger);

const Magazines = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  const { data: magazinesData, isLoading, error } = useQuery<{ success: boolean; data: MagazineItem[] }>({
    queryKey: ['/api/magazines/featured'],
    staleTime: 5 * 60 * 1000,
  });

  const magazines = magazinesData?.data?.length ? magazinesData.data : staticMagazines;
  const currentMagazine = magazines[currentIndex];

  const nextMagazine = () => {
    if (!magazines.length) return;
    setCurrentIndex((prev) => (prev + 1) % magazines.length);
  };

  const prevMagazine = () => {
    if (!magazines.length) return;
    setCurrentIndex((prev) => (prev - 1 + magazines.length) % magazines.length);
  };

  useEffect(() => {
    if (!sectionRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });

    tl.fromTo(
      headingRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
    ).fromTo(
      textRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
      '-=0.5',
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      data-nav-theme="light"
      className="relative overflow-hidden bg-slate-950 py-24"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(212,175,55,0.18),_transparent_30%),radial-gradient(circle_at_80%_20%,_rgba(139,92,246,0.18),_transparent_28%),linear-gradient(180deg,_#0f0620_0%,_#09090b_52%,_#ffffff_100%)]" />
      <div className="absolute left-[-8rem] top-24 h-72 w-72 rounded-full bg-gold/15 blur-3xl" />
      <div className="absolute bottom-16 right-[-10rem] h-80 w-80 rounded-full bg-fuchsia-500/10 blur-3xl" />

      <div className="container relative z-10 mx-auto px-4 lg:px-8">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-gold backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-gold" />
            Editorial Feature
          </div>
          <h2
            ref={headingRef}
            className="mb-5 text-4xl font-montserrat font-bold text-white md:text-5xl lg:text-6xl"
          >
            Connect Magazine
          </h2>
          <p
            ref={textRef}
            className="mx-auto max-w-2xl text-lg text-white/75 md:text-xl"
          >
            Explore beautifully presented monthly issues filled with church stories, pastoral insight, testimonies, and moments from the life of Kingsborough.
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="mb-4 h-12 w-12 animate-spin text-gold" />
            <p className="text-white/70">Loading magazines...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 rounded-full bg-red-100 p-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-medium text-white">Unable to load magazines</h3>
            <p className="text-white/70">Please try again later or contact our church office.</p>
          </div>
        ) : magazines.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 rounded-full bg-blue-100 p-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-medium text-white">No magazines available</h3>
            <p className="text-white/70">Check back soon for our upcoming publications.</p>
          </div>
        ) : (
          <>
            <div className="relative">
              <button
                onClick={prevMagazine}
                className="absolute left-2 top-[32%] z-30 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white shadow-lg backdrop-blur-md transition-all hover:scale-105 hover:border-gold/60 hover:bg-gold hover:text-deepPurple md:flex lg:left-4"
                aria-label="Previous magazine"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={nextMagazine}
                className="absolute right-2 top-[32%] z-30 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white shadow-lg backdrop-blur-md transition-all hover:scale-105 hover:border-gold/60 hover:bg-gold hover:text-deepPurple md:flex lg:right-4"
                aria-label="Next magazine"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.55, ease: 'easeInOut' }}
                  className="grid grid-cols-1 items-stretch gap-8"
                >
                  <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-[0_30px_100px_rgba(0,0,0,0.35)] backdrop-blur-xl md:p-7">
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" />

                    <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-[minmax(280px,360px)_minmax(0,1fr)]">
                      <a href={currentMagazine.pdfUrl} target="_blank" rel="noopener noreferrer" className="block">
                        <div className="group relative mx-auto w-full max-w-[360px] perspective-[1000px]">
                          <div className="absolute inset-x-10 bottom-0 top-6 rounded-[2rem] bg-gold/30 blur-2xl opacity-70 transition-opacity duration-500 group-hover:opacity-100" />
                          <div className="relative aspect-[1/1.414] overflow-hidden rounded-[1.75rem] border border-white/15 bg-slate-900 shadow-[0_24px_70px_rgba(0,0,0,0.4)] transition-transform duration-500 group-hover:-translate-y-2 group-hover:rotate-[1deg]">
                            <img
                              src={currentMagazine.coverImage}
                              alt={`${currentMagazine.title} Magazine Cover`}
                              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-tr from-black/25 via-transparent to-white/20 mix-blend-screen" />
                            <div className="absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-black/40 to-transparent" />
                            <div className="absolute right-4 top-4 rounded-full border border-white/20 bg-black/40 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-white backdrop-blur-md">
                              {currentMagazine.date}
                            </div>
                            <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/10 bg-black/45 p-4 backdrop-blur-md">
                              <p className="mb-1 text-xs uppercase tracking-[0.3em] text-gold">Latest Issue</p>
                              <p className="line-clamp-2 text-lg font-montserrat font-semibold text-white">{currentMagazine.title}</p>
                            </div>
                          </div>
                        </div>
                      </a>

                      <div className="text-white">
                        <div className="mb-5 inline-flex items-center rounded-full border border-gold/25 bg-gold/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-gold">
                          Monthly Publication
                        </div>

                        <h3 className="mb-4 text-3xl font-montserrat font-bold leading-tight text-white md:text-4xl xl:text-5xl">
                          {currentMagazine.title}
                        </h3>

                        <p className="mb-8 max-w-xl text-base leading-relaxed text-white/75 md:text-lg">
                          {currentMagazine.summary}
                        </p>

                        <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
                          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                            <p className="mb-2 text-[11px] uppercase tracking-[0.3em] text-white/45">Edition</p>
                            <p className="text-lg font-semibold text-white">{String(currentIndex + 1).padStart(2, '0')}</p>
                          </div>
                          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                            <p className="mb-2 text-[11px] uppercase tracking-[0.3em] text-white/45">Published</p>
                            <p className="text-lg font-semibold text-white">{currentMagazine.date}</p>
                          </div>
                          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                            <p className="mb-2 text-[11px] uppercase tracking-[0.3em] text-white/45">Available Issues</p>
                            <p className="text-lg font-semibold text-white">{magazines.length}</p>
                          </div>
                        </div>

                        <div className="mb-8 flex flex-col gap-4 sm:flex-row">
                          <a
                            href={currentMagazine.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center rounded-full bg-gold px-7 py-3.5 font-semibold text-deepPurple transition-all duration-300 hover:scale-[1.02] hover:bg-white"
                          >
                            Open Magazine
                            <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                              <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                            </svg>
                          </a>

                          <Link
                            href="/magazines"
                            className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-7 py-3.5 font-semibold text-white transition-all duration-300 hover:border-gold/60 hover:bg-white/10"
                          >
                            View All Issues
                          </Link>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                          <p className="mb-3 text-sm uppercase tracking-[0.25em] text-white/40">Why read Connect</p>
                          <div className="grid grid-cols-1 gap-3 text-sm text-white/70 sm:grid-cols-2">
                            <div className="flex items-start gap-3">
                              <span className="mt-1 h-2 w-2 rounded-full bg-gold" />
                              Inspiring stories from the Kingsborough community
                            </div>
                            <div className="flex items-start gap-3">
                              <span className="mt-1 h-2 w-2 rounded-full bg-gold" />
                              Pastoral encouragement and spiritual reflections
                            </div>
                            <div className="flex items-start gap-3">
                              <span className="mt-1 h-2 w-2 rounded-full bg-gold" />
                              Beautifully designed issues available online
                            </div>
                            <div className="flex items-start gap-3">
                              <span className="mt-1 h-2 w-2 rounded-full bg-gold" />
                              A great way to stay connected through the month
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-10 rounded-[2rem] border border-white/10 bg-white/5 p-4 shadow-[0_20px_80px_rgba(0,0,0,0.18)] backdrop-blur-xl md:p-5">
              <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="mb-2 text-xs uppercase tracking-[0.3em] text-gold">Issue Library</p>
                  <h4 className="text-xl font-montserrat font-semibold text-white">Explore recent editions</h4>
                </div>

                <div className="flex items-center gap-3 md:hidden">
                  <button
                    onClick={prevMagazine}
                    className="h-11 w-11 rounded-full border border-white/10 bg-white/10 text-white transition-colors hover:bg-gold hover:text-deepPurple"
                    aria-label="Previous magazine mobile"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={nextMagazine}
                    className="h-11 w-11 rounded-full border border-white/10 bg-white/10 text-white transition-colors hover:bg-gold hover:text-deepPurple"
                    aria-label="Next magazine mobile"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {magazines.map((magazine, idx) => (
                  <button
                    key={`${magazine.title}-${idx}`}
                    onClick={() => setCurrentIndex(idx)}
                    className={`group overflow-hidden rounded-[1.5rem] border p-3 text-left transition-all duration-300 ${
                      idx === currentIndex
                        ? 'border-gold/70 bg-white/10 shadow-[0_12px_30px_rgba(212,175,55,0.18)]'
                        : 'border-white/10 bg-black/15 hover:border-white/25 hover:bg-white/8'
                    }`}
                    aria-label={`Go to magazine ${idx + 1}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative h-24 w-16 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/5">
                        <img
                          src={magazine.coverImage}
                          alt={magazine.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="mb-2 text-[11px] uppercase tracking-[0.25em] text-gold">{magazine.date}</p>
                        <h5 className="mb-2 line-clamp-2 font-montserrat font-semibold text-white">
                          {magazine.title}
                        </h5>
                        <p className="line-clamp-2 text-sm text-white/60">
                          {magazine.summary}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Magazines;