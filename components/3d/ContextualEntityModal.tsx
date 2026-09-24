'use client';

import React from 'react';
import Link from 'next/link';
import { X, ArrowRight, Layers, Sparkles } from 'lucide-react';
import { useTwinStore } from '@/lib/twin/twinStateStore';

export function ContextualEntityModal() {
  const { selectedMarkerId, markers, resetCamera } = useTwinStore();

  if (!selectedMarkerId) return null;

  const marker = markers.find((m) => m.id === selectedMarkerId);
  if (!marker) return null;

  return (
    <div className="absolute top-20 left-[260px] z-30 w-80 bg-[#111418] border border-[#262B31] rounded-xl p-4 shadow-card select-none pointer-events-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#262B31] pb-2.5 mb-3">
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              marker.statusColor === 'red'
                ? 'bg-[#EF4444]'
                : marker.statusColor === 'orange'
                ? 'bg-[#F28C18]'
                : marker.statusColor === 'blue'
                ? 'bg-[#3B82F6]'
                : 'bg-[#10B981]'
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
        {marker.occupancyPercent !== undefined && (
          <div className="p-2 rounded-lg bg-[#14181D] border border-[#262B31]">
            <span className="text-[9px] text-[#8D939B] block">Occupancy</span>
            <span className="text-sm font-bold text-[#F2F3F5]">{marker.occupancyPercent}%</span>
          </div>
        )}

        <div className="p-2 rounded-lg bg-[#14181D] border border-[#262B31]">
          <span className="text-[9px] text-[#8D939B] block">Status</span>
          <span
            className={`text-sm font-bold ${
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

        {marker.passengerCount !== undefined && (
          <div className="p-2 rounded-lg bg-[#14181D] border border-[#262B31]">
            <span className="text-[9px] text-[#8D939B] block">People In Zone</span>
            <span className="text-sm font-bold text-[#F2F3F5]">
              {marker.passengerCount.toLocaleString()}
            </span>
          </div>
        )}

        <div className="p-2 rounded-lg bg-[#14181D] border border-[#262B31]">
          <span className="text-[9px] text-[#8D939B] block">Risk Rating</span>
          <span
            className={`text-sm font-bold ${
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
          <div className="p-2 rounded-lg bg-[#14181D] border border-[#262B31] col-span-2">
            <span className="text-[9px] text-[#8D939B] block">Energy Consumption</span>
            <span className="text-sm font-bold text-[#F2F3F5]">{marker.energyKwh.toLocaleString()} kWh</span>
          </div>
        )}
      </div>

      {/* AI Insight */}
      {marker.aiInsight && (
        <div className="p-2.5 rounded-lg bg-[#191612] border border-[#F28C18]/30 mb-3">
          <div className="flex items-center gap-1 text-[#F28C18] text-[9px] font-bold uppercase tracking-wider mb-0.5">
            <Sparkles className="w-2.5 h-2.5" />
            AI Insight
          </div>
          <p className="text-[10px] text-[#F2F3F5]/90 leading-relaxed">{marker.aiInsight}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <Link
          href="/impact-analysis"
          className="flex-1 py-1.5 px-3 rounded-lg bg-[#F28C18] hover:bg-[#E07D10] text-[#0B0D0F] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Analyze Impact</span>
        </Link>

        <Link
          href="/incidents"
          className="py-1.5 px-3 rounded-lg bg-[#161B22] hover:bg-[#1E242C] border border-[#262B31] text-[#F2F3F5] font-medium text-xs flex items-center justify-center gap-1 transition-colors"
        >
          <span>View Details</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
