BEGIN;

UPDATE courses
SET summary = 'Anfängerfreundlicher Einstieg mit kurzen Übungen und zeitversetztem Abrufen früherer Lernziele.',
    updated_at = now()
WHERE id = 'programming-intro';

INSERT INTO course_releases (id, course_id, version, manifest, content_sha256, published_at)
VALUES (
  gen_random_uuid(),
  'programming-intro',
  '4.0.0',
  '{"schemaVersion":1,"contentPath":"/courses/programming-intro-4.0.0.json","hashAlgorithm":"sha256"}'::jsonb,
  '7c7808c128542926c7c9b06bc4311655e93df5f81aecb1e2ba3fd7052bedbd70',
  now()
)
ON CONFLICT (course_id, version) DO UPDATE SET
  manifest = EXCLUDED.manifest,
  content_sha256 = EXCLUDED.content_sha256,
  published_at = EXCLUDED.published_at;

COMMIT;
