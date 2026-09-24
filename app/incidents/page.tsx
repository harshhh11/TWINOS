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
    <div className="w-screen h-screen overflow-y-auto bg-twin-bg text-white font-sans select-none flex flex-col">
      {/* Top Header */}
      <header className="px-8 py-4 border-b border-white/10 bg-[#12161E]/80 backdrop-blur-xl flex items-center justify-between sticky top-0 z-30 shadow-glass">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </Link>

          <div>
            <h1 className="text-base font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              Incident Lifecycle & Resolution Center
            </h1>
            <p className="text-[11px] text-white/50">
              Live Computer Vision & IoT Alerts • Spatial Localization • Operational Remediation
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
                  ? 'bg-twin-orange text-white shadow-orange-glow font-bold'
                  : 'text-white/60 hover:text-white'
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
        {/* LEFT 2 COLUMNS: INCIDENT LIST */}
        {/* ========================================================================= */}
        <div className="lg:col-span-2 flex flex-col gap-3">
          {filtered.map((inc) => {
            const isSelected = selectedIncident?.id === inc.id;

            return (
              <div
                key={inc.id}
                onClick={() => setSelectedIncident(inc)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer backdrop-blur-xl ${
                  isSelected
                    ? 'bg-[#181D26] border-orange-500/60 shadow-orange-glow'
                    : 'bg-[#12161E]/80 hover:bg-[#161B23] border-white/10'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        inc.severity === 'HIGH'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      }`}
                    >
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-white leading-snug">{inc.title}</h3>
                      <span className="text-[10px] text-white/50">{inc.locationName}</span>
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
                    <span className="text-[10px] text-white/40">{inc.timestamp}</span>
                  </div>
                </div>

                <p className="text-[11px] text-white/70 line-clamp-2 pl-10 leading-relaxed">
                  {inc.aiAnalysis}
                </p>

                <div className="mt-3 pt-2.5 border-t border-white/5 pl-10 flex items-center justify-between text-[11px]">
                  <span className="text-white/40 font-mono">Detected by: {inc.detectedBy}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewInTwin(inc);
                    }}
                    className="text-twin-orange font-bold flex items-center gap-1 hover:underline cursor-pointer"
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
        {/* RIGHT COLUMN: INCIDENT DETAIL & RESOLUTION ACTIONS */}
        {/* ========================================================================= */}
        <div className="flex flex-col gap-4">
          {selectedIncident ? (
            <div className="bg-[#12161E]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-glass flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Incident Details
                  </span>
                  <span className="text-[10px] font-mono text-twin-orange">
                    {selectedIncident.id.toUpperCase()}
                  </span>
                </div>

                <h2 className="text-sm font-bold text-white mb-2 leading-snug">
                  {selectedIncident.title}
                </h2>

                <div className="space-y-3 text-xs mb-4">
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
                    <span className="text-white/50">Location</span>
                    <span className="font-semibold text-white">{selectedIncident.locationName}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
                    <span className="text-white/50">AI Confidence</span>
                    <span className="font-bold text-emerald-400">
                      {(selectedIncident.confidence * 100).toFixed(1)}%
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <span className="text-white/50 block mb-1">Affected Infrastructure</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedIncident.affectedAssets.map((assetId, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-white/80 font-mono">
                          {assetId}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* AI Diagnosis */}
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 mb-3 text-xs">
                  <span className="text-[10px] font-bold text-twin-orange uppercase block mb-1">
                    AI Root-Cause Diagnosis
                  </span>
                  <p className="text-[11px] text-white/80 leading-relaxed">
                    {selectedIncident.aiAnalysis}
                  </p>
                </div>

                {/* Recommended Mitigation */}
                <div className="p-3.5 rounded-xl bg-orange-500/10 border border-orange-500/25 mb-4 text-xs">
                  <span className="text-[10px] font-bold text-twin-orange uppercase block mb-1">
                    Recommended Action
                  </span>
                  <p className="text-[11px] text-white/90 font-medium leading-relaxed">
                    {selectedIncident.recommendation}
                  </p>
                </div>
              </div>

              {/* Status Update Actions */}
              <div className="space-y-2 pt-3 border-t border-white/10">
                <span className="text-[10px] text-white/50 block font-medium">Update Status:</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => handleStatusChange(selectedIncident.id, 'IN_PROGRESS')}
                    className="py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition-all cursor-pointer"
                  >
                    In Progress
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedIncident.id, 'RESOLVED')}
                    className="py-2 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-bold transition-all shadow-status-green cursor-pointer"
                  >
                    Mark Resolved ✓
                  </button>
                </div>

                <button
                  onClick={() => handleViewInTwin(selectedIncident)}
                  className="w-full mt-2 py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Box className="w-3.5 h-3.5" />
                  <span>Fly Camera in 3D Twin</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-white/40 text-xs">Select an incident to view details</div>
          )}
        </div>
      </div>
    </div>
  );
}
