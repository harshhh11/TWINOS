import { CopilotAction } from '@/types';

export const GEMINI_API_KEY =
  process.env.GEMINI_API_KEY ||
  process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
  '';

export interface TwinTelemetryContext {
  markers: Array<{
    id: string;
    name: string;
    type: string;
    status: string;
    occupancyPercent?: number;
    riskLevel?: string;
    energyKwh?: number;
    aiInsight?: string;
    position: [number, number, number];
  }>;
  assets: Array<{
    id: string;
    name: string;
    category: string;
    location: string;
    healthScore: number;
    failureRisk: number;
    temperature: number;
    status: string;
    powerKw: number;
  }>;
  incidents: Array<{
    id: string;
    title: string;
    severity: string;
    locationName: string;
    status: string;
    aiAnalysis: string;
    recommendation: string;
  }>;
  activeEmergency?: any;
  activeScenarios?: any[];
  crowdState?: {
    selectedTerminal: string;
    terminalBPressure: number;
    securityQueue: number;
    securityWaitMin: number;
    openLanes: number;
    totalLanes: number;
    activeHotspot: string;
    terminalsSummary: string;
  };
  overallMetrics: {
    energyKwh: number;
    avgAssetHealth: number;
    activeIncidentsCount: number;
    activeRunways: string;
    primaryHotspots: string[];
    predictedPeakLoadPercent?: number;
    timeToPeakMinutes?: number;
  };
}

export interface GeminiCopilotResult {
  content: string;
  actions: CopilotAction[];
  modelUsed: string;
}

const SYSTEM_INSTRUCTION = `
You are the TWINOS OPERATIONAL INTELLIGENCE ASSISTANT, an advanced AI operational partner designed specifically for the TwinOS Airport Digital Twin Operations Hub.

You are NOT a generic conversational chatbot. You behave as an elite airport operations specialist, digital twin intelligence officer, and airside coordinator.

==================================================
1. OPERATIONAL GROUNDING & CONTEXT
==================================================
You have direct, real-time access to the live digital twin state of the airport:
1. 3D DIGITAL TWIN & SPATIAL ASSETS:
   - Terminals A, B, C, D; Runway 01 (09L/27R), Runway 02 (09R/27L); ATC Control Tower; Central Energy Facility; Cargo Hub; Parking Complex.
   - Specific operational gates, notably Gate B14 in Terminal B Concourse.
2. LIVE INCIDENTS & EMERGENCIES:
   - Medical Emergency at Gate B14 (Flight UA-428, B787-9, 240 pax): Boarding jet bridge isolated, Emergency Service Route Bravo cleared, paramedical response underway. Turnaround delay +18 min.
   - Operational queue bottlenecks, equipment alarms, and maintenance work orders.
3. CROWD OPERATIONS & PASSENGER FLOW:
   - Terminal B: Critical crowd pressure score 84/100.
   - Security Checkpoint Zone 2: 92% occupancy (920/1,000 pax), 184 passengers in queue, 17 min estimated wait, incoming flow +124 pax/min vs screening throughput 92 pax/min (+32 net imbalance). 6 of 8 screening lanes open (Lane 7 and 8 ready on standby).
   - Check-in 32 (72% occupancy, 78 in queue), Check-in 33 (52% occupancy, 38 in queue).
   - Concourse B (62% occupancy), Gate B14 (58% occupancy).
   - Terminals A (42% normal), C (51% normal), D (67% attention).
4. INFRASTRUCTURE & ASSET HEALTH:
   - Terminal B HVAC Chiller 03: Elevated thermal load (29.2°C, 78% health).
   - Baggage Sorter Carousel C12: 100% sortation accuracy, 18.4 kg avg weight.
   - Central Energy Facility: Instantaneous load 24.3 MW (-5.2% efficiency delta).
5. MULTI-TABLE AIRPORT DATASET (DEL Hub):
   - 1,000 Flights: 69.3% On-Time Performance (OTP), 307 delayed, avg delay 51.0 min.
   - Carriers: Lufthansa (65.3% OTP), Air France (71.3%), Singapore Airlines (69.1%), Emirates (71.0%), IndiGo (66.3%), Air India (75.0%), Vistara (69.2%).
   - Root causes of flight delays: ATC (70), TECH (66), CREW (62), TURNAROUND (57), WX (52).

==================================================
2. STRUCTURED RESPONSE FORMAT (MANDATORY)
==================================================
When responding to operational queries (incidents, crowd bottlenecks, asset anomalies, flight status, or emergencies), ALWAYS format your core assessment with these 5 clear headings:

**SITUATION:**
[Concise summary of the current operational state in the Digital Twin]

**IMPACT:**
[Direct and cascading consequences on passenger flow, aircraft turnaround, downstream queues, or infrastructure]

**EVIDENCE:**
[Specific live telemetry data, queue counts, sensor readings, pressure scores, or dataset metrics]

**RECOMMENDATION:**
[Actionable operational advice adhering strictly to airport standard operating procedures]

**ADMIN DECISION:**
[Clear decision choice for the human operator, e.g. "Authorize opening of Security Lane 7", "Hold Flight UA-428 departure", or "Approve gate transfer"]

==================================================
3. STRICT OPERATIONAL BOUNDARIES & NO-HALLUCINATION RULES
==================================================
1. STRICT NO-HALLUCINATION RULE:
   - If data or telemetry for a requested system is unavailable, state clearly: "Data not available in current telemetry stream."
   - Do NOT speculate on unmonitored systems.
2. MEDICAL EMERGENCY BOUNDARY:
   - TwinOS is an operational digital twin, NOT a medical diagnostic platform.
   - DO NOT diagnose conditions, prescribe medications, or recommend treatments.
   - Ground medical emergency responses entirely in airport operational logistics: gate isolation, emergency vehicle access corridors, flight turnaround delays, and ground crew coordination.
3. PASSENGER PRIVACY & SENSING BOUNDARY:
   - TwinOS monitors aggregate queue density and flow rates via ceiling LiDAR and turnstile sensors.
   - DO NOT claim facial recognition, CCTV tracking of individuals, or biometric surveillance is used.
4. HUMAN-IN-THE-LOOP PRINCIPLE:
   - The AI Copilot provides operational decision support; critical actions require confirmation by an authorized human operator (e.g. Operations Duty Manager).

==================================================
4. ACTIONABLE UI BUTTONS (MANDATORY)
==================================================
Every response must include 1 to 3 relevant suggested action buttons in the "actions" array so the operator can take immediate action in the application.

Available action types:
- OPEN_EMERGENCY: targetId 'emergency-gate-b14' (opens Emergency Incident Command Drawer)
- INSPECT_ZONE: targetId 'terminal-b' or targetPath '/crowd' (opens Crowd Operations 3D cutaway)
- FOCUS_TWIN: targetId 'terminal-b' | 'terminal-a' | 'emergency-gate-b14' | 'runway-1' | 'energy-hub' | 'atc-tower'
- VIEW_ASSET: targetId 'hvac-03' | 'baggage-03' | 'power-node-b'
- VIEW_PREDICTION: targetPath '/predictions'
- VIEW_ANALYTICS: targetPath '/analytics'
- VIEW_MONITORING: targetPath '/monitoring'
- OPEN_INCIDENT: targetPath '/incidents'

OUTPUT JSON SCHEMA:
{
  "content": "Your structured markdown response using SITUATION, IMPACT, EVIDENCE, RECOMMENDATION, ADMIN DECISION...",
  "actions": [
    {
      "label": "Button Label (e.g. Inspect Crowd in 3D Cutaway)",
      "actionType": "INSPECT_ZONE",
      "targetPath": "/crowd"
    }
  ]
}
`;

/**
 * Calls Google Gemini API using the provided API key with cascade fallback
 */
export async function queryGeminiCopilot(
  query: string,
  context: TwinTelemetryContext,
  history: Array<{ role: 'user' | 'assistant'; content: string }> = []
): Promise<GeminiCopilotResult> {
  const models = [
    'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-1.5-flash',
    'gemini-1.5-pro',
  ];

  const payloadContext = `
CURRENT LIVE DIGITAL TWIN OPERATIONAL STATE:
- Active Emergency: ${
    context.activeEmergency
      ? `ID: ${context.activeEmergency.id}, Location: ${context.activeEmergency.reportedLocation}, Gate: ${context.activeEmergency.operationalContext.gate}, Flight: ${context.activeEmergency.operationalContext.flightNumber}, Aircraft: ${context.activeEmergency.operationalContext.aircraftReg} (${context.activeEmergency.operationalContext.aircraftType}), Status: ${context.activeEmergency.status}, Paramedics: ${context.activeEmergency.medicalStatus}, Turnaround Impact: +${context.activeEmergency.turnaroundImpactMin} min`
      : 'None'
  }
- Crowd State: ${
    context.crowdState
      ? `Terminal B Pressure: ${context.crowdState.terminalBPressure}/100 (CRITICAL). Security Zone 2: ${context.crowdState.securityQueue} in queue, wait time: ${context.crowdState.securityWaitMin} min. Lanes: ${context.crowdState.openLanes}/${context.crowdState.totalLanes} open. Hotspot: ${context.crowdState.activeHotspot}. ${context.crowdState.terminalsSummary}`
      : 'Terminal B Security Zone 2 queue: 184 pax, pressure: 84 (Critical), lanes: 6/8 open.'
  }
- Facility Energy Draw: ${context.overallMetrics.energyKwh.toLocaleString()} kWh (24.3 MW instantaneous)
- Average Asset Health: ${context.overallMetrics.avgAssetHealth}%
- Active Incidents Count: ${context.overallMetrics.activeIncidentsCount}
- Active Runways: ${context.overallMetrics.activeRunways}
- Primary Hotspots: ${context.overallMetrics.primaryHotspots.join('; ')}

ACTIVE INCIDENTS:
${JSON.stringify(context.incidents, null, 2)}

ACTIVE ASSETS TELEMETRY:
${JSON.stringify(context.assets, null, 2)}

3D SPATIAL MARKERS:
${JSON.stringify(context.markers, null, 2)}
`;

  const conversationHistory = history.slice(-4).map((msg) => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }],
  }));

  const userPrompt = `
${payloadContext}

USER OPERATIONAL QUERY:
${query}

Respond in the required JSON schema with markdown content following the SITUATION, IMPACT, EVIDENCE, RECOMMENDATION, ADMIN DECISION structure, and provide actionable UI buttons.
`;

  for (const model of models) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

      const requestBody = {
        system_instruction: {
          parts: [{ text: SYSTEM_INSTRUCTION }],
        },
        contents: [
          ...conversationHistory,
          {
            role: 'user',
            parts: [{ text: userPrompt }],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          topP: 0.8,
          maxOutputTokens: 1024,
          responseMimeType: 'application/json',
        },
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        signal: AbortSignal.timeout(4500),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`Gemini model ${model} failed (${response.status}):`, errorText);
        continue;
      }

      const json = await response.json();
      const rawText = json?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!rawText) {
        continue;
      }

      try {
        const parsed = JSON.parse(rawText);
        return {
          content: parsed.content || rawText,
          actions: Array.isArray(parsed.actions) ? parsed.actions : [],
          modelUsed: model,
        };
      } catch (err) {
        return {
          content: rawText,
          actions: [
            { label: 'Inspect Crowd Operations', actionType: 'INSPECT_ZONE', targetPath: '/crowd' },
            { label: 'View Incidents', actionType: 'OPEN_INCIDENT', targetPath: '/incidents' },
          ],
          modelUsed: model,
        };
      }
    } catch (e) {
      console.warn(`Error calling Gemini ${model}:`, e);
    }
  }

  throw new Error('All Gemini models exhausted');
}
