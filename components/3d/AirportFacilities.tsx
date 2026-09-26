'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTwinStore } from '@/lib/twin/twinStateStore';

export function AirportFacilities() {
  const { selectedMarkerId, focusEntity } = useTwinStore();
  const radarRef = useRef<THREE.Group>(null);
  const beaconRef = useRef<THREE.PointLight>(null);

  // Rotate ATC radar and pulse obstruction beacon
  useFrame((state) => {
    if (radarRef.current) {
      radarRef.current.rotation.y += 0.025;
    }
    if (beaconRef.current) {
      const time = state.clock.getElapsedTime();
      beaconRef.current.intensity = Math.sin(time * 4) > 0.5 ? 2.5 : 0.2;
    }
  });

  return (
    <group name="airport-facilities">
      {/* ========================================================================= */}
      {/* 1. AIR TRAFFIC CONTROL (ATC) TOWER                                        */}
      {/* ========================================================================= */}
      <group
        position={[-4, 0, -12]}
        onClick={(e) => {
          e.stopPropagation();
          focusEntity('atc-tower', [-4, 18, -12]);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        {selectedMarkerId === 'atc-tower' && (
          <mesh position={[0, 14, 0]}>
            <cylinderGeometry args={[5, 5, 28, 16, 1, true]} />
            <meshBasicMaterial color="#F26A21" wireframe transparent opacity={0.5} />
          </mesh>
        )}

        {/* Base Operations Annex Building */}
        <mesh position={[0, 1.8, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[5.2, 5.8, 3.6, 16]} />
          <meshStandardMaterial color="#1E293B" roughness={0.5} metalness={0.4} />
        </mesh>

        {/* Tall Fluted Concrete Structural Shaft */}
        <mesh position={[0, 12, 0]} castShadow>
          <cylinderGeometry args={[1.8, 2.6, 20.4, 16]} />
          <meshStandardMaterial color="#475569" roughness={0.4} metalness={0.6} />
        </mesh>

        {/* Vertical Glass Hoistway for Express Elevator */}
        <mesh position={[0, 12, 1.85]} castShadow>
          <boxGeometry args={[1.2, 20.4, 0.8]} />
          <meshStandardMaterial
            color="#38BDF8"
            transparent
            opacity={0.6}
            emissive="#0284C7"
            emissiveIntensity={0.4}
          />
        </mesh>

        {/* Flared Upper Observation Deck */}
        <mesh position={[0, 22.8, 0]} castShadow>
          <cylinderGeometry args={[4.2, 2.0, 2.2, 16]} />
          <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* 360-Degree Canted Polygonal Glass Control Cab */}
        <mesh position={[0, 24.6, 0]}>
          <cylinderGeometry args={[4.5, 3.8, 2.4, 16]} />
          <meshStandardMaterial
            color="#06B6D4"
            transparent
            opacity={0.65}
            emissive="#10B981"
            emissiveIntensity={0.6}
            roughness={0.1}
          />
        </mesh>

        {/* Control Cab Roof Cap */}
        <mesh position={[0, 26.0, 0]} castShadow>
          <cylinderGeometry args={[4.8, 4.8, 0.6, 16]} />
          <meshStandardMaterial color="#1E293B" metalness={0.8} />
        </mesh>

        {/* Rotating Radar Pedestal & Dish */}
        <group ref={radarRef} position={[0, 27.2, 0]}>
          <mesh>
            <cylinderGeometry args={[0.3, 0.3, 1.0, 8]} />
            <meshStandardMaterial color="#64748B" metalness={0.8} />
          </mesh>
          {/* Curved Radar Antenna Reflector */}
          <mesh position={[0, 0.8, 0.4]} rotation={[0.2, 0, 0]}>
            <boxGeometry args={[2.8, 0.9, 0.2]} />
            <meshStandardMaterial color="#F8FAFC" metalness={0.7} />
          </mesh>
        </group>

        {/* Tall Communications Antenna Mast */}
        <mesh position={[0, 29.5, 0]}>
          <cylinderGeometry args={[0.06, 0.12, 5.0, 8]} />
          <meshStandardMaterial color="#E2E8F0" metalness={0.9} />
        </mesh>

        {/* Pulsing Red Obstruction Beacon */}
        <pointLight
          ref={beaconRef}
          position={[0, 32.2, 0]}
          color="#EF4444"
          intensity={2.0}
          distance={16}
        />
        <mesh position={[0, 32.1, 0]}>
          <sphereGeometry args={[0.22, 8, 8]} />
          <meshBasicMaterial color="#EF4444" />
        </mesh>
      </group>

      {/* ========================================================================= */}
      {/* 2. CENTRAL ENERGY FACILITY (Substation, Transformers & Power Plant)       */}
      {/* ========================================================================= */}
      <group
        position={[-45, 0, 35]}
        onClick={(e) => {
          e.stopPropagation();
          focusEntity('energy-hub', [-45, 2, 35]);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        {selectedMarkerId === 'energy-hub' && (
          <mesh position={[0, 3.5, 0]}>
            <cylinderGeometry args={[16, 16, 8, 20, 1, true]} />
            <meshBasicMaterial color="#F26A21" wireframe transparent opacity={0.5} />
          </mesh>
        )}

        {/* Gravel Substation Foundation Yard */}
        <mesh position={[0, 0.1, 0]} receiveShadow>
          <planeGeometry args={[26, 20]} />
          <meshStandardMaterial color="#1C2433" roughness={0.95} />
        </mesh>

        {/* Main Electrical Switchgear Building */}
        <mesh position={[-6, 2.4, 0]} castShadow receiveShadow>
          <boxGeometry args={[10, 4.8, 12]} />
          <meshStandardMaterial color="#334155" roughness={0.5} metalness={0.4} />
        </mesh>
        {/* Switchgear Louver Vents */}
        <mesh position={[-0.95, 2.4, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[8, 3]} />
          <meshStandardMaterial color="#0F172A" metalness={0.8} />
        </mesh>

        {/* Transformer Unit 1 (with Cooling Radiator Fins) */}
        <group position={[3.5, 1.8, -4]}>
          <mesh castShadow>
            <boxGeometry args={[4.2, 3.4, 3.2]} />
            <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.3} />
          </mesh>
          {/* Ceramic High Voltage Bushing Insulators */}
          {[-1.2, 0, 1.2].map((x, i) => (
            <mesh key={i} position={[x, 2.4, 0]}>
              <cylinderGeometry args={[0.15, 0.22, 1.2, 8]} />
              <meshStandardMaterial color="#CBD5E1" roughness={0.1} />
            </mesh>
          ))}
          {/* Cooling Fin Bank */}
          <mesh position={[0, 0, 1.8]} castShadow>
            <boxGeometry args={[3.8, 2.6, 0.6]} />
            <meshStandardMaterial color="#1E293B" metalness={0.8} />
          </mesh>
        </group>

        {/* Transformer Unit 2 */}
        <group position={[3.5, 1.8, 4]}>
          <mesh castShadow>
            <boxGeometry args={[4.2, 3.4, 3.2]} />
            <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.3} />
          </mesh>
          {[-1.2, 0, 1.2].map((x, i) => (
            <mesh key={i} position={[x, 2.4, 0]}>
              <cylinderGeometry args={[0.15, 0.22, 1.2, 8]} />
              <meshStandardMaterial color="#CBD5E1" roughness={0.1} />
            </mesh>
          ))}
          <mesh position={[0, 0, -1.8]} castShadow>
            <boxGeometry args={[3.8, 2.6, 0.6]} />
            <meshStandardMaterial color="#1E293B" metalness={0.8} />
          </mesh>
        </group>

        {/* Emergency Generator Containers & Exhaust Stacks */}
        <group position={[10, 1.4, 0]}>
          <mesh castShadow>
            <boxGeometry args={[3.2, 2.6, 8.5]} />
            <meshStandardMaterial color="#0284C7" metalness={0.5} roughness={0.4} />
          </mesh>
          {/* Exhaust Stacks */}
          {[-2.5, 0, 2.5].map((z, i) => (
            <mesh key={i} position={[0, 2.2, z]}>
              <cylinderGeometry args={[0.2, 0.2, 1.6, 8]} />
              <meshStandardMaterial color="#E2E8F0" metalness={0.9} />
            </mesh>
          ))}
        </group>

        {/* High Voltage Grid Transmission Gantry Pylon */}
        <group position={[-11, 4.5, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.2, 0.4, 9, 6]} />
            <meshStandardMaterial color="#94A3B8" metalness={0.8} />
          </mesh>
          {/* Crossarms */}
          <mesh position={[0, 3.8, 0]}>
            <boxGeometry args={[0.3, 0.3, 7.5]} />
            <meshStandardMaterial color="#94A3B8" metalness={0.8} />
          </mesh>
        </group>

        {/* Solar Canopy Array */}
        <group position={[0, 3.8, 12]} rotation={[-0.25, 0, 0]}>
          <mesh castShadow>
            <boxGeometry args={[18, 0.2, 4]} />
            <meshStandardMaterial
              color="#0369A1"
              metalness={0.85}
              roughness={0.2}
              emissive="#0284C7"
              emissiveIntensity={0.2}
            />
          </mesh>
        </group>
      </group>

      {/* ========================================================================= */}
      {/* 3. MULTI-LEVEL PARKING STRUCTURE                                          */}
      {/* ========================================================================= */}
      <group
        position={[-28, 0, 25]}
        onClick={(e) => {
          e.stopPropagation();
          focusEntity('parking', [-28, 2, 25]);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        {selectedMarkerId === 'parking' && (
          <mesh position={[0, 4.5, 0]}>
            <cylinderGeometry args={[16, 16, 9, 20, 1, true]} />
            <meshBasicMaterial color="#F26A21" wireframe transparent opacity={0.5} />
          </mesh>
        )}

        {/* 4 Tiered Parking Decks */}
        {[1.2, 3.0, 4.8, 6.6].map((y, idx) => (
          <mesh key={idx} position={[0, y, 0]} castShadow receiveShadow>
            <boxGeometry args={[20, 0.4, 14]} />
            <meshStandardMaterial color="#475569" roughness={0.6} metalness={0.3} />
          </mesh>
        ))}

        {/* Structural Pillars */}
        {[-8.5, 8.5].map((x) =>
          [-5.5, 5.5].map((z) => (
            <mesh key={`${x}-${z}`} position={[x, 3.6, z]} castShadow>
              <boxGeometry args={[0.8, 6.8, 0.8]} />
              <meshStandardMaterial color="#334155" metalness={0.5} />
            </mesh>
          ))
        )}

        {/* Helical Spiral Vehicle Ramp */}
        <mesh position={[11.5, 3.6, 0]} castShadow>
          <cylinderGeometry args={[3.2, 3.2, 7.2, 16, 1, true]} />
          <meshStandardMaterial color="#64748B" roughness={0.5} />
        </mesh>

        {/* Rooftop Parked Vehicle Silhouettes */}
        {[-6, -2, 2, 6].map((x, i) => (
          <React.Fragment key={i}>
            <mesh position={[x, 7.3, -3]}>
              <boxGeometry args={[1.6, 0.8, 2.6]} />
              <meshStandardMaterial color={['#0F172A', '#E2E8F0', '#0369A1', '#B91C1C'][i % 4]} />
            </mesh>
            <mesh position={[x, 7.3, 3]}>
              <boxGeometry args={[1.6, 0.8, 2.6]} />
              <meshStandardMaterial color={['#B91C1C', '#0F172A', '#E2E8F0', '#0369A1'][i % 4]} />
            </mesh>
          </React.Fragment>
        ))}

        {/* Pedestrian Skybridge connecting Parking Structure to Terminal A */}
        <mesh position={[1.5, 4.8, -13.5]} castShadow>
          <boxGeometry args={[3.2, 2.4, 13]} />
          <meshStandardMaterial
            color="#38BDF8"
            transparent
            opacity={0.6}
            emissive="#0284C7"
            emissiveIntensity={0.3}
          />
        </mesh>
      </group>

      {/* ========================================================================= */}
      {/* 4. CARGO & FREIGHT LOGISTICS HUB                                          */}
      {/* ========================================================================= */}
      <group
        position={[48, 0, -45]}
        onClick={(e) => {
          e.stopPropagation();
          focusEntity('cargo-hub', [48, 2, -45]);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        {selectedMarkerId === 'cargo-hub' && (
          <mesh position={[0, 4.0, 0]}>
            <cylinderGeometry args={[18, 18, 8, 20, 1, true]} />
            <meshBasicMaterial color="#F26A21" wireframe transparent opacity={0.5} />
          </mesh>
        )}

        {/* Cargo Warehouse Building 1 */}
        <mesh position={[-6, 3.2, 0]} castShadow receiveShadow>
          <boxGeometry args={[18, 6.4, 14]} />
          <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.4} />
        </mesh>

        {/* Cargo Warehouse Building 2 */}
        <mesh position={[12, 2.8, 0]} castShadow receiveShadow>
          <boxGeometry args={[14, 5.6, 12]} />
          <meshStandardMaterial color="#475569" metalness={0.6} roughness={0.4} />
        </mesh>

        {/* Loading Bay Roll-up Doors */}
        {[-11, -8, -5, -2].map((x, i) => (
          <mesh key={i} position={[x, 1.8, 7.02]}>
            <planeGeometry args={[2.2, 3.2]} />
            <meshStandardMaterial color="#0F172A" metalness={0.8} />
          </mesh>
        ))}

        {/* Stacked Air Freight ULD Containers on Apron */}
        {[-8, -5, 8, 11].map((x, i) => (
          <mesh key={i} position={[x, 0.9, 10.5]} castShadow>
            <boxGeometry args={[1.8, 1.6, 1.8]} />
            <meshStandardMaterial color="#CBD5E1" metalness={0.7} />
          </mesh>
        ))}
      </group>

      {/* ========================================================================= */}
      {/* 5. AIRCRAFT MAINTENANCE HANGAR                                            */}
      {/* ========================================================================= */}
      <group position={[-50, 0, -25]}>
        {/* Large Arched Hangar Structure */}
        <mesh position={[0, 5.5, 0]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
          <cylinderGeometry args={[5.8, 5.8, 24, 24, 1, false, 0, Math.PI]} />
          <meshStandardMaterial color="#64748B" metalness={0.75} roughness={0.3} />
        </mesh>

        {/* Rear Wall */}
        <mesh position={[-12, 3.0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[11.6, 6]} />
          <meshStandardMaterial color="#1E293B" />
        </mesh>

        {/* Open Hangar Bay Interior Warm Light */}
        <pointLight position={[0, 4, 0]} color="#FDE68A" intensity={1.8} distance={16} />
      </group>
    </group>
  );
}
