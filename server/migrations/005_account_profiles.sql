BEGIN;

ALTER TABLE public.accounts
  ADD COLUMN IF NOT EXISTS profile JSONB NOT NULL DEFAULT '{}'::jsonb;

ALTER TABLE public.accounts
  DROP CONSTRAINT IF EXISTS accounts_profile_is_object;
ALTER TABLE public.accounts
  ADD CONSTRAINT accounts_profile_is_object CHECK (jsonb_typeof(profile) = 'object');

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.accounts TO devpath_app;
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY devpath_app_manage_accounts
  ON public.accounts FOR ALL TO devpath_app
  USING (
    oidc_issuer = current_setting('devpath.oidc_issuer', true)
    AND oidc_subject = current_setting('devpath.oidc_subject', true)
  )
  WITH CHECK (
    oidc_issuer = current_setting('devpath.oidc_issuer', true)
    AND oidc_subject = current_setting('devpath.oidc_subject', true)
  );

COMMIT;
