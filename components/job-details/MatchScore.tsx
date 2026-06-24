type Props = {
  matchReason: string | null;
  matchedSkills: string[] | null;
  missingSkills: string[] | null;
};

export function MatchScore({ matchReason, matchedSkills, missingSkills }: Props) {
  const hasAny = matchReason || (matchedSkills && matchedSkills.length > 0) || (missingSkills && missingSkills.length > 0);

  if (!hasAny) return null;

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm space-y-5">
      {matchReason && (
        <section>
          <h2 className="text-base font-semibold text-text-primary mb-2">AI Match Reasoning</h2>
          <p className="text-sm text-text-secondary leading-relaxed">{matchReason}</p>
        </section>
      )}

      {matchedSkills && matchedSkills.length > 0 && (
        <section>
          <h2 className="text-base font-semibold text-text-primary mb-2">Required Skills vs Your Profile</h2>
          <div className="flex flex-wrap gap-2">
            {matchedSkills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-success-lightest text-success-foreground"
              >
                {skill}
              </span>
            ))}
            {missingSkills && missingSkills.length > 0 && (
              <>
                <span className="w-px bg-border mx-1" />
                {missingSkills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-accent-muted text-accent"
                  >
                    {skill}
                  </span>
                ))}
              </>
            )}
          </div>
        </section>
      )}

      {(!matchedSkills || matchedSkills.length === 0) && missingSkills && missingSkills.length > 0 && (
        <section>
          <h2 className="text-base font-semibold text-text-primary mb-2">Missing Skills</h2>
          <div className="flex flex-wrap gap-2">
            {missingSkills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-accent-muted text-accent"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
