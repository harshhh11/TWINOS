'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Activity,
  Box,
  AlertTriangle,
  Cpu,
  Zap,
  Radio,
} from 'lucide-react';
import { useTwinStore } from '@/lib/twin/twinStateStore';

export default function MonitoringPage() {
  const router = useRouter();
  const { assets, incidents, focusEntity, markers } = useTwinStore();
  const [ticker, setTicker] = useState(0);

  // Real-time simulated telemetry ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setTicker((prev) => prev + 1);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const activeIncidents = incidents.filter((i) => i.status !== 'RESOLVED');
  const avgHealth = Math.round(
    assets.reduce((acc, a) => acc + a.healthScore, 0) / (assets.length || 1)
  );

  const handleLocateInTwin = (markerId: string, coords: [number, number, number]) => {
    focusEntity(markerId, coords);
    router.push('/');
  };

  return (
    <div className="w-screen min-h-screen bg-[#080D16] text-[#F8FAFC] font-sans select-none flex flex-col">
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
              <Activity className="w-4 h-4 text-[#F26A21]" />
              Real-Time Infrastructure Monitoring
            </h1>
            <p className="text-[11px] text-gray-400">
              Live Telemetry Streams • Operational Health Status • Synchronized Sensor Grid
            </p>
          </div>
        </div>

        {/* Real-Time Live Pulse Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-xs text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono font-bold">TELEMETRY STREAM: LIVE</span>
            <span className="text-gray-400 font-mono text-[10px]">T+{ticker}s</span>
          </div>

          <Link
            href="/twin"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#F26A21] hover:bg-[#EA580C] text-white font-bold text-xs shadow-[0_4px_16px_rgba(242,106,33,0.35)] transition-all"
          >
            <Box className="w-4 h-4" />
            <span>Open 3D Twin</span>
          </Link>
        </div>
      </header>

      {/* Main Monitoring Grid */}
      <div className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-6">
        {/* 1. High-Level Telemetry Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-[#0C121E]/95 backdrop-blur-2xl rounded-2xl p-5 border border-white/[0.08] shadow-md">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-gray-400">System State</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            </div>
            <div className="text-2xl font-black text-white">Nominal</div>
            <span className="text-xs text-emerald-400 font-semibold block mt-1">
              99.8% Availability uptime
            </span>
          </div>

          <div className="bg-[#0C121E]/95 backdrop-blur-2xl rounded-2xl p-5 border border-white/[0.08] shadow-md">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-gray-400">Infrastructure Health</span>
              <Cpu className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-2xl font-black text-white">{avgHealth}%</div>
            <span className="text-xs text-gray-400 font-medium block mt-1">
              5 of 6 subsystems optimal
            </span>
          </div>

          <div className="bg-[#0C121E]/95 backdrop-blur-2xl rounded-2xl p-5 border border-white/[0.08] shadow-md">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-gray-400">Active Incidents</span>
              <AlertTriangle className="w-4 h-4 text-red-400" />
            </div>
            <div className="text-2xl font-black text-red-400">{activeIncidents.length}</div>
            <span className="text-xs text-red-400 font-semibold block mt-1">
              Terminal B thermal variance
            </span>
          </div>

          <div className="bg-[#0C121E]/95 backdrop-blur-2xl rounded-2xl p-5 border border-white/[0.08] shadow-md">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-gray-400">Current Energy Grid</span>
              <Zap className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-white">24.3 MW</div>
            <span className="text-xs text-emerald-400 font-semibold block mt-1">
              -4.2% Below daily peak budget
            </span>
          </div>
        </div>

        {/* 2. Facility Subsystems Status Table */}
        <div className="bg-[#0C121E]/95 backdrop-blur-2xl rounded-3xl p-6 border border-white/[0.08] shadow-md">
          <div className="flex items-center justify-between mb-4 border-b border-white/[0.06] pb-3">
            <div>
              <h2 className="text-sm font-extrabold text-white">Primary Infrastructure Subsystems</h2>
              <p className="text-[11px] text-gray-400">
                Live operational telemetry status across terminal buildings, airside, and utilities
              </p>
            </div>
            <span className="text-xs font-mono font-semibold text-gray-400">
              Total Monitored Nodes: {markers.length}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {markers.map((marker) => {
              const isAlert = marker.statusColor === 'red';
              const isWarning = marker.statusColor === 'orange';

              return (
                <div
                  key={marker.id}
                  className={`p-4.5 rounded-2xl border transition-all ${
                    isAlert
                      ? 'bg-red-500/10 border-red-500/25'
                      : isWarning
                      ? 'bg-amber-500/10 border-amber-500/25'
                      : 'bg-white/[0.03] border-white/[0.06] hover:border-white/[0.12]'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2.5 h-2.5 rounded-full ${
                          isAlert
                            ? 'bg-red-400 animate-pulse'
                            : isWarning
                            ? 'bg-amber-400'
                            : 'bg-emerald-400'
                        }`}
                      />
                      <h3 className="text-xs font-bold text-white">{marker.name}</h3>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        isAlert
                          ? 'bg-red-500/20 text-red-400'
                          : isWarning
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-emerald-500/20 text-emerald-400'
                      }`}
                    >
                      {marker.status}
                    </span>
                  </div>

                  <p className="text-xs text-gray-300 leading-relaxed mb-3">
                    {marker.aiInsight}
                  </p>

                  <div className="flex items-center justify-between pt-2.5 border-t border-white/[0.06] text-xs">
                    <span className="text-gray-400 font-mono capitalize">Type: {marker.type}</span>
                    <button
                      onClick={() => handleLocateInTwin(marker.id, marker.position)}
                      className="text-[#F26A21] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Box className="w-3.5 h-3.5" />
                      <span>Locate in Twin</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Real-Time Telemetry Feed Log */}
        <div className="bg-[#0C121E]/95 backdrop-blur-2xl rounded-3xl p-6 border border-white/[0.08] shadow-md">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
              Live Telemetry Stream Log
            </h2>
            <span className="text-xs font-mono font-semibold text-gray-400">AUTOSYNC: 2500ms</span>
          </div>

          <div className="space-y-2.5 font-mono text-xs">
            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-gray-500">[16:26:{String((ticker * 2) % 60).padStart(2, '0')}]</span>
                <span className="text-emerald-400 font-bold">RUNWAY-01</span>
                <span className="text-gray-200">ILS Category III approach status nominal. Friction coeff: 0.82</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/20 px-2 py-0.5 rounded">NOMINAL</span>
            </div>

            <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/25 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-gray-500">[16:26:{String((ticker * 2 + 1) % 60).padStart(2, '0')}]</span>
                <span className="text-red-400 font-bold">TERM-B-CONCOURSE</span>
                <span className="text-gray-200">HVAC chiller loop variance: 29.2°C thermal load</span>
              </div>
              <span className="text-[10px] text-red-400 font-bold bg-red-500/20 px-2 py-0.5 rounded">ACTION REQUIRED</span>
            </div>

            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-gray-500">[16:26:{String((ticker * 2 + 3) % 60).padStart(2, '0')}]</span>
                <span className="text-[#F26A21] font-bold">SUBSTATION-SOUTH</span>
                <span className="text-gray-200">Transformer 2A current draw stabilized at 1,250 kW</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/20 px-2 py-0.5 rounded">NOMINAL</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
