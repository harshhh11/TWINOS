'use client';

import React from 'react';
import { Users, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';
import { useTwinStore } from '@/lib/twin/twinStateStore';

interface LandmarkPin {
  id: string;
  name: string;
  subtitle: string;
  subtitleColor: string;
  iconType: 'runway' | 'terminal-a' | 'atc' | 'terminal-b' | 'energy';
  coords: [number, number, number];
  positionStyle: { left: string; top: string };
}

const LANDMARK_PINS: LandmarkPin[] = [
  {
    id: 'runway-1',
    name: 'Runway 1 (09L/27R)',
    subtitle: 'Operational',
    subtitleColor: 'text-[#10B981]',
    iconType: 'runway',
    coords: [-20, 0.4, -14],
    positionStyle: { left: '25%', top: '44%' },
  },
  {
    id: 'terminal-a',
    name: 'Terminal A',
    subtitle: 'Nominal Flow',
    subtitleColor: 'text-[#10B981]',
    iconType: 'terminal-a',
    coords: [-10, 2.5, 6],
    positionStyle: { left: '41%', top: '37%' },
  },
  {
    id: 'atc-tower',
    name: 'ATC Tower',
    subtitle: 'Telemetry 100%',
    subtitleColor: 'text-[#10B981]',
    iconType: 'atc',
    coords: [14, 7.8, -9],
    positionStyle: { left: '65%', top: '34%' },
  },
  {
    id: 'terminal-b',
    name: 'Terminal B',
    subtitle: 'High Density Alert',
    subtitleColor: 'text-[#EF4444]',
    iconType: 'terminal-b',
    coords: [11, 2.5, 3],
    positionStyle: { left: '66%', top: '44%' },
  },
  {
    id: 'energy-hub',
    name: 'Substation South',
    subtitle: '24.3 MW Load',
    subtitleColor: 'text-[#F28C18]',
    iconType: 'energy',
    coords: [-16, 1.2, 14],
    positionStyle: { left: '33%', top: '64%' },
  },
];

export function SpatialLandmarkPins() {
  const { selectedMarkerId, focusEntity } = useTwinStore();

  return (
    <div className="absolute inset-0 pointer-events-none select-none z-10">
      {LANDMARK_PINS.map((pin) => {
        const isSelected = selectedMarkerId === pin.id;

        return (
          <button
            key={pin.id}
            onClick={() => focusEntity(pin.id, pin.coords)}
            style={{ left: pin.positionStyle.left, top: pin.positionStyle.top }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 px-2.5 py-1.5 rounded-xl cursor-pointer pointer-events-auto transition-all shadow-card group backdrop-blur-md ${
              isSelected
                ? 'bg-[#1D1711] border border-[#F28C18] text-[#F4F4F5] scale-105'
                : 'bg-[#0E1217]/90 hover:bg-[#151A21] border border-white/[0.08] hover:border-white/20 text-[#F4F4F5]'
            }`}
          >
            {pin.iconType === 'runway' && (
              <div className="w-4.5 h-4.5 rounded-md bg-[#122820] flex items-center justify-center shrink-0">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              </div>
            )}
            {pin.iconType === 'terminal-a' && (
              <div className="w-4.5 h-4.5 rounded-md bg-[#122820] flex items-center justify-center text-[#10B981] shrink-0">
                <Users className="w-3 h-3" />
              </div>
            )}
            {pin.iconType === 'atc' && (
              <div className="w-4.5 h-4.5 rounded-md bg-[#122820] flex items-center justify-center shrink-0">
                <span className="w-2 h-2 rounded-full bg-[#10B981]" />
              </div>
            )}
            {pin.iconType === 'terminal-b' && (
              <div className="w-4.5 h-4.5 rounded-md bg-[#2D1619] flex items-center justify-center text-[#EF4444] shrink-0">
                <AlertTriangle className="w-3 h-3 animate-pulse" />
              </div>
            )}
            {pin.iconType === 'energy' && (
              <div className="w-4.5 h-4.5 rounded-md bg-[#251A14] flex items-center justify-center text-[#F28C18] shrink-0">
                <Zap className="w-3 h-3" />
              </div>
            )}

            <div className="flex flex-col text-left leading-tight">
              <span className="text-[11px] font-semibold text-[#F4F4F5]">
                {pin.name}
              </span>
              <span className={`text-[9px] font-medium ${pin.subtitleColor}`}>
                {pin.subtitle}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
