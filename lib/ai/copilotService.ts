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
      content: `**Assets Requiring Attention:**\n\n1. ⚠️ **HVAC Air Handler 03 (Terminal B):** Health **78%**, Temp **29.2°C**, Failure Risk **14%**. Thermal load elevated. Filter replacement and bearing lubrication scheduled.\n2. ⚠️ **High-Speed Baggage Carousel Belt 03 (Terminal A):** Health **76%**, Temp **31.8°C**, Failure Risk **22%**. Increased bearing vibration detected on sensor B-03.\n\nAll other primary assets (Elevators Bank 1, Power Substation B, Escalator 04) are operating in optimal status (>88% health).`,
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
      content: `**Currently Active Incidents (${twinState.activeIncidentsCount} Total):**\n\n1. 🔴 **HVAC Chiller Thermal Anomaly** — Terminal B Technical Room 4B (Severity: HIGH, Status: ACTION REQUIRED)\n2. 🟡 **Baggage Belt Motor Vibration Variance** — Carousel 03 Logistics (Severity: MEDIUM, Status: IN PROGRESS)\n3. 🟡 **Power Substation Line B Voltage Fluctuation** — Grid Hub (Severity: MEDIUM, Status: INVESTIGATING)\n\nAll incidents are linked with real-time operational telemetry inside the TwinOS ecosystem.`,
      actions: [
        { label: 'View Assets', actionType: 'VIEW_ASSET', targetId: 'hvac-03' },
        { label: 'Analyze Dependency Cascade', actionType: 'ANALYZE_IMPACT', targetId: 'power-node-b-root' },
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
      content: `**Energy Telemetry Analysis:**\n\n• **Current Terminal Load:** ${twinState.energyKwh.toLocaleString()} kWh (24.3 MW instantaneous)\n• **Primary Factor:** HVAC chiller power draw accounts for **42%** of total facility energy load.\n• **Secondary Load:** Baggage logistics systems operating at peak throughput, consuming 4,860 kWh/hr.\n• **Status:** System running within stable operational envelope without grid overload.`,
      actions: [
        { label: 'Inspect Substation', actionType: 'FOCUS_TWIN', targetId: 'energy-hub' },
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
      content: `**Dependency Hierarchy Mapping (Power Substation B → Downstream Assets):**\n\n\`\`\`\nPower Substation B (Primary 11kV Grid Feed)\n   │\n   ├── HVAC Air Handler 03 (Elevated Temp: 29.2°C)\n   │      └── Terminal B Operations\n   │\n   ├── Baggage Conveyor System (Friction Alert: 31.8°C)\n   │      └── Logistics & Ground Baggage Flow\n   │\n   └── Concourse Escalator 04 (Optimal)\n\`\`\`\n\n**Impact Assessment:** Power supply fluctuations cascade directly into HVAC cooling loops and baggage transfer motors.`,
      actions: [
        { label: 'Open Dependency Graph', actionType: 'ANALYZE_IMPACT', targetId: 'power-node-b-root' },
        { label: 'Inspect Assets', actionType: 'VIEW_ASSET', targetId: 'power-node-b-root' },
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
