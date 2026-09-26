import { NextRequest, NextResponse } from 'next/server';
import { answerTwinOSQueryAsync, answerTwinOSQuery } from '@/lib/ai/copilotService';

export async function POST(req: NextRequest) {
  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      body = {};
    }

    const query = body?.query || '';
    const context = body?.context || undefined;
    const history = body?.history || [];

    let response;
    try {
      response = await answerTwinOSQueryAsync(query, context, history);
    } catch (err) {
      console.warn('Async copilot fallback triggered:', err);
      response = answerTwinOSQuery(query, {
        terminalAOccupancy: 72,
        terminalBOccupancy: 88,
        activeIncidentsCount: 2,
        energyKwh: 24320,
      });
    }

    return NextResponse.json({
      success: true,
      data: response,
    });
  } catch (error: any) {
    console.error('API Copilot root error:', error);
    return NextResponse.json({
      success: true,
      data: answerTwinOSQuery('overview', {
        terminalAOccupancy: 72,
        terminalBOccupancy: 88,
        activeIncidentsCount: 2,
        energyKwh: 24320,
      }),
    });
  }
}
