'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  X,
  ShieldCheck,
  Plane,
  FileCheck,
  UserCheck,
  Building,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useTwinStore } from '@/lib/twin/twinStateStore';
import { EmergencyIncident } from '@/types';

export function EmergencyResolveModal() {
  const {
    isResolveModalOpen,
    setResolveModalOpen,
    activeEmergency,
    resolveEmergency,
  } = useTwinStore();

  const [outcome, setOutcome] = useState<EmergencyIncident['resolutionOutcome']>('TREATED_ON_SITE');
  const [returnGateNormal, setReturnGateNormal] = useState(true);
  const [flightStatus, setFlightStatus] = useState('Boarding resumed for Flight AA-1482; estimated +14 min turnaround delay.');
  const [finalNotes, setFinalNotes] = useState(
    'Passenger attended by Paramedic Unit Alpha-2. Vitals stabilized on-site; cleared for domestic travel by responding medics. Gate B14 queue normalized.'
  );
  const [adminName, setAdminName] = useState('H. Shereef (Operations Duty Manager)');

  if (!isResolveModalOpen || !activeEmergency) return null;

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    resolveEmergency(outcome, `${finalNotes} [Flight Update: ${flightStatus}]`, returnGateNormal, adminName);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 pointer-events-auto select-none animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-[#0D1014] border border-emerald-500/30 rounded-3xl p-6 shadow-[0_0_50px_rgba(16,185,129,0.15)] space-y-4 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/[0.08] pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-lg">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#F4F4F5]">Resolve Emergency Incident</h3>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
                  CLOSURE & AUDIT SEAL
                </span>
              </div>
              <p className="text-[11px] text-[#8B9199]">
                {activeEmergency.incidentNumber} • {activeEmergency.locationName}
              </p>
            </div>
          </div>

          <button
            onClick={() => setResolveModalOpen(false)}
            className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#8B9199] hover:text-[#F4F4F5] transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleConfirm} className="space-y-3.5">
          {/* Resolution Outcome Selection */}
          <div>
            <label className="text-[11px] font-semibold text-[#8B9199] uppercase tracking-wider block mb-1.5">
              Incident Resolution Outcome
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { value: 'TREATED_ON_SITE' as const, label: 'Treated On-Site & Cleared' },
                { value: 'TRANSFERRED_TO_HOSPITAL' as const, label: 'Transferred via Ambulance' },
                { value: 'PASSENGER_DECLINED' as const, label: 'Passenger Declined Care' },
                { value: 'STAND_DOWN' as const, label: 'Stand Down / False Alarm' },
              ].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setOutcome(item.value)}
                  className={`p-2.5 rounded-xl border text-left font-medium transition-all cursor-pointer ${
                    outcome === item.value
                      ? 'bg-emerald-500/20 border-emerald-500/50 text-white font-bold ring-1 ring-emerald-500/30'
                      : 'bg-white/[0.02] border-white/[0.08] text-[#8B9199] hover:bg-white/[0.05]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Digital Twin State Checkbox */}
          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.08] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Building className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="text-xs font-bold text-white block">Restore Digital Twin to Normal</span>
                <span className="text-[10px] text-[#8B9199]">
                  Sets Gate B14 3D spatial status from Emergency (Red) to Normal Operations (Green)
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={returnGateNormal}
              onChange={(e) => setReturnGateNormal(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-500 bg-[#151A21] border-white/20 focus:ring-emerald-500 cursor-pointer"
            />
          </div>

          {/* Impacted Flight Note */}
          <div>
            <label className="text-[11px] font-semibold text-[#8B9199] uppercase tracking-wider block mb-1">
              Flight Operations Status (AA-1482)
            </label>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#151A21] border border-white/[0.08] text-xs text-[#F4F4F5]">
              <Plane className="w-3.5 h-3.5 text-[#F28C18]" />
              <input
                type="text"
                value={flightStatus}
                onChange={(e) => setFlightStatus(e.target.value)}
                className="bg-transparent flex-1 text-xs text-[#F4F4F5] focus:outline-none"
              />
            </div>
          </div>

          {/* Final Resolution Notes */}
          <div>
            <label className="text-[11px] font-semibold text-[#8B9199] uppercase tracking-wider block mb-1">
              Final Operational Summary & Log Notes (Required)
            </label>
            <textarea
              rows={2}
              required
              value={finalNotes}
              onChange={(e) => setFinalNotes(e.target.value)}
              className="w-full bg-[#151A21] border border-white/[0.08] rounded-xl p-2.5 text-xs text-[#F4F4F5] focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          {/* Closing Administrator */}
          <div>
            <label className="text-[11px] font-semibold text-[#8B9199] uppercase tracking-wider block mb-1">
              Closing Administrator Signature
            </label>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#151A21] border border-white/[0.08] text-xs text-[#F4F4F5]">
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <input
                type="text"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                className="bg-transparent flex-1 text-xs text-[#F4F4F5] focus:outline-none"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-white/[0.08]">
            <button
              type="button"
              onClick={() => setResolveModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-[#8B9199] hover:text-[#F4F4F5] font-medium transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Confirm Resolution & Seal Audit</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
