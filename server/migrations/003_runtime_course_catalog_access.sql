BEGIN;

GRANT USAGE ON SCHEMA public TO devpath_app;
GRANT SELECT ON TABLE public.courses, public.course_releases TO devpath_app;

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_releases ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'courses'
      AND policyname = 'devpath_app_read_published_courses'
  ) THEN
    EXECUTE 'CREATE POLICY devpath_app_read_published_courses
      ON public.courses FOR SELECT TO devpath_app
      USING (published IS TRUE)';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'course_releases'
      AND policyname = 'devpath_app_read_published_releases'
  ) THEN
    EXECUTE 'CREATE POLICY devpath_app_read_published_releases
      ON public.course_releases FOR SELECT TO devpath_app
      USING (published_at IS NOT NULL)';
  END IF;
END
$$;

COMMIT;
