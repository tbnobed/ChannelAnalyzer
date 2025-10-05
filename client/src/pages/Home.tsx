import { useState } from "react";
import { ChannelInputForm } from "@/components/ChannelInputForm";
import { Dashboard } from "@/components/Dashboard";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface AnalysisResponse {
  analysis: {
    id: string;
    channelId: string;
    channelName: string;
    channelUrl: string;
    monthlyRevenue: number;
    profitMargin: number;
    mcnShare: number;
    avgViews: number;
    avgLikes: number;
    avgComments: number;
    engagementRate: number;
    riskLevel: string;
    totalSubscribers: number;
    subscriberGrowth: string;
    subscriberChartData: number[];
    subscriberChartLabels: string[];
    aiInsights: string;
    createdAt: string;
  };
  topVideos: Array<{
    id: string;
    videoId: string;
    title: string;
    thumbnail: string;
    publishedAt: string;
    viewCount: number;
    likeCount: number;
    commentCount: number;
  }>;
  recentVideos: Array<{
    id: string;
    videoId: string;
    title: string;
    thumbnail: string;
    publishedAt: string;
    viewCount: number;
    likeCount: number;
    commentCount: number;
  }>;
}

export default function Home() {
  const [showDashboard, setShowDashboard] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState<AnalysisResponse | null>(null);
  const { toast } = useToast();

  const handleAnalyze = async (url: string) => {
    setIsLoading(true);
    
    try {
      const response = await apiRequest("POST", "/api/analyze", {
        channelUrl: url,
      });

      const data = await response.json() as AnalysisResponse;
      setAnalysisData(data);
      setShowDashboard(true);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: error.message || "Failed to analyze channel. Please check the URL and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setShowDashboard(false);
    setAnalysisData(null);
  };

  if (!analysisData) {
    return (
      <div className="relative">
        <div className="absolute top-4 right-4 z-20">
          <ThemeToggle />
        </div>
        <ChannelInputForm onAnalyze={handleAnalyze} isLoading={isLoading} />
      </div>
    );
  }

  const { analysis, topVideos, recentVideos } = analysisData;

  const dashboardData = {
    revenue: {
      monthly: analysis.monthlyRevenue || 0,
      margin: analysis.profitMargin || 0,
      mcnShare: analysis.mcnShare || 0,
    },
    engagement: {
      views: analysis.avgViews || 0,
      likes: analysis.avgLikes || 0,
      comments: analysis.avgComments || 0,
      rate: analysis.engagementRate || 0,
    },
    risk: (analysis.riskLevel || "low") as "low" | "medium" | "high",
    subscribers: {
      current: analysis.totalSubscribers || 0,
      growth: analysis.subscriberGrowth || "+0%",
      chartData: analysis.subscriberChartData || [],
      chartLabels: analysis.subscriberChartLabels || [],
    },
    aiInsights: analysis.aiInsights || "No insights available.",
    timestamp: new Date(analysis.createdAt).toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }),
  };

  return (
    <Dashboard
      channelName={analysis.channelName}
      channelId={analysis.channelId}
      data={dashboardData}
      topVideos={topVideos}
      recentVideos={recentVideos}
      onBack={handleBack}
    />
  );
}
