'use client';

import React from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  MoreVertical,
  Sliders,
  Box,
} from 'lucide-react';
import { useTwinStore } from '@/lib/twin/twinStateStore';

export function RightAlertsPanel() {
  const { setCopilotOpen } = useTwinStore();

  return (
    <div className="w-full lg:w-[320px] shrink-0 flex flex-col gap-3 select-none">
      {/* 1. LIVE CAMERA FEED CARD */}
      <div className="glass-panel rounded-[22px] p-3.5 flex flex-col shadow-sm">
        <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-200/60">
          <h3 className="text-xs font-black text-[#10233F]">Live Camera Feed</h3>
          <Link
            href="/monitoring"
            className="text-[11px] font-bold text-[#2563EB] hover:text-[#1D4ED8] flex items-center gap-0.5 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Camera Feed Image */}
        <div className="relative rounded-xl overflow-hidden h-24 bg-slate-900 shadow-inner">
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: 'url(/cctv-checkpoint.jpg)' }}
          />
        </div>

        {/* Camera Feed Footer */}
        <div className="flex items-center justify-between mt-2 text-[11px]">
          <span className="font-bold text-[#10233F]">T1 - Security Checkpoint</span>
          <span className="flex items-center gap-1 text-[10px] font-bold text-[#10B981] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
            Live
          </span>
        </div>
      </div>

      {/* 2. AI ALERTS CARD */}
      <div className="glass-panel rounded-[22px] p-3.5 flex flex-col shadow-sm">
        <div className="flex items-center justify-between mb-2.5 pb-1.5 border-b border-slate-200/60">
          <h3 className="text-xs font-black text-[#10233F]">AI Alerts</h3>
          <Link
            href="/alerts"
            className="text-[11px] font-bold text-[#2563EB] hover:text-[#1D4ED8] flex items-center gap-0.5 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Alerts List */}
        <div className="flex flex-col gap-2">
          {/* Alert 1 */}
          <div className="p-2 rounded-xl bg-white/70 border border-red-100 flex items-start justify-between gap-2 transition-all hover:bg-white/90">
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-md bg-[#EF4444] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                <AlertTriangle className="w-3 h-3" />
              </div>
              <div>
                <h4 className="text-[11px] font-bold text-[#10233F] leading-tight">High crowd density</h4>
                <p className="text-[10px] text-[#64748B]">Terminal B</p>
              </div>
            </div>
            <span className="text-[9px] text-[#94A3B8] font-medium shrink-0">2 min ago</span>
          </div>

          {/* Alert 2 */}
          <div className="p-2 rounded-xl bg-white/70 border border-amber-100 flex items-start justify-between gap-2 transition-all hover:bg-white/90">
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-md bg-[#F59E0B] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                <AlertTriangle className="w-3 h-3" />
              </div>
              <div>
                <h4 className="text-[11px] font-bold text-[#10233F] leading-tight">Unusual movement</h4>
                <p className="text-[10px] text-[#64748B]">Restricted Zone</p>
              </div>
            </div>
            <span className="text-[9px] text-[#94A3B8] font-medium shrink-0">8 min ago</span>
          </div>

          {/* Alert 3 */}
          <div className="p-2 rounded-xl bg-white/70 border border-amber-100 flex items-start justify-between gap-2 transition-all hover:bg-white/90">
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-md bg-[#F59E0B] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                <AlertTriangle className="w-3 h-3" />
              </div>
              <div>
                <h4 className="text-[11px] font-bold text-[#10233F] leading-tight">Baggage belt slowdown</h4>
                <p className="text-[10px] text-[#64748B]">Terminal A</p>
              </div>
            </div>
            <span className="text-[9px] text-[#94A3B8] font-medium shrink-0">15 min ago</span>
          </div>

          {/* Alert 4 */}
          <div className="p-2 rounded-xl bg-white/70 border border-emerald-100 flex items-start justify-between gap-2 transition-all hover:bg-white/90">
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-[#10B981] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                <CheckCircle2 className="w-3 h-3" />
              </div>
              <div>
                <h4 className="text-[11px] font-bold text-[#10233F] leading-tight">No anomalies</h4>
                <p className="text-[10px] text-[#64748B]">All systems</p>
              </div>
            </div>
            <span className="text-[9px] text-[#94A3B8] font-medium shrink-0">32 min ago</span>
          </div>
        </div>
      </div>

      {/* 3. WHAT-IF SIMULATOR CARD */}
      <Link
        href="/predictions"
        className="glass-panel rounded-[22px] p-3 flex items-center justify-between shadow-sm hover:bg-white transition-all cursor-pointer group"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#EFF6FF] flex items-center justify-center text-[#2563EB] shrink-0 border border-[#DBEAFE]">
            <Box className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-extrabold text-[#10233F] leading-tight">What-If Simulator</h4>
            <p className="text-[9px] text-[#64748B] mt-0.5">Simulate scenarios and see potential outcomes.</p>
          </div>
        </div>
        <ArrowRight className="w-4 h-4 text-[#64748B] group-hover:text-[#2563EB] group-hover:translate-x-0.5 transition-all" />
      </Link>

      {/* 4. AI RECOMMENDATION CARD */}
      <div className="glass-panel rounded-[22px] p-3.5 flex flex-col shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#EA580C] flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-xs font-black text-[#10233F]">AI Recommendation</h3>
          </div>
        </div>

        <p className="text-[11px] text-[#334155] leading-snug font-medium mb-3">
          Open Security Checkpoint C to reduce congestion by 40%.
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCopilotOpen(true)}
            className="flex-1 py-2 px-3 rounded-full bg-white hover:bg-slate-50 border border-slate-200/80 text-[11px] font-bold text-[#10233F] flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
          >
            <span>Simulate This</span>
            <ArrowRight className="w-3 h-3 text-[#EA580C]" />
          </button>
          <button className="w-7 h-7 rounded-full bg-white border border-slate-200/80 flex items-center justify-center text-[#64748B] hover:text-[#10233F] transition-colors shadow-2xs">
            <MoreVertical className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
