import { Card } from "@/components/ui/card";
import { Eye, ThumbsUp, MessageCircle, ExternalLink } from "lucide-react";

interface VideoCardProps {
  videoId: string;
  title: string;
  thumbnail: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  publishedAt: string;
}

export function VideoCard({
  videoId,
  title,
  thumbnail,
  viewCount,
  likeCount,
  commentCount,
  publishedAt,
}: VideoCardProps) {
  const formatNumber = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toLocaleString();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Card className="overflow-hidden hover-elevate active-elevate-2 transition-all duration-200">
      <a
        href={`https://www.youtube.com/watch?v=${videoId}`}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
        data-testid={`link-video-${videoId}`}
      >
        <div className="relative aspect-video">
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2 bg-background/80 backdrop-blur p-1.5 rounded-md">
            <ExternalLink className="h-3 w-3" />
          </div>
        </div>
        <div className="p-3 space-y-2.5">
          <h4 className="font-semibold line-clamp-2 leading-snug text-sm" data-testid={`text-video-title-${videoId}`}>
            {title}
          </h4>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              <span>{formatNumber(viewCount)}</span>
            </div>
            <div className="flex items-center gap-1">
              <ThumbsUp className="h-3 w-3" />
              <span>{formatNumber(likeCount)}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="h-3 w-3" />
              <span>{formatNumber(commentCount)}</span>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            {formatDate(publishedAt)}
          </div>
        </div>
      </a>
    </Card>
  );
}
