'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import {
  ArrowLeft,
  RotateCw,
  Layers,
  Users,
} from 'lucide-react';
import { useTwinStore } from '@/lib/twin/twinStateStore';
import { ContextualEntityModal } from '@/components/3d/ContextualEntityModal';

const AirportTwinScene = dynamic(
  () => import('@/components/3d/AirportTwinScene').then((mod) => mod.AirportTwinScene),
  { ssr: false }
);

interface NavPreset {
  id: string;
  label: string;
  position: [number, number, number];
}

const PRESET_LOCATIONS: NavPreset[] = [
  { id: 'terminal-a', label: 'Terminal A', position: [-22, 3.2, 8] },
  { id: 'terminal-b', label: 'Terminal B', position: [-2, 3.0, 4] },
  { id: 'terminal-c', label: 'Terminal C', position: [18, 3.2, 8] },
  { id: 'terminal-d', label: 'Terminal D', position: [36, 2.8, 14] },
  { id: 'runway-1', label: 'Runway 01', position: [-38, 0.4, -26] },
  { id: 'runway-2', label: 'Runway 02', position: [26, 0.4, -42] },
  { id: 'atc-tower', label: 'ATC Tower', position: [4, 10.5, -16] },
  { id: 'parking-garage', label: 'Parking', position: [-2, 2.2, 26] },
  { id: 'energy-hub', label: 'Central Energy Facility', position: [-32, 1.8, 28] },
  { id: 'cargo-hub', label: 'Cargo Hub', position: [42, 2.4, -12] },
];

const OPERATIONAL_LAYERS = [
  { id: 'ALL', label: 'All Layers' },
  { id: 'BUILDINGS', label: 'Buildings' },
  { id: 'ASSETS', label: 'Assets' },
  { id: 'OPERATIONS', label: 'Operations' },
  { id: 'ENERGY', label: 'Energy' },
  { id: 'INCIDENTS', label: 'Incidents' },
  { id: 'DEPENDENCIES', label: 'Dependencies' },
] as const;

export default function TwinExplorerPage() {
  const {
    focusEntity,
    resetCamera,
    selectedMarkerId,
    activeLayer,
    setActiveLayer,
  } = useTwinStore();

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#080A0D] font-sans select-none">
      {/* 1. HERO 3D DIGITAL TWIN VIEWPORT (Full Campus Masterplan) */}
      <div className="absolute inset-0 z-0">
        <AirportTwinScene />
      </div>

      {/* 2. TOP UNIFIED NAVIGATION & LAYER FILTER BAR */}
      <header className="absolute top-4 inset-x-6 z-30 flex flex-col gap-2 pointer-events-auto">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {/* Left: Back to Dashboard & Digital Twin Title */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0D1014]/90 hover:bg-[#151A21] backdrop-blur-xl border border-white/[0.08] hover:border-white/20 text-xs font-semibold text-[#F4F4F5] transition-all shadow-card"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#8B9199]" />
              <span>Dashboard</span>
            </Link>

            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0D1014]/90 backdrop-blur-xl border border-white/[0.08] text-xs text-[#8B9199] shadow-card">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold text-[#F4F4F5]">3D Digital Twin Explorer</span>
              <span>• Airport Operations Hub</span>
            </div>
          </div>

          {/* Right: Camera Presets & Reset View Controls */}
          <div className="flex items-center gap-1.5 p-1.5 bg-[#0D1014]/90 backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-card text-xs flex-wrap">
            {/* Reset View Button */}
            <button
              onClick={resetCamera}
              title="Reset Camera View to Campus Overview"
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-[#8B9199] hover:text-[#F4F4F5] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Reset View</span>
            </button>

            {/* Crowd Operations 3D Cutaway Direct Jump */}
            <Link
              href="/crowd"
              title="Jump into Terminal B 3D Crowd Management View"
              className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-xs font-bold text-rose-300 border border-rose-500/30 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Users className="w-3.5 h-3.5 text-rose-400" />
              <span>Crowd 3D Cutaway</span>
            </Link>

            <div className="w-[1px] h-4 bg-white/10 mx-1 hidden sm:block" />

            {/* Predefined Camera Locations */}
            {PRESET_LOCATIONS.map((loc) => {
              const isSelected = selectedMarkerId === loc.id;
              return (
                <button
                  key={loc.id}
                  onClick={() => focusEntity(loc.id, loc.position)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#F28C18] text-black font-bold shadow-sm'
                      : 'text-[#8B9199] hover:text-[#F4F4F5] hover:bg-white/5'
                  }`}
                >
                  {loc.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Operational Layers Filter Bar */}
        <div className="self-start flex items-center gap-1.5 p-1 bg-[#0D1014]/85 backdrop-blur-xl border border-white/[0.08] rounded-xl shadow-card">
          <div className="flex items-center gap-1.5 px-2 text-[10px] font-semibold text-[#8B9199] uppercase tracking-wider">
            <Layers className="w-3 h-3 text-[#F28C18]" />
            <span>Layers:</span>
          </div>
          {OPERATIONAL_LAYERS.map((layer) => (
            <button
              key={layer.id}
              onClick={() => setActiveLayer(layer.id as any)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                activeLayer === layer.id
                  ? 'bg-white/15 text-[#F4F4F5] font-semibold'
                  : 'text-[#8B9199] hover:text-[#F4F4F5] hover:bg-white/5'
              }`}
            >
              {layer.label}
            </button>
          ))}
        </div>
      </header>

      {/* 3. CONTEXTUAL ASSET INSPECTION PANEL */}
      <ContextualEntityModal />

      {/* 4. BOTTOM INTERACTION & MULTI-SCALE HINT */}
      <footer className="absolute bottom-5 inset-x-6 z-30 flex justify-between items-center pointer-events-none gap-4">
        {/* Multi-Scale Hierarchy Badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0D1014]/85 backdrop-blur-md border border-white/[0.08] text-[11px] text-[#8B9199] pointer-events-auto shadow-card">
          <span className="text-[#F28C18] font-bold">L1</span> Campus Overview → <span className="text-[#38BDF8] font-bold">L2</span> Terminal Concourse → <span className="text-emerald-400 font-bold">L3</span> Subsystem Telemetry
        </div>

        {/* Interaction Controls */}
        <div className="px-4 py-1.5 rounded-full bg-[#0D1014]/85 backdrop-blur-md border border-white/[0.08] text-[11px] text-[#8B9199] shadow-card pointer-events-auto">
          Left-Click: <span className="text-[#F4F4F5]">Rotate</span> • Right-Click: <span className="text-[#F4F4F5]">Pan</span> • Scroll: <span className="text-[#F4F4F5]">Zoom</span> • Click any facility to inspect
        </div>
      </footer>
    </main>
  );
}
