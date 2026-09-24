import { NextRequest, NextResponse } from 'next/server';
import { answerTwinOSQuery } from '@/lib/ai/copilotService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const query = body.query || '';
    const twinState = body.twinState || {
      terminalAOccupancy: 72,
      terminalBOccupancy: 88,
      activeIncidentsCount: 2,
      energyKwh: 24320,
    };

    const response = answerTwinOSQuery(query, twinState);

    return NextResponse.json({
      success: true,
      data: response,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Copilot query failed' },
      { status: 500 }
    );
  }
}
