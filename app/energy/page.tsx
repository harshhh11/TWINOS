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
              <Zap className="w-4 h-4 text-[#EA580C]" />
              Infrastructure Energy & Grid Telemetry
            </h1>
            <p className="text-[11px] text-[#64748B]">
              Real-Time Power Draw • Historical Consumption Profiles • Major Load Distribution
            </p>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleLocateSubstation}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] text-xs font-bold text-[#0F172A] transition-all cursor-pointer shadow-2xs"
        >
          <Box className="w-4 h-4 text-[#EA580C]" />
          <span>Locate Energy Substation in Twin</span>
        </button>
      </header>

      {/* Main Grid */}
      <div className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-6">
        {/* 1. Energy Metrics KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-3xl p-5 border border-[#E2E8F0] shadow-xs">
            <span className="text-xs text-[#64748B] font-semibold block">Current Energy Draw</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-[#0F172A]">24.3</span>
              <span className="text-xs font-mono font-bold text-[#64748B]">MW</span>
            </div>
            <span className="text-xs text-emerald-600 font-semibold block mt-1 flex items-center gap-1">
              <TrendingDown className="w-3.5 h-3.5" /> 5.2% vs Yesterday
            </span>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-[#E2E8F0] shadow-xs">
            <span className="text-xs text-[#64748B] font-semibold block">Total 24h Consumption</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-[#0F172A]">114,840</span>
              <span className="text-xs font-mono font-bold text-[#64748B]">kWh</span>
            </div>
            <span className="text-xs text-[#64748B] block mt-1">
              Daily budget: 125,000 kWh
            </span>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-[#E2E8F0] shadow-xs">
            <span className="text-xs text-[#64748B] font-semibold block">Renewable Solar Mix</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-emerald-600">18.4%</span>
              <span className="text-xs font-bold text-emerald-600">Active</span>
            </div>
            <span className="text-xs text-emerald-600 block mt-1 font-medium">
              Roof PV arrays generating 4.1 MW
            </span>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-[#E2E8F0] shadow-xs">
            <span className="text-xs text-[#64748B] font-semibold block">Grid Health Status</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-[#0F172A]">Nominal</span>
            </div>
            <span className="text-xs text-emerald-600 block mt-1 font-medium">
              Dual-Feeder Substation Synchronized
            </span>
          </div>
        </div>

        {/* 2. Clean Historical & Real-Time Consumption Chart */}
        <div className="bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-sm font-extrabold text-[#0F172A] flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#EA580C]" />
                Daily Facility Load Curve (Actual MW vs Baseline MW)
              </h2>
              <p className="text-[11px] text-[#64748B]">
                Hourly grid demand across 24 hours with peak-hour cooling demand variance
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-[#0F172A]">
                <span className="w-3 h-1.5 bg-[#EA580C] rounded-full" /> Actual Load
              </span>
              <span className="flex items-center gap-1.5 text-[#94A3B8]">
                <span className="w-3 h-1.5 bg-[#CBD5E1] rounded-full" /> Scheduled Baseline
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ENERGY_TIMELINE} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="energyFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EA580C" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#EA580C" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#94A3B8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} unit=" MW" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E2E8F0',
                    borderRadius: '12px',
                    fontSize: '11px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  }}
                />
                <Area type="monotone" dataKey="actual" stroke="#EA580C" strokeWidth={2.5} fill="url(#energyFill)" name="Actual Load (MW)" />
                <Area type="monotone" dataKey="baseline" stroke="#94A3B8" strokeWidth={1.5} strokeDasharray="4 4" fill="transparent" name="Scheduled Baseline (MW)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Major Consuming Assets Breakdown Table */}
        <div className="bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center justify-between mb-4 border-b border-[#F1F5F9] pb-3">
            <div>
              <h2 className="text-sm font-extrabold text-[#0F172A]">Major Consuming Assets & Systems</h2>
              <p className="text-[11px] text-[#64748B]">
                Distribution of electrical load by category across airport infrastructure
              </p>
            </div>
          </div>

          <div className="divide-y divide-[#F1F5F9] text-xs">
            {MAJOR_CONSUMING_ASSETS.map((asset, idx) => (
              <div key={idx} className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-[240px]">
                  <div className="w-8 h-8 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#EA580C] shrink-0">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-[#0F172A] block">{asset.name}</span>
                    <span className="text-[10px] text-[#64748B] font-mono font-semibold">{asset.category}</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="flex-1 max-w-xs flex items-center gap-3">
                  <div className="flex-1 h-2 rounded-full bg-[#F1F5F9] overflow-hidden">
                    <div
                      style={{ width: `${asset.percentage}%` }}
                      className={`h-full rounded-full ${
                        asset.status === 'ELEVATED' ? 'bg-[#F59E0B]' : 'bg-[#EA580C]'
                      }`}
                    />
                  </div>
                  <span className="text-xs font-mono font-bold text-[#0F172A] w-8">
                    {asset.percentage}%
                  </span>
                </div>

                <div className="text-right">
                  <span className="font-mono font-bold text-[#0F172A] block">
                    {asset.consumptionKw.toLocaleString()} kW
                  </span>
                  <span
                    className={`text-[10px] font-bold ${
                      asset.status === 'ELEVATED' ? 'text-[#D97706]' : 'text-emerald-600'
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
