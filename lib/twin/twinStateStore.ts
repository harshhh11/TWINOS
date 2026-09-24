import { create } from 'zustand';
import {
  Incident,
  Asset,
  DependencyNode,
  SpatialMarker,
  CopilotMessage,
  IncidentStatus,
} from '@/types';
import {
  INITIAL_SPATIAL_MARKERS,
  INITIAL_INCIDENTS,
  INITIAL_ASSETS,
  INITIAL_DEPENDENCY_NODES,
} from '@/lib/data/airportSeedData';

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
    risk?: 'Low' | 'Medium' | 'High'
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

  // Search Modal
  isSearchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
}

export const useTwinStore = create<TwinStoreState>((set, get) => ({
  isSidebarOpen: false,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),

  cameraTarget: null,
  cameraPosition: null,
  selectedMarkerId: null,
  selectedAssetId: null,
  selectedIncidentId: null,

  focusEntity: (id, coords) =>
    set({
      selectedMarkerId: id,
      cameraTarget: coords,
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
}));
