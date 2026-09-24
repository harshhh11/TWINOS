'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTwinStore } from '@/lib/twin/twinStateStore';

interface AirplaneProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  liveryColor?: string;
  isTaxiing?: boolean;
}

function CommercialAircraft({
  position,
  rotation = [0, 0, 0],
  scale = 1,
  liveryColor = '#0284C7',
  isTaxiing = false,
}: AirplaneProps) {
  const taxiRef = useRef<THREE.Group>(null);
  const beaconRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    // Taxi movement along runway/taxiway if taxiing
    if (isTaxiing && taxiRef.current) {
      const t = clock.getElapsedTime() * 0.15;
      const x = -30 + ((t * 8) % 65);
      taxiRef.current.position.x = x;
    }
    // Red beacon pulse
    if (beaconRef.current) {
      beaconRef.current.visible = Math.sin(clock.getElapsedTime() * 4) > 0;
    }
  });

  return (
    <group ref={taxiRef} position={position} rotation={rotation} scale={scale}>
      {/* Fuselage Cylinder */}
      <mesh position={[0, 0.9, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.65, 0.65, 7.2, 16]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.2} metalness={0.4} />
      </mesh>

      {/* Aerodynamic Nose Cone */}
      <mesh position={[-3.8, 0.85, 0]} rotation={[0, 0, -Math.PI / 2]} castShadow>
        <coneGeometry args={[0.65, 1.4, 16]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.2} />
      </mesh>

      {/* Cockpit Windshield */}
      <mesh position={[-3.4, 1.15, 0]} rotation={[0, 0, -0.2]}>
        <boxGeometry args={[0.6, 0.25, 0.7]} />
        <meshBasicMaterial color="#0F172A" />
      </mesh>

      {/* Swept Main Wings */}
      <mesh position={[-0.4, 0.75, 0]} rotation={[0, 0, 0]} castShadow>
        <boxGeometry args={[2.4, 0.12, 9.8]} />
        <meshStandardMaterial color="#E2E8F0" roughness={0.3} metalness={0.5} />
      </mesh>

      {/* Winglets (Upward bent wingtips) */}
      <mesh position={[-0.2, 1.1, 4.9]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.6, 0.7, 0.08]} />
        <meshStandardMaterial color={liveryColor} />
      </mesh>
      <mesh position={[-0.2, 1.1, -4.9]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.6, 0.7, 0.08]} />
        <meshStandardMaterial color={liveryColor} />
      </mesh>

      {/* Dual Jet Turbofan Engines */}
      <mesh position={[-0.6, 0.35, 2.2]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.38, 0.38, 1.6, 16]} />
        <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[-0.6, 0.35, -2.2]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.38, 0.38, 1.6, 16]} />
        <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Tail Fin (Vertical Stabilizer with Airline Livery) */}
      <mesh position={[3.1, 1.9, 0]} rotation={[0, 0, 0.5]} castShadow>
        <boxGeometry args={[1.6, 2.0, 0.12]} />
        <meshStandardMaterial color={liveryColor} roughness={0.3} />
      </mesh>

      {/* Horizontal Stabilizers */}
      <mesh position={[3.2, 1.2, 0]}>
        <boxGeometry args={[1.2, 0.08, 3.2]} />
        <meshStandardMaterial color="#E2E8F0" />
      </mesh>

      {/* Landing Gear Struts */}
      <mesh position={[-0.4, 0.25, 1.1]}>
        <cylinderGeometry args={[0.05, 0.05, 0.5]} />
        <meshBasicMaterial color="#1E293B" />
      </mesh>
      <mesh position={[-0.4, 0.25, -1.1]}>
        <cylinderGeometry args={[0.05, 0.05, 0.5]} />
        <meshBasicMaterial color="#1E293B" />
      </mesh>
      <mesh position={[-3.0, 0.25, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.5]} />
        <meshBasicMaterial color="#1E293B" />
      </mesh>

      {/* Flashing Red Beacon Light on Roof */}
      <mesh ref={beaconRef} position={[-0.4, 1.6, 0]}>
        <sphereGeometry args={[0.09, 8, 8]} />
        <meshBasicMaterial color="#EF4444" />
      </mesh>
    </group>
  );
}

export function AircraftFleet() {
  const { activeLayers } = useTwinStore();
  const airborneRef = useRef<THREE.Group>(null);

  // Subtle flight takeoff climb in distance
  useFrame(({ clock }) => {
    if (airborneRef.current) {
      const t = clock.getElapsedTime() * 0.2;
      airborneRef.current.position.x = -15 + Math.sin(t) * 20;
      airborneRef.current.position.y = 18 + Math.cos(t * 0.5) * 2;
    }
  });

  if (!activeLayers.flights) return null;

  return (
    <group>
      {/* Docked Aircraft at Terminal A Gates */}
      <CommercialAircraft
        position={[-16, 0, 0.8]}
        rotation={[0, Math.PI / 2, 0]}
        scale={0.9}
        liveryColor="#F97316" // Orange airline
      />
      <CommercialAircraft
        position={[-12, 0, 0.8]}
        rotation={[0, Math.PI / 2, 0]}
        scale={0.9}
        liveryColor="#3B82F6" // Blue airline
      />
      <CommercialAircraft
        position={[-8, 0, 0.8]}
        rotation={[0, Math.PI / 2, 0]}
        scale={0.9}
        liveryColor="#10B981" // Emerald airline
      />

      {/* Docked Aircraft at Terminal B Gates */}
      <CommercialAircraft
        position={[6, 0, -1.7]}
        rotation={[0, Math.PI / 2, 0]}
        scale={0.9}
        liveryColor="#EF4444" // Crimson airline
      />
      <CommercialAircraft
        position={[10, 0, -1.7]}
        rotation={[0, Math.PI / 2, 0]}
        scale={0.9}
        liveryColor="#8B5CF6" // Purple airline
      />
      <CommercialAircraft
        position={[14, 0, -1.7]}
        rotation={[0, Math.PI / 2, 0]}
        scale={0.9}
        liveryColor="#F97316"
      />

      {/* Taxiing Aircraft on Taxiway Alpha */}
      <CommercialAircraft
        position={[-10, 0, -8]}
        rotation={[0, 0, 0]}
        scale={0.85}
        liveryColor="#0284C7"
        isTaxiing={true}
      />

      {/* Airborne Departure Flight in Sky */}
      <group ref={airborneRef} position={[-20, 18, -35]} rotation={[0, 0, 0.08]}>
        <CommercialAircraft
          position={[0, 0, 0]}
          rotation={[0, 0, 0]}
          scale={0.65}
          liveryColor="#38BDF8"
        />
        {/* Jet engine contrail lights */}
        <mesh position={[2.5, 0.2, 1.4]}>
          <coneGeometry args={[0.2, 4.0, 8]} />
          <meshBasicMaterial color="#93C5FD" transparent opacity={0.3} />
        </mesh>
        <mesh position={[2.5, 0.2, -1.4]}>
          <coneGeometry args={[0.2, 4.0, 8]} />
          <meshBasicMaterial color="#93C5FD" transparent opacity={0.3} />
        </mesh>
      </group>
    </group>
  );
}
