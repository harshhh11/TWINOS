'use client';

import React from 'react';
import { Users, AlertTriangle } from 'lucide-react';
import { useTwinStore } from '@/lib/twin/twinStateStore';

interface LandmarkPin {
  id: string;
  name: string;
  subtitle: string;
  subtitleColor: string;
  iconType: 'runway' | 'terminal-a' | 'atc' | 'terminal-b' | 'parking';
  coords: [number, number, number];
  positionStyle: { left: string; top: string };
}

const LANDMARK_PINS: LandmarkPin[] = [
  {
    id: 'runway-1',
    name: 'Runway 1',
    subtitle: 'Operational',
    subtitleColor: 'text-[#10B981]',
    iconType: 'runway',
    coords: [-20, 0.4, -14],
    positionStyle: { left: '26%', top: '42%' },
  },
  {
    id: 'terminal-a',
    name: 'Terminal A',
    subtitle: '72% Occupancy',
    subtitleColor: 'text-[#F26A21]',
    iconType: 'terminal-a',
    coords: [-10, 2.5, 6],
    positionStyle: { left: '46%', top: '40%' },
  },
  {
    id: 'atc-tower',
    name: 'ATC Tower',
    subtitle: 'Normal',
    subtitleColor: 'text-[#10B981]',
    iconType: 'atc',
    coords: [14, 7.8, -9],
    positionStyle: { left: '68%', top: '34%' },
  },
  {
    id: 'terminal-b',
    name: 'Terminal B',
    subtitle: 'High Crowd',
    subtitleColor: 'text-[#EF4444]',
    iconType: 'terminal-b',
    coords: [11, 2.5, 3],
    positionStyle: { left: '69%', top: '45%' },
  },
  {
    id: 'parking',
    name: 'Parking',
    subtitle: '68% Occupied',
    subtitleColor: 'text-[#94A3B8]',
    iconType: 'parking',
    coords: [-16, 1.2, 14],
    positionStyle: { left: '68%', top: '60%' },
  },
];

export function SpatialLandmarkPins() {
  const { selectedMarkerId, focusEntity } = useTwinStore();

  return (
    <div className="absolute inset-0 pointer-events-none select-none z-20">
      {LANDMARK_PINS.map((pin) => {
        const isSelected = selectedMarkerId === pin.id;

        return (
          <button
            key={pin.id}
            onClick={() => focusEntity(pin.id, pin.coords)}
            style={{ left: pin.positionStyle.left, top: pin.positionStyle.top }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-2.5 px-3 py-1.5 rounded-2xl cursor-pointer pointer-events-auto transition-all shadow-md group ${
              isSelected
                ? 'bg-[#10233F] border-2 border-[#F26A21] text-white scale-105 shadow-lg'
                : 'glass-dark-tag hover:bg-[#10233F] text-white hover:scale-102'
            }`}
          >
            {pin.iconType === 'runway' && (
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              </div>
            )}
            {pin.iconType === 'terminal-a' && (
              <div className="w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center text-[#F26A21] shrink-0">
                <Users className="w-3 h-3" />
              </div>
            )}
            {pin.iconType === 'atc' && (
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                <span className="w-2 h-2 rounded-full bg-[#10B981]" />
              </div>
            )}
            {pin.iconType === 'terminal-b' && (
              <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center text-[#EF4444] shrink-0">
                <AlertTriangle className="w-3 h-3 animate-pulse" />
              </div>
            )}
            {pin.iconType === 'parking' && (
              <div className="w-5 h-5 rounded-full bg-slate-500/30 flex items-center justify-center text-[#94A3B8] shrink-0">
                <span className="text-[10px] font-black text-white">P</span>
              </div>
            )}

            <div className="flex flex-col text-left leading-tight">
              <span className="text-[11px] font-bold text-white tracking-tight">
                {pin.name}
              </span>
              <span className={`text-[10px] font-semibold ${pin.subtitleColor}`}>
                {pin.subtitle}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
