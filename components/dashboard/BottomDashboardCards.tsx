'use client';

import React from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  Cpu,
  Zap,
  ArrowRight,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  LineChart,
  Line,
} from 'recharts';

const OCCUPANCY_HOURLY = [
  { hour: '6AM', value: 35 },
  { hour: '8AM', value: 58 },
  { hour: '10AM', value: 78 },
  { hour: '12PM', value: 85 },
  { hour: '2PM', value: 72 },
  { hour: '4PM', value: 92 },
  { hour: '6PM', value: 68 },
  { hour: '8PM', value: 55 },
  { hour: '10PM', value: 40 },
];

const PREDICTION_TREND = [
  { time: 'Now', val: 45 },
  { time: '10m', val: 62 },
  { time: '20m', val: 94 },
  { time: '30m', val: 78 },
  { time: '1h', val: 58 },
  { time: '2h', val: 42 },
];

export function BottomDashboardCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 select-none">
      {/* ==================================================================== */}
      {/* CARD 1: OCCUPANCY / OPERATIONAL TREND                                */}
      {/* ==================================================================== */}
      <div className="bg-white rounded-3xl p-4.5 border border-[#E2E8F0] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-[#0F172A]">Occupancy Trend</h3>
            <button className="flex items-center gap-1 text-[11px] font-semibold text-[#64748B] hover:text-[#0F172A]">
              <span>Today</span>
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>

          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-2xl font-black text-[#0F172A]">72%</span>
          </div>
        </div>

        <div className="h-24 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={OCCUPANCY_HOURLY} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
              <XAxis dataKey="hour" stroke="#94A3B8" fontSize={9} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#E2E8F0',
                  borderRadius: '12px',
                  fontSize: '11px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                }}
              />
              <Bar dataKey="value" fill="#38BDF8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* CARD 2: RESOURCE USAGE (Circular Radial Gauges)                      */}
      {/* ==================================================================== */}
      <div className="bg-white rounded-3xl p-4.5 border border-[#E2E8F0] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-bold text-[#0F172A]">Resource Usage</h3>
          <button className="flex items-center gap-1 text-[11px] font-semibold text-[#64748B] hover:text-[#0F172A]">
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
                  className="text-[#E2E8F0]"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-emerald-500"
                  strokeDasharray="68, 100"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-[11px] font-bold text-[#0F172A]">68%</span>
            </div>
            <span className="text-[10px] font-medium text-[#64748B] mt-1">Energy</span>
          </div>

          {/* Water 82% */}
          <div className="flex flex-col items-center">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-[#E2E8F0]"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-blue-500"
                  strokeDasharray="82, 100"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-[11px] font-bold text-[#0F172A]">82%</span>
            </div>
            <span className="text-[10px] font-medium text-[#64748B] mt-1">Water</span>
          </div>

          {/* HVAC 54% */}
          <div className="flex flex-col items-center">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-[#E2E8F0]"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-cyan-500"
                  strokeDasharray="54, 100"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-[11px] font-bold text-[#0F172A]">54%</span>
            </div>
            <span className="text-[10px] font-medium text-[#64748B] mt-1">HVAC</span>
          </div>

          {/* Lighting 91% */}
          <div className="flex flex-col items-center">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-[#E2E8F0]"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-emerald-500"
                  strokeDasharray="91, 100"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-[11px] font-bold text-[#0F172A]">91%</span>
            </div>
            <span className="text-[10px] font-medium text-[#64748B] mt-1">Lighting</span>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* CARD 3: PREDICTION (Predicted Congestion / Trend)                   */}
      {/* ==================================================================== */}
      <div className="bg-white rounded-3xl p-4.5 border border-[#E2E8F0] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-[#0F172A]">Predicted Congestion</h3>
            <span className="flex items-center gap-1 text-[9px] font-bold text-[#EA580C] bg-[#FFF7ED] px-2 py-0.5 rounded-full border border-[#FFEDD5]">
              <Sparkles className="w-2.5 h-2.5" /> AI
            </span>
          </div>

          <div className="mb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#DC2626]">
              <span className="w-2 h-2 rounded-full bg-[#DC2626]" />
              <span>Security Checkpoint A</span>
            </div>
            <p className="text-[11px] text-[#64748B] mt-0.5">
              Queue likely to exceed capacity in 20 minutes.
            </p>
          </div>
        </div>

        <div className="relative h-20 w-full mt-1">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={PREDICTION_TREND} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <Line
                type="monotone"
                dataKey="val"
                stroke="#EF4444"
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#EF4444' }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="absolute top-0 right-4 px-2 py-0.5 bg-[#FEF2F2] border border-[#FEE2E2] rounded-md text-[10px] font-bold text-[#DC2626]">
            20 min
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* CARD 4: ASSET HEALTH                                                 */}
      {/* ==================================================================== */}
      <div className="bg-white rounded-3xl p-4.5 border border-[#E2E8F0] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-[#0F172A]">Asset Health</h3>
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
            <span className="font-semibold text-[#0F172A] w-28 truncate">HVAC Systems</span>
            <div className="flex-1 h-2 rounded-full bg-[#F1F5F9] overflow-hidden">
              <div className="w-[92%] h-full rounded-full bg-emerald-500" />
            </div>
            <span className="font-mono font-bold text-emerald-600 text-xs w-8 text-right">92%</span>
          </div>

          {/* Elevators */}
          <div className="flex items-center justify-between gap-3 text-xs">
            <span className="font-semibold text-[#0F172A] w-28 truncate">Elevators</span>
            <div className="flex-1 h-2 rounded-full bg-[#F1F5F9] overflow-hidden">
              <div className="w-[88%] h-full rounded-full bg-emerald-500" />
            </div>
            <span className="font-mono font-bold text-emerald-600 text-xs w-8 text-right">88%</span>
          </div>

          {/* Baggage Belts */}
          <div className="flex items-center justify-between gap-3 text-xs">
            <span className="font-semibold text-[#0F172A] w-28 truncate">Baggage Belts</span>
            <div className="flex-1 h-2 rounded-full bg-[#F1F5F9] overflow-hidden">
              <div className="w-[76%] h-full rounded-full bg-amber-500" />
            </div>
            <span className="font-mono font-bold text-amber-600 text-xs w-8 text-right">76%</span>
          </div>

          {/* Power Systems */}
          <div className="flex items-center justify-between gap-3 text-xs">
            <span className="font-semibold text-[#0F172A] w-28 truncate">Power Systems</span>
            <div className="flex-1 h-2 rounded-full bg-[#F1F5F9] overflow-hidden">
              <div className="w-[95%] h-full rounded-full bg-emerald-500" />
            </div>
            <span className="font-mono font-bold text-emerald-600 text-xs w-8 text-right">95%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
