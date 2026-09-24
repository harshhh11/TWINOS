'use client';

import React, { useState } from 'react';
import {
  Layers,
  Plane,
  Users,
  Shield,
  Zap,
  Building,
  Globe,
  Compass,
  Plus,
  Minus,
} from 'lucide-react';

const LAYERS = [
  { id: 'buildings', label: 'Buildings', color: 'bg-[#10B981]' },
  { id: 'flights', label: 'Flights', color: 'bg-[#3B82F6]' },
  { id: 'people-flow', label: 'People Flow', color: 'bg-[#3B82F6]' },
  { id: 'security', label: 'Security', color: 'bg-[#EF4444]' },
  { id: 'energy', label: 'Energy', color: 'bg-[#F59E0B]' },
  { id: 'assets', label: 'Assets', color: 'bg-[#6B7280]' },
  { id: 'environment', label: 'Environment', color: 'bg-[#06B6D4]' },
];

export function DigitalTwinControlsBar() {
  const [activeLayers, setActiveLayers] = useState<string[]>([
    'buildings',
    'flights',
    'people-flow',
    'security',
    'energy',
    'assets',
    'environment',
  ]);

  const toggleLayer = (layerId: string) => {
    setActiveLayers((prev) =>
      prev.includes(layerId) ? prev.filter((l) => l !== layerId) : [...prev, layerId]
    );
  };

  return (
    <div className="flex items-center gap-2 p-1.5 glass-card-solid rounded-full shadow-lg select-none text-xs">
      <div className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-[#10233F]">
        <Layers className="w-3.5 h-3.5 text-[#F26A21]" />
        <span>Layers</span>
        <span className="text-[#94A3B8]">→</span>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {LAYERS.map((layer) => {
          const isSelected = activeLayers.includes(layer.id);
          return (
            <button
              key={layer.id}
              onClick={() => toggleLayer(layer.id)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer whitespace-nowrap ${
                isSelected
                  ? 'bg-white text-[#10233F] shadow-2xs border border-slate-200/60'
                  : 'text-[#64748B] hover:bg-white/50'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${layer.color}`} />
              <span>{layer.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function MapFloatingTools() {
  return (
    <div className="flex flex-col gap-1.5 glass-card-solid rounded-2xl p-1.5 shadow-lg select-none text-xs">
      {/* Compass Needle */}
      <button
        title="Compass"
        className="w-8 h-8 rounded-xl bg-white hover:bg-[#F8FAFC] flex items-center justify-center text-[#64748B] hover:text-[#10233F] transition-all shadow-2xs cursor-pointer relative"
      >
        <div className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center">
          <div className="w-0.5 h-3 bg-gradient-to-t from-slate-400 to-[#EF4444] rounded-full" />
        </div>
      </button>

      {/* 2D Mode */}
      <button
        title="2D / 3D Mode"
        className="w-8 h-8 rounded-xl bg-white hover:bg-[#F8FAFC] flex items-center justify-center text-[11px] font-extrabold text-[#10233F] transition-all cursor-pointer shadow-2xs"
      >
        2D
      </button>

      <div className="w-full h-[1px] bg-slate-200/80 my-0.5" />

      {/* Zoom In */}
      <button
        title="Zoom In"
        className="w-8 h-8 rounded-xl bg-white hover:bg-[#F8FAFC] flex items-center justify-center text-[#64748B] hover:text-[#10233F] transition-all cursor-pointer shadow-2xs"
      >
        <Plus className="w-4 h-4" />
      </button>

      {/* Zoom Out */}
      <button
        title="Zoom Out"
        className="w-8 h-8 rounded-xl bg-white hover:bg-[#F8FAFC] flex items-center justify-center text-[#64748B] hover:text-[#10233F] transition-all cursor-pointer shadow-2xs"
      >
        <Minus className="w-4 h-4" />
      </button>

      {/* Layers Icon */}
      <button
        title="Layers"
        className="w-8 h-8 rounded-xl bg-white hover:bg-[#F8FAFC] flex items-center justify-center text-[#64748B] hover:text-[#10233F] transition-all cursor-pointer shadow-2xs"
      >
        <Layers className="w-4 h-4 text-[#10233F]" />
      </button>
    </div>
  );
}
