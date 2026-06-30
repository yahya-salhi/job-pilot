import { StatsCard } from "@/components/dashboard/StatsCard";

type Props = {
  totalJobs: number;
  avgMatchRate: number;
  companiesResearched: number;
  jobsThisWeek: number;
};

export function StatsBar({ totalJobs, avgMatchRate, companiesResearched, jobsThisWeek }: Props) {
  const stats = [
    { label: "Total Jobs Found", value: String(totalJobs), trend: "+12%", trendUp: true, subtext: "vs last week" },
    { label: "Avg. Match Rate", value: `${avgMatchRate}%`, trend: "+3%", trendUp: true, subtext: "vs last week" },
    { label: "Companies Researched", value: String(companiesResearched), subtext: "Total researched" },
    { label: "Jobs This Week", value: String(jobsThisWeek), subtext: "New this week" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
      {stats.map((stat) => (
        <StatsCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}
