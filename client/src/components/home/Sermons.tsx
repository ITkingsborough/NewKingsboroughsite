import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { slideUp, staggerContainer } from '@/lib/animations';
import { useQuery } from '@tanstack/react-query';
import { PlayCircle, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

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
  const { 
    data, 
    isLoading, 
    isError 
  } = useQuery<{ success: boolean, data: YouTubeVideo[] }>({
    queryKey: ['/api/youtube/videos', 'UCGYKC04rR0F7ajcuVQqupRQ', 'home'],
    queryFn: async () => {
      const response = await fetch(`/api/youtube/videos?channelId=UCGYKC04rR0F7ajcuVQqupRQ&maxResults=3`);
      if (!response.ok) {
        throw new Error('Failed to fetch YouTube videos');
      }
      return response.json();
    },
  });

  const videos = data?.data || [];
  
  // For formatting relative time (e.g., "2 days ago")
  const formatPublishedAt = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return 'Date unknown';
    }
  };

  const handleWatchClick = (videoId: string) => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
  };

  return (
    <section id="sermons" className="py-20 bg-lilac bg-opacity-10">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={slideUp()}
        >
          <h2 className="text-3xl md:text-4xl font-montserrat font-bold mb-6 text-deepPurple">
            Recent Sermons
          </h2>
          <p className="text-lg max-w-3xl mx-auto">
            Missed a Sunday? Catch up on our latest messages or explore our sermon archive.
          </p>
        </motion.div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array(3).fill(0).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-3" />
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <Skeleton className="h-16 w-full mb-4" />
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="text-center p-6 bg-red-50 rounded-lg">
            <h3 className="text-lg font-medium text-red-800">Failed to load sermons</h3>
            <p className="text-red-600 mb-4">
              We couldn't fetch the latest videos from our YouTube channel.
            </p>
            <Link href="/sermons" className="btn-primary">Go to Sermons Page</Link>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer()}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {videos.map((video, index) => (
              <motion.div 
                key={video.id} 
                className="bg-white rounded-lg shadow-md overflow-hidden card-hover"
                variants={slideUp((index + 1) * 0.1)}
                whileHover={{ 
                  y: -5,
                  boxShadow: "0px 10px 20px rgba(0,0,0,0.1)",
                  transition: { duration: 0.3 }
                }}
              >
                <div className="h-48 overflow-hidden relative bg-gray-200">
                  {/* Rendering YouTube thumbnail for video */}
                  <img 
                    src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                    alt={video.title} 
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      console.error("Failed to load image:", e);
                      e.currentTarget.src = video.thumbnails?.medium?.url || '';
                    }}
                  />
                  <div className="absolute inset-0 bg-deepPurple bg-opacity-40 flex items-center justify-center">
                    <button 
                      onClick={() => handleWatchClick(video.id)}
                      className="text-white bg-gold bg-opacity-90 rounded-full w-14 h-14 flex items-center justify-center transform transition-transform duration-300 hover:scale-110"
                      aria-label="Play sermon"
                    >
                      <PlayCircle className="h-8 w-8" />
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-montserrat font-semibold line-clamp-2">{video.title}</h3>
                    <span className="text-xs whitespace-nowrap bg-lilac bg-opacity-30 text-deepPurple px-2 py-1 rounded">
                      {formatPublishedAt(video.publishedAt)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" /> {formatPublishedAt(video.publishedAt)}
                  </p>
                  <p className="mb-6 text-sm line-clamp-3">{video.description}</p>
                  <div className="flex space-x-3">
                    <button 
                      onClick={() => handleWatchClick(video.id)}
                      className="text-gold font-montserrat font-medium hover:underline inline-flex items-center"
                    >
                      <PlayCircle className="w-5 h-5 mr-1" /> Watch
                    </button>
                    <a 
                      href={`https://www.youtube.com/channel/UCGYKC04rR0F7ajcuVQqupRQ`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gold font-montserrat font-medium hover:underline inline-flex items-center"
                    >
                      More Sermons
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
        
        <motion.div 
          className="text-center mt-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={slideUp(0.3)}
        >
          <Link href="/sermons" className="btn-primary">View Sermon Archive</Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Sermons;
