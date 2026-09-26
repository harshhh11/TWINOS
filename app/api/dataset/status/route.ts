import { NextResponse } from 'next/server';
import { airportDataService } from '@/lib/data/airportDataService';

export async function GET() {
  try {
    const status = await airportDataService.getSupabaseStatus();
    const summary = airportDataService.getSummary();

    return NextResponse.json({
      success: true,
      data: {
        status,
        kpis: summary.kpis,
        mlModels: summary.ml_models,
        meta: summary.meta
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
