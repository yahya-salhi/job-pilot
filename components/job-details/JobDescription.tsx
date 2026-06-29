type Props = {
  aboutRole: string | null;
  responsibilities: string[] | null;
  requirements: string[] | null;
  niceToHave: string[] | null;
  benefits: string[] | null;
  aboutCompany: string | null;
};

function BulletList({ title, items }: { title: string; items: string[] }) {
  if (!items || items.length === 0) return null;
  return (
    <section>
      <h3 className="text-sm font-semibold text-text-primary mb-2">{title}</h3>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="text-sm text-text-secondary leading-relaxed pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-text-muted">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function JobDescription({ aboutRole, responsibilities, requirements, niceToHave, benefits, aboutCompany }: Props) {
  const hasContent = aboutRole || (responsibilities && responsibilities.length > 0) ||
    (requirements && requirements.length > 0) || (niceToHave && niceToHave.length > 0) ||
    (benefits && benefits.length > 0) || aboutCompany;

  if (!hasContent) return null;

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm space-y-5">
      <h2 className="text-base font-semibold text-text-primary">Job Description</h2>

      {aboutRole && (
        <p className="text-sm text-text-secondary leading-relaxed">{aboutRole}</p>
      )}

      <BulletList title="Responsibilities" items={responsibilities ?? []} />
      <BulletList title="Requirements" items={requirements ?? []} />
      <BulletList title="Nice to Have" items={niceToHave ?? []} />
      <BulletList title="Benefits" items={benefits ?? []} />

      {aboutCompany && (
        <section>
          <h2 className="text-base font-semibold text-text-primary mb-2">About the Company</h2>
          <p className="text-sm text-text-secondary leading-relaxed">{aboutCompany}</p>
        </section>
      )}
    </div>
  );
}
