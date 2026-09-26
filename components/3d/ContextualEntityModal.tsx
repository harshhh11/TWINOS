'use client';

import React from 'react';
import Link from 'next/link';
import { X, ArrowRight, Network, Sparkles, Activity, ShieldAlert, Cpu, Users } from 'lucide-react';
import { useTwinStore } from '@/lib/twin/twinStateStore';

export function ContextualEntityModal() {
  const { selectedMarkerId, markers, resetCamera, incidents, assets, setActiveLayer } = useTwinStore();

  if (!selectedMarkerId) return null;

  const marker = markers.find((m) => m.id === selectedMarkerId);
  if (!marker) return null;

  const relatedIncidents = incidents.filter(
    (i) => i.locationId === marker.id && i.status !== 'RESOLVED'
  );

  const occupancy =
    marker.id === 'terminal-a' ? 72 :
    marker.id === 'terminal-b' ? 64 :
    marker.id === 'terminal-c' ? 78 :
    marker.id === 'terminal-d' ? 59 :
    marker.id === 'parking-garage' ? 68 :
    marker.id === 'energy-hub' ? 68 :
    marker.id === 'cargo-hub' ? 82 :
    marker.occupancyPercent || 74;

  const healthScore =
    marker.id === 'terminal-a' ? 94 :
    marker.id === 'terminal-b' ? 88 :
    marker.id === 'terminal-c' ? 91 :
    marker.id === 'terminal-d' ? 96 :
    marker.id === 'runway-1' ? 99 :
    marker.id === 'runway-2' ? 98 :
    marker.id === 'atc-tower' ? 100 :
    marker.id === 'energy-hub' ? 96 :
    marker.id === 'parking-garage' ? 94 : 90;

  const dependenciesCount =
    marker.id === 'terminal-a' ? 3 :
    marker.id === 'terminal-b' ? 3 :
    marker.id === 'terminal-c' ? 5 :
    marker.id === 'terminal-d' ? 2 :
    marker.id === 'energy-hub' ? 6 :
    marker.id === 'atc-tower' ? 4 :
    marker.id === 'parking-garage' ? 2 : 3;

  return (
    <div className="absolute top-24 left-8 z-30 w-88 bg-[#0D1014]/95 backdrop-blur-2xl border border-white/15 rounded-2xl p-4 shadow-2xl select-none pointer-events-auto animate-in fade-in slide-in-from-left-4 duration-200">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5 mb-3">
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
          <h2 className="text-xs font-bold text-[#F4F4F5] tracking-wide uppercase">
            {marker.name}
          </h2>
        </div>
        <button
          onClick={resetCamera}
          className="p-1 rounded-lg text-[#8B9199] hover:text-[#F4F4F5] hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Primary Operational Metrics */}
      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
        <div className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.08]">
          <span className="text-[9px] text-[#8B9199] block font-mono uppercase">Operational Status</span>
          <span
            className={`text-xs font-bold mt-0.5 block ${
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

        <div className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.08]">
          <span className="text-[9px] text-[#8B9199] block font-mono uppercase">Asset Health</span>
          <span className="text-xs font-bold text-[#F4F4F5] mt-0.5 block">
            {healthScore}%
          </span>
        </div>

        <div className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.08]">
          <span className="text-[9px] text-[#8B9199] block font-mono uppercase">Occupancy / Load</span>
          <span className="text-xs font-bold text-[#F4F4F5] mt-0.5 block">
            {occupancy}%
          </span>
        </div>

        <div className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.08]">
          <span className="text-[9px] text-[#8B9199] block font-mono uppercase">Active Alerts</span>
          <span
            className={`text-xs font-bold mt-0.5 block ${
              relatedIncidents.length > 0 ? 'text-[#F28C18]' : 'text-emerald-400'
            }`}
          >
            {relatedIncidents.length}
          </span>
        </div>
      </div>

      {/* Energy Telemetry if applicable */}
      {marker.energyKwh && (
        <div className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.08] mb-3 flex items-center justify-between">
          <span className="text-[9px] text-[#8B9199] font-mono uppercase">Energy Telemetry:</span>
          <span className="text-xs font-bold text-[#F4F4F5]">{marker.energyKwh.toLocaleString()} kWh/hr</span>
        </div>
      )}

      {/* Dependencies count bar */}
      <div className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.08] mb-3 flex items-center justify-between text-xs">
        <span className="text-[9px] text-[#8B9199] font-mono uppercase">Infrastructure Dependencies:</span>
        <span className="text-xs font-bold text-[#38BDF8]">{dependenciesCount} Connected</span>
      </div>

      {/* Live Operational Insight */}
      {marker.aiInsight && (
        <div
          className={`p-2.5 rounded-xl border mb-3 ${
            marker.statusColor === 'red'
              ? 'bg-red-950/40 border-red-500/40 text-red-200'
              : 'bg-[#1A140E] border-[#F28C18]/30'
          }`}
        >
          <div
            className={`flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider mb-1 ${
              marker.statusColor === 'red' ? 'text-red-400' : 'text-[#F28C18]'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            {marker.id === 'emergency-gate-b14' ? 'Live Emergency Operational Status' : 'Live Spatial Diagnostic'}
          </div>
          <p className="text-[11px] leading-relaxed text-[#F4F4F5]/90">{marker.aiInsight}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col gap-2">
        {marker.id === 'terminal-b' && (
          <Link
            href="/crowd"
            className="w-full py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-rose-900/40 transition-all cursor-pointer"
          >
            <Users className="w-3.5 h-3.5" />
            <span>ENTER CROWD OPERATIONS (3D CUTAWAY)</span>
          </Link>
        )}

        <div className="flex items-center gap-2">
          {marker.id === 'emergency-gate-b14' ? (
            <button
              onClick={() => useTwinStore.getState().setEmergencyDrawerOpen(true)}
              className="flex-1 py-2 px-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-red-600/30 transition-all cursor-pointer"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>OPEN EMERGENCY COMMAND</span>
            </button>
          ) : (
            <>
              <button
                onClick={() => setActiveLayer('DEPENDENCIES')}
                className="flex-1 py-2 px-3 rounded-xl bg-[#F28C18] hover:bg-[#E07D10] text-black font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Network className="w-3.5 h-3.5" />
                <span>View Dependencies</span>
              </button>

              <Link
                href="/monitoring"
                className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-[#F4F4F5] font-medium text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Telemetry</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
