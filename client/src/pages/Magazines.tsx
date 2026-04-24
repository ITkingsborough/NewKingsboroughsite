import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { slideUp } from '@/lib/animations';
import { MagazineItem } from '@/lib/types';
import { magazines as staticMagazines } from '@/lib/data';

const MagazinesPage = () => {
  const { data, isLoading, error } = useQuery<{ success: boolean; data: MagazineItem[] }>({
    queryKey: ['/api/magazines'],
    staleTime: 5 * 60 * 1000,
  });

  const magazines = (data?.data?.length ? data.data : staticMagazines)
    .slice()
    .sort((a, b) => b.id - a.id);

  const featuredMagazine = magazines[0];
  const archiveMagazines = magazines.slice(1);

  return (
    <>
      <Helmet>
        <title>Magazines | Kingsborough Church</title>
        <meta
          name="description"
          content="Browse every published issue of Connect Magazine from Kingsborough Church, featuring stories, testimonies, and pastoral insight."
        />
      </Helmet>

      <div className="pt-24 bg-white min-h-screen">
        <section
          data-nav-theme="dark"
          className="relative overflow-hidden bg-slate-950 py-24 md:py-32"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(212,175,55,0.18),_transparent_28%),radial-gradient(circle_at_80%_20%,_rgba(139,92,246,0.18),_transparent_28%),linear-gradient(180deg,_#14082b_0%,_#09090b_100%)]" />
          <div className="absolute left-[-6rem] top-16 h-64 w-64 rounded-full bg-gold/20 blur-3xl" />
          <div className="absolute right-[-6rem] bottom-10 h-64 w-64 rounded-full bg-fuchsia-500/10 blur-3xl" />

          <div className="container relative z-10 mx-auto px-4 lg:px-8">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={slideUp()}
              className="mx-auto max-w-4xl text-center"
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-gold backdrop-blur-sm">
                <span className="h-2 w-2 rounded-full bg-gold" />
                Publication Archive
              </div>
              <h1 className="mb-6 text-4xl font-montserrat font-bold text-white md:text-6xl">
                Connect Magazine Archive
              </h1>
              <p className="mx-auto max-w-2xl text-lg text-white/75 md:text-xl">
                Explore every published issue of Connect Magazine and catch up on church stories, testimonies, pastoral encouragement, and moments from the life of Kingsborough.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 lg:px-8">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="mb-4 h-12 w-12 animate-spin text-gold" />
                <p className="text-darkGray">Loading magazines...</p>
              </div>
            ) : error ? (
              <div className="mx-auto max-w-2xl rounded-3xl border border-red-100 bg-red-50 p-8 text-center">
                <h2 className="mb-3 text-2xl font-montserrat font-semibold text-deepPurple">
                  Unable to load magazines
                </h2>
                <p className="text-gray-600">
                  Please try again later or contact the church office if the issue continues.
                </p>
              </div>
            ) : magazines.length === 0 ? (
              <div className="mx-auto max-w-2xl rounded-3xl border border-gray-200 bg-gray-50 p-8 text-center">
                <h2 className="mb-3 text-2xl font-montserrat font-semibold text-deepPurple">
                  No magazines available yet
                </h2>
                <p className="text-gray-600">Check back soon for published issues.</p>
              </div>
            ) : (
              <div className="space-y-16">
                {featuredMagazine && (
                  <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={slideUp()}
                    className="grid grid-cols-1 items-center gap-8 overflow-hidden rounded-[2rem] bg-slate-950 p-6 shadow-[0_30px_90px_rgba(0,0,0,0.16)] md:p-8 lg:grid-cols-[360px_minmax(0,1fr)] lg:gap-12"
                  >
                    <a
                      href={featuredMagazine.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block"
                    >
                      <div className="relative mx-auto max-w-[340px]">
                        <div className="absolute inset-x-10 bottom-0 top-8 rounded-[2rem] bg-gold/25 blur-2xl opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
                        <div className="relative aspect-[1/1.414] overflow-hidden rounded-[1.75rem] border border-white/10 shadow-[0_24px_70px_rgba(0,0,0,0.45)] transition-transform duration-500 group-hover:-translate-y-2 group-hover:rotate-[1deg]">
                          <img
                            src={featuredMagazine.coverImage}
                            alt={featuredMagazine.title}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                          />
                          <div className="absolute inset-0 bg-gradient-to-tr from-black/25 via-transparent to-white/20 mix-blend-screen" />
                          <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/10 bg-black/45 p-4 backdrop-blur-md">
                            <p className="mb-1 text-xs uppercase tracking-[0.28em] text-gold">Latest Issue</p>
                            <p className="line-clamp-2 text-lg font-montserrat font-semibold text-white">
                              {featuredMagazine.title}
                            </p>
                          </div>
                        </div>
                      </div>
                    </a>

                    <div className="text-white">
                      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-gold">
                        Featured Magazine
                      </p>
                      <h2 className="mb-4 text-3xl font-montserrat font-bold md:text-5xl">
                        {featuredMagazine.title}
                      </h2>
                      <p className="mb-6 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80">
                        {featuredMagazine.date}
                      </p>
                      <p className="mb-8 max-w-2xl text-lg leading-relaxed text-white/75">
                        {featuredMagazine.summary}
                      </p>
                      <a
                        href={featuredMagazine.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center rounded-full bg-gold px-7 py-3.5 font-semibold text-deepPurple transition-all duration-300 hover:scale-[1.02] hover:bg-white"
                      >
                        Read Latest Issue
                      </a>
                    </div>
                  </motion.div>
                )}

                <div>
                  <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={slideUp(0.1)}
                    className="mb-8"
                  >
                    <h2 className="mb-3 text-3xl font-montserrat font-bold text-deepPurple md:text-4xl">
                      All Published Issues
                    </h2>
                    <p className="max-w-2xl text-lg text-gray-600">
                      Browse the full Connect Magazine archive and open any issue to read online.
                    </p>
                  </motion.div>

                  <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
                    {magazines.map((magazine, index) => (
                      <motion.a
                        key={magazine.id}
                        href={magazine.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.15 }}
                        variants={slideUp(index * 0.06)}
                        className="group overflow-hidden rounded-[1.75rem] border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_24px_60px_rgba(0,0,0,0.12)]"
                      >
                        <div className="relative aspect-[1/0.78] overflow-hidden bg-slate-100">
                          <img
                            src={magazine.coverImage}
                            alt={magazine.title}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                          <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-deepPurple shadow-sm">
                            {magazine.date}
                          </div>
                        </div>

                        <div className="p-6">
                          <h3 className="mb-3 text-2xl font-montserrat font-bold text-deepPurple transition-colors group-hover:text-gold">
                            {magazine.title}
                          </h3>
                          <p className="mb-5 line-clamp-4 text-gray-600 leading-relaxed">
                            {magazine.summary}
                          </p>
                          <div className="inline-flex items-center font-semibold text-gold">
                            Open Magazine
                            <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                              <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                            </svg>
                          </div>
                        </div>
                      </motion.a>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default MagazinesPage;