'use client';

import React from 'react';
import Link from 'next/link';
import {
  Activity,
  AlertTriangle,
  Cpu,
  Zap,
  CheckCircle2,
  TrendingDown,
  ArrowUpRight,
} from 'lucide-react';
import { useTwinStore } from '@/lib/twin/twinStateStore';

export function TopStatusPills() {
  const { incidents, assets } = useTwinStore();
  const activeAlertsCount = incidents.filter((i) => i.status !== 'RESOLVED').length;
  const criticalCount = incidents.filter((i) => i.severity === 'HIGH' && i.status !== 'RESOLVED').length;

  const totalAssets = assets.length;
  const optimalAssets = assets.filter((a) => a.healthScore >= 80).length;
  const avgHealth = Math.round(
    assets.reduce((acc, a) => acc + a.healthScore, 0) / (totalAssets || 1)
  );

  return (
    <div className="flex items-center gap-2.5 flex-wrap pointer-events-auto">
      {/* 1. System Status */}
      <Link
        href="/monitoring"
        className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#0D1014]/90 hover:bg-[#151A21] backdrop-blur-md border border-white/[0.08] hover:border-emerald-500/30 transition-all shadow-card group"
      >
        <div className="w-6 h-6 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-400 shrink-0">
          <Activity className="w-3.5 h-3.5 animate-pulse" />
        </div>
        <div className="flex flex-col text-left leading-tight">
          <span className="text-[10px] text-[#8B9199] font-medium flex items-center gap-1">
            System Status
          </span>
          <span className="text-xs font-bold text-[#F4F4F5] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            99.8% Nominal
          </span>
        </div>
      </Link>

      {/* 2. Active Alerts */}
      <Link
        href="/alerts"
        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl backdrop-blur-md border transition-all shadow-card group ${
          criticalCount > 0
            ? 'bg-[#181112]/90 hover:bg-[#201517] border-red-500/30 hover:border-red-500/50'
            : 'bg-[#0D1014]/90 hover:bg-[#151A21] border-white/[0.08]'
        }`}
      >
        <div
          className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
            criticalCount > 0
              ? 'bg-red-500/20 text-red-400'
              : 'bg-amber-500/20 text-amber-400'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
        </div>
        <div className="flex flex-col text-left leading-tight">
          <span className="text-[10px] text-[#8B9199] font-medium">Active Alerts</span>
          <span
            className={`text-xs font-bold ${
              criticalCount > 0 ? 'text-red-400' : 'text-amber-400'
            }`}
          >
            {activeAlertsCount} Action Required
          </span>
        </div>
      </Link>

      {/* 3. Asset Health */}
      <Link
        href="/assets"
        className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#0D1014]/90 hover:bg-[#151A21] backdrop-blur-md border border-white/[0.08] hover:border-[#F28C18]/30 transition-all shadow-card group"
      >
        <div className="w-6 h-6 rounded-lg bg-[#F28C18]/15 flex items-center justify-center text-[#F28C18] shrink-0">
          <Cpu className="w-3.5 h-3.5" />
        </div>
        <div className="flex flex-col text-left leading-tight">
          <span className="text-[10px] text-[#8B9199] font-medium">Asset Health</span>
          <span className="text-xs font-bold text-[#F4F4F5] flex items-center gap-1">
            {avgHealth}% Fleet Health
            <span className="text-[10px] text-[#8B9199] font-normal">
              ({optimalAssets}/{totalAssets})
            </span>
          </span>
        </div>
      </Link>

      {/* 4. Energy Usage */}
      <Link
        href="/energy"
        className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#0D1014]/90 hover:bg-[#151A21] backdrop-blur-md border border-white/[0.08] hover:border-sky-500/30 transition-all shadow-card group"
      >
        <div className="w-6 h-6 rounded-lg bg-sky-500/15 flex items-center justify-center text-sky-400 shrink-0">
          <Zap className="w-3.5 h-3.5" />
        </div>
        <div className="flex flex-col text-left leading-tight">
          <span className="text-[10px] text-[#8B9199] font-medium">Energy Load</span>
          <span className="text-xs font-bold text-[#F4F4F5] flex items-center gap-1">
            24.3 MW
            <span className="text-[10px] text-emerald-400 font-medium flex items-center">
              <TrendingDown className="w-2.5 h-2.5 inline" /> 4.2%
            </span>
          </span>
        </div>
      </Link>
    </div>
  );
}
