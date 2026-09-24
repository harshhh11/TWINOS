'use client';

import React, { useState } from 'react';
import {
  Layers,
  Building,
  Cpu,
  Zap,
  ShieldAlert,
  Compass,
  Plus,
  Minus,
} from 'lucide-react';

export function DigitalTwinControlsBar() {
  const [activeLayers, setActiveLayers] = useState<string[]>([
    'Buildings',
    'Assets',
    'Energy',
    'Incidents',
  ]);

  const toggleLayer = (layer: string) => {
    setActiveLayers((prev) =>
      prev.includes(layer) ? prev.filter((l) => l !== layer) : [...prev, layer]
    );
  };

  return (
    <div className="flex items-center gap-1.5 p-1.5 bg-white/95 backdrop-blur-md rounded-full border border-white/80 shadow-md select-none text-xs">
      <div className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-[#0F172A]">
        <Layers className="w-3.5 h-3.5 text-[#EA580C]" />
        <span>Layers</span>
        <span className="text-[#94A3B8]">→</span>
      </div>

      <button
        onClick={() => toggleLayer('Buildings')}
        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
          activeLayers.includes('Buildings')
            ? 'bg-[#F0FDF4] text-[#16A34A] border border-[#DCFCE7]'
            : 'text-[#64748B] hover:bg-[#F8FAFC]'
        }`}
      >
        <span className="w-2 h-2 rounded-full bg-emerald-500" />
        <span>Buildings</span>
      </button>

      <button
        onClick={() => toggleLayer('Assets')}
        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
          activeLayers.includes('Assets')
            ? 'bg-[#EFF6FF] text-[#2563EB] border border-[#DBEAFE]'
            : 'text-[#64748B] hover:bg-[#F8FAFC]'
        }`}
      >
        <span className="w-2 h-2 rounded-full bg-blue-500" />
        <span>Assets</span>
      </button>

      <button
        onClick={() => toggleLayer('Energy')}
        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
          activeLayers.includes('Energy')
            ? 'bg-[#FEFCE8] text-[#CA8A04] border border-[#FEF08A]'
            : 'text-[#64748B] hover:bg-[#F8FAFC]'
        }`}
      >
        <span className="w-2 h-2 rounded-full bg-amber-500" />
        <span>Energy</span>
      </button>

      <button
        onClick={() => toggleLayer('Incidents')}
        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
          activeLayers.includes('Incidents')
            ? 'bg-[#FEF2F2] text-[#DC2626] border border-[#FEE2E2]'
            : 'text-[#64748B] hover:bg-[#F8FAFC]'
        }`}
      >
        <span className="w-2 h-2 rounded-full bg-red-500" />
        <span>Incidents</span>
      </button>
    </div>
  );
}

export function MapFloatingTools() {
  return (
    <div className="flex flex-col gap-1.5 bg-white/95 backdrop-blur-md rounded-2xl p-1 border border-white/80 shadow-md select-none text-xs">
      <button
        title="Compass"
        className="w-8 h-8 rounded-xl bg-white hover:bg-[#F8FAFC] flex items-center justify-center text-[#64748B] hover:text-[#0F172A] transition-colors shadow-2xs"
      >
        <Compass className="w-4 h-4 text-[#EA580C]" />
      </button>

      <button
        title="2D / 3D Mode"
        className="w-8 h-8 rounded-xl bg-[#F8FAFC] hover:bg-white flex items-center justify-center text-[10px] font-extrabold text-[#0F172A] transition-colors"
      >
        2D
      </button>

      <div className="w-full h-[1px] bg-[#E2E8F0] my-0.5" />

      <button
        title="Zoom In"
        className="w-8 h-8 rounded-xl bg-white hover:bg-[#F8FAFC] flex items-center justify-center text-[#64748B] hover:text-[#0F172A] transition-colors"
      >
        <Plus className="w-4 h-4" />
      </button>

      <button
        title="Zoom Out"
        className="w-8 h-8 rounded-xl bg-white hover:bg-[#F8FAFC] flex items-center justify-center text-[#64748B] hover:text-[#0F172A] transition-colors"
      >
        <Minus className="w-4 h-4" />
      </button>

      <button
        title="Layers"
        className="w-8 h-8 rounded-xl bg-white hover:bg-[#F8FAFC] flex items-center justify-center text-[#64748B] hover:text-[#0F172A] transition-colors"
      >
        <Layers className="w-4 h-4" />
      </button>
    </div>
  );
}
