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
  Plane,
  ShoppingBag,
  Wrench,
  Luggage,
  CheckCircle2,
  Database,
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
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { airportDataService } from '@/lib/data/airportDataService';

export default function AnalyticsPage() {
  const summary = airportDataService.getSummary();
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'AIRLINES' | 'PASSENGERS' | 'OPERATIONS' | 'REVENUE' | 'MAINTENANCE'>('OVERVIEW');

  const {
    kpis,
    airline_otp,
    delay_reasons,
    hourly_trend,
    passenger_metrics,
    security_metrics,
    retail_metrics,
    maintenance_metrics,
    gate_utilization,
    meta,
  } = summary;

  const COLORS = ['#F28C18', '#38BDF8', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  const gateData = Object.entries(gate_utilization || {})
    .slice(0, 8)
    .map(([gate, count]) => ({ gate, count }));

  const cabinClassData = Object.entries(passenger_metrics.cabin_class || {}).map(([name, value]) => ({
    name,
    value,
  }));

  const ageGroupData = Object.entries(passenger_metrics.age_groups || {}).map(([name, value]) => ({
    name,
    value,
  }));

  const nationalityData = Object.entries(passenger_metrics.top_nationalities || {}).map(([name, value]) => ({
    name,
    value,
  }));

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
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-[#F4F4F5] flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#F28C18]" />
                Airport Operations Analytics & Multi-Table Intelligence
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#F28C18]/15 border border-[#F28C18]/30 text-[10px] font-mono font-bold text-[#F28C18] flex items-center gap-1">
                <Database className="w-2.5 h-2.5" />
                {meta.airport_code} Dataset (8 Tables)
              </span>
            </div>
            <p className="text-[11px] text-[#8B9199]">
              {meta.airport_name} • 1,000 Flights • 2,500 Passengers • Baggage & Security Screening Analytics
            </p>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1.5 p-1 bg-white/5 border border-white/10 rounded-full text-xs">
          {[
            { id: 'OVERVIEW', label: 'Overview' },
            { id: 'AIRLINES', label: 'Airlines & OTP' },
            { id: 'PASSENGERS', label: 'Passenger Flow' },
            { id: 'OPERATIONS', label: 'Security & Baggage' },
            { id: 'REVENUE', label: 'Retail Revenue' },
            { id: 'MAINTENANCE', label: 'Fleet Maintenance' },
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

      {/* Main Container */}
      <div className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-6">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-[#0D1014]/90 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-4 shadow-card">
            <div className="flex items-center justify-between">
              <span className="text-[#8B9199] text-[10px] uppercase font-mono">Flight OTP (On-Time)</span>
              <Plane className="w-3.5 h-3.5 text-[#F28C18]" />
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-[#F4F4F5]">{kpis.on_time_performance_pct}%</span>
              <span className="text-xs font-bold text-emerald-400">{1000 - kpis.delayed_flights} / 1000</span>
            </div>
            <span className="text-[10px] text-[#8B9199] block mt-1">
              Avg Delay: {kpis.avg_delay_minutes} min ({kpis.delayed_flights} delayed)
            </span>
          </div>

          <div className="bg-[#0D1014]/90 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-4 shadow-card">
            <div className="flex items-center justify-between">
              <span className="text-[#8B9199] text-[10px] uppercase font-mono">Passenger Demographics</span>
              <Users className="w-3.5 h-3.5 text-sky-400" />
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-[#F4F4F5]">{kpis.total_passengers_monitored.toLocaleString()}</span>
              <span className="text-xs font-mono text-[#8B9199]">pax</span>
            </div>
            <span className="text-[10px] text-sky-400 block mt-1">
              Avg Dwell: {passenger_metrics.avg_dwell_hours} hrs • {passenger_metrics.frequent_flyer_pct}% FF
            </span>
          </div>

          <div className="bg-[#0D1014]/90 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-4 shadow-card">
            <div className="flex items-center justify-between">
              <span className="text-[#8B9199] text-[10px] uppercase font-mono">Retail Concession GMV</span>
              <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-[#F4F4F5]">₹{(kpis.retail_gmv_inr / 1000000).toFixed(2)}M</span>
              <span className="text-xs font-bold text-emerald-400">{kpis.retail_transactions.toLocaleString()} txns</span>
            </div>
            <span className="text-[10px] text-[#8B9199] block mt-1">
              Avg Basket: ₹{kpis.retail_avg_basket_inr.toFixed(0)}
            </span>
          </div>

          <div className="bg-[#0D1014]/90 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-4 shadow-card">
            <div className="flex items-center justify-between">
              <span className="text-[#8B9199] text-[10px] uppercase font-mono">Security & Operations</span>
              <Shield className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-[#F4F4F5]">{(kpis.security_avg_wait_sec / 60).toFixed(1)}</span>
              <span className="text-xs font-mono text-[#8B9199]">min wait</span>
            </div>
            <span className="text-[10px] text-amber-400 block mt-1">
              {kpis.security_hourly_throughput} pax/hr/lane • {kpis.total_baggage_handled} bags
            </span>
          </div>
        </div>

        {/* 1. OVERVIEW TAB */}
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-6">
            {/* Chart 1: Passenger Volume & Energy Demand */}
            <div className="bg-[#0D1014]/90 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 shadow-card">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-[#F4F4F5] flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#F28C18]" />
                    24-Hour Passenger Traffic Waves & Facility Power Load
                  </h3>
                  <span className="text-[11px] text-[#8B9199]">
                    Correlation of passenger banking with terminal energy load and security checkpoint wait times
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
                  <AreaChart data={hourly_trend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
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

            {/* Delay Reasons & Gate Utilization */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Delay Causes */}
              <div className="bg-[#0D1014]/90 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 shadow-card">
                <h3 className="text-sm font-bold text-[#F4F4F5] flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  Flight Delay Root Cause Distribution
                </h3>
                <span className="text-[11px] text-[#8B9199] block mb-4">
                  Breakdown across 307 delayed flights at Indira Gandhi International Airport
                </span>
                <div className="h-52 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={delay_reasons} layout="vertical" margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
                      <XAxis type="number" stroke="#626870" fontSize={10} tickLine={false} />
                      <YAxis dataKey="reason" type="category" stroke="#626870" fontSize={10} tickLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0D1014',
                          borderColor: 'rgba(255,255,255,0.1)',
                          borderRadius: '12px',
                          fontSize: '11px',
                        }}
                      />
                      <Bar dataKey="count" fill="#F28C18" radius={[0, 6, 6, 0]} name="Delayed Flights" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Gate Utilization */}
              <div className="bg-[#0D1014]/90 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 shadow-card">
                <h3 className="text-sm font-bold text-[#F4F4F5] flex items-center gap-2 mb-2">
                  <Plane className="w-4 h-4 text-sky-400" />
                  Terminal 3 Gate Flight Allocations
                </h3>
                <span className="text-[11px] text-[#8B9199] block mb-4">
                  Highest volume departure gates assigned in operational dataset
                </span>
                <div className="h-52 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={gateData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                      <XAxis dataKey="gate" stroke="#626870" fontSize={10} tickLine={false} />
                      <YAxis stroke="#626870" fontSize={10} tickLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0D1014',
                          borderColor: 'rgba(255,255,255,0.1)',
                          borderRadius: '12px',
                          fontSize: '11px',
                        }}
                      />
                      <Bar dataKey="count" fill="#38BDF8" radius={[4, 4, 0, 0]} name="Flights Handled" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. AIRLINES & OTP TAB */}
        {activeTab === 'AIRLINES' && (
          <div className="bg-[#0D1014]/90 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 shadow-card space-y-4">
            <div>
              <h3 className="text-sm font-bold text-[#F4F4F5] flex items-center gap-2">
                <Plane className="w-4 h-4 text-[#F28C18]" />
                Airline On-Time Performance (OTP) & Delay Benchmark
              </h3>
              <p className="text-[11px] text-[#8B9199]">
                Carrier metrics computed from 1,000 scheduled arrivals and departures at Indira Gandhi International Airport
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.08] text-[#8B9199] text-[10px] uppercase font-mono">
                    <th className="py-2.5 px-3">Airline Carrier</th>
                    <th className="py-2.5 px-3">Total Flights</th>
                    <th className="py-2.5 px-3">On-Time Performance</th>
                    <th className="py-2.5 px-3">Delayed Count</th>
                    <th className="py-2.5 px-3">Avg Delay (min)</th>
                    <th className="py-2.5 px-3 text-right">Avg Load Factor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {airline_otp.map((carrier, i) => (
                    <tr key={i} className="hover:bg-white/[0.02]">
                      <td className="py-3 px-3 font-semibold text-[#F4F4F5] flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#F28C18]" />
                        {carrier.airline_name}
                      </td>
                      <td className="py-3 px-3 font-mono text-[#F4F4F5]">{carrier.total_flights}</td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <span className={`font-mono font-bold ${carrier.otp >= 75 ? 'text-emerald-400' : carrier.otp >= 70 ? 'text-amber-400' : 'text-red-400'}`}>
                            {carrier.otp}%
                          </span>
                          <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${carrier.otp}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono text-amber-400">{carrier.delayed_flights}</td>
                      <td className="py-3 px-3 font-mono text-[#8B9199]">{carrier.avg_delay} min</td>
                      <td className="py-3 px-3 font-mono text-right text-sky-400">{carrier.avg_load_factor}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. PASSENGERS TAB */}
        {activeTab === 'PASSENGERS' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Cabin Class Distribution */}
            <div className="bg-[#0D1014]/90 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 shadow-card">
              <h3 className="text-sm font-bold text-[#F4F4F5] mb-1">Cabin Class Breakdown</h3>
              <p className="text-[11px] text-[#8B9199] mb-4">Proportion across 2,500 passenger journeys</p>
              <div className="h-52 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={cabinClassData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                      {cabinClassData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0D1014', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '11px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 mt-2 text-xs">
                {cabinClassData.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx] }} />
                    <span className="text-[#8B9199]">{item.name}:</span>
                    <span className="font-bold text-[#F4F4F5]">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Age Groups */}
            <div className="bg-[#0D1014]/90 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 shadow-card">
              <h3 className="text-sm font-bold text-[#F4F4F5] mb-1">Passenger Age Demographics</h3>
              <p className="text-[11px] text-[#8B9199] mb-4">Youth, Adult, Senior & Child distributions</p>
              <div className="h-52 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ageGroupData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" stroke="#626870" fontSize={10} tickLine={false} />
                    <YAxis stroke="#626870" fontSize={10} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0D1014', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '11px' }} />
                    <Bar dataKey="value" fill="#38BDF8" radius={[4, 4, 0, 0]} name="Passengers" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Nationalities */}
            <div className="bg-[#0D1014]/90 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 shadow-card">
              <h3 className="text-sm font-bold text-[#F4F4F5] mb-1">Top Passenger Nationalities</h3>
              <p className="text-[11px] text-[#8B9199] mb-4">Origin passport profiles at DEL hub</p>
              <div className="space-y-2.5">
                {nationalityData.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <span className="text-[#F4F4F5] font-medium">{item.name}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-[#F28C18] rounded-full" style={{ width: `${(item.value / 600) * 100}%` }} />
                      </div>
                      <span className="font-mono text-[#8B9199] w-8 text-right">{item.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 4. SECURITY & BAGGAGE TAB */}
        {activeTab === 'OPERATIONS' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#0D1014]/90 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 shadow-card space-y-4">
              <h3 className="text-sm font-bold text-[#F4F4F5] flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                Security Screening Telemetry (2,500 Screenings)
              </h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-[#8B9199] block text-[10px]">Average Queue Wait</span>
                  <span className="text-xl font-bold text-[#F4F4F5] mt-1 block font-mono">
                    {security_metrics.avg_wait_sec} sec
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-[#8B9199] block text-[10px]">Average Scan Duration</span>
                  <span className="text-xl font-bold text-[#F4F4F5] mt-1 block font-mono">
                    {security_metrics.avg_processing_sec} sec
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-[#8B9199] block text-[10px]">Lane Throughput</span>
                  <span className="text-xl font-bold text-emerald-400 mt-1 block font-mono">
                    {security_metrics.throughput_per_lane} pax/hr
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-[#8B9199] block text-[10px]">Alarm Trigger Rate</span>
                  <span className="text-xl font-bold text-amber-400 mt-1 block font-mono">
                    {security_metrics.alarm_rate_pct}%
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-[#0D1014]/90 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 shadow-card space-y-4">
              <h3 className="text-sm font-bold text-[#F4F4F5] flex items-center gap-2">
                <Luggage className="w-4 h-4 text-[#F28C18]" />
                Baggage Lifecycle & Sortation (2,800 Bags)
              </h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-[#8B9199] block text-[10px]">Total Baggage Handled</span>
                  <span className="text-xl font-bold text-[#F4F4F5] mt-1 block font-mono">
                    {kpis.total_baggage_handled.toLocaleString()}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-[#8B9199] block text-[10px]">Average Bag Weight</span>
                  <span className="text-xl font-bold text-sky-400 mt-1 block font-mono">
                    {kpis.baggage_avg_weight_kg} kg
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-[#8B9199] block text-[10px]">Primary Carousel</span>
                  <span className="text-xl font-bold text-[#F4F4F5] mt-1 block font-mono">
                    Carousel C12
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-[#8B9199] block text-[10px]">Mishandled Count</span>
                  <span className="text-xl font-bold text-emerald-400 mt-1 block font-mono">
                    0 (100% Success)
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. REVENUE TAB */}
        {activeTab === 'REVENUE' && (
          <div className="bg-[#0D1014]/90 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 shadow-card space-y-4">
            <div>
              <h3 className="text-sm font-bold text-[#F4F4F5] flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-emerald-400" />
                Airport Retail & Concession Performance (₹12,626,167 GMV)
              </h3>
              <p className="text-[11px] text-[#8B9199]">
                3,000 retail transactions logged across Terminal 3 Duty Free & Concourse shops
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.08] text-[#8B9199] text-[10px] uppercase font-mono">
                    <th className="py-2.5 px-3">Product Category</th>
                    <th className="py-2.5 px-3">Transactions</th>
                    <th className="py-2.5 px-3">Total GMV (INR)</th>
                    <th className="py-2.5 px-3 text-right">Avg Basket</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {retail_metrics.category_sales.map((cat, i) => (
                    <tr key={i} className="hover:bg-white/[0.02]">
                      <td className="py-3 px-3 font-semibold text-[#F4F4F5]">{cat.product_category}</td>
                      <td className="py-3 px-3 font-mono text-[#F4F4F5]">{cat.transactions.toLocaleString()}</td>
                      <td className="py-3 px-3 font-mono text-emerald-400 font-bold">₹{cat.revenue.toLocaleString()}</td>
                      <td className="py-3 px-3 font-mono text-right text-sky-400">₹{(cat.revenue / cat.transactions).toFixed(0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 6. MAINTENANCE TAB */}
        {activeTab === 'MAINTENANCE' && (
          <div className="bg-[#0D1014]/90 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 shadow-card space-y-4">
            <div>
              <h3 className="text-sm font-bold text-[#F4F4F5] flex items-center gap-2">
                <Wrench className="w-4 h-4 text-amber-400" />
                Fleet Engineering Defect Logs (400 Work Orders)
              </h3>
              <p className="text-[11px] text-[#8B9199]">
                Aircraft maintenance tracking: hydraulic seals, line inspections, and engineer signoffs
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.08] text-[#8B9199] text-[10px] uppercase font-mono">
                    <th className="py-2.5 px-3">Work Order</th>
                    <th className="py-2.5 px-3">Aircraft Tail</th>
                    <th className="py-2.5 px-3">Flight ID</th>
                    <th className="py-2.5 px-3">Defect Issue</th>
                    <th className="py-2.5 px-3">Component</th>
                    <th className="py-2.5 px-3">Severity</th>
                    <th className="py-2.5 px-3 text-right">Downtime (min)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {maintenance_metrics.recent_orders.map((order, i) => (
                    <tr key={i} className="hover:bg-white/[0.02]">
                      <td className="py-3 px-3 font-mono text-[#F28C18]">{order.work_order_id}</td>
                      <td className="py-3 px-3 font-semibold text-[#F4F4F5]">{order.tail_number}</td>
                      <td className="py-3 px-3 font-mono text-sky-400">{order.flight_id}</td>
                      <td className="py-3 px-3 text-[#F4F4F5]">{order.issue_type}</td>
                      <td className="py-3 px-3 text-[#8B9199]">{order.component}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 font-bold font-mono text-[10px] border border-red-500/30">
                          Level {order.severity}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono text-right text-amber-400">{order.downtime_minutes} min</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
