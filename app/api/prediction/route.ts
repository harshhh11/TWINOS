import { NextRequest, NextResponse } from 'next/server';
import { getAssetDegradationPrediction } from '@/lib/prediction/predictionEngine';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const loadParam = searchParams.get('load');
  const isHighLoad = searchParams.get('highLoad') === 'true';

  const load = loadParam ? parseInt(loadParam, 10) : 78;
  const prediction = getAssetDegradationPrediction(load, isHighLoad);

  return NextResponse.json({
    success: true,
    data: prediction,
  });
}
