'use client';

import React from 'react';
import Link from 'next/link';
import { Bell, X, AlertTriangle, ShieldCheck, ArrowRight, Check } from 'lucide-react';
import { useTwinStore } from '@/lib/twin/twinStateStore';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const { incidents, focusEntity } = useTwinStore();

  if (!isOpen) return null;

  return (
    <div className="absolute top-16 right-6 z-40 w-88 bg-[#12161E]/95 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-2xl p-4 select-none pointer-events-auto animate-in fade-in slide-in-from-top-3 duration-200">
      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-2.5">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-twin-orange" />
          <h3 className="text-xs font-bold text-white tracking-wide">Notifications & Alerts</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex flex-col gap-2 max-h-80 overflow-y-auto pr-1">
        {incidents.map((inc) => (
          <div
            key={inc.id}
            className={`p-3 rounded-xl border text-xs transition-all ${
              inc.status === 'RESOLVED'
                ? 'bg-white/[0.02] border-white/5 opacity-60'
                : inc.severity === 'HIGH'
                ? 'bg-red-950/30 border-red-500/30'
                : 'bg-amber-950/20 border-amber-500/30'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <span className="font-semibold text-white/95 leading-tight">{inc.title}</span>
              <span className="text-[10px] text-white/40 shrink-0">{inc.timestamp}</span>
            </div>

            <p className="text-[11px] text-white/60 mt-1 leading-snug">{inc.recommendation}</p>

            <div className="mt-2.5 flex items-center justify-between pt-1 border-t border-white/5">
              <span className="text-[10px] font-mono text-twin-orange">{inc.locationName}</span>
              <button
                onClick={() => {
                  focusEntity(inc.locationId, inc.coordinates);
                  onClose();
                }}
                className="text-[10px] font-bold text-white/80 hover:text-white flex items-center gap-1 hover:underline cursor-pointer"
              >
                <span>View in Twin</span>
                <ArrowRight className="w-2.5 h-2.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between">
        <Link
          href="/incidents"
          onClick={onClose}
          className="text-xs font-medium text-twin-orange hover:underline"
        >
          Manage all incidents →
        </Link>
      </div>
    </div>
  );
}
