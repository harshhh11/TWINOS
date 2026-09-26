import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import datasetSummary from '@/data/airport_dataset_summary.json';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const key = body.supabaseKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
    const url = body.supabaseUrl || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xbkaffjfbyzunmrjqouh.supabase.co';

    if (!key) {
      return NextResponse.json({
        success: false,
        message: 'Supabase API key is required. Please add NEXT_PUBLIC_SUPABASE_ANON_KEY or SUPABASE_SERVICE_ROLE_KEY in .env.local or provide it in the sync request.',
        supabaseUrl: url,
        localDatasetReady: true,
        recordCounts: {
          flights: datasetSummary.kpis.total_flights,
          passengers: datasetSummary.kpis.total_passengers_monitored,
          baggage: datasetSummary.kpis.total_baggage_handled,
          retail: datasetSummary.kpis.retail_transactions,
          maintenance: datasetSummary.kpis.maintenance_active_orders,
        }
      }, { status: 400 });
    }

    // Try uploading a test batch to airport_flights
    const flightsSample = (datasetSummary as any).fids_sample || [];
    const { data, error } = await supabase
      .from('airport_flights')
      .upsert(flightsSample, { onConflict: 'flight_id' });

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
        hint: 'Please ensure you have executed the schema migration script lib/supabase/airport_operations_schema.sql in your Supabase SQL Editor first.'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully seeded dataset into Supabase!',
      syncedFlights: flightsSample.length,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}
