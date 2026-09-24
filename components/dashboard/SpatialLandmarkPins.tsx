'use client';

import React from 'react';
import { Users, AlertTriangle, ShieldCheck, Car } from 'lucide-react';
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
    positionStyle: { left: '25%', top: '44%' },
  },
  {
    id: 'terminal-a',
    name: 'Terminal A',
    subtitle: '72% Occupancy',
    subtitleColor: 'text-[#F28C18]',
    iconType: 'terminal-a',
    coords: [-10, 2.5, 6],
    positionStyle: { left: '41%', top: '37%' },
  },
  {
    id: 'atc-tower',
    name: 'ATC Tower',
    subtitle: 'Normal',
    subtitleColor: 'text-[#10B981]',
    iconType: 'atc',
    coords: [14, 7.8, -9],
    positionStyle: { left: '65%', top: '34%' },
  },
  {
    id: 'terminal-b',
    name: 'Terminal B',
    subtitle: 'High Crowd',
    subtitleColor: 'text-[#EF4444]',
    iconType: 'terminal-b',
    coords: [11, 2.5, 3],
    positionStyle: { left: '66%', top: '44%' },
  },
  {
    id: 'parking',
    name: 'Parking',
    subtitle: '68% Occupied',
    subtitleColor: 'text-[#F28C18]',
    iconType: 'parking',
    coords: [16, 1.4, 15],
    positionStyle: { left: '63%', top: '58%' },
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
            className={`absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-2.5 px-3 py-1.5 rounded-xl cursor-pointer pointer-events-auto transition-all shadow-card group ${
              isSelected
                ? 'bg-[#1D1711] border border-[#F28C18] text-[#F4F4F5] scale-105'
                : 'bg-[#0E1217]/90 hover:bg-[#151A21] border border-white/[0.08] hover:border-white/20 text-[#F4F4F5]'
            }`}
          >
            {/* Custom Icon By Type matching Reference 2 */}
            {pin.iconType === 'runway' && (
              <div className="w-5 h-5 rounded-lg bg-[#122820] flex items-center justify-center shrink-0">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
              </div>
            )}
            {pin.iconType === 'terminal-a' && (
              <div className="w-5 h-5 rounded-lg bg-[#251A14] flex items-center justify-center text-[#F28C18] shrink-0">
                <Users className="w-3.5 h-3.5" />
              </div>
            )}
            {pin.iconType === 'atc' && (
              <div className="w-5 h-5 rounded-lg bg-[#122820] flex items-center justify-center shrink-0">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
              </div>
            )}
            {pin.iconType === 'terminal-b' && (
              <div className="w-5 h-5 rounded-lg bg-[#2D1619] flex items-center justify-center text-[#EF4444] shrink-0">
                <AlertTriangle className="w-3.5 h-3.5" />
              </div>
            )}
            {pin.iconType === 'parking' && (
              <div className="w-5 h-5 rounded-lg bg-[#142338] flex items-center justify-center text-[#38BDF8] shrink-0 font-bold text-[11px]">
                P
              </div>
            )}

            {/* Title & Subtitle */}
            <div className="flex flex-col text-left leading-tight">
              <span className="text-[11px] font-semibold text-[#F4F4F5]">
                {pin.name}
              </span>
              <span className={`text-[10px] font-medium ${pin.subtitleColor}`}>
                {pin.subtitle}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
