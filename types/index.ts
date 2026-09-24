export type EnvironmentType = 'airport' | 'campus' | 'smart_city' | 'industrial' | 'hospital';

export type TwinLayerType = 
  | 'buildings' 
  | 'flights' 
  | 'people' 
  | 'security' 
  | 'energy' 
  | 'assets' 
  | 'environment' 
  | 'incidents';

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
  type: 'CROWD' | 'SECURITY' | 'FIRE' | 'SMOKE' | 'EQUIPMENT' | 'ENERGY' | 'WATER' | 'ENVIRONMENT';
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
  | 'PUMP' 
  | 'GENERATOR' 
  | 'TRANSFORMER' 
  | 'CCTV' 
  | 'POWER';

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

export interface BoundingBoxDetection {
  id: string;
  label: 'PERSON' | 'CROWD' | 'RESTRICTED_ACCESS' | 'SMOKE' | 'BAGGAGE' | 'VEHICLE';
  confidence: number;
  // Percentage coordinates [x, y, width, height] from 0 to 100
  box: [number, number, number, number];
}

export interface CameraFeed {
  id: string;
  name: string;
  code: string;
  locationId: string;
  locationName: string;
  isLive: boolean;
  timestamp: string;
  resolution: string;
  fps: number;
  currentCrowdCount: number;
  currentQueueMinutes: number;
  status: 'NORMAL' | 'WARNING' | 'CRITICAL';
  detections: BoundingBoxDetection[];
  streamUrl?: string;
  thumbnailUrl?: string;
}

export interface AIEvent {
  id: string;
  type: 'CROWD' | 'SECURITY' | 'FIRE' | 'SMOKE' | 'EQUIPMENT' | 'ENERGY' | 'WATER' | 'ENVIRONMENT';
  locationId: string;
  locationName: string;
  severity: SeverityLevel;
  confidence: number;
  timestamp: string;
  affectedAssets: string[];
  description: string;
  sourceCameraId?: string;
}

export interface DependencyNode {
  id: string;
  name: string;
  type: 'zone' | 'building' | 'asset' | 'system' | 'passenger_flow' | 'power_node' | 'sensor';
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
  actionType: 'FOCUS_TWIN' | 'ANALYZE_IMPACT' | 'VIEW_ASSET' | 'RESOLVE_INCIDENT' | 'VIEW_CAMERA';
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
  type: 'building' | 'runway' | 'atc' | 'parking' | 'security' | 'asset';
  status: 'Normal' | 'Warning' | 'High Crowd' | 'Critical' | 'Operational';
  statusColor: 'green' | 'orange' | 'red' | 'blue';
  occupancyPercent?: number;
  passengerCount?: number;
  riskLevel?: 'Low' | 'Medium' | 'High';
  activeIncidents?: number;
  energyKwh?: number;
  aiInsight?: string;
  position: [number, number, number];
}
