export function IncompleteProfileBanner() {
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
          <p className="text-sm text-text-secondary mt-1 max-w-full sm:max-w-100 leading-relaxed">
            Complete your profile to get better job matches and tailored resume suggestions.
          </p>
        </div>
      </div>
      <a
        href="/profile"
        className="w-full sm:w-auto bg-accent text-accent-foreground font-medium text-sm px-4 py-2.5 lg:py-2 rounded-md hover:bg-accent-dark transition-colors shrink-0 text-center"
      >
        Complete Profile
      </a>
    </div>
  );
}
