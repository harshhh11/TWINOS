'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTwinStore } from '@/lib/twin/twinStateStore';

export function AirfieldRunways() {
  const { activeLayers } = useTwinStore();
  const strobeRef = useRef<THREE.Group>(null);

  // Strobe animation for approach rabbit lights
  useFrame(({ clock }) => {
    if (strobeRef.current) {
      const time = clock.getElapsedTime() * 8;
      strobeRef.current.children.forEach((child, i) => {
        const mesh = child as THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial>;
        if (mesh.material) {
          const active = Math.floor(time % 8) === i;
          mesh.material.color.setHex(active ? 0xFFFFFF : 0x334155);
        }
      });
    }
  });

  return (
    <group>
      {/* ========================================================================= */}
      {/* MAIN GROUND TARMAC APPRON */}
      {/* ========================================================================= */}
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[120, 90]} />
        <meshStandardMaterial
          color="#0E1217"
          roughness={0.85}
          metalness={0.15}
        />
      </mesh>

      {/* Clean Apron Surface without CAD grid */}

      {/* ========================================================================= */}
      {/* MAIN RUNWAY 09L / 27R */}
      {/* ========================================================================= */}
      <group position={[-20, 0.02, -18]} rotation={[0, -0.04, 0]}>
        {/* Runway Asphalt Surface */}
        <mesh receiveShadow>
          <planeGeometry args={[75, 7.5]} />
          <meshStandardMaterial color="#0A0D11" roughness={0.9} />
        </mesh>

        {/* Centerline Dashes */}
        {[-30, -22, -14, -6, 2, 10, 18, 26].map((x, i) => (
          <mesh key={`rwy-center-${i}`} position={[x, 0.01, 0]}>
            <planeGeometry args={[4.5, 0.45]} />
            <meshBasicMaterial color="#E2E8F0" />
          </mesh>
        ))}

        {/* Threshold Piano Keys (West End - 09L) */}
        {[-2.8, -2.0, -1.2, -0.4, 0.4, 1.2, 2.0, 2.8].map((z, i) => (
          <mesh key={`piano-w-${i}`} position={[-35, 0.01, z]}>
            <planeGeometry args={[3.2, 0.35]} />
            <meshBasicMaterial color="#FFFFFF" />
          </mesh>
        ))}

        {/* Threshold Piano Keys (East End - 27R) */}
        {[-2.8, -2.0, -1.2, -0.4, 0.4, 1.2, 2.0, 2.8].map((z, i) => (
          <mesh key={`piano-e-${i}`} position={[35, 0.01, z]}>
            <planeGeometry args={[3.2, 0.35]} />
            <meshBasicMaterial color="#FFFFFF" />
          </mesh>
        ))}

        {/* Runway White Edge Boundary Lines */}
        <mesh position={[0, 0.01, 3.6]}>
          <planeGeometry args={[74, 0.25]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
        <mesh position={[0, 0.01, -3.6]}>
          <planeGeometry args={[74, 0.25]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>

        {/* Runway Edge Point Lights (White / Amber) */}
        {[-32, -24, -16, -8, 0, 8, 16, 24, 32].map((x, i) => (
          <React.Fragment key={`edge-lights-${i}`}>
            <mesh position={[x, 0.1, 3.8]}>
              <sphereGeometry args={[0.08, 6, 6]} />
              <meshBasicMaterial color="#F8FAFC" />
            </mesh>
            <mesh position={[x, 0.1, -3.8]}>
              <sphereGeometry args={[0.08, 6, 6]} />
              <meshBasicMaterial color="#F8FAFC" />
            </mesh>
          </React.Fragment>
        ))}
      </group>

      {/* ========================================================================= */}
      {/* APPROACH LIGHTING SYSTEM (MALSR) with Animated Flashing Strobes */}
      {/* ========================================================================= */}
      <group ref={strobeRef} position={[-60, 0.2, -19]}>
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <mesh key={`strobe-${i}`} position={[i * 3.5, 0.2, 0]}>
            <sphereGeometry args={[0.16, 8, 8]} />
            <meshBasicMaterial color="#334155" />
          </mesh>
        ))}
      </group>

      {/* ========================================================================= */}
      {/* TAXIWAYS & APRON MARKINGS */}
      {/* ========================================================================= */}
      {/* Taxiway Alpha (Parallel to Runway) */}
      <group position={[-15, 0.02, -8]}>
        <mesh receiveShadow>
          <planeGeometry args={[65, 4.5]} />
          <meshStandardMaterial color="#0B0F14" roughness={0.88} />
        </mesh>
        {/* Yellow Centerline */}
        <mesh position={[0, 0.01, 0]}>
          <planeGeometry args={[65, 0.2]} />
          <meshBasicMaterial color="#F59E0B" />
        </mesh>
        {/* Blue Taxiway Edge Lights */}
        {[-30, -20, -10, 0, 10, 20, 30].map((x, i) => (
          <React.Fragment key={`tw-light-${i}`}>
            <mesh position={[x, 0.1, 2.3]}>
              <sphereGeometry args={[0.07, 6, 6]} />
              <meshBasicMaterial color="#38BDF8" />
            </mesh>
            <mesh position={[x, 0.1, -2.3]}>
              <sphereGeometry args={[0.07, 6, 6]} />
              <meshBasicMaterial color="#38BDF8" />
            </mesh>
          </React.Fragment>
        ))}
      </group>

      {/* Taxiway Connector Bravo (Runway to Apron) */}
      <group position={[5, 0.02, -13]} rotation={[0, 0.45, 0]}>
        <mesh receiveShadow>
          <planeGeometry args={[14, 4]} />
          <meshStandardMaterial color="#0B0F14" />
        </mesh>
        <mesh position={[0, 0.01, 0]}>
          <planeGeometry args={[14, 0.2]} />
          <meshBasicMaterial color="#F59E0B" />
        </mesh>
      </group>

      {/* Taxiway Connector Charlie */}
      <group position={[-25, 0.02, -13]} rotation={[0, -0.45, 0]}>
        <mesh receiveShadow>
          <planeGeometry args={[14, 4]} />
          <meshStandardMaterial color="#0B0F14" />
        </mesh>
        <mesh position={[0, 0.01, 0]}>
          <planeGeometry args={[14, 0.2]} />
          <meshBasicMaterial color="#F59E0B" />
        </mesh>
      </group>
    </group>
  );
}
