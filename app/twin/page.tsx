'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import {
  ArrowLeft,
  Layers,
  Clock,
  Box,
  Compass,
  Maximize2,
  RefreshCw,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { useTwinStore } from '@/lib/twin/twinStateStore';
import { AirportLayerManager } from '@/components/dashboard/AirportLayerManager';
import { CompassControlWidget } from '@/components/dashboard/CompassControlWidget';
import { ContextualEntityModal } from '@/components/3d/ContextualEntityModal';

const AirportTwinScene = dynamic(
  () => import('@/components/3d/AirportTwinScene').then((mod) => mod.AirportTwinScene),
  { ssr: false }
);

const TIMELINE_SLOTS = [
  { hour: 8, label: '08:00 AM', tag: 'Morning Bank', occupancy: '52%' },
  { hour: 10, label: '10:00 AM', tag: 'Domestic Peak', occupancy: '68%' },
  { hour: 12, label: '12:00 PM', tag: 'Midday Departures', occupancy: '78%' },
  { hour: 14, label: '02:00 PM', tag: 'Transcontinental', occupancy: '74%' },
  { hour: 16, label: 'NOW (04:26 PM)', tag: 'Intl Arrival Bank', occupancy: '88% (High Crowd)' },
];

export default function TwinExplorerPage() {
  const {
    historicalHour,
    setHistoricalHour,
    markers,
    focusEntity,
    resetCamera,
    selectedMarkerId,
  } = useTwinStore();

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-twin-bg font-sans select-none">
      {/* 3D Scene Hero */}
      <div className="absolute inset-0 z-0">
        <AirportTwinScene />
      </div>

      {/* Top Floating Control Bar */}
      <header className="absolute top-6 inset-x-8 z-30 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#12161E]/85 hover:bg-[#1A202A] backdrop-blur-xl border border-white/10 text-xs font-semibold text-white transition-all shadow-glass"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </Link>

          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#12161E]/85 backdrop-blur-xl border border-white/10 text-xs text-white/80 shadow-glass">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-white">Full-Screen Twin Explorer</span>
            <span className="text-white/40">• Spatial Navigation</span>
          </div>
        </div>

        {/* Spatial Quick Jumps */}
        <div className="flex items-center gap-2 p-1 bg-[#12161E]/85 backdrop-blur-xl border border-white/10 rounded-full shadow-glass text-xs">
          {markers.map((m) => (
            <button
              key={m.id}
              onClick={() => focusEntity(m.id, m.position)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                selectedMarkerId === m.id
                  ? 'bg-twin-orange text-white shadow-orange-glow font-bold'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              {m.name}
            </button>
          ))}
        </div>
      </header>

      {/* Right Compass & Zoom Widget */}
      <div className="absolute right-8 top-24 z-30 pointer-events-auto">
        <CompassControlWidget />
      </div>

      {/* Selected Entity Modal */}
      <ContextualEntityModal />

      {/* Bottom Floating Control Deck: Historical Replay Timeline + Layers */}
      <footer className="absolute bottom-6 inset-x-8 z-30 flex flex-col items-center gap-3 pointer-events-auto">
        {/* Layer Selector */}
        <AirportLayerManager />

        {/* Historical Timeline Replay Slider */}
        <div className="w-full max-w-2xl bg-[#12161E]/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-3 shadow-glass flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-white shrink-0 pl-1">
            <Clock className="w-4 h-4 text-twin-orange" />
            <span>Historical Replay:</span>
          </div>

          <div className="flex-1 flex items-center justify-between gap-2">
            {TIMELINE_SLOTS.map((slot) => {
              const isSelected = historicalHour === slot.hour;

              return (
                <button
                  key={slot.hour}
                  onClick={() => setHistoricalHour(slot.hour)}
                  className={`flex-1 py-1.5 px-2 rounded-xl text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-orange-glow font-bold scale-105'
                      : 'bg-white/5 hover:bg-white/10 text-white/60 hover:text-white'
                  }`}
                >
                  <div className="text-[11px] leading-tight">{slot.label}</div>
                  <div className="text-[9px] opacity-75">{slot.occupancy}</div>
                </button>
              );
            })}
          </div>
        </div>
      </footer>
    </div>
  );
}
