import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PlayCircle, Calendar, ChevronRight, ChevronLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

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

interface YouTubeVideoListProps {
  channelId?: string;
  maxVideos?: number;
}

export default function YouTubeVideoList({ 
  channelId = 'KingsboroughLiveTv', // Default channel ID for Kingsborough Church
  maxVideos = 6 
}: YouTubeVideoListProps) {
  const [currentVideo, setCurrentVideo] = useState<YouTubeVideo | null>(null);
  const [page, setPage] = useState(0);
  const videosPerPage = 3;

  const { 
    data, 
    isLoading, 
    isError, 
    error 
  } = useQuery<{ success: boolean, data: YouTubeVideo[] }>({
    queryKey: ['/api/youtube/videos', channelId],
    queryFn: async () => {
      const response = await fetch(`/api/youtube/videos?channelId=${channelId}&maxResults=${maxVideos}`);
      if (!response.ok) {
        throw new Error('Failed to fetch YouTube videos');
      }
      return response.json();
    },
  });

  const videos = data?.data || [];
  const totalPages = Math.ceil(videos.length / videosPerPage);
  const displayedVideos = videos.slice(page * videosPerPage, (page + 1) * videosPerPage);

  const handlePreviousPage = () => {
    setPage(prev => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setPage(prev => Math.min(totalPages - 1, prev + 1));
  };

  const handleVideoSelect = (video: YouTubeVideo) => {
    setCurrentVideo(video);
  };

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
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-center mb-6">Latest Sermons</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array(3).fill(0).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-4">
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center p-6 bg-red-50 rounded-lg border border-red-200">
        <h3 className="text-lg font-medium text-red-800">Failed to load sermons</h3>
        <p className="text-red-600">{error instanceof Error ? error.message : 'Unknown error'}</p>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="text-center p-6 bg-amber-50 rounded-lg border border-amber-200">
        <h3 className="text-lg font-medium text-amber-800">No sermons available</h3>
        <p className="text-amber-600">Please check back later for new content.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {currentVideo && (
        <div className="mb-8 bg-black rounded-lg overflow-hidden shadow-xl">
          <div className="relative pb-[56.25%] h-0">
            <iframe
              src={`https://www.youtube.com/embed/${currentVideo.id}?autoplay=1`}
              className="absolute top-0 left-0 w-full h-full"
              title={currentVideo.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <div className="p-4 bg-white dark:bg-gray-900">
            <h3 className="text-xl font-bold">{currentVideo.title}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
              <Calendar className="w-4 h-4" /> 
              <span>{formatPublishedAt(currentVideo.publishedAt)}</span>
            </div>
            <p className="mt-3 text-gray-600 dark:text-gray-300">{currentVideo.description}</p>
          </div>
        </div>
      )}

      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Latest Sermons</h2>
          {totalPages > 1 && (
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handlePreviousPage}
                disabled={page === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Previous
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleNextPage}
                disabled={page >= totalPages - 1}
              >
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayedVideos.map((video) => (
            <Card 
              key={video.id} 
              className="overflow-hidden hover:shadow-md transition-shadow duration-300 cursor-pointer"
              onClick={() => handleVideoSelect(video)}
            >
              <div className="relative">
                <img 
                  src={video.thumbnails.high.url || video.thumbnails.medium.url} 
                  alt={video.title}
                  className="w-full aspect-video object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <PlayCircle className="w-16 h-16 text-white" />
                </div>
                <Badge className="absolute top-2 right-2 bg-red-600">
                  {formatPublishedAt(video.publishedAt)}
                </Badge>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold line-clamp-2 mb-2">{video.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2">{video.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}