type ActivityEntry = {
  type: "agent_run" | "company_research";
  description: string;
  timestamp: string;
};

type Props = {
  entries: ActivityEntry[];
};

export function RecentActivity({ entries }: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-[16px] p-6 shadow-[0_2px_4px_rgba(0,0,0,0.01)] h-full">
      <h2 className="text-[15px] font-semibold text-gray-900 mb-7">Recent Activity</h2>
      {entries.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-8">
          No recent activity yet.
        </p>
      ) : (
        <div className="relative pl-3">
          <div className="absolute left-[3px] top-2 bottom-2 w-px bg-gray-100" />
          <div className="space-y-6">
            {entries.map((entry, i) => {
              const colors = ["#8B5CF6", "#60A5FA", "#10B981", "#8B5CF6", "#10B981"];
              const dotColor = colors[i % colors.length];

              return (
                <div key={i} className="relative pl-6">
                  <div className="absolute left-[-15px] top-[5px]">
                    <div 
                      className="w-2.5 h-2.5 rounded-full ring-4 ring-white"
                      style={{ backgroundColor: dotColor }}
                    />
                  </div>
                  <p className="text-[13.5px] text-gray-900 font-medium">{entry.description}</p>
                  <p className="text-[12.5px] text-gray-400 mt-1">{entry.timestamp}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
