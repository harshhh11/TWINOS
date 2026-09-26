'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Box,
  Radio,
  Filter,
  Eye,
  Shield,
  Zap,
  Activity,
  Check,
  HeartPulse,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useTwinStore } from '@/lib/twin/twinStateStore';
import { ReportEmergencyModal } from '@/components/emergency/ReportEmergencyModal';
import { EmergencyConfirmationDialog } from '@/components/emergency/EmergencyConfirmationDialog';
import { EmergencyResolveModal } from '@/components/emergency/EmergencyResolveModal';
import { EmergencyIncidentDrawer } from '@/components/emergency/EmergencyIncidentDrawer';

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
    title: 'Thermal Anomaly & Ingress Backpressure Surge',
    affectedSystem: 'Terminal B Concourse B2 & HVAC-03',
    time: '2 min ago',
    status: 'NEW',
    anomalyPattern: 'Sudden +32% crowd density spike with simultaneous 31.8°C thermal rise in Zone B2.',
    locationId: 'terminal-b',
    coordinates: [11, 2.5, 3],
  },
  {
    id: 'alt-2',
    type: 'ANOMALY',
    severity: 'WARNING',
    title: 'Unusual Harmonic Motor Vibration on Baggage Carousel 03',
    affectedSystem: 'Carousel Belt 03 / Inverter B03',
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
    title: 'Unverified Airside Perimeter Motion',
    affectedSystem: 'Gate 4 Restricted Maintenance Corridor',
    time: '28 min ago',
    status: 'ACKNOWLEDGED',
    anomalyPattern: 'Optical flow boundary tripwire breach outside scheduled service window.',
    locationId: 'terminal-a',
    coordinates: [-10, 1.2, 4],
  },
  {
    id: 'alt-4',
    type: 'SYSTEM',
    severity: 'INFO',
    title: 'Automated Micro-Grid Solar Shifting Nominal',
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
  const {
    focusEntity,
    activeEmergency,
    setEmergencyDrawerOpen,
    setReportModalOpen,
    simulateDemoEmergency,
  } = useTwinStore();
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
    <div className="w-screen h-screen overflow-y-auto bg-[#080A0D] text-[#F4F4F5] font-sans select-none flex flex-col">
      {/* Top Header */}
      <header className="px-8 py-4 border-b border-white/[0.08] bg-[#0D1014]/90 backdrop-blur-xl flex items-center justify-between sticky top-0 z-30 shadow-card">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-[#F4F4F5] transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </Link>

          <div>
            <h1 className="text-base font-bold text-[#F4F4F5] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#F28C18]" />
              Alerts & Anomaly Detection Center
            </h1>
            <p className="text-[11px] text-[#8B9199]">
              Real-Time Statistical Anomalies • Critical Operational Notifications • Fast Resolution Lifecycle
            </p>
          </div>
        </div>

        {/* Emergency Actions & Severity Filters */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => simulateDemoEmergency()}
            className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>TEST INCIDENT (B14)</span>
          </button>

          <button
            type="button"
            onClick={() => setReportModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg shadow-red-600/30 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <HeartPulse className="w-3.5 h-3.5" />
            <span>+ REPORT EMERGENCY</span>
          </button>

          <div className="flex items-center gap-1.5 p-1 bg-white/5 border border-white/10 rounded-full text-xs">
            {[
              { id: 'ALL', label: 'All Alerts' },
              { id: 'CRITICAL', label: 'Critical' },
              { id: 'WARNING', label: 'Warnings' },
              { id: 'ANOMALY', label: 'Anomalies' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id as any)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  activeFilter === f.id
                    ? 'bg-[#F28C18] text-black font-bold shadow-sm'
                    : 'text-[#8B9199] hover:text-[#F4F4F5]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <div className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-4">
        {/* Active Emergency Alert Banner */}
        {activeEmergency && (
          <div
            onClick={() => setEmergencyDrawerOpen(true)}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              activeEmergency.status === 'RESOLVED'
                ? 'bg-emerald-950/20 border-emerald-500/40 hover:border-emerald-500'
                : 'bg-red-950/40 border-red-500/60 shadow-[0_0_30px_rgba(239,68,68,0.25)] hover:border-red-400 animate-pulse'
            }`}
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    activeEmergency.status === 'RESOLVED'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-red-500/20 text-red-400 border border-red-500/40'
                  }`}
                >
                  <HeartPulse className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">
                      CRITICAL EMERGENCY: {activeEmergency.title}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                      {activeEmergency.severity}
                    </span>
                  </div>
                  <span className="text-xs text-[#8B9199]">
                    {activeEmergency.locationName} • {activeEmergency.operationalContext.nearestMedicalStation}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEmergencyDrawerOpen(true);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-[#F28C18] hover:bg-[#E07D10] text-black font-bold text-xs shadow-sm transition-all"
                >
                  Manage Emergency
                </button>
              </div>
            </div>
          </div>
        )}
        {filtered.map((item) => {
          const isCritical = item.severity === 'CRITICAL';
          const isWarning = item.severity === 'WARNING';
          const isResolved = item.status === 'RESOLVED';

          return (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition-all ${
                isResolved
                  ? 'bg-[#0D1014]/60 border-white/[0.05] opacity-75'
                  : isCritical
                  ? 'bg-red-950/20 border-red-500/40 shadow-card'
                  : isWarning
                  ? 'bg-amber-950/20 border-amber-500/30 shadow-card'
                  : 'bg-[#0D1014]/90 border-white/[0.08] shadow-card'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      isCritical
                        ? 'bg-red-500/20 text-red-400'
                        : isWarning
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-emerald-500/20 text-emerald-400'
                    }`}
                  >
                    <AlertTriangle className="w-4 h-4" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${
                          isCritical
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : isWarning
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {item.severity}
                      </span>
                      <span className="text-[10px] text-[#8B9199] font-mono uppercase">
                        {item.type}
                      </span>
                      <span className="text-[10px] text-white/40">• {item.time}</span>
                    </div>
                    <h3 className="text-sm font-bold text-[#F4F4F5] mt-0.5">{item.title}</h3>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                      item.status === 'RESOLVED'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : item.status === 'ACKNOWLEDGED'
                        ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                        : 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>

              {/* Details & Pattern */}
              <div className="pl-11 space-y-1.5 text-xs">
                <div className="text-[#8B9199]">
                  <strong className="text-[#F4F4F5]">Affected System:</strong> {item.affectedSystem}
                </div>
                {item.anomalyPattern && (
                  <div className="text-[11px] text-white/70 bg-white/[0.02] p-2.5 rounded-xl border border-white/5">
                    <strong className="text-[#F28C18]">Detected Pattern:</strong> {item.anomalyPattern}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pl-11 mt-3 pt-3 border-t border-white/5 flex items-center justify-between flex-wrap gap-2 text-xs">
                <button
                  onClick={() => handleLocateInTwin(item)}
                  className="text-[#F28C18] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Box className="w-3.5 h-3.5" />
                  <span>Highlight in 3D Twin</span>
                </button>

                <div className="flex items-center gap-2">
                  {item.status === 'NEW' && (
                    <button
                      onClick={() => handleAcknowledge(item.id)}
                      className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-[#F4F4F5] transition-colors cursor-pointer"
                    >
                      Acknowledge
                    </button>
                  )}

                  {item.status !== 'RESOLVED' && (
                    <button
                      onClick={() => handleResolve(item.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer"
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

      {/* Medical Emergency Operations Slide-over Drawer */}
      <EmergencyIncidentDrawer />

      {/* Medical Emergency Report Modal */}
      <ReportEmergencyModal />

      {/* Human-in-the-Loop Confirmation Dialog */}
      <EmergencyConfirmationDialog />

      {/* Resolution & Closure Modal */}
      <EmergencyResolveModal />
    </div>
  );
}
