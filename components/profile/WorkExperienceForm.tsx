"use client";

export function WorkExperienceForm({ experience }: { experience: any[] }) {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-text-primary">Work Experience</h4>
        <button className="text-accent text-[11px] font-bold flex items-center gap-1 hover:text-accent-dark transition-colors">
          <span className="text-base leading-none">+</span> Add role
        </button>
      </div>
      
      {experience.map((exp, i) => (
        <div key={i} className="border border-border-light rounded-2xl p-6 space-y-6 bg-surface-muted/30">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor={`company-${i}`} className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Company Name</label>
              <input id={`company-${i}`} type="text" defaultValue={exp.company} className="w-full border border-border-light rounded-lg px-4 py-2.5 text-sm text-text-primary bg-surface focus:ring-1 focus:ring-accent focus:border-accent outline-none" />
            </div>
            <div className="space-y-2">
              <label htmlFor={`job-title-${i}`} className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Job Title</label>
              <input id={`job-title-${i}`} type="text" defaultValue={exp.title} className="w-full border border-border-light rounded-lg px-4 py-2.5 text-sm text-text-primary bg-surface focus:ring-1 focus:ring-accent focus:border-accent outline-none" />
            </div>
            <div className="space-y-2">
              <label htmlFor={`start-date-${i}`} className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Start Date</label>
              <div className="relative">
                <input id={`start-date-${i}`} type="text" defaultValue={exp.startDate} className="w-full border border-border-light rounded-lg px-4 py-2.5 text-sm text-text-primary bg-surface focus:ring-1 focus:ring-accent focus:border-accent outline-none" />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor={`end-date-${i}`} className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">End Date</label>
                <div className="flex items-center gap-1.5">
                  <input id={`currently-working-${i}`} type="checkbox" defaultChecked={exp.currentlyWorking} className="w-3.5 h-3.5 rounded-sm accent-accent cursor-pointer" />
                  <label htmlFor={`currently-working-${i}`} className="text-[10px] font-bold text-text-secondary cursor-pointer">Currently working here</label>
                </div>
              </div>
              <input id={`end-date-${i}`} type="text" placeholder="---------- ----" className="w-full border border-border-light rounded-lg px-4 py-2.5 text-sm text-text-primary bg-surface focus:ring-1 focus:ring-accent focus:border-accent outline-none" />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label htmlFor={`responsibilities-${i}`} className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Key Responsibilities</label>
              <textarea id={`responsibilities-${i}`} rows={3} defaultValue={exp.responsibilities} className="w-full border border-border-light rounded-lg px-4 py-2.5 text-sm text-text-primary bg-surface resize-none focus:ring-1 focus:ring-accent focus:border-accent outline-none" />
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
