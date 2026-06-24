export function JobFilters() {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
      <input
        type="text"
        placeholder="Filter by company or role..."
        className="w-full sm:w-64 bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary placeholder-text-muted focus:ring-1 focus:ring-accent focus:border-accent outline-none"
      />
      <select className="bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary appearance-none focus:ring-1 focus:ring-accent focus:border-accent outline-none cursor-pointer">
        <option>All Matches</option>
        <option>High Match</option>
        <option>Low Match</option>
      </select>
      <select className="bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary appearance-none focus:ring-1 focus:ring-accent focus:border-accent outline-none cursor-pointer">
        <option>Match Score</option>
        <option>Newest</option>
        <option>Oldest</option>
      </select>
    </div>
  );
}
