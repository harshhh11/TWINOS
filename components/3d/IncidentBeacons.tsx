'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTwinStore } from '@/lib/twin/twinStateStore';

export function IncidentBeacons() {
  const { incidents, activeLayers } = useTwinStore();
  const ringRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (ringRef.current) {
      const t = clock.getElapsedTime();
      ringRef.current.children.forEach((child, i) => {
        const ring = child as THREE.Mesh;
        const scale = 1 + ((t * 1.5 + i * 0.5) % 2.5);
        const opacity = Math.max(0, 1 - (scale - 1) / 2.5);
        ring.scale.set(scale, scale, scale);
        const mat = ring.material as THREE.MeshBasicMaterial;
        if (mat) mat.opacity = opacity * 0.8;
      });
    }
  });

  if (!activeLayers.incidents) return null;

  const activeIncidents = incidents.filter((i) => i.status !== 'RESOLVED');

  return (
    <group>
      {activeIncidents.map((inc) => (
        <group key={`beacon-${inc.id}`} position={inc.coordinates}>
          {/* Vertical Holographic Alert Pillar */}
          <mesh position={[0, 4, 0]}>
            <cylinderGeometry args={[0.08, 0.6, 8, 16]} />
            <meshBasicMaterial
              color={inc.severity === 'HIGH' ? '#EF4444' : '#F59E0B'}
              transparent
              opacity={0.35}
              blending={THREE.AdditiveBlending}
            />
          </mesh>

          {/* Central Pulsing Sphere */}
          <mesh position={[0, 0.4, 0]}>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshBasicMaterial
              color={inc.severity === 'HIGH' ? '#EF4444' : '#F59E0B'}
            />
          </mesh>

          {/* Concentric Ground Warning Pulse Rings */}
          <group ref={ringRef} position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <mesh>
              <ringGeometry args={[0.8, 1.1, 32]} />
              <meshBasicMaterial
                color={inc.severity === 'HIGH' ? '#EF4444' : '#F59E0B'}
                transparent
                opacity={0.8}
                side={THREE.DoubleSide}
              />
            </mesh>
            <mesh>
              <ringGeometry args={[1.4, 1.7, 32]} />
              <meshBasicMaterial
                color={inc.severity === 'HIGH' ? '#EF4444' : '#F59E0B'}
                transparent
                opacity={0.5}
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>
        </group>
      ))}
    </group>
  );
}
