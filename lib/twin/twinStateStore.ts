import { create } from 'zustand';
import {
  EnvironmentType,
  TwinLayerType,
  Incident,
  Asset,
  CameraFeed,
  AIEvent,
  DependencyNode,
  SpatialMarker,
  CopilotMessage,
  IncidentStatus,
} from '@/types';
import {
  INITIAL_SPATIAL_MARKERS,
  INITIAL_CAMERA_FEEDS,
  INITIAL_INCIDENTS,
  INITIAL_ASSETS,
  INITIAL_DEPENDENCY_NODES,
} from '@/lib/data/airportSeedData';

interface TwinStoreState {
  // Environment
  currentEnvironment: EnvironmentType;
  setEnvironment: (env: EnvironmentType) => void;

  // 3D Layers
  activeLayers: Record<TwinLayerType, boolean>;
  toggleLayer: (layer: TwinLayerType) => void;
  is2DView: boolean;
  toggle2DView: () => void;

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
  updateMarkerStatus: (id: string, status: SpatialMarker['status'], color: SpatialMarker['statusColor'], risk?: 'Low' | 'Medium' | 'High') => void;

  // Camera Feeds & Computer Vision
  cameraFeeds: CameraFeed[];
  activeCameraId: string;
  setActiveCamera: (id: string) => void;
  triggerCrowdAnomaly: (cameraId: string, locationId: string) => void;

  // The Signature Sync Beam
  isSyncBeamActive: boolean;
  syncBeamOrigin: [number, number, number];
  syncBeamTarget: [number, number, number];
  startSignatureSync: () => void;
  stopSignatureSync: () => void;

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

  // Historical Time Replay
  historicalHour: number;
  setHistoricalHour: (hour: number) => void;

  // Search & Modals
  isSearchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  isVideoUploadOpen: boolean;
  setVideoUploadOpen: (open: boolean) => void;
}

export const useTwinStore = create<TwinStoreState>((set, get) => ({
  currentEnvironment: 'airport',
  setEnvironment: (env) => set({ currentEnvironment: env }),

  activeLayers: {
    buildings: true,
    flights: true,
    people: true,
    security: true,
    energy: true,
    assets: true,
    environment: true,
    incidents: true,
  },
  toggleLayer: (layer) =>
    set((state) => ({
      activeLayers: {
        ...state.activeLayers,
        [layer]: !state.activeLayers[layer],
      },
    })),

  is2DView: false,
  toggle2DView: () => set((state) => ({ is2DView: !state.is2DView })),

  cameraTarget: null,
  cameraPosition: null,
  selectedMarkerId: null,
  selectedAssetId: null,
  selectedIncidentId: null,

  focusEntity: (id, coords) =>
    set({
      selectedMarkerId: id,
      cameraTarget: coords,
      // Position camera slightly offset from target for a dramatic cinematic look
      cameraPosition: [coords[0] + 12, coords[1] + 14, coords[2] + 16],
    }),

  resetCamera: () =>
    set({
      selectedMarkerId: null,
      selectedAssetId: null,
      selectedIncidentId: null,
      cameraTarget: [0, 0, 0],
      cameraPosition: [28, 36, 42],
    }),

  markers: INITIAL_SPATIAL_MARKERS,
  updateMarkerStatus: (id, status, color, risk) =>
    set((state) => ({
      markers: state.markers.map((m) =>
        m.id === id ? { ...m, status, statusColor: color, riskLevel: risk || m.riskLevel } : m
      ),
    })),

  cameraFeeds: INITIAL_CAMERA_FEEDS,
  activeCameraId: 'cam-sec-a',
  setActiveCamera: (id) => set({ activeCameraId: id }),

  isSyncBeamActive: false,
  syncBeamOrigin: [22, 10, 8],
  syncBeamTarget: [11, 2.5, 3],

  startSignatureSync: () => {
    set({
      isSyncBeamActive: true,
      syncBeamTarget: [11, 2.5, 3], // Terminal B coordinates
    });
    // Turn Terminal B to High Crowd Alert with red glow
    get().updateMarkerStatus('terminal-b', 'High Crowd', 'red', 'High');

    // Auto add high severity incident if not already present
    const hasHighCrowdInc = get().incidents.some((i) => i.id === 'inc-sig-sync');
    if (!hasHighCrowdInc) {
      get().addIncident({
        id: 'inc-sig-sync',
        title: 'CV Stream: High crowd density bottleneck detected at Terminal B Concourse',
        type: 'CROWD',
        severity: 'HIGH',
        locationId: 'terminal-b',
        locationName: 'Terminal B - Concourse B2',
        coordinates: [11, 2.5, 3],
        detectedBy: 'Computer Vision Optical Model v4 (Live Stream)',
        confidence: 0.95,
        timestamp: 'Just now',
        affectedAssets: ['hvac-03', 'sec-checkpoint-b', 'cctv-b2'],
        aiAnalysis: 'Continuous AI bounding box clustering detected 312 persons in 40m corridor. Ingress rate 42 people/min.',
        recommendation: 'Open Security Checkpoint C to reduce congestion by 40%.',
        status: 'ACTION_REQUIRED',
      });
    }

    // After 6 seconds, beam settles
    setTimeout(() => {
      set({ isSyncBeamActive: false });
    }, 6000);
  },

  stopSignatureSync: () => set({ isSyncBeamActive: false }),

  triggerCrowdAnomaly: (cameraId, locationId) => {
    // 1. Mark camera feed as warning/critical
    set((state) => ({
      cameraFeeds: state.cameraFeeds.map((cam) =>
        cam.id === cameraId
          ? {
              ...cam,
              status: 'CRITICAL',
              currentCrowdCount: 345,
              currentQueueMinutes: 32,
              detections: [
                ...cam.detections,
                { id: `d-${Date.now()}`, label: 'CROWD', confidence: 0.96, box: [15, 20, 70, 60] },
              ],
            }
          : cam
      ),
    }));

    // 2. Trigger the signature animation beam to the location
    get().startSignatureSync();
  },

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
  activeCascadeImpactNodeId: 'terminal-b-root',
  setActiveCascadeNode: (nodeId) => set({ activeCascadeImpactNodeId: nodeId }),

  copilotMessages: [
    {
      id: 'm-1',
      role: 'assistant',
      content:
        'Welcome to **TwinOS AI Operations Center**. I am connected to the real-time Digital Twin telemetry, computer vision streams, and predictive infrastructure models.\n\nCurrently, **Terminal B** is experiencing high passenger density (+28% above scheduled volume), and **HVAC-03** is running under elevated thermal load.',
      timestamp: '16:25',
      actions: [
        { label: 'View Terminal B in Twin', actionType: 'FOCUS_TWIN', targetId: 'terminal-b' },
        { label: 'Analyze Impact', actionType: 'ANALYZE_IMPACT', targetId: 'terminal-b-root' },
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

  historicalHour: 16, // 4 PM
  setHistoricalHour: (hour) => set({ historicalHour: hour }),

  isSearchOpen: false,
  setSearchOpen: (open) => set({ isSearchOpen: open }),

  isVideoUploadOpen: false,
  setVideoUploadOpen: (open) => set({ isVideoUploadOpen: open }),
}));
