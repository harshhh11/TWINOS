'use client';

import React, { useState } from 'react';
import {
  Layers,
  ChevronDown,
  Settings,
  Plus,
  Minus,
  Compass,
} from 'lucide-react';
import { useTwinStore } from '@/lib/twin/twinStateStore';

const APPROVED_LAYERS = [
  { id: 'buildings', label: 'Buildings', dotColor: 'bg-emerald-400' },
  { id: 'assets', label: 'Assets', dotColor: 'bg-sky-400' },
  { id: 'energy', label: 'Energy', dotColor: 'bg-amber-400' },
  { id: 'incidents', label: 'Incidents', dotColor: 'bg-red-500' },
];

export function DigitalTwinControlsBar() {
  const { activeLayers, toggleLayer } = useTwinStore();

  return (
    <div className="flex items-center gap-2 select-none text-xs">
      {/* Layers Dropdown Pill */}
      <div className="flex items-center gap-2 px-3.5 py-1.5 bg-[#0B1220]/90 hover:bg-[#121B2E] backdrop-blur-md rounded-xl border border-white/[0.12] text-white font-semibold cursor-pointer shadow-lg transition-all">
        <Layers className="w-3.5 h-3.5 text-[#F26A21]" />
        <span>Layers</span>
        <ChevronDown className="w-3 h-3 text-gray-400 ml-0.5" />
      </div>

      {/* Layer Filters */}
      <div className="flex items-center gap-1.5">
        {APPROVED_LAYERS.map((layer) => {
          const isSelected = activeLayers[layer.id as keyof typeof activeLayers] ?? true;

          return (
            <button
              key={layer.id}
              onClick={() => toggleLayer(layer.id as any)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer backdrop-blur-md border shadow-md ${
                isSelected
                  ? 'bg-[#0B1220]/90 text-white border-white/[0.14]'
                  : 'bg-[#0B1220]/50 text-gray-500 border-white/[0.05] hover:text-gray-300'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${layer.dotColor} ${isSelected ? 'opacity-100' : 'opacity-40'}`} />
              <span>{layer.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function MapFloatingTools() {
  const { resetCamera } = useTwinStore();
  const [is3D, setIs3D] = useState(true);

  return (
    <div className="flex flex-col items-center gap-1 bg-[#0B1220]/90 backdrop-blur-md rounded-2xl p-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.5)] select-none text-xs border border-white/[0.12]">
      {/* North Compass Indicator */}
      <button
        onClick={resetCamera}
        title="Compass / Align North"
        className="w-8 h-8 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center transition-all cursor-pointer"
      >
        <div className="flex flex-col items-center justify-center leading-none">
          <span className="text-[10px] font-black text-red-500">N</span>
          <div className="w-1.5 h-2 bg-gradient-to-b from-red-500 to-gray-400 rounded-full" />
        </div>
      </button>

      {/* 2D / 3D Mode Toggle */}
      <div className="flex flex-col bg-white/[0.04] rounded-xl p-0.5 border border-white/[0.06]">
        <button
          onClick={() => setIs3D(true)}
          className={`w-7 h-6 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center justify-center ${
            is3D ? 'bg-white/20 text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          3D
        </button>
        <button
          onClick={() => setIs3D(false)}
          className={`w-7 h-6 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center justify-center ${
            !is3D ? 'bg-white/20 text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          2D
        </button>
      </div>

      {/* Settings Gear */}
      <button
        title="Settings"
        className="w-8 h-8 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-gray-400 hover:text-white transition-all cursor-pointer"
      >
        <Settings className="w-3.5 h-3.5" />
      </button>

      <div className="w-5 h-[1px] bg-white/[0.08] my-0.5" />

      {/* Zoom In */}
      <button
        title="Zoom In"
        className="w-8 h-8 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-gray-300 hover:text-white transition-all cursor-pointer"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>

      {/* Zoom Out */}
      <button
        title="Zoom Out"
        className="w-8 h-8 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-gray-300 hover:text-white transition-all cursor-pointer"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
