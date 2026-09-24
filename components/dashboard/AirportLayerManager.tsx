'use client';

import React from 'react';
import { Layers } from 'lucide-react';
import { useTwinStore } from '@/lib/twin/twinStateStore';
import { TwinLayerType } from '@/types';

interface LayerOption {
  type: TwinLayerType;
  label: string;
  dotColor: string;
}

const LAYER_OPTIONS: LayerOption[] = [
  { type: 'buildings', label: 'Buildings', dotColor: 'bg-[#10B981]' },
  { type: 'flights', label: 'Flights', dotColor: 'bg-[#3B82F6]' },
  { type: 'people', label: 'People Flow', dotColor: 'bg-[#38BDF8]' },
  { type: 'security', label: 'Security', dotColor: 'bg-[#EF4444]' },
  { type: 'energy', label: 'Energy', dotColor: 'bg-[#F28C18]' },
  { type: 'assets', label: 'Assets', dotColor: 'bg-[#8D939B]' },
  { type: 'environment', label: 'Environment', dotColor: 'bg-[#06B6D4]' },
];

export function AirportLayerManager() {
  const { activeLayers, toggleLayer } = useTwinStore();

  return (
    <div className="flex items-center gap-1.5 p-1 bg-[#11151A]/90 backdrop-blur-md border border-white/[0.08] rounded-full z-20 pointer-events-auto select-none shadow-card">
      {/* Lead Pill */}
      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#080A0D] border border-white/[0.08] text-xs font-semibold text-[#F4F4F5] shadow-inner">
        <Layers className="w-3.5 h-3.5 text-[#F28C18]" />
        <span>Layers</span>
        <span className="text-xs text-[#8B9199]">→</span>
      </div>

      {/* Layer Toggle Chips */}
      {LAYER_OPTIONS.map((layer) => {
        const isActive = activeLayers[layer.type];

        return (
          <button
            key={layer.type}
            onClick={() => toggleLayer(layer.type)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
              isActive
                ? 'bg-[#1A2029] text-[#F4F4F5] border border-white/[0.08] shadow-sm'
                : 'text-[#8B9199] hover:text-[#F4F4F5] hover:bg-[#151A21] border border-transparent'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${layer.dotColor} ${
                isActive ? 'opacity-100 shadow-sm' : 'opacity-40'
              }`}
            />
            <span>{layer.label}</span>
          </button>
        );
      })}
    </div>
  );
}
