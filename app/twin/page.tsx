'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import {
  ArrowLeft,
  Box,
  RotateCw,
} from 'lucide-react';
import { useTwinStore } from '@/lib/twin/twinStateStore';
import { ContextualEntityModal } from '@/components/3d/ContextualEntityModal';

const AirportTwinScene = dynamic(
  () => import('@/components/3d/AirportTwinScene').then((mod) => mod.AirportTwinScene),
  { ssr: false }
);

export default function TwinExplorerPage() {
  const {
    markers,
    focusEntity,
    resetCamera,
    selectedMarkerId,
  } = useTwinStore();

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#080A0D] font-sans select-none">
      {/* 3D Scene Hero */}
      <div className="absolute inset-0 z-0">
        <AirportTwinScene />
      </div>

      {/* Top Floating Control Bar */}
      <header className="absolute top-6 inset-x-8 z-30 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0D1014]/90 hover:bg-[#151A21] backdrop-blur-xl border border-white/[0.08] text-xs font-semibold text-[#F4F4F5] transition-all shadow-card"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </Link>

          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0D1014]/90 backdrop-blur-xl border border-white/[0.08] text-xs text-[#8B9199] shadow-card">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-[#F4F4F5]">3D Digital Twin Explorer</span>
            <span>• Airport Environment</span>
          </div>
        </div>

        {/* Spatial Quick Jumps & Camera Reset */}
        <div className="flex items-center gap-2 p-1.5 bg-[#0D1014]/90 backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-card text-xs">
          <button
            onClick={resetCamera}
            title="Reset Camera View"
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-[#8B9199] hover:text-[#F4F4F5] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Reset View</span>
          </button>

          <div className="w-[1px] h-4 bg-white/10 mx-1" />

          {markers.map((m) => (
            <button
              key={m.id}
              onClick={() => focusEntity(m.id, m.position)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                selectedMarkerId === m.id
                  ? 'bg-[#F28C18] text-black font-bold shadow-sm'
                  : 'text-[#8B9199] hover:text-[#F4F4F5] hover:bg-white/5'
              }`}
            >
              {m.name}
            </button>
          ))}
        </div>
      </header>

      {/* Selected Entity Modal */}
      <ContextualEntityModal />

      {/* Bottom Subtle Navigation Hint */}
      <footer className="absolute bottom-6 inset-x-8 z-30 flex justify-center pointer-events-none">
        <div className="px-4 py-2 rounded-full bg-[#0D1014]/80 backdrop-blur-md border border-white/[0.08] text-[11px] text-[#8B9199] pointer-events-auto">
          Left Click + Drag to Rotate • Right Click to Pan • Scroll to Zoom • Click any landmark pin to inspect
        </div>
      </footer>
    </div>
  );
}
