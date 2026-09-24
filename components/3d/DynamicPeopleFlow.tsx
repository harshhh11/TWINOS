'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTwinStore } from '@/lib/twin/twinStateStore';

export function DynamicPeopleFlow() {
  const { activeLayers } = useTwinStore();
  const pointsRef = useRef<THREE.Points>(null);

  const particleCount = 200;

  const [positions, speeds, colors] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const spd = new Float32Array(particleCount);
    const col = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      // Half in Terminal A [-17 to -3], half in Terminal B [3 to 17]
      const isTerminalB = i >= particleCount / 2;
      const baseX = isTerminalB ? 3 + Math.random() * 14 : -17 + Math.random() * 14;
      const baseY = 0.5 + Math.random() * 0.4;
      const baseZ = isTerminalB ? 1 + Math.random() * 4 : 4 + Math.random() * 4;

      pos[i * 3] = baseX;
      pos[i * 3 + 1] = baseY;
      pos[i * 3 + 2] = baseZ;

      spd[i] = 0.4 + Math.random() * 0.8;

      // Color: Cyan for normal Terminal A, orange/red for crowded Terminal B
      if (isTerminalB) {
        col[i * 3] = 0.98; // R
        col[i * 3 + 1] = 0.35; // G
        col[i * 3 + 2] = 0.15; // B
      } else {
        col[i * 3] = 0.22; // R
        col[i * 3 + 1] = 0.74; // G
        col[i * 3 + 2] = 0.97; // B
      }
    }

    return [pos, spd, col];
  }, [particleCount]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.attributes.position;
    const array = posAttr.array as Float32Array;

    for (let i = 0; i < particleCount; i++) {
      const isTerminalB = i >= particleCount / 2;
      // Move along concourse X axis
      array[i * 3] += speeds[i] * delta * 1.5;

      // Reset when reaching end of corridor
      if (isTerminalB) {
        if (array[i * 3] > 18) array[i * 3] = 3.5;
      } else {
        if (array[i * 3] > -2) array[i * 3] = -17.5;
      }
    }
    posAttr.needsUpdate = true;
  });

  if (!activeLayers.people) return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.25}
        vertexColors
        transparent
        opacity={0.85}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
