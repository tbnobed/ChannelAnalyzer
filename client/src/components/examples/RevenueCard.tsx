import { RevenueCard } from "../RevenueCard";

export default function RevenueCardExample() {
  return (
    <div className="p-8 max-w-md">
      <RevenueCard
        monthlyRevenue={1665}
        margin={42.5}
        mcnShare={15}
      />
    </div>
  );
}
