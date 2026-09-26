import {
  EmergencyIncident,
  EmergencyTimelineEvent,
  EmergencyAIRecommendation,
  MedicalResponseStatus,
  TerminalOpsStatus,
  AccessRouteStatus,
  EmergencyLifecycleStatus,
} from '@/types';

export function formatEventTime(date: Date = new Date()): string {
  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

export function createTimelineEvent(
  title: string,
  description: string,
  actor: string,
  actorRole: EmergencyTimelineEvent['actorRole'],
  type: EmergencyTimelineEvent['type'],
  statusBadge?: string
): EmergencyTimelineEvent {
  const now = new Date();
  return {
    id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: now.toISOString(),
    formattedTime: formatEventTime(now),
    title,
    description,
    actor,
    actorRole,
    type,
    statusBadge,
  };
}

export const INITIAL_AI_RECOMMENDATIONS: EmergencyAIRecommendation[] = [
  {
    id: 'rec-1',
    actionLabel: 'Notify Airport Medical Response Unit (Station B-2)',
    description:
      'Dispatch certified on-duty medical response personnel from Concourse B First Aid Station B-2 to Gate B14.',
    operationalRationale:
      'Nearest certified emergency team (300m / 4 min estimated transit via Service Corridor 2B). Responders equipped with advanced trauma kit & transport stretcher.',
    priority: 'URGENT',
    status: 'RECOMMENDED',
    targetRecipient: 'Station B-2 Paramedic Lead (Radio Ch. 1 & Digital Alert Pager)',
    expectedImpact:
      'Initiates field mobilization of Paramedic Unit Alpha-2 (2 personnel).',
    actionType: 'NOTIFY_MEDICAL',
  },
  {
    id: 'rec-2',
    actionLabel: 'Notify Terminal B Operations Supervisor',
    description:
      'Alert Terminal B Concourse Management to deploy passenger crowd control and stage support.',
    operationalRationale:
      'Active boarding on Flight AA-1482 with ~184 passengers in immediate gate area. Clear perimeter required for responder access.',
    priority: 'HIGH',
    status: 'RECOMMENDED',
    targetRecipient: 'Terminal B Operations Duty Desk (Desk 4)',
    expectedImpact:
      'Floor marshals deployed to maintain 10m perimeter clearance around Gate B14 podium.',
    actionType: 'NOTIFY_TERMINAL_OPS',
  },
  {
    id: 'rec-3',
    actionLabel: 'Request Elevator E4 Priority Access Mode',
    description:
      'Pre-emptively command Service Elevator E4 into emergency recall/express mode.',
    operationalRationale:
      'Unobstructed vertical transport between Apron/Level 1 and Concourse Level 2. Reduces transit delay by approx. 90 seconds.',
    priority: 'HIGH',
    status: 'RECOMMENDED',
    targetRecipient: 'Facility Management & Vertical Transit Automation',
    expectedImpact:
      'Elevator E4 locked to priority responder recall with door-hold enabled.',
    actionType: 'PRIORITIZE_ELEVATOR',
  },
  {
    id: 'rec-4',
    actionLabel: 'Evaluate Gate B14 Boarding Hold',
    description:
      'Issue advisory to American Airlines gate staff to pause boarding Group 4.',
    operationalRationale:
      'Holding passenger boarding prevents jetbridge congestion while responders stabilize passenger in gate lounge.',
    priority: 'STANDARD',
    status: 'RECOMMENDED',
    targetRecipient: 'Airline Station Control (AA Operations Desk)',
    expectedImpact:
      'Jetbridge queue cleared; boarding temporarily paused with passenger PA broadcast.',
    actionType: 'HOLD_BOARDING',
  },
];

export function createDefaultGateB14Incident(): EmergencyIncident {
  const now = new Date();
  const reportedTime = formatEventTime(now);

  return {
    id: 'med-emergency-b14',
    incidentNumber: `MED-${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}-B14`,
    title: 'Medical Emergency — Gate B14',
    emergencyType: 'MEDICAL',
    locationName: 'Terminal B — Gate B14',
    locationDetails: 'Gate B14 Boarding Lounge & Podium Area, Concourse B North',
    coordinates: [1.2, 2.0, -1.5],
    reportedBy: 'Gate Agent B14 (Staff ID: SA-4402)',
    reporterContact: 'Ext 4414 / Radio Ch. 3',
    reportedAt: reportedTime,
    reportedTimestamp: now.getTime(),
    severity: 'CRITICAL',
    status: 'REPORTED',
    operationalContext: {
      terminal: 'Terminal B',
      zone: 'Concourse B - North Wing',
      gate: 'Gate B14',
      passengerCountNearby: 184,
      nearestMedicalStation: 'First Aid Station B-2 (0.3 km / Concourse Level 2)',
      estimatedResponseTimeMinutes: 4,
      nearestAEDLocation: 'Column B14-East (15m from Gate Podium)',
      currentFlightImpact: {
        flightNumber: 'AA-1482',
        destination: 'DFW (Dallas/Fort Worth)',
        scheduledDeparture: '14:45',
        boardingStatus: 'Boarding Active (Group 3 of 5)',
        paxOnboard: 92,
        paxWaiting: 78,
        gateHoldRecommended: true,
      },
      accessRoute: {
        primaryCorridor: 'Service Corridor 2B via Elevator E4',
        elevatorPriorityAvailable: true,
        routeClearanceStatus: 'Unobstructed — Concourse passenger density moderate',
      },
      cctvFeedId: 'CAM-TB-B14-NORTH',
    },
    medicalResponseStatus: 'PENDING_NOTIFICATION',
    medicalTeamAssigned: 'Airport Paramedic Unit Alpha-2 (2 Personnel)',
    terminalOpsStatus: 'MONITORING',
    accessRouteStatus: 'STANDARD',
    aiRecommendations: [...INITIAL_AI_RECOMMENDATIONS],
    statusNotes: [
      'Incident logged via TwinOS Operator Console. Passenger requiring immediate medical assistance reported near Gate B14 podium.',
    ],
    timeline: [
      createTimelineEvent(
        'Emergency Incident Reported',
        'Passenger requiring assistance reported near Gate B14. Gate Agent initiated priority alert.',
        'Gate Agent B14 (Staff ID: SA-4402)',
        'REPORTER',
        'REPORT',
        'CRITICAL'
      ),
      createTimelineEvent(
        'Digital Twin Localization & Context Mapped',
        'TwinOS localized Gate B14 [1.2, 2.0, -1.5]. Mapped Station B-2 (0.3 km), Column B14 AED, Flight AA-1482 boarding status. 4 AI operational recommendations generated for Administrator confirmation.',
        'TwinOS Operations Engine',
        'SYSTEM',
        'AI_RECOMMENDATION',
        'AI ADVISORY'
      ),
    ],
  };
}

export function exportAuditReportJson(incident: EmergencyIncident) {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(incident, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `TwinOS_AuditReport_${incident.incidentNumber}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}
