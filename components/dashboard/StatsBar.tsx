import { StatsCard } from "@/components/dashboard/StatsCard";

type Props = {
  totalJobs: number;
  avgMatchRate: number;
  companiesResearched: number;
  jobsThisWeek: number;
};

export function StatsBar({ totalJobs, avgMatchRate, companiesResearched, jobsThisWeek }: Props) {
  const stats = [
    { label: "Total Jobs Found", value: String(totalJobs) },
    { label: "Avg. Match Rate", value: `${avgMatchRate}%` },
    { label: "Companies Researched", value: String(companiesResearched) },
    { label: "Jobs This Week", value: String(jobsThisWeek) },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <StatsCard key={stat.label} label={stat.label} value={stat.value} />
      ))}
    </div>
  );
}
