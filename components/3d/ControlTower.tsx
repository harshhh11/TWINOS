'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTwinStore } from '@/lib/twin/twinStateStore';

export function ControlTower() {
  const { focusEntity } = useTwinStore();
  const radarRef = useRef<THREE.Group>(null);
  const beaconRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    // Rotate surveillance radar
    if (radarRef.current) {
      radarRef.current.rotation.y += 0.04;
    }
    // Pulse anti-collision red strobe beacon
    if (beaconRef.current) {
      const s = Math.sin(clock.getElapsedTime() * 5);
      beaconRef.current.visible = s > 0;
    }
  });

  return (
    <group
      position={[14, 0, -9]}
      onClick={(e) => {
        e.stopPropagation();
        focusEntity('atc-tower', [14, 7.8, -9]);
      }}
    >
      {/* Tower Base Foundation */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <cylinderGeometry args={[2.5, 3.0, 0.8, 16]} />
        <meshStandardMaterial color="#1E232B" roughness={0.6} />
      </mesh>

      {/* Main Concrete Shaft / Pylon */}
      <mesh position={[0, 4.2, 0]} castShadow>
        <cylinderGeometry args={[1.2, 1.8, 7.6, 16]} />
        <meshStandardMaterial color="#2B3340" roughness={0.4} metalness={0.3} />
      </mesh>

      {/* External Elevator Track & Spine */}
      <mesh position={[0, 4.2, 1.4]}>
        <boxGeometry args={[0.5, 7.6, 0.4]} />
        <meshStandardMaterial color="#3B82F6" metalness={0.7} />
      </mesh>

      {/* Intermediate Observation Collar */}
      <mesh position={[0, 7.2, 0]}>
        <cylinderGeometry args={[2.2, 1.6, 0.6, 16]} />
        <meshStandardMaterial color="#1F2937" />
      </mesh>

      {/* 360-Degree Glass Control Cab */}
      <mesh position={[0, 8.2, 0]}>
        <cylinderGeometry args={[2.6, 2.0, 1.4, 16]} />
        <meshStandardMaterial
          color="#38BDF8"
          emissive="#0284C7"
          emissiveIntensity={0.65}
          transparent
          opacity={0.7}
          roughness={0.1}
        />
      </mesh>

      {/* Cab Roof Canopy */}
      <mesh position={[0, 9.0, 0]}>
        <cylinderGeometry args={[2.8, 2.7, 0.3, 16]} />
        <meshStandardMaterial color="#111827" metalness={0.8} />
      </mesh>

      {/* Rotating Primary Surveillance Radar Dish */}
      <group ref={radarRef} position={[0, 9.6, 0]}>
        {/* Radar Mast */}
        <mesh position={[0, 0.3, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.6]} />
          <meshBasicMaterial color="#94A3B8" />
        </mesh>
        {/* Curved Curved Radar Scanner Antenna */}
        <mesh position={[0, 0.6, 0.3]} rotation={[0.2, 0, 0]}>
          <boxGeometry args={[1.8, 0.35, 0.08]} />
          <meshStandardMaterial color="#F97316" metalness={0.5} />
        </mesh>
      </group>

      {/* Flashing Red Aviation Obstacle Beacon */}
      <mesh ref={beaconRef} position={[0, 10.3, 0]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshBasicMaterial color="#EF4444" />
      </mesh>
    </group>
  );
}
