'use client';

import React from 'react';
import * as THREE from 'three';
import { useTwinStore } from '@/lib/twin/twinStateStore';

// Helper component for Articulated Jet Bridge
function JetBridge({
  position,
  rotationY = 0,
  gateLabel,
}: {
  position: [number, number, number];
  rotationY?: number;
  gateLabel?: string;
}) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* 1. Terminal Rotunda Fixture */}
      <mesh position={[0, 1.8, 0]} castShadow>
        <cylinderGeometry args={[0.9, 0.9, 2.2, 12]} />
        <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* 2. Telescoping Enclosed Walkway Tunnel */}
      <group position={[0, 1.8, 2.8]}>
        <mesh castShadow>
          <boxGeometry args={[1.5, 1.8, 4.8]} />
          <meshStandardMaterial
            color="#475569"
            metalness={0.6}
            roughness={0.35}
          />
        </mesh>
        {/* Glass Observation Strip along Tunnel */}
        <mesh position={[0.76, 0.1, 0]}>
          <planeGeometry args={[4.4, 0.8]} />
          <meshStandardMaterial
            color="#38BDF8"
            transparent
            opacity={0.6}
            emissive="#0284C7"
            emissiveIntensity={0.3}
          />
        </mesh>
        <mesh position={[-0.76, 0.1, 0]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[4.4, 0.8]} />
          <meshStandardMaterial
            color="#38BDF8"
            transparent
            opacity={0.6}
            emissive="#0284C7"
            emissiveIntensity={0.3}
          />
        </mesh>
      </group>

      {/* 3. Support Pylon & Wheel Carriage */}
      <mesh position={[0, 0.8, 4.4]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 1.6, 8]} />
        <meshStandardMaterial color="#1E293B" metalness={0.8} />
      </mesh>
      <mesh position={[0, 0.2, 4.4]}>
        <boxGeometry args={[1.4, 0.35, 0.6]} />
        <meshStandardMaterial color="#0F172A" />
      </mesh>

      {/* 4. Flexible Accordion Docking Cab (Mating with Aircraft Door) */}
      <mesh position={[0, 1.8, 5.6]} castShadow>
        <boxGeometry args={[1.7, 2.0, 1.1]} />
        <meshStandardMaterial
          color="#0F172A"
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>

      {/* Gate Signage Badge */}
      {gateLabel && (
        <group position={[0, 3.1, 0.8]}>
          <mesh>
            <boxGeometry args={[1.2, 0.45, 0.1]} />
            <meshStandardMaterial color="#0F172A" />
          </mesh>
        </group>
      )}
    </group>
  );
}

// Rooftop HVAC & Mechanical Penthouse Module
function RooftopMechanicals({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* HVAC Chiller Bank Housing */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <boxGeometry args={[3.2, 1.2, 1.8]} />
        <meshStandardMaterial color="#475569" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Dual Exhaust Fans */}
      {[-0.8, 0.8].map((x, i) => (
        <mesh key={i} position={[x, 1.25, 0]}>
          <cylinderGeometry args={[0.45, 0.45, 0.3, 12]} />
          <meshStandardMaterial color="#1E293B" metalness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

export function AirportTerminals() {
  const { selectedMarkerId, focusEntity } = useTwinStore();

  return (
    <group name="airport-campus-terminals">
      {/* ========================================================================= */}
      {/* 1. TERMINAL A (Flagship International Hub)                                */}
      {/* ========================================================================= */}
      <group
        position={[-25, 0, -2]}
        onClick={(e) => {
          e.stopPropagation();
          focusEntity('terminal-a', [-25, 3, -2]);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        {/* Selection Bounding Highlight */}
        {selectedMarkerId === 'terminal-a' && (
          <mesh position={[0, 4.5, 0]}>
            <cylinderGeometry args={[19, 19, 9, 24, 1, true]} />
            <meshBasicMaterial
              color="#F26A21"
              wireframe
              transparent
              opacity={0.45}
            />
          </mesh>
        )}

        {/* Main Headhouse Departures Hall */}
        <mesh position={[0, 3.2, 0]} castShadow receiveShadow>
          <boxGeometry args={[26, 6.4, 14]} />
          <meshStandardMaterial
            color="#1E293B"
            roughness={0.4}
            metalness={0.5}
          />
        </mesh>

        {/* Sweeping Aerodynamic Curved Titanium Wave Roof */}
        <mesh position={[0, 6.6, 0]} castShadow>
          <boxGeometry args={[28, 0.8, 16.5]} />
          <meshStandardMaterial
            color="#E2E8F0"
            metalness={0.75}
            roughness={0.25}
          />
        </mesh>
        {/* Cantilevered Front Overhang Canopy */}
        <mesh position={[0, 6.3, 8.8]} castShadow>
          <boxGeometry args={[26, 0.4, 2.5]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.6} />
        </mesh>

        {/* Double-Height Glazed Curtain Wall with Glowing Warm Interior Glow */}
        <mesh position={[0, 3.4, 7.02]}>
          <planeGeometry args={[24, 5.2]} />
          <meshStandardMaterial
            color="#0284C7"
            transparent
            opacity={0.65}
            emissive="#FFB03B"
            emissiveIntensity={0.65}
            roughness={0.1}
            metalness={0.4}
          />
        </mesh>

        {/* Airside Glass Curtain Wall */}
        <mesh position={[0, 3.4, -7.02]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[24, 5.2]} />
          <meshStandardMaterial
            color="#0284C7"
            transparent
            opacity={0.65}
            emissive="#FFB03B"
            emissiveIntensity={0.6}
            roughness={0.1}
          />
        </mesh>

        {/* Concourse A Pier extending onto Apron */}
        <mesh position={[0, 2.4, -18]} castShadow receiveShadow>
          <boxGeometry args={[8.5, 4.8, 22]} />
          <meshStandardMaterial
            color="#1E293B"
            roughness={0.4}
            metalness={0.5}
          />
        </mesh>
        {/* Concourse A Roof */}
        <mesh position={[0, 4.9, -18]} castShadow>
          <boxGeometry args={[9.5, 0.5, 23]} />
          <meshStandardMaterial color="#E2E8F0" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Concourse A Glazed Side Strips */}
        <mesh position={[-4.26, 2.4, -18]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[21, 3.2]} />
          <meshStandardMaterial
            color="#38BDF8"
            transparent
            opacity={0.6}
            emissive="#FFBA66"
            emissiveIntensity={0.5}
          />
        </mesh>
        <mesh position={[4.26, 2.4, -18]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[21, 3.2]} />
          <meshStandardMaterial
            color="#38BDF8"
            transparent
            opacity={0.6}
            emissive="#FFBA66"
            emissiveIntensity={0.5}
          />
        </mesh>

        {/* Rooftop Mechanicals */}
        <RooftopMechanicals position={[-8, 7.0, -2]} />
        <RooftopMechanicals position={[8, 7.0, -2]} />
        <RooftopMechanicals position={[0, 5.2, -16]} />

        {/* Concourse A Articulated Jet Bridges (Gates A1 to A6) */}
        <JetBridge position={[-4.3, 0, -10]} rotationY={-Math.PI / 2.3} gateLabel="A1" />
        <JetBridge position={[-4.3, 0, -17]} rotationY={-Math.PI / 2.2} gateLabel="A3" />
        <JetBridge position={[-4.3, 0, -24]} rotationY={-Math.PI / 2.3} gateLabel="A5" />

        <JetBridge position={[4.3, 0, -10]} rotationY={Math.PI / 2.3} gateLabel="A2" />
        <JetBridge position={[4.3, 0, -17]} rotationY={Math.PI / 2.2} gateLabel="A4" />
        <JetBridge position={[4.3, 0, -24]} rotationY={Math.PI / 2.3} gateLabel="A6" />
      </group>

      {/* ========================================================================= */}
      {/* 2. TERMINAL B (Domestic Concourse - Arched Vault Architecture)            */}
      {/* ========================================================================= */}
      <group
        position={[2, 0, 10]}
        onClick={(e) => {
          e.stopPropagation();
          focusEntity('terminal-b', [2, 3, 10]);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        {/* Selection Highlight */}
        {selectedMarkerId === 'terminal-b' && (
          <mesh position={[0, 4.5, 0]}>
            <cylinderGeometry args={[18, 18, 9, 24, 1, true]} />
            <meshBasicMaterial
              color="#F26A21"
              wireframe
              transparent
              opacity={0.45}
            />
          </mesh>
        )}

        {/* Central Terminal Body */}
        <mesh position={[0, 2.8, 0]} castShadow receiveShadow>
          <boxGeometry args={[22, 5.6, 13]} />
          <meshStandardMaterial
            color="#1E293B"
            roughness={0.45}
            metalness={0.4}
          />
        </mesh>

        {/* Distinct Arched Barrel-Vaulted Metallic Roof */}
        <mesh position={[0, 5.6, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[4.2, 4.2, 23, 20, 1, false, 0, Math.PI]} />
          <meshStandardMaterial
            color="#94A3B8"
            metalness={0.8}
            roughness={0.25}
          />
        </mesh>

        {/* Glazed Front Atrium */}
        <mesh position={[0, 2.8, 6.52]}>
          <planeGeometry args={[20, 4.6]} />
          <meshStandardMaterial
            color="#0284C7"
            transparent
            opacity={0.7}
            emissive="#F59E0B"
            emissiveIntensity={0.65}
          />
        </mesh>

        {/* Concourse B Angled Extension (Branching Pier) */}
        <mesh position={[0, 2.2, -14]} castShadow receiveShadow>
          <boxGeometry args={[7.5, 4.4, 16]} />
          <meshStandardMaterial
            color="#1E293B"
            roughness={0.4}
            metalness={0.5}
          />
        </mesh>
        <mesh position={[0, 4.5, -14]} castShadow>
          <boxGeometry args={[8.5, 0.4, 17]} />
          <meshStandardMaterial color="#94A3B8" metalness={0.75} />
        </mesh>

        {/* Rooftop Mechanical & Solar Array */}
        <RooftopMechanicals position={[6, 5.8, -1]} />
        <RooftopMechanicals position={[-6, 5.8, -1]} />

        {/* Concourse B Jet Bridges (Gates B1 to B6) */}
        <JetBridge position={[-3.8, 0, -9]} rotationY={-Math.PI / 2.2} gateLabel="B1" />
        <JetBridge position={[-3.8, 0, -16]} rotationY={-Math.PI / 2.2} gateLabel="B3" />
        <JetBridge position={[3.8, 0, -9]} rotationY={Math.PI / 2.2} gateLabel="B2" />
        <JetBridge position={[3.8, 0, -16]} rotationY={Math.PI / 2.2} gateLabel="B4" />
      </group>

      {/* ========================================================================= */}
      {/* 3. TERMINAL C (High-Traffic / Operational Attention Hub - Faceted Roof)   */}
      {/* ========================================================================= */}
      <group
        position={[35, 0, -22]}
        onClick={(e) => {
          e.stopPropagation();
          focusEntity('terminal-c', [35, 4, -22]);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        {/* Selection Highlight */}
        {selectedMarkerId === 'terminal-c' && (
          <mesh position={[0, 4.5, 0]}>
            <cylinderGeometry args={[20, 20, 9, 24, 1, true]} />
            <meshBasicMaterial
              color="#F26A21"
              wireframe
              transparent
              opacity={0.45}
            />
          </mesh>
        )}

        {/* Main Terminal Headhouse */}
        <mesh position={[0, 3.4, 0]} castShadow receiveShadow>
          <boxGeometry args={[25, 6.8, 14]} />
          <meshStandardMaterial
            color="#1E293B"
            roughness={0.4}
            metalness={0.5}
          />
        </mesh>

        {/* Modern Angular Faceted Cantilevered Roof */}
        <mesh position={[0, 7.0, 0]} castShadow>
          <boxGeometry args={[27.5, 0.7, 16]} />
          <meshStandardMaterial
            color="#F1F5F9"
            metalness={0.7}
            roughness={0.2}
          />
        </mesh>

        {/* Glazed Facade with Warm Illumination */}
        <mesh position={[0, 3.4, 7.02]}>
          <planeGeometry args={[23, 5.4]} />
          <meshStandardMaterial
            color="#0284C7"
            transparent
            opacity={0.7}
            emissive="#F59E0B"
            emissiveIntensity={0.75}
          />
        </mesh>

        {/* Finger Concourse C extending onto East Apron */}
        <mesh position={[0, 2.4, 16]} castShadow receiveShadow>
          <boxGeometry args={[7.8, 4.8, 18]} />
          <meshStandardMaterial
            color="#1E293B"
            roughness={0.4}
            metalness={0.5}
          />
        </mesh>
        <mesh position={[0, 4.9, 16]} castShadow>
          <boxGeometry args={[8.8, 0.5, 19]} />
          <meshStandardMaterial color="#E2E8F0" metalness={0.7} />
        </mesh>

        {/* Concourse C Glazing */}
        <mesh position={[-3.92, 2.4, 16]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[17, 3.2]} />
          <meshStandardMaterial
            color="#38BDF8"
            transparent
            opacity={0.65}
            emissive="#FFB03B"
            emissiveIntensity={0.6}
          />
        </mesh>
        <mesh position={[3.92, 2.4, 16]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[17, 3.2]} />
          <meshStandardMaterial
            color="#38BDF8"
            transparent
            opacity={0.65}
            emissive="#FFB03B"
            emissiveIntensity={0.6}
          />
        </mesh>

        {/* HVAC Unit 03 (Active Incident Spot with Elevated Thermal Variance) */}
        <group position={[7.5, 7.4, 0]}>
          <mesh castShadow>
            <boxGeometry args={[3.2, 1.4, 2.0]} />
            <meshStandardMaterial color="#EF4444" metalness={0.4} roughness={0.3} />
          </mesh>
          {/* Subtle Thermal Warning Halo */}
          <pointLight color="#EF4444" intensity={1.2} distance={8} />
        </group>

        {/* Concourse C Jet Bridges (Gates C11 to C18) */}
        <JetBridge position={[-4.0, 0, 10]} rotationY={-Math.PI / 2.2} gateLabel="C11" />
        <JetBridge position={[-4.0, 0, 17]} rotationY={-Math.PI / 2.2} gateLabel="C13" />
        <JetBridge position={[-4.0, 0, 23]} rotationY={-Math.PI / 2.2} gateLabel="C15" />

        <JetBridge position={[4.0, 0, 10]} rotationY={Math.PI / 2.2} gateLabel="C12" />
        <JetBridge position={[4.0, 0, 17]} rotationY={Math.PI / 2.2} gateLabel="C14" />
        {/* Gate C17 (Anomaly Gate with Attention Highlight) */}
        <JetBridge position={[4.0, 0, 23]} rotationY={Math.PI / 2.2} gateLabel="C17" />
      </group>

      {/* ========================================================================= */}
      {/* 4. TERMINAL D (Regional & Trans-Border Terminal - Flat Pavilion Roof)     */}
      {/* ========================================================================= */}
      <group
        position={[40, 0, 12]}
        onClick={(e) => {
          e.stopPropagation();
          focusEntity('terminal-d', [40, 3, 12]);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        {/* Selection Highlight */}
        {selectedMarkerId === 'terminal-d' && (
          <mesh position={[0, 4.0, 0]}>
            <cylinderGeometry args={[16, 16, 8, 24, 1, true]} />
            <meshBasicMaterial
              color="#F26A21"
              wireframe
              transparent
              opacity={0.45}
            />
          </mesh>
        )}

        {/* Terminal Body */}
        <mesh position={[0, 2.8, 0]} castShadow receiveShadow>
          <boxGeometry args={[20, 5.6, 12]} />
          <meshStandardMaterial
            color="#1E293B"
            roughness={0.45}
            metalness={0.4}
          />
        </mesh>

        {/* Floating Flat Cantilevered Roof with Clerestory Monitors */}
        <mesh position={[0, 5.8, 0]} castShadow>
          <boxGeometry args={[22.5, 0.6, 14]} />
          <meshStandardMaterial
            color="#E2E8F0"
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>

        {/* Glazed Facade */}
        <mesh position={[0, 2.8, 6.02]}>
          <planeGeometry args={[18, 4.6]} />
          <meshStandardMaterial
            color="#0284C7"
            transparent
            opacity={0.7}
            emissive="#FFBA66"
            emissiveIntensity={0.65}
          />
        </mesh>

        {/* Concourse D Extension */}
        <mesh position={[-12, 2.2, 0]} castShadow receiveShadow>
          <boxGeometry args={[14, 4.4, 6.5]} />
          <meshStandardMaterial
            color="#1E293B"
            roughness={0.4}
            metalness={0.5}
          />
        </mesh>
        <mesh position={[-12, 4.5, 0]} castShadow>
          <boxGeometry args={[15, 0.4, 7.5]} />
          <meshStandardMaterial color="#E2E8F0" metalness={0.7} />
        </mesh>

        {/* Concourse D Jet Bridges */}
        <JetBridge position={[-8, 0, -3.3]} rotationY={Math.PI} gateLabel="D1" />
        <JetBridge position={[-14, 0, -3.3]} rotationY={Math.PI} gateLabel="D3" />
        <JetBridge position={[-8, 0, 3.3]} rotationY={0} gateLabel="D2" />
        <JetBridge position={[-14, 0, 3.3]} rotationY={0} gateLabel="D4" />
      </group>
    </group>
  );
}
