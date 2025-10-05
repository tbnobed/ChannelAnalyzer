import { Card } from "@/components/ui/card";
import { BarChart3, Heart, MessageCircle, Eye } from "lucide-react";

interface EngagementCardProps {
  views: number;
  likes: number;
  comments: number;
  engagementRate: number;
}

export function EngagementCard({ views, likes, comments, engagementRate }: EngagementCardProps) {
  const formatNumber = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toLocaleString();
  };

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-6">
        <h3 className="text-lg font-semibold">Engagement Metrics</h3>
        <BarChart3 className="h-5 w-5 text-muted-foreground" />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Eye className="h-4 w-4" />
            <span>Avg. Views</span>
          </div>
          <div className="font-semibold" data-testid="text-avg-views">
            {formatNumber(views)}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Heart className="h-4 w-4" />
            <span>Avg. Likes</span>
          </div>
          <div className="font-semibold" data-testid="text-avg-likes">
            {formatNumber(likes)}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MessageCircle className="h-4 w-4" />
            <span>Avg. Comments</span>
          </div>
          <div className="font-semibold" data-testid="text-avg-comments">
            {formatNumber(comments)}
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Engagement Rate</span>
            <span className="text-lg font-bold text-chart-1" data-testid="text-engagement-rate">
              {engagementRate}%
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
