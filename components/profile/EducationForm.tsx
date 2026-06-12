"use client";

export function EducationForm({ education }: { education: any }) {
  return (
    <section className="space-y-6">
      <h4 className="text-sm font-bold text-text-primary">Education</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
        <div className="space-y-2">
          <label htmlFor="degree" className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Highest Degree</label>
          <div className="relative">
            <select id="degree" defaultValue={education.degree} className="w-full border border-border-light rounded-lg px-4 py-2.5 text-sm text-text-primary appearance-none bg-transparent focus:ring-1 focus:ring-accent focus:border-accent outline-none">
              <option>High School</option>
              <option>Bachelor&apos;s</option>
              <option>Master&apos;s</option>
              <option>PhD</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="field-of-study" className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Field of Study</label>
          <input id="field-of-study" type="text" defaultValue={education.field} className="w-full border border-border-light rounded-lg px-4 py-2.5 text-sm text-text-primary focus:ring-1 focus:ring-accent focus:border-accent outline-none" />
        </div>
        <div className="space-y-2">
          <label htmlFor="institution" className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Institution Name</label>
          <input id="institution" type="text" placeholder="E.g. State University" defaultValue={education.institution === "E.g. State University" ? "" : education.institution} className="w-full border border-border-light rounded-lg px-4 py-2.5 text-sm text-text-primary focus:ring-1 focus:ring-accent focus:border-accent outline-none" />
        </div>
        <div className="space-y-2">
          <label htmlFor="grad-year" className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Graduation Year</label>
          <input id="grad-year" type="text" placeholder="YYYY" defaultValue={education.graduationYear === "YYYY" ? "" : education.graduationYear} className="w-full border border-border-light rounded-lg px-4 py-2.5 text-sm text-text-primary focus:ring-1 focus:ring-accent focus:border-accent outline-none" />
        </div>
      </div>
    </section>
  );
}
