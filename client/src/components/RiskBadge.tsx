import { Badge } from "@/components/ui/badge";
import { Shield, AlertTriangle, AlertCircle } from "lucide-react";

interface RiskBadgeProps {
  level: "low" | "medium" | "high";
}

export function RiskBadge({ level }: RiskBadgeProps) {
  const config = {
    low: {
      label: "Low Risk",
      variant: "default" as const,
      icon: Shield,
      className: "bg-chart-2/10 text-chart-2 border-chart-2/20",
    },
    medium: {
      label: "Medium Risk",
      variant: "default" as const,
      icon: AlertTriangle,
      className: "bg-chart-4/10 text-chart-4 border-chart-4/20",
    },
    high: {
      label: "High Risk",
      variant: "default" as const,
      icon: AlertCircle,
      className: "bg-destructive/10 text-destructive border-destructive/20",
    },
  };

  const { label, className, icon: Icon } = config[level];

  return (
    <Badge className={`${className} px-4 py-2`} data-testid={`badge-risk-${level}`}>
      <Icon className="h-4 w-4 mr-2" />
      {label}
    </Badge>
  );
}
