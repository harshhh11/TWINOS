import os
import json
import time
import requests
import pandas as pd
import numpy as np

# Disable SSL verification warnings if local certificates require bypass
import urllib3
urllib3.disable_warnings()

def get_env_var(key, default=None):
    # Check OS env first
    val = os.getenv(key)
    if val:
        return val
    # Check .env.local
    env_file = os.path.join(os.path.dirname(__file__), '..', '.env.local')
    if os.path.exists(env_file):
        with open(env_file, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if line.startswith(f"{key}="):
                    return line.split('=', 1)[1].strip().strip('"').strip("'")
    return default

SUPABASE_URL = get_env_var('NEXT_PUBLIC_SUPABASE_URL', 'https://xbkaffjfbyzunmrjqouh.supabase.co')
SUPABASE_KEY = get_env_var('SUPABASE_SERVICE_ROLE_KEY') or get_env_var('NEXT_PUBLIC_SUPABASE_ANON_KEY')

print("=" * 70)
print("TWINOS AIRPORT OPERATIONS SUPABASE SEEDER")
print("Target Supabase URL:", SUPABASE_URL)
if not SUPABASE_KEY:
    print("\n[WARNING] Supabase API key (NEXT_PUBLIC_SUPABASE_ANON_KEY or SUPABASE_SERVICE_ROLE_KEY) not found in .env.local.")
    print("Please set your API key in .env.local to upload live data directly to Supabase.")
    print("Example in .env.local:")
    print(f"NEXT_PUBLIC_SUPABASE_URL={SUPABASE_URL}")
    print("NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-or-service-key-here")
    print("=" * 70)
else:
    print(f"Supabase Key found: {SUPABASE_KEY[:12]}...{SUPABASE_KEY[-4:]}")
print("=" * 70)

DATA_DIR = os.path.join(os.path.dirname(__file__), '..', 'data', 'airport-operations')

HEADERS = {
    "apikey": SUPABASE_KEY or "",
    "Authorization": f"Bearer {SUPABASE_KEY or ''}",
    "Content-Type": "application/json",
    "Prefer": "resolution=merge-duplicates"
}

def post_batch(table_name, records, batch_size=200):
    if not SUPABASE_KEY:
        print(f"Skipping upload for {table_name} (no API key configured).")
        return False

    url = f"{SUPABASE_URL}/rest/v1/{table_name}"
    total = len(records)
    print(f"Uploading {total} records to {table_name}...")

    for i in range(0, total, batch_size):
        chunk = records[i:i + batch_size]
        try:
            resp = requests.post(url, headers=HEADERS, json=chunk, verify=False, timeout=30)
            if resp.status_code in (200, 201, 204):
                print(f"  [{table_name}] Batch {i // batch_size + 1}/{(total - 1) // batch_size + 1} ({len(chunk)} rows) uploaded successfully.")
            else:
                print(f"  [{table_name}] Batch failed with status {resp.status_code}: {resp.text[:200]}")
                return False
        except Exception as e:
            print(f"  [{table_name}] Exception during upload: {e}")
            return False
        time.sleep(0.1)

    print(f"Successfully finished {table_name}!\n")
    return True

def run_seeder():
    # 1. Flights
    f_csv = os.path.join(DATA_DIR, 'flights.csv')
    if os.path.exists(f_csv):
        df = pd.read_csv(f_csv)
        cols = [
            'flight_id', 'airline_name', 'airline_code', 'origin_airport', 'destination_airport',
            'scheduled_departure', 'actual_departure', 'scheduled_arrival', 'actual_arrival',
            'aircraft_type', 'tail_number', 'seat_capacity', 'passenger_count', 'flight_status',
            'delay_minutes', 'delay_reason', 'terminal', 'gate', 'is_international', 'distance_km',
            'baggage_weight_total', 'boarding_time', 'is_delayed', 'delay_severity', 'load_factor_pct',
            'baggage_count', 'weather_risk_score', 'time_of_day', 'day_of_week', 'is_weekend',
            'season', 'route_category'
        ]
        df.columns = cols[:len(df.columns)]
        df = df.where(pd.notnull(df), None)
        flights = df.to_dict(orient='records')
        post_batch('airport_flights', flights)

    # 2. Passengers
    p_csv = os.path.join(DATA_DIR, 'passengers.csv')
    if os.path.exists(p_csv):
        df = pd.read_csv(p_csv)
        cols = [
            'pnr_code', 'passenger_id', 'passport_hash', 'first_name', 'last_name',
            'nationality', 'dob', 'gender', 'seat_number', 'cabin_class',
            'flight_id', 'check_in_time', 'security_time', 'gate', 'baggage_weight_kg',
            'col_15', 'col_16', 'col_17', 'email', 'phone',
            'col_20', 'col_21', 'special_assistance', 'dwell_time_hours', 'is_frequent_flyer',
            'fare_class', 'age', 'age_group'
        ]
        df.columns = cols[:len(df.columns)]
        df = df[[c for c in cols if not c.startswith('col_')]]
        df = df.where(pd.notnull(df), None)
        passengers = df.to_dict(orient='records')
        post_batch('airport_passengers', passengers)

    # 3. Baggage
    b_csv = os.path.join(DATA_DIR, 'baggage.csv')
    if os.path.exists(b_csv):
        df = pd.read_csv(b_csv)
        cols = [
            'baggage_tag_id', 'pnr_code', 'flight_id', 'passport_hash', 'weight_kg',
            'dimensions', 'scan_stage', 'carousel_id', 'check_in_time', 'security_screen_time',
            'cart_container_id', 'status', 'is_mishandled', 'delay_minutes', 'handling_location',
            'loaded_time', 'is_fragile', 'col_17'
        ]
        df.columns = cols[:len(df.columns)]
        df = df[[c for c in cols if not c.startswith('col_')]]
        df = df.where(pd.notnull(df), None)
        baggage = df.to_dict(orient='records')
        post_batch('airport_baggage', baggage)

    # 4. Gate Events
    g_csv = os.path.join(DATA_DIR, 'gate_events.csv')
    if os.path.exists(g_csv):
        df = pd.read_csv(g_csv)
        cols = [
            'event_id', 'flight_id', 'gate', 'terminal', 'event_type',
            'event_time', 'agent_id', 'duration_minutes', 'status', 'is_delayed',
            'col_10', 'scheduled_time', 'actual_time', 'completed_time'
        ]
        df.columns = cols[:len(df.columns)]
        df = df[[c for c in cols if not c.startswith('col_')]]
        df = df.where(pd.notnull(df), None)
        gates = df.to_dict(orient='records')
        post_batch('airport_gate_events', gates)

    # 5. Security Screening
    s_csv = os.path.join(DATA_DIR, 'security_screening.csv')
    if os.path.exists(s_csv):
        df = pd.read_csv(s_csv)
        cols = [
            'screening_id', 'passport_hash', 'pnr_code', 'checkpoint_lane', 'queue_entry_time',
            'screening_start_time', 'screening_end_time', 'screening_result', 'col_8', 'alarm_triggered',
            'officer_id', 'machine_id', 'processing_time_sec', 'secondary_search', 'baggage_recheck',
            'shift_id', 'hourly_throughput', 'queue_wait_sec', 'total_screening_sec', 'anomaly_flag'
        ]
        df.columns = cols[:len(df.columns)]
        df = df[[c for c in cols if not c.startswith('col_')]]
        df = df.where(pd.notnull(df), None)
        sec = df.to_dict(orient='records')
        post_batch('airport_security', sec)

    # 6. Staff Shifts
    st_csv = os.path.join(DATA_DIR, 'staff_shifts.csv')
    if os.path.exists(st_csv):
        df = pd.read_csv(st_csv)
        cols = [
            'staff_id', 'staff_name', 'department', 'role', 'shift_date',
            'shift_start', 'shift_end', 'terminal', 'gate_zone', 'supervisor_id',
            'hours_scheduled', 'overtime_flag', 'col_12', 'contract_date', 'primary_language'
        ]
        df.columns = cols[:len(df.columns)]
        df = df[[c for c in cols if not c.startswith('col_')]]
        df = df.where(pd.notnull(df), None)
        staff = df.to_dict(orient='records')
        post_batch('airport_staff', staff)

    # 7. Retail Transactions
    r_csv = os.path.join(DATA_DIR, 'retail_transactions.csv')
    if os.path.exists(r_csv):
        df = pd.read_csv(r_csv)
        cols = [
            'transaction_id', 'store_id', 'store_category', 'store_type', 'passport_hash',
            'flight_id', 'transaction_time', 'product_category', 'quantity', 'amount_inr',
            'tax_inr', 'payment_method', 'currency', 'col_13', 'terminal',
            'location_zone', 'is_approved'
        ]
        df.columns = cols[:len(df.columns)]
        df = df[[c for c in cols if not c.startswith('col_')]]
        df = df.where(pd.notnull(df), None)
        retail = df.to_dict(orient='records')
        post_batch('airport_retail', retail)

    # 8. Maintenance Logs
    m_csv = os.path.join(DATA_DIR, 'maintenance_logs.csv')
    if os.path.exists(m_csv):
        df = pd.read_csv(m_csv)
        cols = [
            'work_order_id', 'tail_number', 'flight_id', 'log_type', 'technician_id',
            'start_time', 'end_time', 'severity', 'downtime_minutes', 'issue_type',
            'component', 'priority', 'signoff_engineer_id', 'aog_flag', 'deferred', 'col_15'
        ]
        df.columns = cols[:len(df.columns)]
        df = df[[c for c in cols if not c.startswith('col_')]]
        df = df.where(pd.notnull(df), None)
        maint = df.to_dict(orient='records')
        post_batch('airport_maintenance', maint)

if __name__ == '__main__':
    run_seeder()
