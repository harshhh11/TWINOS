'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { CameraController } from './CameraController';
import { AirportGroundAndRunways } from './AirportGroundAndRunways';
import { AirportBuildings } from './AirportBuildings';
import { AirportAircraftAndVehicles } from './AirportAircraftAndVehicles';
import { AirportLightingAndEnvironment } from './AirportLightingAndEnvironment';
import { Dependency3DLines } from './Dependency3DLines';
import { Spatial3DMarkers } from './Spatial3DMarkers';
import { TerminalCrowd3D } from './TerminalCrowd3D';
import { useTwinStore } from '@/lib/twin/twinStateStore';

interface AirportTwinSceneProps {
  className?: string;
}

export function AirportTwinScene({ className = '' }: AirportTwinSceneProps) {
  const isCrowdMode = useTwinStore((s) => s.isCrowdMode);
  return (
    <div className={`relative w-full h-full select-none overflow-hidden bg-[#080A0D] ${className}`}>
      {/* 3D WebGL Digital Twin Simulation Canvas */}
      <Canvas
        shadows
        camera={{ position: [48, 58, 68], fov: 40, near: 0.5, far: 600 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 2]}
      >
        {/* Background Color & Atmospheric Perspective Depth Fog */}
        <color attach="background" args={['#080A0D']} />
        <fogExp2 attach="fog" args={['#080A0D', 0.0055]} />

        <Suspense fallback={null}>
          {/* 1. Realistic Environment Lighting & High-Mast Apron Floodlights */}
          <AirportLightingAndEnvironment />

          {/* 2. Airfield Pavements, Runway 09L/27R, Taxiways & Markings */}
          <AirportGroundAndRunways />

          {/* 3. Terminals A & B, ATC Control Tower, Energy Hub, Parking & Hangars */}
          <AirportBuildings />

          {/* 4. Commercial Airliners, Ground Service Equipment & Patrol Vehicles */}
          <AirportAircraftAndVehicles />

          {/* 5. Live Infrastructure Dependency 3D Curves & Energy Pulses */}
          <Dependency3DLines />

          {/* 6. Floating 3D Digital Twin Spatial Status Badges & Anomaly Overlays */}
          <Spatial3DMarkers />

          {/* 7. Detailed Cutaway Terminal Interior & Instanced 3D Crowd Management */}
          {isCrowdMode && <TerminalCrowd3D visible={true} />}

          {/* 8. Interactive Orbit & Tilt Navigation with Smooth Fly-To Transitions */}
          <CameraController />
        </Suspense>
      </Canvas>
    </div>
  );
}
