export type CrowdZoneCategory =
  | 'ENTRANCE'
  | 'CHECKIN'
  | 'SECURITY'
  | 'CONCOURSE'
  | 'GATE'
  | 'BAGGAGE';

export type CrowdZoneStatus = 'NORMAL' | 'ATTENTION' | 'CRITICAL';

export interface CrowdZone {
  id: string;
  name: string;
  terminalId: string; // 'terminal-a' | 'terminal-b' | 'terminal-c' | 'terminal-d'
  category: CrowdZoneCategory;
  occupancy: number;
  capacity: number;
  densityPercent: number; // e.g. 84
  queueLength: number; // number of passengers in queue
  estimatedWaitMin: number; // e.g. 17 min
  incomingFlow: number; // pax / min e.g. 124
  outgoingFlow: number; // pax / min e.g. 92
  netFlow: number; // pax / min e.g. +32
  dwellTimeMin: number; // average dwell minutes e.g. 11
  status: CrowdZoneStatus;
  openLanes?: number; // e.g. 6
  totalLanes?: number; // e.g. 8
  pressureScore: number; // 0 - 100
  aiInsight: string;
  position: [number, number, number]; // 3D center in terminal space
  dimensions: [number, number, number]; // width, height, depth of zone
}

export interface TerminalCrowdState {
  terminalId: string;
  terminalName: string;
  occupancyPercent: number;
  totalPax: number;
  capacityPax: number;
  pressureScore: number; // 0 - 100
  status: CrowdZoneStatus;
  criticalZonesCount: number;
  zones: CrowdZone[];
  activeAlerts: string[];
  aiInsight: string;
}

export interface CrowdTimelineSnapshot {
  timeLabel: string; // "08:00", "09:00", etc.
  timestamp: string;
  pressureScore: number;
  status: CrowdZoneStatus;
  terminals: Record<string, { occupancyPercent: number; pressureScore: number; status: CrowdZoneStatus }>;
  securityQueue: number;
  securityWaitMin: number;
}

export interface CrowdOperationalAction {
  id: string;
  label: string;
  description: string;
  zoneId: string;
  actionType:
    | 'OPEN_LANE'
    | 'CLOSE_LANE'
    | 'REDIRECT_FLOW'
    | 'ASSIGN_STAFF'
    | 'CREATE_INCIDENT'
    | 'MONITOR';
  expectedImpact: string;
}

export interface CrowdAuditEntry {
  id: string;
  time: string;
  action: string;
  zoneName: string;
  actor: string;
  result: string;
  pressureBefore: number;
  pressureAfter: number;
}
