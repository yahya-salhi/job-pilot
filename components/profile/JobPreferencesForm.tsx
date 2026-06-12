"use client";

export function JobPreferencesForm({ preferences }: { preferences: any }) {
  return (
    <section className="space-y-6">
      <h4 className="text-sm font-bold text-text-primary">Job Preferences</h4>
      <div className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="titles-seeking" className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Job Titles Seeking</label>
          <input id="titles-seeking" type="text" defaultValue={preferences.titlesSeeking} className="w-full bg-surface-secondary border border-border-light rounded-lg px-4 py-2.5 text-sm text-text-primary focus:ring-1 focus:ring-accent focus:border-accent outline-none" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="remote-pref" className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Remote Preference</label>
            <div className="relative">
              <select id="remote-pref" defaultValue={preferences.remotePreference} className="w-full border border-border-light rounded-lg px-4 py-2.5 text-sm text-text-primary appearance-none bg-transparent focus:ring-1 focus:ring-accent focus:border-accent outline-none">
                <option>Any</option>
                <option>Remote</option>
                <option>On-site</option>
                <option>Hybrid</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="salary-exp" className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Salary Expectation (Optional)</label>
            <input id="salary-exp" type="text" placeholder="E.g. $120k+" defaultValue={preferences.salaryExpectation} className="w-full border border-border-light rounded-lg px-4 py-2.5 text-sm text-text-primary focus:ring-1 focus:ring-accent focus:border-accent outline-none" />
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="pref-locations" className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Preferred Locations (Optional)</label>
          <input id="pref-locations" type="text" placeholder="E.g. New York, London" defaultValue={preferences.preferredLocations} className="w-full border border-border-light rounded-lg px-4 py-2.5 text-sm text-text-primary focus:ring-1 focus:ring-accent focus:border-accent outline-none" />
        </div>
      </div>
    </section>
  );
}
