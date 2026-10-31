BEGIN;

UPDATE courses
SET summary = 'Programmierung professionell einordnen: Probleme, Datenflüsse, Sprachwahl und Systemaufbau verstehen – mit zwei eigenen Übungen ohne frühen Sprachcode.',
    updated_at = now()
WHERE id = 'programming-intro';

INSERT INTO course_releases (id, course_id, version, manifest, content_sha256, published_at)
VALUES (
  gen_random_uuid(),
  'programming-intro',
  '5.2.0',
  '{"schemaVersion":1,"contentPath":"/courses/programming-intro-5.2.0.json","hashAlgorithm":"sha256"}'::jsonb,
  '56233d216da3e815235a59b9288b3ca377466a41c5641066c655c8b95757909b',
  now()
)
ON CONFLICT (course_id, version) DO UPDATE SET
  manifest = EXCLUDED.manifest,
  content_sha256 = EXCLUDED.content_sha256,
  published_at = EXCLUDED.published_at;

COMMIT;
