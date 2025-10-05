import { VideoCard } from "./VideoCard";
import { Card } from "@/components/ui/card";

interface Video {
  id: string;
  videoId: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
}

interface VideosSectionProps {
  title: string;
  videos: Video[];
  emptyMessage?: string;
}

export function VideosSection({ title, videos, emptyMessage = "No videos found" }: VideosSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      {videos.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">
          {emptyMessage}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((video) => (
            <VideoCard
              key={video.videoId}
              videoId={video.videoId}
              title={video.title}
              thumbnail={video.thumbnail}
              viewCount={video.viewCount || 0}
              likeCount={video.likeCount || 0}
              commentCount={video.commentCount || 0}
              publishedAt={video.publishedAt}
            />
          ))}
        </div>
      )}
    </div>
  );
}
