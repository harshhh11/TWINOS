'use client';

import React, { useState } from 'react';
import {
  X,
  AlertTriangle,
  Flame,
  ShieldAlert,
  Wrench,
  HeartPulse,
  Send,
  Sparkles,
  MapPin,
  Clock,
  UserCheck,
} from 'lucide-react';
import { useTwinStore } from '@/lib/twin/twinStateStore';
import { SeverityLevel } from '@/types';

export function ReportEmergencyModal() {
  const {
    isReportModalOpen,
    setReportModalOpen,
    reportEmergency,
    simulateDemoEmergency,
  } = useTwinStore();

  const [emergencyType, setEmergencyType] = useState<'MEDICAL' | 'FIRE' | 'SECURITY' | 'FACILITY'>('MEDICAL');
  const [terminal, setTerminal] = useState('Terminal B');
  const [gateZone, setGateZone] = useState('Gate B14');
  const [severity, setSeverity] = useState<SeverityLevel>('CRITICAL');
  const [reportedBy, setReportedBy] = useState('Gate Agent B14 (Staff ID: SA-4402)');
  const [reporterContact, setReporterContact] = useState('Ext 4414 / Radio Ch. 3');
  const [initialNotes, setInitialNotes] = useState(
    'Passenger requiring immediate medical assistance near Gate B14 boarding podium. Passenger is conscious but distressed; boarding in progress.'
  );

  if (!isReportModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    reportEmergency({
      emergencyType,
      title: `${emergencyType} Emergency — ${gateZone}`,
      locationName: `${terminal} — ${gateZone}`,
      locationDetails: `${gateZone} Lounge & Gate Podium Area`,
      severity,
      reportedBy,
      reporterContact,
      statusNotes: [initialNotes],
      operationalContext: {
        terminal,
        zone: `${terminal} Concourse North`,
        gate: gateZone,
        passengerCountNearby: 184,
        nearestMedicalStation: 'First Aid Station B-2 (0.3 km / Concourse Level 2)',
        estimatedResponseTimeMinutes: 4,
        nearestAEDLocation: `Column ${gateZone}-East (15m from Gate Podium)`,
        currentFlightImpact: {
          flightNumber: 'AA-1482',
          destination: 'DFW (Dallas/Fort Worth)',
          scheduledDeparture: '14:45',
          boardingStatus: 'Boarding Active (Group 3)',
          paxOnboard: 92,
          paxWaiting: 78,
          gateHoldRecommended: true,
        },
        accessRoute: {
          primaryCorridor: 'Service Corridor 2B via Elevator E4',
          elevatorPriorityAvailable: true,
          routeClearanceStatus: 'Unobstructed — Moderate concourse flow',
        },
        cctvFeedId: `CAM-${terminal.replace(/\s+/g, '')}-${gateZone.replace(/\s+/g, '')}-NORTH`,
      },
    });
  };

  const handleQuickDemo = () => {
    simulateDemoEmergency();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 pointer-events-auto select-none animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#0D1014] border border-red-500/30 rounded-3xl p-6 shadow-[0_0_50px_rgba(239,68,68,0.18)] space-y-5 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
              <HeartPulse className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#F4F4F5]">Report Emergency Incident</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 border border-red-500/30 text-red-400">
                  CRITICAL DISPATCH
                </span>
              </div>
              <p className="text-xs text-[#8B9199]">
                TwinOS Emergency Localization & Operational Decision Support
              </p>
            </div>
          </div>

          <button
            onClick={() => setReportModalOpen(false)}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#8B9199] hover:text-[#F4F4F5] transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Demo Pre-fill Banner */}
        <div className="p-3 rounded-2xl bg-gradient-to-r from-red-950/40 via-orange-950/30 to-black border border-orange-500/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-[#F28C18] shrink-0" />
            <div>
              <span className="text-xs font-bold text-white block">Standard Airport Demo Scenario</span>
              <span className="text-[11px] text-[#8B9199]">
                Terminal B — Gate B14 Medical Emergency with live AI operational triage
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleQuickDemo}
            className="px-3.5 py-1.5 rounded-xl bg-[#F28C18] hover:bg-[#E07D10] text-black font-bold text-xs shadow-lg hover:shadow-orange-500/20 transition-all cursor-pointer shrink-0 flex items-center gap-1.5"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>TEST INCIDENT (Gate B14)</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Emergency Type Selector */}
          <div>
            <label className="text-[11px] font-semibold text-[#8B9199] uppercase tracking-wider block mb-2">
              Emergency Type
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { type: 'MEDICAL' as const, label: 'Medical', icon: HeartPulse, color: 'text-red-400 border-red-500/40 bg-red-500/10' },
                { type: 'FIRE' as const, label: 'Fire / Smoke', icon: Flame, color: 'text-orange-400 border-orange-500/40 bg-orange-500/10' },
                { type: 'SECURITY' as const, label: 'Security', icon: ShieldAlert, color: 'text-amber-400 border-amber-500/40 bg-amber-500/10' },
                { type: 'FACILITY' as const, label: 'Facility', icon: Wrench, color: 'text-blue-400 border-blue-500/40 bg-blue-500/10' },
              ].map((item) => {
                const isSelected = emergencyType === item.type;
                const Icon = item.icon;
                return (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => setEmergencyType(item.type)}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? item.color + ' ring-1 ring-white/20'
                        : 'bg-white/[0.02] border-white/[0.08] text-[#8B9199] hover:bg-white/[0.05]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-xs font-bold">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Location Selector */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-[#8B9199] uppercase tracking-wider block mb-1.5">
                Terminal
              </label>
              <select
                value={terminal}
                onChange={(e) => setTerminal(e.target.value)}
                className="w-full bg-[#151A21] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-[#F4F4F5] focus:outline-none focus:border-[#F28C18] cursor-pointer"
              >
                <option value="Terminal A">Terminal A (Domestic Core)</option>
                <option value="Terminal B">Terminal B (International Wing)</option>
                <option value="Terminal C">Terminal C (Regional North)</option>
                <option value="Terminal D">Terminal D (Cargo & General)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[#8B9199] uppercase tracking-wider block mb-1.5">
                Gate / Zone Identifier
              </label>
              <input
                type="text"
                value={gateZone}
                onChange={(e) => setGateZone(e.target.value)}
                placeholder="e.g. Gate B14, Concourse B"
                className="w-full bg-[#151A21] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-[#F4F4F5] focus:outline-none focus:border-[#F28C18]"
                required
              />
            </div>
          </div>

          {/* Severity & Reported By */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-[#8B9199] uppercase tracking-wider block mb-1.5">
                Severity Level
              </label>
              <div className="flex gap-2">
                {[
                  { level: 'CRITICAL' as const, label: 'Critical', bg: 'bg-red-500/20 text-red-400 border-red-500/40' },
                  { level: 'HIGH' as const, label: 'High', bg: 'bg-orange-500/20 text-orange-400 border-orange-500/40' },
                  { level: 'MEDIUM' as const, label: 'Medium', bg: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40' },
                ].map((s) => (
                  <button
                    key={s.level}
                    type="button"
                    onClick={() => setSeverity(s.level)}
                    className={`flex-1 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                      severity === s.level
                        ? s.bg + ' ring-1 ring-white/30'
                        : 'bg-white/[0.02] border-white/[0.08] text-[#8B9199]'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[#8B9199] uppercase tracking-wider block mb-1.5">
                Reported By (Staff / Source)
              </label>
              <input
                type="text"
                value={reportedBy}
                onChange={(e) => setReportedBy(e.target.value)}
                placeholder="Staff ID / Gate Agent"
                className="w-full bg-[#151A21] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-[#F4F4F5] focus:outline-none focus:border-[#F28C18]"
                required
              />
            </div>
          </div>

          {/* Initial Operational Notes */}
          <div>
            <label className="text-[11px] font-semibold text-[#8B9199] uppercase tracking-wider block mb-1.5">
              Initial Operational Notes (Non-Clinical)
            </label>
            <textarea
              rows={2}
              value={initialNotes}
              onChange={(e) => setInitialNotes(e.target.value)}
              placeholder="Describe observable situation, location cues, and immediate environmental conditions..."
              className="w-full bg-[#151A21] border border-white/[0.1] rounded-xl p-3 text-xs text-[#F4F4F5] focus:outline-none focus:border-[#F28C18] resize-none"
            />
            <p className="text-[10px] text-[#8B9199] mt-1">
              TwinOS is an operational decision-support tool. Do not enter medical diagnoses or clinical evaluations.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/[0.08]">
            <button
              type="button"
              onClick={() => setReportModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-[#8B9199] hover:text-[#F4F4F5] font-medium transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-red-600/30 transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Report Emergency & Localize in Twin</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
