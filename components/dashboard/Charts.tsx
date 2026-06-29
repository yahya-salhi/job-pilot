type BarChartData = { label: string; value: number }[];

function BarChart({ data, color = "var(--color-info)" }: { data: BarChartData; color?: string }) {
  const maxVal = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="w-full space-y-2">
      {data.map((d) => (
        <div key={d.label} className="flex items-center gap-3">
          <span className="w-14 text-xs text-text-muted text-right flex-shrink-0">{d.label}</span>
          <div className="flex-1 h-5 bg-border-light rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${(d.value / maxVal) * 100}%`, backgroundColor: color }}
            />
          </div>
          <span className="w-8 text-xs font-medium text-text-primary text-right flex-shrink-0">{d.value}</span>
        </div>
      ))}
    </div>
  );
}

const resumeTailoringData = [
  { label: "Mon", value: 2 },
  { label: "Tue", value: 4 },
  { label: "Wed", value: 1 },
  { label: "Thu", value: 3 },
  { label: "Fri", value: 5 },
  { label: "Sat", value: 0 },
  { label: "Sun", value: 1 },
];

const matchScoreData = [
  { label: "50-60%", value: 2 },
  { label: "60-70%", value: 4 },
  { label: "70-80%", value: 7 },
  { label: "80-90%", value: 5 },
  { label: "90-100%", value: 3 },
];

export function Charts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
        <h2 className="text-base font-semibold text-text-primary mb-4">Resume Tailoring Activity</h2>
        <BarChart data={resumeTailoringData} color="var(--color-info)" />
      </div>

      <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
        <h2 className="text-base font-semibold text-text-primary mb-4">Match Score Distribution</h2>
        <BarChart data={matchScoreData} color="var(--color-success)" />
      </div>
    </div>
  );
}
