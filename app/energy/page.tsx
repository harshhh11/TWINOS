'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Zap,
  TrendingDown,
  Box,
  Cpu,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useTwinStore } from '@/lib/twin/twinStateStore';

const ENERGY_TIMELINE = [
  { time: '00:00', actual: 16.2, baseline: 17.0, solar: 0 },
  { time: '04:00', actual: 14.8, baseline: 15.5, solar: 0 },
  { time: '08:00', actual: 21.5, baseline: 20.0, solar: 2.8 },
  { time: '12:00', actual: 25.4, baseline: 22.0, solar: 6.4 },
  { time: '16:00', actual: 24.3, baseline: 19.0, solar: 4.1 },
  { time: '20:00', actual: 22.1, baseline: 20.5, solar: 0 },
  { time: '23:59', actual: 17.8, baseline: 18.0, solar: 0 },
];

const MAJOR_CONSUMING_ASSETS = [
  { name: 'Terminal HVAC Chillers & Air Handlers', category: 'HVAC', consumptionKw: 14200, percentage: 46, status: 'ELEVATED' },
  { name: 'Runway & Taxiway Visual Guidance Lighting', category: 'LIGHTING', consumptionKw: 4800, percentage: 18, status: 'OPTIMAL' },
  { name: 'High-Speed Baggage Sortation Conveyors', category: 'LOGISTICS', consumptionKw: 3600, percentage: 14, status: 'NORMAL' },
  { name: 'Terminal Elevators & Escalator Banks', category: 'TRANSIT', consumptionKw: 2200, percentage: 9, status: 'OPTIMAL' },
  { name: 'ATC Radar & Airside Substation Feeder', category: 'AVIONICS', consumptionKw: 1800, percentage: 7, status: 'OPTIMAL' },
  { name: 'Auxiliary Facilities & Ground Charging', category: 'FLEET', consumptionKw: 1520, percentage: 6, status: 'OPTIMAL' },
];

export default function EnergyPage() {
  const router = useRouter();
  const { focusEntity } = useTwinStore();

  const handleLocateSubstation = () => {
    focusEntity('energy-hub', [-16, 1.2, 14]);
    router.push('/');
  };

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
              <Zap className="w-4 h-4 text-[#F26A21]" />
              Infrastructure Energy & Grid Telemetry
            </h1>
            <p className="text-[11px] text-gray-400">
              Real-Time Power Draw • Historical Consumption Profiles • Major Load Distribution
            </p>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleLocateSubstation}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-bold text-white transition-all cursor-pointer shadow-sm"
        >
          <Box className="w-4 h-4 text-[#F26A21]" />
          <span>Locate Energy Substation in Twin</span>
        </button>
      </header>

      {/* Main Grid */}
      <div className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-6">
        {/* 1. Energy Metrics KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-[#0C121E]/95 backdrop-blur-2xl rounded-3xl p-5 border border-white/[0.08] shadow-md">
            <span className="text-xs text-gray-400 font-semibold block">Current Energy Draw</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-white">24.3</span>
              <span className="text-xs font-mono font-bold text-gray-400">MW</span>
            </div>
            <span className="text-xs text-emerald-400 font-semibold block mt-1 flex items-center gap-1">
              <TrendingDown className="w-3.5 h-3.5" /> 5.2% vs Yesterday
            </span>
          </div>

          <div className="bg-[#0C121E]/95 backdrop-blur-2xl rounded-3xl p-5 border border-white/[0.08] shadow-md">
            <span className="text-xs text-gray-400 font-semibold block">Total 24h Consumption</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-white">114,840</span>
              <span className="text-xs font-mono font-bold text-gray-400">kWh</span>
            </div>
            <span className="text-xs text-gray-400 block mt-1">
              Daily budget: 125,000 kWh
            </span>
          </div>

          <div className="bg-[#0C121E]/95 backdrop-blur-2xl rounded-3xl p-5 border border-white/[0.08] shadow-md">
            <span className="text-xs text-gray-400 font-semibold block">Renewable Solar Mix</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-emerald-400">18.4%</span>
              <span className="text-xs font-bold text-emerald-400">Active</span>
            </div>
            <span className="text-xs text-emerald-400 block mt-1 font-medium">
              Roof PV arrays generating 4.1 MW
            </span>
          </div>

          <div className="bg-[#0C121E]/95 backdrop-blur-2xl rounded-3xl p-5 border border-white/[0.08] shadow-md">
            <span className="text-xs text-gray-400 font-semibold block">Grid Health Status</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-white">Nominal</span>
            </div>
            <span className="text-xs text-emerald-400 block mt-1 font-medium">
              Dual-Feeder Substation Synchronized
            </span>
          </div>
        </div>

        {/* 2. Clean Historical & Real-Time Consumption Chart */}
        <div className="bg-[#0C121E]/95 backdrop-blur-2xl rounded-3xl p-6 border border-white/[0.08] shadow-md">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#F26A21]" />
                Daily Facility Load Curve (Actual MW vs Baseline MW)
              </h2>
              <p className="text-[11px] text-gray-400">
                Hourly grid demand across 24 hours with peak-hour cooling demand variance
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-white">
                <span className="w-3 h-1.5 bg-[#F26A21] rounded-full" /> Actual Load
              </span>
              <span className="flex items-center gap-1.5 text-gray-400">
                <span className="w-3 h-1.5 bg-gray-600 rounded-full" /> Scheduled Baseline
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ENERGY_TIMELINE} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="energyFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F26A21" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#F26A21" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#64748B" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={10} tickLine={false} unit=" MW" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    fontSize: '11px',
                    color: '#F8FAFC',
                  }}
                />
                <Area type="monotone" dataKey="actual" stroke="#F26A21" strokeWidth={2.5} fill="url(#energyFill)" name="Actual Load (MW)" />
                <Area type="monotone" dataKey="baseline" stroke="#64748B" strokeWidth={1.5} strokeDasharray="4 4" fill="transparent" name="Scheduled Baseline (MW)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Major Consuming Assets Breakdown Table */}
        <div className="bg-[#0C121E]/95 backdrop-blur-2xl rounded-3xl p-6 border border-white/[0.08] shadow-md">
          <div className="flex items-center justify-between mb-4 border-b border-white/[0.06] pb-3">
            <div>
              <h2 className="text-sm font-extrabold text-white">Major Consuming Assets & Systems</h2>
              <p className="text-[11px] text-gray-400">
                Distribution of electrical load by category across airport infrastructure
              </p>
            </div>
          </div>

          <div className="divide-y divide-white/[0.04] text-xs">
            {MAJOR_CONSUMING_ASSETS.map((asset, idx) => (
              <div key={idx} className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-[240px]">
                  <div className="w-8 h-8 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-[#F26A21] shrink-0">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-white block">{asset.name}</span>
                    <span className="text-[10px] text-gray-400 font-mono font-semibold">{asset.category}</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="flex-1 max-w-xs flex items-center gap-3">
                  <div className="flex-1 h-2 rounded-full bg-white/[0.06] overflow-hidden">
                    <div
                      style={{ width: `${asset.percentage}%` }}
                      className={`h-full rounded-full ${
                        asset.status === 'ELEVATED' ? 'bg-amber-400' : 'bg-[#F26A21]'
                      }`}
                    />
                  </div>
                  <span className="text-xs font-mono font-bold text-white w-8">
                    {asset.percentage}%
                  </span>
                </div>

                <div className="text-right">
                  <span className="font-mono font-bold text-white block">
                    {asset.consumptionKw.toLocaleString()} kW
                  </span>
                  <span
                    className={`text-[10px] font-bold ${
                      asset.status === 'ELEVATED' ? 'text-amber-400' : 'text-emerald-400'
                    }`}
                  >
                    {asset.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
