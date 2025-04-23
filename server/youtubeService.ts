import fetch from 'node-fetch';

// Types for YouTube API responses
export interface YouTubeVideo {
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

export interface YouTubeApiResponse {
  items: YouTubeVideo[];
  nextPageToken?: string;
  prevPageToken?: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
}

// Cache to reduce API calls
let videoCache: {
  videos: YouTubeVideo[];
  timestamp: number;
} | null = null;

// Cache duration in milliseconds (1 hour)
const CACHE_DURATION = 60 * 60 * 1000;

/**
 * Fetch latest videos from a YouTube channel
 * @param channelId - The YouTube channel ID
 * @param maxResults - Maximum number of results to return (default: 10)
 * @returns Array of video objects
 */
export async function getLatestVideos(
  channelId: string,
  maxResults: number = 10
): Promise<YouTubeVideo[]> {
  // Check cache first
  if (
    videoCache &&
    Date.now() - videoCache.timestamp < CACHE_DURATION
  ) {
    return videoCache.videos;
  }

  try {
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      throw new Error('YouTube API key is not configured');
    }

    // Make the API request to get videos from channel
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=${maxResults}&order=date&type=video&key=${apiKey}`
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`YouTube API error: ${JSON.stringify(error)}`);
    }

    const data = await response.json();
    
    // Transform the response into our video format
    const videos: YouTubeVideo[] = data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      publishedAt: item.snippet.publishedAt,
      thumbnails: item.snippet.thumbnails,
      channelTitle: item.snippet.channelTitle
    }));

    // Update cache
    videoCache = {
      videos,
      timestamp: Date.now()
    };

    return videos;
  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    // Return empty array or cached data if available
    return videoCache?.videos || [];
  }
}

/**
 * Get details for a specific YouTube video
 * @param videoId - The YouTube video ID
 * @returns Video details object
 */
export async function getVideoDetails(videoId: string): Promise<YouTubeVideo | null> {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      throw new Error('YouTube API key is not configured');
    }

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`YouTube API error: ${JSON.stringify(error)}`);
    }

    const data = await response.json();
    
    if (!data.items || data.items.length === 0) {
      return null;
    }

    const item = data.items[0];
    return {
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      publishedAt: item.snippet.publishedAt,
      thumbnails: item.snippet.thumbnails,
      channelTitle: item.snippet.channelTitle
    };
  } catch (error) {
    console.error('Error fetching YouTube video details:', error);
    return null;
  }
}