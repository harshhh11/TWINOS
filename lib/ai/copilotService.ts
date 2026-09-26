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

  // 1. "Show abnormal assets" / "Which assets require attention?"
  if (
    q.includes('abnormal assets') ||
    q.includes('show abnormal') ||
    q.includes('which assets') ||
    q.includes('assets require attention') ||
    q.includes('which systems require attention') ||
    q.includes('asset attention') ||
    q.includes('degraded assets')
  ) {
    return {
      content: `**Infrastructure Assets Flagged for Attention:**\n\n1. ⚠️ **HVAC Chiller Unit 03 (Terminal B):** Health **78%**, Temp **29.2°C**, Failure Risk **14%**. Elevated thermal variance in refrigerant coil loop. Preventative lubrication scheduled.\n2. ⚠️ **Baggage Conveyor Belt 03 (Terminal A):** Health **76%**, Temp **31.8°C**, Harmonic Vibration **4.2 mm/s**. Bearing friction spike detected on motor drive B03.\n\nAll other primary assets (Power Substation Primary, Elevators Bank 1, Optical Network Mesh) are operating in nominal status (>92% health).`,
      actions: [
        { label: 'Inspect HVAC-03', actionType: 'VIEW_ASSET', targetId: 'hvac-03' },
        { label: 'Inspect Baggage Belt 03', actionType: 'VIEW_ASSET', targetId: 'baggage-03' },
      ],
    };
  }

  // 2. "Explain the latest anomaly"
  if (
    q.includes('explain the latest anomaly') ||
    q.includes('latest anomaly') ||
    q.includes('explain anomaly') ||
    q.includes('thermal anomaly')
  ) {
    return {
      content: `**Latest Operational Anomaly Diagnostic:**\n\n• **Anomaly ID:** ANOM-2026-041\n• **Location:** Terminal B South Mechanical Bay (HVAC-04 / Chiller Unit 03)\n• **Telemetry Reading:** Coil loop temperature reached **29.2°C** with **145 kW** continuous power draw (+23.0% localized stress).\n• **Baseline Tolerance:** Nominal range is 21.0°C - 24.5°C.\n• **Downstream Risk:** Terminal B Concourse climate regulation efficiency degrades by 18% if unaddressed.\n• **Prescriptive Action:** Shift 35% thermal cooling load to Auxiliary Chiller 04 and dispatch maintenance inspection.`,
      actions: [
        { label: 'Locate in 3D Twin', actionType: 'FOCUS_TWIN', targetId: 'terminal-b' },
        { label: 'Inspect HVAC Telemetry', actionType: 'VIEW_ASSET', targetId: 'hvac-03' },
      ],
    };
  }

  // 3. "Show dependency impact" / "What systems are affected?"
  if (
    q.includes('show dependency impact') ||
    q.includes('dependency impact') ||
    q.includes('what systems are affected') ||
    q.includes('affected by this asset') ||
    q.includes('cascade')
  ) {
    return {
      content: `**Infrastructure Dependency Hierarchy & Cascade Analysis:**\n\n\`\`\`\nMain Power Substation (Primary 11kV Grid Feed)\n   │\n   ├── HVAC Chiller Unit 03 (Elevated: 29.2°C)\n   │      └── Terminal B Concourse (Thermal Load Risk)\n   │\n   ├── Baggage Conveyor System (Friction Alert: 31.8°C)\n   │      └── Terminal A Logistics & Reclaim Hall\n   │\n   └── Terminal B Power Busbar (Normal: 1,250 kW)\n          └── Escalator Bank 04 (Optimal)\n\`\`\`\n\n**Calculated Impact:** Upstream substation voltage fluctuation propagates downstream to HVAC cooling loops and baggage transfer drives. Cascading delay mitigation: **+20 minutes**.`,
      actions: [
        { label: 'Open Dependency Graph', actionType: 'ANALYZE_IMPACT', targetId: 'power-node-b-root' },
        { label: 'View In 3D Twin', actionType: 'FOCUS_TWIN', targetId: 'energy-hub' },
      ],
    };
  }

  // 4. "What incidents are currently active?"
  if (
    q.includes('incidents are currently active') ||
    q.includes('active incidents') ||
    q.includes('what incidents')
  ) {
    return {
      content: `**Currently Active Incidents (${twinState.activeIncidentsCount} Total):**\n\n1. 🔴 **HVAC Chiller Thermal Anomaly** — Terminal B Technical Room 4B (Severity: HIGH, Status: ACTION REQUIRED)\n2. 🟡 **Baggage Belt Motor Vibration Variance** — Carousel 03 Logistics (Severity: MEDIUM, Status: IN PROGRESS)\n3. 🟡 **Power Substation Line B Voltage Fluctuation** — Grid Hub (Severity: MEDIUM, Status: INVESTIGATING)\n\nAll incidents are linked with real-time operational telemetry inside the TwinOS ecosystem.`,
      actions: [
        { label: 'View Assets', actionType: 'VIEW_ASSET', targetId: 'hvac-03' },
        { label: 'Analyze Dependency Cascade', actionType: 'ANALYZE_IMPACT', targetId: 'power-node-b-root' },
      ],
    };
  }

  // 5. "Why is energy consumption increasing?"
  if (
    q.includes('why is energy') ||
    q.includes('energy consumption increasing') ||
    q.includes('energy surge') ||
    q.includes('power consumption')
  ) {
    return {
      content: `**Energy Telemetry Analysis:**\n\n• **Current Terminal Load:** ${twinState.energyKwh.toLocaleString()} kWh (24.3 MW instantaneous)\n• **Primary Factor:** HVAC chiller power draw accounts for **28%** of total facility energy load.\n• **Secondary Load:** Terminal buildings base load consumes 13,130 kWh (54%).\n• **Status:** System running within stable operational envelope without grid overload (-5% vs baseline budget).`,
      actions: [
        { label: 'Inspect Substation', actionType: 'FOCUS_TWIN', targetId: 'energy-hub' },
        { label: 'Inspect HVAC Telemetry', actionType: 'VIEW_ASSET', targetId: 'hvac-03' },
      ],
    };
  }

  // 6. "Summarize today's operational issues."
  if (
    q.includes('summarize today') ||
    q.includes('operational issues') ||
    q.includes('today summary') ||
    q.includes('overview')
  ) {
    return {
      content: `**TwinOS Daily Operational Telemetry Summary:**\n\n• **Facility Status:** 99.8% Nominal System Integrity\n• **Airfield & Runways:** Runway 1 (09L/27R) and Ground Radar operating nominally\n• **Asset Health:** 94.2% fleet average health; 2 equipment units flagged for preventive maintenance (HVAC-03, Baggage Belt 03)\n• **Energy Grid:** 24.3 MW instantaneous power load\n• **Recommended Action:** Execute scheduled filter change for HVAC-03 and calibrate Baggage Belt 03 motor bearing.`,
      actions: [
        { label: 'Inspect Assets', actionType: 'VIEW_ASSET', targetId: 'hvac-03' },
        { label: 'View Dependency Graph', actionType: 'ANALYZE_IMPACT', targetId: 'power-node-b-root' },
      ],
    };
  }

  // Fallback / contextual
  return {
    content: `**TwinOS Operations Intelligence:**\n\n• Connected to real-time Digital Twin operational telemetry and IoT sensor streams.\n• **System Status:** 99.8% Nominal • **Active Incidents:** ${twinState.activeIncidentsCount}\n• **Key Diagnostics:** HVAC-03 thermal variance and Baggage Belt 03 motor bearing friction.\n\nYou can query equipment health, incident states, energy telemetry, or dependency cascades.`,
    actions: [
      { label: 'View Assets', actionType: 'VIEW_ASSET', targetId: 'hvac-03' },
      { label: 'Analyze Dependency Impact', actionType: 'ANALYZE_IMPACT', targetId: 'power-node-b-root' },
    ],
  };
}
