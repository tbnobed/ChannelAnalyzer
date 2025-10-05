import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export function MetricCard({ title, value, subtitle, icon: Icon, trend }: MetricCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        {Icon && <Icon className="h-5 w-5 text-muted-foreground" />}
      </div>
      <div className="space-y-2">
        <div className="text-3xl md:text-4xl font-bold" data-testid={`metric-${title.toLowerCase().replace(/\s+/g, '-')}`}>
          {value}
        </div>
        {subtitle && (
          <div className="text-sm text-muted-foreground">{subtitle}</div>
        )}
        {trend && (
          <div
            className={`text-sm font-medium ${
              trend.isPositive ? "text-chart-2" : "text-destructive"
            }`}
          >
            {trend.isPositive ? "+" : ""}{trend.value}
          </div>
        )}
      </div>
    </Card>
  );
}
