# JobPilot 🚀

> Your AI-powered job hunting assistant. Automate discovery, intelligent scoring, and company research.

Job hunting is one of the most repetitive and time-consuming tasks a developer faces. Reading dozens of job descriptions, deciding if a role fits, and researching companies from scratch takes hours. **JobPilot** eliminates the prep work. Set up your profile once, and let the agent discover relevant jobs, score them against your skills using GPT-4o, and build structured company dossiers before you apply.

## ✨ Key Features

- **Intelligent Job Discovery**: Integrates with the Adzuna API to fetch real-time tech jobs based on your desired title and location.
- **AI Match Scoring (GPT-4o)**: Every job is scored (0-100) against your specific profile and uploaded resume. See exactly which skills match, which are missing, and read the AI's reasoning.
- **Automated Company Research**: Uses Browserbase and Stagehand to autonomously browse a company's public web pages and generate a comprehensive dossier (culture, tech stack, interview prep) in real-time.
- **Resume Extraction & Generation**: Upload your existing PDF resume and let AI auto-fill your profile, or generate a clean new professional PDF resume directly from your profile data.
- **Analytics Dashboard**: Track your job hunt with real-time PostHog-powered analytics, visualising your matches, research activity, and overall progress over time.

## 🗺️ Core User Flow

1. **Sign Up**: Quick login via Google or GitHub OAuth.
2. **Profile Setup**: Fill out your profile or upload a resume for instant AI extraction.
3. **Find Jobs**: Enter a title and location. JobPilot fetches jobs and AI scores them instantly.
4. **Review Matches**: High-scoring jobs are visually highlighted. Click into any job to see the skill breakdown.
5. **Research Company**: Click "Research Company" to trigger a live browser agent that builds a structured company dossier.
6. **Apply**: Fully informed, click "Apply Now" to submit your application on the company's official site.

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Backend & Auth**: [InsForge](https://insforge.dev) (PostgreSQL, OAuth, Storage, Edge Functions)
- **AI Engine**: GPT-4o via OpenRouter
- **Job Data Engine**: Adzuna API
- **Web Agents**: Browserbase + Stagehand
- **Analytics**: PostHog (with HogQL for backend queries)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- An InsForge backend project (for Database, Auth, and Storage)
- API Keys for OpenRouter, Adzuna, Browserbase, and PostHog.

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd job-pilot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Copy `.env.local.example` to `.env.local` and fill in the required values:

   | Variable | Description |
   |----------|-------------|
   | `NEXT_PUBLIC_INSFORGE_URL` | Your InsForge backend API URL |
   | `NEXT_PUBLIC_INSFORGE_ANON_KEY`| Your InsForge public anonymous key |
   | `OPENROUTER_API_KEY` | For GPT-4o LLM capabilities |
   | `ADZUNA_APP_ID` & `KEY` | Adzuna Job Search API credentials |
   | `BROWSERBASE_API_KEY` & `ID`| Browserbase keys for live company research |
   | `NEXT_PUBLIC_POSTHOG_KEY` | PostHog client key for event tracking |
   | `POSTHOG_PERSONAL_API_KEY` | PostHog personal key for HogQL data fetching |
   | `POSTHOG_PROJECT_ID` | Your PostHog project ID |

4. **Run the Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/login` | Authentication handling |
| `/dashboard` | User stats, recent activity, and PostHog analytics charts |
| `/find-jobs` | Job search interface, filtering, and AI scoring list |
| `/find-jobs/[id]` | Deep dive into a job + AI company research dossier |
| `/profile` | Profile management and resume handling |

## 🤝 Contributing
Contributions are welcome! Please adhere to the established project structure and code standards. Submit a PR for review.
