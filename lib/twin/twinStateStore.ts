import { create } from 'zustand';
import {
  Incident,
  Asset,
  DependencyNode,
  SpatialMarker,
  CopilotMessage,
  IncidentStatus,
  EmergencyIncident,
  EmergencyLifecycleStatus,
  MedicalResponseStatus,
  TerminalOpsStatus,
  AccessRouteStatus,
  EmergencyTimelineEvent,
} from '@/types';
import {
  TerminalCrowdState,
  CrowdZone,
  CrowdZoneStatus,
  CrowdAuditEntry,
} from '@/types/crowd';
import {
  ActiveScenario,
  ScenarioType,
  ScenarioSeverity,
} from '@/types/scenario';
import {
  INITIAL_SPATIAL_MARKERS,
  INITIAL_INCIDENTS,
  INITIAL_ASSETS,
  INITIAL_DEPENDENCY_NODES,
} from '@/lib/data/airportSeedData';
import {
  INITIAL_TERMINAL_CROWD_STATES,
  INITIAL_CROWD_AUDIT_LOG,
} from '@/lib/crowd/crowdData';
import {
  createDefaultGateB14Incident,
  createTimelineEvent,
  formatEventTime,
} from '@/lib/emergency/emergencyService';

export interface PendingConfirmationAction {
  title: string;
  description: string;
  recipient: string;
  impact: string;
  actionType: string;
  onConfirm: (notes?: string) => void;
  isDangerous?: boolean;
}

interface TwinStoreState {
  // Navigation Sidebar Drawer State
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // 3D Camera & Selection
  cameraTarget: [number, number, number] | null;
  cameraPosition: [number, number, number] | null;
  selectedMarkerId: string | null;
  selectedAssetId: string | null;
  selectedIncidentId: string | null;
  focusEntity: (id: string, coords: [number, number, number]) => void;
  resetCamera: () => void;

  // Markers & Entities
  markers: SpatialMarker[];
  updateMarkerStatus: (
    id: string,
    status: SpatialMarker['status'],
    color: SpatialMarker['statusColor'],
    risk?: 'Low' | 'Medium' | 'High',
    newName?: string
  ) => void;

  // Incidents
  incidents: Incident[];
  activeIncidentCount: number;
  addIncident: (incident: Incident) => void;
  updateIncidentStatus: (id: string, status: IncidentStatus) => void;

  // Assets
  assets: Asset[];
  updateAssetHealth: (id: string, health: number, temp: number) => void;

  // Dependency Graph
  dependencyNodes: DependencyNode[];
  activeCascadeImpactNodeId: string | null;
  setActiveCascadeNode: (nodeId: string | null) => void;

  // AI Copilot
  copilotMessages: CopilotMessage[];
  isCopilotOpen: boolean;
  setCopilotOpen: (open: boolean) => void;
  addCopilotMessage: (message: Omit<CopilotMessage, 'id' | 'timestamp'>) => void;

  // Digital Twin Operational Layer
  activeLayer: 'ALL' | 'BUILDINGS' | 'ASSETS' | 'OPERATIONS' | 'ENERGY' | 'INCIDENTS' | 'DEPENDENCIES';
  setActiveLayer: (layer: 'ALL' | 'BUILDINGS' | 'ASSETS' | 'OPERATIONS' | 'ENERGY' | 'INCIDENTS' | 'DEPENDENCIES') => void;

  // Search Modal
  isSearchOpen: boolean;
  setSearchOpen: (open: boolean) => void;

  // ==========================================================================
  // MEDICAL EMERGENCY OPERATIONS MODULE
  // ==========================================================================
  activeEmergency: EmergencyIncident | null;
  isReportModalOpen: boolean;
  setReportModalOpen: (open: boolean) => void;
  isEmergencyDrawerOpen: boolean;
  setEmergencyDrawerOpen: (open: boolean) => void;
  isResolveModalOpen: boolean;
  setResolveModalOpen: (open: boolean) => void;
  pendingConfirmation: PendingConfirmationAction | null;
  setPendingConfirmation: (conf: PendingConfirmationAction | null) => void;

  // Emergency Actions (Human-in-the-Loop)
  reportEmergency: (data?: Partial<EmergencyIncident>) => void;
  simulateDemoEmergency: () => void;
  acknowledgeEmergency: (adminName?: string) => void;
  approveEmergencyRecommendation: (recId: string, adminName?: string, notes?: string) => void;
  updateMedicalResponseStatus: (status: MedicalResponseStatus, actor?: string, notes?: string) => void;
  updateTerminalOpsStatus: (status: TerminalOpsStatus, actor?: string, notes?: string) => void;
  updateAccessRouteStatus: (status: AccessRouteStatus, actor?: string, notes?: string) => void;
  addEmergencyNote: (note: string, author?: string) => void;
  escalateEmergency: (reason: string, adminName?: string) => void;
  resolveEmergency: (
    outcome: EmergencyIncident['resolutionOutcome'],
    notes: string,
    returnGateNormal?: boolean,
    adminName?: string
  ) => void;
  focusEmergencyLocation: () => void;

  // ==========================================================================
  // CROWD MANAGEMENT DIGITAL TWIN STATE
  // ==========================================================================
  isCrowdMode: boolean;
  setCrowdMode: (active: boolean) => void;
  selectedCrowdTerminal: string;
  setSelectedCrowdTerminal: (termId: string) => void;
  selectedCrowdZoneId: string | null;
  setSelectedCrowdZoneId: (zoneId: string | null) => void;
  crowdTerminals: Record<string, TerminalCrowdState>;
  crowdTimelineIndex: number;
  setCrowdTimelineIndex: (idx: number) => void;
  isCrowdPlayback: boolean;
  setIsCrowdPlayback: (playback: boolean) => void;
  crowdAuditTrail: CrowdAuditEntry[];
  executeCrowdLaneOpen: (zoneId: string, lanesToAdd?: number, adminName?: string) => void;
  executeCrowdRedirectFlow: (fromZoneId: string, toZoneId: string, adminName?: string) => void;
  executeCrowdStaffAllocation: (zoneId: string, staffCount?: number, adminName?: string) => void;
  createCrowdIncident: (zoneId: string, priority?: string, adminName?: string) => void;

  // ==========================================================================
  // OPERATIONAL SCENARIO CONTROL (SIMULATION ENGINE)
  // ==========================================================================
  activeScenarios: ActiveScenario[];
  isScenarioDrawerOpen: boolean;
  setScenarioDrawerOpen: (open: boolean) => void;
  triggerConveyorScenario: (params: {
    terminalId: string;
    assetId: string;
    severityPercent: number;
    failureMode: 'Degraded' | 'Intermittent' | 'Offline';
  }) => void;
  triggerCrowdScenario: (params: {
    terminalId: string;
    location: string;
    passengerCount: number;
    severity: ScenarioSeverity;
  }) => void;
  triggerMedicalScenario: (params: {
    terminalId: string;
    location: string;
    casesCount: number;
    severity: ScenarioSeverity;
  }) => void;
  resolveScenario: (scenarioId: string) => void;
  resetAllScenarios: () => void;
}

// Subtle Web Audio alert chime helper
function playEmergencyChime() {
  if (typeof window === 'undefined') return;
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.setValueAtTime(440, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.45);
  } catch {
    // Ignore audio context errors if browser blocked audio autoplay
  }
}

export const useTwinStore = create<TwinStoreState>((set, get) => ({
  isSidebarOpen: false,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),

  activeLayer: 'ALL',
  setActiveLayer: (layer) => set({ activeLayer: layer }),

  cameraTarget: null,
  cameraPosition: null,
  selectedMarkerId: null,
  selectedAssetId: null,
  selectedIncidentId: null,

  focusEntity: (id, coords) =>
    set({
      selectedMarkerId: id,
      cameraTarget: coords,
      cameraPosition: [coords[0] + 16, coords[1] + 18, coords[2] + 22],
    }),

  resetCamera: () =>
    set({
      selectedMarkerId: null,
      selectedAssetId: null,
      selectedIncidentId: null,
      cameraTarget: [0, 0, 0],
      cameraPosition: [48, 58, 68],
    }),

  markers: INITIAL_SPATIAL_MARKERS,
  updateMarkerStatus: (id, status, color, risk, newName) =>
    set((state) => ({
      markers: state.markers.map((m) =>
        m.id === id
          ? {
              ...m,
              status,
              statusColor: color,
              riskLevel: risk || m.riskLevel,
              name: newName || m.name,
            }
          : m
      ),
    })),

  incidents: INITIAL_INCIDENTS,
  activeIncidentCount: 2,
  addIncident: (incident) =>
    set((state) => ({
      incidents: [incident, ...state.incidents],
      activeIncidentCount: state.activeIncidentCount + 1,
    })),

  updateIncidentStatus: (id, status) =>
    set((state) => {
      const updated = state.incidents.map((inc) => (inc.id === id ? { ...inc, status } : inc));
      const activeCount = updated.filter((i) => i.status !== 'RESOLVED').length;
      return { incidents: updated, activeIncidentCount: activeCount };
    }),

  assets: INITIAL_ASSETS,
  updateAssetHealth: (id, health, temp) =>
    set((state) => ({
      assets: state.assets.map((asset) =>
        asset.id === id
          ? {
              ...asset,
              healthScore: health,
              temperature: temp,
              status: health < 70 ? 'CRITICAL' : health < 85 ? 'WARNING' : 'OPTIMAL',
            }
          : asset
      ),
    })),

  dependencyNodes: INITIAL_DEPENDENCY_NODES,
  activeCascadeImpactNodeId: 'power-node-b-root',
  setActiveCascadeNode: (nodeId) => set({ activeCascadeImpactNodeId: nodeId }),

  copilotMessages: [
    {
      id: 'm-1',
      role: 'assistant',
      content:
        'Welcome to **TwinOS AI Operations Center**. Connected to real-time airport Digital Twin telemetry.\n\nCurrently, **HVAC Chiller Unit 03** is running with elevated temperature (**29.2°C**), and **Baggage Belt 03** has motor bearing friction detected.',
      timestamp: '16:25',
      actions: [
        { label: 'Inspect HVAC-03', actionType: 'VIEW_ASSET', targetId: 'hvac-03' },
        { label: 'Analyze Dependencies', actionType: 'ANALYZE_IMPACT', targetId: 'power-node-b-root' },
      ],
    },
  ],
  isCopilotOpen: false,
  setCopilotOpen: (open) => set({ isCopilotOpen: open }),
  addCopilotMessage: (msg) =>
    set((state) => ({
      copilotMessages: [
        ...state.copilotMessages,
        {
          ...msg,
          id: `msg-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ],
    })),

  isSearchOpen: false,
  setSearchOpen: (open) => set({ isSearchOpen: open }),

  // ==========================================================================
  // MEDICAL EMERGENCY OPERATIONS MODULE IMPLEMENTATION
  // ==========================================================================
  activeEmergency: null,
  isReportModalOpen: false,
  setReportModalOpen: (open) => set({ isReportModalOpen: open }),
  isEmergencyDrawerOpen: false,
  setEmergencyDrawerOpen: (open) => set({ isEmergencyDrawerOpen: open }),
  isResolveModalOpen: false,
  setResolveModalOpen: (open) => set({ isResolveModalOpen: open }),
  pendingConfirmation: null,
  setPendingConfirmation: (conf) => set({ pendingConfirmation: conf }),

  focusEmergencyLocation: () => {
    const emergency = get().activeEmergency;
    const coords: [number, number, number] = emergency?.coordinates || [1.2, 2.0, -1.5];
    set({
      selectedMarkerId: 'emergency-gate-b14',
      cameraTarget: coords,
      cameraPosition: [coords[0] + 8, coords[1] + 10, coords[2] + 12],
    });
  },

  reportEmergency: (customData) => {
    playEmergencyChime();
    const base = createDefaultGateB14Incident();
    const incident: EmergencyIncident = {
      ...base,
      ...customData,
      reportedTimestamp: Date.now(),
      reportedAt: formatEventTime(),
      operationalContext: {
        ...base.operationalContext,
        ...(customData?.operationalContext || {}),
      },
    };

    const emergencyCoords: [number, number, number] = incident.coordinates || [1.2, 2.0, -1.5];

    // Ensure emergency marker is active in 3D digital twin
    const existingMarker = get().markers.find((m) => m.id === 'emergency-gate-b14');
    let updatedMarkers = [...get().markers];

    const emergencyMarker: SpatialMarker = {
      id: 'emergency-gate-b14',
      name: 'Gate B14 — Medical Emergency',
      type: 'emergency',
      status: 'Emergency',
      statusColor: 'red',
      riskLevel: 'High',
      activeIncidents: 1,
      position: emergencyCoords,
      aiInsight:
        'CRITICAL: Passenger requiring immediate medical assistance. Station B-2 alerted (0.3km). Flight AA-1482 boarding hold recommended.',
    };

    if (existingMarker) {
      updatedMarkers = updatedMarkers.map((m) =>
        m.id === 'emergency-gate-b14' ? emergencyMarker : m
      );
    } else {
      updatedMarkers.push(emergencyMarker);
    }

    set({
      activeEmergency: incident,
      isEmergencyDrawerOpen: true,
      isReportModalOpen: false,
      markers: updatedMarkers,
      selectedMarkerId: 'emergency-gate-b14',
      cameraTarget: emergencyCoords,
      cameraPosition: [emergencyCoords[0] + 8, emergencyCoords[1] + 10, emergencyCoords[2] + 12],
    });

    get().addCopilotMessage({
      role: 'assistant',
      content: `🚨 **CRITICAL MEDICAL EMERGENCY REPORTED** at **${incident.locationName}**.\n\n• **Incident ID:** \`${incident.incidentNumber}\`\n• **Nearest Medical Station:** ${incident.operationalContext.nearestMedicalStation}\n• **Nearest AED:** ${incident.operationalContext.nearestAEDLocation}\n• **Impacted Flight:** ${incident.operationalContext.currentFlightImpact.flightNumber} (${incident.operationalContext.currentFlightImpact.boardingStatus})\n\nTwinOS operational decision support has prepared 4 recommended actions requiring human review.`,
      actions: [
        { label: 'View Digital Twin at Gate B14', actionType: 'FOCUS_TWIN', targetId: 'emergency-gate-b14' },
      ],
    });
  },

  simulateDemoEmergency: () => {
    get().reportEmergency();
  },

  acknowledgeEmergency: (adminName = 'H. Shereef (Duty Manager)') => {
    const current = get().activeEmergency;
    if (!current) return;

    const event = createTimelineEvent(
      'Emergency Incident Acknowledged',
      `Operations Control Administrator reviewed and acknowledged medical alert at ${current.locationName}. Commenced operational decision support triage.`,
      adminName,
      'ADMIN',
      'ACKNOWLEDGE',
      'ACKNOWLEDGED'
    );

    const now = Date.now();
    const ackTimeSec = Math.round((now - current.reportedTimestamp) / 1000);

    set({
      activeEmergency: {
        ...current,
        status: current.status === 'REPORTED' ? 'ACKNOWLEDGED' : current.status,
        timeline: [event, ...current.timeline],
        statusNotes: [
          `Acknowledged by ${adminName} at ${event.formattedTime}. Operations coordination in progress.`,
          ...current.statusNotes,
        ],
        metrics: {
          ...(current.metrics || {
            timeToAcknowledgeSec: 0,
            timeToDispatchSec: 0,
            timeToOnSceneSec: 0,
            totalResolutionTimeSec: 0,
            isWithinSLA: true,
          }),
          timeToAcknowledgeSec: ackTimeSec,
        },
      },
    });
  },

  approveEmergencyRecommendation: (recId, adminName = 'H. Shereef (Duty Manager)', notes) => {
    const current = get().activeEmergency;
    if (!current) return;

    const targetRec = current.aiRecommendations.find((r) => r.id === recId);
    if (!targetRec) return;

    const now = Date.now();
    const timeFormatted = formatEventTime();
    let newMedicalStatus = current.medicalResponseStatus;
    let newTerminalOpsStatus = current.terminalOpsStatus;
    let newAccessStatus = current.accessRouteStatus;
    let newLifecycleStatus: EmergencyLifecycleStatus =
      current.status === 'REPORTED' || current.status === 'ACKNOWLEDGED'
        ? 'RESPONSE_INITIATED'
        : current.status;

    let eventTitle = `Action Approved: ${targetRec.actionLabel}`;
    let eventDescription = `Administrator authorized: ${targetRec.description}. Target: ${targetRec.targetRecipient}. ${notes ? `Note: "${notes}"` : ''}`;
    let eventType: EmergencyTimelineEvent['type'] = 'COORDINATION';

    if (targetRec.actionType === 'NOTIFY_MEDICAL') {
      newMedicalStatus = 'NOTIFIED';
      eventTitle = 'Medical Response Unit Dispatched';
      eventType = 'DISPATCH';
      newLifecycleStatus = 'RESPONSE_INITIATED';
    } else if (targetRec.actionType === 'NOTIFY_TERMINAL_OPS') {
      newTerminalOpsStatus = 'CROWD_CONTROL_REQUESTED';
      eventTitle = 'Terminal B Operations Alerted';
    } else if (targetRec.actionType === 'PRIORITIZE_ELEVATOR') {
      newAccessStatus = 'ELEVATOR_PRIORITY_ACTIVE';
      eventTitle = 'Elevator E4 Priority Granted';
      eventType = 'ACCESS';
    } else if (targetRec.actionType === 'HOLD_BOARDING') {
      newTerminalOpsStatus = 'GATE_HOLD_ACTIVE';
      eventTitle = 'Gate B14 Boarding Hold Enacted';
    }

    const event = createTimelineEvent(
      eventTitle,
      eventDescription,
      adminName,
      'ADMIN',
      eventType,
      'APPROVED'
    );

    const updatedRecs = current.aiRecommendations.map((r) =>
      r.id === recId ? { ...r, status: 'APPROVED' as const, executedAt: timeFormatted } : r
    );

    const dispatchTimeSec =
      targetRec.actionType === 'NOTIFY_MEDICAL'
        ? Math.round((now - current.reportedTimestamp) / 1000)
        : current.metrics?.timeToDispatchSec || 0;

    set({
      activeEmergency: {
        ...current,
        status: newLifecycleStatus,
        medicalResponseStatus: newMedicalStatus,
        terminalOpsStatus: newTerminalOpsStatus,
        accessRouteStatus: newAccessStatus,
        aiRecommendations: updatedRecs,
        timeline: [event, ...current.timeline],
        statusNotes: [
          `Approved ${targetRec.actionLabel} by ${adminName} at ${timeFormatted}.`,
          ...current.statusNotes,
        ],
        metrics: {
          ...(current.metrics || {
            timeToAcknowledgeSec: 45,
            timeToDispatchSec: 0,
            timeToOnSceneSec: 0,
            totalResolutionTimeSec: 0,
            isWithinSLA: true,
          }),
          timeToDispatchSec: dispatchTimeSec || current.metrics?.timeToDispatchSec || 75,
        },
      },
    });
  },

  updateMedicalResponseStatus: (newStatus, actor = 'Unit Alpha-2 (Paramedic Lead)', notes) => {
    const current = get().activeEmergency;
    if (!current) return;

    const timeFormatted = formatEventTime();
    const now = Date.now();

    let newLifecycleStatus = current.status;
    let title = `Medical Response Status: ${newStatus.replace('_', ' ')}`;
    let desc = `Field update received from ${actor}. Response status transitioned to ${newStatus}.`;

    if (newStatus === 'EN_ROUTE') {
      newLifecycleStatus = 'RESPONDING';
      title = 'Medical Unit En Route to Gate B14';
      desc = `Paramedic Unit Alpha-2 departed Station B-2 via Service Corridor 2B. ETA ~2 minutes.`;
    } else if (newStatus === 'ON_SCENE') {
      newLifecycleStatus = 'RESPONDING';
      title = 'Medical Unit On Scene at Gate B14';
      desc = `Paramedic Unit Alpha-2 arrived on scene at Gate B14 podium. Initiated direct passenger assessment and stabilization.`;
    }

    if (notes) {
      desc += ` Operational Notes: "${notes}"`;
    }

    const event = createTimelineEvent(
      title,
      desc,
      actor,
      'FIELD',
      'STATUS_UPDATE',
      newStatus
    );

    const onSceneSec =
      newStatus === 'ON_SCENE'
        ? Math.round((now - current.reportedTimestamp) / 1000)
        : current.metrics?.timeToOnSceneSec || 0;

    set({
      activeEmergency: {
        ...current,
        status: newLifecycleStatus,
        medicalResponseStatus: newStatus,
        timeline: [event, ...current.timeline],
        statusNotes: [`[${timeFormatted}] ${title} (${actor})`, ...current.statusNotes],
        metrics: {
          ...(current.metrics || {
            timeToAcknowledgeSec: 45,
            timeToDispatchSec: 75,
            timeToOnSceneSec: 0,
            totalResolutionTimeSec: 0,
            isWithinSLA: true,
          }),
          timeToOnSceneSec: onSceneSec || current.metrics?.timeToOnSceneSec || 255,
        },
      },
    });
  },

  updateTerminalOpsStatus: (status, actor = 'TB Operations Lead (Desk 4)', notes) => {
    const current = get().activeEmergency;
    if (!current) return;

    const event = createTimelineEvent(
      `Terminal Operations Status: ${status.replace('_', ' ')}`,
      `Terminal operations status updated to ${status}. ${notes ? `Details: "${notes}"` : ''}`,
      actor,
      'FIELD',
      'COORDINATION',
      status
    );

    set({
      activeEmergency: {
        ...current,
        terminalOpsStatus: status,
        timeline: [event, ...current.timeline],
      },
    });
  },

  updateAccessRouteStatus: (status, actor = 'Facility Transit Automation', notes) => {
    const current = get().activeEmergency;
    if (!current) return;

    const event = createTimelineEvent(
      `Access Route Status: ${status.replace('_', ' ')}`,
      `Vertical and corridor routing updated to ${status}. ${notes ? `Details: "${notes}"` : ''}`,
      actor,
      'SYSTEM',
      'ACCESS',
      status
    );

    set({
      activeEmergency: {
        ...current,
        accessRouteStatus: status,
        timeline: [event, ...current.timeline],
      },
    });
  },

  addEmergencyNote: (note, author = 'H. Shereef (Duty Manager)') => {
    const current = get().activeEmergency;
    if (!current) return;

    const event = createTimelineEvent(
      'Operational Log Entry Added',
      note,
      author,
      'ADMIN',
      'NOTE'
    );

    set({
      activeEmergency: {
        ...current,
        statusNotes: [note, ...current.statusNotes],
        timeline: [event, ...current.timeline],
      },
    });
  },

  escalateEmergency: (reason, adminName = 'H. Shereef (Duty Manager)') => {
    const current = get().activeEmergency;
    if (!current) return;

    const event = createTimelineEvent(
      'Incident Escalated to Level-2 Operations Priority',
      `Administrator elevated emergency status: ${reason}. Airport Operations Center (AOC) and Airport Duty Manager alerted. Dedicated ambulance transfer staged at Apron Gate B14.`,
      adminName,
      'ADMIN',
      'ESCALATION',
      'ESCALATED'
    );

    set({
      activeEmergency: {
        ...current,
        severity: 'CRITICAL',
        timeline: [event, ...current.timeline],
        statusNotes: [
          `[ESCALATION] Level-2 declared by ${adminName}: ${reason}`,
          ...current.statusNotes,
        ],
      },
    });
  },

  resolveEmergency: (
    outcome = 'TREATED_ON_SITE',
    notes,
    returnGateNormal = true,
    adminName = 'H. Shereef (Duty Manager)'
  ) => {
    const current = get().activeEmergency;
    if (!current) return;

    const now = Date.now();
    const totalTimeSec = Math.round((now - current.reportedTimestamp) / 1000);
    const timeFormatted = formatEventTime();

    const event = createTimelineEvent(
      'Medical Emergency Resolved & Closed',
      `Incident concluded with outcome: ${outcome.replace(/_/g, ' ')}. ${notes}. Gate B14 cleared for resumption of normal flight operations.`,
      adminName,
      'ADMIN',
      'RESOLUTION',
      'RESOLVED'
    );

    // Update 3D Digital Twin marker
    if (returnGateNormal) {
      get().updateMarkerStatus(
        'emergency-gate-b14',
        'Normal',
        'green',
        'Low',
        'Gate B14 — Normal Operations'
      );
    }

    set({
      activeEmergency: {
        ...current,
        status: 'RESOLVED',
        resolvedAt: timeFormatted,
        resolvedTimestamp: now,
        resolvedBy: adminName,
        resolutionOutcome: outcome,
        resolutionNotes: notes,
        medicalResponseStatus: 'ON_SCENE',
        terminalOpsStatus: 'CLEAR',
        accessRouteStatus: 'NORMALIZED',
        timeline: [event, ...current.timeline],
        statusNotes: [
          `[RESOLVED] ${timeFormatted} by ${adminName}. Outcome: ${outcome}.`,
          ...current.statusNotes,
        ],
        metrics: {
          timeToAcknowledgeSec: current.metrics?.timeToAcknowledgeSec || 45,
          timeToDispatchSec: current.metrics?.timeToDispatchSec || 75,
          timeToOnSceneSec: current.metrics?.timeToOnSceneSec || 255,
          totalResolutionTimeSec: totalTimeSec > 60 ? totalTimeSec : 660, // 11 mins default if fast test
          isWithinSLA: true,
        },
      },
      isResolveModalOpen: false,
    });

    get().addCopilotMessage({
      role: 'assistant',
      content: `✅ **MEDICAL EMERGENCY RESOLVED** at **Gate B14**.\n\n• **Outcome:** ${outcome.replace(/_/g, ' ')}\n• **Resolution Time:** ${Math.round(totalTimeSec / 60)} min (Within SLA Target < 6m response)\n• **Digital Twin Status:** Gate B14 restored to NORMAL (Green).\n• **Audit Trail:** Logged and sealed with complete operational timeline.`,
      actions: [
        { label: 'View Incident Drawer', actionType: 'RESOLVE_INCIDENT', targetId: 'emergency-gate-b14' },
      ],
    });
  },

  // ==========================================================================
  // CROWD MANAGEMENT IMPLEMENTATION
  // ==========================================================================
  isCrowdMode: false,
  setCrowdMode: (active) => {
    set({ isCrowdMode: active });
    if (active) {
      set({
        cameraTarget: [-2, 0, 4],
        cameraPosition: [-2 + 20, 24, 4 + 26],
      });
    } else {
      get().resetCamera();
    }
  },

  selectedCrowdTerminal: 'terminal-b',
  setSelectedCrowdTerminal: (termId) => {
    const coords: [number, number, number] =
      termId === 'terminal-a' ? [-22, 0, 8] :
      termId === 'terminal-b' ? [-2, 0, 4] :
      termId === 'terminal-c' ? [18, 0, 8] : [36, 0, 14];

    set({
      selectedCrowdTerminal: termId,
      selectedCrowdZoneId: termId === 'terminal-b' ? 'sec-zone-2' : null,
      cameraTarget: coords,
      cameraPosition: [coords[0] + 18, 22, coords[2] + 24],
    });
  },

  selectedCrowdZoneId: 'sec-zone-2',
  setSelectedCrowdZoneId: (zoneId) => set({ selectedCrowdZoneId: zoneId }),

  crowdTerminals: INITIAL_TERMINAL_CROWD_STATES,
  crowdTimelineIndex: 5, // 13:00 (LIVE)
  setCrowdTimelineIndex: (idx) => set({ crowdTimelineIndex: idx }),

  isCrowdPlayback: false,
  setIsCrowdPlayback: (playback) => set({ isCrowdPlayback: playback }),

  crowdAuditTrail: INITIAL_CROWD_AUDIT_LOG,

  executeCrowdLaneOpen: (zoneId, lanesToAdd = 1, adminName = 'H. Shereef (Operations Duty Manager)') => {
    const terminals = { ...get().crowdTerminals };
    const termB = { ...terminals['terminal-b'] };
    const added = lanesToAdd || 1;
    const updatedZones = termB.zones.map((z) => {
      if (z.id === zoneId) {
        const newLanes = Math.min(8, (z.openLanes || 6) + added);
        const newOutgoing = added >= 2 ? 118 : (z.outgoingFlow || 92) + 26;
        const newQueue = added >= 2 ? 120 : Math.max(20, (z.queueLength || 184) - 42);
        const newPressure = added >= 2 ? 58 : Math.max(30, (z.pressureScore || 84) - 16);
        return {
          ...z,
          openLanes: newLanes,
          outgoingFlow: newOutgoing,
          netFlow: z.incomingFlow - newOutgoing,
          queueLength: newQueue,
          estimatedWaitMin: added >= 2 ? 6.5 : Math.max(3, Math.round(newQueue / 15)),
          pressureScore: newPressure,
          status: (newPressure > 80 ? 'CRITICAL' : newPressure > 60 ? 'ATTENTION' : 'NORMAL') as CrowdZoneStatus,
          aiInsight: `Lanes opened: ${newLanes}/8 active. Screening throughput elevated to ${newOutgoing} pax/min; queue visibly compressed to ${newQueue} passengers.`,
        };
      }
      return z;
    });

    const targetZone = termB.zones.find((z) => z.id === zoneId);
    termB.zones = updatedZones;
    termB.pressureScore = added >= 2 ? 58 : Math.max(40, termB.pressureScore - 12);
    termB.status = (termB.pressureScore > 80 ? 'CRITICAL' : termB.pressureScore > 60 ? 'ATTENTION' : 'NORMAL') as CrowdZoneStatus;
    terminals['terminal-b'] = termB;

    const timeFormatted = formatEventTime();
    const actionLabel = added >= 2 ? 'Opened 2 Additional Screening Lanes (Lanes 7 & 8)' : 'Opened Additional Security Lane 7';
    const auditEntry: CrowdAuditEntry = {
      id: `cad-${Date.now()}`,
      time: timeFormatted,
      action: `${actionLabel} (${targetZone?.name || 'Security Checkpoint'})`,
      zoneName: targetZone?.name || 'Security Zone 2',
      actor: adminName,
      result: `Open screening lanes: 6 → ${added >= 2 ? 8 : 7}. Queue decreased to ${added >= 2 ? 120 : 142} pax. Throughput: 118 pax/min. Pressure score reduced from 84 to ${added >= 2 ? 58 : 68}.`,
      pressureBefore: 84,
      pressureAfter: added >= 2 ? 58 : 68,
    };

    set({
      crowdTerminals: terminals,
      crowdAuditTrail: [auditEntry, ...get().crowdAuditTrail],
    });

    get().addCopilotMessage({
      role: 'assistant',
      content: `✅ **Operational Action Executed by ${adminName}:**\n\n• **Action:** ${actionLabel} in **Terminal B**.\n• **Result:** Screening throughput increased to 118 pax/min; queue reduced from 184 to ${added >= 2 ? 120 : 142} passengers.\n• **Crowd Pressure:** Reduced from 84 (Critical) to ${added >= 2 ? 58 : 68} (${added >= 2 ? 'Optimal/Attention' : 'Attention'}).\n• **Audit Trail:** Recorded in immutable operational log.`,
      actions: [
        { label: 'Inspect Security Zone 2', actionType: 'FOCUS_TWIN', targetId: 'terminal-b' },
      ],
    });
  },

  executeCrowdRedirectFlow: (fromZoneId, toZoneId, adminName = 'H. Shereef (Operations Duty Manager)') => {
    const terminals = { ...get().crowdTerminals };
    const termB = { ...terminals['terminal-b'] };
    termB.zones = termB.zones.map((z) => {
      if (z.id === fromZoneId) {
        return {
          ...z,
          incomingFlow: Math.max(40, z.incomingFlow - 30),
          queueLength: Math.max(20, z.queueLength - 35),
          pressureScore: Math.max(35, z.pressureScore - 14),
        };
      }
      if (z.id === toZoneId) {
        return {
          ...z,
          incomingFlow: z.incomingFlow + 25,
          queueLength: z.queueLength + 15,
        };
      }
      return z;
    });
    terminals['terminal-b'] = termB;

    const auditEntry: CrowdAuditEntry = {
      id: `cad-${Date.now()}`,
      time: formatEventTime(),
      action: `Redirected Passenger Flow from ${fromZoneId} to ${toZoneId}`,
      zoneName: 'Terminal B Concourse',
      actor: adminName,
      result: 'Concourse floor marshals directed 30% of incoming queue to secondary check-in island.',
      pressureBefore: 84,
      pressureAfter: 74,
    };

    set({
      crowdTerminals: terminals,
      crowdAuditTrail: [auditEntry, ...get().crowdAuditTrail],
    });
  },

  executeCrowdStaffAllocation: (zoneId, staffCount = 4, adminName = 'H. Shereef (Operations Duty Manager)') => {
    const auditEntry: CrowdAuditEntry = {
      id: `cad-${Date.now()}`,
      time: formatEventTime(),
      action: `Reallocated +${staffCount} Terminal Floor Marshals to Zone`,
      zoneName: zoneId,
      actor: adminName,
      result: `${staffCount} additional customer assistance personnel staged for queue stanchion flow guidance.`,
      pressureBefore: 84,
      pressureAfter: 76,
    };

    set((state) => ({
      crowdAuditTrail: [auditEntry, ...state.crowdAuditTrail],
    }));
  },

  createCrowdIncident: (zoneId, priority = 'HIGH', adminName = 'H. Shereef (Operations Duty Manager)') => {
    const targetZone = get().crowdTerminals['terminal-b']?.zones.find((z) => z.id === zoneId);
    const newInc: Incident = {
      id: `inc-crowd-${Date.now()}`,
      title: `Crowd Bottleneck & Queue Surge — ${targetZone?.name || 'Security Zone 2'}`,
      type: 'OPERATIONS',
      severity: (priority as any) || 'HIGH',
      locationId: 'terminal-b',
      locationName: `Terminal B — ${targetZone?.name || 'Security Zone 2'}`,
      coordinates: [-2, 0.4, 1.5],
      detectedBy: 'TwinOS Crowd Telemetry Stream',
      confidence: 0.94,
      timestamp: formatEventTime(),
      affectedAssets: ['Security Lane 01-06', 'Queue Stanchion Array B2'],
      aiAnalysis: `Queue length at ${targetZone?.queueLength || 184} passengers with +16% growth in 10 minutes. Incoming passenger flow exceeds screening capacity.`,
      recommendation: 'Open supplementary screening Lane 7 and deploy crowd flow marshals at Concourse B entry.',
      status: 'ACTION_REQUIRED',
    };

    get().addIncident(newInc);
    get().addCopilotMessage({
      role: 'assistant',
      content: `⚠️ **New Operational Incident Created:** \`${newInc.title}\` (Priority: **${priority}**).\n\nLogged in Incident Management and Digital Twin.`,
      actions: [
        { label: 'View Incident in Incidents Hub', actionType: 'RESOLVE_INCIDENT', targetPath: '/incidents' },
      ],
    });
  },

  // ==========================================================================
  // OPERATIONAL SCENARIO CONTROL IMPLEMENTATION
  // ==========================================================================
  activeScenarios: [],
  isScenarioDrawerOpen: false,
  setScenarioDrawerOpen: (open) => set({ isScenarioDrawerOpen: open }),

  triggerConveyorScenario: ({ terminalId, assetId, severityPercent, failureMode }) => {
    const asset = get().assets.find((a) => a.id === assetId) || {
      id: assetId,
      name: assetId === 'b-17' ? 'Baggage Infeed Conveyor B-17' : 'Baggage Carousel Belt 03',
      location: terminalId === 'terminal-b' ? 'Terminal B' : 'Terminal A',
      coordinates: [-2, 0.8, 4] as [number, number, number],
    };

    const termName =
      terminalId === 'terminal-a' ? 'Terminal A' : terminalId === 'terminal-b' ? 'Terminal B' : 'Terminal C';
    const scenSeverity: ScenarioSeverity = severityPercent > 80 ? 'CRITICAL' : severityPercent > 50 ? 'HIGH' : 'MEDIUM';

    const newScenario: ActiveScenario = {
      id: `scen-conv-${Date.now()}`,
      type: 'CONVEYOR_FAILURE',
      title: `${asset.name} Failure (${failureMode})`,
      terminalId,
      terminalName: termName,
      locationName: `${termName} Baggage Sortation Vault`,
      locationCoords: (asset as any).coordinates || [-2, 0.8, 4],
      assetId,
      assetName: asset.name,
      severity: scenSeverity,
      intensityPercent: severityPercent,
      failureMode,
      status: 'ACTIVE',
      startTime: formatEventTime(),
      source: 'scenario',
      affectedEntities: [asset.name, 'Baggage Makeup Area B', 'Flight Departures (4 affected)'],
      associatedIncidentId: `inc-scen-${Date.now()}`,
      operationalImpact: `Conveyor belt ${failureMode.toLowerCase()} at ${severityPercent}% severity. Inbound luggage accumulation detected.`,
    };

    const newIncident: Incident = {
      id: newScenario.associatedIncidentId,
      title: `[SIMULATION] Baggage Conveyor Failure — ${asset.name}`,
      type: 'EQUIPMENT',
      severity: scenSeverity as any,
      locationId: terminalId,
      locationName: `${termName} Baggage Reclaim`,
      coordinates: (asset as any).coordinates || [-2, 0.8, 4],
      detectedBy: 'TwinOS Scenario Simulation Engine',
      confidence: 0.99,
      timestamp: formatEventTime(),
      affectedAssets: [asset.name, 'Baggage Sorter 02', 'Apron GSE Transfer B'],
      aiAnalysis: `Conveyor motor failure simulated under manual scenario control (${failureMode}, ${severityPercent}% load severity). Motor drive inverter stalled.`,
      recommendation: 'Divert flight luggage to adjacent Carousel Loop 04 and dispatch airside mechanical response team.',
      status: 'ACTION_REQUIRED',
      source: 'scenario',
      scenarioId: newScenario.id,
    };

    // Update asset health in digital twin
    const updatedAssets = get().assets.map((a) =>
      a.id === assetId
        ? {
            ...a,
            healthScore: Math.max(8, 100 - severityPercent),
            temperature: 38.6,
            status: (failureMode === 'Offline' ? 'CRITICAL' : 'WARNING') as any,
          }
        : a
    );

    set((state) => ({
      activeScenarios: [newScenario, ...state.activeScenarios],
      assets: updatedAssets,
      incidents: [newIncident, ...state.incidents],
      activeIncidentCount: state.activeIncidentCount + 1,
      activeCascadeImpactNodeId: 'power-node-b-root',
    }));

    playEmergencyChime();

    get().addCopilotMessage({
      role: 'assistant',
      content: `⚡ **Manual Operational Scenario Activated:** \`${newScenario.title}\`\n\n• **Terminal:** ${termName}\n• **Target Asset:** ${asset.name}\n• **Failure Mode:** ${failureMode} (${severityPercent}% intensity)\n• **Operational Risk:** Luggage backup detected across 4 scheduled flight banks. Incident \`${newIncident.id}\` logged.`,
      actions: [
        { label: `Focus ${asset.name}`, actionType: 'VIEW_ASSET', targetId: assetId },
        { label: 'Inspect Scenario Control', actionType: 'FOCUS_TWIN', targetId: terminalId },
      ],
    });
  },

  triggerCrowdScenario: ({ terminalId, location, passengerCount, severity }) => {
    const termName =
      terminalId === 'terminal-a' ? 'Terminal A' : terminalId === 'terminal-b' ? 'Terminal B' : 'Terminal C';

    const newScenario: ActiveScenario = {
      id: `scen-crowd-${Date.now()}`,
      type: 'CROWD_SURGE',
      title: `Passenger Surge — ${termName} (${location})`,
      terminalId,
      terminalName: termName,
      locationName: `${termName} — ${location}`,
      locationCoords: terminalId === 'terminal-b' ? [-2, 0.4, 1.5] : [18, 0.4, 8],
      severity,
      intensityPercent: 120,
      crowdCount: passengerCount,
      capacity: 10000,
      status: 'ACTIVE',
      startTime: formatEventTime(),
      source: 'scenario',
      affectedEntities: [`${termName} Screening Lanes`, 'Concourse Check-In', 'Airside Retail Concourse'],
      associatedIncidentId: `inc-scen-${Date.now()}`,
      operationalImpact: `Simulated rapid passenger influx of ${passengerCount.toLocaleString()} pax (+120% capacity). Security wait time spiked to 28 min.`,
    };

    const newIncident: Incident = {
      id: newScenario.associatedIncidentId,
      title: `[SIMULATION] Terminal Crowd Surge — ${termName}`,
      type: 'OPERATIONS',
      severity: severity as any,
      locationId: terminalId,
      locationName: `${termName} Checkpoints`,
      coordinates: terminalId === 'terminal-b' ? [-2, 0.4, 1.5] : [18, 0.4, 8],
      detectedBy: 'TwinOS Scenario Simulation Engine',
      confidence: 0.98,
      timestamp: formatEventTime(),
      affectedAssets: ['Security Checkpoint Queue', 'Automated Border Gates'],
      aiAnalysis: `Passenger surge simulated at 120% terminal capacity (${passengerCount.toLocaleString()} pax). Checkpoint queues exceeding safety thresholds.`,
      recommendation: 'Open all auxiliary overflow lanes, deploy roving passenger marshals, and adjust automated turnstiles.',
      status: 'ACTION_REQUIRED',
      source: 'scenario',
      scenarioId: newScenario.id,
    };

    // Update terminal crowd state
    const currentCrowd = { ...get().crowdTerminals };
    if (currentCrowd[terminalId]) {
      const termState = { ...currentCrowd[terminalId] };
      termState.occupancyPercent = 120;
      termState.pressureScore = 95;
      termState.status = 'CRITICAL';
      termState.zones = termState.zones.map((z) => ({
        ...z,
        queueLength: Math.round(z.queueLength * 1.6),
        densityPercent: Math.min(100, Math.round(z.densityPercent * 1.3)),
        status: 'CRITICAL',
      }));
      currentCrowd[terminalId] = termState;
    }

    // Update marker
    const updatedMarkers = get().markers.map((m) =>
      m.id === terminalId
        ? {
            ...m,
            occupancyPercent: 120,
            statusColor: 'red' as any,
            status: 'Critical Surge' as any,
            riskLevel: 'High' as any,
          }
        : m
    );

    set((state) => ({
      activeScenarios: [newScenario, ...state.activeScenarios],
      crowdTerminals: currentCrowd,
      markers: updatedMarkers,
      incidents: [newIncident, ...state.incidents],
      activeIncidentCount: state.activeIncidentCount + 1,
    }));

    playEmergencyChime();

    get().addCopilotMessage({
      role: 'assistant',
      content: `⚡ **Manual Operational Scenario Activated:** \`${newScenario.title}\`\n\n• **Terminal:** ${termName}\n• **Passenger Count:** ${passengerCount.toLocaleString()} pax (120% Overcapacity)\n• **Severity:** ${severity}\n• **Operational Action:** Automatic screening surge advisory active.`,
      actions: [
        { label: `View ${termName} Crowd Twin`, actionType: 'FOCUS_TWIN', targetId: terminalId },
      ],
    });
  },

  triggerMedicalScenario: ({ terminalId, location, casesCount, severity }) => {
    const termName =
      terminalId === 'terminal-a' ? 'Terminal A' : terminalId === 'terminal-b' ? 'Terminal B' : 'Terminal C';

    const newScenario: ActiveScenario = {
      id: `scen-med-${Date.now()}`,
      type: 'MEDICAL_EMERGENCY',
      title: `Medical Emergency (${casesCount} pax) — ${termName}`,
      terminalId,
      terminalName: termName,
      locationName: `${termName} — ${location}`,
      locationCoords: terminalId === 'terminal-b' ? [8.5, 0.45, 11] : [-22, 1.0, 8],
      severity,
      intensityPercent: 90,
      casesCount,
      status: 'ACTIVE',
      startTime: formatEventTime(),
      source: 'scenario',
      affectedEntities: [location, 'Airport Paramedic Unit 1', 'Gate Boarding Stream'],
      associatedIncidentId: `inc-scen-${Date.now()}`,
      operationalImpact: `${casesCount} passenger(s) in medical distress at ${location}. Emergency medical triage protocol initialized.`,
    };

    // Trigger existing medical emergency workflow
    get().reportEmergency({
      title: `Medical Emergency (${casesCount} pax) — ${termName}`,
      locationName: `${termName} — ${location}`,
      locationDetails: `Simulated medical emergency: ${casesCount} passenger(s) experiencing acute distress near ${location}.`,
      severity: severity === 'CRITICAL' ? 'CRITICAL' : 'HIGH',
    });

    set((state) => ({
      activeScenarios: [newScenario, ...state.activeScenarios],
    }));

    get().addCopilotMessage({
      role: 'assistant',
      content: `⚡ **Manual Operational Scenario Activated:** \`${newScenario.title}\`\n\n• **Location:** ${termName} (${location})\n• **Patients:** ${casesCount} case(s)\n• **Medical Unit:** Paramedic Unit 1 dispatched. Aerobridge route locked for emergency ingress.`,
      actions: [
        { label: 'Open Medical Response Console', actionType: 'FOCUS_TWIN', targetId: 'emergency-gate-b14' },
      ],
    });
  },

  resolveScenario: (scenarioId) => {
    const scenario = get().activeScenarios.find((s) => s.id === scenarioId);
    if (!scenario) return;

    if (scenario.type === 'CONVEYOR_FAILURE' && scenario.assetId) {
      set((state) => ({
        assets: state.assets.map((a) =>
          a.id === scenario.assetId
            ? { ...a, healthScore: 94, temperature: 23.5, status: 'OPTIMAL' as any }
            : a
        ),
      }));
    } else if (scenario.type === 'CROWD_SURGE') {
      const currentCrowd = { ...get().crowdTerminals };
      if (currentCrowd[scenario.terminalId]) {
        const termState = { ...currentCrowd[scenario.terminalId] };
        termState.occupancyPercent = 74;
        termState.pressureScore = 62;
        termState.status = 'ATTENTION';
        termState.zones = termState.zones.map((z) => ({
          ...z,
          queueLength: Math.round(z.queueLength / 1.5),
          densityPercent: Math.max(40, Math.round(z.densityPercent * 0.75)),
          status: 'ATTENTION',
        }));
        currentCrowd[scenario.terminalId] = termState;
      }
      set({ crowdTerminals: currentCrowd });
    } else if (scenario.type === 'MEDICAL_EMERGENCY') {
      get().resolveEmergency('TREATED_ON_SITE', 'Simulated medical incident resolved by operations manager.');
    }

    // Mark associated incident as resolved
    set((state) => ({
      activeScenarios: state.activeScenarios.filter((s) => s.id !== scenarioId),
      incidents: state.incidents.map((i) =>
        i.id === scenario.associatedIncidentId || (i as any).scenarioId === scenarioId
          ? { ...i, status: 'RESOLVED' as any }
          : i
      ),
      activeIncidentCount: Math.max(0, state.activeIncidentCount - 1),
    }));

    get().addCopilotMessage({
      role: 'assistant',
      content: `✅ **Operational Scenario Resolved:** \`${scenario.title}\`\n\n• **Resolution:** Asset / terminal returned to standard operating telemetry.\n• **Incident Status:** Marked RESOLVED in operations audit ledger.`,
      actions: [],
    });
  },

  resetAllScenarios: () => {
    set((state) => ({
      activeScenarios: [],
      assets: INITIAL_ASSETS,
      markers: INITIAL_SPATIAL_MARKERS,
      crowdTerminals: INITIAL_TERMINAL_CROWD_STATES,
      activeEmergency: null,
      incidents: state.incidents.filter((i) => (i as any).source !== 'scenario'),
      activeIncidentCount: 2,
    }));

    get().addCopilotMessage({
      role: 'assistant',
      content: `🔄 **All Operational Simulations Reset:** Airport Digital Twin returned to 100% live operational baseline. All mock incidents and stress tests cleared.`,
      actions: [],
    });
  },
}));

