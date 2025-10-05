import { MetricCard } from "./MetricCard";
import { RevenueCard } from "./RevenueCard";
import { EngagementCard } from "./EngagementCard";
import { RiskBadge } from "./RiskBadge";
import { SubscriberChart } from "./SubscriberChart";
import { AIInsights } from "./AIInsights";
import { VideosSection } from "./VideosSection";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar } from "lucide-react";

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

interface DashboardProps {
  channelName: string;
  channelId: string;
  data: {
    revenue: {
      monthly: number;
      margin: number;
      mcnShare: number;
    };
    engagement: {
      views: number;
      likes: number;
      comments: number;
      rate: number;
    };
    risk: "low" | "medium" | "high";
    subscribers: {
      current: number;
      growth: string;
      chartData: number[];
      chartLabels: string[];
    };
    aiInsights: string;
    timestamp: string;
  };
  topVideos?: Video[];
  recentVideos?: Video[];
  onBack: () => void;
}

export function Dashboard({ channelName, channelId, data, topVideos = [], recentVideos = [], onBack }: DashboardProps) {
  const formatNumber = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(2)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toLocaleString();
  };

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur border-b">
        <div className="px-4 md:px-8 py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <Button
              variant="ghost"
              onClick={onBack}
              data-testid="button-back"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Analyze Another
            </Button>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{data.timestamp}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
            <div>
              <h1 className="text-2xl font-bold mb-2" data-testid="text-channel-name">
                {channelName}
              </h1>
              <code className="text-sm font-mono text-muted-foreground" data-testid="text-channel-id">
                {channelId}
              </code>
            </div>
            <RiskBadge level={data.risk} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <RevenueCard
            monthlyRevenue={data.revenue.monthly}
            margin={data.revenue.margin}
            mcnShare={data.revenue.mcnShare}
          />
          <EngagementCard
            views={data.engagement.views}
            likes={data.engagement.likes}
            comments={data.engagement.comments}
            engagementRate={data.engagement.rate}
          />
          <MetricCard
            title="Total Subscribers"
            value={formatNumber(data.subscribers.current)}
            subtitle="Current subscriber count"
            trend={{
              value: data.subscribers.growth,
              isPositive: true,
            }}
          />
        </div>

        <div className="mb-6">
          <SubscriberChart
            data={data.subscribers.chartData}
            labels={data.subscribers.chartLabels}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AIInsights insights={data.aiInsights} />
          </div>
        </div>

        {topVideos.length > 0 && (
          <div className="mt-8">
            <VideosSection
              title="Top Performing Videos"
              videos={topVideos}
              emptyMessage="No top videos available"
            />
          </div>
        )}

        {recentVideos.length > 0 && (
          <div className="mt-8">
            <VideosSection
              title="Recent Videos"
              videos={recentVideos}
              emptyMessage="No recent videos available"
            />
          </div>
        )}
      </div>
    </div>
  );
}
