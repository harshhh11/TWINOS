-- ==============================================================================
-- TWINOS AIRPORT OPERATIONS RELATIONAL SCHEMA FOR SUPABASE
-- Indira Gandhi International Airport (DEL) Multi-Table Operational Dataset
-- Tables: flights, passengers, baggage, gate_events, security_screening,
--         staff_shifts, retail_transactions, maintenance_logs
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Flights Schedule, Aircraft & Delays
CREATE TABLE IF NOT EXISTS airport_flights (
  flight_id TEXT PRIMARY KEY,
  airline_name TEXT NOT NULL,
  airline_code TEXT NOT NULL,
  origin_airport TEXT NOT NULL DEFAULT 'DEL',
  destination_airport TEXT NOT NULL,
  scheduled_departure TIMESTAMPTZ NOT NULL,
  actual_departure TIMESTAMPTZ,
  scheduled_arrival TIMESTAMPTZ NOT NULL,
  actual_arrival TIMESTAMPTZ,
  aircraft_type TEXT NOT NULL,
  tail_number TEXT NOT NULL,
  seat_capacity INTEGER NOT NULL DEFAULT 180,
  passenger_count INTEGER NOT NULL DEFAULT 150,
  flight_status TEXT NOT NULL DEFAULT 'Departed',
  delay_minutes INTEGER DEFAULT 0,
  delay_reason TEXT,
  terminal TEXT NOT NULL DEFAULT 'T3',
  gate TEXT NOT NULL,
  is_international BOOLEAN DEFAULT FALSE,
  distance_km NUMERIC,
  baggage_weight_total NUMERIC,
  boarding_time TIMESTAMPTZ,
  is_delayed BOOLEAN DEFAULT FALSE,
  delay_severity TEXT DEFAULT 'On-Time',
  load_factor_pct NUMERIC,
  baggage_count INTEGER DEFAULT 0,
  weather_risk_score NUMERIC DEFAULT 0.0,
  time_of_day TEXT,
  day_of_week TEXT,
  is_weekend BOOLEAN DEFAULT FALSE,
  season TEXT,
  route_category TEXT,
  predicted_delay_prob NUMERIC,
  predicted_delay_min INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Passenger Journey & Demographics
CREATE TABLE IF NOT EXISTS airport_passengers (
  pnr_code TEXT PRIMARY KEY,
  passenger_id BIGINT UNIQUE NOT NULL,
  passport_hash TEXT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  nationality TEXT NOT NULL,
  dob DATE,
  gender TEXT,
  seat_number TEXT,
  cabin_class TEXT NOT NULL,
  flight_id TEXT REFERENCES airport_flights(flight_id) ON DELETE SET NULL,
  check_in_time TIMESTAMPTZ,
  security_time TIMESTAMPTZ,
  gate TEXT,
  baggage_weight_kg NUMERIC DEFAULT 0,
  email TEXT,
  phone TEXT,
  special_assistance BOOLEAN DEFAULT FALSE,
  dwell_time_hours NUMERIC,
  is_frequent_flyer BOOLEAN DEFAULT FALSE,
  fare_class TEXT,
  age INTEGER,
  age_group TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Baggage Lifecycle & Sortation
CREATE TABLE IF NOT EXISTS airport_baggage (
  baggage_tag_id TEXT PRIMARY KEY,
  pnr_code TEXT REFERENCES airport_passengers(pnr_code) ON DELETE SET NULL,
  flight_id TEXT REFERENCES airport_flights(flight_id) ON DELETE SET NULL,
  passport_hash TEXT,
  weight_kg NUMERIC NOT NULL,
  dimensions TEXT,
  scan_stage TEXT NOT NULL DEFAULT 'Check-in',
  carousel_id TEXT,
  check_in_time TIMESTAMPTZ,
  security_screen_time TIMESTAMPTZ,
  cart_container_id INTEGER,
  status TEXT NOT NULL DEFAULT 'Loaded',
  is_mishandled BOOLEAN DEFAULT FALSE,
  delay_minutes INTEGER DEFAULT 0,
  handling_location TEXT DEFAULT 'Ramp',
  loaded_time TIMESTAMPTZ,
  is_fragile BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Gate & Boarding Events
CREATE TABLE IF NOT EXISTS airport_gate_events (
  event_id TEXT PRIMARY KEY,
  flight_id TEXT REFERENCES airport_flights(flight_id) ON DELETE CASCADE,
  gate TEXT NOT NULL,
  terminal TEXT NOT NULL DEFAULT 'T3',
  event_type TEXT NOT NULL,
  event_time TIMESTAMPTZ NOT NULL,
  agent_id TEXT,
  duration_minutes INTEGER DEFAULT 60,
  status TEXT NOT NULL DEFAULT 'Routine',
  is_delayed BOOLEAN DEFAULT FALSE,
  scheduled_time TIMESTAMPTZ,
  actual_time TIMESTAMPTZ,
  completed_time TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Security Screening Operations
CREATE TABLE IF NOT EXISTS airport_security (
  screening_id TEXT PRIMARY KEY,
  passport_hash TEXT,
  pnr_code TEXT REFERENCES airport_passengers(pnr_code) ON DELETE SET NULL,
  checkpoint_lane INTEGER NOT NULL DEFAULT 1,
  queue_entry_time TIMESTAMPTZ,
  screening_start_time TIMESTAMPTZ,
  screening_end_time TIMESTAMPTZ,
  screening_result TEXT NOT NULL DEFAULT 'Clear',
  alarm_triggered BOOLEAN DEFAULT FALSE,
  officer_id TEXT,
  machine_id TEXT DEFAULT 'XRAY-1',
  processing_time_sec INTEGER DEFAULT 60,
  secondary_search BOOLEAN DEFAULT FALSE,
  baggage_recheck BOOLEAN DEFAULT FALSE,
  shift_id TEXT,
  hourly_throughput INTEGER DEFAULT 400,
  queue_wait_sec INTEGER DEFAULT 180,
  total_screening_sec INTEGER DEFAULT 240,
  anomaly_flag BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Staff Shifts & Operational Workforce
CREATE TABLE IF NOT EXISTS airport_staff (
  staff_id TEXT PRIMARY KEY,
  staff_name TEXT NOT NULL,
  department TEXT NOT NULL,
  role TEXT NOT NULL,
  shift_date DATE NOT NULL,
  shift_start TIMESTAMPTZ,
  shift_end TIMESTAMPTZ,
  terminal TEXT NOT NULL DEFAULT 'T3',
  gate_zone TEXT,
  supervisor_id TEXT,
  hours_scheduled INTEGER DEFAULT 8,
  overtime_flag BOOLEAN DEFAULT FALSE,
  contract_date DATE,
  primary_language TEXT DEFAULT 'English',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Retail Purchases & Concessions
CREATE TABLE IF NOT EXISTS airport_retail (
  transaction_id TEXT PRIMARY KEY,
  store_id TEXT NOT NULL,
  store_category TEXT NOT NULL,
  store_type TEXT NOT NULL,
  passport_hash TEXT,
  flight_id TEXT REFERENCES airport_flights(flight_id) ON DELETE SET NULL,
  transaction_time TIMESTAMPTZ NOT NULL,
  product_category TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  amount_inr NUMERIC NOT NULL,
  tax_inr NUMERIC DEFAULT 0,
  payment_method TEXT DEFAULT 'Card',
  currency TEXT DEFAULT 'INR',
  terminal TEXT NOT NULL DEFAULT 'T3',
  location_zone TEXT DEFAULT 'Near Gate',
  is_approved BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Aircraft Engineering & Maintenance Logs
CREATE TABLE IF NOT EXISTS airport_maintenance (
  work_order_id TEXT PRIMARY KEY,
  tail_number TEXT NOT NULL,
  flight_id TEXT REFERENCES airport_flights(flight_id) ON DELETE SET NULL,
  log_type TEXT NOT NULL,
  technician_id TEXT,
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  severity INTEGER DEFAULT 1,
  downtime_minutes INTEGER DEFAULT 0,
  issue_type TEXT NOT NULL,
  component TEXT NOT NULL,
  priority INTEGER DEFAULT 3,
  signoff_engineer_id TEXT,
  aog_flag BOOLEAN DEFAULT FALSE,
  deferred BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR HIGH-PERFORMANCE REAL-TIME QUERIES
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_flights_departure ON airport_flights(scheduled_departure);
CREATE INDEX IF NOT EXISTS idx_flights_airline ON airport_flights(airline_name);
CREATE INDEX IF NOT EXISTS idx_flights_status ON airport_flights(flight_status);
CREATE INDEX IF NOT EXISTS idx_flights_gate ON airport_flights(gate);
CREATE INDEX IF NOT EXISTS idx_passengers_flight ON airport_passengers(flight_id);
CREATE INDEX IF NOT EXISTS idx_baggage_flight ON airport_baggage(flight_id);
CREATE INDEX IF NOT EXISTS idx_security_lane ON airport_security(checkpoint_lane);
CREATE INDEX IF NOT EXISTS idx_retail_flight ON airport_retail(flight_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_tail ON airport_maintenance(tail_number);

-- ==============================================================================
-- ANALYTICAL VIEWS FOR TWINOS DASHBOARD & PREDICTIONS
-- ==============================================================================

-- View 1: On-Time Performance & Delay Summary by Airline
CREATE OR REPLACE VIEW v_flight_delay_summary AS
SELECT 
  airline_name,
  airline_code,
  COUNT(*) AS total_flights,
  COUNT(*) FILTER (WHERE is_delayed = TRUE) AS delayed_count,
  ROUND((COUNT(*) FILTER (WHERE is_delayed = FALSE)::NUMERIC / COUNT(*)) * 100, 1) AS otp_percent,
  ROUND(AVG(delay_minutes), 1) AS avg_delay_minutes,
  ROUND(AVG(load_factor_pct), 1) AS avg_load_factor
FROM airport_flights
GROUP BY airline_name, airline_code
ORDER BY total_flights DESC;

-- View 2: Security Screening Hourly Throughput & Wait Times
CREATE OR REPLACE VIEW v_security_throughput AS
SELECT 
  checkpoint_lane,
  shift_id,
  ROUND(AVG(queue_wait_sec), 0) AS avg_wait_seconds,
  ROUND(AVG(processing_time_sec), 0) AS avg_process_seconds,
  ROUND(AVG(hourly_throughput), 0) AS avg_hourly_throughput,
  COUNT(*) FILTER (WHERE alarm_triggered = TRUE) AS total_alarms,
  COUNT(*) AS total_screened
FROM airport_security
GROUP BY checkpoint_lane, shift_id;

-- View 3: Retail Revenue & Concession Sales
CREATE OR REPLACE VIEW v_retail_revenue_analytics AS
SELECT 
  product_category,
  store_category,
  COUNT(*) AS total_transactions,
  SUM(amount_inr) AS total_revenue_inr,
  ROUND(AVG(amount_inr), 2) AS avg_ticket_inr
FROM airport_retail
GROUP BY product_category, store_category
ORDER BY total_revenue_inr DESC;

-- View 4: Fleet Aircraft Maintenance Defect Summary
CREATE OR REPLACE VIEW v_maintenance_critical_assets AS
SELECT 
  tail_number,
  COUNT(*) AS total_work_orders,
  SUM(downtime_minutes) AS total_downtime_minutes,
  ROUND(AVG(severity), 1) AS avg_severity,
  STRING_AGG(DISTINCT issue_type, ', ') AS issue_types,
  STRING_AGG(DISTINCT component, ', ') AS components_involved
FROM airport_maintenance
GROUP BY tail_number
ORDER BY total_downtime_minutes DESC;

-- ==============================================================================
-- ENABLE ROW LEVEL SECURITY & PUBLIC READ POLICIES
-- ==============================================================================
ALTER TABLE airport_flights ENABLE ROW LEVEL SECURITY;
ALTER TABLE airport_passengers ENABLE ROW LEVEL SECURITY;
ALTER TABLE airport_baggage ENABLE ROW LEVEL SECURITY;
ALTER TABLE airport_gate_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE airport_security ENABLE ROW LEVEL SECURITY;
ALTER TABLE airport_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE airport_retail ENABLE ROW LEVEL SECURITY;
ALTER TABLE airport_maintenance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read airport_flights" ON airport_flights FOR SELECT USING (true);
CREATE POLICY "Public read airport_passengers" ON airport_passengers FOR SELECT USING (true);
CREATE POLICY "Public read airport_baggage" ON airport_baggage FOR SELECT USING (true);
CREATE POLICY "Public read airport_gate_events" ON airport_gate_events FOR SELECT USING (true);
CREATE POLICY "Public read airport_security" ON airport_security FOR SELECT USING (true);
CREATE POLICY "Public read airport_staff" ON airport_staff FOR SELECT USING (true);
CREATE POLICY "Public read airport_retail" ON airport_retail FOR SELECT USING (true);
CREATE POLICY "Public read airport_maintenance" ON airport_maintenance FOR SELECT USING (true);

-- Allow authenticated / service_role full write access
CREATE POLICY "Full write airport_flights" ON airport_flights FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full write airport_passengers" ON airport_passengers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full write airport_baggage" ON airport_baggage FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full write airport_gate_events" ON airport_gate_events FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full write airport_security" ON airport_security FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full write airport_staff" ON airport_staff FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full write airport_retail" ON airport_retail FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Full write airport_maintenance" ON airport_maintenance FOR ALL USING (true) WITH CHECK (true);
