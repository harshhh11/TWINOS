'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import {
  ArrowLeft,
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
    <div className="relative w-screen h-screen overflow-hidden bg-[#0B101B] font-sans select-none">
      {/* 3D Scene Hero */}
      <div className="absolute inset-0 z-0">
        <AirportTwinScene />
      </div>

      {/* Top Floating Control Bar */}
      <header className="absolute top-6 inset-x-8 z-30 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/95 hover:bg-white text-[#0F172A] border border-[#E2E8F0] text-xs font-bold transition-all shadow-md"
          >
            <ArrowLeft className="w-4 h-4 text-[#EA580C]" />
            <span>Dashboard</span>
          </Link>

          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/95 backdrop-blur-md border border-[#E2E8F0] text-xs shadow-md">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-extrabold text-[#0F172A]">3D Digital Twin Explorer</span>
            <span className="text-[#64748B]">• Airport Environment</span>
          </div>
        </div>

        {/* Spatial Quick Jumps & Camera Reset */}
        <div className="flex items-center gap-2 p-1.5 bg-white/95 backdrop-blur-md border border-[#E2E8F0] rounded-2xl shadow-md text-xs">
          <button
            onClick={resetCamera}
            title="Reset Camera View"
            className="px-3 py-1.5 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] text-xs font-semibold text-[#64748B] hover:text-[#0F172A] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Reset View</span>
          </button>

          <div className="w-[1px] h-4 bg-[#E2E8F0] mx-1" />

          {markers.map((m) => (
            <button
              key={m.id}
              onClick={() => focusEntity(m.id, m.position)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedMarkerId === m.id
                  ? 'bg-[#EA580C] text-white font-bold shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
              }`}
            >
              {m.name}
            </button>
          ))}
        </div>
      </header>

      {/* Selected Entity Modal */}
      <ContextualEntityModal />

      {/* Bottom Navigation Hint */}
      <footer className="absolute bottom-6 inset-x-8 z-30 flex justify-center pointer-events-none">
        <div className="px-5 py-2.5 rounded-full bg-white/95 backdrop-blur-md border border-[#E2E8F0] text-xs font-medium text-[#64748B] shadow-md pointer-events-auto">
          Left Click + Drag to Rotate • Right Click to Pan • Scroll to Zoom • Click any landmark pin to inspect
        </div>
      </footer>
    </div>
  );
}
