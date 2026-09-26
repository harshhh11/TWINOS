'use client';

import React from 'react';
import {
  Activity,
  BarChart3,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';

export function HeroKpiCards() {
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-2.5 select-none pointer-events-auto">
      {/* 1. MONITORING: System Status NORMAL */}
      <div className="bg-[#0C121E]/80 hover:bg-[#101726]/90 backdrop-blur-xl rounded-2xl p-3 flex items-center gap-3 transition-all border border-white/[0.08] shadow-[0_8px_24px_rgba(0,0,0,0.4)] group">
        <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/25">
          <Activity className="w-4 h-4" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
            Monitoring
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-white tracking-tight">Normal</span>
          </div>
          <span className="text-[9px] text-gray-400 font-mono mt-0.5">99.8% Uptime</span>
        </div>
      </div>

      {/* 2. ANALYTICS: Asset Health 94% */}
      <div className="bg-[#0C121E]/80 hover:bg-[#101726]/90 backdrop-blur-xl rounded-2xl p-3 flex items-center gap-3 transition-all border border-white/[0.08] shadow-[0_8px_24px_rgba(0,0,0,0.4)] group">
        <div className="w-8 h-8 rounded-xl bg-sky-500/15 text-sky-400 flex items-center justify-center shrink-0 border border-sky-500/25">
          <BarChart3 className="w-4 h-4" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
            Analytics
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-sm font-bold text-white tracking-tight">94%</span>
            <span className="text-[10px] font-medium text-emerald-400">Optimal</span>
          </div>
          <span className="text-[9px] text-gray-400 font-mono mt-0.5">Fleet MTBF Nominal</span>
        </div>
      </div>

      {/* 3. PREDICTION: Predicted Congestion Terminal B (20 min) */}
      <div className="bg-[#0C121E]/80 hover:bg-[#101726]/90 backdrop-blur-xl rounded-2xl p-3 flex items-center gap-3 transition-all border border-white/[0.08] shadow-[0_8px_24px_rgba(0,0,0,0.4)] group">
        <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/25">
          <TrendingUp className="w-4 h-4" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
            Prediction
          </span>
          <span className="text-xs font-bold text-white tracking-tight mt-0.5 truncate">
            Terminal B
          </span>
          <span className="text-[9px] text-amber-400 font-mono mt-0.5">In 20 min (+32% load)</span>
        </div>
      </div>

      {/* 4. ANOMALY DETECTION: 2 Active Anomalies */}
      <div className="bg-[#0C121E]/80 hover:bg-[#101726]/90 backdrop-blur-xl rounded-2xl p-3 flex items-center gap-3 transition-all border border-white/[0.08] shadow-[0_8px_24px_rgba(0,0,0,0.4)] group">
        <div className="w-8 h-8 rounded-xl bg-red-500/15 text-red-400 flex items-center justify-center shrink-0 border border-red-500/25">
          <AlertCircle className="w-4 h-4" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
            Anomaly Detection
          </span>
          <span className="text-xs font-bold text-red-400 tracking-tight mt-0.5">
            2 Active
          </span>
          <span className="text-[9px] text-gray-400 font-mono mt-0.5">Thermal Variance</span>
        </div>
      </div>
    </div>
  );
}
