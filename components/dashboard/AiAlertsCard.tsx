'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useTwinStore } from '@/lib/twin/twinStateStore';

interface AlertItem {
  id: string;
  title: string;
  location: string;
  time: string;
  severity: 'CRITICAL' | 'WARNING' | 'NORMAL';
  targetEntityId: string;
  coords: [number, number, number];
}

const ALERTS: AlertItem[] = [
  {
    id: 'a1',
    title: 'High crowd density',
    location: 'Terminal B',
    time: '2 min ago',
    severity: 'CRITICAL',
    targetEntityId: 'terminal-b',
    coords: [11, 2.5, 3],
  },
  {
    id: 'a2',
    title: 'Unusual movement',
    location: 'Restricted Zone',
    time: '8 min ago',
    severity: 'WARNING',
    targetEntityId: 'terminal-a',
    coords: [-10, 1.2, 4],
  },
  {
    id: 'a3',
    title: 'Baggage belt slowdown',
    location: 'Terminal A',
    time: '15 min ago',
    severity: 'WARNING',
    targetEntityId: 'baggage-03',
    coords: [-12, 0.8, 8],
  },
  {
    id: 'a4',
    title: 'No anomalies',
    location: 'All systems',
    time: '32 min ago',
    severity: 'NORMAL',
    targetEntityId: 'runway-1',
    coords: [-20, 0.4, -14],
  },
];

export function AiAlertsCard() {
  const { focusEntity } = useTwinStore();

  return (
    <div className="w-[260px] rounded-2xl bg-[#11151A]/88 backdrop-blur-md border border-white/[0.08] p-2 select-none pointer-events-auto shadow-card">
      {/* Header */}
      <div className="flex items-center justify-between mb-1 px-1">
        <h3 className="text-xs font-semibold text-[#F4F4F5]">AI Alerts</h3>
        <Link
          href="/incidents"
          className="text-[10px] font-medium text-[#8B9199] hover:text-[#F4F4F5] flex items-center gap-1 transition-colors"
        >
          <span>View All</span>
          <ArrowRight className="w-2.5 h-2.5" />
        </Link>
      </div>

      {/* Alert Feed Items */}
      <div className="flex flex-col gap-0.5">
        {ALERTS.map((alert) => (
          <button
            key={alert.id}
            onClick={() => focusEntity(alert.targetEntityId, alert.coords)}
            className="w-full flex items-center justify-between px-1.5 py-1 rounded-xl hover:bg-[#151A21] transition-colors text-left cursor-pointer group"
          >
            <div className="flex items-center gap-2 min-w-0">
              {/* Severity Icon */}
              {alert.severity === 'CRITICAL' && (
                <div className="w-5 h-5 rounded-md bg-[#2D1619] text-[#EF4444] flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-3 h-3" />
                </div>
              )}
              {alert.severity === 'WARNING' && (
                <div className="w-5 h-5 rounded-md bg-[#2A2013] text-[#F59E0B] flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-3 h-3" />
                </div>
              )}
              {alert.severity === 'NORMAL' && (
                <div className="w-5 h-5 rounded-md bg-[#122820] text-[#10B981] flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3 h-3" />
                </div>
              )}

              {/* Title & Location */}
              <div className="flex flex-col min-w-0 leading-tight">
                <span className="text-[11px] font-medium text-[#F4F4F5] truncate">
                  {alert.title}
                </span>
                <span className="text-[9px] text-[#8B9199] truncate">{alert.location}</span>
              </div>
            </div>

            {/* Time Stamp */}
            <span className="text-[9px] text-[#626870] font-mono shrink-0 pl-1">
              {alert.time}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
