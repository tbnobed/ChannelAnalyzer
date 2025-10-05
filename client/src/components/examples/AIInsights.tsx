import { AIInsights } from "../AIInsights";

export default function AIInsightsExample() {
  const mockInsights = `Content Strategy Analysis:
The channel demonstrates strong consistency in upload schedule and content quality. Engagement rates are above industry average, indicating high audience retention and satisfaction.

Growth Opportunities:
• Expand into trending topics within your niche to capture new audiences
• Increase collaboration with similar-sized channels for cross-promotion
• Implement stronger CTAs in video descriptions to boost subscriber conversion

Revenue Optimization:
Current monetization strategy is solid, but there's potential to diversify income streams. Consider merchandise, memberships, or sponsored content partnerships to supplement ad revenue.`;

  return (
    <div className="p-8 max-w-3xl">
      <AIInsights insights={mockInsights} />
    </div>
  );
}
