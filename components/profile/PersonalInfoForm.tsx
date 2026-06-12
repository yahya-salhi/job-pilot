"use client";

export function PersonalInfoForm({ data }: { data: any }) {
  return (
    <section className="space-y-6">
      <h4 className="text-sm font-bold text-text-primary">Personal Info</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <div className="space-y-2">
          <label htmlFor="full-name" className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Full Name</label>
          <input id="full-name" type="text" defaultValue={data.fullName} className="w-full bg-surface-secondary border border-border-light rounded-lg px-4 py-2.5 text-sm text-text-primary focus:ring-1 focus:ring-accent focus:border-accent outline-none" />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Email</label>
          <input id="email" type="email" defaultValue={data.email} className="w-full bg-surface-secondary border border-border-light rounded-lg px-4 py-2.5 text-sm text-text-primary cursor-not-allowed" disabled />
        </div>
        <div className="space-y-2">
          <label htmlFor="phone" className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Phone Number</label>
          <input id="phone" type="text" defaultValue={data.phone} className="w-full border border-border-light rounded-lg px-4 py-2.5 text-sm text-text-primary focus:ring-1 focus:ring-accent focus:border-accent outline-none" />
        </div>
        <div className="space-y-2">
          <label htmlFor="location" className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Location</label>
          <input id="location" type="text" defaultValue={data.location} placeholder="City, Country" className="w-full border border-border-light rounded-lg px-4 py-2.5 text-sm text-text-primary focus:ring-1 focus:ring-accent focus:border-accent outline-none" />
        </div>
        <div className="space-y-2">
          <label htmlFor="linkedin" className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">LinkedIn URL</label>
          <input id="linkedin" type="text" defaultValue={data.linkedinUrl} className="w-full bg-surface-secondary border border-border-light rounded-lg px-4 py-2.5 text-sm text-text-primary focus:ring-1 focus:ring-accent focus:border-accent outline-none" />
        </div>
        <div className="space-y-2">
          <label htmlFor="portfolio" className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Portfolio / GitHub</label>
          <input id="portfolio" type="text" defaultValue={data.portfolioUrl} className="w-full bg-surface-secondary border border-border-light rounded-lg px-4 py-2.5 text-sm text-text-primary focus:ring-1 focus:ring-accent focus:border-accent outline-none" />
        </div>
        <div className="space-y-2">
          <label htmlFor="work-auth" className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Work Authorization</label>
          <div className="relative">
            <select id="work-auth" defaultValue={data.workAuthorization} className="w-full border border-border-light rounded-lg px-4 py-2.5 text-sm text-text-primary appearance-none bg-transparent focus:ring-1 focus:ring-accent focus:border-accent outline-none">
              <option>Citizen</option>
              <option>Work Permit</option>
              <option>Requires Sponsorship</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
