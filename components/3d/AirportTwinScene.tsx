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
      {/* High-Resolution Cinematic Airport Aerial Dusk Backdrop with Subtle Drone Hover */}
      <div 
        className="absolute -inset-4 bg-cover bg-center transition-all duration-700 animate-[droneHover_28s_ease-in-out_infinite]"
        style={{ backgroundImage: 'url(/airport-backdrop.jpg)' }}
      >
        {/* Subtle dusk atmospheric depth vignette around edges so UI cards pop */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080A0D]/90 via-transparent to-[#080A0D]/50 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080A0D]/60 via-transparent to-[#080A0D]/40 pointer-events-none" />
      </div>

      {/* Living Digital Twin Animation Mockup (ATC Beacons, Radar Sweep, Aircraft Transit, Road Traffic) */}
      <AirportMockupAnimation />

      {/* Embedded CSS for Drone Hover Float */}
      <style jsx>{`
        @keyframes droneHover {
          0% {
            transform: scale(1.02) translate(0px, 0px);
          }
          50% {
            transform: scale(1.045) translate(-8px, -5px);
          }
          100% {
            transform: scale(1.02) translate(0px, 0px);
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
        {/* Ambient Dusk Lighting */}
        <ambientLight color="#CBD5E1" intensity={0.8} />
        
        {/* Directional Sunset / Apron Floodlights */}
        <directionalLight
          position={[30, 45, 25]}
          intensity={1.0}
          color="#FFE8D6"
        />

        <Suspense fallback={null}>
          {/* Smooth Orbit & Tilt Controls */}
          <CameraController />
        </Suspense>
      </Canvas>
    </div>
  );
}
