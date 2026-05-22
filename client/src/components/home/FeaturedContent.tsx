import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { PlayCircle, ChevronRight, Tv2 } from 'lucide-react';
import { slideUp, staggerContainer } from '@/lib/animations';
import { Skeleton } from '@/components/ui/skeleton';

interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnails: {
    default: { url: string };
    medium: { url: string };
    high: { url: string };
    standard?: { url: string };
    maxres?: { url: string };
  };
  channelTitle: string;
}

const LIFE_EVER_AFTER_CHANNEL_ID = 'UClrk3wKBN-M5Y-NNXpdeNaA';

const FeaturedContent = () => {
  const { data: videoData, isLoading: videoLoading } = useQuery<{
    success: boolean;
    data: YouTubeVideo[];
  }>({
    queryKey: ['/api/youtube/videos', LIFE_EVER_AFTER_CHANNEL_ID, 'lea'],
    queryFn: async () => {
      const response = await fetch(
        `/api/youtube/videos?channelId=${LIFE_EVER_AFTER_CHANNEL_ID}&maxResults=1&order=date`,
      );
      if (!response.ok) throw new Error('Failed to fetch');
      return response.json();
    },
  });

  const latestVideo = videoData?.data?.[0];

  const getThumbnail = (video: YouTubeVideo) => {
    const t = video.thumbnails;
    return t.maxres?.url || t.standard?.url || t.high?.url || t.medium?.url || t.default?.url
      || `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch {
      return '';
    }
  };

  return (
    <section
      id="featured-content"
      data-nav-theme="dark"
      className="py-24 bg-white relative overflow-hidden"
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle, #4c006D 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />

      <div className="container mx-auto px-4 lg:px-8 relative">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={slideUp()}
        >
          <span className="inline-block text-gold font-montserrat font-semibold text-sm uppercase tracking-widest mb-3">
            Featured This Month
          </span>
          <h2 className="text-3xl md:text-4xl font-montserrat font-bold text-deepPurple">
            Stay Spiritually Connected
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Catch the latest episode of our marriage talk show.
          </p>
        </motion.div>

        <motion.div
          className="max-w-3xl mx-auto"
          variants={staggerContainer()}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {/* Life Ever After Marriage — full width */}
          <motion.div variants={slideUp(0.1)} className="flex">
            <div className="flex flex-col w-full rounded-2xl overflow-hidden shadow-xl group">
              {/* Header bar */}
              <div className="bg-[#1a1a1a] px-8 py-5 flex items-center gap-3">
                <Tv2 className="w-5 h-5 text-[#FF0000] shrink-0" />
                <span className="text-white font-montserrat font-semibold text-sm uppercase tracking-widest">
                  Life Ever After Marriage
                </span>
                <span className="ml-auto text-xs text-white/50 font-montserrat">Latest Episode</span>
              </div>

              {/* Video area */}
              <div className="flex-1 flex flex-col bg-[#111]">
                {videoLoading ? (
                  <Skeleton className="w-full aspect-video bg-white/10" />
                ) : latestVideo ? (
                  <>
                    {/* Thumbnail with play overlay */}
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={getThumbnail(latestVideo)}
                        alt={latestVideo.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            `https://img.youtube.com/vi/${latestVideo.id}/hqdefault.jpg`;
                        }}
                      />
                      {/* Dark overlay + play button */}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <a
                          href={`https://www.youtube.com/watch?v=${latestVideo.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Watch latest episode"
                          className="w-20 h-20 rounded-full bg-[#FF0000] flex items-center justify-center
                                     shadow-2xl transform transition-all duration-300 hover:scale-110 hover:bg-[#cc0000]"
                        >
                          <PlayCircle className="w-10 h-10 text-white" />
                        </a>
                      </div>
                      {/* NEW badge */}
                      <span className="absolute top-4 left-4 bg-[#FF0000] text-white text-xs font-montserrat font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                        New
                      </span>
                    </div>

                    {/* Info strip */}
                    <div className="px-8 py-6 flex flex-col flex-1">
                      <p className="text-white/50 text-xs font-montserrat uppercase tracking-widest mb-2">
                        {formatDate(latestVideo.publishedAt)}
                      </p>
                      <h3 className="text-white font-montserrat font-semibold text-xl leading-snug line-clamp-2 mb-3">
                        {latestVideo.title}
                      </h3>
                      <p className="text-white/60 text-sm line-clamp-2 mb-6 flex-1">
                        {latestVideo.description}
                      </p>
                      <div className="flex items-center gap-4 mt-auto">
                        <a
                          href={`https://www.youtube.com/watch?v=${latestVideo.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-[#FF0000] hover:bg-[#cc0000] text-white
                                     font-montserrat font-semibold text-sm px-5 py-2.5 rounded-full
                                     transition-colors duration-300"
                        >
                          <PlayCircle className="w-4 h-4" />
                          Watch Now
                        </a>
                        <a
                          href={`https://www.youtube.com/channel/${LIFE_EVER_AFTER_CHANNEL_ID}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-white/60 hover:text-white
                                     font-montserrat text-sm transition-colors duration-300"
                        >
                          View Channel <ChevronRight className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center flex-1 py-16 text-center px-8">
                    <Tv2 className="w-12 h-12 text-white/20 mb-4" />
                    <p className="text-white/60 font-montserrat">
                      Could not load the latest episode.
                    </p>
                    <a
                      href={`https://www.youtube.com/channel/${LIFE_EVER_AFTER_CHANNEL_ID}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 text-[#FF0000] hover:text-[#ff4444] font-montserrat text-sm inline-flex items-center gap-1"
                    >
                      Visit Channel <ChevronRight className="w-4 h-4" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedContent;
