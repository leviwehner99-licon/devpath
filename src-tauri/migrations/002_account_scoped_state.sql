CREATE TABLE app_state_scoped (
  account_id TEXT PRIMARY KEY,
  state_json TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO app_state_scoped (account_id, state_json, updated_at)
SELECT 'local', state_json, updated_at FROM app_state WHERE id = 1;

DROP TABLE app_state;
ALTER TABLE app_state_scoped RENAME TO app_state;
