'use client';

import React from 'react';
import Link from 'next/link';
import { X, Sparkles, Activity, TrendingUp } from 'lucide-react';
import { useTwinStore } from '@/lib/twin/twinStateStore';

export function ContextualEntityModal() {
  const {
    selectedMarkerId,
    markers,
    resetCamera,
  } = useTwinStore();

  if (!selectedMarkerId) return null;

  const marker = markers.find((m) => m.id === selectedMarkerId);
  if (!marker) return null;

  return (
    <div className="absolute top-24 left-8 z-30 w-84 bg-[#0C121E]/95 backdrop-blur-2xl border border-white/[0.1] rounded-[24px] p-5 shadow-[0_16px_40px_rgba(0,0,0,0.7)] select-none pointer-events-auto text-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 mb-3">
        <div className="flex items-center gap-2.5">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              marker.status === 'Attention' || marker.status === 'Critical'
                ? 'bg-red-400 animate-ping'
                : marker.status === 'Warning'
                ? 'bg-amber-400'
                : 'bg-emerald-400'
            }`}
          />
          <h2 className="text-xs font-bold text-white tracking-wider uppercase">
            {marker.name}
          </h2>
        </div>
        <button
          onClick={resetCamera}
          className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
        {/* Status */}
        <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <span className="text-[10px] text-gray-400 block font-medium">Status</span>
          <span
            className={`text-xs font-bold ${
              marker.status === 'Attention' || marker.status === 'Critical'
                ? 'text-red-400'
                : marker.status === 'Warning'
                ? 'text-amber-400'
                : 'text-emerald-400'
            }`}
          >
            {marker.status}
          </span>
        </div>

        {/* Health */}
        <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <span className="text-[10px] text-gray-400 block font-medium">Asset Health</span>
          <span className="text-xs font-bold text-white">
            {marker.assetHealthPercent || 94}%
          </span>
        </div>

        {/* Operational Load */}
        <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <span className="text-[10px] text-gray-400 block font-medium">Operational Load</span>
          <span className="text-xs font-bold text-white">
            {marker.occupancyPercent || 72}%
          </span>
        </div>

        {/* Energy Usage */}
        <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <span className="text-[10px] text-gray-400 block font-medium">Energy Telemetry</span>
          <span className="text-xs font-bold text-emerald-400">
            {marker.energyUsagePercent || 68}%
          </span>
        </div>
      </div>

      {/* AI Telemetry Diagnostic */}
      {marker.aiInsight && (
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-3 shadow-sm">
          <div className="flex items-center gap-1.5 text-amber-400 text-[10px] font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3 h-3" />
            Live Infrastructure State
          </div>
          <p className="text-[11px] text-gray-300 leading-relaxed font-medium">
            {marker.aiInsight}
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <Link
          href="/monitoring"
          className="flex-1 py-2 px-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span>Live Telemetry</span>
        </Link>

        <Link
          href="/predictions"
          className="flex-1 py-2 px-3 rounded-xl bg-[#F26A21] hover:bg-[#EA580C] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>AI Prediction</span>
        </Link>
      </div>
    </div>
  );
}
