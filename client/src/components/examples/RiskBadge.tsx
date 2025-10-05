import { RiskBadge } from "../RiskBadge";

export default function RiskBadgeExample() {
  return (
    <div className="p-8 flex gap-4">
      <RiskBadge level="low" />
      <RiskBadge level="medium" />
      <RiskBadge level="high" />
    </div>
  );
}
