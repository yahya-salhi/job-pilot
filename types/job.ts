export type JobRow = {
  id: string;
  company: string | null;
  title: string | null;
  match_score: number | null;
  salary: string | null;
  source: string;
  found_at: string;
  location: string | null;
  job_type: string | null;
  about_role: string | null;
  matched_skills: string[] | null;
  missing_skills: string[] | null;
  match_reason: string | null;
  source_url: string | null;
  external_apply_url: string | null;
};
