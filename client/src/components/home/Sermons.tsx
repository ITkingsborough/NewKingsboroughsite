import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { slideUp, staggerContainer } from "@/lib/animations";
import { useQuery } from "@tanstack/react-query";
import { PlayCircle, Calendar, ArrowRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnails: {
    default: { url: string; width: number; height: number };
    medium: { url: string; width: number; height: number };
    high: { url: string; width: number; height: number };
    standard?: { url: string; width: number; height: number };
    maxres?: { url: string; width: number; height: number };
  };
  channelTitle: string;
}

const Sermons = () => {
  const [page, setPage] = useState(0);
  const videosPerPage = 3;

  const { data, isLoading, isError } = useQuery<{
    success: boolean;
    data: YouTubeVideo[];
  }>({
    queryKey: ["/api/youtube/videos", "UCGYKC04rR0F7ajcuVQqupRQ", "home"],
    queryFn: async () => {
      const response = await fetch(
        `/api/youtube/videos?channelId=UCGYKC04rR0F7ajcuVQqupRQ&type=video&eventType=live&order=date&maxResults=9`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch YouTube videos");
      }
      return response.json();
    },
  });

  const allVideos = data?.data || [];
  const totalPages = Math.ceil(allVideos.length / videosPerPage);
  const videos = allVideos.slice(
    page * videosPerPage,
    (page + 1) * videosPerPage,
  );

  const handlePreviousPage = () => {
    setPage((prev: number) => Math.max(0, prev - 1));
    document.querySelector('[data-sermons-grid]')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleNextPage = () => {
    setPage((prev: number) => Math.min(totalPages - 1, prev + 1));
    document.querySelector('[data-sermons-grid]')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // For formatting relative time (e.g., "2 days ago")
  const formatPublishedAt = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return "Date unknown";
    }
  };

  const handleWatchClick = (videoId: string, isLivestream: boolean = true) => {
    // Skip to 30 minutes (1800 seconds) for livestreams to jump past pre-show content
    const url = isLivestream 
      ? `https://www.youtube.com/watch?v=${videoId}&t=1800`
      : `https://www.youtube.com/watch?v=${videoId}`;
    window.open(url, "_blank");
  };

  const getThumbnailUrl = (video: YouTubeVideo): string => {
    const thumbnails = video.thumbnails;
    if (thumbnails?.maxres?.url) return thumbnails.maxres.url;
    if (thumbnails?.standard?.url) return thumbnails.standard.url;
    if (thumbnails?.high?.url) return thumbnails.high.url;
    if (thumbnails?.medium?.url) return thumbnails.medium.url;
    if (thumbnails?.default?.url) return thumbnails.default.url;
    return `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;
  };

  return (
    <section id="sermons" data-nav-theme="dark" className="py-24 bg-gradient-to-br from-deepPurple via-deepPurple to-deepPurple/95">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <motion.div
          className="mb-20 max-w-3xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={slideUp()}
        >
          <div className="inline-flex items-center gap-2 mb-4 bg-gold/20 px-4 py-2 rounded-full">
            <PlayCircle className="w-4 h-4 text-gold" />
            <span className="text-sm font-semibold text-gold uppercase tracking-wide">Latest Messages</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-montserrat font-bold mb-6 text-white leading-tight">
            Recent Sermons
          </h2>
          <p className="text-lg text-gray-300">
            Dive into our latest messages and grow spiritually. Watch sermons anytime, anywhere.
          </p>
        </motion.div>

        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array(3)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="group">
                  <Skeleton className="h-56 w-full rounded-xl mb-4" />
                  <Skeleton className="h-6 w-4/5 mb-3 rounded" />
                  <Skeleton className="h-4 w-3/5 mb-6 rounded" />
                  <Skeleton className="h-4 w-full rounded" />
                </div>
              ))}
          </div>
        ) : isError ? (
          <div className="text-center p-12 bg-white/10 backdrop-blur rounded-2xl border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-2">
              Unable to load sermons
            </h3>
            <p className="text-gray-300 mb-6">
              We couldn't fetch the latest videos. Please try again later.
            </p>
            <Link href="/sermons">
              <button className="inline-flex items-center gap-2 bg-gold text-deepPurple px-6 py-3 rounded-lg font-semibold hover:bg-gold/90 transition-colors">
                View Sermon Archive <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center p-12 bg-white/10 backdrop-blur rounded-2xl border border-white/20">
            <p className="text-gray-300">No sermons available at this time.</p>
          </div>
        ) : (
          <>
            {/* Cards Grid */}
            <motion.div
              key={`page-${page}`}
              data-sermons-grid
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
              variants={staggerContainer()}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              {videos.map((video, index) => (
                <motion.div
                  key={video.id}
                  className="group"
                  variants={slideUp((index + 1) * 0.1)}
                >
                  {/* Card Container */}
                  <div className="h-full flex flex-col bg-white/10 backdrop-blur border border-white/20 rounded-2xl overflow-hidden hover:border-gold/50 transition-all duration-300 hover:bg-white/15">
                    {/* Thumbnail Container */}
                    <div className="relative h-56 overflow-hidden bg-gradient-to-br from-gold/20 to-transparent">
                      <img
                        src={getThumbnailUrl(video)}
                        alt={video.title}
                        className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;
                        }}
                      />
                      {/* Overlay Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-deepPurple/80 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300" />
                      
                      {/* Play Button */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.button
                          onClick={() => handleWatchClick(video.id)}
                          className="bg-gold/90 hover:bg-gold text-deepPurple rounded-full w-16 h-16 flex items-center justify-center shadow-lg font-semibold text-sm transition-all duration-300 flex-col gap-1"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          aria-label="Play sermon"
                        >
                          <PlayCircle className="w-7 h-7" fill="currentColor" />
                        </motion.button>
                      </div>

                      {/* Date Badge */}
                      <div className="absolute top-4 right-4 bg-gold/90 text-deepPurple px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
                        {formatPublishedAt(video.publishedAt)}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col p-6">
                      <h3 className="text-lg font-montserrat font-bold text-white mb-3 line-clamp-2 group-hover:text-gold transition-colors">
                        {video.title}
                      </h3>
                      
                      <p className="text-sm text-gray-300 line-clamp-2 mb-4 flex-grow">
                        {video.description}
                      </p>

                      {/* Channel Info */}
                      <div className="flex items-center gap-2 mb-6 pt-4 border-t border-white/10">
                        <div className="w-8 h-8 bg-gradient-to-br from-gold to-gold/50 rounded-full flex items-center justify-center text-xs font-bold text-deepPurple">
                          {video.channelTitle.charAt(0)}
                        </div>
                        <div className="text-xs opacity-75 text-gray-300">{video.channelTitle}</div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <motion.button
                          onClick={() => handleWatchClick(video.id)}
                          className="flex-1 bg-gold text-deepPurple px-4 py-2 rounded-lg font-semibold text-sm hover:bg-gold/90 transition-colors flex items-center justify-center gap-2"
                          whileHover={{ y: -2 }}
                          whileTap={{ y: 0 }}
                        >
                          <PlayCircle className="w-4 h-4" />
                          Watch
                        </motion.button>
                        <motion.button
                          onClick={() => window.open(`https://www.youtube.com/watch?v=${video.id}`, "_blank")}
                          className="flex-1 border border-gold/30 text-gold px-4 py-2 rounded-lg font-semibold text-sm hover:border-gold hover:bg-gold/10 transition-all flex items-center justify-center gap-2"
                          whileHover={{ y: -2 }}
                          whileTap={{ y: 0 }}
                        >
                          <ArrowRight className="w-4 h-4" />
                          YouTube
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div
                className="flex justify-center gap-4 mb-12"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={slideUp(0.3)}
              >
                <motion.button
                  onClick={handlePreviousPage}
                  disabled={page === 0}
                  className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all ${
                    page === 0
                      ? "bg-white/5 text-gray-500 cursor-not-allowed"
                      : "bg-gold/20 text-gold border border-gold/30 hover:bg-gold hover:text-deepPurple hover:border-gold"
                  }`}
                  whileHover={page !== 0 ? { x: -4 } : {}}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </motion.button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <motion.button
                      key={i}
                      onClick={() => setPage(i)}
                      className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                        page === i
                          ? "bg-gold text-deepPurple"
                          : "bg-white/10 text-white hover:bg-white/20 border border-white/20"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {i + 1}
                    </motion.button>
                  ))}
                </div>

                <motion.button
                  onClick={handleNextPage}
                  disabled={page >= totalPages - 1}
                  className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all ${
                    page >= totalPages - 1
                      ? "bg-white/5 text-gray-500 cursor-not-allowed"
                      : "bg-gold/20 text-gold border border-gold/30 hover:bg-gold hover:text-deepPurple hover:border-gold"
                  }`}
                  whileHover={page < totalPages - 1 ? { x: 4 } : {}}
                >
                  Next
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.button>
              </motion.div>
            )}

            {/* CTA Button */}
            <motion.div
              className="text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={slideUp(0.4)}
            >
              <Link href="/sermons">
                <button className="inline-flex items-center gap-2 bg-gradient-to-r from-gold to-gold/80 text-deepPurple px-8 py-4 rounded-xl font-montserrat font-bold text-lg hover:from-gold hover:to-gold hover:shadow-2xl hover:shadow-gold/25 transition-all duration-300 transform hover:scale-105">
                  View Complete Sermon Archive
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
};

export default Sermons;
