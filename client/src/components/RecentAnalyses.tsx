import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, Trash2, RefreshCw } from "lucide-react";

interface Analysis {
  id: string;
  channelName: string;
  channelId: string;
  channelUrl: string;
  totalSubscribers: number;
  riskLevel: string;
  createdAt: string;
  monthlyRevenue: number;
}

interface RecentAnalysesProps {
  analyses: Analysis[];
  onSelect: (analysisId: string) => void;
  onDelete: (analysisId: string) => void;
  onRerun: (channelUrl: string) => void;
  isLoading: boolean;
}

export function RecentAnalyses({ analyses, onSelect, onDelete, onRerun, isLoading }: RecentAnalysesProps) {
  const formatNumber = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(2)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toLocaleString();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "low":
        return "bg-green-500/10 text-green-600 dark:text-green-400";
      case "medium":
        return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400";
      case "high":
        return "bg-red-500/10 text-red-600 dark:text-red-400";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold" data-testid="text-recent-analyses-title">
        Recent Analyses
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {analyses.map((analysis) => (
          <Card
            key={analysis.id}
            className="p-4 hover-elevate transition-all"
            data-testid={`card-analysis-${analysis.id}`}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <h3 
                  className="font-semibold line-clamp-2 leading-snug flex-1 cursor-pointer"
                  onClick={() => !isLoading && onSelect(analysis.id)}
                  data-testid={`text-channel-${analysis.id}`}
                >
                  {analysis.channelName}
                </h3>
                <Badge 
                  className={`${getRiskColor(analysis.riskLevel)} text-xs shrink-0`}
                  data-testid={`badge-risk-${analysis.id}`}
                >
                  {analysis.riskLevel}
                </Badge>
              </div>
              
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span data-testid={`text-subscribers-${analysis.id}`}>
                    {formatNumber(analysis.totalSubscribers)} subscribers
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span data-testid={`text-time-${analysis.id}`}>
                    {formatDate(analysis.createdAt)}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Est. Revenue</span>
                  <span className="font-semibold" data-testid={`text-revenue-${analysis.id}`}>
                    ${formatNumber(analysis.monthlyRevenue)}/mo
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRerun(analysis.channelUrl);
                  }}
                  disabled={isLoading}
                  data-testid={`button-rerun-${analysis.id}`}
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Re-run
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(analysis.id);
                  }}
                  disabled={isLoading}
                  data-testid={`button-delete-${analysis.id}`}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
