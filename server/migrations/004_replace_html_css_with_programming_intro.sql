BEGIN;

UPDATE courses
SET published = FALSE, updated_at = now()
WHERE id = 'pilot-html-css';

INSERT INTO courses (id, slug, title, summary, category, language, level, published)
VALUES (
  'programming-intro',
  'programming-basics',
  'Einstieg in die Programmierung',
  'Sieben JavaScript-Lektionen zu Ausgaben, Variablen, Datentypen, Bedingungen, Schleifen, Funktionen und einem kleinen Abschlussprojekt.',
  'Programmiergrundlagen',
  'javascript',
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
  gen_random_uuid(),
  'programming-intro',
  '1.0.0',
  '{"schemaVersion":1,"contentPath":"/courses/programming-intro-1.0.0.json","hashAlgorithm":"sha256"}'::jsonb,
  'db58ed16f5670f1cc9b4b680d7e0054868787031cace161461aee6961c1cff92',
  now()
)
ON CONFLICT (course_id, version) DO UPDATE SET
  manifest = EXCLUDED.manifest,
  content_sha256 = EXCLUDED.content_sha256,
  published_at = EXCLUDED.published_at;

COMMIT;
