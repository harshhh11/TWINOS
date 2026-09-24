'use client';

import React from 'react';
import {
  Activity,
  Cpu,
  Zap,
  AlertTriangle,
} from 'lucide-react';
import { useTwinStore } from '@/lib/twin/twinStateStore';

export function HeroKpiCards() {
  const { activeIncidentCount } = useTwinStore();

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 select-none">
      {/* 1. System Status */}
      <div className="glass-card rounded-[20px] p-3.5 flex items-center gap-3 transition-all hover:bg-white/90">
        <div className="w-10 h-10 rounded-2xl bg-[#EFF6FF] flex items-center justify-center text-[#2563EB] shrink-0 border border-[#DBEAFE]">
          <Activity className="w-5 h-5" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-[11px] font-medium text-[#64748B]">System Status</span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-base font-extrabold text-[#10233F]">Nominal</span>
            <span className="text-[10px] font-bold text-[#18A875] bg-[#ECFDF5] border border-[#D1FAE5] px-1.5 py-0.5 rounded-full flex items-center">
              99.8%
            </span>
          </div>
        </div>
      </div>

      {/* 2. Asset Health */}
      <div className="glass-card rounded-[20px] p-3.5 flex items-center gap-3 transition-all hover:bg-white/90">
        <div className="w-10 h-10 rounded-2xl bg-[#F0FDF4] flex items-center justify-center text-[#16A34A] shrink-0 border border-[#DCFCE7]">
          <Cpu className="w-5 h-5" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-[11px] font-medium text-[#64748B]">Asset Health</span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-base font-extrabold text-[#10233F]">94.2%</span>
            <span className="text-[10px] font-semibold text-[#64748B]">Optimal</span>
          </div>
        </div>
      </div>

      {/* 3. Energy Consumption */}
      <div className="glass-card rounded-[20px] p-3.5 flex items-center gap-3 transition-all hover:bg-white/90">
        <div className="w-10 h-10 rounded-2xl bg-[#ECFDF5] flex items-center justify-center text-[#059669] shrink-0 border border-[#A7F3D0]">
          <Zap className="w-5 h-5" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-[11px] font-medium text-[#64748B]">Energy Usage</span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-base font-extrabold text-[#10233F]">24,320</span>
            <span className="text-[10px] font-bold text-[#18A875] flex items-center">
              ↓ 5%
            </span>
          </div>
        </div>
      </div>

      {/* 4. Active Alerts */}
      <div className="glass-card rounded-[20px] p-3.5 flex items-center gap-3 transition-all hover:bg-white/90">
        <div className="w-10 h-10 rounded-2xl bg-[#FEF2F2] flex items-center justify-center text-[#D94A4A] shrink-0 border border-[#FEE2E2]">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-[11px] font-medium text-[#64748B]">Active Alerts</span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-base font-extrabold text-[#10233F]">{activeIncidentCount || 2}</span>
            <span className="text-[10px] font-bold text-[#18A875] flex items-center">
              ↓ 60%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
