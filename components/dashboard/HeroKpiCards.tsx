'use client';

import React from 'react';
import {
  Activity,
  Cpu,
  Zap,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { useTwinStore } from '@/lib/twin/twinStateStore';

export function HeroKpiCards() {
  const { activeIncidentCount } = useTwinStore();

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 select-none">
      {/* 1. System Status */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-sm border border-white/60 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center text-[#2563EB] shrink-0">
          <Activity className="w-5 h-5" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-[11px] font-medium text-[#64748B]">System Status</span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-base font-extrabold text-[#0F172A]">Nominal</span>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded flex items-center">
              99.8%
            </span>
          </div>
        </div>
      </div>

      {/* 2. Asset Health */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-sm border border-white/60 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#F0FDF4] flex items-center justify-center text-[#16A34A] shrink-0">
          <Cpu className="w-5 h-5" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-[11px] font-medium text-[#64748B]">Asset Health</span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-base font-extrabold text-[#0F172A]">94.2%</span>
            <span className="text-[10px] font-medium text-[#64748B]">Optimal</span>
          </div>
        </div>
      </div>

      {/* 3. Energy Consumption */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-sm border border-white/60 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] flex items-center justify-center text-[#059669] shrink-0">
          <Zap className="w-5 h-5" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-[11px] font-medium text-[#64748B]">Energy Usage</span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-base font-extrabold text-[#0F172A]">24,320</span>
            <span className="text-[10px] font-bold text-emerald-600 flex items-center">
              ↓ 5%
            </span>
          </div>
        </div>
      </div>

      {/* 4. Active Alerts */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-sm border border-white/60 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#FEF2F2] flex items-center justify-center text-[#DC2626] shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-[11px] font-medium text-[#64748B]">Active Alerts</span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-base font-extrabold text-[#0F172A]">{activeIncidentCount}</span>
            <span className="text-[10px] font-bold text-emerald-600 flex items-center">
              ↓ 60%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
