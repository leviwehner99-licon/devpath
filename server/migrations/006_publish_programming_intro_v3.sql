BEGIN;

UPDATE courses
SET summary = 'Anfängerfreundlicher Einstieg: Programmierung verstehen, Sprachen einordnen, Lernen üben und erst danach JavaScript schreiben.',
    updated_at = now()
WHERE id = 'programming-intro';

INSERT INTO course_releases (id, course_id, version, manifest, content_sha256, published_at)
VALUES (
  gen_random_uuid(),
  'programming-intro',
  '3.0.0',
  '{"schemaVersion":1,"contentPath":"/courses/programming-intro-3.0.0.json","hashAlgorithm":"sha256"}'::jsonb,
  'f3b52b51dea9b0ac251df59dcef6d2be0f53ab9b335415fd7ee226177e0abff7',
  now()
)
ON CONFLICT (course_id, version) DO UPDATE SET
  manifest = EXCLUDED.manifest,
  content_sha256 = EXCLUDED.content_sha256,
  published_at = EXCLUDED.published_at;

COMMIT;
