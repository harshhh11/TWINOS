'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Procedural High-Detail Commercial Jet Airliner
export function DetailedAirliner({
  position,
  rotationY = 0,
  scale = 1,
  liveryColor = '#F26A21',
  isTaxiing = false,
}: {
  position: [number, number, number];
  rotationY?: number;
  scale?: number;
  liveryColor?: string;
  isTaxiing?: boolean;
}) {
  const taxiGroupRef = useRef<THREE.Group>(null);
  const strobeRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    // Strobe light pulse
    if (strobeRef.current) {
      const time = state.clock.getElapsedTime();
      strobeRef.current.intensity = Math.sin(time * 6) > 0.7 ? 2.8 : 0;
    }

    // Subtle taxi motion if marked as taxiing
    if (isTaxiing && taxiGroupRef.current) {
      const time = state.clock.getElapsedTime();
      taxiGroupRef.current.position.x = position[0] + Math.sin(time * 0.15) * 8;
    }
  });

  return (
    <group
      ref={taxiGroupRef}
      position={position}
      rotation={[0, rotationY, 0]}
      scale={[scale, scale, scale]}
    >
      {/* ===================================================================== */}
      {/* 1. FUSELAGE BODY                                                      */}
      {/* ===================================================================== */}
      {/* Cylindrical Passenger Cabin Body */}
      <mesh position={[0, 1.85, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[1.05, 1.05, 10.5, 20]} />
        <meshStandardMaterial color="#F8FAFC" metalness={0.45} roughness={0.3} />
      </mesh>

      {/* Aerodynamic Nose Cone & Radome */}
      <mesh position={[0, 1.85, 6.2]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <coneGeometry args={[1.05, 2.2, 20]} />
        <meshStandardMaterial color="#E2E8F0" metalness={0.45} roughness={0.3} />
      </mesh>

      {/* Tapered Tail Cone */}
      <mesh position={[0, 2.05, -6.2]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
        <coneGeometry args={[1.05, 2.4, 20]} />
        <meshStandardMaterial color="#F8FAFC" metalness={0.45} roughness={0.3} />
      </mesh>

      {/* Cockpit Windshield Visor (Dark Glass) */}
      <mesh position={[0, 2.3, 5.8]} rotation={[0.4, 0, 0]}>
        <boxGeometry args={[1.2, 0.45, 0.9]} />
        <meshStandardMaterial
          color="#0F172A"
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* Cabin Window Slits (Warm Glow) */}
      <mesh position={[1.06, 2.0, 0]}>
        <planeGeometry args={[0.02, 7.8]} />
        <meshBasicMaterial color="#38BDF8" />
      </mesh>
      <mesh position={[-1.06, 2.0, 0]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[0.02, 7.8]} />
        <meshBasicMaterial color="#38BDF8" />
      </mesh>

      {/* ===================================================================== */}
      {/* 2. SWEPT-BACK MAIN WINGS & WINGLETS                                   */}
      {/* ===================================================================== */}
      {/* Left Wing (Port) */}
      <group position={[-0.8, 1.4, 0]} rotation={[0.04, -0.38, -0.06]}>
        <mesh castShadow>
          <boxGeometry args={[8.8, 0.18, 2.4]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.6} roughness={0.35} />
        </mesh>
        {/* Left Winglet */}
        <mesh position={[-4.4, 0.5, 0]} rotation={[0, 0, 0.5]}>
          <boxGeometry args={[0.1, 1.1, 0.9]} />
          <meshStandardMaterial color={liveryColor} />
        </mesh>
        {/* Red Port Navigation Light */}
        <mesh position={[-4.5, 0.1, 0.8]}>
          <sphereGeometry args={[0.12, 6, 6]} />
          <meshBasicMaterial color="#EF4444" />
        </mesh>
      </group>

      {/* Right Wing (Starboard) */}
      <group position={[0.8, 1.4, 0]} rotation={[0.04, 0.38, 0.06]}>
        <mesh castShadow>
          <boxGeometry args={[8.8, 0.18, 2.4]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.6} roughness={0.35} />
        </mesh>
        {/* Right Winglet */}
        <mesh position={[4.4, 0.5, 0]} rotation={[0, 0, -0.5]}>
          <boxGeometry args={[0.1, 1.1, 0.9]} />
          <meshStandardMaterial color={liveryColor} />
        </mesh>
        {/* Green Starboard Navigation Light */}
        <mesh position={[4.5, 0.1, 0.8]}>
          <sphereGeometry args={[0.12, 6, 6]} />
          <meshBasicMaterial color="#10B981" />
        </mesh>
      </group>

      {/* Flashing White Wing Strobe */}
      <pointLight
        ref={strobeRef}
        position={[0, 2.8, 0]}
        color="#FFFFFF"
        intensity={0}
        distance={12}
      />

      {/* ===================================================================== */}
      {/* 3. TWIN TURBOFAN JET ENGINES (Underwing Pods)                         */}
      {/* ===================================================================== */}
      {/* Left Engine */}
      <group position={[-2.8, 0.85, 0.8]}>
        {/* Nacelle Cowl */}
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.55, 0.52, 2.2, 16]} />
          <meshStandardMaterial color="#94A3B8" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Engine Intake Spinner Cone */}
        <mesh position={[0, 0, 1.05]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.2, 0.45, 12]} />
          <meshStandardMaterial color="#0F172A" metalness={0.9} />
        </mesh>
      </group>

      {/* Right Engine */}
      <group position={[2.8, 0.85, 0.8]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.55, 0.52, 2.2, 16]} />
          <meshStandardMaterial color="#94A3B8" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0, 1.05]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.2, 0.45, 12]} />
          <meshStandardMaterial color="#0F172A" metalness={0.9} />
        </mesh>
      </group>

      {/* ===================================================================== */}
      {/* 4. EMPENNAGE (Vertical Tail Fin & Horizontal Stabilizers)             */}
      {/* ===================================================================== */}
      {/* Swept Vertical Stabilizer */}
      <group position={[0, 3.4, -6.0]} rotation={[-0.45, 0, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.18, 3.2, 2.2]} />
          <meshStandardMaterial color={liveryColor} metalness={0.5} roughness={0.3} />
        </mesh>
      </group>

      {/* Horizontal Stabilizers */}
      <mesh position={[0, 2.3, -6.6]} castShadow>
        <boxGeometry args={[4.8, 0.12, 1.4]} />
        <meshStandardMaterial color="#CBD5E1" metalness={0.6} />
      </mesh>

      {/* ===================================================================== */}
      {/* 5. TRICYCLE LANDING GEAR                                              */}
      {/* ===================================================================== */}
      {/* Nose Gear Dual Wheels */}
      <group position={[0, 0.4, 4.6]}>
        <mesh>
          <cylinderGeometry args={[0.06, 0.06, 0.8, 8]} />
          <meshStandardMaterial color="#334155" metalness={0.8} />
        </mesh>
        {[-0.2, 0.2].map((x, i) => (
          <mesh key={i} position={[x, -0.25, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.22, 0.22, 0.12, 12]} />
            <meshStandardMaterial color="#0F172A" roughness={0.9} />
          </mesh>
        ))}
      </group>

      {/* Main Landing Gear Bogies */}
      {[-1.8, 1.8].map((x, idx) => (
        <group key={idx} position={[x, 0.4, -0.4]}>
          <mesh>
            <cylinderGeometry args={[0.08, 0.08, 0.8, 8]} />
            <meshStandardMaterial color="#334155" metalness={0.8} />
          </mesh>
          {[-0.25, 0.25].map((z, j) => (
            <mesh key={j} position={[0, -0.25, z]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.28, 0.28, 0.16, 12]} />
              <meshStandardMaterial color="#0F172A" roughness={0.9} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

// Subtle Ground Service Vehicle (GSE)
export function GroundServiceVehicles() {
  return (
    <group name="ground-service-equipment">
      {/* Pushback Tug at Gate C17 */}
      <group position={[39, 0.2, 1.5]}>
        <mesh castShadow>
          <boxGeometry args={[1.8, 0.8, 2.8]} />
          <meshStandardMaterial color="#F59E0B" roughness={0.5} />
        </mesh>
        {/* Tug Wheels */}
        {[-0.95, 0.95].map((x, i) =>
          [-0.8, 0.8].map((z, j) => (
            <mesh key={`${i}-${j}`} position={[x, -0.15, z]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.3, 0.3, 0.2, 8]} />
              <meshStandardMaterial color="#0F172A" />
            </mesh>
          ))
        )}
      </group>

      {/* Fuel Tanker Truck beside Terminal A */}
      <group position={[-32, 0.4, -18]} rotation={[0, 0.4, 0]}>
        {/* Cab */}
        <mesh position={[0, 0.3, 2.4]} castShadow>
          <boxGeometry args={[1.6, 1.2, 1.6]} />
          <meshStandardMaterial color="#E2E8F0" />
        </mesh>
        {/* Cylindrical Fuel Tank */}
        <mesh position={[0, 0.5, -0.8]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.75, 0.75, 4.4, 16]} />
          <meshStandardMaterial color="#FFFFFF" metalness={0.6} roughness={0.3} />
        </mesh>
      </group>

      {/* Baggage Tug & Luggage Carts */}
      <group position={[-16, 0.2, -6]} rotation={[0, Math.PI / 2, 0]}>
        {/* Small Tractor Tug */}
        <mesh position={[0, 0.2, 0]} castShadow>
          <boxGeometry args={[1.2, 0.7, 1.8]} />
          <meshStandardMaterial color="#F59E0B" />
        </mesh>
        {/* 3 Luggage Carts in Train */}
        {[-2.2, -4.2, -6.2].map((z, idx) => (
          <mesh key={idx} position={[0, 0.25, z]} castShadow>
            <boxGeometry args={[1.1, 0.6, 1.6]} />
            <meshStandardMaterial color="#475569" metalness={0.6} />
          </mesh>
        ))}
      </group>

      {/* Apron Passenger Shuttle Bus */}
      <group position={[14, 0.45, -2]}>
        <mesh castShadow>
          <boxGeometry args={[2.2, 1.5, 6.4]} />
          <meshStandardMaterial color="#F8FAFC" metalness={0.3} roughness={0.4} />
        </mesh>
        {/* Tinted Panoramic Windows */}
        <mesh position={[0, 0.3, 0]}>
          <boxGeometry args={[2.24, 0.6, 6.0]} />
          <meshStandardMaterial color="#0F172A" roughness={0.1} />
        </mesh>
      </group>
    </group>
  );
}

export function AirportAircraft() {
  return (
    <group name="airport-aircraft-fleet">
      {/* Terminal A Gates */}
      <DetailedAirliner
        position={[-30, 0, -17]}
        rotationY={-Math.PI / 2.3}
        scale={1.05}
        liveryColor="#F26A21"
      />
      <DetailedAirliner
        position={[-30, 0, -24]}
        rotationY={-Math.PI / 2.3}
        scale={0.95}
        liveryColor="#0284C7"
      />

      {/* Terminal B Gates */}
      <DetailedAirliner
        position={[-3, 0, -16]}
        rotationY={-Math.PI / 2.2}
        scale={0.95}
        liveryColor="#10B981"
      />
      <DetailedAirliner
        position={[7.5, 0, -16]}
        rotationY={Math.PI / 2.2}
        scale={0.95}
        liveryColor="#3B82F6"
      />

      {/* Terminal C Gates (Gate C14 & Gate C17) */}
      <DetailedAirliner
        position={[40, 0, -5]}
        rotationY={Math.PI / 2.2}
        scale={1.1}
        liveryColor="#8B5CF6"
      />
      {/* Focal Airliner at Gate C17 */}
      <DetailedAirliner
        position={[40, 0, 1]}
        rotationY={Math.PI / 2.2}
        scale={1.0}
        liveryColor="#EA580C"
      />

      {/* Terminal D Regional Commuter Gate */}
      <DetailedAirliner
        position={[26, 0, 15]}
        rotationY={0}
        scale={0.8}
        liveryColor="#06B6D4"
      />

      {/* Heavy Cargo Freighter at Cargo Logistics Apron */}
      <DetailedAirliner
        position={[52, 0, -38]}
        rotationY={-Math.PI / 2.5}
        scale={1.15}
        liveryColor="#475569"
      />

      {/* Active Aircraft Taxiing along Taxiway Alpha */}
      <DetailedAirliner
        position={[-22, 0, -32]}
        rotationY={-Math.PI / 2}
        scale={1.0}
        liveryColor="#F97316"
        isTaxiing
      />

      {/* Ground Support Equipment */}
      <GroundServiceVehicles />
    </group>
  );
}
