'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Zap,
  TrendingDown,
  TrendingUp,
  Box,
  Cpu,
  Sparkles,
  CheckCircle2,
  Leaf,
  Sun,
  Battery,
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
  const [isPeakShavingActive, setIsPeakShavingActive] = useState(false);

  const handleLocateSubstation = () => {
    focusEntity('energy-hub', [-16, 1.2, 14]);
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
              <Zap className="w-4 h-4 text-[#F28C18]" />
              Infrastructure Energy & Grid Telemetry
            </h1>
            <p className="text-[11px] text-[#8B9199]">
              Real-Time Power Draw • Historical Consumption Profiles • Major Load Distribution
            </p>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleLocateSubstation}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-[#F4F4F5] transition-all cursor-pointer"
        >
          <Box className="w-3.5 h-3.5 text-[#F28C18]" />
          <span>Locate Energy Substation in Twin</span>
        </button>
      </header>

      {/* Main Grid */}
      <div className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-6">
        {/* 1. Energy Metrics KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-[#0D1014]/90 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-4 shadow-card">
            <span className="text-[11px] text-[#8B9199] font-medium block">Current Energy Draw</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-[#F4F4F5]">24.3</span>
              <span className="text-xs font-mono text-[#8B9199]">MW</span>
            </div>
            <span className="text-[11px] text-emerald-400 font-medium block mt-1 flex items-center gap-1">
              <TrendingDown className="w-3 h-3" /> 5.2% vs Yesterday
            </span>
          </div>

          <div className="bg-[#0D1014]/90 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-4 shadow-card">
            <span className="text-[11px] text-[#8B9199] font-medium block">Total 24h Consumption</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-[#F4F4F5]">114,840</span>
              <span className="text-xs font-mono text-[#8B9199]">kWh</span>
            </div>
            <span className="text-[11px] text-[#8B9199] block mt-1">
              Daily budget: 125,000 kWh
            </span>
          </div>

          <div className="bg-[#0D1014]/90 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-4 shadow-card">
            <span className="text-[11px] text-[#8B9199] font-medium block">Renewable Solar Mix</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-emerald-400">18.4%</span>
              <span className="text-xs font-bold text-emerald-400">Active</span>
            </div>
            <span className="text-[11px] text-emerald-400 block mt-1">
              Roof PV arrays generating 4.1 MW
            </span>
          </div>

          <div className="bg-[#0D1014]/90 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-4 shadow-card">
            <span className="text-[11px] text-[#8B9199] font-medium block">Grid Health Status</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-[#F4F4F5]">Nominal</span>
            </div>
            <span className="text-[11px] text-emerald-400 block mt-1">
              Dual-Feeder Substation Synchronized
            </span>
          </div>
        </div>

        {/* 2. Clean Historical & Real-Time Consumption Chart */}
        <div className="bg-[#0D1014]/90 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-sm font-bold text-[#F4F4F5] flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#F28C18]" />
                Daily Facility Load Curve (Actual MW vs Baseline MW)
              </h2>
              <p className="text-[11px] text-[#8B9199]">
                Hourly grid demand across 24 hours with peak-hour cooling demand variance
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-white/80">
                <span className="w-3 h-1 bg-[#F28C18] rounded" /> Actual Load
              </span>
              <span className="flex items-center gap-1.5 text-[#8B9199]">
                <span className="w-3 h-1 bg-white/20 rounded" /> Baseline
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ENERGY_TIMELINE} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="energyFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F28C18" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#F28C18" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#626870" fontSize={10} tickLine={false} />
                <YAxis stroke="#626870" fontSize={10} tickLine={false} unit=" MW" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0D1014',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    fontSize: '11px',
                    color: '#F4F4F5',
                  }}
                />
                <Area type="monotone" dataKey="actual" stroke="#F28C18" strokeWidth={2.5} fill="url(#energyFill)" name="Actual Load (MW)" />
                <Area type="monotone" dataKey="baseline" stroke="#8B9199" strokeWidth={1.5} strokeDasharray="4 4" fill="transparent" name="Scheduled Baseline (MW)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Major Consuming Assets Breakdown Table */}
        <div className="bg-[#0D1014]/90 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-4 border-b border-white/[0.08] pb-3">
            <div>
              <h2 className="text-sm font-bold text-[#F4F4F5]">Major Consuming Assets & Systems</h2>
              <p className="text-[11px] text-[#8B9199]">
                Distribution of electrical load by category across airport infrastructure
              </p>
            </div>
          </div>

          <div className="divide-y divide-white/5 text-xs">
            {MAJOR_CONSUMING_ASSETS.map((asset, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-[240px]">
                  <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-[#F28C18] shrink-0">
                    <Cpu className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-[#F4F4F5] block">{asset.name}</span>
                    <span className="text-[10px] text-[#8B9199] font-mono">{asset.category}</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="flex-1 max-w-xs flex items-center gap-3">
                  <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      style={{ width: `${asset.percentage}%` }}
                      className={`h-full rounded-full ${
                        asset.status === 'ELEVATED' ? 'bg-amber-400' : 'bg-[#F28C18]'
                      }`}
                    />
                  </div>
                  <span className="text-xs font-mono font-bold text-[#F4F4F5] w-8">
                    {asset.percentage}%
                  </span>
                </div>

                <div className="text-right">
                  <span className="font-mono font-bold text-[#F4F4F5] block">
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
