'use client';

import React from 'react';
import * as THREE from 'three';

export function AirportEnvironment() {
  return (
    <>
      {/* 1. Atmospheric Dusk Fog for Enterprise Depth */}
      <color attach="background" args={['#070B14']} />
      <fogExp2 attach="fog" args={['#080E1C', 0.0075]} />

      {/* 2. Ambient Dusk Fill Lighting */}
      <ambientLight color="#1E2A44" intensity={1.1} />

      {/* 3. Golden Hour / Twilight Directional Sun */}
      <directionalLight
        position={[80, 65, 45]}
        intensity={1.4}
        color="#FFE5CC"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={250}
        shadow-camera-left={-100}
        shadow-camera-right={100}
        shadow-camera-top={100}
        shadow-camera-bottom={-100}
        shadow-bias={-0.0005}
      />

      {/* 4. Cool Slate Horizon Rim Light */}
      <directionalLight
        position={[-70, 40, -60]}
        intensity={0.65}
        color="#6488B4"
      />

      {/* 5. Hemisphere Light for Natural Airfield Bounce */}
      <hemisphereLight
        color="#CBD5E1"
        groundColor="#0B132B"
        intensity={0.45}
      />

      {/* 6. Distant Starry / Sky Dome Elements */}
      <mesh position={[0, -2, 0]}>
        <sphereGeometry args={[180, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshBasicMaterial
          color="#060913"
          side={THREE.BackSide}
          transparent
          opacity={0.9}
        />
      </mesh>
    </>
  );
}
