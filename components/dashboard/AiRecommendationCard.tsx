'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, SlidersHorizontal, Check } from 'lucide-react';
import { useTwinStore } from '@/lib/twin/twinStateStore';

export function AiRecommendationCard() {
  const { focusEntity } = useTwinStore();

  return (
    <div className="w-80 rounded-2xl bg-[#12161E]/85 backdrop-blur-xl border border-white/10 p-4 shadow-glass select-none pointer-events-auto transition-all hover:border-white/20 relative overflow-hidden">
      {/* Background Subtle Accent Glow */}
      <div className="absolute -top-12 -right-12 w-28 h-28 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center gap-2.5 mb-2.5">
        <div className="w-8 h-8 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-twin-orange shadow-orange-glow">
          <Sparkles className="w-4 h-4" />
        </div>
        <h3 className="text-xs font-bold text-white tracking-wide">AI Recommendation</h3>
      </div>

      {/* Recommendation Text */}
      <p className="text-xs text-white/80 leading-relaxed font-medium mb-3.5">
        Open Security Checkpoint C to reduce Terminal B concourse congestion by 40%.
      </p>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <Link
          href="/impact-analysis"
          className="flex-1 py-2 px-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-[1.02]"
        >
          <span>Analyze Impact</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>

        <button
          onClick={() => focusEntity('terminal-b', [11, 2.5, 3])}
          title="Locate Terminal B in 3D Twin"
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-all cursor-pointer"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
