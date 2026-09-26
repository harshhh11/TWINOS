'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  TrendingUp,
  Activity,
  Zap,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

const HOURLY_LOAD_TREND = [
  { time: '06:00', load: 35, energy: 18 },
  { time: '09:00', load: 68, energy: 22 },
  { time: '12:00', load: 88, energy: 26 },
  { time: '15:00', load: 74, energy: 24 },
  { time: '18:00', load: 62, energy: 22 },
  { time: '21:00', load: 45, energy: 19 },
];

export function BottomDashboardCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 select-none mt-1">
      {/* ==================================================================== */}
      {/* 1. REAL-TIME MONITORING (Compact Telemetry Summary)                  */}
      {/* ==================================================================== */}
      <div className="bg-[#0C121E]/95 backdrop-blur-2xl rounded-[24px] p-4 flex flex-col justify-between border border-white/[0.08] shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                <Activity className="w-3 h-3" />
              </div>
              <h3 className="text-xs font-bold text-white tracking-tight">Real-Time Infrastructure State</h3>
            </div>
            <Link
              href="/monitoring"
              className="text-[11px] font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-0.5"
            >
              <span>Explore</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05]">
              <span className="text-[10px] text-gray-400 block font-medium">System Uptime</span>
              <span className="text-base font-black text-white tracking-tight">98.4%</span>
              <span className="text-[9px] text-emerald-400 font-mono block mt-0.5">● Nominal</span>
            </div>

            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05]">
              <span className="text-[10px] text-gray-400 block font-medium">Active Assets</span>
              <span className="text-base font-black text-white tracking-tight">256</span>
              <span className="text-[9px] text-gray-400 font-mono block mt-0.5">Across 4 Terminals</span>
            </div>

            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05]">
              <span className="text-[10px] text-gray-400 block font-medium">Active Anomalies</span>
              <span className="text-base font-black text-red-400 tracking-tight">2</span>
              <span className="text-[9px] text-red-400 font-mono block mt-0.5">Terminal B & Subst.</span>
            </div>

            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05]">
              <span className="text-[10px] text-gray-400 block font-medium">Telemetry Latency</span>
              <span className="text-base font-black text-white tracking-tight">1.2s</span>
              <span className="text-[9px] text-emerald-400 font-mono block mt-0.5">● Sub-second Sync</span>
            </div>
          </div>
        </div>

        <div className="pt-2 mt-2 border-t border-white/[0.05] flex items-center justify-between text-[10px] text-gray-400">
          <span>Continuous Sensor Verification</span>
          <span className="text-emerald-400 font-medium">100% Synced</span>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 2. OPERATIONAL ANALYTICS (Meaningful Small Trend Chart)              */}
      {/* ==================================================================== */}
      <div className="bg-[#0C121E]/95 backdrop-blur-2xl rounded-[24px] p-4 flex flex-col justify-between border border-white/[0.08] shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-lg bg-sky-500/15 text-sky-400 flex items-center justify-center">
                <Zap className="w-3 h-3" />
              </div>
              <h3 className="text-xs font-bold text-white tracking-tight">Throughput & Energy Trend</h3>
            </div>
            <Link
              href="/analytics"
              className="text-[11px] font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-0.5"
            >
              <span>Analytics</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="flex items-baseline justify-between mb-1 text-xs">
            <div>
              <span className="text-lg font-black text-white tracking-tight">24.3 MW</span>
              <span className="text-[10px] text-gray-400 ml-1">Grid Load</span>
            </div>
            <span className="text-[10px] font-semibold text-emerald-400">↓ 4.2% efficiency gain</span>
          </div>

          <div className="h-24 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={HOURLY_LOAD_TREND} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <XAxis dataKey="time" stroke="#64748B" fontSize={8} tickLine={false} axisLine={false} />
                <YAxis domain={[0, 100]} stroke="#64748B" fontSize={8} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                    fontSize: '10px',
                    color: '#F8FAFC',
                  }}
                />
                <Line type="monotone" dataKey="load" stroke="#F26A21" strokeWidth={2} dot={{ r: 2, fill: '#F26A21' }} name="Throughput %" />
                <Line type="monotone" dataKey="energy" stroke="#38BDF8" strokeWidth={1.8} dot={{ r: 2, fill: '#38BDF8' }} name="Power (MW)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="pt-2 mt-1 border-t border-white/[0.05] flex items-center justify-between text-[10px] text-gray-400">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#F26A21]" /> Load</span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-sky-400" /> Power</span>
          </div>
          <span>Peak: 12:00 PM</span>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 3. PREDICTION & ACTION (Upcoming Condition & Mitigation)             */}
      {/* ==================================================================== */}
      <div className="bg-[#0C121E]/95 backdrop-blur-2xl rounded-[24px] p-4 flex flex-col justify-between border border-white/[0.08] shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center">
                <TrendingUp className="w-3 h-3" />
              </div>
              <h3 className="text-xs font-bold text-white tracking-tight">Predictive Horizon</h3>
            </div>
            <Link
              href="/predictions"
              className="text-[11px] font-semibold text-[#F26A21] hover:underline flex items-center gap-0.5"
            >
              <span>Forecasts</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-amber-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Terminal B Cooling Surge
              </span>
              <span className="text-[9px] font-mono font-bold text-amber-400 bg-amber-500/20 px-1.5 py-0.2 rounded">
                +20 min
              </span>
            </div>
            <p className="text-[11px] text-gray-200 leading-snug">
              Thermal strain approaching 31.5°C threshold under midday passenger volume.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center py-1">
            <div className="p-1.5 rounded-lg bg-white/[0.02]">
              <span className="text-[9px] text-gray-400 block">Confidence</span>
              <span className="text-xs font-bold text-white">87%</span>
            </div>
            <div className="p-1.5 rounded-lg bg-white/[0.02]">
              <span className="text-[9px] text-gray-400 block">Impact</span>
              <span className="text-xs font-bold text-amber-400">+32% Load</span>
            </div>
            <div className="p-1.5 rounded-lg bg-white/[0.02]">
              <span className="text-[9px] text-gray-400 block">Severity</span>
              <span className="text-xs font-bold text-amber-400">Medium</span>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-white/[0.05] flex items-center justify-between text-[10px]">
          <span className="text-gray-400">Pre-cooling recommended</span>
          <Link
            href="/predictions"
            className="text-[#F26A21] font-semibold hover:underline"
          >
            Apply Mitigation →
          </Link>
        </div>
      </div>
    </div>
  );
}
