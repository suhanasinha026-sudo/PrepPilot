# EduPrep — Initial Repository Audit & Modernization Plan

## 1. Repository Structure & Canonical Sources

### 1.1 Inspected File Tree
- `index.html` — Root redirect page (previously pointed to broken path `./stitch_eduvantage_ace_your_exams/index.html` with old title `GradPrep`).
- `EduPrep/index.html` — Master interactive frame and multi-screen navigation shell.
- `EduPrep/serve.js` — Local Node.js static HTTP file server (`http` module on port `3000`). It is strictly a static file server and not a production backend API.
- `EduPrep/shared/eduvantage_data.js` — Shared client-side data catalog and `localStorage` state manager (4,371 lines). Renamed/upgraded to `EduPrep/shared/eduprep_data.js` (with backward-compatible alias `eduvantage_data.js` and `window.EduVantage = window.EduPrep`).
- `EduPrep/gradprep/DESIGN.md` — Design system documentation ("The Academic Atelier" / Indigo `#4648d4` palette, Inter typography, Material Symbols).
- `EduPrep/<screen>/code.html` — **Canonical 17 interactive application screens**:
  1. `splash_screen/code.html`
  2. `onboarding_flow/code.html`
  3. `login_registration/code.html`
  4. `academic_setup_updated_flow/code.html`
  5. `affiliated_college_selection/code.html`
  6. `academic_setup/code.html`
  7. `ai_tutor_personality_setup/code.html`
  8. `home_dashboard/code.html`
  9. `subject_details_os/code.html`
  10. `questions_practice/code.html`
  11. `mcq_practice_exam/code.html`
  12. `revision_flashcards/code.html`
  13. `previous_year_papers/code.html`
  14. `resources_dashboard/code.html`
  15. `study_ai_assistant/code.html`
  16. `student_opportunities/code.html`
  17. `user_profile_progress/code.html`
- `EduPrep/stitch_eduvantage_ace_your_exams/` — Redundant unlinked static export duplicates (16 of 17 folders lacked shared script bindings). Removed to keep a single canonical source of truth.

---

## 2. Discovered Defects & Security / Functional Findings

1. **Runtime Crash in `previous_year_papers/code.html`**:
   - Calls `EduVantage.pyqPapers.filter(...)` and `EduVantage.pyqPapers.find(...)`, whereas the shared data script only exposed `getPyqPapers()` and did not expose a `pyqPapers` property.
   - Expects fields `p.year`, `p.session`, and `p.subjectCode` on paper objects, whereas `PYQ_PAPERS` only defined `examPeriod` and `paperCode`.
2. **Runtime Crash in `study_ai_assistant/code.html`**:
   - Calls `EduVantage.getAiResponse(text, persona)` when sending a message, which did not exist on the shared object (only `getAiKnowledge(query)` existed), throwing a `TypeError` on every chat submission.
3. **Broken Query-String Navigation in `navigateTo()`**:
   - `academic_setup_updated_flow/code.html` calls `EduVantage.navigateTo("subject_details_os?subject=CSC401")`. Because `navigateTo` concatenated `prefix + pageKey + "/code.html"`, it produced invalid URLs (`../subject_details_os?subject=CSC401/code.html`).
4. **Academic State Property Mismatches**:
   - `DEFAULT_STATE.academic` defined `universityName`, `collegeName`, `branchName`, `courseName`, while `home_dashboard`, `user_profile_progress`, `previous_year_papers`, and `resources_dashboard` read `academic.university`, `academic.college`, `academic.branch`, and `academic.course`, resulting in `"undefined"` labels on fresh sessions.
5. **Prohibited Pricing / Subscription Section in `student_opportunities/code.html`**:
   - Contained a fake paid subscription tier (`₹299 / semester`). Removed in accordance with Rules 01.13 and 43.8 (no payment processing or fake paid plans).
6. **Hardcoded Fake Metrics & Unbadged Sample Data**:
   - `user_profile_progress/code.html` displayed hardcoded `14` MCQ Tests Taken and `48h` Focus Study Hours instead of computing real values from user progress/attempts.
   - Sample question papers and opportunities lacked clear `Sample / Demo Data` vs `Verified` status badges.
7. **Missing Full-Stack & Production Capabilities**:
   - No `package.json`, `.env.example`, `.gitignore`, or `vercel.json`.
   - No Supabase PostgreSQL schema migrations, Row Level Security (RLS) policies, Storage policies, or server-side AI Edge Function / serverless endpoint.
   - No Admin Content Management interface (`admin_panel/code.html`) or 404 page (`404.html`).
   - No password reset flow in `login_registration/code.html`.
   - Exam Mode vs Practice Mode toggle missing in `mcq_practice_exam/code.html`.

---

## 3. Architecture & Implementation Summary

- **Frontend**: Kept the lightweight, accessible HTML/CSS/JavaScript multi-page architecture (Rules 01.5–01.7) enhanced with a clean modular service layer:
  - `EduPrep/shared/supabase_client.js`: Loads public configuration (`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` / `window.__EDUPREP_CONFIG__`) and initializes the Supabase client & Auth session observer when configured, or activates clearly labeled Demo/Local Mode when credentials are not yet provided.
  - `EduPrep/shared/eduprep_services.js`: Service boundary for Authentication, Profile & Academic Setup, Catalog Hierarchy, Question Papers & Storage signed URLs, Practice Questions & Quiz Attempt scoring, Flashcards, Bookmarks, Study Progress, Opportunities, Content Reports, Admin CRUD, and Server-Side AI Study Assistant requests.
  - `EduPrep/shared/eduprep_data.js` (aliased to `eduvantage_data.js`): Unified state, catalog, validation helpers, UI modals, and backward-compatible API (`window.EduPrep` and `window.EduVantage`).
- **Backend & Database (`supabase/` & `api/`)**:
  - `supabase/migrations/20261011000001_initial_schema.sql`: Complete PostgreSQL schema (`profiles`, `universities`, `colleges`, `degrees`, `branches`, `subjects`, `units`, `topics`, `question_papers`, `questions`, `question_options`, `flashcards`, `quiz_attempts`, `quiz_answers`, `bookmarks`, `study_progress`, `opportunities`, `content_reports`, `admin_audit_logs`).
  - `supabase/migrations/20261011000002_rls_and_storage.sql`: Row Level Security on all tables, `is_admin()` helper, secure `submit_quiz_attempt` RPC function, and Storage bucket policies (`question-papers`, `avatars`).
  - `supabase/seed.sql`: Development seed script with sample academic hierarchy, OS/CN/DBMS/AOA/MP questions, flashcards, and sample opportunities explicitly marked with `is_sample = true` and `verification_status = 'sample'`.
  - `supabase/functions/ai-study-assistant/index.ts` & `api/ai-assistant.js`: Server-side AI proxy with input length limits, rate limiting, academic system prompt, and safe fallback when `AI_API_KEY` is not configured.              