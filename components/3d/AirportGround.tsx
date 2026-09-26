'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';

export function AirportGround() {
  // Runway 1 (09L / 27R) Markings Data
  const r1CenterlineDashes = useMemo(() => {
    const dashes = [];
    for (let x = -85; x <= 85; x += 10) {
      dashes.push(x);
    }
    return dashes;
  }, []);

  // Runway Edge Lights positions
  const r1Lights = useMemo(() => {
    const lights = [];
    for (let x = -95; x <= 95; x += 10) {
      lights.push({ pos: [x, 0.25, -51.5] as [number, number, number], color: '#F8FAFC' });
      lights.push({ pos: [x, 0.25, -38.5] as [number, number, number], color: '#F8FAFC' });
    }
    return lights;
  }, []);

  const r2Lights = useMemo(() => {
    const lights = [];
    for (let x = -90; x <= 90; x += 10) {
      lights.push({ pos: [x, 0.25, 48.5] as [number, number, number], color: '#F8FAFC' });
      lights.push({ pos: [x, 0.25, 61.5] as [number, number, number], color: '#F8FAFC' });
    }
    return lights;
  }, []);

  // Taxiway blue edge lights
  const taxiwayLights = useMemo(() => {
    const lights = [];
    // East-West taxiway spine
    for (let x = -90; x <= 90; x += 12) {
      lights.push([-30, -32], [30, -32], [-30, -18], [30, -18]);
      lights.push([x, 0.2, -32]);
      lights.push([x, 0.2, 38]);
    }
    return lights;
  }, []);

  return (
    <group name="airport-ground-infrastructure">
      {/* 1. Main Airfield Tarmac & Grass Buffer Terrain */}
      <mesh receiveShadow position={[0, -0.05, 0]}>
        <planeGeometry args={[340, 260]} />
        <meshStandardMaterial
          color="#0E131E"
          roughness={0.92}
          metalness={0.08}
        />
      </mesh>

      {/* Subtle Airfield Grid Texture Guide */}
      <gridHelper
        args={[340, 68, '#1E293B', '#111827']}
        position={[0, 0.01, 0]}
      />

      {/* 2. Apron Concrete Pavement for Terminals A, B, C, D & Cargo */}
      {/* Terminal A & B Central Apron */}
      <mesh receiveShadow position={[-12, 0.03, 4]}>
        <planeGeometry args={[84, 52]} />
        <meshStandardMaterial
          color="#182030"
          roughness={0.85}
          metalness={0.12}
        />
      </mesh>

      {/* Terminal C & D East Apron */}
      <mesh receiveShadow position={[38, 0.03, -6]}>
        <planeGeometry args={[78, 64]} />
        <meshStandardMaterial
          color="#182030"
          roughness={0.85}
          metalness={0.12}
        />
      </mesh>

      {/* Cargo Logistics Apron */}
      <mesh receiveShadow position={[48, 0.03, -45]}>
        <planeGeometry args={[56, 36]} />
        <meshStandardMaterial
          color="#1A2234"
          roughness={0.88}
          metalness={0.1}
        />
      </mesh>

      {/* Maintenance Hangar Apron */}
      <mesh receiveShadow position={[-50, 0.03, -25]}>
        <planeGeometry args={[44, 32]} />
        <meshStandardMaterial
          color="#171F2F"
          roughness={0.88}
          metalness={0.1}
        />
      </mesh>

      {/* ========================================================================= */}
      {/* 3. RUNWAY 1 (09L / 27R) - North Main Heavy Runway                         */}
      {/* ========================================================================= */}
      <group position={[-5, 0.06, -45]}>
        {/* Dark Asphalt Runway Body */}
        <mesh receiveShadow>
          <planeGeometry args={[204, 13]} />
          <meshStandardMaterial
            color="#141824"
            roughness={0.88}
            metalness={0.15}
          />
        </mesh>

        {/* Runway Shoulder Blast Pads */}
        <mesh receiveShadow position={[0, -0.01, 0]}>
          <planeGeometry args={[214, 16]} />
          <meshStandardMaterial
            color="#0F1420"
            roughness={0.95}
            metalness={0.05}
          />
        </mesh>

        {/* White Edge Lines */}
        <mesh position={[0, 0.02, -5.8]}>
          <planeGeometry args={[196, 0.45]} />
          <meshBasicMaterial color="#E2E8F0" />
        </mesh>
        <mesh position={[0, 0.02, 5.8]}>
          <planeGeometry args={[196, 0.45]} />
          <meshBasicMaterial color="#E2E8F0" />
        </mesh>

        {/* Centerline Dashes */}
        {r1CenterlineDashes.map((x) => (
          <mesh key={`r1-dash-${x}`} position={[x, 0.02, 0]}>
            <planeGeometry args={[5.5, 0.5]} />
            <meshBasicMaterial color="#F8FAFC" />
          </mesh>
        ))}

        {/* Threshold Piano Keys (West 09L) */}
        {[-4.2, -3.0, -1.8, -0.6, 0.6, 1.8, 3.0, 4.2].map((z, i) => (
          <mesh key={`r1-keys-w-${i}`} position={[-92, 0.02, z]}>
            <planeGeometry args={[6.5, 0.65]} />
            <meshBasicMaterial color="#F8FAFC" />
          </mesh>
        ))}

        {/* Threshold Piano Keys (East 27R) */}
        {[-4.2, -3.0, -1.8, -0.6, 0.6, 1.8, 3.0, 4.2].map((z, i) => (
          <mesh key={`r1-keys-e-${i}`} position={[92, 0.02, z]}>
            <planeGeometry args={[6.5, 0.65]} />
            <meshBasicMaterial color="#F8FAFC" />
          </mesh>
        ))}

        {/* Touchdown Aiming Point Markers */}
        <mesh position={[-68, 0.02, -2.8]}>
          <planeGeometry args={[10, 1.6]} />
          <meshBasicMaterial color="#F8FAFC" />
        </mesh>
        <mesh position={[-68, 0.02, 2.8]}>
          <planeGeometry args={[10, 1.6]} />
          <meshBasicMaterial color="#F8FAFC" />
        </mesh>
        <mesh position={[68, 0.02, -2.8]}>
          <planeGeometry args={[10, 1.6]} />
          <meshBasicMaterial color="#F8FAFC" />
        </mesh>
        <mesh position={[68, 0.02, 2.8]}>
          <planeGeometry args={[10, 1.6]} />
          <meshBasicMaterial color="#F8FAFC" />
        </mesh>

        {/* Green Approach Threshold Light Bars */}
        {[-5, -3, -1, 1, 3, 5].map((z) => (
          <group key={`r1-green-${z}`} position={[-98, 0.2, z]}>
            <mesh>
              <sphereGeometry args={[0.2, 8, 8]} />
              <meshBasicMaterial color="#10B981" />
            </mesh>
            <pointLight color="#10B981" intensity={0.6} distance={6} />
          </group>
        ))}

        {/* Red Overrun End Light Bars */}
        {[-5, -3, -1, 1, 3, 5].map((z) => (
          <group key={`r1-red-${z}`} position={[98, 0.2, z]}>
            <mesh>
              <sphereGeometry args={[0.2, 8, 8]} />
              <meshBasicMaterial color="#EF4444" />
            </mesh>
            <pointLight color="#EF4444" intensity={0.6} distance={6} />
          </group>
        ))}
      </group>

      {/* Runway 1 Edge Lights */}
      {r1Lights.map((l, idx) => (
        <group key={`r1-light-${idx}`} position={l.pos}>
          <mesh>
            <cylinderGeometry args={[0.08, 0.08, 0.35, 6]} />
            <meshBasicMaterial color={l.color} />
          </mesh>
          <pointLight color={l.color} intensity={0.4} distance={4} />
        </group>
      ))}

      {/* ========================================================================= */}
      {/* 4. RUNWAY 2 (09R / 27L) - South Parallel Active Runway                    */}
      {/* ========================================================================= */}
      <group position={[0, 0.06, 55]}>
        {/* Asphalt Body */}
        <mesh receiveShadow>
          <planeGeometry args={[190, 13]} />
          <meshStandardMaterial
            color="#141824"
            roughness={0.88}
            metalness={0.15}
          />
        </mesh>

        {/* Blast Pads */}
        <mesh receiveShadow position={[0, -0.01, 0]}>
          <planeGeometry args={[200, 16]} />
          <meshStandardMaterial
            color="#0F1420"
            roughness={0.95}
            metalness={0.05}
          />
        </mesh>

        {/* White Edge Lines */}
        <mesh position={[0, 0.02, -5.8]}>
          <planeGeometry args={[182, 0.45]} />
          <meshBasicMaterial color="#E2E8F0" />
        </mesh>
        <mesh position={[0, 0.02, 5.8]}>
          <planeGeometry args={[182, 0.45]} />
          <meshBasicMaterial color="#E2E8F0" />
        </mesh>

        {/* Centerline Dashes */}
        {r1CenterlineDashes.slice(1, -1).map((x) => (
          <mesh key={`r2-dash-${x}`} position={[x, 0.02, 0]}>
            <planeGeometry args={[5.5, 0.5]} />
            <meshBasicMaterial color="#F8FAFC" />
          </mesh>
        ))}

        {/* Threshold Piano Keys (09R) */}
        {[-4.2, -3.0, -1.8, -0.6, 0.6, 1.8, 3.0, 4.2].map((z, i) => (
          <mesh key={`r2-keys-w-${i}`} position={[-85, 0.02, z]}>
            <planeGeometry args={[6.5, 0.65]} />
            <meshBasicMaterial color="#F8FAFC" />
          </mesh>
        ))}

        {/* Threshold Piano Keys (27L) */}
        {[-4.2, -3.0, -1.8, -0.6, 0.6, 1.8, 3.0, 4.2].map((z, i) => (
          <mesh key={`r2-keys-e-${i}`} position={[85, 0.02, z]}>
            <planeGeometry args={[6.5, 0.65]} />
            <meshBasicMaterial color="#F8FAFC" />
          </mesh>
        ))}

        {/* Green Approach Lights */}
        {[-5, -3, -1, 1, 3, 5].map((z) => (
          <group key={`r2-green-${z}`} position={[-92, 0.2, z]}>
            <mesh>
              <sphereGeometry args={[0.2, 8, 8]} />
              <meshBasicMaterial color="#10B981" />
            </mesh>
            <pointLight color="#10B981" intensity={0.6} distance={6} />
          </group>
        ))}
      </group>

      {/* Runway 2 Edge Lights */}
      {r2Lights.map((l, idx) => (
        <group key={`r2-light-${idx}`} position={l.pos}>
          <mesh>
            <cylinderGeometry args={[0.08, 0.08, 0.35, 6]} />
            <meshBasicMaterial color={l.color} />
          </mesh>
          <pointLight color={l.color} intensity={0.4} distance={4} />
        </group>
      ))}

      {/* ========================================================================= */}
      {/* 5. TAXIWAY NETWORK (Connecting Runways & Aprons with High-Speed Exits)     */}
      {/* ========================================================================= */}
      {/* Main East-West Taxiway Spine North (Taxiway Alpha) */}
      <mesh receiveShadow position={[0, 0.04, -32]}>
        <planeGeometry args={[200, 7.5]} />
        <meshStandardMaterial color="#131722" roughness={0.88} />
      </mesh>
      {/* Taxiway Alpha Yellow Centerline */}
      <mesh position={[0, 0.05, -32]}>
        <planeGeometry args={[196, 0.3]} />
        <meshBasicMaterial color="#F59E0B" />
      </mesh>

      {/* Main East-West Taxiway Spine South (Taxiway Bravo) */}
      <mesh receiveShadow position={[0, 0.04, 38]}>
        <planeGeometry args={[190, 7.5]} />
        <meshStandardMaterial color="#131722" roughness={0.88} />
      </mesh>
      {/* Taxiway Bravo Yellow Centerline */}
      <mesh position={[0, 0.05, 38]}>
        <planeGeometry args={[186, 0.3]} />
        <meshBasicMaterial color="#F59E0B" />
      </mesh>

      {/* Rapid Exit Turnoffs (Connecting Runway 1 to Taxiway Alpha at 30 deg) */}
      <mesh receiveShadow position={[-42, 0.04, -38.5]} rotation={[0, 0.52, 0]}>
        <planeGeometry args={[16, 7]} />
        <meshStandardMaterial color="#131722" roughness={0.88} />
      </mesh>
      <mesh receiveShadow position={[32, 0.04, -38.5]} rotation={[0, -0.52, 0]}>
        <planeGeometry args={[16, 7]} />
        <meshStandardMaterial color="#131722" roughness={0.88} />
      </mesh>

      {/* Rapid Exit Turnoffs (Connecting Runway 2 to Taxiway Bravo) */}
      <mesh receiveShadow position={[-38, 0.04, 46.5]} rotation={[0, -0.52, 0]}>
        <planeGeometry args={[16, 7]} />
        <meshStandardMaterial color="#131722" roughness={0.88} />
      </mesh>
      <mesh receiveShadow position={[35, 0.04, 46.5]} rotation={[0, 0.52, 0]}>
        <planeGeometry args={[16, 7]} />
        <meshStandardMaterial color="#131722" roughness={0.88} />
      </mesh>

      {/* Transverse Cross-Taxiways linking North to South Apron */}
      <mesh receiveShadow position={[-54, 0.04, 4]}>
        <planeGeometry args={[7, 72]} />
        <meshStandardMaterial color="#131722" roughness={0.88} />
      </mesh>
      <mesh position={[-54, 0.05, 4]}>
        <planeGeometry args={[0.3, 70]} />
        <meshBasicMaterial color="#F59E0B" />
      </mesh>

      <mesh receiveShadow position={[68, 0.04, 4]}>
        <planeGeometry args={[7, 72]} />
        <meshStandardMaterial color="#131722" roughness={0.88} />
      </mesh>
      <mesh position={[68, 0.05, 4]}>
        <planeGeometry args={[0.3, 70]} />
        <meshBasicMaterial color="#F59E0B" />
      </mesh>

      {/* Taxiway Holding Position Bars */}
      {[-42, 32].map((x) => (
        <mesh key={`hold-line-${x}`} position={[x, 0.05, -36.5]}>
          <planeGeometry args={[6.5, 0.5]} />
          <meshBasicMaterial color="#EF4444" />
        </mesh>
      ))}

      {/* Taxiway Elevated Blue Edge Lights */}
      {[-75, -55, -35, -15, 5, 25, 45, 65, 85].map((x) => (
        <React.Fragment key={`taxi-blue-${x}`}>
          <group position={[x, 0.22, -35.8]}>
            <mesh>
              <cylinderGeometry args={[0.06, 0.06, 0.25, 6]} />
              <meshBasicMaterial color="#3B82F6" />
            </mesh>
            <pointLight color="#3B82F6" intensity={0.45} distance={4} />
          </group>
          <group position={[x, 0.22, 34.2]}>
            <mesh>
              <cylinderGeometry args={[0.06, 0.06, 0.25, 6]} />
              <meshBasicMaterial color="#3B82F6" />
            </mesh>
            <pointLight color="#3B82F6" intensity={0.45} distance={4} />
          </group>
        </React.Fragment>
      ))}

      {/* ========================================================================= */}
      {/* 6. AIRPORT ACCESS ROADS & LANDSIDE HIGHWAYS                              */}
      {/* ========================================================================= */}
      {/* Main Perimeter Access Highway */}
      <mesh receiveShadow position={[-15, 0.03, 30]}>
        <planeGeometry args={[110, 6.5]} />
        <meshStandardMaterial color="#111520" roughness={0.9} />
      </mesh>
      <mesh position={[-15, 0.04, 30]}>
        <planeGeometry args={[106, 0.2]} />
        <meshBasicMaterial color="#64748B" />
      </mesh>

      {/* Terminal Drop-off Approach Viaduct Ramp */}
      <mesh receiveShadow position={[-25, 0.04, 16]}>
        <planeGeometry args={[46, 5]} />
        <meshStandardMaterial color="#111520" roughness={0.9} />
      </mesh>

      {/* ========================================================================= */}
      {/* 7. HIGH-MAST APRON FLOODLIGHT TOWERS                                      */}
      {/* ========================================================================= */}
      {[
        { pos: [-34, 0, -14] as [number, number, number], rot: 0.4 },
        { pos: [-16, 0, -14] as [number, number, number], rot: 0.1 },
        { pos: [12, 0, -10] as [number, number, number], rot: -0.3 },
        { pos: [30, 0, -32] as [number, number, number], rot: -0.5 },
        { pos: [45, 0, -6] as [number, number, number], rot: -0.2 },
        { pos: [-8, 0, 18] as [number, number, number], rot: 2.8 },
      ].map((tower, idx) => (
        <group key={`floodlight-${idx}`} position={tower.pos}>
          {/* Base & Pole */}
          <mesh castShadow position={[0, 5, 0]}>
            <cylinderGeometry args={[0.18, 0.35, 10, 8]} />
            <meshStandardMaterial color="#64748B" metalness={0.8} roughness={0.3} />
          </mesh>
          {/* Angled Luminaire Head */}
          <group position={[0, 10, 0]} rotation={[0.4, tower.rot, 0]}>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[1.6, 0.4, 0.8]} />
              <meshStandardMaterial
                color="#0F172A"
                emissive="#FDE68A"
                emissiveIntensity={1.2}
              />
            </mesh>
            {/* Downward Flood Cone Lighting */}
            <spotLight
              position={[0, 0, 0]}
              target-position={[0, -10, 5]}
              color="#FFF1D6"
              intensity={2.2}
              distance={26}
              angle={0.7}
              penumbra={0.6}
            />
          </group>
        </group>
      ))}
    </group>
  );
}
