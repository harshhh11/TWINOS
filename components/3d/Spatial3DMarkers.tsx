'use client';

import React from 'react';
import { Html } from '@react-three/drei';
import { AlertTriangle, TrendingUp, Sparkles, Zap, Activity } from 'lucide-react';
import { useTwinStore } from '@/lib/twin/twinStateStore';

export function Spatial3DMarkers() {
  const { markers, selectedMarkerId, focusEntity, activeLayer, isCrowdMode, activeScenarios = [] } = useTwinStore();

  // In crowd cutaway mode, suppress campus-level badges so the 3D interior is completely unobstructed
  if (isCrowdMode) {
    return null;
  }

  // Filter markers according to activeLayer
  const filteredMarkers = markers.filter((marker) => {
    if (activeLayer === 'ALL') return true;
    if (activeLayer === 'BUILDINGS') return marker.type === 'building' || marker.type === 'atc';
    if (activeLayer === 'OPERATIONS') return marker.type === 'runway' || marker.type === 'atc' || marker.occupancyPercent;
    if (activeLayer === 'ENERGY') return marker.id === 'energy-hub' || marker.energyKwh;
    if (activeLayer === 'INCIDENTS') return marker.activeIncidents && marker.activeIncidents > 0;
    if (activeLayer === 'ASSETS') return true;
    if (activeLayer === 'DEPENDENCIES') return true;
    return true;
  });

  return (
    <group name="CampusSpatialMarkers">
      {/* Active Operational Scenarios 3D Overlays */}
      {activeScenarios.map((scen) => {
        return (
          <group
            key={`scen-marker-${scen.id}`}
            position={[scen.locationCoords[0], scen.locationCoords[1] + 5.5, scen.locationCoords[2]]}
          >
            <Html distanceFactor={42} center className="pointer-events-auto select-none">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-950/95 border border-amber-500 text-amber-200 font-bold text-xs shadow-2xl backdrop-blur-md animate-pulse">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span>⚡ SIM: {scen.title}</span>
                <span className="px-1.5 py-0.5 rounded bg-amber-500/30 text-[10px] text-amber-300 uppercase">
                  {scen.severity}
                </span>
              </div>
            </Html>
            {/* 3D ground projection ring */}
            <mesh position={[0, -4.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[2.5, 3.2, 32]} />
              <meshBasicMaterial color={scen.severity === 'CRITICAL' ? '#EF4444' : '#F59E0B'} transparent opacity={0.5} />
            </mesh>
          </group>
        );
      })}
      {filteredMarkers.map((marker) => {
        const isEmergency = marker.id === 'emergency-gate-b14' || marker.type === 'emergency';
        const isSelected = selectedMarkerId === marker.id;
        const isWarning = marker.status === 'Warning' || marker.statusColor === 'orange' || marker.statusColor === 'red';
        const isEmergencyActive = isEmergency && marker.statusColor === 'red';

        return (
          <group key={marker.id} position={[marker.position[0], marker.position[1] + (isEmergency ? 4.2 : 3.4), marker.position[2]]}>
            <Html
              distanceFactor={44}
              center
              className="pointer-events-auto select-none"
              style={{ transform: 'translate3d(0,0,0)' }}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  focusEntity(marker.id, marker.position);
                  if (isEmergency) {
                    useTwinStore.getState().setEmergencyDrawerOpen(true);
                  }
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full backdrop-blur-xl border transition-all cursor-pointer shadow-lg group hover:scale-105 ${
                  isEmergencyActive
                    ? 'bg-red-950/95 border-red-500 text-white font-bold ring-4 ring-red-500/40 shadow-[0_0_25px_rgba(239,68,68,0.7)] animate-pulse'
                    : isSelected
                    ? 'bg-[#F28C18] border-[#F28C18] text-black font-bold ring-2 ring-[#F28C18]/40'
                    : isWarning
                    ? 'bg-[#18110D]/92 border-amber-500/50 text-amber-300 hover:border-amber-400'
                    : 'bg-[#0D1014]/88 border-white/10 text-white/90 hover:border-emerald-500/40'
                }`}
              >
                {/* Status Dot */}
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isEmergencyActive
                      ? 'bg-red-400 animate-ping'
                      : isSelected
                      ? 'bg-black'
                      : isWarning
                      ? 'bg-amber-400 animate-ping'
                      : 'bg-emerald-400'
                  }`}
                />

                {/* Name */}
                <span className="text-[11px] font-semibold tracking-tight whitespace-nowrap">
                  {marker.name}
                </span>

                {/* Subtitle / Metric */}
                <span
                  className={`text-[9px] px-1 py-0.2 rounded font-mono ${
                    isEmergencyActive
                      ? 'bg-red-500/30 text-white font-bold'
                      : isSelected
                      ? 'bg-black/20 text-black'
                      : isWarning
                      ? 'text-amber-400 font-bold'
                      : 'text-white/50'
                  }`}
                >
                  {isEmergencyActive
                    ? 'CRITICAL'
                    : marker.occupancyPercent
                    ? `${marker.occupancyPercent}%`
                    : marker.status}
                </span>

                {isEmergencyActive ? (
                  <span className="text-[10px] text-red-300 font-bold ml-0.5">🚨</span>
                ) : isWarning ? (
                  <AlertTriangle className={`w-3 h-3 ${isSelected ? 'text-black' : 'text-amber-400'}`} />
                ) : null}
              </button>
            </Html>
          </group>
        );
      })}

      {/* Subtle Live Prediction Indicator above Terminal C Checkpoint */}
      {(activeLayer === 'ALL' || activeLayer === 'OPERATIONS' || activeLayer === 'INCIDENTS') && (
        <group position={[18, 7.2, 10]}>
          <Html distanceFactor={48} center className="pointer-events-none select-none">
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#0F172A]/90 backdrop-blur-md border border-sky-500/40 text-[9px] text-sky-300 shadow-lg">
              <TrendingUp className="w-2.5 h-2.5 text-sky-400" />
              <span>Predicted Congestion: 20 min (+18%)</span>
            </div>
          </Html>
        </group>
      )}

      {/* Telemetry Anomaly Indicator above Terminal C Chiller Plant */}
      {(activeLayer === 'ALL' || activeLayer === 'INCIDENTS' || activeLayer === 'ASSETS') && (
        <group position={[21.5, 9.2, 7.5]}>
          <Html distanceFactor={48} center className="pointer-events-none select-none">
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#24120E]/90 backdrop-blur-md border border-rose-500/50 text-[9px] text-rose-300 shadow-lg">
              <Sparkles className="w-2.5 h-2.5 text-rose-400" />
              <span>Thermal Variance: 29.2°C (TT-03)</span>
            </div>
          </Html>
        </group>
      )}

      {/* Energy Telemetry Marker above Central Energy Hub */}
      {(activeLayer === 'ALL' || activeLayer === 'ENERGY') && (
        <group position={[-32, 6.8, 28]}>
          <Html distanceFactor={48} center className="pointer-events-none select-none">
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#0D2418]/90 backdrop-blur-md border border-emerald-500/40 text-[9px] text-emerald-300 shadow-lg">
              <Zap className="w-2.5 h-2.5 text-emerald-400" />
              <span>Energy Output: 24.3 MW (68% Load)</span>
            </div>
          </Html>
        </group>
      )}
    </group>
  );
}
