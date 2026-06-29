import { StatsCard } from "@/components/dashboard/StatsCard";

const mockStats = [
  { label: "Total Jobs Found", value: "24", trend: "+12%", trendUp: true },
  { label: "Avg. Match Rate", value: "78%", trend: "+5%", trendUp: true },
  { label: "Companies Researched", value: "12", trend: "+8%", trendUp: true },
  { label: "Cover Letters Generated", value: "8", trend: "+2%", trendUp: true },
];

export function StatsBar() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {mockStats.map((stat) => (
        <StatsCard
          key={stat.label}
          label={stat.label}
          value={stat.value}
          trend={stat.trend}
          trendUp={stat.trendUp}
        />
      ))}
    </div>
  );
}
