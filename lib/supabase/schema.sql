-- ==============================================================================
-- TWINOS POSTGRESQL SCHEMA FOR SUPABASE
-- AI Digital Twin for Smarter Infrastructure
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles & Users
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'Operations Director',
  avatar_url TEXT,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Environments (Airport, Campus, Smart City, Industrial, Hospital)
CREATE TABLE IF NOT EXISTS environments (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  center_lat NUMERIC,
  center_lng NUMERIC,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Zones (Terminals, Runways, Aprons, Parking, Security Halls)
CREATE TABLE IF NOT EXISTS zones (
  id TEXT PRIMARY KEY,
  environment_id TEXT REFERENCES environments(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'NORMAL',
  current_occupancy INTEGER DEFAULT 0,
  max_capacity INTEGER NOT NULL,
  pos_x NUMERIC NOT NULL,
  pos_y NUMERIC NOT NULL,
  pos_z NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Assets (HVAC, Elevators, Baggage Belts, Power Transformers, CCTV)
CREATE TABLE IF NOT EXISTS assets (
  id TEXT PRIMARY KEY,
  environment_id TEXT REFERENCES environments(id) ON DELETE CASCADE,
  zone_id TEXT REFERENCES zones(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  health_score INTEGER NOT NULL DEFAULT 100,
  failure_risk INTEGER NOT NULL DEFAULT 0,
  temperature NUMERIC NOT NULL DEFAULT 22.0,
  power_kw NUMERIC NOT NULL DEFAULT 0.0,
  maintenance_due_days INTEGER DEFAULT 30,
  status TEXT NOT NULL DEFAULT 'OPTIMAL',
  pos_x NUMERIC NOT NULL,
  pos_y NUMERIC NOT NULL,
  pos_z NUMERIC NOT NULL,
  last_inspected TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Asset Dependencies (Graph representation for cascading impact)
CREATE TABLE IF NOT EXISTS asset_dependencies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_id TEXT NOT NULL,
  target_id TEXT NOT NULL,
  relationship_type TEXT NOT NULL,
  criticality TEXT NOT NULL DEFAULT 'HIGH',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Cameras (CCTV surveillance infrastructure)
CREATE TABLE IF NOT EXISTS cameras (
  id TEXT PRIMARY KEY,
  environment_id TEXT REFERENCES environments(id) ON DELETE CASCADE,
  zone_id TEXT REFERENCES zones(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  stream_url TEXT,
  resolution TEXT DEFAULT '1080p',
  fps INTEGER DEFAULT 30,
  is_live BOOLEAN DEFAULT TRUE,
  status TEXT NOT NULL DEFAULT 'NORMAL',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Camera Events (Computer Vision detections)
CREATE TABLE IF NOT EXISTS camera_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  camera_id TEXT REFERENCES cameras(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  confidence NUMERIC NOT NULL,
  crowd_count INTEGER DEFAULT 0,
  queue_minutes INTEGER DEFAULT 0,
  detections JSONB DEFAULT '[]'::jsonb,
  detected_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Sensor Readings (Telemetry streams)
CREATE TABLE IF NOT EXISTS sensor_readings (
  id BIGSERIAL PRIMARY KEY,
  asset_id TEXT REFERENCES assets(id) ON DELETE CASCADE,
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  unit TEXT,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Incidents (Central operational incident lifecycle)
CREATE TABLE IF NOT EXISTS incidents (
  id TEXT PRIMARY KEY,
  environment_id TEXT REFERENCES environments(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'MEDIUM',
  location_id TEXT REFERENCES zones(id) ON DELETE SET NULL,
  detected_by TEXT NOT NULL,
  confidence NUMERIC NOT NULL,
  affected_assets TEXT[],
  ai_analysis TEXT,
  recommendation TEXT,
  status TEXT NOT NULL DEFAULT 'DETECTED',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- 10. AI Predictions (Time-series forecast curves)
CREATE TABLE IF NOT EXISTS ai_predictions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  environment_id TEXT REFERENCES environments(id) ON DELETE CASCADE,
  zone_id TEXT REFERENCES zones(id) ON DELETE CASCADE,
  metric TEXT NOT NULL,
  forecast_json JSONB NOT NULL,
  confidence_score NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. AI Anomalies (Threshold deviations)
CREATE TABLE IF NOT EXISTS ai_anomalies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  asset_id TEXT REFERENCES assets(id) ON DELETE CASCADE,
  metric TEXT NOT NULL,
  current_val NUMERIC NOT NULL,
  baseline_val NUMERIC NOT NULL,
  deviation_pct NUMERIC NOT NULL,
  severity TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. AI Recommendations
CREATE TABLE IF NOT EXISTS ai_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  incident_id TEXT REFERENCES incidents(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  projected_relief_pct INTEGER,
  is_executed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Twin Events (Audit log of state transitions)
CREATE TABLE IF NOT EXISTS twin_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source TEXT NOT NULL,
  event_name TEXT NOT NULL,
  payload JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. Notifications (User alert stream)
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  severity TEXT NOT NULL,
  link_url TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. Copilot Messages (Conversation history)
CREATE TABLE IF NOT EXISTS copilot_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  context_metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. Historical States (Hourly snapshots for timeline replay)
CREATE TABLE IF NOT EXISTS historical_states (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  environment_id TEXT REFERENCES environments(id) ON DELETE CASCADE,
  hour_slot INTEGER NOT NULL,
  occupancy_count INTEGER NOT NULL,
  energy_kwh NUMERIC NOT NULL,
  incident_count INTEGER NOT NULL,
  snapshot_data JSONB NOT NULL,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE environments ENABLE ROW LEVEL SECURITY;
ALTER TABLE zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Read policies for authenticated & public demo
CREATE POLICY "Public read environments" ON environments FOR SELECT USING (true);
CREATE POLICY "Public read zones" ON zones FOR SELECT USING (true);
CREATE POLICY "Public read assets" ON assets FOR SELECT USING (true);
CREATE POLICY "Public read incidents" ON incidents FOR SELECT USING (true);
