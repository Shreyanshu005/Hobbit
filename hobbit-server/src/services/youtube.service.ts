import { google } from 'googleapis';
import type { YoutubeVideo } from '../types/plan.types';

const youtube = google.youtube('v3');

export const searchVideos = async (query: string, maxResults = 2): Promise<YoutubeVideo[]> => {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    console.warn('[youtube] Missing YOUTUBE_API_KEY. Skipping video enrichment.');
    return [];
  }

  try {
    const response = await youtube.search.list({
      key: apiKey,
      part: ['snippet'],
      q: query,
      maxResults,
      type: ['video'],
      relevanceLanguage: 'en',
      videoEmbeddable: 'true',
    });

    const items = response.data.items || [];
    return items.map((item) => ({
      videoId: item.id?.videoId || '',
      title: item.snippet?.title || '',
      channelName: item.snippet?.channelTitle || '',
      thumbnailUrl: item.snippet?.thumbnails?.medium?.url || '',
      url: `https://www.youtube.com/watch?v=${item.id?.videoId}`,
    }));
  } catch (error) {
    console.error(`[youtube] Search failed for query "${query}":`, error);
    return [];
  }
};
