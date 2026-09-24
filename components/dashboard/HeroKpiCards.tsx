'use client';

import React from 'react';
import {
  Users,
  Plane,
  Zap,
  AlertTriangle,
} from 'lucide-react';

export function HeroKpiCards() {
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-2.5 select-none">
      {/* 1. Total Passengers */}
      <div className="glass-card-solid rounded-2xl p-3 flex items-center gap-3 transition-all hover:bg-white shadow-sm">
        <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] flex items-center justify-center text-[#2563EB] shrink-0 border border-[#DBEAFE]">
          <Users className="w-4 h-4" />
        </div>
        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-[10px] font-medium text-[#64748B]">Total Passengers</span>
          <div className="flex items-baseline justify-between gap-1 mt-0.5">
            <span className="text-base font-extrabold text-[#10233F] tracking-tight">12,482</span>
            <span className="text-[9px] font-bold text-[#18A875] bg-[#ECFDF5] border border-[#D1FAE5] px-1.5 py-0.5 rounded-full flex items-center shrink-0">
              ↑ 8%
            </span>
          </div>
        </div>
      </div>

      {/* 2. Airport Operations */}
      <div className="glass-card-solid rounded-2xl p-3 flex items-center gap-3 transition-all hover:bg-white shadow-sm">
        <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] flex items-center justify-center text-[#2563EB] shrink-0 border border-[#DBEAFE]">
          <Plane className="w-4 h-4" />
        </div>
        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-[10px] font-medium text-[#64748B]">Airport Operations</span>
          <div className="flex items-baseline justify-between gap-1 mt-0.5">
            <div className="flex items-baseline gap-1">
              <span className="text-base font-extrabold text-[#10233F] tracking-tight">286</span>
              <span className="text-[10px] font-medium text-[#64748B]">Flights</span>
            </div>
            <span className="text-[9px] font-medium text-[#64748B] shrink-0">
              On time: 87%
            </span>
          </div>
        </div>
      </div>

      {/* 3. Energy Consumption */}
      <div className="glass-card-solid rounded-2xl p-3 flex items-center gap-3 transition-all hover:bg-white shadow-sm">
        <div className="w-9 h-9 rounded-xl bg-[#ECFDF5] flex items-center justify-center text-[#059669] shrink-0 border border-[#A7F3D0]">
          <Zap className="w-4 h-4" />
        </div>
        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-[10px] font-medium text-[#64748B]">Energy Consumption</span>
          <div className="flex items-baseline justify-between gap-1 mt-0.5">
            <div className="flex items-baseline gap-1">
              <span className="text-base font-extrabold text-[#10233F] tracking-tight">24,320</span>
              <span className="text-[10px] font-medium text-[#64748B]">kWh</span>
            </div>
            <span className="text-[9px] font-bold text-[#18A875] bg-[#ECFDF5] border border-[#D1FAE5] px-1.5 py-0.5 rounded-full flex items-center shrink-0">
              ↓ 5%
            </span>
          </div>
        </div>
      </div>

      {/* 4. Active Incidents */}
      <div className="glass-card-solid rounded-2xl p-3 flex items-center gap-3 transition-all hover:bg-white shadow-sm">
        <div className="w-9 h-9 rounded-xl bg-[#FEF2F2] flex items-center justify-center text-[#D94A4A] shrink-0 border border-[#FEE2E2]">
          <AlertTriangle className="w-4 h-4" />
        </div>
        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-[10px] font-medium text-[#64748B]">Active Incidents</span>
          <div className="flex items-center justify-between gap-1 mt-0.5">
            <div className="flex items-center gap-1.5">
              <span className="text-base font-extrabold text-[#10233F] tracking-tight">2</span>
              <span className="text-[9px] font-bold text-[#18A875] flex items-center">
                ↓ 60%
              </span>
            </div>
            {/* Mini Red Sparkline Line */}
            <div className="w-10 h-3 flex items-end shrink-0">
              <svg className="w-full h-full" viewBox="0 0 40 12">
                <path
                  d="M0 8 Q 10 2, 20 7 T 40 3"
                  fill="none"
                  stroke="#D94A4A"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
