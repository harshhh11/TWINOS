import { NextRequest, NextResponse } from 'next/server';
import { analyzeFrame, generateEventFromVision } from '@/lib/vision/visionEngine';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const location = body.location || 'terminal-b';
    const cameraId = body.cameraId || 'cam-term-b';

    const result = analyzeFrame(location);
    const event = generateEventFromVision(result, location, 'Terminal B Concourse', cameraId);

    return NextResponse.json({
      success: true,
      analysis: result,
      generatedEvent: event,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Computer Vision inference failed' },
      { status: 500 }
    );
  }
}
