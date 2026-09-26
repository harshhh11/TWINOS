'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  AlertCircle,
  Box,
  Check,
  Zap,
  Activity,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useTwinStore } from '@/lib/twin/twinStateStore';

interface AnomalyRecord {
  id: string;
  severity: 'CRITICAL' | 'WARNING' | 'NORMAL';
  title: string;
  asset: string;
  location: string;
  detectedAt: string;
  pattern: string;
  baseline: string;
  variance: string;
  status: 'DETECTED' | 'INVESTIGATING' | 'RESOLVED';
  coordinates: [number, number, number];
  locationId: string;
}

const INITIAL_ANOMALIES: AnomalyRecord[] = [
  {
    id: 'anom-1',
    severity: 'CRITICAL',
    title: 'Unusual Energy Consumption & Thermal Loop Spikes',
    asset: 'HVAC-04 (Chiller Unit 03)',
    location: 'Terminal B South Mechanical Bay',
    detectedAt: '2 min ago',
    pattern: 'Sudden +31.8°C thermal rise in Zone B2 primary refrigerant loop with 145 kW continuous draw.',
    baseline: 'Nominal 21.0°C - 24.5°C operating band',
    variance: '+29.2% above baseline expectation',
    status: 'DETECTED',
    coordinates: [12, 3.8, 2],
    locationId: 'terminal-b',
  },
  {
    id: 'anom-2',
    severity: 'WARNING',
    title: 'Unexpected Asset Load & Velocity Degradation',
    asset: 'Terminal B Concourse Infeed',
    location: 'Terminal B Gates B1-B8 Concourse',
    detectedAt: '12 min ago',
    pattern: 'Transit duty load exceeding rated equipment throughput by 22% during off-peak scheduling.',
    baseline: 'Nominal 55% designed capacity',
    variance: '+23.0% localized stress',
    status: 'INVESTIGATING',
    coordinates: [2, 3, 10],
    locationId: 'terminal-b',
  },
  {
    id: 'anom-3',
    severity: 'WARNING',
    title: 'Feeder Voltage Fluctuation',
    asset: 'Substation South Primary Transformer',
    location: 'Substation South Vault',
    detectedAt: '25 min ago',
    pattern: 'Harmonic distortion variance of 4.8% on secondary line B.',
    baseline: 'Nominal < 2.0% THD tolerance',
    variance: '+2.8% above threshold',
    status: 'INVESTIGATING',
    coordinates: [-16, 1.2, 14],
    locationId: 'energy-hub',
  },
  {
    id: 'anom-4',
    severity: 'NORMAL',
    title: 'Conveyor Drive Motor Dynamic Balancing Nominal',
    asset: 'Baggage Conveyor 03 Motor',
    location: 'Terminal A Baggage Transfer',
    detectedAt: '45 min ago',
    pattern: 'Harmonic vibration stabilized at 2.1 mm/s following preventive lubrication.',
    baseline: '< 4.5 mm/s acceptable vibration limit',
    variance: 'Within tolerance (-12% vs threshold)',
    status: 'RESOLVED',
    coordinates: [-12, 0.8, 8],
    locationId: 'terminal-a',
  },
];

export default function AnomaliesPage() {
  const router = useRouter();
  const { focusEntity } = useTwinStore();
  const [anomalies, setAnomalies] = useState<AnomalyRecord[]>(INITIAL_ANOMALIES);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'CRITICAL' | 'WARNING' | 'NORMAL'>('ALL');

  const handleResolve = (id: string) => {
    setAnomalies((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'RESOLVED' } : a))
    );
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  const handleLocateInTwin = (item: AnomalyRecord) => {
    focusEntity(item.locationId, item.coordinates);
    router.push('/');
  };

  const filtered = anomalies.filter((item) => {
    if (activeFilter === 'ALL') return true;
    return item.severity === activeFilter;
  });

  return (
    <div className="w-screen min-h-screen bg-[#080B10] text-[#F8FAFC] font-sans select-none flex flex-col">
      {/* Top Header */}
      <header className="px-8 py-4 border-b border-white/[0.08] bg-[#0C121E]/95 backdrop-blur-2xl sticky top-0 z-30 shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-bold text-white transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-[#F26A21]" />
            <span>Dashboard</span>
          </Link>

          <div>
            <h1 className="text-base font-extrabold text-white flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#F26A21]" />
              Operational Anomaly Detection
            </h1>
            <p className="text-[11px] text-gray-400">
              Statistical Telemetry Deviations • Physical Infrastructure Anomalies • Real-Time Operational Signals
            </p>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 p-1 bg-white/[0.04] border border-white/[0.08] rounded-full text-xs">
          {['ALL', 'CRITICAL', 'WARNING', 'NORMAL'].map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f as any)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeFilter === f
                  ? 'bg-[#F26A21] text-white font-bold shadow-[0_2px_10px_rgba(242,106,33,0.4)]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </header>

      {/* Main Grid */}
      <div className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-4">
        {/* Summary Card */}
        <div className="p-5 rounded-3xl bg-[#0C121E]/95 backdrop-blur-2xl border border-white/[0.08] shadow-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-500/15 border border-red-500/25 flex items-center justify-center text-red-400">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-white">
                {anomalies.filter((a) => a.status !== 'RESOLVED').length} Active Anomalies Flagged by Statistical Engine
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                TwinOS evaluates real-time asset vibration, temperature, voltage, and load metrics against historical nominal baselines.
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/15 px-3 py-1.5 rounded-full border border-emerald-500/30">
            System Error Rate: &lt; 0.01%
          </span>
        </div>

        {/* Anomaly Records List */}
        {filtered.map((item) => {
          const isCritical = item.severity === 'CRITICAL';
          const isWarning = item.severity === 'WARNING';
          const isResolved = item.status === 'RESOLVED';

          return (
            <div
              key={item.id}
              className={`p-6 rounded-3xl border transition-all bg-[#0C121E]/95 backdrop-blur-2xl shadow-md ${
                isResolved
                  ? 'border-white/[0.04] opacity-60'
                  : isCritical
                  ? 'border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.08)]'
                  : isWarning
                  ? 'border-amber-500/30'
                  : 'border-white/[0.08]'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 ${
                      isCritical
                        ? 'bg-red-500/20 text-red-400'
                        : isWarning
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-emerald-500/20 text-emerald-400'
                    }`}
                  >
                    <AlertCircle className="w-5 h-5" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                          isCritical
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : isWarning
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {item.severity}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono font-bold">
                        {item.asset}
                      </span>
                      <span className="text-[10px] text-gray-500">• {item.detectedAt}</span>
                    </div>
                    <h3 className="text-sm font-extrabold text-white mt-0.5">{item.title}</h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full ${
                      item.status === 'RESOLVED'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : item.status === 'INVESTIGATING'
                        ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>

              {/* Pattern and Details */}
              <div className="space-y-2.5 text-xs pl-12">
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                  <strong className="text-white block mb-1">Detected Anomaly Pattern:</strong>
                  <p className="text-gray-300 leading-relaxed font-medium">{item.pattern}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05] text-gray-400">
                    <span className="text-[10px] text-gray-500 block font-mono">Statistical Baseline</span>
                    <strong className="text-white">{item.baseline}</strong>
                  </div>
                  <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200">
                    <span className="text-[10px] text-amber-400 block font-mono">Observed Variance</span>
                    <strong className="text-amber-300">{item.variance}</strong>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pl-12 mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between flex-wrap gap-2 text-xs">
                <button
                  onClick={() => handleLocateInTwin(item)}
                  className="text-[#F26A21] hover:underline font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Box className="w-4 h-4" />
                  <span>Highlight Asset in 3D Twin</span>
                </button>

                {!isResolved && (
                  <button
                    onClick={() => handleResolve(item.id)}
                    className="px-4 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Acknowledge & Mark Resolved</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
