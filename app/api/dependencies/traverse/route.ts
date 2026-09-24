import { NextRequest, NextResponse } from 'next/server';
import { calculateCascadeImpact, AIRPORT_DEPENDENCY_EDGES } from '@/lib/dependencies/airportGraph';
import { INITIAL_DEPENDENCY_NODES } from '@/lib/data/airportSeedData';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const rootNodeId = body.rootNodeId || 'terminal-b-root';

    const impact = calculateCascadeImpact(
      rootNodeId,
      INITIAL_DEPENDENCY_NODES,
      AIRPORT_DEPENDENCY_EDGES
    );

    return NextResponse.json({
      success: true,
      impact,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Dependency traversal failed' },
      { status: 500 }
    );
  }
}
