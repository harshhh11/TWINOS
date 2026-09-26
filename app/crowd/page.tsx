'use client';

import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { CrowdManagementOverlay } from '@/components/crowd/CrowdManagementOverlay';
import { useTwinStore } from '@/lib/twin/twinStateStore';

// Dynamically import 3D Scene with ssr: false for high-performance WebGL
const AirportTwinScene = dynamic(
  () => import('@/components/3d/AirportTwinScene').then((mod) => mod.AirportTwinScene),
  { ssr: false }
);

export default function CrowdOperationsPage() {
  const { setCrowdMode, setSelectedCrowdTerminal, focusEntity } = useTwinStore();

  useEffect(() => {
    // Automatically engage crowd mode and focus camera on Terminal B cutaway
    setCrowdMode(true);
    setSelectedCrowdTerminal('terminal-b');
    focusEntity('terminal-b', [-2, 0.4, 4]);

    return () => {
      // Don't auto-reset if navigating to related pages, but keep state clean
    };
  }, [setCrowdMode, setSelectedCrowdTerminal, focusEntity]);

  return (
    <main className="relative w-screen h-screen overflow-hidden font-sans select-none bg-[#080A0D]">
      {/* 1. Fullscreen 3D WebGL Digital Twin Simulation Viewport */}
      <div className="absolute inset-0 z-0">
        <AirportTwinScene />
      </div>

      {/* 2. Crowd Management Operational Decision Support Overlay */}
      <div className="relative z-20 w-full h-full">
        <CrowdManagementOverlay />
      </div>
    </main>
  );
}
