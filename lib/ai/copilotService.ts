import { CopilotAction } from '@/types';

export interface CopilotResponse {
  content: string;
  actions: CopilotAction[];
}

export function answerTwinOSQuery(
  query: string,
  twinState: {
    terminalAOccupancy: number;
    terminalBOccupancy: number;
    activeIncidentsCount: number;
    energyKwh: number;
  }
): CopilotResponse {
  const q = query.toLowerCase();

  if (q.includes('terminal b') || q.includes('congest') || q.includes('crowd')) {
    return {
      content: `**Terminal B Congestion Analysis:**\n\n• **Current Occupancy:** ${twinState.terminalBOccupancy}% (5,840 passengers)\n• **Root Cause:** Computer Vision Feed \`CAM-TB-04\` detected an inflow surge in Concourse B2 following the simultaneous arrival of Flights AI-102 and EK-504.\n• **AI Forecast:** Projected to reach **94% peak capacity in 20 minutes**.\n• **Recommended Mitigation:** Open auxiliary **Security Checkpoint C** immediately to divert 40% of the passenger flow.`,
      actions: [
        { label: 'View Terminal B in Twin', actionType: 'FOCUS_TWIN', targetId: 'terminal-b' },
        { label: 'Analyze Impact', actionType: 'ANALYZE_IMPACT', targetId: 'terminal-b-root' },
        { label: 'Inspect Security Camera', actionType: 'VIEW_CAMERA', targetId: 'cam-term-b' },
      ],
    };
  }

  if (q.includes('incident') || q.includes('alert') || q.includes('active')) {
    return {
      content: `**Current Active Incidents (${twinState.activeIncidentsCount}):**\n\n1. 🔴 **High Crowd Density** — Terminal B Concourse B2 (Confidence: 94%, Status: Action Required)\n2. 🟡 **Unusual Movement** — Restricted Gate 4 Service Door (Optical Flow detection)\n3. 🟡 **Baggage Belt Slowdown** — Carousel 03 Motor thermal variance (84°C vs 65°C baseline)\n\nAll incidents are actively mapped onto the 3D Digital Twin with real-time telemetry beacons.`,
      actions: [
        { label: 'Focus High Crowd Incident', actionType: 'FOCUS_TWIN', targetId: 'terminal-b' },
        { label: 'Inspect Baggage Belt', actionType: 'VIEW_ASSET', targetId: 'baggage-03' },
      ],
    };
  }

  if (q.includes('asset') || q.includes('risk') || q.includes('hvac') || q.includes('health')) {
    return {
      content: `**Asset Intelligence & Risk Matrix:**\n\n• **HVAC-03 (Terminal B):** Health **78%**, Temp **29.2°C**, Failure Risk **14%**. Thermal load elevated due to concourse crowd density. Preventive lubrication scheduled in 3 days.\n• **Baggage Belt 03 (Terminal A):** Health **76%**, Failure Risk **22%**. Bearing friction detected.\n• **Power Node B:** Health **95%**, Optimal load 1,250 kW.\n• **Central Elevators Bank 1:** Health **88%**, Optimal.\n\nOverall Airport Asset Health Index is currently at **92%**.`,
      actions: [
        { label: 'Focus HVAC-03 in Twin', actionType: 'VIEW_ASSET', targetId: 'hvac-03' },
        { label: 'Analyze HVAC Impact', actionType: 'ANALYZE_IMPACT', targetId: 'hvac-03-node' },
      ],
    };
  }

  if (q.includes('energy') || q.includes('power') || q.includes('consumption') || q.includes('kwh')) {
    return {
      content: `**Energy & Utilities Telemetry:**\n\n• **Total Grid Draw:** ${twinState.energyKwh.toLocaleString()} kWh (↓ 5% vs yesterday)\n• **Terminal B Cooling:** Operating 28% above scheduled baseline due to passenger load.\n• **Lighting Grid:** 91% efficiency with automated daylight harvesting active.\n• **AI Optimization:** Pre-cooling Terminal A while reducing non-critical lighting in Gate A8 corridor can save approximately 420 kWh during the peak hour.`,
      actions: [
        { label: 'Focus Energy Substation', actionType: 'FOCUS_TWIN', targetId: 'energy-hub' },
      ],
    };
  }

  if (q.includes('security') || q.includes('checkpoint')) {
    return {
      content: `**Security Infrastructure Overview:**\n\n• **Checkpoint A (Terminal A):** Normal flow, 18 min wait time, 148 passengers in queue.\n• **Checkpoint B (Terminal B):** High density, 28 min wait time, capacity at 88%.\n• **Restricted Zones:** Perimeter optical sensors online. 1 unverified motion event under investigation near Gate 4.`,
      actions: [
        { label: 'Open Checkpoint C (Action)', actionType: 'ANALYZE_IMPACT', targetId: 'sec-checkpoint-b' },
        { label: 'View Checkpoint A Camera', actionType: 'VIEW_CAMERA', targetId: 'cam-sec-a' },
      ],
    };
  }

  // Default comprehensive overview
  return {
    content: `**TwinOS Airport Operations Summary:**\n\n• **Status:** Operational with 1 High Priority Incident\n• **Passengers:** 12,482 in terminal (↑ 8% peak bank)\n• **Active Flights:** 286 scheduled, 87% on-time\n• **Key Attention Point:** Terminal B concourse crowd buildup requires opening Security Checkpoint C to avoid flight boarding delays.`,
    actions: [
      { label: 'Focus Terminal B', actionType: 'FOCUS_TWIN', targetId: 'terminal-b' },
      { label: 'Analyze Cascade Impact', actionType: 'ANALYZE_IMPACT', targetId: 'terminal-b-root' },
    ],
  };
}
