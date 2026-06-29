type ActivityEntry = {
  type: "agent_run" | "company_research";
  description: string;
  timestamp: string;
};

type Props = {
  entries: ActivityEntry[];
};

function ActivityDot({ type }: { type: ActivityEntry["type"] }) {
  const ringMap = {
    agent_run: "bg-info-light",
    company_research: "bg-success-light",
  };

  const dotMap = {
    agent_run: "bg-info",
    company_research: "bg-success-alt",
  };

  return (
    <div className="relative flex items-center justify-center w-4 h-4">
      <div className={`absolute w-4 h-4 rounded-full ${ringMap[type]} border-2 border-white`} />
      <div className={`relative w-2 h-2 rounded-full ${dotMap[type]}`} />
    </div>
  );
}

export function RecentActivity({ entries }: Props) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
      <h2 className="text-base font-semibold text-text-primary mb-5">Recent Activity</h2>
      {entries.length === 0 ? (
        <p className="text-sm text-text-secondary text-center py-8">
          No recent activity yet. Start by finding jobs or researching companies.
        </p>
      ) : (
        <div className="space-y-0">
          {entries.map((entry, i) => (
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
      )}
    </div>
  );
}
