'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  AlertTriangle,
  Box,
  ShieldAlert,
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
    <div className="w-screen min-h-screen bg-[#080B10] text-[#F8FAFC] font-sans select-none flex flex-col">
      {/* Top Header */}
      <header className="px-8 py-4 border-b border-white/[0.08] bg-[#0C121E]/95 backdrop-blur-2xl sticky top-0 z-30 shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-bold text-white transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-[#F26A21]" />
            <span>Dashboard</span>
          </Link>

          <div>
            <h1 className="text-base font-extrabold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#F26A21]" />
              Incident Lifecycle & Resolution Command
            </h1>
            <p className="text-[11px] text-gray-400">
              Active Incidents • Root-Cause Telemetry Diagnostics • Coordinated Operations Resolution
            </p>
          </div>
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 p-1 bg-white/[0.04] border border-white/[0.08] rounded-full text-xs">
          {['ALL', 'ACTION_REQUIRED', 'INVESTIGATING', 'IN_PROGRESS', 'RESOLVED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                filterStatus === st
                  ? 'bg-[#F26A21] text-white font-bold shadow-[0_2px_10px_rgba(242,106,33,0.4)]'
                  : 'text-gray-400 hover:text-white'
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
        <div className="lg:col-span-2 flex flex-col gap-3.5">
          {filtered.map((inc) => {
            const isSelected = selectedIncident?.id === inc.id;
            const isCritical = inc.severity === 'HIGH';

            return (
              <div
                key={inc.id}
                onClick={() => setSelectedIncident(inc)}
                className={`p-5 rounded-3xl border transition-all cursor-pointer bg-[#0C121E]/95 backdrop-blur-2xl shadow-md ${
                  isSelected
                    ? 'border-[#F26A21] bg-white/[0.06] shadow-[0_0_20px_rgba(242,106,33,0.2)]'
                    : 'border-white/[0.08] hover:border-white/[0.16]'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 ${
                        isCritical
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-white leading-snug">{inc.title}</h3>
                      <span className="text-xs text-gray-400">{inc.locationName}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                        inc.status === 'RESOLVED'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : inc.status === 'ACTION_REQUIRED'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {inc.status.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-gray-500 font-mono">{inc.timestamp}</span>
                  </div>
                </div>

                <p className="text-xs text-gray-300 pl-12 leading-relaxed mb-3">
                  {inc.aiAnalysis}
                </p>

                <div className="mt-3 pt-3 border-t border-white/[0.06] pl-12 flex items-center justify-between text-xs">
                  <span className="text-gray-400 font-mono">Source: {inc.detectedBy}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewInTwin(inc);
                    }}
                    className="text-[#F26A21] font-bold flex items-center gap-1 hover:underline cursor-pointer"
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
            <div className="bg-[#0C121E]/95 backdrop-blur-2xl rounded-3xl border border-white/[0.08] p-6 shadow-md flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
                  <span className="text-xs font-extrabold text-white uppercase tracking-wider">
                    Incident Details
                  </span>
                  <span className="text-[10px] font-mono font-bold text-[#F26A21] bg-[#F26A21]/20 px-2.5 py-0.5 rounded-full border border-[#F26A21]/30">
                    {selectedIncident.id.toUpperCase()}
                  </span>
                </div>

                <h2 className="text-sm font-extrabold text-white mb-3 leading-snug">
                  {selectedIncident.title}
                </h2>

                <div className="space-y-2.5 text-xs mb-4">
                  <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between">
                    <span className="text-gray-400">Location</span>
                    <span className="font-bold text-white">{selectedIncident.locationName}</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between">
                    <span className="text-gray-400">Telemetry Confidence</span>
                    <span className="font-bold text-emerald-400">
                      {(selectedIncident.confidence * 100).toFixed(1)}%
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                    <span className="text-gray-400 block mb-1">Affected Infrastructure</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedIncident.affectedAssets.map((assetId, i) => (
                        <span key={i} className="px-2.5 py-0.5 rounded-md bg-white/[0.06] border border-white/[0.08] text-[10px] text-white font-mono font-bold">
                          {assetId}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* AI Diagnosis */}
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] mb-3 text-xs">
                  <span className="text-[10px] font-bold text-[#F26A21] uppercase block mb-1">
                    Telemetry Root-Cause Diagnosis
                  </span>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    {selectedIncident.aiAnalysis}
                  </p>
                </div>

                {/* Recommended Mitigation */}
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 mb-4 text-xs">
                  <span className="text-[10px] font-bold text-amber-400 uppercase block mb-1">
                    Recommended Action
                  </span>
                  <p className="text-xs text-amber-200 font-semibold leading-relaxed">
                    {selectedIncident.recommendation}
                  </p>
                </div>
              </div>

              {/* Status Update Actions */}
              <div className="space-y-2 pt-3.5 border-t border-white/[0.06]">
                <span className="text-xs text-gray-400 block font-semibold">Update Status:</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => handleStatusChange(selectedIncident.id, 'IN_PROGRESS')}
                    className="py-2.5 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-white font-bold transition-all cursor-pointer"
                  >
                    In Progress
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedIncident.id, 'RESOLVED')}
                    className="py-2.5 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Mark Resolved</span>
                  </button>
                </div>

                <button
                  onClick={() => handleViewInTwin(selectedIncident)}
                  className="w-full mt-2 py-3 px-4 rounded-xl bg-[#F26A21] hover:bg-[#EA580C] text-white font-bold text-xs shadow-[0_4px_16px_rgba(242,106,33,0.35)] transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Box className="w-4 h-4" />
                  <span>Highlight in 3D Twin</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500 text-xs">Select an incident to view details</div>
          )}
        </div>
      </div>
    </div>
  );
}
