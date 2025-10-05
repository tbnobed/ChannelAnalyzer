import { useState } from "react";
import { ChannelInputForm } from "@/components/ChannelInputForm";
import { Dashboard } from "@/components/Dashboard";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Home() {
  const [showDashboard, setShowDashboard] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = (url: string) => {
    console.log("Analyzing channel:", url);
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      setShowDashboard(true);
    }, 1500);
  };

  const handleBack = () => {
    setShowDashboard(false);
  };

  const mockData = {
    revenue: {
      monthly: 1665,
      margin: 42.5,
      mcnShare: 15,
    },
    engagement: {
      views: 125000,
      likes: 8500,
      comments: 432,
      rate: 7.2,
    },
    risk: "low" as const,
    subscribers: {
      current: 1200000,
      growth: "15.3%",
      chartData: [950000, 980000, 1020000, 1100000, 1180000, 1200000],
      chartLabels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    },
    aiInsights: `Content Strategy Analysis:
The channel demonstrates strong consistency in upload schedule and content quality. Engagement rates are above industry average, indicating high audience retention and satisfaction.

Growth Opportunities:
• Expand into trending topics within your niche to capture new audiences
• Increase collaboration with similar-sized channels for cross-promotion
• Implement stronger CTAs in video descriptions to boost subscriber conversion

Revenue Optimization:
Current monetization strategy is solid, but there's potential to diversify income streams. Consider merchandise, memberships, or sponsored content partnerships to supplement ad revenue.`,
    timestamp: new Date().toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }),
  };

  return (
    <div className="relative">
      {!showDashboard && (
        <div className="absolute top-4 right-4 z-20">
          <ThemeToggle />
        </div>
      )}

      {showDashboard ? (
        <Dashboard
          channelName="Tech Reviews Pro"
          channelId="UCxxxxxxxxxxxxx"
          data={mockData}
          onBack={handleBack}
        />
      ) : (
        <ChannelInputForm onAnalyze={handleAnalyze} isLoading={isLoading} />
      )}
    </div>
  );
}
