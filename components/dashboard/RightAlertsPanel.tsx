'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useTwinStore } from '@/lib/twin/twinStateStore';

interface AlertItem {
  id: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW' | 'NORMAL';
  location: string;
  description: string;
  timestamp: string;
}

// STRICTLY 3-4 COMPACT ALERTS (Section 15)
const COMPACT_ALERTS: AlertItem[] = [
  {
    id: 'alt-1',
    severity: 'HIGH',
    location: 'Terminal B',
    description: 'Operational anomaly (thermal variance)',
    timestamp: '2m ago',
  },
  {
    id: 'alt-2',
    severity: 'MEDIUM',
    location: 'Energy Facility',
    description: 'Usage deviation (+18% power surge)',
    timestamp: '8m ago',
  },
  {
    id: 'alt-3',
    severity: 'LOW',
    location: 'Parking Concourse',
    description: 'Capacity threshold (68% occupied)',
    timestamp: '14m ago',
  },
  {
    id: 'alt-4',
    severity: 'NORMAL',
    location: 'Runway 1 (09L/27R)',
    description: 'ILS Category III approach verified',
    timestamp: 'Live',
  },
];

export function RightAlertsPanel() {
  const { setCopilotOpen } = useTwinStore();

  return (
    <aside className="w-full lg:w-[280px] xl:w-[300px] shrink-0 bg-[#0C121E]/95 backdrop-blur-2xl rounded-[24px] p-4 flex flex-col justify-between border border-white/[0.08] shadow-[0_12px_40px_rgba(0,0,0,0.6)] select-none">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
            <h3 className="text-xs font-bold text-white tracking-tight">Active Alerts</h3>
          </div>
          <Link
            href="/alerts"
            className="text-[11px] font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-0.5 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Compact Alerts List (Max 4 Items) */}
        <div className="flex flex-col gap-2">
          {COMPACT_ALERTS.map((alert) => (
            <div
              key={alert.id}
              className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.05] transition-all flex flex-col gap-1 cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-[9px] font-mono font-extrabold px-1.5 py-0.2 rounded ${
                    alert.severity === 'HIGH'
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : alert.severity === 'MEDIUM'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : alert.severity === 'LOW'
                      ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  {alert.severity}
                </span>
                <span className="text-[10px] text-gray-400 font-mono">
                  {alert.timestamp}
                </span>
              </div>

              <div className="flex items-baseline justify-between mt-0.5">
                <span className="text-xs font-bold text-white tracking-tight group-hover:text-[#F26A21] transition-colors">
                  {alert.location}
                </span>
              </div>

              <span className="text-[10px] text-gray-400 leading-tight">
                {alert.description}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Contextual AI Copilot Mini Card (Section 16) */}
      <div className="pt-2.5 border-t border-white/[0.06]">
        <button
          onClick={() => setCopilotOpen(true)}
          className="w-full flex items-center justify-between p-2 rounded-xl bg-white/[0.03] hover:bg-[#F26A21]/15 border border-white/[0.06] hover:border-[#F26A21]/30 transition-all cursor-pointer group text-left"
        >
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-[#F26A21]/20 text-[#F26A21] flex items-center justify-center shrink-0">
              <Sparkles className="w-3 h-3" />
            </div>
            <span className="text-[10px] font-semibold text-gray-300 group-hover:text-white">
              Ask Copilot about alerts
            </span>
          </div>
          <ArrowRight className="w-3 h-3 text-gray-400 group-hover:text-[#F26A21] transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </aside>
  );
}
