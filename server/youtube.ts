interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
}

interface YouTubeChannel {
  id: string;
  title: string;
  subscriberCount: number;
}

export async function resolveChannelId(url: string, apiKey: string): Promise<string> {
  const channelIdMatch = url.match(/channel\/(UC[\w-]+)/);
  if (channelIdMatch) {
    return channelIdMatch[1];
  }

  const handleMatch = url.match(/@([\w-]+)/);
  if (handleMatch) {
    const handle = handleMatch[1];
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=${handle}&key=${apiKey}`
    );
    const data = await response.json();
    if (data.items && data.items.length > 0) {
      return data.items[0].id;
    }
  }

  const usernameMatch = url.match(/\/c\/([\w-]+)/);
  if (usernameMatch) {
    const username = usernameMatch[1];
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=id&forUsername=${username}&key=${apiKey}`
    );
    const data = await response.json();
    if (data.items && data.items.length > 0) {
      return data.items[0].id;
    }
  }

  throw new Error("Could not resolve channel ID from URL");
}

export async function getChannelInfo(channelId: string, apiKey: string): Promise<YouTubeChannel> {
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${apiKey}`
  );
  const data = await response.json();
  
  if (!data.items || data.items.length === 0) {
    throw new Error("Channel not found");
  }

  const channel = data.items[0];
  return {
    id: channel.id,
    title: channel.snippet.title,
    subscriberCount: parseInt(channel.statistics.subscriberCount || "0"),
  };
}

export async function getChannelVideos(
  channelId: string,
  apiKey: string,
  maxResults: number = 10
): Promise<YouTubeVideo[]> {
  const searchResponse = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=id&channelId=${channelId}&maxResults=${maxResults}&order=date&type=video&key=${apiKey}`
  );
  const searchData = await searchResponse.json();

  if (!searchData.items || searchData.items.length === 0) {
    return [];
  }

  const videoIds = searchData.items.map((item: any) => item.id.videoId).join(",");
  
  const videosResponse = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoIds}&key=${apiKey}`
  );
  const videosData = await videosResponse.json();

  return videosData.items.map((video: any) => ({
    id: video.id,
    title: video.snippet.title,
    thumbnail: video.snippet.thumbnails.medium.url,
    publishedAt: video.snippet.publishedAt,
    viewCount: parseInt(video.statistics.viewCount || "0"),
    likeCount: parseInt(video.statistics.likeCount || "0"),
    commentCount: parseInt(video.statistics.commentCount || "0"),
  }));
}

export async function getTopVideos(
  channelId: string,
  apiKey: string,
  maxResults: number = 5
): Promise<YouTubeVideo[]> {
  const searchResponse = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=id&channelId=${channelId}&maxResults=50&order=viewCount&type=video&key=${apiKey}`
  );
  const searchData = await searchResponse.json();

  if (!searchData.items || searchData.items.length === 0) {
    return [];
  }

  const videoIds = searchData.items.slice(0, maxResults).map((item: any) => item.id.videoId).join(",");
  
  const videosResponse = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoIds}&key=${apiKey}`
  );
  const videosData = await videosResponse.json();

  return videosData.items.map((video: any) => ({
    id: video.id,
    title: video.snippet.title,
    thumbnail: video.snippet.thumbnails.medium.url,
    publishedAt: video.snippet.publishedAt,
    viewCount: parseInt(video.statistics.viewCount || "0"),
    likeCount: parseInt(video.statistics.likeCount || "0"),
    commentCount: parseInt(video.statistics.commentCount || "0"),
  }));
}
