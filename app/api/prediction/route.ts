import { NextRequest, NextResponse } from 'next/server';
import { getTerminalPrediction } from '@/lib/prediction/predictionEngine';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const occupancyParam = searchParams.get('occupancy');
  const isHighCrowd = searchParams.get('highCrowd') === 'true';

  const occupancy = occupancyParam ? parseInt(occupancyParam, 10) : 88;
  const prediction = getTerminalPrediction(occupancy, isHighCrowd);

  return NextResponse.json({
    success: true,
    data: prediction,
  });
}
