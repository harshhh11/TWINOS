import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import datasetSummary from '@/data/airport_dataset_summary.json';

export interface AirportFlight {
  flight_id: string;
  airline_name: string;
  airline_code: string;
  origin_airport: string;
  destination_airport: string;
  scheduled_departure: string;
  actual_departure?: string;
  aircraft_type: string;
  tail_number: string;
  seat_capacity: number;
  passenger_count: number;
  flight_status: string;
  delay_minutes: number;
  delay_reason?: string;
  terminal: string;
  gate: string;
  is_delayed: boolean;
  delay_severity: string;
  predicted_delay_prob?: number;
  predicted_delay_min?: number;
  load_factor_pct?: number;
  weather_risk_score?: number;
}

export interface AirlineOtpStat {
  airline_name: string;
  total_flights: number;
  delayed_flights: number;
  avg_delay: number;
  otp: number;
  avg_load_factor: number;
}

export interface MLModelMetrics {
  flight_delay_classifier: {
    model_type: string;
    accuracy: number;
    roc_auc: number;
    feature_importances: Array<{ feature: string; importance: number }>;
  };
  delay_duration_regressor: {
    model_type: string;
    target: string;
  };
}

export interface AirportDatasetSummary {
  meta: {
    dataset_name: string;
    generated_at: string;
    airport_code: string;
    airport_name: string;
    tables_included: string[];
  };
  kpis: {
    total_flights: number;
    on_time_performance_pct: number;
    delayed_flights: number;
    avg_delay_minutes: number;
    total_passengers_monitored: number;
    total_baggage_handled: number;
    baggage_avg_weight_kg: number;
    security_avg_wait_sec: number;
    security_hourly_throughput: number;
    retail_gmv_inr: number;
    retail_transactions: number;
    retail_avg_basket_inr: number;
    maintenance_active_orders: number;
    maintenance_total_downtime_min: number;
  };
  ml_models: MLModelMetrics;
  airline_otp: AirlineOtpStat[];
  delay_reasons: Array<{ reason: string; count: number }>;
  time_of_day_distribution: Array<{ time_of_day: string; flights: number; delayed: number; avg_delay_minutes: number }>;
  day_of_week_distribution: Array<{ day_of_week: string; flights: number; delayed: number; avg_delay_minutes: number }>;
  destinations: Array<{ destination_airport: string; flights: number; delayed: number; avg_distance_km: number }>;
  aircraft_types: Array<{ aircraft_type: string; flights: number; delayed: number; avg_capacity: number }>;
  hourly_trend: Array<{ time: string; departures: number; arrivals: number; passengers: number; energyMw: number; queueMins: number }>;
  high_risk_flights: AirportFlight[];
  passenger_metrics: {
    total_monitored: number;
    cabin_class: Record<string, number>;
    age_groups: Record<string, number>;
    top_nationalities: Record<string, number>;
    avg_dwell_hours: number;
    frequent_flyer_pct: number;
  };
  security_metrics: {
    avg_wait_sec: number;
    avg_processing_sec: number;
    throughput_per_lane: number;
    alarm_rate_pct: number;
    lane_activity: Record<string, number>;
  };
  retail_metrics: {
    total_gmv_inr: number;
    avg_basket_inr: number;
    transactions_count: number;
    category_sales: Array<{ product_category: string; transactions: number; revenue: number }>;
  };
  maintenance_metrics: {
    work_orders_count: number;
    aircraft_fleet: string[];
    total_downtime_minutes: number;
    issues: Record<string, number>;
    components: Record<string, number>;
    severity_distribution: Record<string, number>;
    recent_orders: Array<{
      work_order_id: string;
      tail_number: string;
      flight_id: string;
      issue_type: string;
      component: string;
      severity: number;
      downtime_minutes: number;
      start_time: string;
      end_time: string;
    }>;
  };
  gate_utilization: Record<string, number>;
  fids_sample: AirportFlight[];
}

export const airportDataService = {
  getSummary(): AirportDatasetSummary {
    return datasetSummary as unknown as AirportDatasetSummary;
  },

  async getLiveFlights(): Promise<AirportFlight[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('airport_flights')
          .select('*')
          .limit(50);
        if (!error && data && data.length > 0) {
          return data as AirportFlight[];
        }
      } catch (err) {
        console.warn('Falling back to local dataset summary due to Supabase query error:', err);
      }
    }
    return (datasetSummary as any).fids_sample || [];
  },

  async getLiveMaintenanceLogs() {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('airport_maintenance')
          .select('*')
          .limit(20);
        if (!error && data && data.length > 0) {
          return data;
        }
      } catch (err) {
        console.warn('Falling back to local dataset summary due to Supabase query error:', err);
      }
    }
    return (datasetSummary as any).maintenance_metrics?.recent_orders || [];
  },

  async getSupabaseStatus() {
    const isConfigured = isSupabaseConfigured;
    let tablesStatus: Record<string, number> = {};
    let connected = false;

    if (isConfigured) {
      try {
        const { count, error } = await supabase
          .from('airport_flights')
          .select('*', { count: 'exact', head: true });
        if (!error && count !== null) {
          connected = true;
          tablesStatus['airport_flights'] = count;
        }
      } catch {
        connected = false;
      }
    }

    return {
      isConfigured,
      connected,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xbkaffjfbyzunmrjqouh.supabase.co',
      localDataset: {
        flights: datasetSummary.kpis.total_flights,
        passengers: datasetSummary.kpis.total_passengers_monitored,
        baggage: datasetSummary.kpis.total_baggage_handled,
        retailTransactions: datasetSummary.kpis.retail_transactions,
        maintenanceOrders: datasetSummary.kpis.maintenance_active_orders,
      },
      tablesStatus,
    };
  }
};
