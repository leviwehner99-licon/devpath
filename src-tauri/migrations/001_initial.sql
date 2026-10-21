PRAGMA foreign_keys = ON;

CREATE TABLE learner_profile (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  display_name TEXT NOT NULL DEFAULT 'Lernende Person',
  learning_goal TEXT NOT NULL DEFAULT '',
  experience_level TEXT NOT NULL DEFAULT 'new' CHECK (experience_level IN ('new', 'some', 'experienced')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE learning_preferences (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  weekly_sessions INTEGER NOT NULL DEFAULT 3 CHECK (weekly_sessions BETWEEN 1 AND 7),
  session_minutes INTEGER NOT NULL DEFAULT 20 CHECK (session_minutes BETWEEN 5 AND 120),
  theme TEXT NOT NULL DEFAULT 'system' CHECK (theme IN ('system', 'light', 'dark')),
  reduced_motion INTEGER NOT NULL DEFAULT 0 CHECK (reduced_motion IN (0, 1)),
  diagnostics_opt_in INTEGER NOT NULL DEFAULT 0 CHECK (diagnostics_opt_in IN (0, 1)),
  ai_mode TEXT NOT NULL DEFAULT 'off' CHECK (ai_mode IN ('off', 'local', 'external')),
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE course_progress (
  course_id TEXT PRIMARY KEY,
  course_version TEXT NOT NULL,
  completed_at TEXT,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE lesson_progress (
  lesson_id TEXT PRIMARY KEY,
  course_id TEXT NOT NULL,
  course_version TEXT NOT NULL,
  completed_at TEXT,
  last_attempt_at TEXT,
  next_review_at TEXT,
  confidence INTEGER NOT NULL DEFAULT 0 CHECK (confidence BETWEEN 0 AND 5),
  hint_count INTEGER NOT NULL DEFAULT 0 CHECK (hint_count >= 0),
  attempts INTEGER NOT NULL DEFAULT 0 CHECK (attempts >= 0),
  editor_content TEXT NOT NULL DEFAULT '',
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE app_state (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  state_json TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX lesson_progress_next_review ON lesson_progress(next_review_at);
CREATE INDEX lesson_progress_course ON lesson_progress(course_id);

CREATE TABLE local_projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  relative_path TEXT,
  language TEXT NOT NULL DEFAULT 'html',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE project_versions (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES local_projects(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  note TEXT NOT NULL DEFAULT '',
  snapshot_json TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX project_versions_project_date ON project_versions(project_id, created_at DESC);

INSERT INTO learner_profile (id) VALUES (1);
INSERT INTO learning_preferences (id) VALUES (1);
INSERT INTO app_state (id, state_json) VALUES (1, '{}');
