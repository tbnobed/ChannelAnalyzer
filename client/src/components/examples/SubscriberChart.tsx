import { SubscriberChart } from "../SubscriberChart";

export default function SubscriberChartExample() {
  const mockData = [950000, 980000, 1020000, 1100000, 1180000, 1200000];
  const mockLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

  return (
    <div className="p-8 max-w-4xl">
      <SubscriberChart data={mockData} labels={mockLabels} />
    </div>
  );
}
