'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTwinStore } from '@/lib/twin/twinStateStore';

export function SignatureSyncBeam() {
  const { isSyncBeamActive, syncBeamOrigin, syncBeamTarget } = useTwinStore();
  const particleGroupRef = useRef<THREE.Group>(null);

  // Generate a dramatic curved arc between CCTV feed origin in sky/screen space to Terminal B
  const { curve, points } = useMemo(() => {
    const start = new THREE.Vector3(...syncBeamOrigin);
    const end = new THREE.Vector3(...syncBeamTarget);
    // Apex control point high in the air
    const mid = new THREE.Vector3(
      (start.x + end.x) / 2 + 5,
      Math.max(start.y, end.y) + 12,
      (start.z + end.z) / 2 - 4
    );

    const qCurve = new THREE.QuadraticBezierCurve3(start, mid, end);
    const pts = qCurve.getPoints(50);
    return { curve: qCurve, points: pts };
  }, [syncBeamOrigin, syncBeamTarget]);

  // Animated energy packets traveling along the beam
  useFrame(({ clock }) => {
    if (!particleGroupRef.current || !isSyncBeamActive) return;
    const t = (clock.getElapsedTime() * 1.8) % 1;

    particleGroupRef.current.children.forEach((child, i) => {
      const mesh = child as THREE.Mesh;
      const progress = (t + i * 0.2) % 1;
      const pt = curve.getPoint(progress);
      mesh.position.copy(pt);
      const scale = 0.3 + Math.sin(progress * Math.PI) * 0.4;
      mesh.scale.set(scale, scale, scale);
    });
  });

  if (!isSyncBeamActive) return null;

  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);

  return (
    <group>
      {/* Glowing Neon Arc Line */}
      {/* @ts-ignore */}
      <line geometry={lineGeometry}>
        <lineBasicMaterial
          color="#F97316"
          linewidth={3}
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
        />
      </line>

      {/* Target Impact Glow Ring at Terminal B */}
      <mesh position={syncBeamTarget} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.5, 3.2, 32]} />
        <meshBasicMaterial
          color="#EF4444"
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Traveling Energy Quantum Pulses along the curve */}
      <group ref={particleGroupRef}>
        {[0, 1, 2, 3, 4].map((i) => (
          <mesh key={`pulse-dot-${i}`}>
            <sphereGeometry args={[0.25, 12, 12]} />
            <meshBasicMaterial
              color="#FFEDD5"
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}
