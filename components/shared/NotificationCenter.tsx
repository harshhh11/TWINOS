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
    <div className="absolute top-16 right-6 z-40 w-92 bg-[#0C121E]/95 backdrop-blur-2xl border border-white/[0.1] rounded-3xl shadow-[0_16px_40px_rgba(0,0,0,0.8)] p-4.5 select-none pointer-events-auto animate-in fade-in slide-in-from-top-3 duration-200 text-white">
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 mb-3">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#F26A21]" />
          <h3 className="text-xs font-bold text-white tracking-tight">Notifications & Alerts</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
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
                ? 'bg-white/[0.02] border-white/[0.05] opacity-50'
                : inc.severity === 'HIGH'
                ? 'bg-red-500/10 border-red-500/25'
                : 'bg-amber-500/10 border-amber-500/25'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <span className="font-bold text-white leading-tight">{inc.title}</span>
              <span className="text-[10px] text-gray-400 font-medium shrink-0">{inc.timestamp}</span>
            </div>

            <p className="text-[11px] text-gray-300 mt-1 leading-snug">{inc.recommendation}</p>

            <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-white/[0.06]">
              <span className="text-[10px] font-mono font-bold text-[#F26A21]">{inc.locationName}</span>
              <button
                onClick={() => {
                  focusEntity(inc.locationId, inc.coordinates);
                  onClose();
                }}
                className="text-[11px] font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1 cursor-pointer"
              >
                <span>View in Twin</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 pt-3 border-t border-white/[0.08] flex items-center justify-between">
        <Link
          href="/monitoring"
          onClick={onClose}
          className="text-xs font-bold text-[#F26A21] hover:underline"
        >
          Manage all telemetry →
        </Link>
      </div>
    </div>
  );
}
