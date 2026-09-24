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
              <Activity className="w-4 h-4 text-[#EA580C]" />
              Real-Time Infrastructure Monitoring
            </h1>
            <p className="text-[11px] text-[#64748B]">
              Live Telemetry Streams • Operational Health Status • Synchronized Sensor Grid
            </p>
          </div>
        </div>

        {/* Real-Time Live Pulse Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-xs text-emerald-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono font-bold">TELEMETRY STREAM: LIVE</span>
            <span className="text-[#64748B] font-mono text-[10px]">T+{ticker}s</span>
          </div>

          <Link
            href="/twin"
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold text-xs shadow-xs transition-all"
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
          <div className="bg-white rounded-3xl p-5 border border-[#E2E8F0] shadow-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-[#64748B]">System State</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            </div>
            <div className="text-2xl font-black text-[#0F172A]">Nominal</div>
            <span className="text-xs text-emerald-600 font-semibold block mt-1">
              99.8% Availability uptime
            </span>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-[#E2E8F0] shadow-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-[#64748B]">Infrastructure Health</span>
              <Cpu className="w-4 h-4 text-[#EA580C]" />
            </div>
            <div className="text-2xl font-black text-[#0F172A]">{avgHealth}%</div>
            <span className="text-xs text-[#64748B] font-medium block mt-1">
              5 of 6 subsystems optimal
            </span>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-[#E2E8F0] shadow-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-[#64748B]">Active Incidents</span>
              <AlertTriangle className="w-4 h-4 text-[#DC2626]" />
            </div>
            <div className="text-2xl font-black text-[#DC2626]">{activeIncidents.length}</div>
            <span className="text-xs text-[#DC2626] font-semibold block mt-1">
              Terminal B thermal variance
            </span>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-[#E2E8F0] shadow-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-[#64748B]">Current Energy Grid</span>
              <Zap className="w-4 h-4 text-sky-500" />
            </div>
            <div className="text-2xl font-black text-[#0F172A]">24.3 MW</div>
            <span className="text-xs text-emerald-600 font-semibold block mt-1">
              -4.2% Below daily peak budget
            </span>
          </div>
        </div>

        {/* 2. Facility Subsystems Status Table */}
        <div className="bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center justify-between mb-4 border-b border-[#F1F5F9] pb-3">
            <div>
              <h2 className="text-sm font-extrabold text-[#0F172A]">Primary Infrastructure Subsystems</h2>
              <p className="text-[11px] text-[#64748B]">
                Live operational telemetry status across terminal buildings, airside, and utilities
              </p>
            </div>
            <span className="text-xs font-mono font-semibold text-[#64748B]">
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
                      ? 'bg-[#FEF2F2] border-[#FEE2E2]'
                      : isWarning
                      ? 'bg-[#FFFBEB] border-[#FEF3C7]'
                      : 'bg-[#F8FAFC] border-[#E2E8F0] hover:border-[#CBD5E1]'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2.5 h-2.5 rounded-full ${
                          isAlert
                            ? 'bg-[#EF4444] animate-pulse'
                            : isWarning
                            ? 'bg-[#F59E0B]'
                            : 'bg-emerald-500'
                        }`}
                      />
                      <h3 className="text-xs font-bold text-[#0F172A]">{marker.name}</h3>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        isAlert
                          ? 'bg-[#FEE2E2] text-[#DC2626]'
                          : isWarning
                          ? 'bg-[#FEF3C7] text-[#D97706]'
                          : 'bg-[#DCFCE7] text-[#16A34A]'
                      }`}
                    >
                      {marker.status}
                    </span>
                  </div>

                  <p className="text-xs text-[#64748B] leading-relaxed mb-3">
                    {marker.aiInsight}
                  </p>

                  <div className="flex items-center justify-between pt-2.5 border-t border-[#E2E8F0]/60 text-xs">
                    <span className="text-[#94A3B8] font-mono capitalize">Type: {marker.type}</span>
                    <button
                      onClick={() => handleLocateInTwin(marker.id, marker.position)}
                      className="text-[#EA580C] hover:underline font-bold flex items-center gap-1 cursor-pointer"
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
        <div className="bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-extrabold text-[#0F172A] flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
              Live Telemetry Stream Log
            </h2>
            <span className="text-xs font-mono font-semibold text-[#64748B]">AUTOSYNC: 2500ms</span>
          </div>

          <div className="space-y-2.5 font-mono text-xs">
            <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-[#94A3B8]">[16:26:{String((ticker * 2) % 60).padStart(2, '0')}]</span>
                <span className="text-emerald-600 font-bold">RUNWAY-01</span>
                <span className="text-[#0F172A]">ILS Category III approach status nominal. Friction coeff: 0.82</span>
              </div>
              <span className="text-[10px] text-emerald-600 font-bold bg-[#DCFCE7] px-2 py-0.5 rounded">NOMINAL</span>
            </div>

            <div className="p-3 rounded-2xl bg-[#FEF2F2] border border-[#FEE2E2] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-[#94A3B8]">[16:26:{String((ticker * 2 + 1) % 60).padStart(2, '0')}]</span>
                <span className="text-[#DC2626] font-bold">TERM-B-CONCOURSE</span>
                <span className="text-[#0F172A]">HVAC chiller loop variance: 29.2°C thermal load</span>
              </div>
              <span className="text-[10px] text-[#DC2626] font-bold bg-[#FEE2E2] px-2 py-0.5 rounded">ACTION REQUIRED</span>
            </div>

            <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-[#94A3B8]">[16:26:{String((ticker * 2 + 3) % 60).padStart(2, '0')}]</span>
                <span className="text-[#EA580C] font-bold">SUBSTATION-SOUTH</span>
                <span className="text-[#0F172A]">Transformer 2A current draw stabilized at 1,250 kW</span>
              </div>
              <span className="text-[10px] text-emerald-600 font-bold bg-[#DCFCE7] px-2 py-0.5 rounded">NOMINAL</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
