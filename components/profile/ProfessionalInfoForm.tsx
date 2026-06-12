"use client";

export function ProfessionalInfoForm({ data }: { data: any }) {
  return (
    <section className="space-y-6">
      <h4 className="text-sm font-bold text-text-primary">Professional Info</h4>
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="current-title" className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Current/Recent Job Title</label>
          <input id="current-title" type="text" defaultValue={data.currentTitle} className="w-full bg-surface-secondary border border-border-light rounded-lg px-4 py-2.5 text-sm text-text-primary focus:ring-1 focus:ring-accent focus:border-accent outline-none" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="exp-level" className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Experience Level</label>
            <div className="relative">
              <select id="exp-level" defaultValue={data.experienceLevel} className="w-full border border-border-light rounded-lg px-4 py-2.5 text-sm text-text-primary appearance-none bg-transparent focus:ring-1 focus:ring-accent focus:border-accent outline-none">
                <option>Junior</option>
                <option>Mid-Level</option>
                <option>Senior</option>
                <option>Lead / Manager</option>
                <option>Executive</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="years-exp" className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Years of Experience</label>
            <input id="years-exp" type="number" defaultValue={data.yearsExperience} className="w-full bg-surface-secondary border border-border-light rounded-lg px-4 py-2.5 text-sm text-text-primary focus:ring-1 focus:ring-accent focus:border-accent outline-none" />
          </div>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="skills-input" className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Skills</label>
          <div className="flex gap-2">
            <input id="skills-input" type="text" placeholder="Add a skill" className="flex-1 border border-border-light rounded-lg px-4 py-2.5 text-sm text-text-primary focus:ring-1 focus:ring-accent focus:border-accent outline-none" />
            <button className="px-6 py-2.5 border border-border-light rounded-lg text-sm font-bold text-text-dark hover:bg-surface-secondary transition-colors">Add</button>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {data.skills.map((skill: string) => (
              <span key={skill} className="px-3 py-1.5 border border-border-light rounded-lg text-xs font-bold text-text-primary flex items-center gap-1.5">
                {skill}
                <button className="text-text-muted hover:text-error transition-colors">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="industries-input" className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Industries Worked In (Optional)</label>
          <div className="flex gap-2">
            <input id="industries-input" type="text" placeholder="E.g. FinTech, Healthcare" className="flex-1 border border-border-light rounded-lg px-4 py-2.5 text-sm text-text-primary focus:ring-1 focus:ring-accent focus:border-accent outline-none" />
            <button className="px-6 py-2.5 border border-border-light rounded-lg text-sm font-bold text-text-dark hover:bg-surface-secondary transition-colors">Add</button>
          </div>
        </div>
      </div>
    </section>
  );
}
