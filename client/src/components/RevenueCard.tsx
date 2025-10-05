import { Card } from "@/components/ui/card";
import { DollarSign } from "lucide-react";

interface RevenueCardProps {
  monthlyRevenue: number;
  margin: number;
  mcnShare: number;
}

export function RevenueCard({ monthlyRevenue, margin, mcnShare }: RevenueCardProps) {
  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    return `$${value.toLocaleString()}`;
  };

  return (
    <Card className="p-6 md:p-8">
      <div className="flex items-start justify-between mb-6">
        <h3 className="text-lg font-semibold">Revenue Summary</h3>
        <DollarSign className="h-5 w-5 text-muted-foreground" />
      </div>

      <div className="space-y-6">
        <div>
          <div className="text-sm text-muted-foreground mb-2">Monthly Revenue</div>
          <div className="text-4xl font-bold" data-testid="text-monthly-revenue">
            {formatCurrency(monthlyRevenue)}/mo
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-muted-foreground mb-1">Profit Margin</div>
            <div className="text-2xl font-semibold" data-testid="text-margin">
              {margin}%
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">MCN Share</div>
            <div className="text-2xl font-semibold" data-testid="text-mcn-share">
              {mcnShare}%
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
