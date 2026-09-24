'use client';

import React from 'react';
import Link from 'next/link';
import { Bell, X, ArrowRight } from 'lucide-react';
import { useTwinStore } from '@/lib/twin/twinStateStore';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const { incidents, focusEntity } = useTwinStore();

  if (!isOpen) return null;

  return (
    <div className="absolute top-16 right-6 z-40 w-92 bg-white/95 backdrop-blur-2xl border border-[#E2E8F0] rounded-3xl shadow-2xl p-4.5 select-none pointer-events-auto animate-in fade-in slide-in-from-top-3 duration-200">
      <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3 mb-3">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#EA580C]" />
          <h3 className="text-xs font-bold text-[#0F172A] tracking-tight">Notifications & Alerts</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-full text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex flex-col gap-2 max-h-80 overflow-y-auto pr-1">
        {incidents.map((inc) => (
          <div
            key={inc.id}
            className={`p-3.5 rounded-2xl border text-xs transition-all ${
              inc.status === 'RESOLVED'
                ? 'bg-[#F8FAFC] border-[#E2E8F0] opacity-60'
                : inc.severity === 'HIGH'
                ? 'bg-[#FEF2F2] border-[#FEE2E2]'
                : 'bg-[#FFFBEB] border-[#FEF3C7]'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <span className="font-bold text-[#0F172A] leading-tight">{inc.title}</span>
              <span className="text-[10px] text-[#94A3B8] font-medium shrink-0">{inc.timestamp}</span>
            </div>

            <p className="text-[11px] text-[#64748B] mt-1 leading-snug">{inc.recommendation}</p>

            <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-[#E2E8F0]/60">
              <span className="text-[10px] font-mono font-bold text-[#EA580C]">{inc.locationName}</span>
              <button
                onClick={() => {
                  focusEntity(inc.locationId, inc.coordinates);
                  onClose();
                }}
                className="text-[11px] font-bold text-[#2563EB] hover:text-[#1D4ED8] flex items-center gap-1 cursor-pointer"
              >
                <span>View in Twin</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 pt-3 border-t border-[#F1F5F9] flex items-center justify-between">
        <Link
          href="/incidents"
          onClick={onClose}
          className="text-xs font-bold text-[#EA580C] hover:text-[#C2410C]"
        >
          Manage all incidents →
        </Link>
      </div>
    </div>
  );
}
