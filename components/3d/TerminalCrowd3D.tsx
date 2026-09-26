'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useTwinStore } from '@/lib/twin/twinStateStore';
import { CrowdZone } from '@/types/crowd';

interface TerminalCrowd3DProps {
  visible?: boolean;
}

interface MovingAgent {
  pathIndex: number;
  progress: number;
  speed: number;
  color: THREE.Color;
  scale: number;
  offsetY: number;
  lateralOffset: number;
}

interface StaticAgent {
  position: [number, number, number];
  color: THREE.Color;
  scale: number;
  speed: number;
  offset: number;
}

export function TerminalCrowd3D({ visible = true }: TerminalCrowd3DProps) {
  const {
    isCrowdMode,
    selectedCrowdTerminal,
    selectedCrowdZoneId,
    setSelectedCrowdZoneId,
    crowdTerminals,
    isFlowRedirected,
    isLayerPassengers,
    isLayerHeatmap,
  } = useTwinStore();

  const currentTerminal = crowdTerminals[selectedCrowdTerminal] || crowdTerminals['terminal-b'];
  const zones = currentTerminal.zones;

  // Terminal specific zones
  const isTerminalA = selectedCrowdTerminal === 'terminal-a';
  const isTerminalB = selectedCrowdTerminal === 'terminal-b';
  const isTerminalC = selectedCrowdTerminal === 'terminal-c';
  const isTerminalD = selectedCrowdTerminal === 'terminal-d';

  const secZoneB = zones.find((z) => z.id === 'sec-zone-2');
  const secZoneC1 = zones.find((z) => z.id === 'sec-zone-c1');
  const secZoneC2 = zones.find((z) => z.id === 'sec-zone-c2');
  const secZoneA = zones.find((z) => z.id === 'sec-zone-a');
  const secZoneD = zones.find((z) => z.id === 'sec-zone-d');

  // Base coordinate anchor for each terminal
  const baseCoords: [number, number, number] = useMemo(() => {
    switch (selectedCrowdTerminal) {
      case 'terminal-a':
        return [-22, 0, 8];
      case 'terminal-c':
        return [18, 0, 8];
      case 'terminal-d':
        return [36, 0, 14];
      case 'terminal-b':
      default:
        return [-2, 0, 4];
    }
  }, [selectedCrowdTerminal]);

  // Primary InstancedMesh refs
  const walkingMeshRef = useRef<THREE.InstancedMesh>(null);
  const queueMeshRef = useRef<THREE.InstancedMesh>(null);
  const seatedMeshRef = useRef<THREE.InstancedMesh>(null);

  // Dynamic Heatmap Material ref for smooth color lerp
  const secHeatmapMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const c2HeatmapMatRef = useRef<THREE.MeshBasicMaterial>(null);

  // Defined Realistic Airport Walking Paths (Waypoints relative to terminal center)
  const pathways = useMemo(() => {
    if (isTerminalC) {
      // In Terminal C, passengers diverge either to Checkpoint C-West or Checkpoint C-East
      return [
        // Path 0: Entrance -> Regional Check-In Hall C
        [
          new THREE.Vector3(-4.0, 0.45, -9.5),
          new THREE.Vector3(-2.0, 0.45, -7.0),
          new THREE.Vector3(0.0, 0.45, -5.5),
        ],
        // Path 1: Check-in -> Diverted to Checkpoint C-West
        [
          new THREE.Vector3(0.0, 0.45, -4.5),
          new THREE.Vector3(-2.5, 0.45, -2.5),
          new THREE.Vector3(-4.0, 0.45, 0.5),
        ],
        // Path 2: Check-in -> Checkpoint C-East (Overloaded unless redirected)
        [
          new THREE.Vector3(0.0, 0.45, -4.5),
          new THREE.Vector3(2.5, 0.45, -2.5),
          new THREE.Vector3(4.0, 0.45, 0.5),
        ],
        // Path 3: Post Security -> Concourse C
        [
          new THREE.Vector3(0.0, 0.45, 2.2),
          new THREE.Vector3(1.0, 0.45, 4.5),
          new THREE.Vector3(2.0, 0.45, 7.0),
        ],
        // Path 4: Concourse C -> Gate C3 Boarding
        [
          new THREE.Vector3(2.0, 0.45, 7.0),
          new THREE.Vector3(5.0, 0.45, 8.5),
          new THREE.Vector3(7.5, 0.45, 10.5),
        ],
      ];
    }

    // Default paths (Terminal B, A, D)
    return [
      // Path 0: Main Entrance -> Check-In Island West
      [
        new THREE.Vector3(-8.0, 0.45, -9.5),
        new THREE.Vector3(-7.5, 0.45, -7.0),
        new THREE.Vector3(-6.5, 0.45, -5.5),
      ],
      // Path 1: Main Entrance -> Check-In Island East
      [
        new THREE.Vector3(2.0, 0.45, -9.5),
        new THREE.Vector3(2.5, 0.45, -7.0),
        new THREE.Vector3(3.0, 0.45, -5.5),
      ],
      // Path 2: Check-In West -> Security Ingress
      [
        new THREE.Vector3(-5.0, 0.45, -3.5),
        new THREE.Vector3(-3.5, 0.45, -2.5),
        new THREE.Vector3(-2.5, 0.45, -1.5),
      ],
      // Path 3: Check-In East -> Security Ingress
      [
        new THREE.Vector3(1.5, 0.45, -3.5),
        new THREE.Vector3(0.0, 0.45, -2.5),
        new THREE.Vector3(-1.5, 0.45, -1.5),
      ],
      // Path 4: Post-Security Arches -> Central Concourse
      [
        new THREE.Vector3(-2.0, 0.45, 2.2),
        new THREE.Vector3(-1.0, 0.45, 4.0),
        new THREE.Vector3(1.0, 0.45, 6.5),
      ],
      // Path 5: Central Concourse -> Gate Boarding Corridor
      [
        new THREE.Vector3(1.0, 0.45, 6.5),
        new THREE.Vector3(4.5, 0.45, 8.5),
        new THREE.Vector3(7.5, 0.45, 10.5),
      ],
    ];
  }, [isTerminalC]);

  // Moving Passenger Agents Pool (~120 active walkers)
  const walkingAgents = useMemo(() => {
    const agents: MovingAgent[] = [];
    const colorPalette = [
      new THREE.Color('#38BDF8'), // Sky Blue
      new THREE.Color('#A855F7'), // Soft Purple
      new THREE.Color('#F59E0B'), // Warm Amber
      new THREE.Color('#10B981'), // Emerald
      new THREE.Color('#E2E8F0'), // Light Slate
      new THREE.Color('#D946EF'), // Magenta
    ];

    for (let i = 0; i < 110; i++) {
      // In Terminal C, if flow is redirected, steer more agents to Path 1 (Checkpoint C-West)
      let pIdx = i % pathways.length;
      if (isTerminalC && isFlowRedirected && pIdx === 2 && i % 2 === 0) {
        pIdx = 1; // Divert to C-West
      }

      agents.push({
        pathIndex: pIdx,
        progress: (i * 0.083) % 1.0,
        speed: 0.12 + (i % 5) * 0.025,
        color: colorPalette[i % colorPalette.length],
        scale: 0.88 + (i % 4) * 0.04,
        offsetY: 0,
        lateralOffset: ((i % 7) - 3) * 0.18,
      });
    }
    return agents;
  }, [pathways, isTerminalC, isFlowRedirected]);

  // Dynamic Physical Queue Agents (Compresses as lanes open or queue drops)
  const queueLengthTarget = isTerminalC
    ? (isFlowRedirected ? 38 : (secZoneC2?.queueLength || 88))
    : (secZoneB?.queueLength || 184);

  const openLanesCount = isTerminalC
    ? 4
    : (secZoneB?.openLanes || 6);

  const queueAgents = useMemo(() => {
    const list: StaticAgent[] = [];
    const visibleCount = Math.min(80, Math.max(20, Math.round(queueLengthTarget * 0.42)));
    const lanes = isTerminalC ? 2 : 4;
    const countPerLane = Math.ceil(visibleCount / lanes);

    for (let lane = 0; lane < lanes; lane++) {
      const xBase = isTerminalC
        ? (3.0 + lane * 1.8) // Near C-East in Terminal C
        : (-6.5 + lane * 3.0); // Security Zone 2 in Terminal B

      for (let i = 0; i < countPerLane; i++) {
        const spacing = (openLanesCount >= 8 || isFlowRedirected) ? 0.32 : 0.46;
        const zPos = 1.0 - i * spacing;
        const xJitter = Math.sin(i * 1.8 + lane) * 0.12;

        const isHotspot = isTerminalC
          ? (!isFlowRedirected && secZoneC2?.status === 'CRITICAL')
          : (secZoneB?.status === 'CRITICAL');

        const color = isHotspot
          ? new THREE.Color(i < 3 ? '#EF4444' : '#E11D48')
          : new THREE.Color('#F59E0B');

        list.push({
          position: [xBase + xJitter, 0.45, zPos],
          color,
          scale: 0.92,
          speed: 1.0 + (i % 3) * 0.2,
          offset: lane * 1.5 + i * 0.3,
        });
      }
    }
    return list;
  }, [queueLengthTarget, openLanesCount, secZoneB?.status, secZoneC2?.status, isTerminalC, isFlowRedirected]);

  // Seated & Waiting Gate Passengers (~40 agents)
  const seatedAgents = useMemo(() => {
    const list: StaticAgent[] = [];
    for (let i = 0; i < 40; i++) {
      const row = Math.floor(i / 8);
      const col = i % 8;
      const x = 4.5 + col * 0.9;
      const z = 7.5 + row * 1.0;
      list.push({
        position: [x, 0.38, z],
        color: new THREE.Color(i % 2 === 0 ? '#38BDF8' : '#F59E0B'),
        scale: 0.85,
        speed: 0.5,
        offset: i * 0.4,
      });
    }
    return list;
  }, []);

  // Update instance mesh transforms & colors each frame
  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const tempObj = new THREE.Object3D();

    // 1. Animate Walking Passengers along Multi-Segment Paths
    if (walkingMeshRef.current && isLayerPassengers) {
      const mesh = walkingMeshRef.current;
      for (let i = 0; i < walkingAgents.length; i++) {
        const ag = walkingAgents[i];
        ag.progress += ag.speed * delta * 0.45;
        if (ag.progress >= 1.0) ag.progress = 0.0;

        const pts = pathways[ag.pathIndex];
        const segmentCount = pts.length - 1;
        const scaledT = ag.progress * segmentCount;
        const segIdx = Math.min(Math.floor(scaledT), segmentCount - 1);
        const subT = scaledT - segIdx;

        const pStart = pts[segIdx];
        const pEnd = pts[segIdx + 1];

        const posX = pStart.x + (pEnd.x - pStart.x) * subT + ag.lateralOffset;
        const posZ = pStart.z + (pEnd.z - pStart.z) * subT;
        const posY = pStart.y + Math.abs(Math.sin(ag.progress * 40)) * 0.05;

        tempObj.position.set(posX, posY, posZ);
        tempObj.scale.set(ag.scale, ag.scale, ag.scale);
        tempObj.rotation.set(0, 0, 0);
        tempObj.updateMatrix();

        mesh.setMatrixAt(i, tempObj.matrix);
        mesh.setColorAt(i, ag.color);
      }
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    }

    // 2. Animate Queue Passengers
    if (queueMeshRef.current && isLayerPassengers) {
      const mesh = queueMeshRef.current;
      for (let i = 0; i < queueAgents.length; i++) {
        const qa = queueAgents[i];
        const shuffleZ = Math.sin(t * qa.speed + qa.offset) * 0.03;
        const swayY = Math.sin(t * 1.5 + qa.offset) * 0.02;

        tempObj.position.set(qa.position[0], qa.position[1] + swayY, qa.position[2] + shuffleZ);
        tempObj.scale.set(qa.scale, qa.scale, qa.scale);
        tempObj.updateMatrix();

        mesh.setMatrixAt(i, tempObj.matrix);
        mesh.setColorAt(i, qa.color);
      }
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    }

    // 3. Animate Seated Gate Passengers
    if (seatedMeshRef.current && isLayerPassengers) {
      const mesh = seatedMeshRef.current;
      for (let i = 0; i < seatedAgents.length; i++) {
        const sa = seatedAgents[i];
        tempObj.position.set(sa.position[0], sa.position[1], sa.position[2]);
        tempObj.scale.set(sa.scale, sa.scale, sa.scale);
        tempObj.updateMatrix();

        mesh.setMatrixAt(i, tempObj.matrix);
        mesh.setColorAt(i, sa.color);
      }
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    }

    // 4. Smooth Floor Heatmap Color & Pulse
    if (secHeatmapMatRef.current && isLayerHeatmap) {
      const isCritical = isTerminalC
        ? (!isFlowRedirected && secZoneC2?.status === 'CRITICAL')
        : (secZoneB?.status === 'CRITICAL');

      const targetColor = isCritical ? new THREE.Color('#EF4444') : new THREE.Color('#10B981');
      secHeatmapMatRef.current.color.lerp(targetColor, 0.05);
      const pulseOpacity = isCritical ? 0.32 + Math.sin(t * 3.0) * 0.08 : 0.18;
      secHeatmapMatRef.current.opacity = pulseOpacity;
    }
  });

  if (!isCrowdMode) return null;

  return (
    <group position={baseCoords} name="TerminalCrowdEnvironment">
      {/* ===================================================================== */}
      {/* 1. CUTAWAY ARCHITECTURAL FLOOR & BOUNDARIES                           */}
      {/* ===================================================================== */}
      {/* Main Floor Slab */}
      <mesh position={[0, 0.05, 3]} receiveShadow>
        <boxGeometry args={[26, 0.1, 22]} />
        <meshStandardMaterial color="#E2E8F0" roughness={0.7} metalness={0.1} />
      </mesh>

      {/* Grid Floor Lines */}
      <gridHelper args={[26, 26, '#CBD5E1', '#E2E8F0']} position={[0, 0.11, 3]} />

      {/* Cutaway Perimeter Low Boundary Walls */}
      <mesh position={[0, 1.2, -8.0]} castShadow>
        <boxGeometry args={[26, 2.2, 0.3]} />
        <meshStandardMaterial color="#334155" roughness={0.4} metalness={0.6} />
      </mesh>
      <mesh position={[-13, 1.2, 3]} castShadow>
        <boxGeometry args={[0.3, 2.2, 22]} />
        <meshStandardMaterial color="#334155" roughness={0.4} metalness={0.6} />
      </mesh>
      <mesh position={[13, 1.2, 3]} castShadow>
        <boxGeometry args={[0.3, 2.2, 22]} />
        <meshStandardMaterial color="#334155" roughness={0.4} metalness={0.6} />
      </mesh>

      {/* ===================================================================== */}
      {/* 2. OPERATIONAL FIXTURES: CHECK-IN DESKS, SCREENING ARCHES, PODIUMS    */}
      {/* ===================================================================== */}
      {/* Check-In Structure (West Island) */}
      <group position={[-5.5, 0.5, -4.5]}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[7, 1.0, 1.8]} />
          <meshStandardMaterial color="#1E293B" roughness={0.4} />
        </mesh>
        {[-2.5, -1.2, 0.1, 1.4, 2.6].map((x, idx) => (
          <mesh key={`ci-w-mon-${idx}`} position={[x, 1.15, -0.2]}>
            <boxGeometry args={[0.4, 0.3, 0.1]} />
            <meshStandardMaterial color="#38BDF8" emissive="#0284C7" emissiveIntensity={0.6} />
          </mesh>
        ))}
      </group>

      {/* Check-In Structure (East Island) */}
      <group position={[2.5, 0.5, -4.5]}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[7, 1.0, 1.8]} />
          <meshStandardMaterial color="#1E293B" roughness={0.4} />
        </mesh>
        {[-2.5, -1.2, 0.1, 1.4, 2.6].map((x, idx) => (
          <mesh key={`ci-e-mon-${idx}`} position={[x, 1.15, -0.2]}>
            <boxGeometry args={[0.4, 0.3, 0.1]} />
            <meshStandardMaterial color="#38BDF8" emissive="#0284C7" emissiveIntensity={0.6} />
          </mesh>
        ))}
      </group>

      {/* ===================================================================== */}
      {/* 3. TERMINAL C DUAL CHECKPOINTS & REDIRECTION GLOW STREAM              */}
      {/* ===================================================================== */}
      {isTerminalC ? (
        <>
          {/* Checkpoint C-West (Position: [-5, 0.5, 1.5]) */}
          <group position={[-5, 0.5, 1.5]}>
            <mesh position={[0, 0.8, 0]} castShadow>
              <boxGeometry args={[7, 1.6, 0.15]} />
              <meshPhysicalMaterial color="#E2E8F0" transmission={0.75} opacity={0.6} transparent roughness={0.2} />
            </mesh>
            {[-2, 0, 2].map((x, idx) => (
              <group key={`arch-c1-${idx}`} position={[x, 0, 0]}>
                <mesh position={[-0.6, 1.1, 0]}>
                  <boxGeometry args={[0.15, 2.2, 0.4]} />
                  <meshStandardMaterial color="#475569" />
                </mesh>
                <mesh position={[0.6, 1.1, 0]}>
                  <boxGeometry args={[0.15, 2.2, 0.4]} />
                  <meshStandardMaterial color="#475569" />
                </mesh>
                <mesh position={[0, 2.15, 0]}>
                  <boxGeometry args={[1.35, 0.15, 0.4]} />
                  <meshStandardMaterial color="#334155" />
                </mesh>
                <mesh position={[0, 2.25, 0.21]}>
                  <boxGeometry args={[0.4, 0.08, 0.02]} />
                  <meshStandardMaterial color="#10B981" emissive="#10B981" emissiveIntensity={1.4} />
                </mesh>
              </group>
            ))}
          </group>

          {/* Checkpoint C-East (Position: [5, 0.5, 1.5]) */}
          <group position={[5, 0.5, 1.5]}>
            <mesh position={[0, 0.8, 0]} castShadow>
              <boxGeometry args={[7, 1.6, 0.15]} />
              <meshPhysicalMaterial color="#E2E8F0" transmission={0.75} opacity={0.6} transparent roughness={0.2} />
            </mesh>
            {[-2, 0, 2].map((x, idx) => {
              const isOverloaded = !isFlowRedirected;
              return (
                <group key={`arch-c2-${idx}`} position={[x, 0, 0]}>
                  <mesh position={[-0.6, 1.1, 0]}>
                    <boxGeometry args={[0.15, 2.2, 0.4]} />
                    <meshStandardMaterial color="#475569" />
                  </mesh>
                  <mesh position={[0.6, 1.1, 0]}>
                    <boxGeometry args={[0.15, 2.2, 0.4]} />
                    <meshStandardMaterial color="#475569" />
                  </mesh>
                  <mesh position={[0, 2.15, 0]}>
                    <boxGeometry args={[1.35, 0.15, 0.4]} />
                    <meshStandardMaterial color="#334155" />
                  </mesh>
                  <mesh position={[0, 2.25, 0.21]}>
                    <boxGeometry args={[0.4, 0.08, 0.02]} />
                    <meshStandardMaterial
                      color={isOverloaded ? '#EF4444' : '#10B981'}
                      emissive={isOverloaded ? '#EF4444' : '#10B981'}
                      emissiveIntensity={1.4}
                    />
                  </mesh>
                </group>
              );
            })}
          </group>

          {/* Glowing Crowd Flow Diversion Ribbon (When Redirection Active) */}
          {isFlowRedirected && (
            <group position={[-1.5, 0.16, -1.5]}>
              <mesh rotation={[-Math.PI / 2, 0, -0.45]}>
                <planeGeometry args={[7.5, 1.2]} />
                <meshBasicMaterial color="#38BDF8" transparent opacity={0.5} side={THREE.DoubleSide} />
              </mesh>
              <Html position={[0, 1.2, 0]} distanceFactor={34} center>
                <div className="px-3 py-1 rounded-full bg-sky-950/95 border border-sky-400 text-sky-200 text-[10px] font-mono font-bold shadow-[0_0_20px_rgba(56,189,248,0.7)] flex items-center gap-1.5 animate-pulse whitespace-nowrap">
                  <span>🔀 FLOW DIVERTED 25% → C-WEST</span>
                </div>
              </Html>
            </group>
          )}

          {/* Dual Checkpoint Floating Status Badges */}
          <Html position={[-5, 2.5, 1.2]} distanceFactor={34} center>
            <button
              onClick={() => setSelectedCrowdZoneId('sec-zone-c1')}
              className="px-3 py-1 rounded-full border border-emerald-500/60 bg-emerald-950/90 text-emerald-200 text-[10px] font-bold shadow-xl flex items-center gap-1.5 cursor-pointer hover:scale-105 transition-all"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Checkpoint C-West • 40% ({secZoneC1?.queueLength || 16} in queue)</span>
            </button>
          </Html>

          <Html position={[5, 2.5, 1.2]} distanceFactor={34} center>
            <button
              onClick={() => setSelectedCrowdZoneId('sec-zone-c2')}
              className={`px-3 py-1 rounded-full border text-[10px] font-bold shadow-xl flex items-center gap-1.5 cursor-pointer hover:scale-105 transition-all ${
                !isFlowRedirected
                  ? 'border-red-500/80 bg-red-950/95 text-red-200 shadow-[0_0_20px_rgba(239,68,68,0.6)] animate-pulse'
                  : 'border-emerald-500/60 bg-emerald-950/90 text-emerald-200'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${!isFlowRedirected ? 'bg-red-400 animate-ping' : 'bg-emerald-400'}`} />
              <span>
                Checkpoint C-East • {isFlowRedirected ? 'Normalized (38 in queue)' : '97% BOTTLENECK (88 in queue)'}
              </span>
            </button>
          </Html>
        </>
      ) : (
        /* Standard Single Security Screening Arches (Terminal B, A, D) */
        <group position={[-2, 0.5, 1.5]}>
          <mesh position={[0, 0.8, 0]} castShadow>
            <boxGeometry args={[14, 1.6, 0.15]} />
            <meshPhysicalMaterial color="#E2E8F0" transmission={0.75} opacity={0.6} transparent roughness={0.2} />
          </mesh>
          {[-5, -2.5, 0, 2.5, 5].map((x, idx) => {
            const isLaneOpen = idx < openLanesCount;
            return (
              <group key={`arch-${idx}`} position={[x, 0, 0]}>
                <mesh position={[-0.6, 1.1, 0]}>
                  <boxGeometry args={[0.15, 2.2, 0.4]} />
                  <meshStandardMaterial color="#475569" />
                </mesh>
                <mesh position={[0.6, 1.1, 0]}>
                  <boxGeometry args={[0.15, 2.2, 0.4]} />
                  <meshStandardMaterial color="#475569" />
                </mesh>
                <mesh position={[0, 2.15, 0]}>
                  <boxGeometry args={[1.35, 0.15, 0.4]} />
                  <meshStandardMaterial color="#334155" />
                </mesh>
                <mesh position={[0, 2.25, 0.21]}>
                  <boxGeometry args={[0.4, 0.08, 0.02]} />
                  <meshStandardMaterial
                    color={isLaneOpen ? '#10B981' : '#EF4444'}
                    emissive={isLaneOpen ? '#10B981' : '#EF4444'}
                    emissiveIntensity={1.4}
                  />
                </mesh>
              </group>
            );
          })}
        </group>
      )}

      {/* Gate Boarding Podium & Aerobridge Ingress */}
      <group position={[8.5, 0.5, 11]}>
        <mesh position={[0, 0.6, 0]} castShadow>
          <boxGeometry args={[2.5, 1.2, 1.2]} />
          <meshStandardMaterial color="#1E293B" />
        </mesh>
        <mesh position={[0, 1.3, 0]}>
          <boxGeometry args={[1.2, 0.4, 0.1]} />
          <meshStandardMaterial color="#F28C18" emissive="#F28C18" emissiveIntensity={0.8} />
        </mesh>
        <mesh position={[2.5, 1.5, 0]}>
          <boxGeometry args={[2.2, 2.5, 3]} />
          <meshPhysicalMaterial color="#38BDF8" transmission={0.8} opacity={0.5} transparent roughness={0.1} />
        </mesh>
      </group>

      {/* ===================================================================== */}
      {/* 4. DYNAMIC TRANSLUCENT DENSITY HEATMAP DIRECTLY ON FLOOR              */}
      {/* ===================================================================== */}
      {isLayerHeatmap && (
        <>
          {/* Security Zone Primary Heatmap Plane */}
          <mesh
            position={[-2, 0.12, 0.0]}
            rotation={[-Math.PI / 2, 0, 0]}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedCrowdZoneId(isTerminalB ? 'sec-zone-2' : (zones[1]?.id || zones[0]?.id));
            }}
          >
            <planeGeometry args={[13.5, 4.5]} />
            <meshBasicMaterial
              ref={secHeatmapMatRef}
              color="#EF4444"
              transparent
              opacity={0.28}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Check-In Zone Ambient Heatmap */}
          <mesh position={[-5.5, 0.12, -4.5]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[7.5, 3.5]} />
            <meshBasicMaterial color="#A855F7" transparent opacity={0.15} side={THREE.DoubleSide} />
          </mesh>

          {/* Concourse Ambient Heatmap */}
          <mesh position={[6.5, 0.12, 8.5]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[9.5, 5.0]} />
            <meshBasicMaterial color="#38BDF8" transparent opacity={0.12} side={THREE.DoubleSide} />
          </mesh>
        </>
      )}

      {/* ===================================================================== */}
      {/* 5. VISIBLE PASSENGER INSTANCES (GPU ACCELERATED INSTANCED MESHES)      */}
      {/* ===================================================================== */}
      {isLayerPassengers && (
        <>
          {/* 5A. Walking Passengers along realistic airport pathways */}
          <instancedMesh
            ref={walkingMeshRef}
            args={[undefined, undefined, walkingAgents.length]}
            castShadow
          >
            <cylinderGeometry args={[0.18, 0.16, 0.85, 8]} />
            <meshStandardMaterial roughness={0.3} metalness={0.2} />
          </instancedMesh>

          {/* 5B. Dynamic Snaking Physical Queue */}
          <instancedMesh
            ref={queueMeshRef}
            args={[undefined, undefined, queueAgents.length]}
            castShadow
          >
            <cylinderGeometry args={[0.18, 0.16, 0.85, 8]} />
            <meshStandardMaterial roughness={0.3} metalness={0.2} />
          </instancedMesh>

          {/* 5C. Seated & Waiting Gate Passengers */}
          <instancedMesh
            ref={seatedMeshRef}
            args={[undefined, undefined, seatedAgents.length]}
            castShadow
          >
            <cylinderGeometry args={[0.18, 0.16, 0.85, 8]} />
            <meshStandardMaterial roughness={0.3} metalness={0.2} />
          </instancedMesh>
        </>
      )}

      {/* ===================================================================== */}
      {/* 6. FLOATING OPERATIONAL HOTSPOT BADGE FOR TERMINAL B, A, D             */}
      {/* ===================================================================== */}
      {!isTerminalC && (
        <Html position={[-2, 2.5, 1.2]} distanceFactor={34} center>
          <button
            onClick={() => setSelectedCrowdZoneId(isTerminalB ? 'sec-zone-2' : (zones[1]?.id || zones[0]?.id))}
            className={`px-3 py-1.5 rounded-full border backdrop-blur-xl shadow-2xl flex items-center gap-2 cursor-pointer transition-all hover:scale-105 select-none ${
              (secZoneB?.status === 'CRITICAL' || currentTerminal.status === 'CRITICAL')
                ? 'bg-red-950/95 border-red-500 text-white shadow-[0_0_25px_rgba(239,68,68,0.7)] animate-pulse'
                : (secZoneB?.status === 'ATTENTION' || currentTerminal.status === 'ATTENTION')
                ? 'bg-amber-950/90 border-amber-500 text-amber-200'
                : 'bg-emerald-950/90 border-emerald-500 text-emerald-200'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                (secZoneB?.status === 'CRITICAL' || currentTerminal.status === 'CRITICAL')
                  ? 'bg-red-400 animate-ping'
                  : 'bg-emerald-400'
              }`}
            />
            <span className="font-bold text-[11px] tracking-tight whitespace-nowrap">
              {isTerminalB
                ? `Security Zone 2 • ${secZoneB?.densityPercent || 92}% (${secZoneB?.queueLength || 184} in queue)`
                : isTerminalA
                ? `Terminal A Central Security • 38% (${secZoneA?.queueLength || 32} in queue)`
                : `Screening Gate D • 71% (${secZoneD?.queueLength || 58} in queue)`}
            </span>
            {secZoneB?.status === 'CRITICAL' && isTerminalB && (
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-500/40 text-red-100 font-mono font-bold">
                BOTTLENECK +32/m
              </span>
            )}
          </button>
        </Html>
      )}
    </group>
  );
}
