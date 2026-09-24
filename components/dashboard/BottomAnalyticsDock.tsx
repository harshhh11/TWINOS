'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ChevronDown,
  Sparkles,
  SlidersHorizontal,
  Layers,
} from 'lucide-react';
import { HOURLY_OCCUPANCY_TREND } from '@/lib/data/airportSeedData';

export function BottomAnalyticsDock() {
  return (
    <div className="w-full select-none z-20 pointer-events-auto">
      {/* 5-Card Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* ========================================================================= */}
        {/* CARD 1: OCCUPANCY TREND */}
        {/* ========================================================================= */}
        <div className="bg-[#11151A]/88 backdrop-blur-md border border-white/[0.08] rounded-2xl p-3 shadow-card flex flex-col justify-between h-[136px]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#F4F4F5]">Occupancy Trend</span>
            <div className="flex items-center gap-1 text-[10px] text-[#8B9199] bg-[#151A21] border border-white/[0.08] px-2 py-0.5 rounded-lg cursor-pointer hover:text-[#F4F4F5] transition-colors">
              <span>Today</span>
              <ChevronDown className="w-2.5 h-2.5" />
            </div>
          </div>

          <div>
            <span className="text-2xl font-bold text-[#F4F4F5] leading-none">72%</span>
          </div>

          {/* Bar Chart with 72% Floating Badge */}
          <div className="relative pt-3 pb-0.5">
            {/* 72% Badge Pill at Peak */}
            <div className="absolute top-0 left-[62%] -translate-x-1/2 px-1.5 py-0.2 bg-white text-black font-bold text-[8px] rounded shadow-sm">
              72%
            </div>

            <div className="h-10 flex items-end justify-between gap-1 px-1">
              {HOURLY_OCCUPANCY_TREND.map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center">
                  <div
                    style={{ height: `${item.value}%` }}
                    className={`w-full rounded-t-sm transition-all ${
                      item.active ? 'bg-[#F28C18]' : 'bg-[#2D1F15] hover:bg-[#3D2A1C]'
                    }`}
                  />
                </div>
              ))}
            </div>

            {/* X-Axis Labels */}
            <div className="flex justify-between text-[8px] text-[#626870] font-mono mt-1 px-0.5">
              <span>6AM</span>
              <span>10AM</span>
              <span>2PM</span>
              <span>6PM</span>
              <span>10PM</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CARD 2: RESOURCE USAGE */}
        {/* ========================================================================= */}
        <div className="bg-[#11151A]/88 backdrop-blur-md border border-white/[0.08] rounded-2xl p-3 shadow-card flex flex-col justify-between h-[136px]">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-[#F4F4F5]">Resource Usage</span>
            <div className="flex items-center gap-1 text-[10px] text-[#8B9199] bg-[#151A21] border border-white/[0.08] px-2 py-0.5 rounded-lg cursor-pointer hover:text-[#F4F4F5] transition-colors">
              <span>Today</span>
              <ChevronDown className="w-2.5 h-2.5" />
            </div>
          </div>

          {/* 4 Circular Ring Gauges matching IMAGE 2 */}
          <div className="grid grid-cols-3 gap-2 items-center">
            {/* Energy */}
            <div className="flex flex-col items-center">
              <div className="relative w-8 h-8 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-[#1A2029]"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-[#06B6D4]"
                    strokeDasharray="68, 100"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute text-[8px] font-bold text-[#F4F4F5]">68%</span>
              </div>
              <span className="text-[9px] text-[#8B9199] mt-0.5 font-medium">Energy</span>
            </div>

            {/* Water */}
            <div className="flex flex-col items-center">
              <div className="relative w-8 h-8 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-[#1A2029]"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-[#38BDF8]"
                    strokeDasharray="82, 100"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute text-[8px] font-bold text-[#F4F4F5]">82%</span>
              </div>
              <span className="text-[9px] text-[#8B9199] mt-0.5 font-medium">Water</span>
            </div>

            {/* HVAC */}
            <div className="flex flex-col items-center">
              <div className="relative w-8 h-8 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-[#1A2029]"
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
                <span className="absolute text-[8px] font-bold text-[#F4F4F5]">54%</span>
              </div>
              <span className="text-[9px] text-[#8B9199] mt-0.5 font-medium">HVAC</span>
            </div>
          </div>

          {/* Bottom Lighting Gauge */}
          <div className="flex items-center gap-2 pt-1 border-t border-white/[0.04]">
            <div className="relative w-6 h-6 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-[#1A2029]"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-[#10B981]"
                  strokeDasharray="91, 100"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-[7px] font-bold text-[#F4F4F5]">91%</span>
            </div>
            <span className="text-[9px] text-[#8B9199] font-medium">Lighting</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CARD 3: PREDICTED CONGESTION */}
        {/* ========================================================================= */}
        <div className="bg-[#11151A]/88 backdrop-blur-md border border-white/[0.08] rounded-2xl p-3 shadow-card flex flex-col justify-between h-[136px]">
          <div>
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-xs font-semibold text-[#F4F4F5]">Predicted Congestion</span>
              <span className="px-1.5 py-0.2 rounded bg-[#2A180E] text-[#F28C18] font-bold text-[8px] border border-[#F28C18]/40">
                AI
              </span>
            </div>

            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
              <span className="text-[11px] font-medium text-[#F4F4F5]">Security Checkpoint A</span>
            </div>
            <p className="text-[9px] text-[#8B9199] leading-tight mt-0.5">
              Queue likely to exceed capacity in 20 minutes.
            </p>
          </div>

          {/* Area Chart with 20 min Marker */}
          <div className="relative mt-0.5 pt-2">
            {/* Peak Marker Badge */}
            <div className="absolute top-0 right-[32%] px-1.5 py-0.2 bg-[#EF4444] text-white font-bold text-[8px] rounded shadow-sm">
              20 min
            </div>

            <svg className="w-full h-7" viewBox="0 0 200 35" preserveAspectRatio="none">
              <defs>
                <linearGradient id="areaGradCongestion" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#EF4444" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#EF4444" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M0 30 Q 40 28, 80 24 T 130 6 T 170 22 T 200 32 L 200 35 L 0 35 Z"
                fill="url(#areaGradCongestion)"
              />
              <path
                d="M0 30 Q 40 28, 80 24 T 130 6 T 170 22 T 200 32"
                fill="none"
                stroke="#EF4444"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>

            {/* X-Axis */}
            <div className="flex justify-between text-[8px] text-[#626870] font-mono">
              <span>Now</span>
              <span>30m</span>
              <span>1h</span>
              <span>2h</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CARD 4: ASSET HEALTH */}
        {/* ========================================================================= */}
        <div className="bg-[#11151A]/88 backdrop-blur-md border border-white/[0.08] rounded-2xl p-3 shadow-card flex flex-col justify-between h-[136px]">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-[#F4F4F5]">Asset Health</span>
            <Link
              href="/assets"
              className="text-[10px] text-[#8B9199] hover:text-[#F4F4F5] flex items-center gap-1 transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-2.5 h-2.5" />
            </Link>
          </div>

          {/* Progress Bars */}
          <div className="flex flex-col gap-1.5 my-auto">
            {/* HVAC */}
            <div>
              <div className="flex justify-between text-[9px] text-[#8B9199] mb-0.5 font-medium">
                <span>HVAC Systems</span>
                <span className="font-semibold text-[#10B981]">92%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#1A2029]">
                <div className="h-full bg-[#10B981] rounded-full w-[92%]" />
              </div>
            </div>

            {/* Elevators */}
            <div>
              <div className="flex justify-between text-[9px] text-[#8B9199] mb-0.5 font-medium">
                <span>Elevators</span>
                <span className="font-semibold text-[#10B981]">88%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#1A2029]">
                <div className="h-full bg-[#10B981] rounded-full w-[88%]" />
              </div>
            </div>

            {/* Baggage Belts */}
            <div>
              <div className="flex justify-between text-[9px] text-[#8D939B] mb-0.5 font-medium">
                <span>Baggage Belts</span>
                <span className="font-semibold text-[#F28C18]">76%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#1A2029]">
                <div className="h-full bg-[#F28C18] rounded-full w-[76%]" />
              </div>
            </div>

            {/* Power Systems */}
            <div>
              <div className="flex justify-between text-[9px] text-[#8B9199] mb-0.5 font-medium">
                <span>Power Systems</span>
                <span className="font-semibold text-[#10B981]">95%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#1A2029]">
                <div className="h-full bg-[#10B981] rounded-full w-[95%]" />
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        <div className="bg-[#11151A]/88 backdrop-blur-md border border-white/[0.08] rounded-2xl p-3 shadow-card flex flex-col justify-between h-[136px]">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-xl bg-[#251A14] flex items-center justify-center text-[#F28C18] shrink-0 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-semibold text-[#F4F4F5]">AI Recommendation</span>
          </div>

          <p className="text-[11px] text-[#8B9199] leading-snug my-1">
            Open Security Checkpoint C to reduce congestion by 40%.
          </p>

          <div className="flex items-center gap-2 mt-1">
            <Link
              href="/impact-analysis"
              className="flex-1 py-2 px-3 rounded-xl bg-white hover:bg-slate-100 text-[#080A0D] font-bold text-xs flex items-center justify-center gap-1.5 transition-transform active:scale-95 shadow-sm"
            >
              <span>Simulate This</span>
              <ArrowRight className="w-3 h-3 stroke-[2.5]" />
            </Link>

            <button
              title="Options"
              className="w-8 h-8 rounded-xl bg-[#151A21] border border-white/[0.08] text-[#8B9199] hover:text-[#F4F4F5] flex items-center justify-center transition-colors cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer Tagline */}
      <div className="mt-2 text-right">
        <span className="text-[10px] text-[#626870] font-medium tracking-tight">
          Connected Infrastructure. Intelligent Decisions.
        </span>
      </div>
    </div>
  );
}
