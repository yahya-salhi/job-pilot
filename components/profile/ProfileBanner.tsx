"use client";

type Props = {
  percentage: number;
  missingFields: string[];
  isComplete?: boolean;
};

export function ProfileBanner({ percentage, missingFields, isComplete }: Props) {
  if (isComplete) {
    return (
      <div className="bg-surface border border-border rounded-2xl p-4 lg:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 shadow-sm relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="mt-1">
            <div className="w-5 h-5 rounded-full bg-success flex items-center justify-center">
              <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          </div>
          <div>
            <h2 className="text-sm lg:text-base font-semibold text-text-primary">Profile is complete</h2>
            <p className="text-sm text-text-secondary mt-1 max-w-100 leading-relaxed">
              All required fields are filled. Your profile is ready for job matching and resume generation.
            </p>
          </div>
        </div>

        <div className="relative w-16 h-16 sm:w-24 sm:h-24 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 96 96">
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
              stroke="var(--color-success)"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray="251.2"
              strokeDashoffset={0}
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute text-xl font-bold text-text-primary">
            {percentage}%
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 shadow-sm relative overflow-hidden">
      <div className="flex items-start gap-4">
        <div className="mt-1">
          <div className="w-5 h-5 rounded-full border-2 border-error flex items-center justify-center">
            <span className="text-error font-bold text-[10px]">!</span>
          </div>
        </div>
        <div>
          <h2 className="text-sm lg:text-base font-semibold text-text-primary">Profile needs attention</h2>
          <p className="text-sm text-text-secondary mt-1 max-w-100 leading-relaxed">
            Complete the missing fields to improve your chance of getting
            tailored matches and generating quality resumes.
          </p>
          {missingFields.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {missingFields.map((tag, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 bg-error/10 text-error text-[10px] font-bold rounded-sm tracking-wide"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="relative w-16 h-16 sm:w-24 sm:h-24 flex items-center justify-center shrink-0">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 96 96">
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
        <span className="absolute text-xl font-bold text-text-primary">
          {percentage}%
        </span>
      </div>
    </div>
  );
}
