type ActivityEntry = {
  type: "resume_tailored" | "cover_letter" | "job_found";
  description: string;
  timestamp: string;
};

const mockActivity: ActivityEntry[] = [
  {
    type: "job_found",
    description: "Found 8 new job matches for Frontend Engineer",
    timestamp: "2 hours ago",
  },
  {
    type: "cover_letter",
    description: "Cover letter generated for Senior Frontend role at Stripe",
    timestamp: "5 hours ago",
  },
  {
    type: "resume_tailored",
    description: "Resume tailored for Frontend Engineer at Vercel",
    timestamp: "Yesterday",
  },
  {
    type: "job_found",
    description: "Found 5 new job matches for Full Stack Developer",
    timestamp: "Yesterday",
  },
  {
    type: "cover_letter",
    description: "Cover letter generated for Product Designer role at Figma",
    timestamp: "2 days ago",
  },
];

function ActivityDot({ type }: { type: ActivityEntry["type"] }) {
  const ringMap = {
    resume_tailored: "bg-accent-light",
    cover_letter: "bg-info-light",
    job_found: "bg-success-light",
  };

  const dotMap = {
    resume_tailored: "bg-accent",
    cover_letter: "bg-info",
    job_found: "bg-success-alt",
  };

  return (
    <div className="relative flex items-center justify-center w-4 h-4">
      <div className={`absolute w-4 h-4 rounded-full ${ringMap[type]} border-2 border-white`} />
      <div className={`relative w-2 h-2 rounded-full ${dotMap[type]}`} />
    </div>
  );
}

export function RecentActivity() {
  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
      <h2 className="text-base font-semibold text-text-primary mb-5">Recent Activity</h2>
      <div className="space-y-0">
        {mockActivity.map((entry, i) => (
          <div
            key={i}
            className="flex items-start gap-3 py-3 border-t border-border-light first:border-t-0"
          >
            <div className="mt-0.5">
              <ActivityDot type={entry.type} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-text-primary leading-5">{entry.description}</p>
              <p className="text-xs text-text-muted mt-0.5">{entry.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
