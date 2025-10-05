import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

interface AIInsightsProps {
  insights: string;
}

export function AIInsights({ insights }: AIInsightsProps) {
  return (
    <Card className="p-6 md:p-8">
      <div className="flex items-start gap-3 mb-6">
        <div className="p-2 rounded-lg bg-primary/10">
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">AI-Generated Insights</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Strategic recommendations based on channel analysis
          </p>
        </div>
      </div>

      <div className="prose prose-sm max-w-none max-h-96 overflow-y-auto" data-testid="text-ai-insights">
        <div className="text-foreground whitespace-pre-wrap leading-relaxed">
          {insights}
        </div>
      </div>
    </Card>
  );
}
