'use client';

import React from 'react';
import Link from 'next/link';
import { X, Network, Sparkles, Activity } from 'lucide-react';
import { useTwinStore } from '@/lib/twin/twinStateStore';

export function ContextualEntityModal() {
  const { selectedMarkerId, markers, resetCamera } = useTwinStore();

  if (!selectedMarkerId) return null;

  const marker = markers.find((m) => m.id === selectedMarkerId);
  if (!marker) return null;

  return (
    <div className="absolute top-24 left-8 z-30 w-80 glass-panel rounded-[24px] p-4.5 shadow-xl select-none pointer-events-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200/60 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              marker.statusColor === 'red'
                ? 'bg-[#D94A4A]'
                : marker.statusColor === 'orange'
                ? 'bg-[#F26A21]'
                : marker.statusColor === 'blue'
                ? 'bg-[#2563EB]'
                : 'bg-[#18A875]'
            }`}
          />
          <h2 className="text-xs font-extrabold text-[#10233F] tracking-tight uppercase">
            {marker.name}
          </h2>
        </div>
        <button
          onClick={resetCamera}
          className="p-1 rounded-full text-[#94A3B8] hover:text-[#10233F] hover:bg-white/80 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
        <div className="p-2.5 rounded-2xl bg-white/70 border border-slate-200/60">
          <span className="text-[10px] text-[#64748B] block font-semibold">Status</span>
          <span
            className={`text-xs font-bold ${
              marker.statusColor === 'red'
                ? 'text-[#D94A4A]'
                : marker.statusColor === 'orange'
                ? 'text-[#F26A21]'
                : marker.statusColor === 'blue'
                ? 'text-[#2563EB]'
                : 'text-[#18A875]'
            }`}
          >
            {marker.status}
          </span>
        </div>

        <div className="p-2.5 rounded-2xl bg-white/70 border border-slate-200/60">
          <span className="text-[10px] text-[#64748B] block font-semibold">Telemetry Risk</span>
          <span
            className={`text-xs font-bold ${
              marker.riskLevel === 'High'
                ? 'text-[#D94A4A]'
                : marker.riskLevel === 'Medium'
                ? 'text-[#F26A21]'
                : 'text-[#18A875]'
            }`}
          >
            {marker.riskLevel || 'Nominal'}
          </span>
        </div>

        {marker.energyKwh && (
          <div className="p-2.5 rounded-2xl bg-white/70 border border-slate-200/60 col-span-2">
            <span className="text-[10px] text-[#64748B] block font-semibold">Energy Telemetry</span>
            <span className="text-xs font-extrabold text-[#10233F]">{marker.energyKwh.toLocaleString()} kWh/hr</span>
          </div>
        )}
      </div>

      {/* AI Telemetry Summary */}
      {marker.aiInsight && (
        <div className="p-3 rounded-2xl bg-white/80 border border-[#F26A21]/20 mb-3.5 shadow-2xs">
          <div className="flex items-center gap-1.5 text-[#F26A21] text-[10px] font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3 h-3" />
            System Diagnostic
          </div>
          <p className="text-[11px] text-[#334155] leading-relaxed font-medium">{marker.aiInsight}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <Link
          href="/dependencies"
          className="flex-1 py-2 px-3 rounded-2xl bg-[#F26A21] hover:bg-[#d85817] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
        >
          <Network className="w-3.5 h-3.5" />
          <span>Dependencies</span>
        </Link>

        <Link
          href="/monitoring"
          className="py-2 px-3 rounded-2xl bg-white/90 hover:bg-white border border-slate-200/80 text-[#10233F] font-semibold text-xs flex items-center justify-center gap-1 transition-colors shadow-2xs"
        >
          <Activity className="w-3.5 h-3.5 text-[#F26A21]" />
          <span>Telemetry</span>
        </Link>
      </div>
    </div>
  );
}
