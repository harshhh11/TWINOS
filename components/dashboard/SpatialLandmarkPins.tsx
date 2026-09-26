'use client';

import React from 'react';
import { Plane, Building2, AlertTriangle, Zap } from 'lucide-react';
import { useTwinStore } from '@/lib/twin/twinStateStore';

interface LandmarkPin {
  id: string;
  name: string;
  statusText: string;
  statusColor: 'emerald' | 'amber';
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  coords: [number, number, number];
  positionStyle: { left: string; top: string };
}

// STRICTLY 4 MINIMAL OPERATIONAL STATUS MARKERS (Section 11)
const MINIMAL_STATUS_PINS: LandmarkPin[] = [
  {
    id: 'runway-1',
    name: 'Runway 1',
    statusText: 'Operational',
    statusColor: 'emerald',
    icon: Plane,
    iconBg: 'bg-sky-500/20',
    iconColor: 'text-sky-400',
    coords: [-5, 0.4, -45],
    positionStyle: { left: '25%', top: '36%' },
  },
  {
    id: 'terminal-a',
    name: 'Terminal A',
    statusText: 'Operational',
    statusColor: 'emerald',
    icon: Building2,
    iconBg: 'bg-emerald-500/20',
    iconColor: 'text-emerald-400',
    coords: [-25, 3, -2],
    positionStyle: { left: '29.5%', top: '56%' },
  },
  {
    id: 'terminal-b',
    name: 'Terminal B',
    statusText: 'Attention',
    statusColor: 'amber',
    icon: AlertTriangle,
    iconBg: 'bg-amber-500/20',
    iconColor: 'text-amber-400',
    coords: [2, 3, 10],
    positionStyle: { left: '50%', top: '42%' },
  },
  {
    id: 'energy-facility',
    name: 'Energy Facility',
    statusText: 'Normal',
    statusColor: 'emerald',
    icon: Zap,
    iconBg: 'bg-emerald-500/20',
    iconColor: 'text-emerald-400',
    coords: [45, 2, 25],
    positionStyle: { left: '76%', top: '65%' },
  },
];

export function SpatialLandmarkPins() {
  const { selectedMarkerId, focusEntity } = useTwinStore();

  return (
    <div className="absolute inset-0 pointer-events-none select-none z-20">
      {MINIMAL_STATUS_PINS.map((pin) => {
        const isSelected = selectedMarkerId === pin.id;
        const Icon = pin.icon;

        return (
          <button
            key={pin.id}
            onClick={() => focusEntity(pin.id, pin.coords)}
            style={{ left: pin.positionStyle.left, top: pin.positionStyle.top }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full cursor-pointer pointer-events-auto transition-all duration-200 group shadow-[0_8px_24px_rgba(0,0,0,0.6)] ${
              isSelected
                ? 'bg-[#0B1322] border-2 border-[#F26A21] scale-105 shadow-[0_0_20px_rgba(242,106,33,0.4)]'
                : 'bg-[#0C121E]/85 hover:bg-[#121B2E] backdrop-blur-xl border border-white/[0.12] hover:border-white/30 hover:scale-105'
            }`}
          >
            <div className={`w-4 h-4 rounded-full ${pin.iconBg} ${pin.iconColor} flex items-center justify-center shrink-0`}>
              <Icon className="w-2.5 h-2.5" />
            </div>

            <div className="flex items-center gap-1.5 text-left leading-none pr-0.5">
              <span className="text-[11px] font-semibold text-white tracking-tight">
                {pin.name}
              </span>
              <span className="text-gray-600 text-[9px]">•</span>
              <span
                className={`text-[10px] font-medium ${
                  pin.statusColor === 'emerald' ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {pin.statusText}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
