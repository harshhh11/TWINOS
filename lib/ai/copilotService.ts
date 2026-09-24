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

  // 1. "Which assets require attention?"
  if (
    q.includes('which assets') ||
    q.includes('assets require attention') ||
    q.includes('asset attention') ||
    q.includes('degraded assets')
  ) {
    return {
      content: `**Assets Requiring Attention:**\n\n1. ⚠️ **HVAC Air Handler 03 (Terminal B):** Health **78%**, Temp **29.2°C**, Failure Risk **14%**. Thermal load elevated due to concourse crowd density. Preventive lubrication due in 3 days.\n2. ⚠️ **High-Speed Baggage Carousel Belt 03 (Terminal A):** Health **76%**, Temp **31.8°C**, Failure Risk **22%**. Increased bearing vibration detected.\n\nAll other 4 primary assets (Elevators Bank 1, Power Node B, Optical PTZ B2, Escalator 04) are operating in optimal status (>88% health).`,
      actions: [
        { label: 'Inspect HVAC-03', actionType: 'VIEW_ASSET', targetId: 'hvac-03' },
        { label: 'Inspect Baggage Belt 03', actionType: 'VIEW_ASSET', targetId: 'baggage-03' },
      ],
    };
  }

  // 2. "What incidents are currently active?"
  if (
    q.includes('incidents are currently active') ||
    q.includes('active incidents') ||
    q.includes('what incidents')
  ) {
    return {
      content: `**Currently Active Incidents (${twinState.activeIncidentsCount} Total):**\n\n1. 🔴 **High Crowd Density Surge** — Terminal B Concourse B2 (Severity: HIGH, Confidence: 94%, Status: ACTION REQUIRED)\n2. 🟡 **Unusual Perimeter Movement** — Restricted Gate 4 Service Door (Severity: MEDIUM, Status: INVESTIGATING)\n3. 🟡 **Baggage Belt Motor Variance** — Carousel 03 Logistics (Severity: MEDIUM, Status: IN PROGRESS)\n\nAll incidents are linked with real-time coordinate beacons inside the 3D Digital Twin.`,
      actions: [
        { label: 'Focus High Crowd in Twin', actionType: 'FOCUS_TWIN', targetId: 'terminal-b' },
        { label: 'Analyze Cascade Impact', actionType: 'ANALYZE_IMPACT', targetId: 'terminal-b-root' },
      ],
    };
  }

  // 3. "Why is energy consumption increasing?"
  if (
    q.includes('why is energy') ||
    q.includes('energy consumption increasing') ||
    q.includes('energy surge') ||
    q.includes('power consumption')
  ) {
    return {
      content: `**Energy Consumption Analysis:**\n\n• **Current Terminal Load:** ${twinState.energyKwh.toLocaleString()} kWh (24.3 MW instantaneous)\n• **Root Factor:** HVAC chiller power draw has risen by **+28%** in Concourse B due to high passenger density (312 passengers concentrated in Zone B2).\n• **Secondary Load:** Baggage conveyor system operating at 91% duty cycle handling simultaneous international arrival luggage.\n• **AI Mitigation:** Pre-cooling Concourse B by -1.5°C and reducing non-essential apron lighting can shed **1.2 MW** of peak load.`,
      actions: [
        { label: 'Focus Energy Substation in Twin', actionType: 'FOCUS_TWIN', targetId: 'energy-hub' },
        { label: 'Inspect HVAC Telemetry', actionType: 'VIEW_ASSET', targetId: 'hvac-03' },
      ],
    };
  }

  // 4. "What systems are affected by this asset?"
  if (
    q.includes('what systems are affected') ||
    q.includes('affected by this asset') ||
    q.includes('dependency') ||
    q.includes('cascade')
  ) {
    return {
      content: `**Dependency Impact Mapping (Terminal B / HVAC-03):**\n\n\`\`\`\nSubstation Node B (Power Grid)\n   ↓\nHVAC Unit 03 (Warning: 29.2°C)\n   ↓\nPassenger Zone B2 Concourse (Crowd Backpressure: 2.8/m²)\n   ↓\nSecurity Checkpoint B (+28 min queue delay)\n   ↓\nBaggage Transfer Conveyor 03 (Warning)\n\`\`\`\n\n**Total Cascading Risk:** Projected operational delay of **+35 minutes** across international departures if unmitigated.`,
      actions: [
        { label: 'Open Dependency Graph', actionType: 'ANALYZE_IMPACT', targetId: 'terminal-b-root' },
        { label: 'View Terminal B in Twin', actionType: 'FOCUS_TWIN', targetId: 'terminal-b' },
      ],
    };
  }

  // 5. "Summarize today's operational issues."
  if (
    q.includes('summarize today') ||
    q.includes('operational issues') ||
    q.includes('today summary') ||
    q.includes('overview')
  ) {
    return {
      content: `**TwinOS Daily Operational Summary:**\n\n• **Facility Status:** 99.8% Nominal with 1 High-Priority Active Bottleneck\n• **Airfield & Runways:** Runway 1 (09L/27R) & ATC radar operating nominally (RVR > 2000m)\n• **Key Bottleneck:** Terminal B Concourse B2 passenger density surge (+28% above schedule)\n• **Asset Health:** 94.2% fleet average health; 2 equipment units flagged for preventive maintenance (HVAC-03, Baggage Belt 03)\n• **Energy Grid:** 24.3 MW load (5.2% more efficient than baseline)\n• **Primary Prescriptive Action:** Open Security Checkpoint C to reduce queue wait times by 40%.`,
      actions: [
        { label: 'Focus Terminal B', actionType: 'FOCUS_TWIN', targetId: 'terminal-b' },
        { label: 'Execute AI Mitigation', actionType: 'ANALYZE_IMPACT', targetId: 'terminal-b-root' },
      ],
    };
  }

  // Fallback / contextual
  return {
    content: `**TwinOS Intelligence Center:**\n\n• Connected to real-time Digital Twin telemetry, sensor mesh, and predictive models.\n• **Status:** 99.8% Nominal • **Active Incidents:** ${twinState.activeIncidentsCount}\n• **Key Attention:** Terminal B Concourse B2 crowd density and HVAC-03 thermal variance.\n\nYou can ask about assets, incidents, energy analysis, or dependency impacts.`,
    actions: [
      { label: 'View Terminal B in Twin', actionType: 'FOCUS_TWIN', targetId: 'terminal-b' },
      { label: 'Analyze Dependency Impact', actionType: 'ANALYZE_IMPACT', targetId: 'terminal-b-root' },
    ],
  };
}
