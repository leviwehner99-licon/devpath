BEGIN;

UPDATE courses
SET summary = 'Ausführlicher Einstieg mit Abrufübungen, Beispielen, Wiederholungen und einem eigenen JavaScript-Projekt.',
    updated_at = now()
WHERE id = 'programming-intro';

INSERT INTO course_releases (id, course_id, version, manifest, content_sha256, published_at)
VALUES (
  gen_random_uuid(),
  'programming-intro',
  '2.0.0',
  '{"schemaVersion":1,"contentPath":"/courses/programming-intro-2.0.0.json","hashAlgorithm":"sha256"}'::jsonb,
  '8066d3dbfa7e5f42c9383b02e3c9f64a183aefc6a02545e83374de2953c0fe47',
  now()
)
ON CONFLICT (course_id, version) DO UPDATE SET
  manifest = EXCLUDED.manifest,
  content_sha256 = EXCLUDED.content_sha256,
  published_at = EXCLUDED.published_at;

COMMIT;
