'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  AlertTriangle,
  Box,
  CheckCircle2,
  Clock,
  Filter,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  GitFork,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useTwinStore } from '@/lib/twin/twinStateStore';
import { Incident, IncidentStatus } from '@/types';

export default function IncidentsPage() {
  const router = useRouter();
  const { incidents, updateIncidentStatus, focusEntity } = useTwinStore();
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(incidents[0] || null);

  const filtered = filterStatus === 'ALL'
    ? incidents
    : incidents.filter((i) => i.status === filterStatus);

  const handleStatusChange = (id: string, newStatus: IncidentStatus) => {
    updateIncidentStatus(id, newStatus);
    if (newStatus === 'RESOLVED') {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
    if (selectedIncident && selectedIncident.id === id) {
      setSelectedIncident({ ...selectedIncident, status: newStatus });
    }
  };

  const handleViewInTwin = (inc: Incident) => {
    focusEntity(inc.locationId, inc.coordinates);
    router.push('/');
  };

  return (
    <div className="w-screen h-screen overflow-y-auto bg-[#080A0D] text-[#F4F4F5] font-sans select-none flex flex-col">
      {/* Top Header */}
      <header className="px-8 py-4 border-b border-white/[0.08] bg-[#0D1014]/90 backdrop-blur-xl flex items-center justify-between sticky top-0 z-30 shadow-card">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-[#F4F4F5] transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </Link>

          <div>
            <h1 className="text-base font-bold text-[#F4F4F5] flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              Incident Lifecycle & Resolution Command
            </h1>
            <p className="text-[11px] text-[#8B9199]">
              Active Incidents • AI Root-Cause Diagnostics • Coordinated Operations Resolution
            </p>
          </div>
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 p-1 bg-white/5 border border-white/10 rounded-full text-xs">
          {['ALL', 'ACTION_REQUIRED', 'INVESTIGATING', 'IN_PROGRESS', 'RESOLVED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                filterStatus === st
                  ? 'bg-[#F28C18] text-black font-bold shadow-sm'
                  : 'text-[#8B9199] hover:text-[#F4F4F5]'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </header>

      {/* Main Body Grid */}
      <div className="flex-1 p-8 grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto w-full">
        {/* ========================================================================= */}
        {/* LEFT 2 COLUMNS: INCIDENT LIST                                             */}
        {/* ========================================================================= */}
        <div className="lg:col-span-2 flex flex-col gap-3">
          {filtered.map((inc) => {
            const isSelected = selectedIncident?.id === inc.id;
            const isCritical = inc.severity === 'HIGH';

            return (
              <div
                key={inc.id}
                onClick={() => setSelectedIncident(inc)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer backdrop-blur-xl ${
                  isSelected
                    ? 'bg-[#181D26] border-[#F28C18]/60 shadow-card'
                    : 'bg-[#0D1014]/90 hover:bg-[#12161E] border-white/[0.08]'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        isCritical
                          ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      }`}
                    >
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-[#F4F4F5] leading-snug">{inc.title}</h3>
                      <span className="text-[10px] text-[#8B9199]">{inc.locationName}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        inc.status === 'RESOLVED'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : inc.status === 'ACTION_REQUIRED'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {inc.status.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] text-[#8B9199]">{inc.timestamp}</span>
                  </div>
                </div>

                <p className="text-[11px] text-[#8B9199] line-clamp-2 pl-10 leading-relaxed">
                  {inc.aiAnalysis}
                </p>

                <div className="mt-3 pt-2.5 border-t border-white/5 pl-10 flex items-center justify-between text-[11px]">
                  <span className="text-[#626870] font-mono">Telemetry Source: {inc.detectedBy}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewInTwin(inc);
                    }}
                    className="text-[#F28C18] font-bold flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <Box className="w-3.5 h-3.5" />
                    <span>View in 3D Twin</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: INCIDENT DETAIL & RESOLUTION ACTIONS                         */}
        {/* ========================================================================= */}
        <div className="flex flex-col gap-4">
          {selectedIncident ? (
            <div className="bg-[#0D1014]/90 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 shadow-card flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 mb-4">
                  <span className="text-xs font-bold text-[#F4F4F5] uppercase tracking-wider">
                    Incident Details
                  </span>
                  <span className="text-[10px] font-mono text-[#F28C18]">
                    {selectedIncident.id.toUpperCase()}
                  </span>
                </div>

                <h2 className="text-sm font-bold text-[#F4F4F5] mb-2 leading-snug">
                  {selectedIncident.title}
                </h2>

                <div className="space-y-3 text-xs mb-4">
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                    <span className="text-[#8B9199]">Location</span>
                    <span className="font-semibold text-[#F4F4F5]">{selectedIncident.locationName}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                    <span className="text-[#8B9199]">AI Confidence Score</span>
                    <span className="font-bold text-emerald-400">
                      {(selectedIncident.confidence * 100).toFixed(1)}%
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-[#8B9199] block mb-1">Affected Infrastructure</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedIncident.affectedAssets.map((assetId, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-[#F4F4F5] font-mono">
                          {assetId}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* AI Diagnosis */}
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.08] mb-3 text-xs">
                  <span className="text-[10px] font-bold text-[#F28C18] uppercase block mb-1">
                    AI Root-Cause Diagnosis
                  </span>
                  <p className="text-[11px] text-[#8B9199] leading-relaxed">
                    {selectedIncident.aiAnalysis}
                  </p>
                </div>

                {/* Recommended Mitigation */}
                <div className="p-3.5 rounded-xl bg-[#F28C18]/10 border border-[#F28C18]/25 mb-4 text-xs">
                  <span className="text-[10px] font-bold text-[#F28C18] uppercase block mb-1">
                    Recommended Action
                  </span>
                  <p className="text-[11px] text-[#F4F4F5] font-medium leading-relaxed">
                    {selectedIncident.recommendation}
                  </p>
                </div>
              </div>

              {/* Status Update Actions */}
              <div className="space-y-2 pt-3 border-t border-white/[0.08]">
                <span className="text-[10px] text-[#8B9199] block font-medium">Update Status:</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => handleStatusChange(selectedIncident.id, 'IN_PROGRESS')}
                    className="py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[#F4F4F5] font-medium transition-all cursor-pointer"
                  >
                    In Progress
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedIncident.id, 'RESOLVED')}
                    className="py-2 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-bold transition-all cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Mark Resolved</span>
                  </button>
                </div>

                <button
                  onClick={() => handleViewInTwin(selectedIncident)}
                  className="w-full mt-2 py-2.5 px-4 rounded-xl bg-[#F28C18] hover:bg-[#ff9a2e] text-black font-bold text-xs shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Box className="w-3.5 h-3.5" />
                  <span>Highlight in 3D Twin</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-[#8B9199] text-xs">Select an incident to view details</div>
          )}
        </div>
      </div>
    </div>
  );
}
