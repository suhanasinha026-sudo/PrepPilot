# EduPrep — QA & Verification Checklist

This document records the verification status of all functional, security, branding, and testing requirements from the Master Implementation Prompt.

## 1. Automated Verification Commands

| Command | Purpose | Result |
| :--- | :--- | :--- |
| `npm run build` | Verifies all 18 canonical screens, shell pages, 404 fallback, JS syntax across 7 modules, and 3 SQL files | **PASS** |
| `npm test` | Runs 18 automated unit, integration, API boundary, and branding/security tests via `node --test` | **PASS (18/18)** |

## 2. Functional Flow Checklist

- [x] **Branding & Identity**: Every screen uses **EduPrep** ("EduPrep — Your Exam Preparation Companion") and **EP** monograms. Zero visible `EduVantage` or `GradPrep` strings remain in HTML markup.
- [x] **Authentication (`login_registration`)**: Supports Email/Password Sign In, Registration, Password Recovery, and explicit Demo Student Mode with inline validation (no `alert()` calls).
- [x] **Academic Hierarchy (`academic_setup_updated_flow`, `affiliated_college_selection`, `academic_setup`)**: Parent-child cascading filtering (`University -> College -> Course -> Branch -> Semester -> Subjects`). Changing a parent university automatically resets any incompatible child college selection.
- [x] **Subject & Topic Study (`subject_details_os`, `resources_dashboard`)**: Expandable syllabus units, high-yield exam formulas, interactive topic learning modal, and persistent topic completion toggles.
- [x] **Previous Year Question Papers (`previous_year_papers`)**: Fixed `EduPrep.pyqPapers` runtime crash, added search and subject/year/saved filters, added explicit `Sample Paper` / `Verified` badges, persistent bookmarking, and a printable reference question paper generator (`EduPrep.openPrintablePaper`).
- [x] **MCQ Practice & Timed Exam Simulator (`mcq_practice_exam`)**: Normalized all 60+ MCQs with `.answer` and `.ans`, added **Practice Mode** (instant explanation) vs **Timed Exam Mode** (answers revealed upon submission), and added Correct / Incorrect / Unanswered breakdown in results.
- [x] **3D Revision Flashcards (`revision_flashcards`)**: Added `@media (prefers-reduced-motion: reduce)` support and persistent Mastered / Needs Review tracking.
- [x] **AI Study Assistant (`study_ai_assistant`)**: Fixed missing `getAiResponse` crash, added server-side proxy boundary (`/api/ai-assistant` and Supabase Edge Function) with input length validation, rate limiting, Study Action Modes (`Explain`, `5-Mark`, `10-Mark`, `Quiz Me`), and automatic fallback to the local curated syllabus engine when `AI_API_KEY` is unconfigured.
- [x] **Student Opportunities (`student_opportunities`)**: Removed prohibited `₹299 / semester` pricing section, added search input, active deadline filter (`isExpired`), `Sample Listing` badges, and Admin Studio catalog integration.
- [x] **User Profile & Real Computed Progress (`user_profile_progress`)**: Replaced hardcoded `14` MCQ Tests and `48h` Study Hours with real computed metrics (`EduPrep.getComputedMetrics()`) derived from actual completed topics, mastered flashcards, bookmarks, and recorded quiz attempts.
- [x] **Admin Content Studio (`admin_panel`)**: Protected management interface to add/delete MCQs (with 4-option validation), Flashcards, Past Papers, Opportunities, and Colleges, plus moderation of student Content Reports.
