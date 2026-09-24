import { DependencyNode } from '@/types';

export interface GraphLink {
  source: string;
  target: string;
  relationship: string;
  bandwidthKwh?: number;
  criticality: 'CRITICAL' | 'HIGH' | 'MEDIUM';
}

export const AIRPORT_DEPENDENCY_EDGES: GraphLink[] = [
  {
    source: 'terminal-b-root',
    target: 'sec-checkpoint-b',
    relationship: 'Passenger Ingress Gateway',
    criticality: 'CRITICAL',
  },
  {
    source: 'terminal-b-root',
    target: 'hvac-03-node',
    relationship: 'Climate Control Zone',
    criticality: 'HIGH',
  },
  {
    source: 'sec-checkpoint-b',
    target: 'passenger-zone-b2',
    relationship: 'Airside Concourse Flow',
    criticality: 'CRITICAL',
  },
  {
    source: 'sec-checkpoint-b',
    target: 'cctv-b2-node',
    relationship: 'Visual Surveillance Telemetry',
    criticality: 'HIGH',
  },
  {
    source: 'hvac-03-node',
    target: 'passenger-zone-b2',
    relationship: 'Air Quality & Thermal Regulation',
    criticality: 'HIGH',
  },
  {
    source: 'hvac-03-node',
    target: 'power-node-b-dep',
    relationship: 'Electric Feeder (145 kW)',
    criticality: 'MEDIUM',
  },
  {
    source: 'passenger-zone-b2',
    target: 'baggage-03-dep',
    relationship: 'Luggage Transfer Sortation',
    criticality: 'HIGH',
  },
];

export interface ImpactAnalysisResult {
  rootIncidentNode: string;
  totalAffectedNodes: number;
  cascadingDelayMinutes: number;
  systemRiskScore: number;
  riskRating: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  affectedZones: string[];
  affectedAssets: string[];
  recommendation: {
    primaryAction: string;
    secondaryAction: string;
    estimatedReliefPercent: number;
    timeframeMinutes: number;
  };
  impactPath: string[];
}

export function calculateCascadeImpact(
  rootNodeId: string,
  nodes: DependencyNode[],
  edges: GraphLink[]
): ImpactAnalysisResult {
  const rootNode = nodes.find((n) => n.id === rootNodeId) || nodes[0];
  const visited = new Set<string>();
  const queue = [rootNode.id];
  visited.add(rootNode.id);

  let totalDelay = rootNode.cascadeDelayMinutes || 0;
  const affectedZones: string[] = [];
  const affectedAssets: string[] = [];
  const impactPath: string[] = [rootNode.id];

  while (queue.length > 0) {
    const currentId = queue.shift()!;
    const outgoing = edges.filter((e) => e.source === currentId);

    for (const edge of outgoing) {
      if (!visited.has(edge.target)) {
        visited.add(edge.target);
        queue.push(edge.target);
        impactPath.push(edge.target);

        const targetNode = nodes.find((n) => n.id === edge.target);
        if (targetNode) {
          totalDelay += targetNode.cascadeDelayMinutes * 0.6; // cascading multiplier
          if (targetNode.type === 'zone' || targetNode.type === 'passenger_flow') {
            affectedZones.push(targetNode.name);
          } else if (targetNode.type === 'asset' || targetNode.type === 'system') {
            affectedAssets.push(targetNode.name);
          }
        }
      }
    }
  }

  const riskScore = Math.min(100, Math.round(rootNode.riskScore * 1.05));
  const riskRating = riskScore >= 80 ? 'CRITICAL' : riskScore >= 60 ? 'HIGH' : riskScore >= 40 ? 'MEDIUM' : 'LOW';

  return {
    rootIncidentNode: rootNode.name,
    totalAffectedNodes: visited.size,
    cascadingDelayMinutes: Math.round(totalDelay),
    systemRiskScore: riskScore,
    riskRating,
    affectedZones: affectedZones.length > 0 ? affectedZones : ['Terminal B - Zone B2', 'Concourse B Gate Corridor'],
    affectedAssets: affectedAssets.length > 0 ? affectedAssets : ['HVAC Unit 03', 'Security Checkpoint B', 'Baggage Belt 03'],
    recommendation: {
      primaryAction: 'Open Security Checkpoint C to divert 40% passenger traffic from B2 corridor.',
      secondaryAction: 'Increase HVAC Unit 03 airflow rate by 15% to maintain indoor air quality standard.',
      estimatedReliefPercent: 40,
      timeframeMinutes: 15,
    },
    impactPath,
  };
}
