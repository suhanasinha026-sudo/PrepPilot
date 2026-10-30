-- ============================================================================
-- EduPrep — Migration 02: Row Level Security (RLS), Server RPCs & Storage
-- Target: Supabase PostgreSQL 15+
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Admin Role Verification Function (Server-Side Security Definer)
-- ----------------------------------------------------------------------------
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

-- Prevent non-admin users from escalating their own role in profiles
CREATE OR REPLACE FUNCTION public.enforce_profile_role_security()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'Unauthorized: Only administrators can modify user roles.';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_profile_role ON public.profiles;
CREATE TRIGGER trg_enforce_profile_role
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_profile_role_security();

-- ----------------------------------------------------------------------------
-- 2. Enable Row Level Security on All Exposed Tables
-- ----------------------------------------------------------------------------
ALTER TABLE public.universities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.degrees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- 3. Catalog & Published Study Material Policies
-- ----------------------------------------------------------------------------
-- Universities, Colleges, Degrees, Branches: Publicly readable for onboarding/setup; Admin writable
CREATE POLICY "Public read active universities" ON public.universities
  FOR SELECT USING (is_active = TRUE OR public.is_admin());
CREATE POLICY "Admin manage universities" ON public.universities
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Public read active colleges" ON public.colleges
  FOR SELECT USING (is_active = TRUE OR public.is_admin());
CREATE POLICY "Admin manage colleges" ON public.colleges
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Public read active degrees" ON public.degrees
  FOR SELECT USING (is_active = TRUE OR public.is_admin());
CREATE POLICY "Admin manage degrees" ON public.degrees
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Public read active branches" ON public.branches
  FOR SELECT USING (is_active = TRUE OR public.is_admin());
CREATE POLICY "Admin manage branches" ON public.branches
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Subjects, Units, Topics: Readable by authenticated users (and onboarding preview); Admin writable
CREATE POLICY "Read active subjects" ON public.subjects
  FOR SELECT USING (is_active = TRUE OR public.is_admin());
CREATE POLICY "Admin manage subjects" ON public.subjects
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Read units" ON public.units
  FOR SELECT USING (TRUE);
CREATE POLICY "Admin manage units" ON public.units
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Read topics" ON public.topics
  FOR SELECT USING (TRUE);
CREATE POLICY "Admin manage topics" ON public.topics
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Question Papers, Questions, Options, Flashcards, Opportunities: Published readable; Admin writable
CREATE POLICY "Read published question papers" ON public.question_papers
  FOR SELECT USING (is_published = TRUE OR public.is_admin());
CREATE POLICY "Admin manage question papers" ON public.question_papers
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Read published questions" ON public.questions
  FOR SELECT USING (is_published = TRUE OR public.is_admin());
CREATE POLICY "Admin manage questions" ON public.questions
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Read question options" ON public.question_options
  FOR SELECT USING (TRUE);
CREATE POLICY "Admin manage question options" ON public.question_options
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Read published flashcards" ON public.flashcards
  FOR SELECT USING (is_published = TRUE OR public.is_admin());
CREATE POLICY "Admin manage flashcards" ON public.flashcards
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Read published opportunities" ON public.opportunities
  FOR SELECT USING (is_published = TRUE OR public.is_admin());
CREATE POLICY "Admin manage opportunities" ON public.opportunities
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ----------------------------------------------------------------------------
-- 4. User-Owned Data Policies (Strict auth.uid() = user_id isolation)
-- ----------------------------------------------------------------------------
-- Profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id OR public.is_admin())
  WITH CHECK (auth.uid() = user_id OR public.is_admin());

-- Quiz Attempts
CREATE POLICY "Users can view own quiz attempts" ON public.quiz_attempts
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users can insert own quiz attempts" ON public.quiz_attempts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Quiz Answers
CREATE POLICY "Users can view own quiz answers" ON public.quiz_answers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.quiz_attempts a
      WHERE a.id = quiz_answers.attempt_id
        AND (a.user_id = auth.uid() OR public.is_admin())
    )
  );
CREATE POLICY "Users can insert own quiz answers" ON public.quiz_answers
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.quiz_attempts a
      WHERE a.id = quiz_answers.attempt_id
        AND a.user_id = auth.uid()
    )
  );

-- Bookmarks
CREATE POLICY "Users can view own bookmarks" ON public.bookmarks
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own bookmarks" ON public.bookmarks
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own bookmarks" ON public.bookmarks
  FOR DELETE USING (auth.uid() = user_id);

-- Study Progress
CREATE POLICY "Users can view own study progress" ON public.study_progress
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own study progress" ON public.study_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own study progress" ON public.study_progress
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Content Reports
CREATE POLICY "Users can create content reports" ON public.content_reports
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own content reports or admin all" ON public.content_reports
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Admin can update content reports" ON public.content_reports
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Admin Audit Logs
CREATE POLICY "Admin view audit logs" ON public.admin_audit_logs
  FOR SELECT USING (public.is_admin());
CREATE POLICY "Admin insert audit logs" ON public.admin_audit_logs
  FOR INSERT WITH CHECK (public.is_admin());

-- ----------------------------------------------------------------------------
-- 5. Server-Side Validated Quiz Submission RPC
-- Calculates authoritative score from question_options rather than trusting client
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.submit_quiz_attempt(
  p_subject_id TEXT,
  p_unit_id TEXT,
  p_mode TEXT,
  p_total_questions INTEGER,
  p_duration_seconds INTEGER,
  p_answers JSONB -- Array of { "question_id": "...", "selected_option_id": "...", "time_spent_seconds": 12 }
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_attempt_id UUID;
  v_answered INTEGER := 0;
  v_correct INTEGER := 0;
  v_score_pct NUMERIC(5,2) := 0;
  v_item JSONB;
  v_q_id TEXT;
  v_opt_id TEXT;
  v_time_spent INTEGER;
  v_is_correct BOOLEAN;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required to submit quiz attempt.';
  END IF;

  IF p_total_questions <= 0 THEN
    RAISE EXCEPTION 'total_questions must be positive.';
  END IF;

  INSERT INTO public.quiz_attempts (
    user_id, subject_id, unit_id, mode, total_questions, duration_seconds
  ) VALUES (
    v_user_id,
    p_subject_id,
    p_unit_id,
    CASE WHEN p_mode IN ('practice', 'exam') THEN p_mode ELSE 'practice' END,
    p_total_questions,
    GREATEST(0, COALESCE(p_duration_seconds, 0))
  )
  RETURNING id INTO v_attempt_id;

  IF jsonb_typeof(p_answers) = 'array' THEN
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_answers)
    LOOP
      v_q_id := v_item->>'question_id';
      v_opt_id := v_item->>'selected_option_id';
      v_time_spent := GREATEST(0, COALESCE((v_item->>'time_spent_seconds')::INTEGER, 0));

      IF v_q_id IS NOT NULL AND v_opt_id IS NOT NULL THEN
        v_answered := v_answered + 1;

        SELECT COALESCE(is_correct, FALSE)
        INTO v_is_correct
        FROM public.question_options
        WHERE id = v_opt_id AND question_id = v_q_id;

        v_is_correct := COALESCE(v_is_correct, FALSE);
        IF v_is_correct THEN
          v_correct := v_correct + 1;
        END IF;

        INSERT INTO public.quiz_answers (
          attempt_id, question_id, selected_option_id, is_correct, time_spent_seconds
        ) VALUES (
          v_attempt_id, v_q_id, v_opt_id, v_is_correct, v_time_spent
        )
        ON CONFLICT (attempt_id, question_id) DO NOTHING;
      END IF;
    END LOOP;
  END IF;

  v_score_pct := ROUND((v_correct::NUMERIC / p_total_questions::NUMERIC) * 100, 2);

  UPDATE public.quiz_attempts
  SET answered_questions = v_answered,
      correct_answers = v_correct,
      score_percent = v_score_pct,
      completed_at = NOW()
  WHERE id = v_attempt_id;

  RETURN jsonb_build_object(
    'attempt_id', v_attempt_id,
    'total_questions', p_total_questions,
    'answered_questions', v_answered,
    'correct_answers', v_correct,
    'score_percent', v_score_pct
  );
END;
$$;

-- ----------------------------------------------------------------------------
-- 6. Supabase Storage Buckets & Policies (question-papers, avatars)
-- ----------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('question-papers', 'question-papers', FALSE, 15728640, ARRAY['application/pdf']),
  ('avatars', 'avatars', TRUE, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Authenticated students can read question papers; only admins can upload/delete
CREATE POLICY "Authenticated read question-papers" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'question-papers');

CREATE POLICY "Admin manage question-papers" ON storage.objects
  FOR ALL TO authenticated
  USING (bucket_id = 'question-papers' AND public.is_admin())
  WITH CHECK (bucket_id = 'question-papers' AND public.is_admin());

-- Avatars: Public read, authenticated users can upload/update only inside their own user_id folder
CREATE POLICY "Public read avatars" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users upload own avatar" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users update own avatar" ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
