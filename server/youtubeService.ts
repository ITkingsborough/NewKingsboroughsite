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
      const errorData = await response.json();
      throw new Error(`YouTube API error: ${JSON.stringify(errorData)}`);
    }

    // Parse the response
    const responseData = await response.json() as any;
    
    // Type safety check
    if (!responseData || !Array.isArray(responseData.items)) {
      throw new Error('Invalid response from YouTube API');
    }
    
    // Transform the response into our video format
    const videos: YouTubeVideo[] = [];
    for (const item of responseData.items as any[]) {
      if (item && item.id && item.id.videoId && item.snippet) {
        videos.push({
          id: item.id.videoId,
          title: item.snippet.title || 'Untitled',
          description: item.snippet.description || '',
          publishedAt: item.snippet.publishedAt || new Date().toISOString(),
          thumbnails: item.snippet.thumbnails || {
            default: { url: '', width: 120, height: 90 },
            medium: { url: '', width: 320, height: 180 },
            high: { url: '', width: 480, height: 360 }
          },
          channelTitle: item.snippet.channelTitle || 'Unknown Channel'
        });
      }
    }

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
      const errorData = await response.json();
      throw new Error(`YouTube API error: ${JSON.stringify(errorData)}`);
    }

    // Parse the response
    const responseData = await response.json();
    
    // Type safety check
    if (!responseData || !Array.isArray(responseData.items) || responseData.items.length === 0) {
      return null;
    }

    const item = responseData.items[0];
    
    // Ensure snippet exists
    if (!item || !item.id || !item.snippet) {
      return null;
    }
    
    return {
      id: item.id,
      title: item.snippet.title || 'Untitled',
      description: item.snippet.description || '',
      publishedAt: item.snippet.publishedAt || new Date().toISOString(),
      thumbnails: item.snippet.thumbnails || {
        default: { url: '', width: 120, height: 90 },
        medium: { url: '', width: 320, height: 180 },
        high: { url: '', width: 480, height: 360 }
      },
      channelTitle: item.snippet.channelTitle || 'Unknown Channel'
    };
  } catch (error) {
    console.error('Error fetching YouTube video details:', error);
    return null;
  }
}