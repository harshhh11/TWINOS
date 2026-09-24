'use client';

import React from 'react';
import { Users, Plane, Zap, AlertTriangle } from 'lucide-react';
import { useTwinStore } from '@/lib/twin/twinStateStore';

export function TopKpiCards() {
  const { incidents } = useTwinStore();
  const activeIncidentCount = incidents.filter((i) => i.status !== 'RESOLVED').length;

  return (
    <div className="flex items-center gap-2 z-20 pointer-events-auto select-none">
      {/* 1. Total Passengers */}
      <div className="w-[140px] xl:w-[155px] bg-[#11151A]/88 backdrop-blur-md border border-white/[0.08] rounded-xl p-2.5 flex items-center gap-2.5 shadow-card">
        <div className="w-8 h-8 rounded-lg bg-[#15202B] flex items-center justify-center text-[#38BDF8] shrink-0">
          <Users className="w-3.5 h-3.5" />
        </div>
        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-[9px] text-[#8B9199] truncate font-medium">Total Passengers</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-xs font-bold text-[#F4F4F5]">12,482</span>
            <span className="text-[9px] font-semibold text-[#10B981]">↑ 8%</span>
          </div>
          <svg className="w-full h-1.5 mt-0.5 stroke-[#10B981] fill-none" viewBox="0 0 60 10">
            <path d="M0 8 Q 15 2, 30 6 T 60 2" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* 2. Airport Operations */}
      <div className="w-[140px] xl:w-[155px] bg-[#11151A]/88 backdrop-blur-md border border-white/[0.08] rounded-xl p-2.5 flex items-center gap-2.5 shadow-card">
        <div className="w-8 h-8 rounded-lg bg-[#142338] flex items-center justify-center text-[#3B82F6] shrink-0">
          <Plane className="w-3.5 h-3.5" />
        </div>
        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-[9px] text-[#8B9199] truncate font-medium">Airport Operations</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-xs font-bold text-[#F4F4F5]">286 Flights</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[8px] text-[#626870]">On time: 87%</span>
          </div>
          <svg className="w-full h-1.5 mt-0.5 stroke-[#3B82F6] fill-none" viewBox="0 0 60 10">
            <path d="M0 6 Q 20 9, 40 3 T 60 5" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* 3. Energy Consumption */}
      <div className="w-[140px] xl:w-[155px] bg-[#11151A]/88 backdrop-blur-md border border-white/[0.08] rounded-xl p-2.5 flex items-center gap-2.5 shadow-card">
        <div className="w-8 h-8 rounded-lg bg-[#122820] flex items-center justify-center text-[#10B981] shrink-0">
          <Zap className="w-3.5 h-3.5" />
        </div>
        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-[9px] text-[#8B9199] truncate font-medium">Energy Consumption</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-xs font-bold text-[#F4F4F5]">24,320</span>
            <span className="text-[9px] font-semibold text-[#10B981]">↓ 5%</span>
          </div>
          <svg className="w-full h-1.5 mt-0.5 stroke-[#10B981] fill-none" viewBox="0 0 60 10">
            <path d="M0 4 Q 15 8, 30 5 T 60 8" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* 4. Active Incidents */}
      <div className="w-[140px] xl:w-[155px] bg-[#11151A]/88 backdrop-blur-md border border-white/[0.08] rounded-xl p-2.5 flex items-center gap-2.5 shadow-card">
        <div className="w-8 h-8 rounded-lg bg-[#2D1619] flex items-center justify-center text-[#EF4444] shrink-0">
          <AlertTriangle className="w-3.5 h-3.5" />
        </div>
        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-[9px] text-[#8B9199] truncate font-medium">Active Incidents</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-xs font-bold text-[#F4F4F5]">{activeIncidentCount}</span>
            <span className="text-[9px] font-semibold text-[#10B981]">↓ 60%</span>
          </div>
          <svg className="w-full h-1.5 mt-0.5 stroke-[#EF4444] fill-none" viewBox="0 0 60 10">
            <path d="M0 8 Q 20 2, 40 6 T 60 3" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}
