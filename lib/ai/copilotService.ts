import { CopilotAction } from '@/types';
import { queryGeminiCopilot, TwinTelemetryContext } from './geminiClient';
import {
  INITIAL_SPATIAL_MARKERS,
  INITIAL_ASSETS,
  INITIAL_INCIDENTS,
} from '@/lib/data/airportSeedData';

export interface CopilotResponse {
  content: string;
  actions: CopilotAction[];
  modelUsed?: string;
}

export interface CopilotQueryContext extends Partial<TwinTelemetryContext> {
  activeEmergency?: any;
  activeScenarios?: any[];
  crowdState?: any;
}

/**
 * Intelligent AI Copilot query handler powered by Google Gemini API
 * with instant localized heuristic fallback adhering strictly to
 * TwinOS Operational Intelligence standards (Section 14A).
 */
export async function answerTwinOSQueryAsync(
  query: string,
  context?: CopilotQueryContext,
  history: Array<{ role: 'user' | 'assistant'; content: string }> = []
): Promise<CopilotResponse> {
  const fullContext: TwinTelemetryContext = {
    markers: context?.markers || INITIAL_SPATIAL_MARKERS,
    assets: context?.assets || INITIAL_ASSETS,
    incidents: context?.incidents || INITIAL_INCIDENTS,
    activeEmergency: context?.activeEmergency || null,
    activeScenarios: context?.activeScenarios || [],
    crowdState: context?.crowdState || {
      selectedTerminal: 'terminal-b',
      terminalBPressure: 84,
      securityQueue: 184,
      securityWaitMin: 17,
      openLanes: 6,
      totalLanes: 8,
      activeHotspot: 'Security Checkpoint Zone 2',
      terminalsSummary: 'Terminal A: 42% (Normal), Terminal B: 84% (Critical), Terminal C: 51% (Normal), Terminal D: 67% (Attention)',
    },
    overallMetrics: {
      energyKwh: context?.overallMetrics?.energyKwh || 24320,
      avgAssetHealth: context?.overallMetrics?.avgAssetHealth || 94.2,
      activeIncidentsCount: context?.overallMetrics?.activeIncidentsCount ?? 2,
      activeRunways: 'Runway 01 (09L/27R) & Runway 02 (09R/27L)',
      primaryHotspots: ['Terminal B Security Zone 2 (84 Pressure)', 'Terminal B HVAC-03 (29.2°C)'],
      predictedPeakLoadPercent: 92,
      timeToPeakMinutes: 25,
      ...context?.overallMetrics,
    },
  };

  // 1. Attempt live Gemini API inference with operational grounding
  try {
    const geminiResult = await queryGeminiCopilot(query, fullContext, history);
    if (geminiResult && geminiResult.content) {
      return {
        content: geminiResult.content,
        actions: geminiResult.actions || [],
        modelUsed: geminiResult.modelUsed,
      };
    }
  } catch (err) {
    console.warn('Gemini inference skipped or timed out, executing TwinOS Operational Engine:', err);
  }

  // 2. High-speed local operational engine grounded in live twin state
  return answerTwinOSQuery(query, {
    activeEmergency: fullContext.activeEmergency,
    activeScenarios: fullContext.activeScenarios,
    crowdState: fullContext.crowdState,
    activeIncidentsCount: fullContext.overallMetrics.activeIncidentsCount,
    energyKwh: fullContext.overallMetrics.energyKwh,
  });
}

/**
 * Synchronous local operational intelligence engine (Section 14A compliant)
 */
export function answerTwinOSQuery(
  query: string,
  state?: {
    activeEmergency?: any;
    activeScenarios?: any[];
    crowdState?: any;
    activeIncidentsCount?: number;
    energyKwh?: number;
    terminalAOccupancy?: number;
    terminalBOccupancy?: number;
  }
): CopilotResponse {
  const q = query.toLowerCase();

  // -------------------------------------------------------------------------
  // 1. SAFETY & MEDICAL BOUNDARY GUARD
  // -------------------------------------------------------------------------
  if (
    q.includes('diagnos') ||
    q.includes('prescrib') ||
    q.includes('medication') ||
    q.includes('treatment') ||
    q.includes('heart attack') ||
    q.includes('patient condition')
  ) {
    return {
      content: `⚠️ **TwinOS Core Safety Principle:**

**SITUATION:**
TwinOS is an airport Digital Twin Operations Hub and is strictly **NOT a medical diagnostic or clinical system**.

**OPERATIONAL PROTOCOL:**
TwinOS coordinates **airport logistical operations** only:
• Isolating Gate B14 jet bridge and boarding lounge.
• Clearing airside Ramp Corridor Bravo for emergency ambulances.
• Delaying aircraft turnaround (+18 min on Flight UA-428).
• Managing crowd redirection and public information displays.

**RECOMMENDATION:**
Medical assessment and direct patient intervention are managed exclusively by certified airport medical emergency paramedics currently on scene.`,
      actions: [
        { label: 'Open Emergency Command Drawer', actionType: 'OPEN_EMERGENCY', targetId: 'emergency-gate-b14' },
        { label: 'Focus 3D View on Gate B14', actionType: 'FOCUS_TWIN', targetId: 'emergency-gate-b14' },
      ],
      modelUsed: 'TwinOS Operational Engine',
    };
  }

  // -------------------------------------------------------------------------
  // 1B. MANUAL OPERATIONAL SCENARIOS & SIMULATION GROUNDING
  // -------------------------------------------------------------------------
  const activeScenarios = state?.activeScenarios || [];
  if (
    q.includes('scenario') ||
    q.includes('simulation') ||
    q.includes('simulate') ||
    q.includes('b-17') ||
    (activeScenarios.length > 0 && (q.includes('active') || q.includes('what happened') || q.includes('status') || q.includes('overview')))
  ) {
    if (activeScenarios.length > 0) {
      const summaryList = activeScenarios
        .map(
          (scen, idx) =>
            `**${idx + 1}. ${scen.title}** (${scen.terminalName})\n• **Severity:** \`${scen.severity}\` (${scen.intensityPercent}%)\n• **Impact:** ${scen.operationalImpact}\n• **Status:** \`${scen.status}\` • Started: ${scen.startTime}`
        )
        .join('\n\n');

      return {
        content: `⚡ **OPERATIONAL BRIEFING: ACTIVE OPERATIONAL SCENARIOS (${activeScenarios.length})**

**SITUATION:**
TwinOS is currently executing manual operational simulation events under administrator supervision:

${summaryList}

**EVIDENCE:**
• Digital Twin state updated: Affected conveyor / terminal has entered abnormal state telemetry.
• Alerts and incident entries have been dispatched to Incident Management with \`source: scenario\`.
• Cascading dependency graph is evaluating downstream flight departure schedules.

**RECOMMENDATION:**
Monitor system response and resolve simulations individually via **Scenario Control** or reset the entire airport simulation baseline once stress testing concludes.`,
        actions: [
          { label: 'Inspect Scenario Control', actionType: 'FOCUS_TWIN', targetId: activeScenarios[0]?.terminalId || 'terminal-b' },
          { label: 'View Incidents Hub', actionType: 'OPEN_INCIDENT', targetPath: '/incidents' },
        ],
        modelUsed: 'TwinOS Operational Engine',
      };
    } else {
      return {
        content: `⚡ **OPERATIONAL SIMULATION ENGINE STATUS:**

**SITUATION:**
No simulated scenarios are currently active. The Airport Digital Twin is running on **100% Live Operational Telemetry**.

**AVAILABLE SCENARIO SIMULATIONS:**
1. **Baggage Conveyor Failure:** Motor burnout, friction degradation, or offline shutdown for Conveyor B-17 or Baggage Belt 03.
2. **Crowd Surge:** Rapid influx of 12,000+ passengers (120% capacity) stressing checkpoint lanes.
3. **Medical Emergency:** In-terminal patient distress requiring rapid triage coordination.

**HOW TO INITIATE:**
Click the **⚡ Scenario Control** button in the top navigation bar to inject operational stress tests.`,
        actions: [
          { label: 'Open Scenario Control', actionType: 'FOCUS_TWIN', targetId: 'terminal-b' },
        ],
        modelUsed: 'TwinOS Operational Engine',
      };
    }
  }

  // -------------------------------------------------------------------------
  // 2. PRIVACY & PASSENGER TRACKING BOUNDARY GUARD
  // -------------------------------------------------------------------------
  if (
    q.includes('cctv') ||
    q.includes('camera') ||
    q.includes('facial') ||
    q.includes('face recognition') ||
    q.includes('track person') ||
    q.includes('individual passenger')
  ) {
    return {
      content: `🔒 **Privacy & Sensing Architecture Notice:**

**SITUATION:**
TwinOS adheres strictly to international airport privacy and civil aviation compliance regulations.

**EVIDENCE:**
• Passenger density is measured using overhead volumetric LiDAR and calibrated stanchion turnstile counters.
• **No facial recognition, biometric tracking, or individual video surveillance** is captured or processed by the Digital Twin.

**RECOMMENDATION:**
To inspect aggregate queue depth and passenger flow velocity, use the **3D Crowd Management View**.`,
      actions: [
        { label: 'Inspect Crowd in 3D Cutaway', actionType: 'INSPECT_ZONE', targetPath: '/crowd' },
      ],
      modelUsed: 'TwinOS Operational Engine',
    };
  }

  // -------------------------------------------------------------------------
  // 3. MEDICAL EMERGENCY AT GATE B14
  // -------------------------------------------------------------------------
  if (
    q.includes('b14') ||
    q.includes('gate b') ||
    q.includes('medical') ||
    q.includes('emergency') ||
    q.includes('ua-428') ||
    q.includes('united') ||
    q.includes('paramedic')
  ) {
    const isParamedicOnScene = state?.activeEmergency?.medicalStatus === 'ON_SCENE';
    return {
      content: `🚨 **OPERATIONAL BRIEFING: MEDICAL EMERGENCY AT GATE B14**

**SITUATION:**
Active Priority-1 Medical Emergency reported at **Terminal B Concourse, Gate B14** involving an inbound passenger on **Flight UA-428** (Boeing 787-9, 240 passengers onboard).

**IMPACT:**
• **Boarding Bridge B14:** Isolated and cordoned off to ensure unobstructed responder access.
• **Flight UA-428:** Scheduled departure held; projected turnaround delay is **+18 minutes**.
• **Airside Access Route:** Ramp Service Corridor Bravo designated as an exclusive sterile lane for Airport Fire & Rescue Paramedics.

**EVIDENCE:**
• Medical Team: ${isParamedicOnScene ? 'ON SCENE (Initial stabilization active)' : 'PARAMEDIC UNIT 2 EN ROUTE (ETA: 90 seconds)'}
• Terminal Operations Status: BOARDING_HALTED
• Airside Vehicle Route Bravo: STERILE / ISOLATED

**RECOMMENDATION:**
Maintain isolation of Gate B14 lounge. Coordinate with Airline Operations Control to issue gate change advice for connecting passengers. Prepare Gate B16 as an overflow standby.

**ADMIN DECISION:**
Review and authorize operational actions in the **Emergency Incident Drawer**.`,
      actions: [
        { label: 'Open Emergency Command Drawer', actionType: 'OPEN_EMERGENCY', targetId: 'emergency-gate-b14' },
        { label: 'Focus 3D View on Gate B14', actionType: 'FOCUS_TWIN', targetId: 'emergency-gate-b14' },
        { label: 'View Incidents Hub', actionType: 'OPEN_INCIDENT', targetPath: '/incidents' },
      ],
      modelUsed: 'TwinOS Operational Engine',
    };
  }

  // -------------------------------------------------------------------------
  // 4. CROWD OPERATIONS & TERMINAL B QUEUE SURGE
  // -------------------------------------------------------------------------
  if (
    q.includes('crowd') ||
    q.includes('terminal b') ||
    q.includes('security zone 2') ||
    q.includes('sec-zone-2') ||
    q.includes('queue') ||
    q.includes('lane 7') ||
    q.includes('bottleneck') ||
    q.includes('pressure')
  ) {
    const queue = state?.crowdState?.securityQueue || 184;
    const waitMin = state?.crowdState?.securityWaitMin || 17;
    const pressure = state?.crowdState?.terminalBPressure || 84;

    return {
      content: `👥 **OPERATIONAL BRIEFING: TERMINAL B CROWD SURGE & QUEUE BOTTLENECK**

**SITUATION:**
Terminal B has entered **Critical Crowd Pressure (Score: ${pressure}/100)** driven by an acute passenger queue surge at **Security Checkpoint Zone 2**.

**IMPACT:**
• **Queue Growth Rate:** Inflow (+124 pax/min) exceeds screening throughput (92 pax/min) by **+32 pax/min**.
• **Service Level Agreement:** Current queue wait of **${waitMin} minutes** breaches the 12-minute airport benchmark.
• **Downstream Risk:** Projected queue overflow into Concourse B retail walkway in approximately 8 minutes without intervention.

**EVIDENCE:**
• Security Zone 2 Occupancy: 92% (920 / 1,000 pax)
• Active Queue: **${queue} passengers**
• Screening Configuration: **6 of 8 lanes active** (Lanes 7 and 8 on hot standby)
• Other Terminals: Terminal A (42% Normal), Terminal C (51% Normal), Terminal D (67% Attention)

**RECOMMENDATION:**
Authorize the immediate opening of **Security Screening Lane 7**. Deploy 4 Concourse floor marshals to redirect self bag-drop passengers to Check-In Island 33.

**ADMIN DECISION:**
Open **Crowd Management 3D View** and confirm authorization for **[OPEN LANE 7]**. Expected throughput will increase by **+28%**, lowering queue depth to 142 pax and reducing crowd pressure to 68.`,
      actions: [
        { label: 'Open Crowd Management 3D View', actionType: 'INSPECT_ZONE', targetPath: '/crowd' },
        { label: 'Focus 3D View on Terminal B', actionType: 'FOCUS_TWIN', targetId: 'terminal-b' },
      ],
      modelUsed: 'TwinOS Operational Engine',
    };
  }

  // -------------------------------------------------------------------------
  // 5. ASSET HEALTH & THERMAL DEGRADATION (HVAC-03 / BAGGAGE-03)
  // -------------------------------------------------------------------------
  if (
    q.includes('asset') ||
    q.includes('hvac') ||
    q.includes('chiller') ||
    q.includes('baggage') ||
    q.includes('conveyor') ||
    q.includes('health') ||
    q.includes('temperature')
  ) {
    return {
      content: `⚙️ **OPERATIONAL BRIEFING: CRITICAL INFRASTRUCTURE ASSET HEALTH**

**SITUATION:**
Fleet asset health averages **94.2%**, but two primary thermal hotspots require active operational monitoring:
1. **HVAC-03 (Terminal B Central Chiller):** Temperature is **29.2°C** (threshold: 28.0°C), Health Score: **78%**.
2. **Baggage Sorter 03 (Terminal A Sub-Level):** Temperature is **31.8°C**, Health Score: **84%**.

**IMPACT:**
• If HVAC-03 exceeds 32°C, automatic thermal protection trips will throttle Terminal B concourse cooling by 35% during peak passenger occupancy.
• Baggage Conveyor 03 is handling outbound international luggage for Lufthansa & Air France with zero current jams.

**EVIDENCE:**
• HVAC-03 Power Draw: 84 kW (+12% above nominal)
• Bearing Vibration: 1.4 mm/s RMS (acceptable < 2.0 mm/s)
• Runways 01 and 02: Pavement sensors reading 100% nominal friction coefficient (0.82 Mu)

**RECOMMENDATION:**
Stage secondary auxiliary chiller CH-04 for automated cutover if ambient temperature in Terminal B rises above 24.5°C.

**ADMIN DECISION:**
Inspect asset telemetry or cross-reference dependency cascades in the **Assets Hub**.`,
      actions: [
        { label: 'Inspect HVAC-03 Telemetry', actionType: 'VIEW_ASSET', targetId: 'hvac-03' },
        { label: 'Analyze Dependency Cascade', actionType: 'ANALYZE_IMPACT', targetId: 'power-node-b-root' },
        { label: 'View Assets Fleet', actionType: 'VIEW_ASSET' },
      ],
      modelUsed: 'TwinOS Operational Engine',
    };
  }

  // -------------------------------------------------------------------------
  // 6. PREDICTIONS & MACHINE LEARNING FORECASTS
  // -------------------------------------------------------------------------
  if (
    q.includes('predict') ||
    q.includes('forecast') ||
    q.includes('machine learning') ||
    q.includes('model') ||
    q.includes('random forest') ||
    q.includes('delay prob')
  ) {
    return {
      content: `🔮 **OPERATIONAL BRIEFING: MACHINE LEARNING & PREDICTIVE FORECASTS**

**SITUATION:**
TwinOS predictive engines leverage trained Random Forest models (100 estimators, 77.6% accuracy, 0.996 ROC-AUC) over the 8-table airport operational dataset.

**IMPACT:**
• **Midday Congestion Peak:** Forecasted at 12:45 with **13,600 simultaneous passengers** across all 4 terminals.
• **Flight Delay Risk:** Inbound flights from European corridors show a **38% higher probability of ATC-induced delay** due to en-route airspace restrictions.
• **Peak Energy Load:** Facility power draw predicted to reach **26.8 MW** (+10.2%) within 25 minutes.

**EVIDENCE:**
• DEL Dataset Grounding: 1,000 historical flights evaluated; 307 delayed (avg delay 51.0 min).
• Top Delay Drivers: Air Traffic Control (70), Technical (66), Crew Rotation (62), Turnaround Bottleneck (57).
• Thermal Curve: HVAC-03 projected to reach 30.5°C at 13:00 without cooling redistribution.

**RECOMMENDATION:**
Pre-cool Terminal B Concourse by -1.5°C before 12:30. Authorize Turnaround Team Alpha to support Flight UA-428 gate clearance.

**ADMIN DECISION:**
Review interactive ML confidence bands and predictive time series in the **Predictions Hub**.`,
      actions: [
        { label: 'View Predictions Hub', actionType: 'VIEW_PREDICTION', targetPath: '/predictions' },
        { label: 'View Analytics Engine', actionType: 'VIEW_ANALYTICS', targetPath: '/analytics' },
      ],
      modelUsed: 'TwinOS Operational Engine',
    };
  }

  // -------------------------------------------------------------------------
  // 7. EXECUTIVE OVERVIEW / WHAT TO INVESTIGATE FIRST
  // -------------------------------------------------------------------------
  return {
    content: `🌐 **TWINOS OPERATIONAL INTELLIGENCE: CAMPUS EXECUTIVE SUMMARY**

**SITUATION:**
The airport digital twin is operating under **2 high-priority operational events** requiring active supervisor attention:
1. **Medical Emergency at Gate B14:** Flight UA-428 turnaround halted; Ramp Route Bravo isolated.
2. **Terminal B Crowd Surge:** Security Checkpoint Zone 2 at **84 Pressure Score** with 184 in queue.

**IMPACT:**
• Terminal B operational efficiency is currently reduced by 16% due to simultaneous passenger surges and gate isolation.
• Airfield runways 09L/27R and 09R/27L remain 100% nominal with 69.3% On-Time Performance.

**EVIDENCE:**
• Facility Power Draw: 24.3 MW (-5.2% efficiency delta)
• Overall Asset Health: 94.2%
• Active Flights Monitored: 1,000 (DEL Dataset multi-table schema active)

**RECOMMENDATION:**
1. Prioritize **Gate B14 Emergency Command** confirmation to release the jet bridge once paramedics clear the passenger.
2. Authorize **[OPEN LANE 7]** in Terminal B Crowd Management to compress the 17-minute screening queue.

**ADMIN DECISION:**
Select a direct action below to navigate to the affected operational zone:`,
    actions: [
      { label: 'Open Emergency Command (Gate B14)', actionType: 'OPEN_EMERGENCY', targetId: 'emergency-gate-b14' },
      { label: 'Inspect Crowd Operations (3D Cutaway)', actionType: 'INSPECT_ZONE', targetPath: '/crowd' },
      { label: 'View Predictions Hub', actionType: 'VIEW_PREDICTION', targetPath: '/predictions' },
    ],
    modelUsed: 'TwinOS Operational Engine',
  };
}
