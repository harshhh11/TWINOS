export type SeverityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type IncidentStatus = 
  | 'DETECTED' 
  | 'INVESTIGATING' 
  | 'ACTION_REQUIRED' 
  | 'IN_PROGRESS' 
  | 'RESOLVED';

export interface Incident {
  id: string;
  title: string;
  type: 'EQUIPMENT' | 'POWER' | 'HVAC' | 'TELEMETRY' | 'OPERATIONS' | 'SECURITY';
  severity: SeverityLevel;
  locationId: string;
  locationName: string;
  coordinates: [number, number, number];
  detectedBy: string;
  confidence: number;
  timestamp: string;
  affectedAssets: string[];
  aiAnalysis: string;
  recommendation: string;
  status: IncidentStatus;
  source?: 'system' | 'scenario';
  scenarioId?: string;
}

export type AssetCategory = 
  | 'HVAC' 
  | 'ELEVATOR' 
  | 'ESCALATOR' 
  | 'BAGGAGE' 
  | 'POWER' 
  | 'RADAR' 
  | 'LIGHTING';

export interface Asset {
  id: string;
  name: string;
  category: AssetCategory;
  location: string;
  zone: string;
  healthScore: number;
  failureRisk: number;
  temperature: number; // in Celsius
  usagePercent: number;
  maintenanceDaysDue: number;
  status: 'OPTIMAL' | 'WARNING' | 'CRITICAL';
  coordinates: [number, number, number];
  lastInspection: string;
  powerKw: number;
}

export interface DependencyNode {
  id: string;
  name: string;
  type: 'zone' | 'building' | 'asset' | 'system' | 'power_node' | 'sensor';
  status: 'NORMAL' | 'WARNING' | 'CRITICAL';
  riskScore: number;
  healthPercent: number;
  impactScore: number;
  cascadeDelayMinutes: number;
  connectedNodeIds: string[];
  description: string;
}

export interface PredictionPoint {
  timeLabel: string;
  timestamp: number;
  actual?: number;
  predicted: number;
  upperConfidence?: number;
  lowerConfidence?: number;
}

export interface CopilotAction {
  label: string;
  actionType: 
    | 'FOCUS_TWIN' 
    | 'ANALYZE_IMPACT' 
    | 'VIEW_ASSET' 
    | 'RESOLVE_INCIDENT'
    | 'VIEW_PREDICTION'
    | 'VIEW_ANALYTICS'
    | 'VIEW_MONITORING'
    | 'OPEN_INCIDENT'
    | 'INSPECT_ZONE'
    | 'OPEN_EMERGENCY'
    | 'EXECUTE_ACTION';
  targetId?: string;
  targetPath?: string;
}

export interface CopilotMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  actions?: CopilotAction[];
}

export interface SpatialMarker {
  id: string;
  name: string;
  type: 'building' | 'runway' | 'atc' | 'asset' | 'emergency';
  status: 'Normal' | 'Warning' | 'Critical' | 'Operational' | 'Emergency';
  statusColor: 'green' | 'orange' | 'red' | 'blue';
  occupancyPercent?: number;
  riskLevel?: 'Low' | 'Medium' | 'High';
  activeIncidents?: number;
  energyKwh?: number;
  aiInsight?: string;
  position: [number, number, number];
}

// ============================================================================
// TWINOS™ MEDICAL EMERGENCY OPERATIONS MODULE TYPES
// ============================================================================

export type EmergencyLifecycleStatus =
  | 'REPORTED'
  | 'ACKNOWLEDGED'
  | 'RESPONSE_INITIATED'
  | 'RESPONDING'
  | 'RESOLVED';

export type MedicalResponseStatus =
  | 'PENDING_NOTIFICATION'
  | 'NOTIFIED'
  | 'EN_ROUTE'
  | 'ON_SCENE';

export type TerminalOpsStatus =
  | 'NORMAL'
  | 'MONITORING'
  | 'CROWD_CONTROL_REQUESTED'
  | 'GATE_HOLD_ACTIVE'
  | 'CLEAR';

export type AccessRouteStatus =
  | 'STANDARD'
  | 'ELEVATOR_PRIORITY_REQUESTED'
  | 'ELEVATOR_PRIORITY_ACTIVE'
  | 'CORRIDOR_RESTRICTED'
  | 'NORMALIZED';

export interface EmergencyTimelineEvent {
  id: string;
  timestamp: string; // ISO string or HH:mm:ss
  formattedTime: string; // "14:32:00"
  title: string;
  description: string;
  actor: string; // e.g., 'SYSTEM', 'ADMINISTRATOR (H. Shereef)', 'FIELD: Unit Alpha-2', 'GATE AGENT B14'
  actorRole: 'SYSTEM' | 'ADMIN' | 'FIELD' | 'REPORTER';
  statusBadge?: string;
  type:
    | 'REPORT'
    | 'ACKNOWLEDGE'
    | 'AI_RECOMMENDATION'
    | 'DISPATCH'
    | 'COORDINATION'
    | 'ACCESS'
    | 'ESCALATION'
    | 'STATUS_UPDATE'
    | 'NOTE'
    | 'RESOLUTION';
}

export interface EmergencyAIRecommendation {
  id: string;
  actionLabel: string;
  description: string;
  operationalRationale: string;
  priority: 'URGENT' | 'HIGH' | 'STANDARD';
  status: 'RECOMMENDED' | 'APPROVED' | 'DISMISSED';
  targetRecipient: string;
  expectedImpact: string;
  executedAt?: string;
  actionType:
    | 'NOTIFY_MEDICAL'
    | 'NOTIFY_TERMINAL_OPS'
    | 'PRIORITIZE_ELEVATOR'
    | 'HOLD_BOARDING'
    | 'DISPATCH_SECURITY_ESCORT'
    | 'STAGE_PARAMEDIC_TRANSFER';
}

export interface EmergencyOperationalContext {
  terminal: string; // "Terminal B"
  zone: string; // "Concourse B - North Wing"
  gate: string; // "Gate B14"
  passengerCountNearby: number; // e.g. 184
  nearestMedicalStation: string; // "First Aid Station B-2 (0.3 km / Concourse Level 2)"
  estimatedResponseTimeMinutes: number; // e.g. 4
  nearestAEDLocation: string; // "Column B14-East (15m from Gate Podium)"
  currentFlightImpact: {
    flightNumber: string; // "AA-1482"
    destination: string; // "DFW"
    scheduledDeparture: string; // "14:45"
    boardingStatus: string; // "Boarding - Group 3"
    paxOnboard: number; // 92
    paxWaiting: number; // 78
    gateHoldRecommended: boolean;
  };
  accessRoute: {
    primaryCorridor: string; // "Service Corridor 2B via Elevator E4"
    elevatorPriorityAvailable: boolean;
    routeClearanceStatus: string; // "Clear - Concourse flow moderate"
  };
  cctvFeedId?: string; // "CAM-TB-B14-NORTH"
}

export interface EmergencyIncident {
  id: string;
  incidentNumber: string; // e.g. "MED-2026-0926-B14"
  title: string;
  emergencyType: 'MEDICAL' | 'FIRE' | 'SECURITY' | 'FACILITY';
  locationName: string; // "Terminal B — Gate B14"
  locationDetails: string;
  coordinates: [number, number, number];
  reportedBy: string; // e.g. "Gate Agent B14 (Staff ID: SA-4402)"
  reporterContact?: string;
  reportedAt: string;
  reportedTimestamp: number;
  severity: SeverityLevel; // 'CRITICAL' | 'HIGH' | 'MEDIUM'
  status: EmergencyLifecycleStatus;

  // Operational Context
  operationalContext: EmergencyOperationalContext;

  // Coordination States
  medicalResponseStatus: MedicalResponseStatus;
  medicalTeamAssigned?: string;
  terminalOpsStatus: TerminalOpsStatus;
  accessRouteStatus: AccessRouteStatus;

  // AI Decision Support Recommendations
  aiRecommendations: EmergencyAIRecommendation[];

  // Dynamic Audit Timeline & Notes
  statusNotes: string[];
  timeline: EmergencyTimelineEvent[];

  // Resolution Details
  resolvedAt?: string;
  resolvedTimestamp?: number;
  resolvedBy?: string;
  resolutionOutcome?:
    | 'TRANSFERRED_TO_HOSPITAL'
    | 'TREATED_ON_SITE'
    | 'PASSENGER_DECLINED'
    | 'STAND_DOWN'
    | 'OTHER';
  resolutionNotes?: string;

  // Metrics
  metrics?: {
    timeToAcknowledgeSec: number;
    timeToDispatchSec: number;
    timeToOnSceneSec: number;
    totalResolutionTimeSec: number;
    isWithinSLA: boolean;
  };
}

