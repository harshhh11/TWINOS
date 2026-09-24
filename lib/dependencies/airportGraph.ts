import { DependencyNode } from '@/types';

export interface GraphLink {
  source: string;
  target: string;
  relationship: string;
  criticality: 'CRITICAL' | 'HIGH' | 'MEDIUM';
}

export const AIRPORT_DEPENDENCY_EDGES: GraphLink[] = [
  {
    source: 'power-node-b-root',
    target: 'hvac-03-node',
    relationship: '11kV High-Voltage Primary Feeder',
    criticality: 'HIGH',
  },
  {
    source: 'power-node-b-root',
    target: 'terminal-b-power-dist',
    relationship: 'Main Terminal Substation Busbar',
    criticality: 'HIGH',
  },
  {
    source: 'hvac-03-node',
    target: 'terminal-b-concourse',
    relationship: 'Chilled Water & Air Flow Distribution',
    criticality: 'HIGH',
  },
  {
    source: 'hvac-03-node',
    target: 'baggage-03-dep',
    relationship: 'Mechanical Equipment Room Cooling',
    criticality: 'MEDIUM',
  },
  {
    source: 'terminal-b-concourse',
    target: 'escalator-04-node',
    relationship: 'Passenger Concourse Transit Circuit',
    criticality: 'MEDIUM',
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
          totalDelay += targetNode.cascadeDelayMinutes * 0.5;
          if (targetNode.type === 'zone' || targetNode.type === 'system') {
            affectedZones.push(targetNode.name);
          } else if (targetNode.type === 'asset' || targetNode.type === 'power_node') {
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
    affectedZones: affectedZones.length > 0 ? affectedZones : ['Terminal B Concourse', 'Zone B2 Operations'],
    affectedAssets: affectedAssets.length > 0 ? affectedAssets : ['HVAC Unit 03', 'Baggage Conveyor 03', 'Escalator Bank 04'],
    recommendation: {
      primaryAction: 'Rebalance 35% chilled water flow to Auxiliary Chiller Bank 4 to normalize HVAC operating temperature.',
      secondaryAction: 'Initiate scheduled bearing lubrication on Baggage Conveyor 03 drive assembly.',
      estimatedReliefPercent: 45,
      timeframeMinutes: 20,
    },
    impactPath,
  };
}
