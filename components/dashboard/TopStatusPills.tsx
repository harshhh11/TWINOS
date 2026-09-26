'use client';

import React from 'react';
import Link from 'next/link';
import {
  Activity,
  AlertTriangle,
  Cpu,
  Zap,
  TrendingDown,
  ArrowRight,
  HeartPulse,
  Users,
} from 'lucide-react';
import { useTwinStore } from '@/lib/twin/twinStateStore';

interface SideStatusRailProps {
  layout?: 'vertical' | 'horizontal';
}

export function TopStatusPills({ layout = 'vertical' }: SideStatusRailProps) {
  const { incidents, assets, activeEmergency, setEmergencyDrawerOpen } = useTwinStore();
  const activeAlertsCount = incidents.filter((i) => i.status !== 'RESOLVED').length;
  const criticalCount = incidents.filter((i) => i.severity === 'HIGH' && i.status !== 'RESOLVED').length;

  const totalAssets = assets.length;
  const optimalAssets = assets.filter((a) => a.healthScore >= 80).length;
  const avgHealth = Math.round(
    assets.reduce((acc, a) => acc + a.healthScore, 0) / (totalAssets || 1)
  );

  return (
    <div
      className={`flex ${
        layout === 'vertical'
          ? 'flex-col gap-2 w-[210px]'
          : 'flex-row items-center gap-2.5 flex-wrap'
      } pointer-events-auto select-none`}
    >
      {/* 0. Emergency Status Pill (when active) */}
      {activeEmergency && activeEmergency.status !== 'RESOLVED' && (
        <button
          onClick={() => setEmergencyDrawerOpen(true)}
          className="flex items-center justify-between p-2.5 rounded-xl bg-red-950/90 hover:bg-red-900/90 backdrop-blur-xl border border-red-500/60 shadow-[0_0_20px_rgba(239,68,68,0.35)] transition-all cursor-pointer animate-pulse text-left group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center shrink-0">
              <HeartPulse className="w-3.5 h-3.5 animate-pulse" />
            </div>
            <div className="flex flex-col text-left leading-tight">
              <span className="text-[9px] text-red-400 font-mono uppercase font-bold">EMERGENCY ACTIVE</span>
              <span className="text-xs font-bold text-white">
                {activeEmergency.operationalContext.gate}
              </span>
            </div>
          </div>
          <ArrowRight className="w-3 h-3 text-red-400 group-hover:translate-x-0.5 transition-transform" />
        </button>
      )}

      {/* 0.5. Crowd Operations Pill (Terminal B Surge) */}
      <Link
        href="/crowd"
        className="flex items-center justify-between p-2.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/70 backdrop-blur-xl border border-rose-500/40 shadow-card transition-all group"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
            <Users className="w-3.5 h-3.5" />
          </div>
          <div className="flex flex-col text-left leading-tight">
            <span className="text-[10px] text-rose-300/80 font-medium">Crowd Pressure</span>
            <span className="text-xs font-bold text-white flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              T-B: 84% Critical
            </span>
          </div>
        </div>
        <ArrowRight className="w-3 h-3 text-rose-400 group-hover:translate-x-0.5 transition-transform" />
      </Link>

      {/* 1. System Status */}
      <Link
        href="/monitoring"
        className="flex items-center justify-between p-2.5 rounded-xl bg-[#0D1014]/92 hover:bg-[#151A21] backdrop-blur-xl border border-white/[0.08] hover:border-emerald-500/30 transition-all shadow-card group"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-400 shrink-0">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
          </div>
          <div className="flex flex-col text-left leading-tight">
            <span className="text-[10px] text-[#8B9199] font-medium">System Status</span>
            <span className="text-xs font-bold text-[#F4F4F5] flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              99.8% Nominal
            </span>
          </div>
        </div>
        <ArrowRight className="w-3 h-3 text-[#626870] group-hover:text-emerald-400 transition-colors" />
      </Link>

      {/* 2. Active Alerts */}
      <Link
        href="/alerts"
        className={`flex items-center justify-between p-2.5 rounded-xl backdrop-blur-xl border transition-all shadow-card group ${
          criticalCount > 0
            ? 'bg-[#181112]/92 hover:bg-[#221517] border-red-500/30 hover:border-red-500/50'
            : 'bg-[#0D1014]/92 hover:bg-[#151A21] border-white/[0.08]'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
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
              className={`text-xs font-bold mt-0.5 ${
                criticalCount > 0 ? 'text-red-400' : 'text-amber-400'
              }`}
            >
              {activeAlertsCount} Action Required
            </span>
          </div>
        </div>
        <ArrowRight
          className={`w-3 h-3 transition-colors ${
            criticalCount > 0
              ? 'text-red-400/60 group-hover:text-red-400'
              : 'text-[#626870] group-hover:text-[#F4F4F5]'
          }`}
        />
      </Link>

      {/* 3. Asset Health */}
      <Link
        href="/assets"
        className="flex items-center justify-between p-2.5 rounded-xl bg-[#0D1014]/92 hover:bg-[#151A21] backdrop-blur-xl border border-white/[0.08] hover:border-[#F28C18]/30 transition-all shadow-card group"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#F28C18]/15 flex items-center justify-center text-[#F28C18] shrink-0">
            <Cpu className="w-3.5 h-3.5" />
          </div>
          <div className="flex flex-col text-left leading-tight">
            <span className="text-[10px] text-[#8B9199] font-medium">Asset Health</span>
            <span className="text-xs font-bold text-[#F4F4F5] mt-0.5">
              {avgHealth}% Fleet Health
            </span>
          </div>
        </div>
        <ArrowRight className="w-3 h-3 text-[#626870] group-hover:text-[#F28C18] transition-colors" />
      </Link>

      {/* 4. Energy Usage */}
      <Link
        href="/energy"
        className="flex items-center justify-between p-2.5 rounded-xl bg-[#0D1014]/92 hover:bg-[#151A21] backdrop-blur-xl border border-white/[0.08] hover:border-sky-500/30 transition-all shadow-card group"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-sky-500/15 flex items-center justify-center text-sky-400 shrink-0">
            <Zap className="w-3.5 h-3.5" />
          </div>
          <div className="flex flex-col text-left leading-tight">
            <span className="text-[10px] text-[#8B9199] font-medium">Energy Load</span>
            <span className="text-xs font-bold text-[#F4F4F5] flex items-center gap-1 mt-0.5">
              24.3 MW
              <span className="text-[10px] text-emerald-400 font-medium flex items-center">
                <TrendingDown className="w-2.5 h-2.5 inline" /> 4.2%
              </span>
            </span>
          </div>
        </div>
        <ArrowRight className="w-3 h-3 text-[#626870] group-hover:text-sky-400 transition-colors" />
      </Link>
    </div>
  );
}
