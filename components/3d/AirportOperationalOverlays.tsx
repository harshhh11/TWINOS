'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Line } from '@react-three/drei';
import * as THREE from 'three';
import { useTwinStore } from '@/lib/twin/twinStateStore';
import { AlertTriangle, Clock, Zap, Users, ShieldCheck, Activity } from 'lucide-react';

export function AirportOperationalOverlays() {
  const {
    activeLayers,
    markers,
    selectedMarkerId,
    focusEntity,
    toggleLayer,
  } = useTwinStore();

  const pulseRef = useRef<THREE.Mesh>(null);
  const flowOffsetRef = useRef(0);

  // Pulse animation for anomaly and predictive rings
  useFrame((state, delta) => {
    flowOffsetRef.current = (flowOffsetRef.current + delta * 2) % 1;
    if (pulseRef.current) {
      const scale = 1 + Math.sin(state.clock.getElapsedTime() * 3) * 0.15;
      pulseRef.current.scale.set(scale, 1, scale);
    }
  });

  // 3D Embedded Dependency Spline Pathways connecting Central Energy Facility -> Terminals & Systems
  const dependencySplines = useMemo(() => {
    // 1. Central Energy Substation [-45, 0.5, 35] -> Terminal A [-25, 1.2, 5]
    const curveSubToA = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-45, 0.5, 35),
      new THREE.Vector3(-38, 0.5, 20),
      new THREE.Vector3(-28, 0.8, 10),
      new THREE.Vector3(-25, 1.2, 5),
    ]);

    // 2. Central Energy Substation [-45, 0.5, 35] -> Terminal B [2, 1.2, 10]
    const curveSubToB = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-45, 0.5, 35),
      new THREE.Vector3(-25, 0.5, 30),
      new THREE.Vector3(-10, 0.6, 22),
      new THREE.Vector3(2, 1.2, 10),
    ]);

    // 3. Central Energy Substation [-45, 0.5, 35] -> Terminal C [35, 1.5, -20]
    const curveSubToC = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-45, 0.5, 35),
      new THREE.Vector3(-15, 0.6, 26),
      new THREE.Vector3(15, 0.8, 12),
      new THREE.Vector3(28, 1.0, -6),
      new THREE.Vector3(35, 1.5, -20),
    ]);

    // 4. Terminal C Headhouse [35, 1.5, -20] -> Gate C17 HVAC [40, 2.0, 1]
    const curveCToHVAC = new THREE.CatmullRomCurve3([
      new THREE.Vector3(35, 1.5, -20),
      new THREE.Vector3(36, 1.8, -10),
      new THREE.Vector3(39, 1.8, -3),
      new THREE.Vector3(40, 2.0, 1),
    ]);

    // 5. Central Energy Substation [-45, 0.5, 35] -> ATC Tower [-4, 3.0, -12]
    const curveSubToATC = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-45, 0.5, 35),
      new THREE.Vector3(-30, 0.5, 10),
      new THREE.Vector3(-18, 0.8, -2),
      new THREE.Vector3(-4, 2.0, -12),
    ]);

    return {
      subToA: curveSubToA.getPoints(30),
      subToB: curveSubToB.getPoints(30),
      subToC: curveSubToC.getPoints(36),
      cToHVAC: curveCToHVAC.getPoints(24),
      subToATC: curveSubToATC.getPoints(30),
    };
  }, []);

  const isDependenciesVisible =
    activeLayers.dependencies || selectedMarkerId === 'terminal-c' || selectedMarkerId === 'energy-hub';

  return (
    <group name="airport-operational-overlays">
      {/* ========================================================================= */}
      {/* 1. 3D INFRASTRUCTURE DEPENDENCY NETWORK CONDUITS                          */}
      {/* ========================================================================= */}
      {isDependenciesVisible && (
        <group name="3d-dependency-network">
          {/* Central Energy Substation to Terminal A Line */}
          <Line
            points={dependencySplines.subToA}
            color="#38BDF8"
            lineWidth={2.2}
            dashed
            dashScale={1.5}
            dashSize={2}
            gapSize={1}
            transparent
            opacity={0.85}
          />

          {/* Central Energy Substation to Terminal B Line */}
          <Line
            points={dependencySplines.subToB}
            color="#38BDF8"
            lineWidth={2.2}
            dashed
            dashScale={1.5}
            dashSize={2}
            gapSize={1}
            transparent
            opacity={0.85}
          />

          {/* Central Energy Substation to Terminal C (Highlight Conduit in Amber/Cyan) */}
          <Line
            points={dependencySplines.subToC}
            color="#F59E0B"
            lineWidth={3.2}
            dashed
            dashScale={1.2}
            dashSize={3}
            gapSize={1.2}
            transparent
            opacity={0.95}
          />

          {/* Terminal C to Gate C17 HVAC Chiller Failure Chain */}
          <Line
            points={dependencySplines.cToHVAC}
            color="#EF4444"
            lineWidth={3.4}
            dashed
            dashScale={1.0}
            dashSize={2.5}
            gapSize={1}
            transparent
            opacity={0.95}
          />

          {/* Central Energy Substation to ATC Tower Line */}
          <Line
            points={dependencySplines.subToATC}
            color="#10B981"
            lineWidth={2.0}
            dashed
            dashScale={1.5}
            dashSize={2}
            gapSize={1}
            transparent
            opacity={0.8}
          />

          {/* Glowing Junction Hub Nodes */}
          {[-45, -25, 2, 35, 40, -4].map((x, i) => {
            const z = [35, 5, 10, -20, 1, -12][i];
            const y = [0.8, 1.4, 1.4, 1.8, 2.2, 2.2][i];
            const col = i === 3 || i === 4 ? '#EF4444' : '#38BDF8';
            return (
              <mesh key={i} position={[x, y, z]}>
                <sphereGeometry args={[0.45, 12, 12]} />
                <meshBasicMaterial color={col} />
              </mesh>
            );
          })}
        </group>
      )}

      {/* ========================================================================= */}
      {/* 2. ANOMALY VISUALIZATION (Gate C17 Thermal Variance 29.2°C)                */}
      {/* ========================================================================= */}
      {activeLayers.incidents && (
        <group position={[40, 2.2, 1]}>
          {/* Subtle Ground Status Ring */}
          <mesh
            ref={pulseRef}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -1.9, 0]}
          >
            <ringGeometry args={[2.2, 2.6, 32]} />
            <meshBasicMaterial color="#EF4444" transparent opacity={0.65} />
          </mesh>

          {/* 3D Anomaly Pin */}
          <Html position={[0, 4.2, 0]} center distanceFactor={45} zIndexRange={[100, 0]}>
            <div
              onClick={(e) => {
                e.stopPropagation();
                focusEntity('terminal-c', [35, 4, -22]);
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0F172A]/90 backdrop-blur-md border border-red-500/60 shadow-lg cursor-pointer hover:scale-105 transition-all select-none"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping shrink-0" />
              <div className="flex flex-col text-left leading-none">
                <span className="text-[10px] font-extrabold text-red-400 tracking-tight flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-red-400" />
                  Thermal Variance
                </span>
                <span className="text-[11px] font-bold text-white mt-0.5">
                  29.2°C <span className="text-[9px] text-red-400 font-semibold">(High)</span>
                </span>
              </div>
            </div>
          </Html>
        </group>
      )}

      {/* ========================================================================= */}
      {/* 3. PREDICTION VISUALIZATION (Terminal C Predicted Congestion)             */}
      {/* ========================================================================= */}
      {activeLayers.operations && (
        <group position={[32, 5.8, -14]}>
          <Html center distanceFactor={45} zIndexRange={[100, 0]}>
            <div
              onClick={(e) => {
                e.stopPropagation();
                focusEntity('terminal-c', [35, 4, -22]);
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0B132B]/90 backdrop-blur-md border border-cyan-500/50 shadow-lg cursor-pointer hover:scale-105 transition-all select-none"
            >
              <Clock className="w-3.5 h-3.5 text-cyan-400 animate-spin [animation-duration:12s]" />
              <div className="flex flex-col text-left leading-none">
                <span className="text-[9px] font-semibold text-cyan-400 uppercase tracking-wider">
                  Predicted Congestion
                </span>
                <span className="text-[11px] font-extrabold text-white mt-0.5">
                  20 min <span className="text-[9px] text-slate-300 font-medium">at Security</span>
                </span>
              </div>
            </div>
          </Html>
        </group>
      )}

      {/* ========================================================================= */}
      {/* 4. LIVE OPERATIONAL STATE 3D PINS                                         */}
      {/* ========================================================================= */}
      {activeLayers.assets &&
        markers.map((marker) => {
          const isSelected = selectedMarkerId === marker.id;

          return (
            <group
              key={marker.id}
              position={[marker.position[0], marker.position[1] + 3.8, marker.position[2]]}
            >
              <Html center distanceFactor={48} zIndexRange={[90, 0]}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    focusEntity(marker.id, marker.position);
                  }}
                  className={`flex items-center gap-2 px-2.5 py-1.2 rounded-full backdrop-blur-md border transition-all cursor-pointer select-none group shadow-md ${
                    isSelected
                      ? 'bg-[#F26A21] border-white text-white scale-110 shadow-[0_0_16px_rgba(242,106,33,0.6)] font-bold'
                      : marker.status === 'Attention' || marker.status === 'Warning'
                      ? 'bg-[#1E1B4B]/85 hover:bg-[#1E1B4B] border-amber-500/60 text-amber-200 hover:scale-105'
                      : 'bg-[#0B1220]/80 hover:bg-[#0F172A] border-white/15 text-slate-200 hover:scale-105'
                  }`}
                >
                  {/* Status Indicator Dot */}
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      marker.statusColor === 'red'
                        ? 'bg-red-500 animate-pulse'
                        : marker.statusColor === 'orange'
                        ? 'bg-amber-400 animate-pulse'
                        : 'bg-emerald-400'
                    }`}
                  />

                  {/* Marker Title & Telemetry Metric */}
                  <div className="flex items-center gap-1.5 text-left text-xs whitespace-nowrap">
                    <span className="font-bold text-white tracking-tight text-[11px]">
                      {marker.name}
                    </span>

                    {/* Operational Occupancy / Status Pill */}
                    {marker.occupancyPercent && (
                      <span className="text-[10px] text-slate-300 font-semibold pl-1 border-l border-white/20">
                        {marker.occupancyPercent}% Occupancy
                      </span>
                    )}

                    {marker.energyUsagePercent && (
                      <span className="text-[10px] text-emerald-300 font-semibold pl-1 border-l border-white/20">
                        {marker.energyUsagePercent}% Load
                      </span>
                    )}

                    {!marker.occupancyPercent && !marker.energyUsagePercent && (
                      <span
                        className={`text-[10px] font-semibold pl-1 border-l border-white/20 ${
                          marker.status === 'Attention' || marker.status === 'Warning'
                            ? 'text-amber-300'
                            : 'text-emerald-300'
                        }`}
                      >
                        {marker.status}
                      </span>
                    )}
                  </div>
                </button>
              </Html>
            </group>
          );
        })}
    </group>
  );
}
