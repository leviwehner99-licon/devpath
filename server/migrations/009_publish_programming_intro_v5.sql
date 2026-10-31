BEGIN;

UPDATE courses
SET summary = 'Programmieren ohne Vorkenntnisse verstehen: klare Regeln, Eingaben, Entscheidungen und passende nächste Kurse – ohne frühen Sprachcode.',
    updated_at = now()
WHERE id = 'programming-intro';

INSERT INTO course_releases (id, course_id, version, manifest, content_sha256, published_at)
VALUES (
  gen_random_uuid(),
  'programming-intro',
  '5.0.0',
  '{"schemaVersion":1,"contentPath":"/courses/programming-intro-5.0.0.json","hashAlgorithm":"sha256"}'::jsonb,
  'd3cbbcfa6b8510b343ca782c17410de034ef0536c7e89dcbdf344303ca43b6b3',
  now()
)
ON CONFLICT (course_id, version) DO UPDATE SET
  manifest = EXCLUDED.manifest,
  content_sha256 = EXCLUDED.content_sha256,
  published_at = EXCLUDED.published_at;

COMMIT;
