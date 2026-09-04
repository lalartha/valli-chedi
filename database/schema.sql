-- ============================================================================
-- VALLI CHEDI — Database Schema
-- Run this in Supabase SQL Editor
-- ============================================================================

-- 1. USERS
-- Stores minimal user information. id links to auth.users.id
-- ============================================================================

CREATE TABLE IF NOT EXISTS users (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. ACTIVITIES
-- Represents something the user is doing
-- ============================================================================

CREATE TYPE activity_category AS ENUM (
  'RESPONSIBILITY', 'COLLEGE', 'NSS', 'COMMUNITY',
  'MEETING', 'PERSONAL', 'TRAVEL', 'FAMILY', 'OTHER'
);

CREATE TYPE activity_status AS ENUM (
  'PLANNED', 'ONGOING', 'COMPLETED', 'CANCELLED'
);

CREATE TABLE IF NOT EXISTS activities (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title             TEXT NOT NULL,
  category          activity_category NOT NULL DEFAULT 'OTHER',
  start_time        TIMESTAMPTZ NOT NULL,
  end_time          TIMESTAMPTZ,
  location          TEXT,
  district          TEXT,
  state             TEXT DEFAULT 'Kerala',
  overnight         BOOLEAN NOT NULL DEFAULT FALSE,
  return_home_time  TIMESTAMPTZ,
  returned_home     BOOLEAN NOT NULL DEFAULT FALSE,
  status            activity_status NOT NULL DEFAULT 'PLANNED',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_activities_user_id ON activities(user_id);
CREATE INDEX idx_activities_start_time ON activities(start_time);
CREATE INDEX idx_activities_status ON activities(status);

-- 3. VALLIS
-- Main Valli records — the consequences
-- ============================================================================

CREATE TYPE valli_category AS ENUM (
  'RESPONSIBILITY', 'PERMISSION', 'TRAVEL', 'HOME',
  'TIME_COLLISION', 'COMMUNICATION', 'NOTICE_PERIOD',
  'COLLEGE', 'FAMILY', 'PERSONAL', 'OVERNIGHT', 'OTHER'
);

CREATE TYPE valli_status AS ENUM (
  'ACTIVE', 'RESOLVED'
);

CREATE TABLE IF NOT EXISTS vallis (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  activity_id     UUID REFERENCES activities(id) ON DELETE SET NULL,
  parent_valli_id UUID REFERENCES vallis(id) ON DELETE SET NULL,
  category        valli_category NOT NULL DEFAULT 'OTHER',
  title           TEXT NOT NULL,
  description     TEXT,
  severity        INTEGER NOT NULL DEFAULT 1 CHECK (severity >= 1 AND severity <= 10),
  status          valli_status NOT NULL DEFAULT 'ACTIVE',
  growth_points   INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at     TIMESTAMPTZ
);

CREATE INDEX idx_vallis_user_id ON vallis(user_id);
CREATE INDEX idx_vallis_activity_id ON vallis(activity_id);
CREATE INDEX idx_vallis_status ON vallis(status);
CREATE INDEX idx_vallis_parent ON vallis(parent_valli_id);

-- 4. VALLI EVENTS
-- Tracks how a Valli develops over time (append-only log)
-- ============================================================================

CREATE TABLE IF NOT EXISTS valli_events (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  valli_id    UUID NOT NULL REFERENCES vallis(id) ON DELETE CASCADE,
  event_type  TEXT NOT NULL,
  description TEXT,
  points      INTEGER NOT NULL DEFAULT 0,
  timestamp   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_valli_events_valli_id ON valli_events(valli_id);

-- 5. PERMISSIONS
-- Stores permission analysis for activities
-- ============================================================================

CREATE TYPE permission_status AS ENUM (
  'PENDING', 'GRANTED', 'DENIED', 'CONDITIONAL', 'CANCELLED'
);

CREATE TABLE IF NOT EXISTS permissions (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id       UUID NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  requested_at      TIMESTAMPTZ NOT NULL,
  required_by       TIMESTAMPTZ NOT NULL,
  destination       TEXT,
  district          TEXT,
  state             TEXT,
  distance_level    INTEGER DEFAULT 1 CHECK (distance_level >= 1 AND distance_level <= 10),
  notice_days       INTEGER DEFAULT 0,
  notice_score      INTEGER DEFAULT 0,
  difficulty_score  INTEGER DEFAULT 0 CHECK (difficulty_score >= 0 AND difficulty_score <= 10),
  status            permission_status NOT NULL DEFAULT 'PENDING',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_permissions_activity_id ON permissions(activity_id);
CREATE INDEX idx_permissions_user_id ON permissions(user_id);

-- 6. REMINDERS
-- Stores communication reminders (especially Achan check-in)
-- ============================================================================

CREATE TABLE IF NOT EXISTS reminders (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  activity_id     UUID REFERENCES activities(id) ON DELETE SET NULL,
  type            TEXT NOT NULL DEFAULT 'PARENT_CHECKIN',
  recipient       TEXT NOT NULL DEFAULT 'ACHAN',
  interval_hours  INTEGER NOT NULL DEFAULT 5,
  next_trigger    TIMESTAMPTZ,
  last_triggered  TIMESTAMPTZ,
  last_completed  TIMESTAMPTZ,
  missed_count    INTEGER NOT NULL DEFAULT 0,
  active          BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reminders_user_id ON reminders(user_id);
CREATE INDEX idx_reminders_active ON reminders(active);
CREATE INDEX idx_reminders_next_trigger ON reminders(next_trigger);

-- 7. HOME DEBT
-- Humorous representation of pending household responsibilities
-- ============================================================================

CREATE TYPE home_debt_status AS ENUM (
  'PENDING', 'RESOLVED'
);

CREATE TABLE IF NOT EXISTS home_debt (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  activity_id UUID REFERENCES activities(id) ON DELETE SET NULL,
  reason      TEXT NOT NULL,
  points      INTEGER NOT NULL DEFAULT 1,
  status      home_debt_status NOT NULL DEFAULT 'PENDING',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

CREATE INDEX idx_home_debt_user_id ON home_debt(user_id);
CREATE INDEX idx_home_debt_status ON home_debt(status);

-- 8. VALLI STATE
-- Aggregate state per user — one row, upserted on every change
-- ============================================================================

CREATE TABLE IF NOT EXISTS valli_state (
  user_id           UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  total_points      INTEGER NOT NULL DEFAULT 0,
  active_vallis     INTEGER NOT NULL DEFAULT 0,
  resolved_vallis   INTEGER NOT NULL DEFAULT 0,
  growth_level      INTEGER NOT NULL DEFAULT 1,
  growth_percentage INTEGER NOT NULL DEFAULT 0,
  severity          TEXT NOT NULL DEFAULT 'SEED',
  last_updated      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. GROWTH EVENTS
-- Append-only log of every event that changes plant growth
-- ============================================================================

CREATE TABLE IF NOT EXISTS growth_events (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  valli_id      UUID REFERENCES vallis(id) ON DELETE SET NULL,
  growth_points INTEGER NOT NULL DEFAULT 0,
  growth_type   TEXT NOT NULL,
  timestamp     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_growth_events_user_id ON growth_events(user_id);
CREATE INDEX idx_growth_events_timestamp ON growth_events(timestamp);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- Users can only access their own data
-- ============================================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE vallis ENABLE ROW LEVEL SECURITY;
ALTER TABLE valli_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE home_debt ENABLE ROW LEVEL SECURITY;
ALTER TABLE valli_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE growth_events ENABLE ROW LEVEL SECURITY;

-- Users: can read/update own row
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT WITH CHECK (auth.uid() = id);

-- Activities: full CRUD on own data
CREATE POLICY "Users can manage own activities"
  ON activities FOR ALL USING (auth.uid() = user_id);

-- Vallis: full CRUD on own data
CREATE POLICY "Users can manage own vallis"
  ON vallis FOR ALL USING (auth.uid() = user_id);

-- Valli Events: read via valli ownership (select only; inserts are server-side)
CREATE POLICY "Users can view own valli events"
  ON valli_events FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM vallis WHERE vallis.id = valli_events.valli_id AND vallis.user_id = auth.uid()
  ));
CREATE POLICY "Service can insert valli events"
  ON valli_events FOR INSERT WITH CHECK (true);

-- Permissions
CREATE POLICY "Users can manage own permissions"
  ON permissions FOR ALL USING (auth.uid() = user_id);

-- Reminders
CREATE POLICY "Users can manage own reminders"
  ON reminders FOR ALL USING (auth.uid() = user_id);

-- Home Debt
CREATE POLICY "Users can manage own home debt"
  ON home_debt FOR ALL USING (auth.uid() = user_id);

-- Valli State
CREATE POLICY "Users can view own valli state"
  ON valli_state FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service can manage valli state"
  ON valli_state FOR ALL WITH CHECK (true);

-- Growth Events
CREATE POLICY "Users can view own growth events"
  ON growth_events FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service can insert growth events"
  ON growth_events FOR INSERT WITH CHECK (true);

-- ============================================================================
-- UPDATED_AT TRIGGER
-- Automatically updates updated_at on row modification
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_activities_updated_at
  BEFORE UPDATE ON activities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_reminders_updated_at
  BEFORE UPDATE ON reminders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
