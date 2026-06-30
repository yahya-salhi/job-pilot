type Props = {
  label: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
  subtext?: string;
};

export function StatsCard({ label, value, trend, trendUp, subtext }: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-[16px] p-4 lg:p-6 shadow-[0_2px_4px_rgba(0,0,0,0.01)] flex flex-col">
      <span className="text-[13.5px] text-gray-500 font-medium tracking-tight">{label}</span>
      <span className="text-2xl lg:text-[30px] font-bold text-text-primary mt-1 mb-2 leading-none">{value}</span>
      <div className="flex items-center gap-2 mt-auto">
        {trend && (
          <span className={`inline-flex items-center px-1.5 py-0.5 rounded-sm text-[11px] font-semibold tracking-wide ${trendUp ? "bg-green-100/60 text-green-700" : "bg-red-100/60 text-red-700"}`}>
            {trend}
          </span>
        )}
        {subtext && <span className="text-[12px] text-gray-400 font-medium">{subtext}</span>}
      </div>
    </div>
  );
}
