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
    <div className="w-screen min-h-screen bg-[#F0F4F8] text-[#0F172A] font-sans select-none flex flex-col">
      {/* Top Header */}
      <header className="px-8 py-4 border-b border-[#E2E8F0] bg-white sticky top-0 z-30 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] text-xs font-bold text-[#0F172A] transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-[#EA580C]" />
            <span>Dashboard</span>
          </Link>

          <div>
            <h1 className="text-base font-extrabold text-[#0F172A] flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#EA580C]" />
              Incident Lifecycle & Resolution Command
            </h1>
            <p className="text-[11px] text-[#64748B]">
              Active Incidents • AI Root-Cause Diagnostics • Coordinated Operations Resolution
            </p>
          </div>
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 p-1 bg-[#F1F5F9] border border-[#E2E8F0] rounded-full text-xs">
          {['ALL', 'ACTION_REQUIRED', 'INVESTIGATING', 'IN_PROGRESS', 'RESOLVED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                filterStatus === st
                  ? 'bg-[#EA580C] text-white font-bold shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
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
                className={`p-5 rounded-3xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#FFF7ED] border-[#FDBA74] shadow-xs'
                    : 'bg-white hover:shadow-xs border-[#E2E8F0]'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 ${
                        isCritical
                          ? 'bg-[#FEF2F2] text-[#DC2626]'
                          : 'bg-[#FFFBEB] text-[#D97706]'
                      }`}
                    >
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-[#0F172A] leading-snug">{inc.title}</h3>
                      <span className="text-xs text-[#64748B]">{inc.locationName}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                        inc.status === 'RESOLVED'
                          ? 'bg-[#DCFCE7] text-[#16A34A] border border-[#BBF7D0]'
                          : inc.status === 'ACTION_REQUIRED'
                          ? 'bg-[#FEE2E2] text-[#DC2626] border border-[#FECACA]'
                          : 'bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]'
                      }`}
                    >
                      {inc.status.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-[#94A3B8]">{inc.timestamp}</span>
                  </div>
                </div>

                <p className="text-xs text-[#64748B] pl-12 leading-relaxed mb-3">
                  {inc.aiAnalysis}
                </p>

                <div className="mt-3 pt-3 border-t border-[#F1F5F9] pl-12 flex items-center justify-between text-xs">
                  <span className="text-[#94A3B8] font-mono">Source: {inc.detectedBy}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewInTwin(inc);
                    }}
                    className="text-[#EA580C] font-bold flex items-center gap-1 hover:underline cursor-pointer"
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
            <div className="bg-white rounded-3xl border border-[#E2E8F0] p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3 mb-4">
                  <span className="text-xs font-extrabold text-[#0F172A] uppercase tracking-wider">
                    Incident Details
                  </span>
                  <span className="text-[10px] font-mono font-bold text-[#EA580C] bg-[#FFF7ED] px-2.5 py-0.5 rounded-full border border-[#FFEDD5]">
                    {selectedIncident.id.toUpperCase()}
                  </span>
                </div>

                <h2 className="text-sm font-extrabold text-[#0F172A] mb-3 leading-snug">
                  {selectedIncident.title}
                </h2>

                <div className="space-y-2.5 text-xs mb-4">
                  <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
                    <span className="text-[#64748B]">Location</span>
                    <span className="font-bold text-[#0F172A]">{selectedIncident.locationName}</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
                    <span className="text-[#64748B]">Telemetry Confidence</span>
                    <span className="font-bold text-emerald-600">
                      {(selectedIncident.confidence * 100).toFixed(1)}%
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
                    <span className="text-[#64748B] block mb-1">Affected Infrastructure</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedIncident.affectedAssets.map((assetId, i) => (
                        <span key={i} className="px-2.5 py-0.5 rounded-md bg-white border border-[#E2E8F0] text-[10px] text-[#0F172A] font-mono font-bold">
                          {assetId}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* AI Diagnosis */}
                <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] mb-3 text-xs">
                  <span className="text-[10px] font-bold text-[#EA580C] uppercase block mb-1">
                    Telemetry Root-Cause Diagnosis
                  </span>
                  <p className="text-xs text-[#475569] leading-relaxed">
                    {selectedIncident.aiAnalysis}
                  </p>
                </div>

                {/* Recommended Mitigation */}
                <div className="p-3.5 rounded-2xl bg-[#FFF7ED] border border-[#FFEDD5] mb-4 text-xs">
                  <span className="text-[10px] font-bold text-[#EA580C] uppercase block mb-1">
                    Recommended Action
                  </span>
                  <p className="text-xs text-[#9A3412] font-semibold leading-relaxed">
                    {selectedIncident.recommendation}
                  </p>
                </div>
              </div>

              {/* Status Update Actions */}
              <div className="space-y-2 pt-3.5 border-t border-[#F1F5F9]">
                <span className="text-xs text-[#64748B] block font-semibold">Update Status:</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => handleStatusChange(selectedIncident.id, 'IN_PROGRESS')}
                    className="py-2.5 px-3 rounded-2xl bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] text-[#0F172A] font-bold transition-all cursor-pointer"
                  >
                    In Progress
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedIncident.id, 'RESOLVED')}
                    className="py-2.5 px-3 rounded-2xl bg-[#DCFCE7] hover:bg-[#BBF7D0] border border-[#86EFAC] text-emerald-800 font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Mark Resolved</span>
                  </button>
                </div>

                <button
                  onClick={() => handleViewInTwin(selectedIncident)}
                  className="w-full mt-2 py-3 px-4 rounded-2xl bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Box className="w-4 h-4" />
                  <span>Highlight in 3D Twin</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-[#64748B] text-xs">Select an incident to view details</div>
          )}
        </div>
      </div>
    </div>
  );
}
