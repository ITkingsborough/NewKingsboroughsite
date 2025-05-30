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
 * @param eventType - Type of videos to fetch ('live', 'completed', 'upcoming', or undefined for all)
 * @param order - Order to sort results ('date', 'relevance', 'title', 'viewCount', 'rating')
 * @returns Array of video objects
 */
export async function getLatestVideos(
  channelId: string,
  maxResults: number = 10,
  eventType?: 'live' | 'completed' | 'upcoming',
  order: string = 'date'
): Promise<YouTubeVideo[]> {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      throw new Error('YouTube API key is not configured');
    }

    // Check if channelId is a UC-prefixed ID or a username
    const isChannelId = channelId.startsWith('UC');
    const channelParam = isChannelId 
      ? `channelId=${channelId}`
      : `forUsername=${channelId}`;
    
    // Strategy for getting live videos: try multiple approaches
    if (eventType === 'live') {
      console.log(`[YouTube API] Searching for live videos with params: ${channelParam}`);
      
      // First, try to get currently live videos
      let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&${channelParam}&maxResults=${maxResults}&order=${order}&type=video&eventType=live&key=${apiKey}`;
      let response = await fetch(url);
      
      if (response.ok) {
        const liveData = await response.json() as any;
        if (liveData.items && liveData.items.length > 0) {
          console.log(`[YouTube API] Found ${liveData.items.length} live videos`);
          return processVideoItems(liveData.items);
        }
      }
      
      // If no live videos, try completed live streams
      console.log(`[YouTube API] No live videos found, trying completed live streams`);
      url = `https://www.googleapis.com/youtube/v3/search?part=snippet&${channelParam}&maxResults=${maxResults}&order=${order}&type=video&eventType=completed&key=${apiKey}`;
      response = await fetch(url);
      
      if (response.ok) {
        const completedData = await response.json() as any;
        if (completedData.items && completedData.items.length > 0) {
          console.log(`[YouTube API] Found ${completedData.items.length} completed live streams`);
          return processVideoItems(completedData.items);
        }
      }
      
      // If still no results, fall back to all videos
      console.log(`[YouTube API] No live streams found, falling back to all videos`);
    }
    
    // Build URL for regular video search or other event types
    let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&${channelParam}&maxResults=${maxResults}&order=${order}&type=video&key=${apiKey}`;
    
    if (eventType && eventType !== 'live') {
      url += `&eventType=${eventType}`;
    }
    
    console.log(`[YouTube API] Fetching videos with params: ${channelParam}, eventType: ${eventType || 'all'}, order: ${order}`);
    
    const response = await fetch(url);

    if (!response.ok) {
      let errorMessage = `YouTube API error: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage += ` - ${JSON.stringify(errorData)}`;
      } catch (e) {
        // If we can't parse the error as JSON, just use the status text
      }
      throw new Error(errorMessage);
    }

    const responseData = await response.json() as any;
    
    // Type safety check
    if (!responseData || typeof responseData !== 'object') {
      throw new Error('Invalid response from YouTube API: not an object');
    }
    
    if (!responseData.items || !Array.isArray(responseData.items)) {
      throw new Error('Invalid response from YouTube API: items is not an array');
    }
    
    return processVideoItems(responseData.items);

  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    // Return empty array on error
    return [];
  }
}

/**
 * Process video items from YouTube API response
 */
function processVideoItems(items: any[]): YouTubeVideo[] {
  const videos: YouTubeVideo[] = [];
  
  for (const item of items) {
    const videoItem = item as { 
      id?: { videoId?: string },
      snippet?: { 
        title?: string; 
        description?: string; 
        publishedAt?: string; 
        thumbnails?: any; 
        channelTitle?: string; 
      } 
    };
    
    if (videoItem && videoItem.id?.videoId && videoItem.snippet) {
      const snippet = videoItem.snippet;
      
      videos.push({
        id: videoItem.id.videoId || '',
        title: snippet.title || 'Untitled',
        description: snippet.description || '',
        publishedAt: snippet.publishedAt || new Date().toISOString(),
        thumbnails: snippet.thumbnails || {
          default: { url: '', width: 120, height: 90 },
          medium: { url: '', width: 320, height: 180 },
          high: { url: '', width: 480, height: 360 }
        },
        channelTitle: snippet.channelTitle || 'Unknown Channel'
      });
    }
  }

  return videos;
}

/**
 * Find YouTube channels by search term or channel name
 * @param query - The search term to look for (e.g., "Kingsborough Church")
 * @returns Array of channel objects
 */
export async function findChannel(query: string): Promise<any[]> {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      throw new Error('YouTube API key is not configured');
    }

    console.log(`[YouTube API] Searching for channel with query: ${query}`);
    
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=channel&key=${apiKey}`
    );

    if (!response.ok) {
      let errorMessage = `YouTube API error: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage += ` - ${JSON.stringify(errorData)}`;
      } catch (e) {
        // If we can't parse the error as JSON, just use the status text
      }
      throw new Error(errorMessage);
    }

    const responseData = await response.json() as any;
    
    // Type safety check
    if (!responseData || typeof responseData !== 'object') {
      return [];
    }
    
    if (!responseData.items || !Array.isArray(responseData.items)) {
      return [];
    }
    
    // Return the channel details from search results
    return responseData.items.map((item: any) => ({
      id: item.id.channelId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnails: item.snippet.thumbnails
    }));
    
  } catch (error) {
    console.error('Error searching for YouTube channel:', error);
    return [];
  }
}

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
      let errorMessage = `YouTube API error: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage += ` - ${JSON.stringify(errorData)}`;
      } catch (e) {
        // If we can't parse the error as JSON, just use the status text
      }
      throw new Error(errorMessage);
    }

    const responseData = await response.json() as any;
    
    // Type safety check
    if (!responseData || typeof responseData !== 'object') {
      return null;
    }
    
    if (!responseData.items || !Array.isArray(responseData.items) || responseData.items.length === 0) {
      return null;
    }

    const item = responseData.items[0];
    
    // Ensure snippet exists
    if (!item || typeof item !== 'object' || !('id' in item) || !('snippet' in item) || typeof item.snippet !== 'object') {
      return null;
    }
    
    const snippet = item.snippet as Record<string, any>;
    
    return {
      id: typeof item.id === 'string' ? item.id : String(item.id),
      title: snippet.title || 'Untitled',
      description: snippet.description || '',
      publishedAt: snippet.publishedAt || new Date().toISOString(),
      thumbnails: snippet.thumbnails || {
        default: { url: '', width: 120, height: 90 },
        medium: { url: '', width: 320, height: 180 },
        high: { url: '', width: 480, height: 360 }
      },
      channelTitle: snippet.channelTitle || 'Unknown Channel'
    };
  } catch (error) {
    console.error('Error fetching YouTube video details:', error);
    return null;
  }
}