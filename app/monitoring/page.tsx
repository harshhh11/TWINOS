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
  CheckCircle2,
  Clock,
  Radio,
  RefreshCw,
  TrendingUp,
  Shield,
  Layers,
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
              <Activity className="w-4 h-4 text-[#F28C18]" />
              Real-Time Infrastructure Monitoring
            </h1>
            <p className="text-[11px] text-[#8B9199]">
              Live Telemetry Streams • Operational Health Status • Synchronized Sensor Grid
            </p>
          </div>
        </div>

        {/* Real-Time Live Pulse Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono font-bold">TELEMETRY STREAM: LIVE</span>
            <span className="text-white/40 font-mono text-[10px]">T+{ticker}s</span>
          </div>

          <Link
            href="/twin"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#F28C18] hover:bg-[#ff9a2e] text-black font-bold text-xs shadow-sm transition-all"
          >
            <Box className="w-3.5 h-3.5" />
            <span>Open 3D Twin</span>
          </Link>
        </div>
      </header>

      {/* Main Monitoring Grid */}
      <div className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-6">
        {/* 1. High-Level Telemetry Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-[#0D1014]/90 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-4 shadow-card">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-[#8B9199] font-medium">System State</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-[#F4F4F5]">Nominal</div>
            <span className="text-[11px] text-emerald-400 block mt-1">
              99.8% Availability uptime
            </span>
          </div>

          <div className="bg-[#0D1014]/90 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-4 shadow-card">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-[#8B9199] font-medium">Infrastructure Health</span>
              <Cpu className="w-4 h-4 text-[#F28C18]" />
            </div>
            <div className="text-2xl font-bold text-[#F4F4F5]">{avgHealth}%</div>
            <span className="text-[11px] text-[#8B9199] block mt-1">
              5 of 6 subsystems optimal
            </span>
          </div>

          <div className="bg-[#0D1014]/90 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-4 shadow-card">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-[#8B9199] font-medium">Active Incidents</span>
              <AlertTriangle className="w-4 h-4 text-red-400" />
            </div>
            <div className="text-2xl font-bold text-red-400">{activeIncidents.length}</div>
            <span className="text-[11px] text-red-400 block mt-1">
              Terminal B concourse surge
            </span>
          </div>

          <div className="bg-[#0D1014]/90 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-4 shadow-card">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-[#8B9199] font-medium">Current Energy Grid</span>
              <Zap className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-2xl font-bold text-[#F4F4F5]">24.3 MW</div>
            <span className="text-[11px] text-emerald-400 block mt-1">
              -4.2% Below daily peak budget
            </span>
          </div>
        </div>

        {/* 2. Facility Subsystems Status Table */}
        <div className="bg-[#0D1014]/90 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-4 border-b border-white/[0.08] pb-3">
            <div>
              <h2 className="text-sm font-bold text-[#F4F4F5]">Primary Infrastructure Subsystems</h2>
              <p className="text-[11px] text-[#8B9199]">
                Live operational telemetry status across terminal buildings, airside, and utilities
              </p>
            </div>
            <span className="text-[11px] font-mono text-[#8B9199]">
              Total Monitored Nodes: {markers.length}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {markers.map((marker) => {
              const isAlert = marker.statusColor === 'red';
              const isWarning = marker.statusColor === 'orange';

              return (
                <div
                  key={marker.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isAlert
                      ? 'bg-red-950/20 border-red-500/30'
                      : isWarning
                      ? 'bg-amber-950/20 border-amber-500/30'
                      : 'bg-[#12161E] border-white/[0.06] hover:border-white/20'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          isAlert
                            ? 'bg-red-500 animate-pulse'
                            : isWarning
                            ? 'bg-amber-400'
                            : 'bg-emerald-400'
                        }`}
                      />
                      <h3 className="text-xs font-bold text-[#F4F4F5]">{marker.name}</h3>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
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

                  <p className="text-[11px] text-[#8B9199] leading-relaxed mb-3">
                    {marker.aiInsight}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px]">
                    <span className="text-[#626870] font-mono capitalize">Type: {marker.type}</span>
                    <button
                      onClick={() => handleLocateInTwin(marker.id, marker.position)}
                      className="text-[#F28C18] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Box className="w-3 h-3" />
                      <span>Locate in Twin</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Real-Time Telemetry Feed Log */}
        <div className="bg-[#0D1014]/90 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-[#F4F4F5] flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
              Live Telemetry Stream Log
            </h2>
            <span className="text-[10px] font-mono text-[#8B9199]">AUTOSYNC: 2500ms</span>
          </div>

          <div className="space-y-2 font-mono text-xs">
            <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[#8B9199]">[16:26:{String((ticker * 2) % 60).padStart(2, '0')}]</span>
                <span className="text-emerald-400">RUNWAY-01</span>
                <span className="text-[#F4F4F5]">ILS Category III approach status nominal. Friction coeff: 0.82</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold">NOMINAL</span>
            </div>

            <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[#8B9199]">[16:26:{String((ticker * 2 + 1) % 60).padStart(2, '0')}]</span>
                <span className="text-red-400">TERM-B-CONCOURSE</span>
                <span className="text-[#F4F4F5]">Passenger density backpressure detected: 2.8 people/m²</span>
              </div>
              <span className="text-[10px] text-red-400 font-bold">ACTION REQUIRED</span>
            </div>

            <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[#8B9199]">[16:26:{String((ticker * 2 + 3) % 60).padStart(2, '0')}]</span>
                <span className="text-[#F28C18]">SUBSTATION-SOUTH</span>
                <span className="text-[#F4F4F5]">Transformer 2A current draw stabilized at 1,250 kW</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold">NOMINAL</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
