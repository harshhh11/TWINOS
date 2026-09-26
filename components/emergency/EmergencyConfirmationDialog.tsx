'use client';

import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  X,
  UserCheck,
  Send,
  Info,
} from 'lucide-react';
import { useTwinStore } from '@/lib/twin/twinStateStore';

export function EmergencyConfirmationDialog() {
  const { pendingConfirmation, setPendingConfirmation } = useTwinStore();
  const [adminNotes, setAdminNotes] = useState('');
  const [adminSignoff, setAdminSignoff] = useState('H. Shereef (Operations Duty Manager)');

  if (!pendingConfirmation) return null;

  const handleConfirm = () => {
    pendingConfirmation.onConfirm(adminNotes);
    setPendingConfirmation(null);
    setAdminNotes('');
  };

  const handleCancel = () => {
    setPendingConfirmation(null);
    setAdminNotes('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 pointer-events-auto select-none animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-[#0D1014] border border-[#F28C18]/40 rounded-3xl p-6 shadow-[0_0_50px_rgba(242,140,24,0.15)] space-y-4 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/[0.08] pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F28C18]/15 border border-[#F28C18]/30 flex items-center justify-center text-[#F28C18] shadow-lg">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#F4F4F5]">Human-in-the-Loop Authorization</h3>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#F28C18]/20 border border-[#F28C18]/30 text-[#F28C18]">
                  ADMIN REVIEW
                </span>
              </div>
              <p className="text-[11px] text-[#8B9199]">
                TwinOS Operational Decision Support Verification
              </p>
            </div>
          </div>

          <button
            onClick={handleCancel}
            className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#8B9199] hover:text-[#F4F4F5] transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Summary Card */}
        <div className="p-3.5 rounded-2xl bg-[#14181F] border border-white/[0.08] space-y-2">
          <div className="text-xs font-bold text-white flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#F28C18]" />
            {pendingConfirmation.title}
          </div>
          <p className="text-xs text-[#8B9199] leading-relaxed">
            {pendingConfirmation.description}
          </p>
        </div>

        {/* Operational Context Details */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <span className="text-[9px] text-[#8B9199] uppercase font-mono block">Target Recipient</span>
            <span className="text-[11px] font-bold text-[#F4F4F5] mt-0.5 block leading-tight">
              {pendingConfirmation.recipient}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <span className="text-[9px] text-[#8B9199] uppercase font-mono block">Operational Impact</span>
            <span className="text-[11px] font-bold text-amber-300 mt-0.5 block leading-tight">
              {pendingConfirmation.impact}
            </span>
          </div>
        </div>

        {/* Strict Human Governance Notice */}
        <div className="p-2.5 rounded-xl bg-sky-950/30 border border-sky-500/20 flex items-start gap-2 text-[11px] text-sky-200">
          <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
          <div>
            <strong>Operational Governance:</strong> Actions are not dispatched autonomously. Confirming registers your administrator credentials in the immutable audit log.
          </div>
        </div>

        {/* Administrator Sign-off and Notes */}
        <div className="space-y-2.5 pt-1">
          <div>
            <label className="text-[10px] font-semibold text-[#8B9199] uppercase tracking-wider block mb-1">
              Authorizing Administrator
            </label>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#151A21] border border-white/[0.08] text-xs text-[#F4F4F5]">
              <UserCheck className="w-3.5 h-3.5 text-[#F28C18]" />
              <input
                type="text"
                value={adminSignoff}
                onChange={(e) => setAdminSignoff(e.target.value)}
                className="bg-transparent flex-1 text-xs text-[#F4F4F5] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-semibold text-[#8B9199] uppercase tracking-wider block mb-1">
              Operational Instructions / Field Notes (Optional)
            </label>
            <input
              type="text"
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="e.g. Cleared via Concourse B-2 corridor. Priority access code 911."
              className="w-full bg-[#151A21] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-[#F4F4F5] focus:outline-none focus:border-[#F28C18]"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-white/[0.08]">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-[#8B9199] hover:text-[#F4F4F5] font-medium transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-5 py-2 rounded-xl bg-[#F28C18] hover:bg-[#E07D10] text-black font-bold text-xs flex items-center gap-1.5 shadow-lg hover:shadow-orange-500/20 transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Confirm & Dispatch Action</span>
          </button>
        </div>
      </div>
    </div>
  );
}
