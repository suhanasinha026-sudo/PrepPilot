# EduPrep — Your Exam Preparation Companion

**EduPrep** is a full-stack student exam-preparation platform designed for engineering and undergraduate college students. It organizes syllabus subjects, unit-wise study notes, previous-year question papers (PYQs), 3D active-recall flashcards, instant and timed MCQ exam simulators, an AI Study Tutor with server-side provider protection, student opportunities, real computed progress tracking, and an Admin Content Studio.

---

## 1. Architecture & Tech Stack

Following **Rules 01.5–01.7** and **Section 05** of the implementation specification, EduPrep preserves its fast, zero-bundler HTML/CSS/JavaScript screen architecture while layering a modular service architecture and full Supabase + Vercel backend integration:

- **Frontend**: Plain HTML5, Tailwind CSS, Material Symbols, and modular vanilla JavaScript (`EduPrep/<screen>/code.html`)
- **Central State & Academic Hierarchy Engine**: [`EduPrep/shared/eduprep_data.js`](EduPrep/shared/eduprep_data.js) (`window.EduPrep` with `window.EduVantage` compatibility alias)
- **Modular Business Logic & Validation Layer**: [`EduPrep/shared/eduprep_services.js`](EduPrep/shared/eduprep_services.js) (`Validation`, `QuizScoring`, `ProgressMetrics`, `Opportunity`, `AiAssistant`)
- **Supabase Client & Auth Boundary**: [`EduPrep/shared/supabase_client.js`](EduPrep/shared/supabase_client.js) and [`EduPrep/shared/env_config.js`](EduPrep/shared/env_config.js)
- **Database, Auth, RLS & Storage**: Supabase PostgreSQL (`supabase/migrations/20261011000001_initial_schema.sql`, `supabase/migrations/20261011000002_rls_and_storage.sql`, and `supabase/seed.sql`)
- **Server-Side AI Proxy**:
  - Vercel Serverless Function: [`api/ai-assistant.js`](api/ai-assistant.js)
  - Supabase Edge Function: [`supabase/functions/ai-study-assistant/index.ts`](supabase/functions/ai-study-assistant/index.ts)
- **Local Development Server**: [`EduPrep/serve.js`](EduPrep/serve.js) (serves static screens, dynamically injects public `.env.local` keys via `/shared/env_config.js`, mounts `/api/ai-assistant`, and serves `EduPrep/404.html` on unknown paths)

---

## 2. Canonical Folder Structure

```text
EduPrep/
├── index.html                                  # Root entry redirect to EduPrep/index.html
├── package.json                                # Project scripts (dev, start, build, test)
├── vercel.json                                 # Vercel static routing & /api/ai-assistant config
├── .env.example                                # Safe environment variable template
├── .gitignore                                  # Prevents committing .env, node_modules, logs
├── README.md                                   # Setup, architecture, testing & deployment guide
├── api/
│   └── ai-assistant.js                         # Server-side AI proxy (rate-limited, hides AI_API_KEY)
├── docs/
│   ├── AUDIT.md                                # Complete repository audit & defect log
│   ├── DESIGN.md                               # UI/UX design system & accessibility tokens
│   └── QA_CHECKLIST.md                         # Manual & automated QA verification checklist
├── scripts/
│   ├── build.js                                # Static asset, HTML, JS syntax & SQL verification
│   ├── upgrade_data_engine.js                  # Generates & syncs shared/eduprep_data.js
│   └── rebrand_screens.js                      # Enforces EduPrep branding & accessibility rules
├── supabase/
│   ├── migrations/
│   │   ├── 20261011000001_initial_schema.sql   # 19 relational tables, constraints & indexes
│   │   └── 20261011000002_rls_and_storage.sql  # Row Level Security, RPC & Storage policies
│   ├── functions/
│   │   └── ai-study-assistant/index.ts         # Supabase Edge Function for AI Study Tutor
│   └── seed.sql                                # Sample academic hierarchy & study content seed
├── tests/
│   └── eduprep.test.js                         # Automated unit, integration, API & security tests
└── EduPrep/
    ├── index.html                              # Interactive 18-screen navigation shell
    ├── 404.html                                # Friendly 404 page
    ├── serve.js                                # Local Node HTTP + API development server
    ├── shared/
    │   ├── env_config.js                       # Public runtime configuration
    │   ├── supabase_client.js                  # Supabase REST/Auth client + Demo fallback
    │   ├── eduprep_services.js                 # Validation, scoring, metrics & AI client services
    │   ├── eduprep_data.js                     # Canonical academic catalog & state engine
    │   └── eduvantage_data.js                  # Synced backward-compatible alias bundle
    ├── splash_screen/code.html                 # 1. Brand splash screen
    ├── onboarding_flow/code.html               # 2. 3-step student onboarding walkthrough
    ├── login_registration/code.html            # 3. Supabase Auth + Demo Mode login/register/reset
    ├── academic_setup_updated_flow/code.html   # 4. University & degree setup
    ├── affiliated_college_selection/code.html  # 5. Autonomous vs affiliated college selector
    ├── academic_setup/code.html                # 6. Branch, semester & subject discovery
    ├── ai_tutor_personality_setup/code.html    # 7. AI study persona configuration
    ├── home_dashboard/code.html                # 8. Student home dashboard & progress summary
    ├── subject_details_os/code.html            # 9. Subject syllabus units & topic checklist
    ├── resources_dashboard/code.html           # 10. Study notes & resource library
    ├── study_ai_assistant/code.html            # 11. AI Study Tutor (Explain, 5-Mark, 10-Mark, Quiz)
    ├── questions_practice/code.html            # 12. Subjective 2M/5M/10M question bank
    ├── mcq_practice_exam/code.html             # 13. MCQ Practice & Timed Exam Simulator
    ├── revision_flashcards/code.html           # 14. 3D active-recall flashcards
    ├── previous_year_papers/code.html          # 15. PYQ archive & printable paper generator
    ├── student_opportunities/code.html         # 16. Student hackathons, internships & scholarships
    ├── user_profile_progress/code.html         # 17. Student profile & real computed analytics
    └── admin_panel/code.html                   # 18. Admin Content Studio (CRUD & moderation)
```

---

## 3. Local Development Setup

### Prerequisites
- **Node.js** `>= 18.0.0` (uses zero external npm packages for runtime or testing)
- Optional: A **Supabase** project and a **Gemini API Key** (if omitted, EduPrep runs seamlessly in **Local Demo Mode** with full local state persistence and curated syllabus AI responses).

### Step-by-Step Instructions

1. **Configure Environment Variables (Optional for Local Demo Mode)**
   Copy `.env.example` to `.env.local` in the project root:
   ```powershell
   Copy-Item .env.example .env.local
   ```
   Fill in your credentials if connecting to a live Supabase project and AI provider:
   - `VITE_SUPABASE_URL`: Your Supabase Project URL (`https://<project-ref>.supabase.co`)
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase public `anon` key (safe for browser with RLS enabled)
   - `SUPABASE_SERVICE_ROLE_KEY`: Server-only key (never exposed to browser)
   - `AI_API_KEY`: Server-only Gemini API key used by `/api/ai-assistant`

2. **Start the Local Server**
   ```powershell
   npm run dev
   ```
   Open **[http://localhost:8090](http://localhost:8090)** in your browser.
   - Interactive 18-screen shell: `http://localhost:8090/index.html`
   - Standalone dashboard: `http://localhost:8090/home_dashboard/code.html`
   - Admin Content Studio: `http://localhost:8090/admin_panel/code.html`

3. **Run Build Verification & Automated Tests**
   ```powershell
   npm run build
   npm test
   ```

---

## 4. Supabase Database, RLS, Storage & Seed Setup

To set up a live Supabase backend:

1. Create a new project at [https://supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase Dashboard and execute the migrations in order:
   - **Step 1**: Run [`supabase/migrations/20261011000001_initial_schema.sql`](supabase/migrations/20261011000001_initial_schema.sql) — creates all 19 tables (`universities`, `colleges`, `degrees`, `branches`, `profiles`, `subjects`, `units`, `topics`, `question_papers`, `questions`, `question_options`, `flashcards`, `quiz_attempts`, `quiz_answers`, `bookmarks`, `study_progress`, `opportunities`, `content_reports`, `admin_audit_logs`), foreign keys, check constraints, indexes, and the `auth.users` profile creation trigger.
   - **Step 2**: Run [`supabase/migrations/20261011000002_rls_and_storage.sql`](supabase/migrations/20261011000002_rls_and_storage.sql) — enables Row Level Security (RLS) on all 19 tables, creates `public.is_admin()`, prevents client role escalation via `prevent_profile_role_escalation`, defines the server-side quiz grading RPC `public.submit_quiz_attempt`, and configures Storage buckets (`question-papers` and `avatars`).
   - **Step 3**: Run [`supabase/seed.sql`](supabase/seed.sql) — populates initial universities, colleges, branches, Sem 4 subjects, units, topics, sample PYQ metadata (`verification_status = 'sample'`), MCQs, flashcards, and sample opportunities.
3. **Promote an Admin User**:
   After registering your admin account via the app, run the following in the Supabase SQL Editor (service role):
   ```sql
   UPDATE public.profiles SET role = 'admin' WHERE email = 'your-admin-email@example.com';
   ```

---

## 5. Deployment to Vercel

1. Push the repository to GitHub (recommended repository name: `eduprep`).
2. Import the repository into [Vercel](https://vercel.com):
   - **Framework Preset**: `Other` (Static HTML/JS + Serverless Functions in `/api`)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.` (configured via [`vercel.json`](vercel.json))
3. Add Environment Variables in **Vercel Project Settings → Environment Variables**:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `AI_API_KEY` (Server-side secret for `/api/ai-assistant`)
   - `AI_MODEL` (Default: `gemini-2.5-flash`)
4. In **Supabase Dashboard → Authentication → URL Configuration**, add your Vercel production domain (`https://<your-project>.vercel.app`) to **Site URL** and **Redirect URLs**.
