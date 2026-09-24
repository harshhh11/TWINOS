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
      <div className="bg-white rounded-3xl p-4 border border-[#E2E8F0] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col">
        <div className="flex items-center justify-between mb-3.5 pb-2 border-b border-[#F1F5F9]">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-extrabold text-[#0F172A]">AI Alerts</h3>
          </div>
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
          <div className="p-2.5 rounded-2xl bg-[#FEF2F2] border border-[#FEE2E2] flex items-start justify-between gap-2.5">
            <div className="flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-[#DC2626] text-white flex items-center justify-center shrink-0 mt-0.5">
                <AlertTriangle className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#0F172A]">High crowd density</h4>
                <p className="text-[11px] text-[#64748B]">Terminal B</p>
              </div>
            </div>
            <span className="text-[10px] text-[#94A3B8] font-medium shrink-0">2 min ago</span>
          </div>

          {/* Alert 2 */}
          <div className="p-2.5 rounded-2xl bg-[#FFFBEB] border border-[#FEF3C7] flex items-start justify-between gap-2.5">
            <div className="flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-[#D97706] text-white flex items-center justify-center shrink-0 mt-0.5">
                <AlertTriangle className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#0F172A]">Unusual movement</h4>
                <p className="text-[11px] text-[#64748B]">Restricted Zone</p>
              </div>
            </div>
            <span className="text-[10px] text-[#94A3B8] font-medium shrink-0">8 min ago</span>
          </div>

          {/* Alert 3 */}
          <div className="p-2.5 rounded-2xl bg-[#FFFBEB] border border-[#FEF3C7] flex items-start justify-between gap-2.5">
            <div className="flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-[#D97706] text-white flex items-center justify-center shrink-0 mt-0.5">
                <AlertTriangle className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#0F172A]">Baggage belt slowdown</h4>
                <p className="text-[11px] text-[#64748B]">Terminal A</p>
              </div>
            </div>
            <span className="text-[10px] text-[#94A3B8] font-medium shrink-0">15 min ago</span>
          </div>

          {/* Alert 4 */}
          <div className="p-2.5 rounded-2xl bg-[#F0FDF4] border border-[#DCFCE7] flex items-start justify-between gap-2.5">
            <div className="flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-[#16A34A] text-white flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#0F172A]">No anomalies</h4>
                <p className="text-[11px] text-[#64748B]">All systems</p>
              </div>
            </div>
            <span className="text-[10px] text-[#94A3B8] font-medium shrink-0">32 min ago</span>
          </div>
        </div>
      </div>

      {/* CARD 2: AI RECOMMENDATION */}
      <div className="bg-white rounded-3xl p-4 border border-[#E2E8F0] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#F1F5F9]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#EA580C] to-[#FB923C] flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-extrabold text-[#0F172A]">AI Recommendation</h3>
          </div>
        </div>

        <p className="text-xs text-[#334155] leading-relaxed font-medium mb-4">
          Open Security Checkpoint C to reduce queue wait times by 40%.
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCopilotOpen(true)}
            className="flex-1 py-2.5 px-4 rounded-2xl bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] text-xs font-bold text-[#0F172A] flex items-center justify-center gap-2 transition-colors cursor-pointer group"
          >
            <span>Ask Copilot</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#EA580C] group-hover:translate-x-0.5 transition-transform" />
          </button>
          <button className="w-9 h-9 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:text-[#0F172A] transition-colors">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
