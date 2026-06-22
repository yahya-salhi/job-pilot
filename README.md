# JobPilot

AI-powered job hunting assistant. Set up your profile once, upload your resume, and let the agent discover relevant jobs from Adzuna — scoring each one against your profile using GPT-4o. For jobs you're interested in, it researches the company across their public web pages and builds a structured dossier so you arrive at every application fully informed.

## Pages

| Route | Page |
|-------|------|
| `/` | Homepage |
| `/login` | Auth (Google + GitHub OAuth) |
| `/dashboard` | Overview, stats, recent activity, analytics |
| `/find-jobs` | Search jobs, filter, sort, paginated list |
| `/find-jobs/[id]` | Job details + company research dossier |
| `/profile` | Profile form, resume upload & management |

## Tech Stack

- **Framework**: Next.js 16 (Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Backend**: InsForge (PostgreSQL, auth, storage, edge functions)
- **AI**: GPT-4o via OpenRouter
- **Job Data**: Adzuna API
- **Company Research**: Browserbase + Stagehand
- **Analytics**: PostHog

## Getting Started

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

See `.env.local` for required variables. Key ones:

- `NEXT_PUBLIC_INSFORGE_URL` — InsForge backend URL
- `NEXT_PUBLIC_INSFORGE_ANON_KEY` — InsForge anon key
- `OPENAI_API_KEY` — GPT-4o key
- `ADZUNA_APP_ID` / `ADZUNA_APP_KEY` — Adzuna job search
- `BROWSERBASE_API_KEY` / `BROWSERBASE_PROJECT_ID` — company research
- `NEXT_PUBLIC_POSTHOG_KEY` / `NEXT_PUBLIC_POSTHOG_HOST` — analytics

## Core Flow

1. Sign up via Google or GitHub OAuth
2. Fill your profile and optionally upload a resume PDF
3. Go to **Find Jobs**, enter a title and location
4. GPT-4o scores each job 0–100 against your profile
5. Click a job to see full details, matched/missing skills, and match reason
6. Click **Research Company** to generate a company dossier via live browsing
7. Click **Apply Now** to apply on the company's site
