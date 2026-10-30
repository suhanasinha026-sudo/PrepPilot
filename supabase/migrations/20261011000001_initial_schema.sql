-- ============================================================================
-- EduPrep — Migration 01: Initial Relational Schema, Constraints & Indexes
-- Target: Supabase PostgreSQL 15+
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------------
-- Utility Trigger: Automatically maintain updated_at timestamps
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- ----------------------------------------------------------------------------
-- 1. Academic Catalog Hierarchy Tables
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.universities (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  state TEXT NOT NULL DEFAULT 'Maharashtra',
  city TEXT NOT NULL,
  location TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'Public State University',
  is_autonomous BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.colleges (
  id TEXT PRIMARY KEY,
  university_id TEXT NOT NULL REFERENCES public.universities(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  code TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'Maharashtra',
  location TEXT NOT NULL,
  is_autonomous BOOLEAN NOT NULL DEFAULT FALSE,
  category TEXT NOT NULL DEFAULT 'Affiliated College',
  badge TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.degrees (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  duration_years INTEGER NOT NULL CHECK (duration_years BETWEEN 1 AND 6),
  total_semesters INTEGER NOT NULL CHECK (total_semesters BETWEEN 1 AND 12),
  category TEXT NOT NULL DEFAULT 'engineering',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.branches (
  id TEXT PRIMARY KEY,
  degree_id TEXT NOT NULL REFERENCES public.degrees(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  code TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Core',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 2. User Profiles (1:1 with auth.users)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT 'Student Learner',
  email TEXT NOT NULL,
  avatar_url TEXT,
  university_id TEXT REFERENCES public.universities(id) ON DELETE SET NULL,
  college_id TEXT REFERENCES public.colleges(id) ON DELETE SET NULL,
  degree_id TEXT REFERENCES public.degrees(id) ON DELETE SET NULL,
  branch_id TEXT REFERENCES public.branches(id) ON DELETE SET NULL,
  current_semester INTEGER NOT NULL DEFAULT 4 CHECK (current_semester BETWEEN 1 AND 12),
  ai_tutor_persona TEXT NOT NULL DEFAULT 'encouraging' CHECK (ai_tutor_persona IN ('encouraging', 'technical', 'concise')),
  onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- Auto-create profile row when a new Supabase Auth user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1), 'Student Learner'),
    COALESCE(NEW.email, ''),
    'student'
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ----------------------------------------------------------------------------
-- 3. Subjects, Syllabus Units & Topics
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.subjects (
  id TEXT PRIMARY KEY,
  university_id TEXT REFERENCES public.universities(id) ON DELETE SET NULL,
  degree_id TEXT REFERENCES public.degrees(id) ON DELETE SET NULL,
  branch_id TEXT REFERENCES public.branches(id) ON DELETE SET NULL,
  semester_number INTEGER NOT NULL CHECK (semester_number BETWEEN 1 AND 12),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  credits NUMERIC(3,1) NOT NULL DEFAULT 4.0 CHECK (credits > 0),
  teaching_hours INTEGER NOT NULL DEFAULT 48,
  units_count INTEGER NOT NULL DEFAULT 6,
  is_core BOOLEAN NOT NULL DEFAULT TRUE,
  description TEXT,
  syllabus_summary TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.units (
  id TEXT PRIMARY KEY,
  subject_id TEXT NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  unit_number INTEGER NOT NULL CHECK (unit_number BETWEEN 1 AND 20),
  title TEXT NOT NULL,
  summary TEXT,
  weightage TEXT,
  estimated_hours NUMERIC(4,1) DEFAULT 8.0,
  UNIQUE (subject_id, unit_number)
);

CREATE TABLE IF NOT EXISTS public.topics (
  id TEXT PRIMARY KEY,
  unit_id TEXT NOT NULL REFERENCES public.units(id) ON DELETE CASCADE,
  subject_id TEXT NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  topic_number INTEGER NOT NULL CHECK (topic_number >= 1),
  title TEXT NOT NULL,
  summary TEXT,
  exam_weight TEXT,
  pyq_mentions TEXT,
  estimated_hours TEXT,
  key_points JSONB DEFAULT '[]'::jsonb,
  formula_sheet TEXT,
  UNIQUE (unit_id, topic_number)
);

-- ----------------------------------------------------------------------------
-- 4. Previous Year Question Papers (PYQs)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.question_papers (
  id TEXT PRIMARY KEY,
  university_id TEXT REFERENCES public.universities(id) ON DELETE SET NULL,
  degree_id TEXT REFERENCES public.degrees(id) ON DELETE SET NULL,
  branch_id TEXT REFERENCES public.branches(id) ON DELETE SET NULL,
  subject_id TEXT NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  semester_number INTEGER NOT NULL CHECK (semester_number BETWEEN 1 AND 12),
  exam_year INTEGER NOT NULL CHECK (exam_year BETWEEN 2000 AND 2100),
  exam_session TEXT NOT NULL,
  paper_code TEXT NOT NULL,
  title TEXT NOT NULL,
  storage_path TEXT,
  external_url TEXT,
  solution_notes TEXT,
  marks INTEGER NOT NULL DEFAULT 80 CHECK (marks > 0),
  duration_minutes INTEGER NOT NULL DEFAULT 180 CHECK (duration_minutes > 0),
  verification_status TEXT NOT NULL DEFAULT 'sample' CHECK (verification_status IN ('verified', 'sample', 'unverified')),
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 5. Questions & MCQ Options
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.questions (
  id TEXT PRIMARY KEY,
  subject_id TEXT NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  unit_id TEXT REFERENCES public.units(id) ON DELETE SET NULL,
  topic_id TEXT REFERENCES public.topics(id) ON DELETE SET NULL,
  question_type TEXT NOT NULL DEFAULT 'mcq' CHECK (question_type IN ('mcq', 'short_answer', 'long_answer', 'numerical')),
  difficulty TEXT NOT NULL DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  marks INTEGER NOT NULL DEFAULT 2 CHECK (marks > 0),
  question_text TEXT NOT NULL,
  explanation TEXT,
  model_answer TEXT,
  source_year INTEGER,
  verification_status TEXT NOT NULL DEFAULT 'sample' CHECK (verification_status IN ('verified', 'sample', 'unverified')),
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.question_options (
  id TEXT PRIMARY KEY,
  question_id TEXT NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  option_label TEXT NOT NULL CHECK (option_label IN ('A', 'B', 'C', 'D', 'E')),
  option_text TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order INTEGER NOT NULL DEFAULT 1,
  UNIQUE (question_id, option_label)
);

-- ----------------------------------------------------------------------------
-- 6. Revision Flashcards
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.flashcards (
  id TEXT PRIMARY KEY,
  subject_id TEXT NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  unit_id TEXT REFERENCES public.units(id) ON DELETE SET NULL,
  topic_id TEXT REFERENCES public.topics(id) ON DELETE SET NULL,
  front_text TEXT NOT NULL,
  back_text TEXT NOT NULL,
  hint TEXT,
  difficulty TEXT NOT NULL DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  sort_order INTEGER NOT NULL DEFAULT 1,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 7. Student Quiz Attempts & Answers
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject_id TEXT REFERENCES public.subjects(id) ON DELETE SET NULL,
  unit_id TEXT REFERENCES public.units(id) ON DELETE SET NULL,
  mode TEXT NOT NULL DEFAULT 'practice' CHECK (mode IN ('practice', 'exam')),
  total_questions INTEGER NOT NULL CHECK (total_questions > 0),
  answered_questions INTEGER NOT NULL DEFAULT 0 CHECK (answered_questions >= 0),
  correct_answers INTEGER NOT NULL DEFAULT 0 CHECK (correct_answers >= 0),
  score_percent NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (score_percent BETWEEN 0 AND 100),
  duration_seconds INTEGER NOT NULL DEFAULT 0 CHECK (duration_seconds >= 0),
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.quiz_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID NOT NULL REFERENCES public.quiz_attempts(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  selected_option_id TEXT REFERENCES public.question_options(id) ON DELETE SET NULL,
  is_correct BOOLEAN NOT NULL DEFAULT FALSE,
  time_spent_seconds INTEGER NOT NULL DEFAULT 0 CHECK (time_spent_seconds >= 0),
  UNIQUE (attempt_id, question_id)
);

-- ----------------------------------------------------------------------------
-- 8. Student Bookmarks & Study Progress
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (item_type IN ('subject', 'topic', 'paper', 'question', 'flashcard', 'opportunity')),
  item_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, item_type, item_id)
);

CREATE TABLE IF NOT EXISTS public.study_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject_id TEXT NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  unit_id TEXT REFERENCES public.units(id) ON DELETE SET NULL,
  topic_id TEXT REFERENCES public.topics(id) ON DELETE SET NULL,
  item_key TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('not_started', 'in_progress', 'completed', 'needs_revision')),
  progress_percent NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (progress_percent BETWEEN 0 AND 100),
  last_studied_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, item_key)
);

DROP TRIGGER IF EXISTS trg_study_progress_updated_at ON public.study_progress;
CREATE TRIGGER trg_study_progress_updated_at
  BEFORE UPDATE ON public.study_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ----------------------------------------------------------------------------
-- 9. Student Opportunities, Content Reports & Admin Audit Logs
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.opportunities (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  organization TEXT NOT NULL,
  opportunity_type TEXT NOT NULL CHECK (opportunity_type IN ('internship', 'hackathon', 'scholarship', 'workshop', 'competition', 'fellowship')),
  location TEXT NOT NULL DEFAULT 'India',
  mode TEXT NOT NULL DEFAULT 'online' CHECK (mode IN ('online', 'offline', 'hybrid')),
  eligibility TEXT NOT NULL,
  deadline DATE,
  apply_url TEXT,
  description TEXT NOT NULL,
  stipend_or_prize TEXT,
  verification_status TEXT NOT NULL DEFAULT 'sample' CHECK (verification_status IN ('verified', 'sample', 'unverified')),
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.content_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (item_type IN ('paper', 'question', 'flashcard', 'opportunity', 'topic')),
  item_id TEXT NOT NULL,
  reason TEXT NOT NULL,
  details TEXT,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'reviewed', 'resolved')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  target_table TEXT NOT NULL,
  target_id TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 10. Performance Indexes
-- ----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_colleges_university_id ON public.colleges(university_id);
CREATE INDEX IF NOT EXISTS idx_branches_degree_id ON public.branches(degree_id);
CREATE INDEX IF NOT EXISTS idx_subjects_hierarchy ON public.subjects(branch_id, semester_number, is_active);
CREATE INDEX IF NOT EXISTS idx_units_subject_id ON public.units(subject_id);
CREATE INDEX IF NOT EXISTS idx_topics_unit_subject ON public.topics(subject_id, unit_id);
CREATE INDEX IF NOT EXISTS idx_question_papers_subject_year ON public.question_papers(subject_id, exam_year DESC);
CREATE INDEX IF NOT EXISTS idx_questions_subject_type ON public.questions(subject_id, question_type, is_published);
CREATE INDEX IF NOT EXISTS idx_question_options_question_id ON public.question_options(question_id);
CREATE INDEX IF NOT EXISTS idx_flashcards_subject_id ON public.flashcards(subject_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_created ON public.quiz_attempts(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quiz_answers_attempt_id ON public.quiz_answers(attempt_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_type ON public.bookmarks(user_id, item_type);
CREATE INDEX IF NOT EXISTS idx_study_progress_user_subject ON public.study_progress(user_id, subject_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_published_deadline ON public.opportunities(is_published, deadline);
