import { motion, AnimatePresence } from 'framer-motion';
import { slideUp } from '@/lib/animations';
import { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Search, Play, X, Home as HomeIcon, ListVideo, Radio, ExternalLink } from 'lucide-react';

const CHANNEL_ID = 'UCGYKC04rR0F7ajcuVQqupRQ';

interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnails: {
    default: { url: string };
    medium: { url: string };
    high: { url: string };
    maxres?: { url: string };
  };
  channelTitle: string;
  duration?: string;
}

const topics = ['Thanksgiving', 'Pure Worship', 'Family and Friends', 'Prayer Vigil', 'Special Anointing Service'];

function getTopic(video: YouTubeVideo, topics: string[]): string {
  const haystack = `${video.title} ${video.description}`.toLowerCase();
  const match = topics.find(topic => haystack.includes(topic.toLowerCase()));
  return match || 'Sermon';
}

function formatCardDate(dateString: string): string {
  const date = new Date(dateString);
  const day = date.getDate();
  const suffix = day % 10 === 1 && day !== 11 ? 'st' : day % 10 === 2 && day !== 12 ? 'nd' : day % 10 === 3 && day !== 13 ? 'rd' : 'th';
  const month = date.toLocaleString('en-GB', { month: 'short' });
  return `${month} ${day}${suffix}`;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

const Sermons = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [activeVideo, setActiveVideo] = useState<YouTubeVideo | null>(null);

  const { data, isLoading, isError } = useQuery<{ success: boolean; data: YouTubeVideo[] }>({
    queryKey: ['/api/youtube/videos', CHANNEL_ID, 'archive'],
    queryFn: async () => {
      const response = await fetch(`/api/youtube/videos?channelId=${CHANNEL_ID}&type=video&eventType=completed&order=date&maxResults=24`);
      if (!response.ok) throw new Error('Failed to fetch sermons');
      return response.json();
    },
  });

  const videos = data?.data || [];

  const filteredVideos = useMemo(() => {
    return videos.filter(video => {
      if (activeTopic && getTopic(video, topics) !== activeTopic) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          video.title.toLowerCase().includes(query) ||
          video.description.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [videos, activeTopic, searchQuery]);

  return (
    <>
      <Helmet>
        <title>Sermon Archive | Kingsborough Church</title>
        <meta name="description" content="Browse the full Kingsborough Church sermon archive. Watch and search powerful messages from Apostle Tunde and Pastor Toyin Balogun." />
      </Helmet>

      <div data-nav-theme="dark" className="bg-[#0a0a0a] pt-24 text-white">
        <div className="flex flex-col lg:flex-row">

          {/* Sidebar */}
          <aside className="hidden w-56 shrink-0 flex-col justify-between border-r border-white/10 px-6 py-8 lg:flex">
            <div>
              <div className="mb-10 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-gold text-lg font-bold text-gold">
                  ∞
                </div>
                <span className="font-montserrat text-sm font-bold uppercase tracking-[0.15em]">Sermons</span>
              </div>

              <nav className="space-y-1">
                <Link href="/" className="flex items-center gap-3 rounded-lg bg-white/10 px-3 py-2.5 text-sm font-medium text-white">
                  <HomeIcon className="h-4 w-4" /> Home
                </Link>
                <a href="#sermon-grid" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-white">
                  <ListVideo className="h-4 w-4" /> Series
                </a>
                <a
                  href="https://www.youtube.com/@KingsboroughLiveTv/streams"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-white"
                >
                  <Radio className="h-4 w-4" /> Live
                </a>
              </nav>
            </div>

            <a
              href="https://www.youtube.com/@KingsboroughLiveTv"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-medium text-white/60 transition-colors hover:text-gold"
            >
              Visit Channel <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </aside>

          {/* Main content */}
          <div className="flex-1 px-5 py-6 md:px-10 md:py-8">

            {/* Top bar */}
            <div className="mb-8 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 lg:hidden">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gold text-sm font-bold text-gold">∞</div>
                <span className="font-montserrat text-xs font-bold uppercase tracking-[0.15em]">Sermons</span>
              </div>
              <div className="relative ml-auto w-full max-w-md">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search sermons..."
                  className="w-full rounded-full bg-white/10 py-2.5 pl-11 pr-4 text-sm text-white outline-none ring-1 ring-white/10 placeholder:text-white/40 focus:ring-gold/60"
                />
              </div>
            </div>

            {/* Topic pills */}
            <div className="mb-10 flex gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => setActiveTopic(null)}
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-medium transition-colors ${
                  activeTopic === null ? 'bg-gold text-black' : 'bg-white/10 text-white/80 hover:bg-white/20'
                }`}
              >
                All
              </button>
              {topics.map(topic => (
                <button
                  key={topic}
                  onClick={() => setActiveTopic(prev => (prev === topic ? null : topic))}
                  className={`shrink-0 rounded-full px-4 py-2 text-xs font-medium transition-colors ${
                    activeTopic === topic ? 'bg-gold text-black' : 'bg-white/10 text-white/80 hover:bg-white/20'
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>

            {/* Greeting */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <h1 className="mb-1 font-montserrat text-2xl font-bold text-white md:text-3xl">{getGreeting()}</h1>
              <p className="text-lg text-white/60">{activeTopic ? `${activeTopic} Sermons` : 'Latest Sermons'}</p>
            </motion.div>

            {/* Grid */}
            <div id="sermon-grid">
              {isLoading && (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                  {Array(12).fill(0).map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="aspect-video w-full rounded-lg bg-white/10" />
                      <div className="mt-3 h-4 w-4/5 rounded bg-white/10" />
                      <div className="mt-2 h-3 w-2/5 rounded bg-white/10" />
                    </div>
                  ))}
                </div>
              )}

              {isError && (
                <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center">
                  <p className="mb-4 text-white/70">We couldn't load the sermon archive right now.</p>
                  <a
                    href="https://www.youtube.com/@KingsboroughLiveTv"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-black hover:bg-gold/90"
                  >
                    Visit our YouTube channel <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              )}

              {!isLoading && !isError && filteredVideos.length === 0 && (
                <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center">
                  <p className="mb-4 text-white/70">No sermons found for this filter yet.</p>
                  <button
                    onClick={() => { setActiveTopic(null); setSearchQuery(''); }}
                    className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/20"
                  >
                    Clear filters
                  </button>
                </div>
              )}

              {!isLoading && !isError && filteredVideos.length > 0 && (
                <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                  {filteredVideos.map((video, i) => (
                    <motion.button
                      key={video.id}
                      onClick={() => setActiveVideo(video)}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.4, delay: (i % 6) * 0.05 }}
                      className="group text-left"
                    >
                      <div className="relative overflow-hidden rounded-lg bg-white/5">
                        <img
                          src={video.thumbnails.high?.url || video.thumbnails.medium?.url}
                          alt={video.title}
                          className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                          <Play className="h-9 w-9 text-white" fill="white" />
                        </div>
                        {video.duration && (
                          <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-[10px] font-medium text-white">
                            {video.duration}
                          </span>
                        )}
                      </div>
                      <h3 className="mt-3 line-clamp-1 text-sm font-semibold text-white transition-colors group-hover:text-gold">
                        {video.title}
                      </h3>
                      <div className="mt-1 flex items-center justify-between">
                        <span className="text-xs text-white/50">{getTopic(video, topics)}</span>
                        <span className="text-xs text-white/50">{formatCardDate(video.publishedAt)}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Video modal */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
            onClick={() => setActiveVideo(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-4xl overflow-hidden rounded-xl bg-[#0a0a0a]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveVideo(null)}
                className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-gold hover:text-black"
                aria-label="Close video"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="relative h-0 pb-[56.25%]">
                <iframe
                  src={`https://www.youtube.com/embed/${activeVideo.id}?autoplay=1`}
                  className="absolute inset-0 h-full w-full"
                  title={activeVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="p-6">
                <h3 className="mb-2 font-montserrat text-xl font-bold text-white">{activeVideo.title}</h3>
                <p className="text-sm text-white/60">{formatCardDate(activeVideo.publishedAt)}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Never Miss a Message */}
      <section className="bg-deepPurple py-16 text-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={slideUp()}
              >
                <h2 className="mb-4 font-montserrat text-3xl font-bold md:text-4xl">Never Miss a Message</h2>
                <p className="mb-6 text-white/80">
                  Subscribe to receive new sermons directly in your inbox, or watch every message on our YouTube channel.
                </p>
                <a
                  href="https://www.youtube.com/@KingsboroughLiveTv"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 font-montserrat font-semibold text-deepPurple transition-colors hover:bg-gold/90"
                >
                  Subscribe on YouTube <ExternalLink className="h-4 w-4" />
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                <img
                  src="/uploads/gallery/HOP2.JPG"
                  alt="Person listening to a sermon"
                  className="rounded-xl shadow-2xl"
                />
                <div className="absolute -bottom-5 -right-5 rounded-lg bg-gold p-4 text-deepPurple shadow-lg">
                  <div className="text-2xl font-bold">300+</div>
                  <div className="text-sm">Sermons Available</div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Sermons;
