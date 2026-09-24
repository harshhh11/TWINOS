'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  BarChart3,
  TrendingUp,
  Zap,
  Users,
  Shield,
  AlertTriangle,
  Clock,
  Cpu,
  Activity,
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

const HISTORICAL_ACTIVITY_DATA = [
  { time: '06:00', departures: 14, arrivals: 12, passengers: 4200, energyMw: 18.2 },
  { time: '08:00', departures: 28, arrivals: 22, passengers: 8900, energyMw: 21.5 },
  { time: '10:00', departures: 34, arrivals: 31, passengers: 11400, energyMw: 23.8 },
  { time: '12:00', departures: 38, arrivals: 36, passengers: 13200, energyMw: 25.4 },
  { time: '14:00', departures: 32, arrivals: 30, passengers: 12600, energyMw: 24.1 },
  { time: '16:00', departures: 35, arrivals: 33, passengers: 12482, energyMw: 24.3 },
  { time: '18:00', departures: 29, arrivals: 27, passengers: 11100, energyMw: 23.2 },
  { time: '20:00', departures: 22, arrivals: 24, passengers: 9800, energyMw: 21.8 },
  { time: '22:00', departures: 15, arrivals: 18, passengers: 7100, energyMw: 19.4 },
];

const ASSET_PERFORMANCE_METRICS = [
  { name: 'Terminal B HVAC-03', uptime: 98.2, healthScore: 78, mtbfHours: 720, incidents: 1 },
  { name: 'Central Substation B', uptime: 99.9, healthScore: 95, mtbfHours: 4200, incidents: 0 },
  { name: 'Baggage Conveyor 03', uptime: 96.4, healthScore: 76, mtbfHours: 480, incidents: 1 },
  { name: 'Elevators Bank 1', uptime: 99.4, healthScore: 88, mtbfHours: 1850, incidents: 0 },
  { name: 'Optical Sensor Mesh', uptime: 99.8, healthScore: 98, mtbfHours: 3600, incidents: 0 },
];

const INCIDENT_TRENDS_DATA = [
  { day: 'Mon', crowdAnomalies: 2, equipmentWarnings: 1, resolved: 3 },
  { day: 'Tue', crowdAnomalies: 4, equipmentWarnings: 2, resolved: 5 },
  { day: 'Wed', crowdAnomalies: 1, equipmentWarnings: 1, resolved: 2 },
  { day: 'Thu', crowdAnomalies: 3, equipmentWarnings: 2, resolved: 4 },
  { day: 'Fri', crowdAnomalies: 6, equipmentWarnings: 3, resolved: 7 },
  { day: 'Sat', crowdAnomalies: 5, equipmentWarnings: 2, resolved: 6 },
  { day: 'Sun', crowdAnomalies: 3, equipmentWarnings: 1, resolved: 4 },
];

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'PERFORMANCE' | 'INCIDENTS' | 'ENERGY'>('OVERVIEW');

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
              <BarChart3 className="w-4 h-4 text-[#F28C18]" />
              Operational Analytics & Historical Trends
            </h1>
            <p className="text-[11px] text-[#8B9199]">
              System Activity • Asset Performance • Energy Profiles • Incident MTTR Metrics
            </p>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1.5 p-1 bg-white/5 border border-white/10 rounded-full text-xs">
          {[
            { id: 'OVERVIEW', label: 'System Overview' },
            { id: 'PERFORMANCE', label: 'Asset Performance' },
            { id: 'INCIDENTS', label: 'Incident Trends' },
            { id: 'ENERGY', label: 'Energy Profiles' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#F28C18] text-black font-bold shadow-sm'
                  : 'text-[#8B9199] hover:text-[#F4F4F5]'
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
          <div className="bg-[#0D1014]/90 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-4 shadow-card">
            <span className="text-[#8B9199] text-[10px] uppercase font-mono block">Peak Passenger Load</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-[#F4F4F5]">13,200</span>
              <span className="text-xs font-bold text-emerald-400">↑ 12% vs avg</span>
            </div>
            <span className="text-[10px] text-[#8B9199] block mt-1">Midday Bank (12:00 PM)</span>
          </div>

          <div className="bg-[#0D1014]/90 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-4 shadow-card">
            <span className="text-[#8B9199] text-[10px] uppercase font-mono block">24h Energy Footprint</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-[#F4F4F5]">114.8</span>
              <span className="text-xs font-mono text-[#8B9199]">MWh</span>
            </div>
            <span className="text-[10px] text-emerald-400 block mt-1">↓ 5.2% efficiency gain</span>
          </div>

          <div className="bg-[#0D1014]/90 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-4 shadow-card">
            <span className="text-[#8B9199] text-[10px] uppercase font-mono block">Fleet MTBF Reliability</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-[#F4F4F5]">1,840</span>
              <span className="text-xs font-mono text-[#8B9199]">hrs</span>
            </div>
            <span className="text-[10px] text-emerald-400 block mt-1">99.2% availability index</span>
          </div>

          <div className="bg-[#0D1014]/90 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-4 shadow-card">
            <span className="text-[#8B9199] text-[10px] uppercase font-mono block">Incident MTTR (Mean Time)</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-[#F4F4F5]">18.4</span>
              <span className="text-xs font-mono text-[#8B9199]">mins</span>
            </div>
            <span className="text-[10px] text-emerald-400 block mt-1">↓ 35% faster with TwinOS</span>
          </div>
        </div>

        {/* Chart 1: Historical System Activity (Throughput & Power) */}
        {(activeTab === 'OVERVIEW' || activeTab === 'ENERGY') && (
          <div className="bg-[#0D1014]/90 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-[#F4F4F5] flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#F28C18]" />
                  Historical System Activity & Passenger Throughput
                </h3>
                <span className="text-[11px] text-[#8B9199]">
                  Hourly distribution of passenger volume correlated with instantaneous facility energy load
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-[#F4F4F5]">
                  <span className="w-3 h-1 bg-[#F28C18] rounded-full" /> Passenger Volume
                </span>
                <span className="flex items-center gap-1.5 text-sky-400">
                  <span className="w-3 h-1 bg-sky-400 rounded-full" /> Grid Power (MW)
                </span>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={HISTORICAL_ACTIVITY_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="paxGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F28C18" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#F28C18" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="#626870" fontSize={10} tickLine={false} />
                  <YAxis stroke="#626870" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0D1014',
                      borderColor: 'rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      fontSize: '11px',
                    }}
                  />
                  <Area type="monotone" dataKey="passengers" stroke="#F28C18" strokeWidth={2.5} fill="url(#paxGrad)" name="Passengers" />
                  <Line type="monotone" dataKey="energyMw" stroke="#38BDF8" strokeWidth={2} name="Power (MW)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Section 2: Asset Performance Benchmarks */}
        {(activeTab === 'OVERVIEW' || activeTab === 'PERFORMANCE') && (
          <div className="bg-[#0D1014]/90 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 shadow-card">
            <div className="flex items-center justify-between mb-4 border-b border-white/[0.08] pb-3">
              <div>
                <h3 className="text-sm font-bold text-[#F4F4F5] flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[#F28C18]" />
                  Asset Performance & Reliability Benchmark
                </h3>
                <span className="text-[11px] text-[#8B9199]">
                  Uptime percentage, health score, and mean time between failures (MTBF)
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.08] text-[#8B9199] text-[10px] uppercase font-mono">
                    <th className="py-2.5 px-3">Asset System</th>
                    <th className="py-2.5 px-3">Operational Uptime</th>
                    <th className="py-2.5 px-3">Health Score</th>
                    <th className="py-2.5 px-3">MTBF Benchmark</th>
                    <th className="py-2.5 px-3 text-right">Active Flags</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {ASSET_PERFORMANCE_METRICS.map((metric, i) => (
                    <tr key={i} className="hover:bg-white/[0.02]">
                      <td className="py-3 px-3 font-semibold text-[#F4F4F5]">{metric.name}</td>
                      <td className="py-3 px-3 text-emerald-400 font-mono">{metric.uptime}%</td>
                      <td className="py-3 px-3">
                        <span
                          className={`font-bold ${
                            metric.healthScore < 80 ? 'text-amber-400' : 'text-emerald-400'
                          }`}
                        >
                          {metric.healthScore}%
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono text-[#8B9199]">{metric.mtbfHours} hrs</td>
                      <td className="py-3 px-3 text-right">
                        {metric.incidents > 0 ? (
                          <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-bold border border-amber-500/30">
                            {metric.incidents} Flagged
                          </span>
                        ) : (
                          <span className="text-[10px] text-emerald-400 font-medium">Optimal</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Section 3: Incident Weekly Trends */}
        {(activeTab === 'OVERVIEW' || activeTab === 'INCIDENTS') && (
          <div className="bg-[#0D1014]/90 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-[#F4F4F5] flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  Weekly Incident & Anomaly Resolution Trends
                </h3>
                <span className="text-[11px] text-[#8B9199]">
                  Detected anomalies vs verified incident remediations
                </span>
              </div>
            </div>

            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={INCIDENT_TRENDS_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="day" stroke="#626870" fontSize={10} tickLine={false} />
                  <YAxis stroke="#626870" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0D1014',
                      borderColor: 'rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      fontSize: '11px',
                    }}
                  />
                  <Bar dataKey="crowdAnomalies" fill="#EF4444" radius={[4, 4, 0, 0]} name="Crowd Surges" />
                  <Bar dataKey="equipmentWarnings" fill="#F59E0B" radius={[4, 4, 0, 0]} name="Equipment Warnings" />
                  <Bar dataKey="resolved" fill="#10B981" radius={[4, 4, 0, 0]} name="Resolved" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
