'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Layers } from 'lucide-react';

export function WhatIfSimulatorCard() {
  return (
    <Link
      href="/impact-analysis"
      className="w-[260px] rounded-2xl bg-[#11151A]/88 backdrop-blur-md hover:bg-[#151A21] border border-white/[0.08] p-2 select-none pointer-events-auto shadow-card transition-all flex items-center justify-between group block"
    >
      <div className="flex items-center gap-2 min-w-0">
        <div className="w-7 h-7 rounded-xl bg-[#142338] text-[#38BDF8] flex items-center justify-center shrink-0 shadow-sm">
          <Layers className="w-3.5 h-3.5" />
        </div>
        <div className="flex flex-col min-w-0">
          <h4 className="text-xs font-semibold text-[#F4F4F5] truncate">
            What-If Simulator
          </h4>
          <p className="text-[10px] text-[#8B9199] leading-tight truncate mt-0.5">
            Simulate scenarios and see potential outcomes.
          </p>
        </div>
      </div>

      <div className="w-6 h-6 rounded-full bg-[#1A2029] border border-white/[0.08] flex items-center justify-center text-[#8B9199] group-hover:text-white group-hover:border-white/20 transition-colors shrink-0">
        <ArrowRight className="w-3 h-3" />
      </div>
    </Link>
  );
}
