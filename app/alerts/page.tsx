'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  AlertTriangle,
  Box,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useTwinStore } from '@/lib/twin/twinStateStore';

interface AlertItem {
  id: string;
  type: 'ANOMALY' | 'INCIDENT' | 'SYSTEM';
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  title: string;
  affectedSystem: string;
  time: string;
  status: 'NEW' | 'ACKNOWLEDGED' | 'RESOLVED';
  anomalyPattern?: string;
  locationId: string;
  coordinates: [number, number, number];
}

const INITIAL_ALERTS: AlertItem[] = [
  {
    id: 'alt-1',
    type: 'ANOMALY',
    severity: 'CRITICAL',
    title: 'HVAC Thermal Anomaly & Electrical Load Spike',
    affectedSystem: 'Terminal B Concourse B2 & HVAC-03',
    time: '2 min ago',
    status: 'NEW',
    anomalyPattern: 'Sudden 31.8°C thermal rise in Zone B2 coil loop.',
    locationId: 'terminal-b',
    coordinates: [11, 2.5, 3],
  },
  {
    id: 'alt-2',
    type: 'ANOMALY',
    severity: 'WARNING',
    title: 'Unusual Harmonic Motor Vibration on Baggage Carousel 03',
    affectedSystem: 'Carousel Belt 03 / Motor B03',
    time: '14 min ago',
    status: 'ACKNOWLEDGED',
    anomalyPattern: 'High-frequency vibration amplitude exceeding 4.2 mm/s baseline threshold.',
    locationId: 'terminal-a',
    coordinates: [-12, 0.8, 8],
  },
  {
    id: 'alt-3',
    type: 'INCIDENT',
    severity: 'WARNING',
    title: 'Feeder Line Voltage Fluctuation on Substation Bus B',
    affectedSystem: 'Substation South Primary Feed',
    time: '28 min ago',
    status: 'ACKNOWLEDGED',
    anomalyPattern: 'Voltage deviation exceeding ±4.5% IEEE distribution tolerance.',
    locationId: 'energy-hub',
    coordinates: [-16, 1.2, 14],
  },
  {
    id: 'alt-4',
    type: 'SYSTEM',
    severity: 'INFO',
    title: 'Automated Solar Power Shifting Nominal',
    affectedSystem: 'Substation South Dual Feeder 2A',
    time: '1 hour ago',
    status: 'RESOLVED',
    anomalyPattern: 'Grid load seamlessly rebalanced across Terminal A and Apron Stand 12.',
    locationId: 'energy-hub',
    coordinates: [-16, 1.2, 14],
  },
];

export default function AlertsPage() {
  const router = useRouter();
  const { focusEntity } = useTwinStore();
  const [alerts, setAlerts] = useState<AlertItem[]>(INITIAL_ALERTS);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'CRITICAL' | 'WARNING' | 'ANOMALY'>('ALL');

  const handleAcknowledge = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'ACKNOWLEDGED' } : a))
    );
  };

  const handleResolve = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'RESOLVED' } : a))
    );
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  const handleLocateInTwin = (alert: AlertItem) => {
    focusEntity(alert.locationId, alert.coordinates);
    router.push('/');
  };

  const filtered = alerts.filter((a) => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'CRITICAL') return a.severity === 'CRITICAL';
    if (activeFilter === 'WARNING') return a.severity === 'WARNING';
    if (activeFilter === 'ANOMALY') return a.type === 'ANOMALY';
    return true;
  });

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
              <AlertTriangle className="w-4 h-4 text-[#EA580C]" />
              Alerts & Anomaly Detection Center
            </h1>
            <p className="text-[11px] text-[#64748B]">
              Real-Time Statistical Anomalies • Critical Operational Notifications • Fast Resolution Lifecycle
            </p>
          </div>
        </div>

        {/* Severity Filter Chips */}
        <div className="flex items-center gap-1.5 p-1 bg-[#F1F5F9] border border-[#E2E8F0] rounded-full text-xs">
          {[
            { id: 'ALL', label: 'All Alerts' },
            { id: 'CRITICAL', label: 'Critical' },
            { id: 'WARNING', label: 'Warnings' },
            { id: 'ANOMALY', label: 'Anomalies' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id as any)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeFilter === f.id
                  ? 'bg-[#EA580C] text-white font-bold shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main Grid */}
      <div className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-4">
        {filtered.map((item) => {
          const isCritical = item.severity === 'CRITICAL';
          const isWarning = item.severity === 'WARNING';
          const isResolved = item.status === 'RESOLVED';

          return (
            <div
              key={item.id}
              className={`p-5 rounded-3xl border transition-all ${
                isResolved
                  ? 'bg-[#F8FAFC] border-[#E2E8F0] opacity-75'
                  : isCritical
                  ? 'bg-white border-[#FEE2E2] shadow-xs'
                  : isWarning
                  ? 'bg-white border-[#FEF3C7] shadow-xs'
                  : 'bg-white border-[#E2E8F0] shadow-xs'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 ${
                      isCritical
                        ? 'bg-[#FEF2F2] text-[#DC2626]'
                        : isWarning
                        ? 'bg-[#FFFBEB] text-[#D97706]'
                        : 'bg-[#ECFDF5] text-[#059669]'
                    }`}
                  >
                    <AlertTriangle className="w-5 h-5" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                          isCritical
                            ? 'bg-[#FEF2F2] text-[#DC2626] border border-[#FEE2E2]'
                            : isWarning
                            ? 'bg-[#FFFBEB] text-[#D97706] border border-[#FEF3C7]'
                            : 'bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]'
                        }`}
                      >
                        {item.severity}
                      </span>
                      <span className="text-[10px] text-[#64748B] font-mono uppercase font-bold">
                        {item.type}
                      </span>
                      <span className="text-[10px] text-[#94A3B8]">• {item.time}</span>
                    </div>
                    <h3 className="text-sm font-extrabold text-[#0F172A] mt-0.5">{item.title}</h3>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full ${
                      item.status === 'RESOLVED'
                        ? 'bg-[#DCFCE7] text-[#16A34A] border border-[#BBF7D0]'
                        : item.status === 'ACKNOWLEDGED'
                        ? 'bg-[#EFF6FF] text-[#2563EB] border border-[#DBEAFE]'
                        : 'bg-[#FEE2E2] text-[#DC2626] border border-[#FECACA]'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>

              {/* Details & Pattern */}
              <div className="pl-12 space-y-2 text-xs">
                <div className="text-[#64748B]">
                  <strong className="text-[#0F172A]">Affected System:</strong> {item.affectedSystem}
                </div>
                {item.anomalyPattern && (
                  <div className="text-xs text-[#334155] bg-[#F8FAFC] p-3 rounded-2xl border border-[#E2E8F0] font-medium">
                    <strong className="text-[#EA580C]">Detected Pattern:</strong> {item.anomalyPattern}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pl-12 mt-4 pt-3 border-t border-[#F1F5F9] flex items-center justify-between flex-wrap gap-2 text-xs">
                <button
                  onClick={() => handleLocateInTwin(item)}
                  className="text-[#EA580C] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Box className="w-4 h-4" />
                  <span>Highlight in 3D Twin</span>
                </button>

                <div className="flex items-center gap-2">
                  {item.status === 'NEW' && (
                    <button
                      onClick={() => handleAcknowledge(item.id)}
                      className="px-3.5 py-1.5 rounded-2xl bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] text-xs font-bold text-[#0F172A] transition-colors cursor-pointer"
                    >
                      Acknowledge
                    </button>
                  )}

                  {item.status !== 'RESOLVED' && (
                    <button
                      onClick={() => handleResolve(item.id)}
                      className="px-4 py-1.5 rounded-2xl bg-[#DCFCE7] hover:bg-[#BBF7D0] border border-[#86EFAC] text-emerald-800 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Mark Resolved</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
