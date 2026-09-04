-- ============================================================================
-- VALLI CHEDI — Seed Data
-- Demo scenario: "Bengaluru Trip" from DPR Section 48
-- Run AFTER schema.sql
--
-- NOTE: Replace 'YOUR_AUTH_USER_UUID' with the actual UUID from Supabase Auth
-- after signing up a test user.
-- ============================================================================

-- Placeholder UUID — replace after creating a test user via /api/auth/signup
-- You can find it in Supabase Dashboard → Authentication → Users
DO $$
DECLARE
  demo_user_id UUID := '797f854a-618b-44d7-9f5d-6b47591b5a2a';
  act_id UUID;
  v1_id UUID;
  v2_id UUID;
  v3_id UUID;
  v4_id UUID;
BEGIN

  -- Insert demo user (skip if using real auth — the signup endpoint creates this)
  INSERT INTO users (id, name)
  VALUES (demo_user_id, 'Artha')
  ON CONFLICT (id) DO NOTHING;

  -- Create the Bengaluru Trip activity
  INSERT INTO activities (id, user_id, title, category, start_time, end_time, location, district, state, overnight, status)
  VALUES (
    gen_random_uuid(), demo_user_id,
    'Bengaluru Trip', 'PERSONAL',
    '2026-09-10T08:00:00+05:30', '2026-09-12T20:00:00+05:30',
    'Bengaluru', 'Bengaluru Urban', 'Karnataka',
    TRUE, 'PLANNED'
  )
  RETURNING id INTO act_id;

  -- Generate Vallis for the trip
  -- Valli #1: Permission (late notice)
  INSERT INTO vallis (id, user_id, activity_id, category, title, description, severity, growth_points)
  VALUES (gen_random_uuid(), demo_user_id, act_id, 'PERMISSION',
    'Asked permission one day before',
    'Bengaluru trip with 1-day notice. You knew about this earlier.',
    8, 15)
  RETURNING id INTO v1_id;

  -- Valli #2: Travel (chained from permission)
  INSERT INTO vallis (id, user_id, activity_id, parent_valli_id, category, title, description, severity, growth_points)
  VALUES (gen_random_uuid(), demo_user_id, act_id, v1_id, 'TRAVEL',
    'Long-distance travel to Bengaluru',
    'Distance level: 9 — Another state entirely.',
    7, 10)
  RETURNING id INTO v2_id;

  -- Valli #3: Overnight (chained from travel)
  INSERT INTO vallis (id, user_id, activity_id, parent_valli_id, category, title, description, severity, growth_points)
  VALUES (gen_random_uuid(), demo_user_id, act_id, v2_id, 'OVERNIGHT',
    'Overnight stay away from home',
    'Multi-night trip. Achan protocol activated.',
    5, 6)
  RETURNING id INTO v3_id;

  -- Valli #4: Home responsibility (chained from overnight)
  INSERT INTO vallis (id, user_id, activity_id, parent_valli_id, category, title, description, severity, growth_points)
  VALUES (gen_random_uuid(), demo_user_id, act_id, v3_id, 'HOME',
    'Missed household responsibilities',
    'Away all weekend. Home debt increasing.',
    4, 5)
  RETURNING id INTO v4_id;

  -- Valli events for the chain
  INSERT INTO valli_events (valli_id, event_type, description, points) VALUES
    (v1_id, 'CREATED', 'Permission requested with 1-day notice', 15),
    (v2_id, 'CREATED', 'Travel to Bengaluru (distance level 9)', 10),
    (v3_id, 'CREATED', 'Overnight stay detected', 6),
    (v4_id, 'CREATED', 'Home responsibilities will be missed', 5);

  -- Permission record
  INSERT INTO permissions (activity_id, user_id, requested_at, required_by, destination, district, state, distance_level, notice_days, notice_score, difficulty_score, status)
  VALUES (
    act_id, demo_user_id,
    '2026-09-09T20:00:00+05:30', '2026-09-10T08:00:00+05:30',
    'Bengaluru', 'Bengaluru Urban', 'Karnataka',
    9, 1, 8, 10, 'PENDING'
  );

  -- Achan reminder
  INSERT INTO reminders (user_id, activity_id, type, recipient, interval_hours, next_trigger, active)
  VALUES (
    demo_user_id, act_id,
    'PARENT_CHECKIN', 'ACHAN', 5,
    '2026-09-10T13:00:00+05:30',  -- 5 hours after trip start
    TRUE
  );

  -- Home debt
  INSERT INTO home_debt (user_id, activity_id, reason, points) VALUES
    (demo_user_id, act_id, 'Away all weekend — missed helping with dinner', 5),
    (demo_user_id, act_id, 'Did not complete assigned weekend chore', 3);

  -- Growth events
  INSERT INTO growth_events (user_id, valli_id, growth_points, growth_type) VALUES
    (demo_user_id, v1_id, 15, 'PERMISSION_VALLI'),
    (demo_user_id, v2_id, 10, 'TRAVEL_VALLI'),
    (demo_user_id, v3_id, 6, 'OVERNIGHT_VALLI'),
    (demo_user_id, v4_id, 5, 'HOME_VALLI');

  -- Valli state (aggregate)
  INSERT INTO valli_state (user_id, total_points, active_vallis, resolved_vallis, growth_level, growth_percentage, severity)
  VALUES (demo_user_id, 36, 4, 0, 1, 72, 'SEED')
  ON CONFLICT (user_id) DO UPDATE SET
    total_points = 36,
    active_vallis = 4,
    resolved_vallis = 0,
    growth_level = 1,
    growth_percentage = 72,
    severity = 'SEED',
    last_updated = NOW();

END $$;
