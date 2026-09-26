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
  actionType: 'FOCUS_TWIN' | 'ANALYZE_IMPACT' | 'VIEW_ASSET' | 'RESOLVE_INCIDENT';
  targetId: string;
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
  type: 'building' | 'runway' | 'atc' | 'asset' | 'parking' | 'cargo';
  status: 'Normal' | 'Warning' | 'Critical' | 'Operational' | 'Attention';
  statusColor: 'green' | 'orange' | 'red' | 'blue' | 'amber';
  occupancyPercent?: number;
  assetHealthPercent?: number;
  activeAlertsCount?: number;
  dependenciesCount?: number;
  energyUsagePercent?: number;
  relatedAssetsCount?: number;
  predictedCongestionMin?: number;
  riskLevel?: 'Low' | 'Medium' | 'High';
  activeIncidents?: number;
  energyKwh?: number;
  aiInsight?: string;
  position: [number, number, number];
}
