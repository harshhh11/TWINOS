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
    <div className="absolute top-24 left-8 z-30 w-80 bg-white/95 backdrop-blur-xl border border-[#E2E8F0] rounded-3xl p-4.5 shadow-xl select-none pointer-events-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3 mb-3">
        <div className="flex items-center gap-2">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              marker.statusColor === 'red'
                ? 'bg-[#EF4444]'
                : marker.statusColor === 'orange'
                ? 'bg-[#F97316]'
                : marker.statusColor === 'blue'
                ? 'bg-[#3B82F6]'
                : 'bg-[#10B981]'
            }`}
          />
          <h2 className="text-xs font-extrabold text-[#0F172A] tracking-tight uppercase">
            {marker.name}
          </h2>
        </div>
        <button
          onClick={resetCamera}
          className="p-1 rounded-full text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
        <div className="p-2.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
          <span className="text-[10px] text-[#64748B] block font-semibold">Status</span>
          <span
            className={`text-xs font-bold ${
              marker.statusColor === 'red'
                ? 'text-[#EF4444]'
                : marker.statusColor === 'orange'
                ? 'text-[#EA580C]'
                : marker.statusColor === 'blue'
                ? 'text-[#2563EB]'
                : 'text-[#16A34A]'
            }`}
          >
            {marker.status}
          </span>
        </div>

        <div className="p-2.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
          <span className="text-[10px] text-[#64748B] block font-semibold">Telemetry Risk</span>
          <span
            className={`text-xs font-bold ${
              marker.riskLevel === 'High'
                ? 'text-[#EF4444]'
                : marker.riskLevel === 'Medium'
                ? 'text-[#EA580C]'
                : 'text-[#16A34A]'
            }`}
          >
            {marker.riskLevel || 'Nominal'}
          </span>
        </div>

        {marker.energyKwh && (
          <div className="p-2.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] col-span-2">
            <span className="text-[10px] text-[#64748B] block font-semibold">Energy Telemetry</span>
            <span className="text-xs font-extrabold text-[#0F172A]">{marker.energyKwh.toLocaleString()} kWh/hr</span>
          </div>
        )}
      </div>

      {/* AI Telemetry Summary */}
      {marker.aiInsight && (
        <div className="p-3 rounded-2xl bg-[#FFF7ED] border border-[#FFEDD5] mb-3.5">
          <div className="flex items-center gap-1.5 text-[#EA580C] text-[10px] font-bold uppercase tracking-wider mb-1">
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
          className="flex-1 py-2 px-3 rounded-2xl bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
        >
          <Network className="w-3.5 h-3.5" />
          <span>Dependencies</span>
        </Link>

        <Link
          href="/monitoring"
          className="py-2 px-3 rounded-2xl bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] text-[#0F172A] font-semibold text-xs flex items-center justify-center gap-1 transition-colors"
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Telemetry</span>
        </Link>
      </div>
    </div>
  );
}
