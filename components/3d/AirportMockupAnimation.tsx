'use client';

import React from 'react';

export function AirportMockupAnimation() {
  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-[2]">
      {/* 1. ATC Tower Beacon & Radar Pulse */}
      <div className="absolute left-[75.5%] top-[38.8%] -translate-x-1/2 -translate-y-1/2">
        {/* Pulsing Red Hazard Strobe */}
        <span className="relative flex h-3 w-3 items-center justify-center">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500 shadow-[0_0_8px_#EF4444]" />
        </span>

        {/* Rotating Circular ATC Radar Sweep */}
        <div className="absolute -left-16 -top-16 w-32 h-32 rounded-full border border-emerald-500/20 pointer-events-none flex items-center justify-center">
          <div className="w-full h-full rounded-full animate-spin [animation-duration:5s] [background:conic-gradient(from_0deg,transparent_0deg,transparent_270deg,rgba(16,185,129,0.22)_360deg)]" />
        </div>
      </div>

      {/* 2. High-Altitude Aircraft Transit in Twilight Sky */}
      <div className="absolute top-[11%] w-full">
        <div className="relative animate-[flightTransit_32s_linear_infinite]">
          <div className="flex items-center gap-1 opacity-75">
            {/* Red Tail Beacon */}
            <span className="w-1 h-1 rounded-full bg-red-500 animate-pulse shadow-[0_0_4px_#EF4444]" />
            {/* Aircraft Body */}
            <svg className="w-3.5 h-3.5 text-slate-300 -rotate-90 fill-current" viewBox="0 0 24 24">
              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
            </svg>
            {/* Flashing White Wing Strobe */}
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping shadow-[0_0_6px_#FFFFFF]" />
          </div>
        </div>
      </div>

      {/* 3. Runway Approach Strobe Sequence (Rabbit Lights) */}
      <div className="absolute left-[13%] top-[33%] -rotate-[16deg] flex items-center gap-2.5 opacity-80">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            style={{ animationDelay: `${i * 140}ms` }}
            className="w-1 h-1 rounded-full bg-amber-200 animate-ping shadow-[0_0_5px_#FDE68A]"
          />
        ))}
      </div>

      {/* 4. Highway Vehicle Light Stream along Perimeter Expressway */}
      <div className="absolute right-[8%] top-[35%] w-48 h-32 opacity-45">
        <svg className="w-full h-full" viewBox="0 0 200 120" fill="none">
          <path
            d="M 180 10 Q 120 40, 60 90 T 10 115"
            stroke="url(#roadTraffic)"
            strokeWidth="1.5"
            strokeDasharray="4 8"
            className="animate-[dashScroll_2s_linear_infinite]"
          />
          <defs>
            <linearGradient id="roadTraffic" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="50%" stopColor="#EF4444" />
              <stop offset="100%" stopColor="#FDE68A" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Embedded Animations */}
      <style jsx>{`
        @keyframes flightTransit {
          0% {
            transform: translateX(105vw);
          }
          100% {
            transform: translateX(-15vw);
          }
        }
        @keyframes dashScroll {
          to {
            stroke-dashoffset: -24;
          }
        }
      `}</style>
    </div>
  );
}
