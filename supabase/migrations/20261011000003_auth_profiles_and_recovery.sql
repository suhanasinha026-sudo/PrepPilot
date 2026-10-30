-- ============================================================================
-- EduPrep — Migration 03: Complete Supabase Auth Profiles & RLS Security
-- Target: Supabase PostgreSQL 15+
-- Ensures public.profiles table, auto-provisioning trigger on auth.users,
-- and strict Row Level Security (RLS) policies for user data isolation.
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. User Profiles Table (1:1 with auth.users)
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

-- Index on email and foreign keys for efficient lookups
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_university_id ON public.profiles(university_id);
CREATE INDEX IF NOT EXISTS idx_profiles_college_id ON public.profiles(college_id);

-- ----------------------------------------------------------------------------
-- 2. Updated_At Timestamp Trigger
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

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ----------------------------------------------------------------------------
-- 3. Automatic Profile Provisioning Trigger on auth.users
-- ----------------------------------------------------------------------------
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
    COALESCE(
      NULLIF(TRIM(NEW.raw_user_meta_data->>'full_name'), ''),
      NULLIF(TRIM(NEW.raw_user_meta_data->>'name'), ''),
      split_part(NEW.email, '@', 1),
      'Student Learner'
    ),
    COALESCE(NEW.email, ''),
    'student'
  )
  ON CONFLICT (user_id) DO UPDATE
  SET
    email = EXCLUDED.email,
    full_name = CASE
      WHEN public.profiles.full_name = 'Student Learner' AND EXCLUDED.full_name <> 'Student Learner'
      THEN EXCLUDED.full_name
      ELSE public.profiles.full_name
    END,
    updated_at = NOW();

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ----------------------------------------------------------------------------
-- 4. Row Level Security (RLS) on public.profiles
-- ----------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Helper to check admin status
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE user_id = auth.uid()
      AND role = 'admin'
  );
$$;

-- Drop existing policies if present to prevent duplicate policy errors
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- RLS Policy: Authenticated users can view ONLY their own profile (or admins can view all)
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

-- RLS Policy: Authenticated users can insert ONLY their own profile
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Authenticated users can update ONLY their own profile
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE
  USING (auth.uid() = user_id OR public.is_admin())
  WITH CHECK (auth.uid() = user_id OR public.is_admin());

-- ----------------------------------------------------------------------------
-- 5. Verification Query: Validate profiles table and RLS state
-- ----------------------------------------------------------------------------
COMMENT ON TABLE public.profiles IS 'EduPrep student profiles linked 1:1 to auth.users with strict RLS enforcement.';
