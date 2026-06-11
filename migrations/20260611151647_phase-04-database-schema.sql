-- Create handle_updated_at function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Profiles Table
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  email text,
  phone text,
  location text,
  current_title text,
  experience_level text CHECK (experience_level IN ('junior', 'mid', 'senior', 'lead')),
  years_experience integer,
  skills text[],
  industries text[],
  work_experience jsonb,
  education jsonb,
  job_titles_seeking text[],
  remote_preference text CHECK (remote_preference IN ('remote', 'onsite', 'hybrid', 'any')),
  preferred_locations text[],
  salary_expectation text,
  cover_letter_tone text CHECK (cover_letter_tone IN ('formal', 'casual', 'enthusiastic')),
  linkedin_url text,
  portfolio_url text,
  work_authorization text CHECK (work_authorization IN ('citizen', 'permanent_resident', 'visa_required')),
  resume_pdf_url text,
  is_complete boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Agent Runs Table
CREATE TABLE public.agent_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  status text NOT NULL CHECK (status IN ('running', 'completed', 'failed')) DEFAULT 'running',
  job_title_searched text,
  location_searched text,
  jobs_found integer DEFAULT 0,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- Jobs Table
CREATE TABLE public.jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id uuid REFERENCES public.agent_runs(id) ON DELETE CASCADE,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  source text NOT NULL CHECK (source IN ('search', 'url')),
  source_url text,
  external_apply_url text,
  title text,
  company text,
  location text,
  salary text,
  job_type text CHECK (job_type IN ('fulltime', 'parttime', 'contract')),
  about_role text,
  responsibilities text[],
  requirements text[],
  nice_to_have text[],
  benefits text[],
  about_company text,
  match_score integer CHECK (match_score >= 0 AND match_score <= 100),
  match_reason text,
  matched_skills text[],
  missing_skills text[],
  company_research jsonb,
  found_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Agent Logs Table
CREATE TABLE public.agent_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id uuid REFERENCES public.agent_runs(id) ON DELETE CASCADE,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  message text NOT NULL,
  level text NOT NULL CHECK (level IN ('info', 'success', 'warning', 'error')) DEFAULT 'info',
  job_id uuid REFERENCES public.jobs(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Triggers for updated_at
CREATE TRIGGER tr_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER tr_jobs_updated_at BEFORE UPDATE ON public.jobs FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Performance Indexes
CREATE INDEX idx_agent_runs_user_id ON public.agent_runs(user_id);
CREATE INDEX idx_jobs_user_id ON public.jobs(user_id);
CREATE INDEX idx_jobs_run_id ON public.jobs(run_id);
CREATE INDEX idx_agent_logs_run_id ON public.agent_logs(run_id);
CREATE INDEX idx_agent_logs_user_id ON public.agent_logs(user_id);
CREATE INDEX idx_agent_logs_job_id ON public.agent_logs(job_id);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their own profile" ON public.profiles
  FOR ALL TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can manage their own agent runs" ON public.agent_runs
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own jobs" ON public.jobs
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own agent logs" ON public.agent_logs
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Explicit Grants
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.agent_runs TO authenticated;
GRANT ALL ON public.jobs TO authenticated;
GRANT ALL ON public.agent_logs TO authenticated;
