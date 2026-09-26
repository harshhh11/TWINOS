'use client';

import React from 'react';
import Link from 'next/link';
import {
  Activity,
  AlertTriangle,
  Cpu,
  Zap,
  ArrowRight,
  TrendingDown,
  CheckCircle2,
  Users,
} from 'lucide-react';
import { useTwinStore } from '@/lib/twin/twinStateStore';

export function BottomCommandDock() {
  const { incidents, assets } = useTwinStore();
  const activeAlerts = incidents.filter((i) => i.status !== 'RESOLVED');
  const criticalIncident = incidents.find((i) => i.status !== 'RESOLVED' && i.severity === 'HIGH');
  const atRiskAssets = assets.filter((a) => a.healthScore < 80);

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-5 gap-3 pointer-events-auto select-none">
      {/* 1. Monitoring Summary */}
      <Link
        href="/monitoring"
        className="p-3.5 rounded-2xl bg-[#0D1014]/92 hover:bg-[#131820] backdrop-blur-xl border border-white/[0.08] hover:border-emerald-500/30 transition-all shadow-card group flex flex-col justify-between"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-400">
              <Activity className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-[#F4F4F5]">Monitoring</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-[#8B9199] group-hover:text-emerald-400 transition-colors" />
        </div>
        <div className="text-xs text-[#8B9199]">
          <div className="flex items-center justify-between mb-1">
            <span>Airfield & Runways:</span>
            <span className="text-emerald-400 font-medium">Nominal</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Sensor Streams:</span>
            <span className="text-[#F4F4F5] font-mono">1,420 Active</span>
          </div>
        </div>
      </Link>

      {/* 2. Alerts Summary */}
      <Link
        href="/alerts"
        className="p-3.5 rounded-2xl bg-[#0D1014]/92 hover:bg-[#131820] backdrop-blur-xl border border-white/[0.08] hover:border-red-500/30 transition-all shadow-card group flex flex-col justify-between"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-red-500/15 flex items-center justify-center text-red-400">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-[#F4F4F5]">Active Alerts</span>
          </div>
          <span className="px-1.5 py-0.5 rounded-md bg-red-500/20 text-red-400 text-[10px] font-bold border border-red-500/30">
            {activeAlerts.length} Active
          </span>
        </div>
        <div className="text-xs text-[#8B9199]">
          <p className="text-[11px] text-[#F4F4F5] font-medium truncate mb-1">
            {criticalIncident?.title || 'No active critical warnings'}
          </p>
          <span className="text-[10px] text-red-400 font-medium">
            Terminal B Concourse • Action Required
          </span>
        </div>
      </Link>

      {/* 2.5. Crowd Operations Summary */}
      <Link
        href="/crowd"
        className="p-3.5 rounded-2xl bg-[#0D1014]/92 hover:bg-[#131820] backdrop-blur-xl border border-white/[0.08] hover:border-rose-500/40 transition-all shadow-card group flex flex-col justify-between"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-rose-500/15 flex items-center justify-center text-rose-400">
              <Users className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-[#F4F4F5]">Crowd Ops</span>
          </div>
          <span className="px-1.5 py-0.5 rounded-md bg-rose-500/20 text-rose-400 text-[10px] font-bold border border-rose-500/30 animate-pulse">
            T-B: 84%
          </span>
        </div>
        <div className="text-xs text-[#8B9199]">
          <div className="flex items-center justify-between mb-1">
            <span>Security Zone 2:</span>
            <span className="text-rose-400 font-bold font-mono">184 in queue</span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span>Est. Wait:</span>
            <span className="text-amber-400 font-medium">17 min (Lane 7 Standby)</span>
          </div>
        </div>
      </Link>

      {/* 3. Asset Health Summary */}
      <Link
        href="/assets"
        className="p-3.5 rounded-2xl bg-[#0D1014]/92 hover:bg-[#131820] backdrop-blur-xl border border-white/[0.08] hover:border-[#F28C18]/30 transition-all shadow-card group flex flex-col justify-between"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#F28C18]/15 flex items-center justify-center text-[#F28C18]">
              <Cpu className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-[#F4F4F5]">Asset Health</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-[#8B9199] group-hover:text-[#F28C18] transition-colors" />
        </div>
        <div className="text-xs text-[#8B9199]">
          <div className="flex items-center justify-between mb-1">
            <span>Fleet Health Score:</span>
            <span className="text-[#F4F4F5] font-bold">94.2%</span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span>Maintenance Due:</span>
            <span className="text-amber-400 font-medium">{atRiskAssets.length} Units (HVAC-03)</span>
          </div>
        </div>
      </Link>

      {/* 4. Energy Summary */}
      <Link
        href="/energy"
        className="p-3.5 rounded-2xl bg-[#0D1014]/92 hover:bg-[#131820] backdrop-blur-xl border border-white/[0.08] hover:border-sky-500/30 transition-all shadow-card group flex flex-col justify-between"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-sky-500/15 flex items-center justify-center text-sky-400">
              <Zap className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-[#F4F4F5]">Energy Usage</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-[#8B9199] group-hover:text-sky-400 transition-colors" />
        </div>
        <div className="text-xs text-[#8B9199]">
          <div className="flex items-center justify-between mb-1">
            <span>Instantaneous Load:</span>
            <span className="text-[#F4F4F5] font-mono font-bold">24.3 MW</span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span>Efficiency Delta:</span>
            <span className="text-emerald-400 font-medium flex items-center">
              <TrendingDown className="w-3 h-3 inline" /> 5.2% vs Baseline
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
