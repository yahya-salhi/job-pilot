export function IncompleteProfileBanner() {
  return (
    <div className="bg-surface border border-border rounded-2xl p-6 flex items-center justify-between shadow-sm relative overflow-hidden">
      <div className="flex items-start gap-4">
        <div className="mt-1">
          <div className="w-5 h-5 rounded-full border-2 border-error flex items-center justify-center">
            <span className="text-error font-bold text-[10px]">!</span>
          </div>
        </div>
        <div>
          <h2 className="text-base font-semibold text-text-primary">Profile needs attention</h2>
          <p className="text-sm text-text-secondary mt-1 max-w-[400px] leading-relaxed">
            Complete your profile to get better job matches and tailored resume suggestions.
          </p>
        </div>
      </div>
      <a
        href="/profile"
        className="bg-accent text-accent-foreground font-medium text-sm px-4 py-2 rounded-md hover:bg-accent-dark transition-colors flex-shrink-0"
      >
        Complete Profile
      </a>
    </div>
  );
}
