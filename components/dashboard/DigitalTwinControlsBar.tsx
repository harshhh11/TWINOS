'use client';

import React, { useState } from 'react';
import {
  Layers,
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
    <div className="flex items-center gap-1.5 p-1.5 glass-pill rounded-full shadow-md select-none text-xs">
      <div className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-[#10233F]">
        <Layers className="w-3.5 h-3.5 text-[#F26A21]" />
        <span>Layers</span>
        <span className="text-[#94A3B8]">→</span>
      </div>

      <button
        onClick={() => toggleLayer('Buildings')}
        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
          activeLayers.includes('Buildings')
            ? 'bg-[#18A875]/15 text-[#18A875] border border-[#18A875]/30 shadow-xs'
            : 'text-[#64748B] hover:bg-white/60'
        }`}
      >
        <span className="w-2 h-2 rounded-full bg-[#18A875]" />
        <span>Buildings</span>
      </button>

      <button
        onClick={() => toggleLayer('Assets')}
        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
          activeLayers.includes('Assets')
            ? 'bg-[#2563EB]/15 text-[#2563EB] border border-[#2563EB]/30 shadow-xs'
            : 'text-[#64748B] hover:bg-white/60'
        }`}
      >
        <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
        <span>Assets</span>
      </button>

      <button
        onClick={() => toggleLayer('Energy')}
        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
          activeLayers.includes('Energy')
            ? 'bg-[#E6A11A]/15 text-[#E6A11A] border border-[#E6A11A]/30 shadow-xs'
            : 'text-[#64748B] hover:bg-white/60'
        }`}
      >
        <span className="w-2 h-2 rounded-full bg-[#E6A11A]" />
        <span>Energy</span>
      </button>

      <button
        onClick={() => toggleLayer('Incidents')}
        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
          activeLayers.includes('Incidents')
            ? 'bg-[#D94A4A]/15 text-[#D94A4A] border border-[#D94A4A]/30 shadow-xs'
            : 'text-[#64748B] hover:bg-white/60'
        }`}
      >
        <span className="w-2 h-2 rounded-full bg-[#D94A4A]" />
        <span>Incidents</span>
      </button>
    </div>
  );
}

export function MapFloatingTools() {
  return (
    <div className="flex flex-col gap-1.5 glass-card rounded-2xl p-1.5 shadow-md select-none text-xs">
      <button
        title="Compass"
        className="w-8 h-8 rounded-xl bg-white/80 hover:bg-white flex items-center justify-center text-[#64748B] hover:text-[#10233F] transition-all shadow-2xs cursor-pointer"
      >
        <Compass className="w-4 h-4 text-[#F26A21]" />
      </button>

      <button
        title="2D / 3D Mode"
        className="w-8 h-8 rounded-xl bg-white/90 hover:bg-white flex items-center justify-center text-[10px] font-extrabold text-[#10233F] transition-all cursor-pointer shadow-2xs"
      >
        2D
      </button>

      <div className="w-full h-[1px] bg-slate-200/80 my-0.5" />

      <button
        title="Zoom In"
        className="w-8 h-8 rounded-xl bg-white/80 hover:bg-white flex items-center justify-center text-[#64748B] hover:text-[#10233F] transition-all cursor-pointer shadow-2xs"
      >
        <Plus className="w-4 h-4" />
      </button>

      <button
        title="Zoom Out"
        className="w-8 h-8 rounded-xl bg-white/80 hover:bg-white flex items-center justify-center text-[#64748B] hover:text-[#10233F] transition-all cursor-pointer shadow-2xs"
      >
        <Minus className="w-4 h-4" />
      </button>

      <button
        title="Layers"
        className="w-8 h-8 rounded-xl bg-white/80 hover:bg-white flex items-center justify-center text-[#64748B] hover:text-[#10233F] transition-all cursor-pointer shadow-2xs"
      >
        <Layers className="w-4 h-4" />
      </button>
    </div>
  );
}
