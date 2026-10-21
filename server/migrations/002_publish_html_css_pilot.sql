BEGIN;

INSERT INTO courses (id, slug, title, summary, category, language, level, published)
VALUES (
  'pilot-html-css',
  'first-responsive-site',
  'Deine erste responsive Webseite',
  'Ein lokaler Einstieg in semantisches HTML und responsives CSS mit sieben Lernzielen.',
  'Webentwicklung',
  'html-css',
  'beginner',
  TRUE
)
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  category = EXCLUDED.category,
  language = EXCLUDED.language,
  level = EXCLUDED.level,
  published = EXCLUDED.published,
  updated_at = now();

INSERT INTO course_releases (id, course_id, version, manifest, content_sha256, published_at)
VALUES (
  '11111111-1111-4111-8111-111111111111',
  'pilot-html-css',
  '1.0.0',
  '{"schemaVersion":1,"contentPath":"/courses/first-responsive-site-1.0.0.json","hashAlgorithm":"sha256"}'::jsonb,
  '10cd719a5f143a1e6bc5d97992d60402ef000b3a0632dad9305208300bf2fccc',
  now()
)
ON CONFLICT (course_id, version) DO UPDATE SET
  manifest = EXCLUDED.manifest,
  content_sha256 = EXCLUDED.content_sha256,
  published_at = EXCLUDED.published_at;

COMMIT;
