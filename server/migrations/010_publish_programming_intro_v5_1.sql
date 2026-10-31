BEGIN;

UPDATE courses
SET summary = 'Programmieren ohne Vorkenntnisse verstehen: kurze Erklärungen, sichtbare Abläufe und zwei eigene Übungen ohne frühen Sprachcode.',
    updated_at = now()
WHERE id = 'programming-intro';

INSERT INTO course_releases (id, course_id, version, manifest, content_sha256, published_at)
VALUES (
  gen_random_uuid(),
  'programming-intro',
  '5.1.0',
  '{"schemaVersion":1,"contentPath":"/courses/programming-intro-5.1.0.json","hashAlgorithm":"sha256"}'::jsonb,
  '2bc92360949fdfe7cfeb630ff9795565ac22451a8cb53785e9b3ae2490a9d75d',
  now()
)
ON CONFLICT (course_id, version) DO UPDATE SET
  manifest = EXCLUDED.manifest,
  content_sha256 = EXCLUDED.content_sha256,
  published_at = EXCLUDED.published_at;

COMMIT;
