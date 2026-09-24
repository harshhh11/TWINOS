'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function HeroHeadline() {
  return (
    <div className="flex flex-col max-w-sm z-20 pointer-events-auto select-none pt-1">
      {/* Eyebrow */}
      <span className="text-[11px] font-semibold tracking-widest text-[#8B9199] uppercase mb-1">
        LIVE DIGITAL TWIN
      </span>

      {/* Main Headline */}
      <h1 className="text-3xl xl:text-[38px] font-bold tracking-tight text-[#F4F4F5] leading-[1.12]">
        A Smarter<br />
        Tomorrow, Today.
      </h1>

      {/* Subtitle */}
      <p className="mt-2.5 text-xs text-[#8B9199] leading-relaxed">
        Realtime intelligence. Predictive insights.<br />
        Safer, more efficient infrastructure.
      </p>

      {/* Primary Pill Button */}
      <div className="mt-4">
        <Link
          href="/twin"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-slate-100 text-[#080A0D] font-bold text-xs transition-transform active:scale-95 shadow-sm"
        >
          <span>Explore the Twin</span>
          <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
        </Link>
      </div>
    </div>
  );
}
