import { Dashboard } from "../Dashboard";

export default function DashboardExample() {
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
    timestamp: "October 5, 2025 at 2:30 PM",
  };

  return (
    <Dashboard
      channelName="Tech Reviews Pro"
      channelId="UCxxxxxxxxxxxxx"
      data={mockData}
      onBack={() => console.log("Back clicked")}
    />
  );
}
