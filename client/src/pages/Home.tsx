import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChannelInputForm } from "@/components/ChannelInputForm";
import { Dashboard } from "@/components/Dashboard";
import { ThemeToggle } from "@/components/ThemeToggle";
import { RecentAnalyses } from "@/components/RecentAnalyses";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

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
  const { user, logout } = useAuth();

  const { data: recentAnalyses = [], isLoading: isLoadingAnalyses } = useQuery<any[]>({
    queryKey: ["/api/analyses"],
  });

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

  const handleSelectAnalysis = async (analysisId: string) => {
    setIsLoading(true);
    try {
      const [analysisResponse, videosResponse] = await Promise.all([
        apiRequest("GET", `/api/analyses`),
        apiRequest("GET", `/api/analyses/${analysisId}/videos`)
      ]);

      const analyses = await analysisResponse.json();
      const analysis = analyses.find((a: any) => a.id === analysisId);
      const videos = await videosResponse.json();

      if (!analysis) {
        throw new Error("Analysis not found");
      }

      const topVideos = videos.filter((v: any) => v.isTopVideo === 1);
      const recentVideos = videos.filter((v: any) => v.isTopVideo === 0);

      setAnalysisData({
        analysis,
        topVideos,
        recentVideos,
      });
      setShowDashboard(true);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to Load Analysis",
        description: error.message || "Could not load the analysis data.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Logout Failed",
        description: error.message || "Failed to logout",
      });
    }
  };

  if (!analysisData) {
    return (
      <div className="min-h-screen">
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          <div className="text-sm text-muted-foreground mr-2">
            {user?.username}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            data-testid="button-logout"
          >
            <LogOut className="h-4 w-4" />
          </Button>
          <ThemeToggle />
        </div>
        <ChannelInputForm onAnalyze={handleAnalyze} isLoading={isLoading} />
        
        <div className="px-4 md:px-8 pb-12">
          {isLoadingAnalyses && (
            <div className="text-center text-muted-foreground">
              Loading recent analyses...
            </div>
          )}
          
          {!isLoadingAnalyses && recentAnalyses.length === 0 && (
            <div className="text-center text-muted-foreground">
              No recent analyses. Analyze a channel to get started!
            </div>
          )}
          
          {!isLoadingAnalyses && recentAnalyses.length > 0 && (
            <RecentAnalyses 
              analyses={recentAnalyses} 
              onSelect={handleSelectAnalysis}
              isLoading={isLoading}
            />
          )}
        </div>
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
