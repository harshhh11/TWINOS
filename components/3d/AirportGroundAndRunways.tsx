'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';

export function AirportGroundAndRunways() {
  // Runway 1 (09L/27R) Threshold bars (10 bars on each threshold)
  const thresholdBarsRwy1 = useMemo(() => {
    const bars: number[] = [];
    for (let i = -9; i <= 9; i += 2) {
      bars.push(i * 0.9);
    }
    return bars;
  }, []);

  // Runway 2 (09R/27L) Threshold bars (8 bars on each threshold)
  const thresholdBarsRwy2 = useMemo(() => {
    const bars: number[] = [];
    for (let i = -7; i <= 7; i += 2) {
      bars.push(i * 0.9);
    }
    return bars;
  }, []);

  // Runway 1 Centerline Dashes (length = 220)
  const rwy1Centerline = useMemo(() => {
    const dashes: number[] = [];
    for (let z = -95; z <= 95; z += 10) {
      dashes.push(z);
    }
    return dashes;
  }, []);

  // Runway 2 Centerline Dashes (length = 180)
  const rwy2Centerline = useMemo(() => {
    const dashes: number[] = [];
    for (let z = -75; z <= 75; z += 10) {
      dashes.push(z);
    }
    return dashes;
  }, []);

  // Taxiway Alpha Centerline Dashes
  const taxiwayAlphaCenterline = useMemo(() => {
    const dashes: number[] = [];
    for (let z = -85; z <= 85; z += 6) {
      dashes.push(z);
    }
    return dashes;
  }, []);

  // Taxiway Bravo Centerline Dashes
  const taxiwayBravoCenterline = useMemo(() => {
    const dashes: number[] = [];
    for (let z = -70; z <= 70; z += 6) {
      dashes.push(z);
    }
    return dashes;
  }, []);

  // Runway 1 Edge Lights (White/Amber)
  const rwy1EdgeLights = useMemo(() => {
    const lights: [number, number, number, string][] = [];
    const rwyX = -38;
    const width = 13;
    for (let z = -105; z <= 105; z += 9) {
      const isNearEnd = Math.abs(z) > 80;
      const color = isNearEnd ? '#F59E0B' : '#F8FAFC';
      lights.push([rwyX - width / 2, 0.08, z, color]);
      lights.push([rwyX + width / 2, 0.08, z, color]);
    }
    return lights;
  }, []);

  // Runway 2 Edge Lights (White/Amber)
  const rwy2EdgeLights = useMemo(() => {
    const lights: [number, number, number, string][] = [];
    const rwyX = 26;
    const width = 12;
    for (let z = -85; z <= 85; z += 9) {
      const isNearEnd = Math.abs(z) > 65;
      const color = isNearEnd ? '#F59E0B' : '#F8FAFC';
      lights.push([rwyX - width / 2, 0.08, z - 42, color]);
      lights.push([rwyX + width / 2, 0.08, z - 42, color]);
    }
    return lights;
  }, []);

  // Taxiway Edge Lights (Aerodrome Blue)
  const taxiwayEdgeLights = useMemo(() => {
    const lights: [number, number, number][] = [];
    // Taxiway Alpha (x = -24)
    for (let z = -88; z <= 88; z += 8) {
      lights.push([-28.5, 0.08, z]);
      lights.push([-19.5, 0.08, z]);
    }
    // Taxiway Bravo (x = 12)
    for (let z = -75; z <= 75; z += 8) {
      lights.push([7.5, 0.08, z]);
      lights.push([16.5, 0.08, z]);
    }
    // Crossfield Taxiway Charlie (z = -10)
    for (let x = -20; x <= 8; x += 7) {
      lights.push([x, 0.08, -14.5]);
      lights.push([x, 0.08, -5.5]);
    }
    return lights;
  }, []);

  return (
    <group name="CampusMasterplanPavements">
      {/* ========================================================================= */}
      {/* 1. EXPANDED AIRFIELD BASE TERRAIN & LANDSCAPE                             */}
      {/* ========================================================================= */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[380, 320]} />
        <meshStandardMaterial
          color="#0C1015"
          roughness={0.96}
          metalness={0.04}
        />
      </mesh>

      {/* Distant Terrain / Surrounding City Horizon Verge */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.08, 0]} receiveShadow>
        <planeGeometry args={[650, 580]} />
        <meshStandardMaterial
          color="#070A0D"
          roughness={0.98}
          metalness={0.02}
        />
      </mesh>

      {/* ========================================================================= */}
      {/* 2. AIRPORT APRON CONCRETE SLABS (West & East Terminal Concourse Hubs)     */}
      {/* ========================================================================= */}
      {/* West Apron (Terminals A & B) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-12, 0.01, 8]} receiveShadow>
        <planeGeometry args={[56, 110]} />
        <meshStandardMaterial
          color="#181E26"
          roughness={0.84}
          metalness={0.14}
        />
      </mesh>
      <gridHelper
        args={[54, 18, '#2B343F', '#202731']}
        position={[-12, 0.02, 8]}
      />

      {/* East Apron (Terminals C & D and Cargo Hub) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[26, 0.01, 6]} receiveShadow>
        <planeGeometry args={[58, 105]} />
        <meshStandardMaterial
          color="#181E26"
          roughness={0.84}
          metalness={0.14}
        />
      </mesh>
      <gridHelper
        args={[56, 18, '#2B343F', '#202731']}
        position={[26, 0.02, 6]}
      />

      {/* Central Connecting Taxiway & Apron Spine */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[6, 0.012, 8]} receiveShadow>
        <planeGeometry args={[22, 75]} />
        <meshStandardMaterial color="#161C24" roughness={0.85} />
      </mesh>

      {/* ========================================================================= */}
      {/* 3. RUNWAY 01 (09L / 27R) - PRIMARY LONG-HAUL RUNWAY (Length: 220)          */}
      {/* ========================================================================= */}
      <group position={[-38, 0.02, 0]}>
        {/* Main Asphalt Strip */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[14, 220]} />
          <meshStandardMaterial
            color="#11151B"
            roughness={0.88}
            metalness={0.16}
          />
        </mesh>

        {/* Shoulders & Blast Pads */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-8.5, -0.005, 0]}>
          <planeGeometry args={[3, 220]} />
          <meshStandardMaterial color="#151A22" roughness={0.92} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[8.5, -0.005, 0]}>
          <planeGeometry args={[3, 220]} />
          <meshStandardMaterial color="#151A22" roughness={0.92} />
        </mesh>

        {/* Threshold 09L (North) */}
        <group position={[0, 0.03, -100]}>
          {thresholdBarsRwy1.map((x, idx) => (
            <mesh key={`r1-thresh-n-${idx}`} position={[x, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[0.55, 7.5]} />
              <meshBasicMaterial color="#E2E8F0" />
            </mesh>
          ))}
          <mesh position={[0, 0, -4.2]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[11.5, 0.8]} />
            <meshBasicMaterial color="#E2E8F0" />
          </mesh>
        </group>

        {/* Threshold 27R (South) */}
        <group position={[0, 0.03, 100]}>
          {thresholdBarsRwy1.map((x, idx) => (
            <mesh key={`r1-thresh-s-${idx}`} position={[x, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[0.55, 7.5]} />
              <meshBasicMaterial color="#E2E8F0" />
            </mesh>
          ))}
          <mesh position={[0, 0, 4.2]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[11.5, 0.8]} />
            <meshBasicMaterial color="#E2E8F0" />
          </mesh>
        </group>

        {/* Runway 1 Centerline Dashes */}
        {rwy1Centerline.map((z, idx) => (
          <mesh key={`r1-dash-${idx}`} position={[0, 0.03, z]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.5, 5.5]} />
            <meshBasicMaterial color="#E2E8F0" />
          </mesh>
        ))}

        {/* Touchdown Zone Aiming Points */}
        <mesh position={[-3.8, 0.03, -75]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.0, 11]} />
          <meshBasicMaterial color="#E2E8F0" />
        </mesh>
        <mesh position={[3.8, 0.03, -75]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.0, 11]} />
          <meshBasicMaterial color="#E2E8F0" />
        </mesh>
        <mesh position={[-3.8, 0.03, 75]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.0, 11]} />
          <meshBasicMaterial color="#E2E8F0" />
        </mesh>
        <mesh position={[3.8, 0.03, 75]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.0, 11]} />
          <meshBasicMaterial color="#E2E8F0" />
        </mesh>

        {/* Edge Stripes */}
        <mesh position={[-6.2, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.35, 212]} />
          <meshBasicMaterial color="#E2E8F0" />
        </mesh>
        <mesh position={[6.2, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.35, 212]} />
          <meshBasicMaterial color="#E2E8F0" />
        </mesh>
      </group>

      {/* ========================================================================= */}
      {/* 4. RUNWAY 02 (09R / 27L) - PARALLEL SECONDARY RUNWAY (Length: 180)        */}
      {/* ========================================================================= */}
      <group position={[26, 0.02, -42]}>
        {/* Main Asphalt Strip */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[13, 180]} />
          <meshStandardMaterial
            color="#11151B"
            roughness={0.88}
            metalness={0.16}
          />
        </mesh>

        {/* Threshold 09R (North) */}
        <group position={[0, 0.03, -80]}>
          {thresholdBarsRwy2.map((x, idx) => (
            <mesh key={`r2-thresh-n-${idx}`} position={[x, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[0.55, 6.5]} />
              <meshBasicMaterial color="#E2E8F0" />
            </mesh>
          ))}
        </group>

        {/* Threshold 27L (South) */}
        <group position={[0, 0.03, 80]}>
          {thresholdBarsRwy2.map((x, idx) => (
            <mesh key={`r2-thresh-s-${idx}`} position={[x, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[0.55, 6.5]} />
              <meshBasicMaterial color="#E2E8F0" />
            </mesh>
          ))}
        </group>

        {/* Runway 2 Centerline Dashes */}
        {rwy2Centerline.map((z, idx) => (
          <mesh key={`r2-dash-${idx}`} position={[0, 0.03, z]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.45, 5]} />
            <meshBasicMaterial color="#E2E8F0" />
          </mesh>
        ))}

        {/* Edge Stripes */}
        <mesh position={[-5.8, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.3, 172]} />
          <meshBasicMaterial color="#E2E8F0" />
        </mesh>
        <mesh position={[5.8, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.3, 172]} />
          <meshBasicMaterial color="#E2E8F0" />
        </mesh>
      </group>

      {/* ========================================================================= */}
      {/* 5. TAXIWAY NETWORK (Alpha, Bravo, Charlie & High-Speed Exit Turnoffs)     */}
      {/* ========================================================================= */}
      {/* Taxiway Alpha (Parallel West Runway 1) */}
      <group position={[-24, 0.02, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[9, 190]} />
          <meshStandardMaterial color="#14181F" roughness={0.86} metalness={0.12} />
        </mesh>
        {taxiwayAlphaCenterline.map((z, idx) => (
          <mesh key={`twy-a-dash-${idx}`} position={[0, 0.03, z]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.28, 4.5]} />
            <meshBasicMaterial color="#EAB308" />
          </mesh>
        ))}
      </group>

      {/* Taxiway Bravo (Parallel East Runway 2) */}
      <group position={[12, 0.02, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[9, 160]} />
          <meshStandardMaterial color="#14181F" roughness={0.86} metalness={0.12} />
        </mesh>
        {taxiwayBravoCenterline.map((z, idx) => (
          <mesh key={`twy-b-dash-${idx}`} position={[0, 0.03, z]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.28, 4.5]} />
            <meshBasicMaterial color="#EAB308" />
          </mesh>
        ))}
      </group>

      {/* Crossfield Taxiway Charlie */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-6, 0.018, -10]}>
        <planeGeometry args={[30, 9]} />
        <meshStandardMaterial color="#14181F" roughness={0.86} />
      </mesh>

      {/* High-speed Runway 1 Exits */}
      {[-55, 0, 55].map((z, idx) => (
        <mesh
          key={`r1-conn-${idx}`}
          position={[-31, 0.015, z]}
          rotation={[-Math.PI / 2, 0, idx === 0 ? 0.38 : idx === 2 ? -0.38 : 0]}
        >
          <planeGeometry args={[7, 12]} />
          <meshStandardMaterial color="#14181F" roughness={0.88} />
        </mesh>
      ))}

      {/* High-speed Runway 2 Exits */}
      {[-70, -42, -15].map((z, idx) => (
        <mesh
          key={`r2-conn-${idx}`}
          position={[19, 0.015, z]}
          rotation={[-Math.PI / 2, 0, idx === 0 ? 0.38 : idx === 2 ? -0.38 : 0]}
        >
          <planeGeometry args={[7, 12]} />
          <meshStandardMaterial color="#14181F" roughness={0.88} />
        </mesh>
      ))}

      {/* ========================================================================= */}
      {/* 6. AIRCRAFT PARKING STANDS & LEAD-IN MARKINGS (GATES A, B, C, D)          */}
      {/* ========================================================================= */}
      {/* Terminal A Gates (Stands A1-A4) */}
      {[-6, 0, 6, 12].map((z, idx) => (
        <group key={`stand-t1-${idx}`} position={[-18, 0.025, z]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
            <planeGeometry args={[0.22, 8]} />
            <meshBasicMaterial color="#EAB308" />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -3.8]}>
            <planeGeometry args={[3.2, 0.25]} />
            <meshBasicMaterial color="#EF4444" />
          </mesh>
        </group>
      ))}

      {/* Terminal B Gates (Stands B1-B4) */}
      {[-8, -2, 4, 10].map((z, idx) => (
        <group key={`stand-t2-${idx}`} position={[-6, 0.025, z]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
            <planeGeometry args={[0.22, 8]} />
            <meshBasicMaterial color="#EAB308" />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -3.8]}>
            <planeGeometry args={[3.2, 0.25]} />
            <meshBasicMaterial color="#EF4444" />
          </mesh>
        </group>
      ))}

      {/* Terminal C Gates (Stands C1-C5) */}
      {[-8, -2, 4, 10, 16].map((z, idx) => (
        <group key={`stand-t3-${idx}`} position={[14, 0.025, z]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
            <planeGeometry args={[0.22, 8]} />
            <meshBasicMaterial color="#EAB308" />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -3.8]}>
            <planeGeometry args={[3.2, 0.25]} />
            <meshBasicMaterial color="#EF4444" />
          </mesh>
        </group>
      ))}

      {/* Terminal D Gates (Stands D1-D3) */}
      {[-4, 2, 8].map((z, idx) => (
        <group key={`stand-t4-${idx}`} position={[30, 0.025, z + 6]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
            <planeGeometry args={[0.22, 8]} />
            <meshBasicMaterial color="#EAB308" />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -3.8]}>
            <planeGeometry args={[3.2, 0.25]} />
            <meshBasicMaterial color="#EF4444" />
          </mesh>
        </group>
      ))}

      {/* ========================================================================= */}
      {/* 7. LANDSIDE HIGHWAYS, VIADUCTS & PERIMETER SERVICE ROADS                  */}
      {/* ========================================================================= */}
      {/* Main Terminal Access Loop Road */}
      <mesh position={[0, 0.015, 38]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[140, 8]} />
        <meshStandardMaterial color="#1B2028" roughness={0.92} />
      </mesh>
      {/* Terminal Connector Loops */}
      {[-22, -2, 18, 36].map((x, idx) => (
        <mesh key={`viaduct-${idx}`} position={[x, 0.015, 26]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[6, 18]} />
          <meshStandardMaterial color="#1B2028" roughness={0.92} />
        </mesh>
      ))}

      {/* ========================================================================= */}
      {/* 8. RUNWAY & TAXIWAY NAVIGATION LIGHTING                                   */}
      {/* ========================================================================= */}
      {/* Runway 1 Edge Lights */}
      {rwy1EdgeLights.map(([x, y, z, color], idx) => (
        <mesh key={`r1-light-${idx}`} position={[x, y, z]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshBasicMaterial color={color} />
        </mesh>
      ))}

      {/* Runway 2 Edge Lights */}
      {rwy2EdgeLights.map(([x, y, z, color], idx) => (
        <mesh key={`r2-light-${idx}`} position={[x, y, z]}>
          <sphereGeometry args={[0.09, 8, 8]} />
          <meshBasicMaterial color={color} />
        </mesh>
      ))}

      {/* Runway Threshold Green & End Red Lights */}
      {[-5, -3, -1, 1, 3, 5].map((offset, idx) => (
        <group key={`thresh-r1-${idx}`}>
          <mesh position={[-38 + offset, 0.1, -107]}>
            <sphereGeometry args={[0.13, 8, 8]} />
            <meshBasicMaterial color="#10B981" />
          </mesh>
          <mesh position={[-38 + offset, 0.1, 107]}>
            <sphereGeometry args={[0.13, 8, 8]} />
            <meshBasicMaterial color="#EF4444" />
          </mesh>
          <mesh position={[26 + offset, 0.1, -127]}>
            <sphereGeometry args={[0.12, 8, 8]} />
            <meshBasicMaterial color="#10B981" />
          </mesh>
          <mesh position={[26 + offset, 0.1, 43]}>
            <sphereGeometry args={[0.12, 8, 8]} />
            <meshBasicMaterial color="#EF4444" />
          </mesh>
        </group>
      ))}

      {/* Taxiway Blue Edge Lights */}
      {taxiwayEdgeLights.map(([x, y, z], idx) => (
        <mesh key={`twy-edge-light-${idx}`} position={[x, y, z]}>
          <sphereGeometry args={[0.075, 6, 6]} />
          <meshBasicMaterial color="#38BDF8" />
        </mesh>
      ))}
    </group>
  );
}
