'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { CameraController } from './CameraController';
import { AirportEnvironment } from './AirportEnvironment';
import { AirportGround } from './AirportGround';
import { AirportTerminals } from './AirportTerminals';
import { AirportFacilities } from './AirportFacilities';
import { AirportAircraft } from './AirportAircraft';
import { AirportOperationalOverlays } from './AirportOperationalOverlays';
import { useTwinStore } from '@/lib/twin/twinStateStore';

interface AirportTwinSceneProps {
  className?: string;
}

export function AirportTwinScene({ className = '' }: AirportTwinSceneProps) {
  const { activeLayers } = useTwinStore();

  return (
    <div className={`relative w-full h-full select-none overflow-hidden bg-[#070B14] ${className}`}>
      {/* Interactive WebGL Canvas for 3D Digital Twin Enterprise Hub */}
      <Canvas
        shadows
        camera={{ position: [0, 48, 65], fov: 44, near: 0.5, far: 600 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          {/* 1. Atmospheric Dusk Sky, Lighting & Shadows */}
          <AirportEnvironment />

          {/* 2. Runways 1 & 2, Taxiways, Aprons & Airfield Ground Markings */}
          <AirportGround />

          {/* 3. Four Architecturally Distinct Terminals (A, B, C, D) & Concourse Fingers */}
          {activeLayers.buildings && <AirportTerminals />}

          {/* 4. ATC Tower, Central Energy Substation, Cargo Hub, Maintenance & Parking */}
          {activeLayers.buildings && <AirportFacilities />}

          {/* 5. Airliners, Taxiing Aircraft, and Ground Service Vehicles */}
          {activeLayers.operations && <AirportAircraft />}

          {/* 6. Operational Layers (3D Dependency Curves, Anomalies, Predictions & Live Pins) */}
          <AirportOperationalOverlays />

          {/* 7. Cinematic Orbit & Lerping Camera Controller */}
          <CameraController />
        </Suspense>
      </Canvas>
    </div>
  );
}
