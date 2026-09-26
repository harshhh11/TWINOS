export type ScenarioType =
  | 'CONVEYOR_FAILURE'
  | 'CROWD_SURGE'
  | 'MEDICAL_EMERGENCY';

export type ScenarioSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface ActiveScenario {
  id: string;
  type: ScenarioType;
  title: string;
  terminalId: string; // 'terminal-a' | 'terminal-b' | 'terminal-c' | 'terminal-d'
  terminalName: string;
  locationName: string;
  locationCoords: [number, number, number];
  assetId?: string;
  assetName?: string;
  severity: ScenarioSeverity;
  intensityPercent: number; // 0-100+
  crowdCount?: number;
  capacity?: number;
  casesCount?: number;
  failureMode?: 'Degraded' | 'Intermittent' | 'Offline';
  duration?: string;
  status: 'ACTIVE' | 'RESOLVED';
  startTime: string;
  source: 'scenario';
  affectedEntities: string[];
  associatedIncidentId: string;
  operationalImpact: string;
}

export interface ScenarioDefinition {
  type: ScenarioType;
  label: string;
  description: string;
  icon: string;
}
