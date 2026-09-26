'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTwinStore } from '@/lib/twin/twinStateStore';

export function AirportBuildings() {
  const { selectedMarkerId, focusEntity, isCrowdMode, selectedCrowdTerminal } = useTwinStore();
  const isTerminalACutaway = isCrowdMode && selectedCrowdTerminal === 'terminal-a';
  const isTerminalBCutaway = isCrowdMode && (selectedCrowdTerminal === 'terminal-b' || !selectedCrowdTerminal);
  const isTerminalCCutaway = isCrowdMode && selectedCrowdTerminal === 'terminal-c';
  const isTerminalDCutaway = isCrowdMode && selectedCrowdTerminal === 'terminal-d';

  const radarRef = useRef<THREE.Group>(null);
  const beaconRef = useRef<THREE.Mesh>(null);
  const hvacFanRef = useRef<THREE.Group>(null);
  const energyFanRef = useRef<THREE.Group>(null);

  // Animate rotating radar, flashing obstruction beacons, and chiller ventilator fans
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (radarRef.current) {
      radarRef.current.rotation.y = t * 1.8;
    }
    if (beaconRef.current) {
      const intensity = Math.sin(t * 4.5) > 0.3 ? 1.0 : 0.05;
      (beaconRef.current.material as THREE.MeshBasicMaterial).opacity = intensity;
    }
    if (hvacFanRef.current) {
      hvacFanRef.current.rotation.y = t * 6.5;
    }
    if (energyFanRef.current) {
      energyFanRef.current.rotation.y = t * 5.0;
    }
  });

  return (
    <group name="CampusMasterplanBuildings">
      {/* ========================================================================= */}
      {/* 1. TERMINAL A: International Flagship Hub & Dual-Pier Concourse           */}
      {/* ========================================================================= */}
      <group
        position={[-22, 0, 8]}
        onClick={(e) => {
          e.stopPropagation();
          focusEntity('terminal-a', [-22, 3.2, 8]);
        }}
      >
        {/* Main Central Processor Hall & Wave Roof */}
        {!isTerminalACutaway && (
          <>
            <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
              <boxGeometry args={[16, 5.0, 9]} />
              <meshStandardMaterial
                color={selectedMarkerId === 'terminal-a' ? '#1E293B' : '#151A22'}
                roughness={0.4}
                metalness={0.6}
              />
            </mesh>

            {/* Curved / Wave Architectural Canopy Roof */}
            <mesh position={[0, 5.2, 0.4]} rotation={[0.04, 0, 0]} castShadow receiveShadow>
              <boxGeometry args={[17.5, 0.5, 10.5]} />
              <meshStandardMaterial color="#2B3644" roughness={0.28} metalness={0.75} />
            </mesh>

            {/* Rooftop Skylight Strips */}
            {[-5, -2, 2, 5].map((x, idx) => (
              <mesh key={`t1-skylight-${idx}`} position={[x, 5.5, 0.4]}>
                <boxGeometry args={[1.2, 0.15, 7.5]} />
                <meshStandardMaterial
                  color="#38BDF8"
                  emissive="#0284C7"
                  emissiveIntensity={0.3}
                  roughness={0.1}
                  transparent
                  opacity={0.85}
                />
              </mesh>
            ))}
          </>
        )}

        {/* Tinted Glass Curtain Wall (Airside) */}
        <mesh position={[0, 2.5, -4.55]}>
          <planeGeometry args={[15.6, 4.4]} />
          <meshPhysicalMaterial
            color="#0284C7"
            emissive="#0369A1"
            emissiveIntensity={0.35}
            roughness={0.1}
            metalness={0.2}
            transmission={0.6}
            transparent
            opacity={0.88}
          />
        </mesh>

        {/* North Concourse Pier Extension (Gates A1, A2) */}
        <mesh position={[-6, 1.8, -10]} castShadow receiveShadow>
          <boxGeometry args={[5.5, 3.6, 12]} />
          <meshStandardMaterial color="#151A22" roughness={0.4} metalness={0.6} />
        </mesh>
        <mesh position={[-6, 3.7, -10]} castShadow>
          <boxGeometry args={[6.2, 0.35, 12.6]} />
          <meshStandardMaterial color="#2B3644" roughness={0.3} metalness={0.7} />
        </mesh>

        {/* Aerobridges (Gates A1 - A4) */}
        {[-14, -8, -2, 4].map((z, idx) => (
          <group key={`bridge-t1-${idx}`} position={[-9.2, 1.8, z]}>
            <mesh position={[-1.2, 0, 0]} rotation={[0, -0.2, 0]} castShadow>
              <boxGeometry args={[2.8, 1.2, 1.2]} />
              <meshStandardMaterial color="#CBD5E1" roughness={0.5} />
            </mesh>
            <mesh position={[-2.6, -0.2, 0]} castShadow>
              <boxGeometry args={[1.2, 1.4, 1.4]} />
              <meshStandardMaterial color="#475569" roughness={0.6} />
            </mesh>
          </group>
        ))}

        {/* Landside Passenger Drop-off Canopy */}
        <mesh position={[0, 1.5, 6.0]} castShadow>
          <boxGeometry args={[14, 0.28, 3.2]} />
          <meshStandardMaterial color="#334155" metalness={0.8} />
        </mesh>
      </group>

      {/* ========================================================================= */}
      {/* 2. TERMINAL B: Domestic Concourse Pier                                    */}
      {/* ========================================================================= */}
      <group
        position={[-2, 0, 4]}
        onClick={(e) => {
          e.stopPropagation();
          focusEntity('terminal-b', [-2, 3.0, 4]);
        }}
      >
        {/* Main Terminal B Structure (Hidden in Crowd Cutaway Mode) */}
        {!isTerminalBCutaway && (
          <>
            <mesh position={[0, 2.2, 0]} castShadow receiveShadow>
              <boxGeometry args={[13, 4.4, 8]} />
              <meshStandardMaterial
                color={selectedMarkerId === 'terminal-b' ? '#1E293B' : '#151A22'}
                roughness={0.4}
                metalness={0.6}
              />
            </mesh>

            {/* Angular Roof */}
            <mesh position={[0, 4.5, -0.2]} rotation={[-0.03, 0, 0]} castShadow receiveShadow>
              <boxGeometry args={[14.2, 0.45, 9.0]} />
              <meshStandardMaterial color="#2B3644" roughness={0.3} metalness={0.7} />
            </mesh>
          </>
        )}

        {/* Glass Facade */}
        <mesh position={[0, 2.2, -4.05]}>
          <planeGeometry args={[12.6, 3.8]} />
          <meshPhysicalMaterial
            color="#0284C7"
            emissive="#0369A1"
            emissiveIntensity={0.3}
            roughness={0.1}
            transparent
            opacity={0.85}
          />
        </mesh>

        {/* Aerobridges (Gates B1 - B4) */}
        {[-3, 3].map((x, idx) => (
          <group key={`bridge-t2-${idx}`} position={[x, 1.8, -5.2]}>
            <mesh position={[0, 0, -1.2]} rotation={[0.15, 0, 0]} castShadow>
              <boxGeometry args={[1.2, 1.2, 2.6]} />
              <meshStandardMaterial color="#CBD5E1" roughness={0.5} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ========================================================================= */}
      {/* 3. TERMINAL C: Transcontinental Star Concourse (Active Anomaly Alert)      */}
      {/* ========================================================================= */}
      <group
        position={[18, 0, 8]}
        onClick={(e) => {
          e.stopPropagation();
          focusEntity('terminal-c', [18, 3.2, 8]);
        }}
      >
        {/* Central Y-Processor Building & Roof */}
        {!isTerminalCCutaway && (
          <>
            <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
              <boxGeometry args={[15, 5.0, 9]} />
              <meshStandardMaterial
                color={selectedMarkerId === 'terminal-c' ? '#2A1F1D' : '#151A22'}
                roughness={0.4}
                metalness={0.6}
              />
            </mesh>

            {/* Modern Cantilevered Aerodynamic Wing Roof */}
            <mesh position={[0, 5.2, -0.3]} rotation={[-0.04, 0, 0.02]} castShadow receiveShadow>
              <boxGeometry args={[16.5, 0.5, 10.2]} />
              <meshStandardMaterial color="#2B3644" roughness={0.3} metalness={0.7} />
            </mesh>

            {/* Rooftop Solar Array */}
            <group position={[-3.5, 5.5, 0]}>
              {[-1.8, 0, 1.8].map((z, idx) => (
                <mesh key={`solar-t3-${idx}`} position={[0, 0, z]} rotation={[-0.15, 0, 0]}>
                  <boxGeometry args={[5.2, 0.08, 1.2]} />
                  <meshStandardMaterial color="#0F172A" metalness={0.9} roughness={0.1} />
                </mesh>
              ))}
            </group>

            {/* Rooftop HVAC Chiller Plant (Linked to Active Incident TT-03) */}
            <group position={[3.5, 5.6, -0.5]}>
              <mesh castShadow>
                <boxGeometry args={[2.8, 0.95, 2.5]} />
                <meshStandardMaterial color="#475569" roughness={0.6} metalness={0.5} />
              </mesh>
              {/* Chiller Exhaust Fans */}
              <group ref={hvacFanRef} position={[0, 0.5, 0]}>
                <mesh rotation={[-Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.65, 0.65, 0.12, 12]} />
                  <meshStandardMaterial color="#1E293B" metalness={0.8} />
                </mesh>
              </group>
              {/* Anomaly Thermal Pulse Status Ring */}
              <mesh position={[0, 0.62, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[1.5, 1.7, 24]} />
                <meshBasicMaterial color="#F28C18" side={THREE.DoubleSide} />
              </mesh>
            </group>
          </>
        )}

        {/* Tinted Panoramic Curtain Wall */}
        <mesh position={[0, 2.5, -4.55]}>
          <planeGeometry args={[14.6, 4.4]} />
          <meshPhysicalMaterial
            color="#0284C7"
            emissive="#0369A1"
            emissiveIntensity={0.35}
            roughness={0.1}
            transparent
            opacity={0.88}
          />
        </mesh>

        {/* Aerobridges (Gates C1 - C5) */}
        {[-12, -6, 0, 6, 12].map((z, idx) => (
          <group key={`bridge-t3-${idx}`} position={[8.5, 1.8, z]}>
            <mesh position={[1.2, 0, 0]} rotation={[0, 0.2, 0]} castShadow>
              <boxGeometry args={[2.6, 1.2, 1.2]} />
              <meshStandardMaterial color="#CBD5E1" roughness={0.5} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ========================================================================= */}
      {/* 4. TERMINAL D: Regional / Low-Cost Concourse & Solar Canopy               */}
      {/* ========================================================================= */}
      <group
        position={[36, 0, 14]}
        onClick={(e) => {
          e.stopPropagation();
          focusEntity('terminal-d', [36, 2.8, 14]);
        }}
      >
        {/* Terminal D Structure & Roof */}
        {!isTerminalDCutaway && (
          <>
            <mesh position={[0, 2.0, 0]} castShadow receiveShadow>
              <boxGeometry args={[12, 4.0, 7]} />
              <meshStandardMaterial
                color={selectedMarkerId === 'terminal-d' ? '#1E293B' : '#151A22'}
                roughness={0.4}
                metalness={0.6}
              />
            </mesh>
            {/* Solar Canopy Roof */}
            <mesh position={[0, 4.1, 0]} castShadow>
              <boxGeometry args={[13.2, 0.35, 8.0]} />
              <meshStandardMaterial color="#1E293B" metalness={0.8} roughness={0.2} />
            </mesh>
          </>
        )}
        {/* Glass Entrance */}
        <mesh position={[0, 2.0, -3.55]}>
          <planeGeometry args={[11.6, 3.4]} />
          <meshPhysicalMaterial
            color="#0284C7"
            emissive="#0369A1"
            emissiveIntensity={0.25}
            roughness={0.1}
            transparent
            opacity={0.85}
          />
        </mesh>
        {/* Aerobridges (Gates D1 - D3) */}
        {[-3, 3].map((x, idx) => (
          <group key={`bridge-t4-${idx}`} position={[x, 1.8, -4.5]}>
            <mesh position={[0, 0, -1.0]} rotation={[0.1, 0, 0]} castShadow>
              <boxGeometry args={[1.2, 1.2, 2.2]} />
              <meshStandardMaterial color="#CBD5E1" roughness={0.5} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ========================================================================= */}
      {/* 5. AIRPORT CONTROL TOWER (ATC Tower & Primary Radar Facility)             */}
      {/* ========================================================================= */}
      <group
        position={[4, 0, -16]}
        onClick={(e) => {
          e.stopPropagation();
          focusEntity('atc-tower', [4, 10.5, -16]);
        }}
      >
        {/* Concrete Foundation Base */}
        <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[3.2, 4.0, 1.6, 12]} />
          <meshStandardMaterial color="#1E293B" roughness={0.7} />
        </mesh>

        {/* Tall Architectural Tapering Tower Shaft (Height: 18) */}
        <mesh position={[0, 7.5, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.2, 2.2, 12.0, 12]} />
          <meshStandardMaterial color="#334155" roughness={0.5} metalness={0.3} />
        </mesh>

        {/* Cantilevered Cab Support Collar */}
        <mesh position={[0, 14.0, 0]} castShadow>
          <cylinderGeometry args={[3.8, 1.4, 1.4, 12]} />
          <meshStandardMaterial color="#1E293B" metalness={0.6} />
        </mesh>

        {/* 360° Panoramic Tinted Glass Observation Cab */}
        <mesh position={[0, 15.2, 0]}>
          <cylinderGeometry args={[3.6, 3.6, 1.6, 16]} />
          <meshPhysicalMaterial
            color="#38BDF8"
            emissive="#0284C7"
            emissiveIntensity={0.4}
            roughness={0.08}
            metalness={0.1}
            transmission={0.7}
            transparent
            opacity={0.9}
          />
        </mesh>

        {/* Cab Roof */}
        <mesh position={[0, 16.2, 0]} castShadow>
          <cylinderGeometry args={[4.0, 3.7, 0.45, 16]} />
          <meshStandardMaterial color="#0F172A" metalness={0.8} />
        </mesh>

        {/* Communications Antenna Mast */}
        <mesh position={[0, 18.0, 0]}>
          <cylinderGeometry args={[0.09, 0.14, 3.2, 8]} />
          <meshStandardMaterial color="#E2E8F0" metalness={0.9} />
        </mesh>

        {/* Flashing Red FAA Hazard Obstruction Beacon */}
        <mesh ref={beaconRef} position={[0, 19.8, 0]}>
          <sphereGeometry args={[0.24, 12, 12]} />
          <meshBasicMaterial color="#EF4444" transparent opacity={1.0} />
        </mesh>

        {/* Rotating Primary Radar Scanner Dome */}
        <group ref={radarRef} position={[0, 16.8, 0]}>
          <mesh position={[0, 0.5, 0]}>
            <cylinderGeometry args={[0.18, 0.18, 0.6, 8]} />
            <meshStandardMaterial color="#64748B" />
          </mesh>
          <mesh position={[0, 0.8, 0.5]} rotation={[0.2, 0, 0]}>
            <boxGeometry args={[1.8, 0.5, 0.12]} />
            <meshStandardMaterial color="#F8FAFC" metalness={0.7} roughness={0.3} />
          </mesh>
        </group>
      </group>

      {/* ========================================================================= */}
      {/* 6. CENTRAL ENERGY FACILITY & HIGH-VOLTAGE SUBSTATION                      */}
      {/* ========================================================================= */}
      <group
        position={[-32, 0, 28]}
        onClick={(e) => {
          e.stopPropagation();
          focusEntity('energy-hub', [-32, 1.8, 28]);
        }}
      >
        {/* Main Generator & Cogeneration Hall */}
        <mesh position={[0, 2.0, 0]} castShadow receiveShadow>
          <boxGeometry args={[10.5, 4.0, 7.5]} />
          <meshStandardMaterial
            color={selectedMarkerId === 'energy-hub' ? '#1C2E2A' : '#141E28'}
            roughness={0.5}
            metalness={0.5}
          />
        </mesh>

        {/* Rooftop Heat Exchangers & Ventilator Fans */}
        <group ref={energyFanRef} position={[-2.5, 4.2, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.85, 0.85, 0.2, 12]} />
            <meshStandardMaterial color="#334155" metalness={0.8} />
          </mesh>
        </group>

        {/* High Voltage Transformer Substation Bays */}
        {[2.5, 4.2].map((x, idx) => (
          <group key={`c-trans-${idx}`} position={[x, 1.2, 0]}>
            <mesh castShadow>
              <boxGeometry args={[1.1, 2.4, 2.2]} />
              <meshStandardMaterial color="#475569" roughness={0.4} metalness={0.7} />
            </mesh>
            <mesh position={[0, 1.5, 0]}>
              <cylinderGeometry args={[0.15, 0.15, 0.7, 8]} />
              <meshStandardMaterial color="#E2E8F0" metalness={0.9} />
            </mesh>
          </group>
        ))}

        {/* Security Perimeter Fence */}
        <mesh position={[0, 0.8, 4.5]}>
          <boxGeometry args={[13.5, 1.6, 0.1]} />
          <meshStandardMaterial color="#64748B" wireframe />
        </mesh>
      </group>

      {/* ========================================================================= */}
      {/* 7. TERMINAL PARKING STRUCTURE COMPLEX (North & South Decks)               */}
      {/* ========================================================================= */}
      <group
        position={[-2, 0, 26]}
        onClick={(e) => {
          e.stopPropagation();
          focusEntity('parking-garage', [-2, 2.2, 26]);
        }}
      >
        {/* 4-Tier Open Deck Structure */}
        <mesh position={[0, 1.2, 0]} castShadow receiveShadow>
          <boxGeometry args={[14, 2.4, 10]} />
          <meshStandardMaterial
            color={selectedMarkerId === 'parking-garage' ? '#1E293B' : '#181E26'}
            roughness={0.8}
          />
        </mesh>
        <mesh position={[0, 2.6, 0]} castShadow receiveShadow>
          <boxGeometry args={[14.2, 0.4, 10.2]} />
          <meshStandardMaterial color="#222933" roughness={0.8} />
        </mesh>

        {/* Rooftop Parked Vehicles */}
        {[
          { x: -5.0, z: -3.0, color: '#E2E8F0' },
          { x: -3.0, z: -3.0, color: '#38BDF8' },
          { x: -1.0, z: -3.0, color: '#EF4444' },
          { x: 1.0, z: -3.0, color: '#10B981' },
          { x: 3.0, z: -3.0, color: '#F59E0B' },
          { x: 5.0, z: -3.0, color: '#E2E8F0' },
          { x: -4.0, z: 2.8, color: '#94A3B8' },
          { x: -2.0, z: 2.8, color: '#3B82F6' },
          { x: 0.0, z: 2.8, color: '#F8FAFC' },
          { x: 2.0, z: 2.8, color: '#64748B' },
          { x: 4.0, z: 2.8, color: '#E2E8F0' },
        ].map((car, idx) => (
          <group key={`c-car-${idx}`} position={[car.x, 3.0, car.z]}>
            <mesh position={[0, 0.2, 0]} castShadow>
              <boxGeometry args={[0.9, 0.35, 1.6]} />
              <meshStandardMaterial color={car.color} roughness={0.3} metalness={0.6} />
            </mesh>
          </group>
        ))}

        {/* Enclosed Pedestrian Skybridges connecting to Terminals */}
        <mesh position={[-6.0, 2.4, -9.0]} rotation={[0, 0.25, 0]}>
          <boxGeometry args={[1.5, 1.4, 8.5]} />
          <meshPhysicalMaterial
            color="#38BDF8"
            emissive="#0284C7"
            emissiveIntensity={0.2}
            roughness={0.1}
            transmission={0.7}
            transparent
            opacity={0.8}
          />
        </mesh>
      </group>

      {/* ========================================================================= */}
      {/* 8. CARGO LOGISTICS HUB & AIRPORT MAINTENANCE HANGARS                      */}
      {/* ========================================================================= */}
      <group
        position={[42, 0, -12]}
        onClick={(e) => {
          e.stopPropagation();
          focusEntity('cargo-hub', [42, 2.4, -12]);
        }}
      >
        {/* Hangar 1 (Widebody Maintenance Hangar) */}
        <mesh position={[-4, 2.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[10, 5.0, 8]} />
          <meshStandardMaterial color="#1E242C" roughness={0.5} metalness={0.6} />
        </mesh>
        <mesh position={[-4, 5.0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[4.0, 4.0, 10.2, 16, 1, false, 0, Math.PI]} />
          <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Freight Cargo Warehouse */}
        <mesh position={[6, 2.0, 0]} castShadow receiveShadow>
          <boxGeometry args={[8, 4.0, 10]} />
          <meshStandardMaterial color="#181E26" roughness={0.6} metalness={0.4} />
        </mesh>
      </group>

      {/* ========================================================================= */}
      {/* 9. AIRPORT OPERATIONS CENTER (AOC) & FIRE/RESCUE CRASH STATION            */}
      {/* ========================================================================= */}
      <group position={[-14, 0, -18]}>
        <mesh position={[0, 1.8, 0]} castShadow receiveShadow>
          <boxGeometry args={[9, 3.6, 6]} />
          <meshStandardMaterial color="#222933" roughness={0.5} metalness={0.5} />
        </mesh>
        {/* Fire Tender Vehicle Bays */}
        {[-2.5, 0, 2.5].map((x, idx) => (
          <mesh key={`fire-bay-${idx}`} position={[x, 1.2, 3.02]}>
            <planeGeometry args={[1.8, 2.2]} />
            <meshStandardMaterial color="#EF4444" roughness={0.4} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
