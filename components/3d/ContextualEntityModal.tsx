'use client';

import React from 'react';
import Link from 'next/link';
import { X, ArrowRight, Network, Sparkles, Activity } from 'lucide-react';
import { useTwinStore } from '@/lib/twin/twinStateStore';

export function ContextualEntityModal() {
  const { selectedMarkerId, markers, resetCamera } = useTwinStore();

  if (!selectedMarkerId) return null;

  const marker = markers.find((m) => m.id === selectedMarkerId);
  if (!marker) return null;

  return (
    <div className="absolute top-20 left-8 z-30 w-80 bg-[#111418]/95 backdrop-blur-xl border border-[#262B31] rounded-2xl p-4 shadow-card select-none pointer-events-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#262B31] pb-2.5 mb-3">
        <div className="flex items-center gap-2">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              marker.statusColor === 'red'
                ? 'bg-[#EF4444] shadow-[0_0_8px_#EF4444]'
                : marker.statusColor === 'orange'
                ? 'bg-[#F28C18] shadow-[0_0_8px_#F28C18]'
                : marker.statusColor === 'blue'
                ? 'bg-[#38BDF8] shadow-[0_0_8px_#38BDF8]'
                : 'bg-[#10B981] shadow-[0_0_8px_#10B981]'
            }`}
          />
          <h2 className="text-xs font-bold text-[#F2F3F5] tracking-wide uppercase">
            {marker.name}
          </h2>
        </div>
        <button
          onClick={resetCamera}
          className="p-1 rounded text-[#8D939B] hover:text-[#F2F3F5] hover:bg-[#161B22] transition-colors cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
        <div className="p-2 rounded-xl bg-[#14181D] border border-[#262B31]">
          <span className="text-[9px] text-[#8D939B] block font-mono uppercase">Operational Status</span>
          <span
            className={`text-xs font-bold ${
              marker.statusColor === 'red'
                ? 'text-[#EF4444]'
                : marker.statusColor === 'orange'
                ? 'text-[#F28C18]'
                : marker.statusColor === 'blue'
                ? 'text-[#38BDF8]'
                : 'text-[#10B981]'
            }`}
          >
            {marker.status}
          </span>
        </div>

        <div className="p-2 rounded-xl bg-[#14181D] border border-[#262B31]">
          <span className="text-[9px] text-[#8D939B] block font-mono uppercase">Telemetry Risk</span>
          <span
            className={`text-xs font-bold ${
              marker.riskLevel === 'High'
                ? 'text-[#EF4444]'
                : marker.riskLevel === 'Medium'
                ? 'text-[#F28C18]'
                : 'text-[#10B981]'
            }`}
          >
            {marker.riskLevel || 'Nominal'}
          </span>
        </div>

        {marker.energyKwh && (
          <div className="p-2 rounded-xl bg-[#14181D] border border-[#262B31] col-span-2">
            <span className="text-[9px] text-[#8D939B] block font-mono uppercase">Energy Telemetry</span>
            <span className="text-xs font-bold text-[#F2F3F5]">{marker.energyKwh.toLocaleString()} kWh/hr</span>
          </div>
        )}
      </div>

      {/* AI Telemetry Summary */}
      {marker.aiInsight && (
        <div className="p-2.5 rounded-xl bg-[#191612] border border-[#F28C18]/30 mb-3">
          <div className="flex items-center gap-1.5 text-[#F28C18] text-[9px] font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3 h-3" />
            System Diagnostic
          </div>
          <p className="text-[11px] text-[#F2F3F5]/90 leading-relaxed">{marker.aiInsight}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <Link
          href="/dependencies"
          className="flex-1 py-2 px-3 rounded-xl bg-[#F28C18] hover:bg-[#E07D10] text-[#0B0D0F] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
        >
          <Network className="w-3.5 h-3.5" />
          <span>Dependencies</span>
        </Link>

        <Link
          href="/monitoring"
          className="py-2 px-3 rounded-xl bg-[#161B22] hover:bg-[#1E242C] border border-[#262B31] text-[#F2F3F5] font-medium text-xs flex items-center justify-center gap-1 transition-colors"
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Telemetry</span>
        </Link>
      </div>
    </div>
  );
}
