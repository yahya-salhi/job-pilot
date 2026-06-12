"use client";

export function ProfileBanner({ percentage }: { percentage: number }) {
  return (
    <div className="bg-surface border border-border rounded-3xl p-8 flex items-center justify-between shadow-sm relative overflow-hidden">
      <div className="flex items-start gap-4">
        <div className="mt-1">
          <div className="w-5 h-5 rounded-full border-2 border-error flex items-center justify-center">
            <span className="text-error font-bold text-[10px]">!</span>
          </div>
        </div>
        <div>
          <h2 className="text-lg font-bold text-text-primary">Profile needs attention</h2>
          <p className="text-sm text-text-secondary mt-1 max-w-[400px] leading-relaxed">
            Complete the missing fields to improve your chance of getting tailored matches and generating quality resumes.
          </p>
          <div className="flex gap-2 mt-4">
            {["PHONE", "LOCATION", "EDUCATION"].map((tag) => (
              <span key={tag} className="px-2 py-0.5 bg-error/10 text-error text-[10px] font-bold rounded-sm tracking-wide">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      <div className="relative w-24 h-24 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="48"
            cy="48"
            r="40"
            stroke="var(--color-border-light)"
            strokeWidth="8"
            fill="transparent"
          />
          <circle
            cx="48"
            cy="48"
            r="40"
            stroke="var(--color-error)"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray="251.2"
            strokeDashoffset={251.2 * (1 - percentage / 100)}
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute text-xl font-bold text-text-primary">{percentage}%</span>
      </div>
    </div>
  );
}
