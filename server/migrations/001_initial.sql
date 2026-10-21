BEGIN;

CREATE TABLE accounts (
  id UUID PRIMARY KEY,
  oidc_issuer TEXT NOT NULL,
  oidc_subject TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  disabled_at TIMESTAMPTZ,
  UNIQUE (oidc_issuer, oidc_subject)
);

CREATE TABLE courses (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  category TEXT NOT NULL,
  language TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  published BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE course_releases (
  id UUID PRIMARY KEY,
  course_id TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  version TEXT NOT NULL,
  manifest JSONB NOT NULL,
  content_sha256 CHAR(64) NOT NULL CHECK (content_sha256 ~ '^[a-f0-9]{64}$'),
  published_at TIMESTAMPTZ,
  UNIQUE (course_id, version)
);

CREATE TABLE app_releases (
  id UUID PRIMARY KEY,
  version TEXT NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('windows-x64', 'windows-arm64', 'macos-arm64', 'macos-x64', 'linux-x64', 'linux-arm64')),
  channel TEXT NOT NULL CHECK (channel IN ('alpha', 'beta', 'stable')),
  artifact_url TEXT NOT NULL,
  artifact_sha256 CHAR(64) NOT NULL CHECK (artifact_sha256 ~ '^[a-f0-9]{64}$'),
  signature TEXT NOT NULL,
  minimum_version TEXT,
  mandatory BOOLEAN NOT NULL DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  UNIQUE (version, platform, channel)
);

CREATE INDEX courses_published_category ON courses(category, title) WHERE published = TRUE;
CREATE INDEX course_releases_published ON course_releases(course_id, published_at DESC) WHERE published_at IS NOT NULL;
CREATE INDEX app_releases_channel_platform ON app_releases(channel, platform, published_at DESC) WHERE published_at IS NOT NULL;

COMMIT;
