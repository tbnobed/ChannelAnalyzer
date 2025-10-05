import { EngagementCard } from "../EngagementCard";

export default function EngagementCardExample() {
  return (
    <div className="p-8 max-w-sm">
      <EngagementCard
        views={125000}
        likes={8500}
        comments={432}
        engagementRate={7.2}
      />
    </div>
  );
}
