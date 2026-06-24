"use client";

import { useRouter } from "next/navigation";
import type { JobRow } from "@/types/job";

type Props = {
  jobs: JobRow[];
};

function ScoreBar({ score }: { score: number }) {
  let barColor: string;
  if (score >= 70) {
    barColor = "bg-success";
  } else if (score >= 50) {
    barColor = "bg-warning";
  } else {
    barColor = "bg-border";
  }

  let textColor: string;
  if (score >= 70) {
    textColor = "text-success";
  } else if (score >= 50) {
    textColor = "text-warning";
  } else {
    textColor = "text-text-muted";
  }

  return (
    <div className="flex items-center gap-3 min-w-[140px]">
      <div className="flex-1 h-1.5 bg-border-light rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${barColor}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className={`text-sm font-semibold tabular-nums ${textColor}`}>
        {score}%
      </span>
    </div>
  );
}

function SourceBadge({ source }: { source: string }) {
  if (source === "search") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-success-lightest text-success-foreground">
        Search
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-surface-secondary text-text-secondary">
      URL
    </span>
  );
}

export function JobsTable({ jobs }: Props) {
  const router = useRouter();

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left">
            <th className="pb-3 pr-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Company</th>
            <th className="pb-3 pr-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Role</th>
            <th className="pb-3 pr-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Description</th>
            <th className="pb-3 pr-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Match Score</th>
            <th className="pb-3 pr-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Salary Est.</th>
            <th className="pb-3 pr-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Source</th>
            <th className="pb-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">Date Found</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr
              key={job.id}
              className="border-t border-border-light cursor-pointer hover:bg-surface-secondary transition-colors"
              onClick={() => router.push(`/find-jobs/${job.id}`)}
            >
              <td className="py-3 pr-4">
                <span className="text-sm font-medium text-text-primary">{job.company}</span>
              </td>
              <td className="py-3 pr-4">
                <span className="text-sm text-text-primary">{job.title}</span>
              </td>
              <td className="py-3 pr-4 max-w-xs">
                <span className="text-sm text-text-secondary line-clamp-2">{job.about_role ?? "—"}</span>
              </td>
              <td className="py-3 pr-4">
                <ScoreBar score={job.match_score ?? 0} />
              </td>
              <td className="py-3 pr-4">
                <span className="text-sm text-text-primary">{job.salary ?? "—"}</span>
              </td>
              <td className="py-3 pr-4">
                <SourceBadge source={job.source} />
              </td>
              <td className="py-3">
                <span className="text-sm text-text-secondary">{job.found_at}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
