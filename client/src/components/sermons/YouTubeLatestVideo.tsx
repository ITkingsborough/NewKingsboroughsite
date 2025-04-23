import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { PlayCircle, Calendar, User } from 'lucide-react';
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

interface YouTubeLatestVideoProps {
  channelId: string;
}

export default function YouTubeLatestVideo({ channelId }: YouTubeLatestVideoProps) {
  const { 
    data, 
    isLoading, 
    isError 
  } = useQuery<{ success: boolean, data: YouTubeVideo[] }>({
    queryKey: ['/api/youtube/videos', channelId, 'latest'],
    queryFn: async () => {
      const response = await fetch(`/api/youtube/videos?channelId=${channelId}&maxResults=1`);
      if (!response.ok) {
        throw new Error('Failed to fetch latest YouTube video');
      }
      return response.json();
    },
  });

  const video = data?.data?.[0];
  
  // For formatting relative time (e.g., "2 days ago")
  const formatPublishedAt = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return 'Date unknown';
    }
  };

  if (isLoading) {
    return (
      <div className="relative overflow-hidden rounded-xl shadow-xl bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-5">
          <div className="lg:col-span-3 h-80 lg:h-auto">
            <Skeleton className="h-full w-full" />
          </div>
          <div className="lg:col-span-2 p-8">
            <Skeleton className="h-6 w-24 mb-4" />
            <Skeleton className="h-8 w-full mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-4" />
            <Skeleton className="h-20 w-full mb-4" />
            <div className="flex gap-3">
              <Skeleton className="h-10 w-28" />
              <Skeleton className="h-10 w-28" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !video) {
    return (
      <div className="text-center p-6 bg-red-50 rounded-xl border border-red-200">
        <h3 className="text-lg font-medium text-red-800">Failed to load latest sermon</h3>
        <p className="text-red-600">
          We couldn't fetch the latest video from Kingsborough Church YouTube channel.
        </p>
      </div>
    );
  }

  const handleWatchClick = () => {
    window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank');
  };

  return (
    <div className="relative overflow-hidden rounded-xl shadow-2xl group">
      <div className="grid grid-cols-1 lg:grid-cols-5">
        {/* Large Featured Image (3/5 width on large screens) */}
        <div className="featured-image lg:col-span-3 h-80 lg:h-auto overflow-hidden relative bg-gray-200">
          {/* YouTube featured video thumbnail */}
          <img 
            src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`}
            alt={video.title}
            className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
            onError={(e) => {
              console.log("Using fallback thumbnail for:", video.id);
              e.currentTarget.src = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;
            }}
          />
          {/* Play button overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button 
              onClick={handleWatchClick}
              className="w-20 h-20 rounded-full bg-gold flex items-center justify-center transform transition-transform duration-300 hover:scale-110"
              aria-label="Play sermon"
            >
              <PlayCircle className="h-10 w-10 text-white" />
            </button>
          </div>
        </div>
        
        {/* Content (2/5 width on large screens) */}
        <div className="featured-content lg:col-span-2 p-8 bg-white flex flex-col justify-center">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="bg-gold text-white text-xs px-3 py-1 rounded-full uppercase tracking-wider">
              Latest
            </span>
            <span className="text-xs bg-deepPurple/10 text-deepPurple px-3 py-1 rounded-full">
              {formatPublishedAt(video.publishedAt)}
            </span>
          </div>
          
          <h3 className="text-2xl md:text-3xl font-montserrat font-bold mb-3 text-deepPurple group-hover:text-gold transition-colors duration-300">
            {video.title}
          </h3>
          
          <p className="text-sm text-gray-600 mb-2 flex items-center">
            <User className="h-4 w-4 mr-2" />
            Pastor Tunde Balogun
          </p>
          
          <p className="text-sm text-gray-600 mb-4 flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            {formatPublishedAt(video.publishedAt)}
          </p>
          
          <p className="mb-6 text-gray-700 line-clamp-4">{video.description}</p>
          
          <div className="flex flex-wrap gap-3">
            <button 
              className="px-6 py-3 bg-gold text-white rounded-lg shadow-md hover:bg-deepPurple transition-colors duration-300 flex items-center"
              onClick={handleWatchClick}
            >
              <PlayCircle className="h-5 w-5 mr-2" />
              Watch Now
            </button>
            <a 
              href={`https://www.youtube.com/channel/${channelId}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:border-gold hover:text-gold transition-colors duration-300"
            >
              More Sermons
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}