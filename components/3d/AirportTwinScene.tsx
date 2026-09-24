'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { CameraController } from './CameraController';
import { AirportMockupAnimation } from './AirportMockupAnimation';

interface AirportTwinSceneProps {
  className?: string;
}

export function AirportTwinScene({ className = '' }: AirportTwinSceneProps) {
  return (
    <div className={`relative w-full h-full select-none overflow-hidden ${className}`}>
      {/* High-Resolution Cinematic Airport Aerial Backdrop */}
      <div 
        className="absolute -inset-2 bg-cover bg-center transition-all duration-700 animate-[droneHover_32s_ease-in-out_infinite]"
        style={{ backgroundImage: 'url(/airport-backdrop.jpg)' }}
      >
        {/* Soft, gentle atmospheric vignette so airport stays bright, vibrant, and realistic */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#10233F]/30 via-transparent to-[#F5F7FA]/20 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/35 via-transparent to-white/10 pointer-events-none" />
      </div>

      {/* Living Digital Twin Animation Mockup (ATC Beacons, Radar Sweep, Aircraft Transit, Apron Flow) */}
      <AirportMockupAnimation />

      {/* Embedded CSS for Drone Hover Float */}
      <style jsx>{`
        @keyframes droneHover {
          0% {
            transform: scale(1.01) translate(0px, 0px);
          }
          50% {
            transform: scale(1.03) translate(-6px, -4px);
          }
          100% {
            transform: scale(1.01) translate(0px, 0px);
          }
        }
      `}</style>

      {/* Interactive WebGL Canvas for 3D Camera Controls & Spatial Interactions */}
      <Canvas
        camera={{ position: [0, 15, 35], fov: 42, near: 0.5, far: 300 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 2]}
      >
        {/* Ambient Lighting */}
        <ambientLight color="#FFFFFF" intensity={1.1} />
        
        {/* Directional Sun / Apron Lighting */}
        <directionalLight
          position={[30, 45, 25]}
          intensity={1.2}
          color="#FFF3E0"
        />

        <Suspense fallback={null}>
          <CameraController />
        </Suspense>
      </Canvas>
    </div>
  );
}
