'use client';

import React from 'react';

export function AirportLightingAndEnvironment() {
  // Floodlight tower positions covering West, Central, East aprons and Cargo
  const floodlightTowers = [
    { x: -28, z: -14 },
    { x: -28, z: 2 },
    { x: -28, z: 18 },
    { x: -10, z: -14 },
    { x: -10, z: 2 },
    { x: 10, z: -14 },
    { x: 10, z: 2 },
    { x: 26, z: -14 },
    { x: 26, z: 4 },
    { x: 26, z: 20 },
    { x: 44, z: -6 },
    { x: 44, z: 8 },
  ];

  return (
    <group name="CampusLightingAndEnvironment">
      {/* 1. Global Ambient Light (Soft Late Afternoon Skylight) */}
      <ambientLight color="#94A3B8" intensity={0.68} />

      {/* 2. Primary Directional Sunlight with Broad Shadow Map for large campus */}
      <directionalLight
        position={[65, 80, 50]}
        intensity={1.25}
        color="#FFF6ED"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={15}
        shadow-camera-far={260}
        shadow-camera-left={-90}
        shadow-camera-right={90}
        shadow-camera-top={90}
        shadow-camera-bottom={-90}
        shadow-bias={-0.0003}
      />

      {/* 3. Hemisphere Sky Fill Light (Dusk Sky Tone & Deep Slate Bounce) */}
      <hemisphereLight
        args={['#38BDF8', '#0F172A', 0.58]}
        position={[0, 80, 0]}
      />

      {/* 4. High-Mast Apron LED Floodlight Towers */}
      {floodlightTowers.map((tower, idx) => (
        <group key={`flood-tower-${idx}`} position={[tower.x, 0, tower.z]}>
          {/* Steel Lattice Mast Shaft */}
          <mesh position={[0, 4.8, 0]} castShadow>
            <cylinderGeometry args={[0.16, 0.38, 9.6, 8]} />
            <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} />
          </mesh>

          {/* Mast Head Crossbar */}
          <mesh position={[0, 9.8, 0]} castShadow>
            <boxGeometry args={[2.0, 0.45, 0.65]} />
            <meshStandardMaterial color="#334155" metalness={0.7} />
          </mesh>

          {/* Luminous LED Emissive Lamp Face */}
          <mesh position={[0, 9.75, 0.28]} rotation={[0.4, 0, 0]}>
            <planeGeometry args={[1.8, 0.35]} />
            <meshBasicMaterial color="#FEF3C7" />
          </mesh>

          {/* Local Area Apron Illumination Spotlight */}
          <pointLight
            position={[0, 9.4, 0.5]}
            color="#FEF08A"
            intensity={0.7}
            distance={34}
            decay={2}
          />
        </group>
      ))}
    </group>
  );
}
