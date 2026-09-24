'use client';

import React from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  MoreVertical,
} from 'lucide-react';
import { useTwinStore } from '@/lib/twin/twinStateStore';

export function RightAlertsPanel() {
  const { setCopilotOpen } = useTwinStore();

  return (
    <div className="w-full lg:w-[320px] shrink-0 flex flex-col gap-4 select-none">
      {/* CARD 1: ALERTS */}
      <div className="glass-panel rounded-[24px] p-4 flex flex-col shadow-sm">
        <div className="flex items-center justify-between mb-3.5 pb-2 border-b border-slate-200/60">
          <h3 className="text-sm font-extrabold text-[#10233F]">AI Alerts</h3>
          <Link
            href="/alerts"
            className="text-xs font-bold text-[#2563EB] hover:text-[#1D4ED8] flex items-center gap-1 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Alerts List */}
        <div className="flex flex-col gap-2.5">
          {/* Alert 1 */}
          <div className="p-2.5 rounded-2xl bg-white/70 border border-red-100 flex items-start justify-between gap-2.5 transition-all hover:bg-white/90">
            <div className="flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-[#D94A4A] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                <AlertTriangle className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#10233F]">High crowd density</h4>
                <p className="text-[11px] text-[#64748B]">Terminal B</p>
              </div>
            </div>
            <span className="text-[10px] text-[#94A3B8] font-medium shrink-0">2 min ago</span>
          </div>

          {/* Alert 2 */}
          <div className="p-2.5 rounded-2xl bg-white/70 border border-amber-100 flex items-start justify-between gap-2.5 transition-all hover:bg-white/90">
            <div className="flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-[#E6A11A] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                <AlertTriangle className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#10233F]">Unusual movement</h4>
                <p className="text-[11px] text-[#64748B]">Restricted Zone</p>
              </div>
            </div>
            <span className="text-[10px] text-[#94A3B8] font-medium shrink-0">8 min ago</span>
          </div>

          {/* Alert 3 */}
          <div className="p-2.5 rounded-2xl bg-white/70 border border-amber-100 flex items-start justify-between gap-2.5 transition-all hover:bg-white/90">
            <div className="flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-[#E6A11A] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                <AlertTriangle className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#10233F]">Baggage belt slowdown</h4>
                <p className="text-[11px] text-[#64748B]">Terminal A</p>
              </div>
            </div>
            <span className="text-[10px] text-[#94A3B8] font-medium shrink-0">15 min ago</span>
          </div>

          {/* Alert 4 */}
          <div className="p-2.5 rounded-2xl bg-white/70 border border-emerald-100 flex items-start justify-between gap-2.5 transition-all hover:bg-white/90">
            <div className="flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-[#18A875] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#10233F]">No anomalies</h4>
                <p className="text-[11px] text-[#64748B]">All systems</p>
              </div>
            </div>
            <span className="text-[10px] text-[#94A3B8] font-medium shrink-0">32 min ago</span>
          </div>
        </div>
      </div>

      {/* CARD 2: AI RECOMMENDATION */}
      <div className="glass-panel rounded-[24px] p-4 flex flex-col shadow-sm">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200/60">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-[#F26A21] flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-extrabold text-[#10233F]">AI Recommendation</h3>
          </div>
        </div>

        <p className="text-xs text-[#334155] leading-relaxed font-medium mb-4">
          Open Security Checkpoint C to reduce queue wait times by 40%.
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCopilotOpen(true)}
            className="flex-1 py-2.5 px-4 rounded-2xl bg-white/90 hover:bg-white border border-slate-200/80 text-xs font-bold text-[#10233F] flex items-center justify-center gap-2 transition-all cursor-pointer group shadow-2xs"
          >
            <span>Execute Action</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#F26A21] group-hover:translate-x-0.5 transition-transform" />
          </button>
          <button className="w-9 h-9 rounded-2xl bg-white/90 border border-slate-200/80 flex items-center justify-center text-[#64748B] hover:text-[#10233F] transition-colors shadow-2xs">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
