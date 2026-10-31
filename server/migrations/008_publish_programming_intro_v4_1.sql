BEGIN;

UPDATE courses
SET summary = 'Anfängerfreundlicher Einstieg mit konkreten Alltagsbeispielen, geprüften Aufgaben und Wiederholungen.',
    updated_at = now()
WHERE id = 'programming-intro';

INSERT INTO course_releases (id, course_id, version, manifest, content_sha256, published_at)
VALUES (
  gen_random_uuid(),
  'programming-intro',
  '4.1.0',
  '{"schemaVersion":1,"contentPath":"/courses/programming-intro-4.1.0.json","hashAlgorithm":"sha256"}'::jsonb,
  '68a32030cbaa27128229daecd7451311b8e254e4fbc3dc3f72127c943e4cba39',
  now()
)
ON CONFLICT (course_id, version) DO UPDATE SET
  manifest = EXCLUDED.manifest,
  content_sha256 = EXCLUDED.content_sha256,
  published_at = EXCLUDED.published_at;

COMMIT;
