'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTwinStore } from '@/lib/twin/twinStateStore';

export function GroundVehicles() {
  const { activeLayers } = useTwinStore();
  const tugRef = useRef<THREE.Group>(null);
  const truckRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    // Luggage tug loops along service corridor
    if (tugRef.current) {
      const pos = (t * 2.5) % 40 - 20;
      tugRef.current.position.x = pos;
    }
    // Follow-me service truck loops along perimeter road
    if (truckRef.current) {
      const pos = 20 - ((t * 3) % 44);
      truckRef.current.position.x = pos;
    }
  });

  if (!activeLayers.environment) return null;

  return (
    <group>
      {/* Luggage Tug with Cargo Carts */}
      <group ref={tugRef} position={[-5, 0.15, -4]}>
        {/* Tractor Unit */}
        <mesh position={[0, 0.25, 0]} castShadow>
          <boxGeometry args={[1.4, 0.5, 0.9]} />
          <meshStandardMaterial color="#EAB308" roughness={0.4} />
        </mesh>
        {/* Cab Windshield */}
        <mesh position={[0.2, 0.45, 0]}>
          <boxGeometry args={[0.6, 0.35, 0.8]} />
          <meshBasicMaterial color="#0F172A" />
        </mesh>
        {/* Cart 1 */}
        <mesh position={[-1.6, 0.2, 0]}>
          <boxGeometry args={[1.2, 0.35, 0.8]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
        {/* Cart 2 */}
        <mesh position={[-3.0, 0.2, 0]}>
          <boxGeometry args={[1.2, 0.35, 0.8]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
      </group>

      {/* Operations Service Truck with Amber Flasher */}
      <group ref={truckRef} position={[10, 0.2, -6]}>
        <mesh position={[0, 0.35, 0]} castShadow>
          <boxGeometry args={[2.0, 0.7, 1.0]} />
          <meshStandardMaterial color="#FFFFFF" metalness={0.6} />
        </mesh>
        <mesh position={[0.5, 0.6, 0]}>
          <boxGeometry args={[0.8, 0.4, 0.9]} />
          <meshBasicMaterial color="#1E293B" />
        </mesh>
        {/* Amber Flashing Lightbar */}
        <mesh position={[0.3, 0.85, 0]}>
          <boxGeometry args={[0.3, 0.1, 0.6]} />
          <meshBasicMaterial color="#F59E0B" />
        </mesh>
      </group>
    </group>
  );
}
