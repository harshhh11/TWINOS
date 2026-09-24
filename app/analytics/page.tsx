'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  BarChart3,
  TrendingUp,
  Zap,
  Users,
  Droplets,
  Shield,
  AlertTriangle,
  Clock,
  Sparkles,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { HOURLY_OCCUPANCY_TREND } from '@/lib/data/airportSeedData';

const ENERGY_TELEMETRY = [
  { time: '00:00', actual: 16200, baseline: 17000 },
  { time: '04:00', actual: 14800, baseline: 15500 },
  { time: '08:00', actual: 21500, baseline: 20000 },
  { time: '12:00', actual: 25400, baseline: 22000 },
  { time: '16:00', actual: 24320, baseline: 19000 },
  { time: '20:00', predicted: 22100, baseline: 20500 },
  { time: '23:59', predicted: 17800, baseline: 18000 },
];

const SECURITY_EVENTS_DATA = [
  { day: 'Mon', detections: 1420, anomalies: 3 },
  { day: 'Tue', detections: 1680, anomalies: 5 },
  { day: 'Wed', detections: 1840, anomalies: 2 },
  { day: 'Thu', detections: 1520, anomalies: 4 },
  { day: 'Fri', detections: 2140, anomalies: 8 },
  { day: 'Sat', detections: 1980, anomalies: 6 },
  { day: 'Sun', detections: 1750, anomalies: 4 },
];

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<'ALL' | 'OCCUPANCY' | 'ENERGY' | 'SECURITY'>('ALL');

  return (
    <div className="w-screen h-screen overflow-y-auto bg-twin-bg text-white font-sans select-none flex flex-col">
      {/* Top Header */}
      <header className="px-8 py-4 border-b border-white/10 bg-[#12161E]/80 backdrop-blur-xl flex items-center justify-between sticky top-0 z-30 shadow-glass">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </Link>

          <div>
            <h1 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-twin-orange" />
              Operational Telemetry & Historical Analytics
            </h1>
            <p className="text-[11px] text-white/50">
              Cross-Domain Sensor Intelligence • Baseline Comparison • Machine Learning Insights
            </p>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1.5 p-1 bg-white/5 border border-white/10 rounded-full text-xs">
          {[
            { id: 'ALL', label: 'Overview' },
            { id: 'OCCUPANCY', label: 'Occupancy' },
            { id: 'ENERGY', label: 'Energy & Utilities' },
            { id: 'SECURITY', label: 'Security' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-twin-orange text-white shadow-orange-glow font-bold'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main Grid */}
      <div className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-6">
        {/* KPI Summary Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-[#12161E]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-glass">
            <span className="text-white/50 text-[10px] uppercase font-mono block">Peak Airport Occupancy</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-white">13,200</span>
              <span className="text-xs font-bold text-emerald-400">↑ 12% vs avg</span>
            </div>
            <span className="text-[10px] text-white/40 block mt-1">Recorded at 12:00 PM</span>
          </div>

          <div className="bg-[#12161E]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-glass">
            <span className="text-white/50 text-[10px] uppercase font-mono block">24h Energy Usage</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-white">114,840</span>
              <span className="text-xs font-mono text-white/60">kWh</span>
            </div>
            <span className="text-[10px] text-emerald-400 block mt-1">↓ 5.2% efficiency gain</span>
          </div>

          <div className="bg-[#12161E]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-glass">
            <span className="text-white/50 text-[10px] uppercase font-mono block">Water Recycling Rate</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-white">82%</span>
              <span className="text-xs font-bold text-sky-400">Optimal</span>
            </div>
            <span className="text-[10px] text-white/40 block mt-1">Greywater recovery loop active</span>
          </div>

          <div className="bg-[#12161E]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-glass">
            <span className="text-white/50 text-[10px] uppercase font-mono block">Incident MTTR (Mean Time)</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-white">18.4</span>
              <span className="text-xs font-mono text-white/60">mins</span>
            </div>
            <span className="text-[10px] text-emerald-400 block mt-1">↓ 35% faster with TwinOS</span>
          </div>
        </div>

        {/* Chart 1: Energy Actual vs Baseline vs Predicted */}
        {(activeTab === 'ALL' || activeTab === 'ENERGY') && (
          <div className="bg-[#12161E]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-glass">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  Terminal Grid Energy Load Profile (Actual vs Baseline vs Predicted)
                </h3>
                <span className="text-[11px] text-white/50">
                  Continuous kW draw across substation transformers and HVAC circuits
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-1 bg-emerald-400 rounded-full" />
                  Actual Measured (kW)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-1 bg-white/40 rounded-full" />
                  Baseline Standard
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-1 bg-twin-orange rounded-full" />
                  AI Forecast
                </span>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={ENERGY_TELEMETRY}>
                  <defs>
                    <linearGradient id="energyActualGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="#64748B" fontSize={11} />
                  <YAxis stroke="#64748B" fontSize={11} domain={[12000, 28000]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderColor: 'rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="actual"
                    stroke="#10B981"
                    strokeWidth={2.5}
                    fill="url(#energyActualGrad)"
                  />
                  <Line
                    type="monotone"
                    dataKey="baseline"
                    stroke="#94A3B8"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="predicted"
                    stroke="#F97316"
                    strokeWidth={2.5}
                    strokeDasharray="6 4"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Chart 2: Hourly Occupancy Trend */}
        {(activeTab === 'ALL' || activeTab === 'OCCUPANCY') && (
          <div className="bg-[#12161E]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-glass">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-sky-400" />
                  Concourse Passenger Volume Distribution
                </h3>
                <span className="text-[11px] text-white/50">
                  Real-time turnstile counts & Computer Vision density calculations
                </span>
              </div>
            </div>

            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={HOURLY_OCCUPANCY_TREND}>
                  <XAxis dataKey="time" stroke="#64748B" fontSize={11} />
                  <YAxis stroke="#64748B" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderColor: 'rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                    }}
                  />
                  <Bar dataKey="passengers" fill="#F97316" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Chart 3: Security & Optical Flow Detection */}
        {(activeTab === 'ALL' || activeTab === 'SECURITY') && (
          <div className="bg-[#12161E]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-glass">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Shield className="w-4 h-4 text-amber-400" />
                  Weekly Edge AI Computer Vision Inferences
                </h3>
                <span className="text-[11px] text-white/50">
                  Total bounding boxes evaluated vs anomalous threshold triggers
                </span>
              </div>
            </div>

            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={SECURITY_EVENTS_DATA}>
                  <XAxis dataKey="day" stroke="#64748B" fontSize={11} />
                  <YAxis stroke="#64748B" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderColor: 'rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                    }}
                  />
                  <Bar dataKey="detections" fill="#3B82F6" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="anomalies" fill="#EF4444" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
