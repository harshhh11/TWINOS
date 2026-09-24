'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  BarChart3,
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
  { name: 'Primary Optical Mesh', uptime: 99.8, healthScore: 98, mtbfHours: 3600, incidents: 0 },
];

const INCIDENT_TRENDS_DATA = [
  { day: 'Mon', equipmentWarnings: 2, thermalAlerts: 1, resolved: 3 },
  { day: 'Tue', equipmentWarnings: 3, thermalAlerts: 2, resolved: 5 },
  { day: 'Wed', equipmentWarnings: 1, thermalAlerts: 1, resolved: 2 },
  { day: 'Thu', equipmentWarnings: 2, thermalAlerts: 2, resolved: 4 },
  { day: 'Fri', equipmentWarnings: 4, thermalAlerts: 3, resolved: 7 },
  { day: 'Sat', equipmentWarnings: 3, thermalAlerts: 2, resolved: 5 },
  { day: 'Sun', equipmentWarnings: 2, thermalAlerts: 1, resolved: 3 },
];

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'PERFORMANCE' | 'INCIDENTS' | 'ENERGY'>('OVERVIEW');

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
              <BarChart3 className="w-4 h-4 text-[#EA580C]" />
              Operational Analytics & Historical Trends
            </h1>
            <p className="text-[11px] text-[#64748B]">
              System Activity • Asset Performance • Energy Profiles • Incident MTTR Metrics
            </p>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1.5 p-1 bg-[#F1F5F9] border border-[#E2E8F0] rounded-full text-xs">
          {[
            { id: 'OVERVIEW', label: 'System Overview' },
            { id: 'PERFORMANCE', label: 'Asset Performance' },
            { id: 'INCIDENTS', label: 'Incident Trends' },
            { id: 'ENERGY', label: 'Energy Profiles' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#EA580C] text-white font-bold shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
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
          <div className="bg-white rounded-3xl p-5 border border-[#E2E8F0] shadow-xs">
            <span className="text-[#64748B] text-xs font-semibold block">Peak Throughput Load</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-[#0F172A]">13,200</span>
              <span className="text-xs font-bold text-emerald-600">↑ 12% vs avg</span>
            </div>
            <span className="text-[11px] text-[#64748B] block mt-1">Midday Peak (12:00 PM)</span>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-[#E2E8F0] shadow-xs">
            <span className="text-[#64748B] text-xs font-semibold block">24h Energy Footprint</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-[#0F172A]">114.8</span>
              <span className="text-xs font-mono font-bold text-[#64748B]">MWh</span>
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold block mt-1">↓ 5.2% efficiency gain</span>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-[#E2E8F0] shadow-xs">
            <span className="text-[#64748B] text-xs font-semibold block">Fleet MTBF Reliability</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-[#0F172A]">1,840</span>
              <span className="text-xs font-mono font-bold text-[#64748B]">hrs</span>
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold block mt-1">99.2% availability index</span>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-[#E2E8F0] shadow-xs">
            <span className="text-[#64748B] text-xs font-semibold block">Incident MTTR (Mean Time)</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-[#0F172A]">18.4</span>
              <span className="text-xs font-mono font-bold text-[#64748B]">mins</span>
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold block mt-1">↓ 35% faster with TwinOS</span>
          </div>
        </div>

        {/* Chart 1: Historical System Activity (Throughput & Power) */}
        {(activeTab === 'OVERVIEW' || activeTab === 'ENERGY') && (
          <div className="bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-extrabold text-[#0F172A] flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#EA580C]" />
                  Historical System Activity & Hourly Throughput
                </h3>
                <span className="text-[11px] text-[#64748B]">
                  Hourly operational activity correlated with instantaneous facility energy demand
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-[#0F172A]">
                  <span className="w-3 h-1.5 bg-[#EA580C] rounded-full" /> Throughput Units
                </span>
                <span className="flex items-center gap-1.5 text-[#0284C7]">
                  <span className="w-3 h-1.5 bg-[#0284C7] rounded-full" /> Grid Power (MW)
                </span>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={HISTORICAL_ACTIVITY_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="paxGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EA580C" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#EA580C" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="#94A3B8" fontSize={10} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderColor: '#E2E8F0',
                      borderRadius: '12px',
                      fontSize: '11px',
                    }}
                  />
                  <Area type="monotone" dataKey="passengers" stroke="#EA580C" strokeWidth={2.5} fill="url(#paxGrad)" name="Throughput Units" />
                  <Line type="monotone" dataKey="energyMw" stroke="#0284C7" strokeWidth={2} name="Power (MW)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Section 2: Asset Performance Benchmarks */}
        {(activeTab === 'OVERVIEW' || activeTab === 'PERFORMANCE') && (
          <div className="bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-xs">
            <div className="flex items-center justify-between mb-4 border-b border-[#F1F5F9] pb-3">
              <div>
                <h3 className="text-sm font-extrabold text-[#0F172A] flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[#EA580C]" />
                  Asset Performance & Reliability Benchmark
                </h3>
                <span className="text-[11px] text-[#64748B]">
                  Uptime percentage, health score, and mean time between failures (MTBF)
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#E2E8F0] text-[#64748B] text-[10px] uppercase font-mono font-bold">
                    <th className="py-3 px-3">Asset System</th>
                    <th className="py-3 px-3">Operational Uptime</th>
                    <th className="py-3 px-3">Health Score</th>
                    <th className="py-3 px-3">MTBF Benchmark</th>
                    <th className="py-3 px-3 text-right">Active Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {ASSET_PERFORMANCE_METRICS.map((metric, i) => (
                    <tr key={i} className="hover:bg-[#F8FAFC]">
                      <td className="py-3.5 px-3 font-bold text-[#0F172A]">{metric.name}</td>
                      <td className="py-3.5 px-3 text-emerald-600 font-mono font-bold">{metric.uptime}%</td>
                      <td className="py-3.5 px-3">
                        <span
                          className={`font-bold ${
                            metric.healthScore < 80 ? 'text-[#D97706]' : 'text-emerald-600'
                          }`}
                        >
                          {metric.healthScore}%
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-mono text-[#64748B]">{metric.mtbfHours} hrs</td>
                      <td className="py-3.5 px-3 text-right">
                        {metric.incidents > 0 ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-[#FEF3C7] text-[#D97706] text-[10px] font-bold border border-[#FDE68A]">
                            {metric.incidents} Flagged
                          </span>
                        ) : (
                          <span className="text-[10px] text-emerald-600 font-bold bg-[#DCFCE7] px-2.5 py-0.5 rounded-full">Optimal</span>
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
          <div className="bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-extrabold text-[#0F172A] flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-[#EA580C]" />
                  Weekly Incident & Anomaly Resolution Trends
                </h3>
                <span className="text-[11px] text-[#64748B]">
                  Detected operational anomalies vs verified maintenance resolutions
                </span>
              </div>
            </div>

            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={INCIDENT_TRENDS_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="day" stroke="#94A3B8" fontSize={10} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderColor: '#E2E8F0',
                      borderRadius: '12px',
                      fontSize: '11px',
                    }}
                  />
                  <Bar dataKey="thermalAlerts" fill="#EF4444" radius={[4, 4, 0, 0]} name="Thermal Alerts" />
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
