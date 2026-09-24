'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Sparkles,
  ChevronDown,
  Wind,
  Layers,
  Luggage,
  Zap,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  AreaChart,
  Area,
} from 'recharts';

const OCCUPANCY_HOURLY = [
  { hour: '6AM', value: 35, isPeak: false },
  { hour: '10AM', value: 65, isPeak: false },
  { hour: '2PM', value: 72, isPeak: true },
  { hour: '6PM', value: 55, isPeak: false },
  { hour: '10PM', value: 38, isPeak: false },
];

const PREDICTION_TREND = [
  { time: 'Now', val: 35 },
  { time: '30m', val: 68 },
  { time: '1h', val: 92 },
  { time: '2h', val: 52 },
];

export function BottomDashboardCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 select-none">
      {/* ==================================================================== */}
      {/* CARD 1: OCCUPANCY / OPERATIONAL TREND                                */}
      {/* ==================================================================== */}
      <div className="glass-panel rounded-[24px] p-4.5 flex flex-col justify-between shadow-sm">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <h3 className="text-xs font-bold text-[#10233F]">Occupancy Trend</h3>
            <button className="flex items-center gap-1 text-[11px] font-semibold text-[#64748B] hover:text-[#10233F] px-2 py-0.5 rounded-lg bg-white/60 border border-slate-200/60 shadow-2xs">
              <span>Today</span>
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>

          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-black text-[#10233F] tracking-tight">72%</span>
          </div>
        </div>

        <div className="relative h-24 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={OCCUPANCY_HOURLY} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
              <XAxis dataKey="hour" stroke="#94A3B8" fontSize={9} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#E2E8F0',
                  borderRadius: '12px',
                  fontSize: '11px',
                  boxShadow: '0 4px 12px rgba(16,35,63,0.08)',
                }}
              />
              <Bar dataKey="value" fill="#38BDF8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-white/95 border border-slate-200/80 rounded-md text-[9px] font-bold text-[#10233F] shadow-xs">
            72%
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* CARD 2: RESOURCE USAGE (Circular Radial Gauges)                      */}
      {/* ==================================================================== */}
      <div className="glass-panel rounded-[24px] p-4.5 flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between mb-1.5">
          <h3 className="text-xs font-bold text-[#10233F]">Resource Usage</h3>
          <button className="flex items-center gap-1 text-[11px] font-semibold text-[#64748B] hover:text-[#10233F] px-2 py-0.5 rounded-lg bg-white/60 border border-slate-200/60 shadow-2xs">
            <span>Today</span>
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 my-auto py-1">
          {/* Energy 68% */}
          <div className="flex flex-col items-center">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-200/80"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-[#18A875]"
                  strokeDasharray="68, 100"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-[11px] font-extrabold text-[#10233F]">68%</span>
            </div>
            <span className="text-[10px] font-semibold text-[#64748B] mt-1">Energy</span>
          </div>

          {/* Water 82% */}
          <div className="flex flex-col items-center">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-200/80"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-[#0284C7]"
                  strokeDasharray="82, 100"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-[11px] font-extrabold text-[#10233F]">82%</span>
            </div>
            <span className="text-[10px] font-semibold text-[#64748B] mt-1">Water</span>
          </div>

          {/* HVAC 54% */}
          <div className="flex flex-col items-center">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-200/80"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-[#64748B]"
                  strokeDasharray="54, 100"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-[11px] font-extrabold text-[#10233F]">54%</span>
            </div>
            <span className="text-[10px] font-semibold text-[#64748B] mt-1">HVAC</span>
          </div>

          {/* Lighting 91% */}
          <div className="flex flex-col items-center">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-200/80"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-[#18A875]"
                  strokeDasharray="91, 100"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-[11px] font-extrabold text-[#10233F]">91%</span>
            </div>
            <span className="text-[10px] font-semibold text-[#64748B] mt-1">Lighting</span>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* CARD 3: PREDICTION (Predicted Congestion / Trend)                   */}
      {/* ==================================================================== */}
      <div className="glass-panel rounded-[24px] p-4.5 flex flex-col justify-between shadow-sm">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <h3 className="text-xs font-bold text-[#10233F]">Predicted Congestion</h3>
            <span className="flex items-center gap-1 text-[9px] font-bold text-[#F26A21] bg-[#F26A21]/10 px-2 py-0.5 rounded-full border border-[#F26A21]/20">
              <Sparkles className="w-2.5 h-2.5" /> AI
            </span>
          </div>

          <div className="mb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#D94A4A]">
              <span className="w-2 h-2 rounded-full bg-[#D94A4A]" />
              <span>Security Checkpoint A</span>
            </div>
            <p className="text-[11px] text-[#64748B] mt-0.5">
              Queue likely to exceed capacity in 20 minutes.
            </p>
          </div>
        </div>

        <div className="relative h-20 w-full mt-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={PREDICTION_TREND} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="predFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D94A4A" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#D94A4A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" stroke="#94A3B8" fontSize={9} tickLine={false} axisLine={false} />
              <Area
                type="monotone"
                dataKey="val"
                stroke="#D94A4A"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#predFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
          <div className="absolute top-0 right-4 px-2 py-0.5 bg-[#D94A4A] text-white rounded-md text-[10px] font-bold shadow-xs">
            20 min
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* CARD 4: ASSET HEALTH                                                 */}
      {/* ==================================================================== */}
      <div className="glass-panel rounded-[24px] p-4.5 flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-[#10233F]">Asset Health</h3>
          <Link
            href="/assets"
            className="text-xs font-bold text-[#2563EB] hover:text-[#1D4ED8] flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="flex flex-col gap-2.5">
          {/* HVAC */}
          <div className="flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 w-28 truncate">
              <Wind className="w-3.5 h-3.5 text-[#64748B]" />
              <span className="font-semibold text-[#10233F]">HVAC Systems</span>
            </div>
            <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
              <div className="w-[92%] h-full rounded-full bg-[#18A875]" />
            </div>
            <span className="font-mono font-bold text-[#18A875] text-xs w-8 text-right">92%</span>
          </div>

          {/* Elevators */}
          <div className="flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 w-28 truncate">
              <Layers className="w-3.5 h-3.5 text-[#64748B]" />
              <span className="font-semibold text-[#10233F]">Elevators</span>
            </div>
            <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
              <div className="w-[88%] h-full rounded-full bg-[#18A875]" />
            </div>
            <span className="font-mono font-bold text-[#18A875] text-xs w-8 text-right">88%</span>
          </div>

          {/* Baggage Belts */}
          <div className="flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 w-28 truncate">
              <Luggage className="w-3.5 h-3.5 text-[#64748B]" />
              <span className="font-semibold text-[#10233F]">Baggage Belts</span>
            </div>
            <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
              <div className="w-[76%] h-full rounded-full bg-[#E6A11A]" />
            </div>
            <span className="font-mono font-bold text-[#E6A11A] text-xs w-8 text-right">76%</span>
          </div>

          {/* Power Systems */}
          <div className="flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 w-28 truncate">
              <Zap className="w-3.5 h-3.5 text-[#64748B]" />
              <span className="font-semibold text-[#10233F]">Power Systems</span>
            </div>
            <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
              <div className="w-[95%] h-full rounded-full bg-[#18A875]" />
            </div>
            <span className="font-mono font-bold text-[#18A875] text-xs w-8 text-right">95%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
