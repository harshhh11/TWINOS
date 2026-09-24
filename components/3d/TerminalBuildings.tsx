'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTwinStore } from '@/lib/twin/twinStateStore';

export function TerminalBuildings() {
  const { markers, selectedMarkerId, focusEntity, activeLayers } = useTwinStore();
  const hvacFanRef = useRef<THREE.Group>(null);

  const terminalBMarker = markers.find((m) => m.id === 'terminal-b');
  const isTerminalBAlert = terminalBMarker?.status === 'High Crowd';

  // Rotate HVAC fan blades on roof
  useFrame((_, delta) => {
    if (hvacFanRef.current) {
      hvacFanRef.current.rotation.y += delta * 4;
    }
  });

  if (!activeLayers.buildings) return null;

  return (
    <group>
      {/* ========================================================================= */}
      {/* TERMINAL A (Main Concourse) */}
      {/* ========================================================================= */}
      <group
        position={[-10, 0, 6]}
        onClick={(e) => {
          e.stopPropagation();
          focusEntity('terminal-a', [-10, 2.5, 6]);
        }}
      >
        {/* Main Base Structure */}
        <mesh position={[0, 1.2, 0]} castShadow receiveShadow>
          <boxGeometry args={[18, 2.4, 8]} />
          <meshStandardMaterial
            color="#1E232B"
            roughness={0.4}
            metalness={0.6}
          />
        </mesh>

        {/* Sweeping Aerodynamic Curved Glass Roof Canopy */}
        <mesh position={[0, 2.5, 0.4]} rotation={[0.08, 0, 0]} castShadow>
          <boxGeometry args={[20, 0.35, 9.5]} />
          <meshStandardMaterial
            color="#2A3441"
            roughness={0.2}
            metalness={0.8}
            emissive="#121820"
          />
        </mesh>

        {/* Illuminated Glass Curtain Wall (Facing Apron) */}
        <mesh position={[0, 1.3, -4.01]}>
          <planeGeometry args={[17.6, 2.2]} />
          <meshStandardMaterial
            color="#FFD6A5"
            emissive="#FFB067"
            emissiveIntensity={0.85}
            transparent
            opacity={0.7}
            roughness={0.1}
          />
        </mesh>

        {/* Boarding Jet Bridges (Gate A1, A2, A3, A4) */}
        {[-6, -2, 2, 6].map((xOffset, idx) => (
          <group key={`jetway-a-${idx}`} position={[xOffset, 0.9, -5.2]}>
            {/* Jet bridge corridor */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[1.2, 1.2, 2.5]} />
              <meshStandardMaterial color="#374151" metalness={0.7} roughness={0.3} />
            </mesh>
            {/* Accordion cab */}
            <mesh position={[0, 0, -1.4]}>
              <boxGeometry args={[1.4, 1.3, 0.6]} />
              <meshStandardMaterial color="#1F2937" />
            </mesh>
            {/* Support pylon */}
            <mesh position={[0, -0.6, -0.8]}>
              <cylinderGeometry args={[0.08, 0.08, 0.9]} />
              <meshStandardMaterial color="#4B5563" />
            </mesh>
          </group>
        ))}

        {/* Rooftop Solar Panel Arrays */}
        <mesh position={[-4, 2.75, 0.5]} rotation={[-0.1, 0, 0]}>
          <planeGeometry args={[6, 3]} />
          <meshStandardMaterial color="#1E3A8A" roughness={0.2} metalness={0.9} />
        </mesh>
        <mesh position={[4, 2.75, 0.5]} rotation={[-0.1, 0, 0]}>
          <planeGeometry args={[6, 3]} />
          <meshStandardMaterial color="#1E3A8A" roughness={0.2} metalness={0.9} />
        </mesh>
      </group>

      {/* ========================================================================= */}
      {/* TERMINAL B (Satellite Concourse with Active AI Crowd / Risk Warning) */}
      {/* ========================================================================= */}
      <group
        position={[11, 0, 3]}
        onClick={(e) => {
          e.stopPropagation();
          focusEntity('terminal-b', [11, 2.5, 3]);
        }}
      >
        {/* Terminal B Body */}
        <mesh position={[0, 1.3, 0]} castShadow receiveShadow>
          <boxGeometry args={[16, 2.6, 7]} />
          <meshStandardMaterial
            color={isTerminalBAlert ? '#261718' : '#1C2128'}
            roughness={0.3}
            metalness={0.7}
          />
        </mesh>

        {/* Terminal B Roof Canopy */}
        <mesh position={[0, 2.7, 0]} castShadow>
          <boxGeometry args={[17.5, 0.4, 8.2]} />
          <meshStandardMaterial
            color={isTerminalBAlert ? '#3D1D1E' : '#28313E'}
            roughness={0.2}
            metalness={0.8}
            emissive={isTerminalBAlert ? '#EF4444' : '#0B0D0F'}
            emissiveIntensity={isTerminalBAlert ? 0.35 : 0}
          />
        </mesh>

        {/* Glass Front (Changes to pulsating warning red during High Crowd alert!) */}
        <mesh position={[0, 1.4, -3.51]}>
          <planeGeometry args={[15.6, 2.3]} />
          <meshStandardMaterial
            color={isTerminalBAlert ? '#FF453A' : '#FFD29D'}
            emissive={isTerminalBAlert ? '#EF4444' : '#FFA851'}
            emissiveIntensity={isTerminalBAlert ? 1.6 : 0.75}
            transparent
            opacity={0.85}
            roughness={0.1}
          />
        </mesh>

        {/* Terminal B Gate Jetways */}
        {[-5, -1, 3, 7].map((xOffset, idx) => (
          <group key={`jetway-b-${idx}`} position={[xOffset, 0.9, -4.7]}>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[1.2, 1.2, 2.4]} />
              <meshStandardMaterial color="#374151" metalness={0.7} roughness={0.3} />
            </mesh>
            <mesh position={[0, 0, -1.3]}>
              <boxGeometry args={[1.3, 1.3, 0.6]} />
              <meshStandardMaterial color="#1F2937" />
            </mesh>
          </group>
        ))}

        {/* Rooftop Asset: HVAC UNIT 03 */}
        <group
          position={[2, 3.0, 0.5]}
          onClick={(e) => {
            e.stopPropagation();
            focusEntity('hvac-03', [13, 3.5, 3.5]);
          }}
        >
          {/* HVAC Housing */}
          <mesh position={[0, 0.4, 0]}>
            <boxGeometry args={[1.8, 0.8, 1.4]} />
            <meshStandardMaterial color="#475569" roughness={0.5} />
          </mesh>
          {/* Fan Protective Grille */}
          <mesh position={[0, 0.82, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.2, 0.5, 16]} />
            <meshBasicMaterial color="#0F172A" />
          </mesh>
          {/* Spinning Fan Blades */}
          <group ref={hvacFanRef} position={[0, 0.8, 0]}>
            <mesh rotation={[0, 0, 0]}>
              <boxGeometry args={[0.9, 0.04, 0.15]} />
              <meshBasicMaterial color="#94A3B8" />
            </mesh>
            <mesh rotation={[0, Math.PI / 2, 0]}>
              <boxGeometry args={[0.9, 0.04, 0.15]} />
              <meshBasicMaterial color="#94A3B8" />
            </mesh>
          </group>
          {/* Warning beacon on HVAC if hot */}
          <mesh position={[0.7, 0.9, 0.5]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshBasicMaterial color="#F97316" />
          </mesh>
        </group>
      </group>

      {/* ========================================================================= */}
      {/* CONNECTING SKYBRIDGE (Terminal A <-> Terminal B) */}
      {/* ========================================================================= */}
      <mesh position={[0.5, 1.8, 4.5]}>
        <boxGeometry args={[5, 1.2, 2.2]} />
        <meshStandardMaterial
          color="#1E293B"
          metalness={0.7}
          roughness={0.3}
          transparent
          opacity={0.85}
        />
      </mesh>
      {/* Skybridge Glass Sides */}
      <mesh position={[0.5, 1.8, 3.39]}>
        <planeGeometry args={[4.8, 1.0]} />
        <meshStandardMaterial
          color="#FFD6A5"
          emissive="#FFA851"
          emissiveIntensity={0.6}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* ========================================================================= */}
      {/* PARKING MULTI-LEVEL STRUCTURE */}
      {/* ========================================================================= */}
      <group
        position={[16, 0, 15]}
        onClick={(e) => {
          e.stopPropagation();
          focusEntity('parking', [16, 1.4, 15]);
        }}
      >
        <mesh position={[0, 1.2, 0]} castShadow receiveShadow>
          <boxGeometry args={[10, 2.4, 8]} />
          <meshStandardMaterial color="#1E232A" roughness={0.8} />
        </mesh>
        {/* Floor divider lines */}
        <mesh position={[0, 1.2, 4.02]}>
          <planeGeometry args={[9.8, 0.15]} />
          <meshBasicMaterial color="#F97316" />
        </mesh>
        {/* Roof parking cars representation */}
        {[-3, -1, 1, 3].map((cx, i) => (
          <mesh key={`pcar-${i}`} position={[cx, 2.6, (i % 2 === 0 ? 1 : -1) * 2]}>
            <boxGeometry args={[1.0, 0.4, 1.8]} />
            <meshStandardMaterial color={i % 2 === 0 ? '#38BDF8' : '#E2E8F0'} metalness={0.8} roughness={0.2} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
