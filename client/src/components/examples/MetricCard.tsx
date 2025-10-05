import { MetricCard } from "../MetricCard";
import { TrendingUp } from "lucide-react";

export default function MetricCardExample() {
  return (
    <div className="p-8 max-w-sm">
      <MetricCard
        title="Total Subscribers"
        value="1.2M"
        subtitle="Current subscriber count"
        icon={TrendingUp}
        trend={{
          value: "15.3%",
          isPositive: true,
        }}
      />
    </div>
  );
}
