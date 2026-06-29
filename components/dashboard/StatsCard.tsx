type Props = {
  label: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
};

export function StatsCard({ label, value, trend, trendUp }: Props) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm flex flex-col gap-2">
      <span className="text-sm text-text-secondary font-medium">{label}</span>
      <span className="text-[30px] font-semibold text-text-primary leading-9">{value}</span>
      {trend && (
        <span className="inline-flex items-center self-start gap-1 px-2 py-0.5 bg-success-lightest text-success-darker text-xs font-medium rounded-sm">
          <svg
            className={`w-3 h-3 ${trendUp ? "" : "rotate-180"}`}
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 9.5V2.5" />
            <path d="M2.5 6L6 2.5L9.5 6" />
          </svg>
          {trend}
        </span>
      )}
    </div>
  );
}
