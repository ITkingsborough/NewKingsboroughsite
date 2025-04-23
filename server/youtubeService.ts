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
    let response;
    try {
      console.log(`[YouTube API] Attempting with provided channel ID: ${channelId}`);
      
      // First, get the uploads playlist ID from the channel
      const channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${apiKey}`;
      const channelResponse = await fetch(channelUrl);
      
      if (!channelResponse.ok) {
        throw new Error(`Channel API error: ${channelResponse.status} ${channelResponse.statusText}`);
      }
      
      const channelData = await channelResponse.json() as any;
      if (!channelData.items || !channelData.items[0] || !channelData.items[0].contentDetails) {
        throw new Error('Invalid channel response');
      }
      
      const uploadsPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;
      console.log(`[YouTube API] Found uploads playlist ID: ${uploadsPlaylistId}`);
      
      // Now fetch videos from that playlist
      const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=${maxResults}&playlistId=${uploadsPlaylistId}&key=${apiKey}`;
      console.log(`[YouTube API] Fetching videos from uploads playlist`);
      
      response = await fetch(url);
    } catch (fetchError) {
      throw new Error(`Failed to connect to YouTube API: ${String(fetchError)}`);
    }

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

    let responseData;
    try {
      responseData = await response.json();
    } catch (jsonError) {
      throw new Error(`Failed to parse YouTube API response: ${String(jsonError)}`);
    }
    
    // Type safety check
    if (!responseData || typeof responseData !== 'object') {
      throw new Error('Invalid response from YouTube API: not an object');
    }
    
    const typedResponse = responseData as { items?: unknown[] };
    const items = typedResponse.items && Array.isArray(typedResponse.items) ? typedResponse.items : null;
    if (!Array.isArray(items)) {
      throw new Error('Invalid response from YouTube API: items is not an array');
    }
    
    // Transform the response into our video format
    const videos: YouTubeVideo[] = [];
    
    for (const item of items) {
      if (item && typeof item === 'object') {
        // Cast item to get proper type hints
        const typedItem = item as any;
        
        // PlaylistItems API returns snippet.resourceId.videoId instead of id.videoId
        if (typedItem.snippet && typedItem.snippet.resourceId && typedItem.snippet.resourceId.videoId) {
          const snippet = typedItem.snippet;
          
          // Skip live streams
          if (snippet.liveBroadcastContent === 'live') {
            console.log('[YouTube API] Skipping live stream:', snippet.title);
            continue;
          }
          
          videos.push({
            id: snippet.resourceId.videoId,
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

    const responseData = await response.json();
    
    // Type safety check
    if (!responseData || typeof responseData !== 'object') {
      return [];
    }
    
    const typedResponse = responseData as { items?: unknown[] };
    const items = typedResponse.items && Array.isArray(typedResponse.items) ? typedResponse.items : [];
    
    // Return the channel details from search results
    return items.map((item: any) => ({
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

    let response;
    try {
      response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`
      );
    } catch (fetchError) {
      throw new Error(`Failed to connect to YouTube API: ${String(fetchError)}`);
    }

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

    let responseData;
    try {
      responseData = await response.json();
    } catch (jsonError) {
      throw new Error(`Failed to parse YouTube API response: ${String(jsonError)}`);
    }
    
    // Type safety check
    if (!responseData || typeof responseData !== 'object') {
      return null;
    }
    
    const typedResponse = responseData as { items?: unknown[] };
    const items = typedResponse.items && Array.isArray(typedResponse.items) ? typedResponse.items : [];
    if (items.length === 0) {
      return null;
    }

    // Cast item to any for type safety
    const item = items[0] as any;
    
    // Ensure snippet exists
    if (!item || typeof item !== 'object' || !item.id || typeof item.snippet !== 'object') {
      return null;
    }
    
    const snippet = item.snippet;
    
    return {
      id: item.id,
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