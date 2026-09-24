'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Zap,
  Users,
  Box,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useTwinStore } from '@/lib/twin/twinStateStore';
import { getTerminalPrediction, detectAnomalies } from '@/lib/prediction/predictionEngine';

export default function AiInsightsPage() {
  const router = useRouter();
  const { focusEntity, markers } = useTwinStore();

  const terminalBPrediction = getTerminalPrediction(88, true);
  const detectedAnomalies = detectAnomalies(24320, 29.2, 28);

  const handleFocusTerminalB = () => {
    const tb = markers.find((m) => m.id === 'terminal-b');
    if (tb) {
      focusEntity(tb.id, tb.position);
      router.push('/');
    }
  };

  return (
    <div className="w-screen h-screen overflow-y-auto bg-twin-bg text-white font-sans select-none flex flex-col">
      {/* Top Header */}
      <header className="px-8 py-4 border-b border-white/10 bg-[#12161E]/80 backdrop-blur-xl flex items-center justify-between sticky top-0 z-30 shadow-glass">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </Link>

          <div>
            <h1 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-twin-orange" />
              AI Predictive Intelligence & Anomaly Detection
            </h1>
            <p className="text-[11px] text-white/50">
              Probabilistic Forecasting • Rolling Baseline Deviations • Real-Time Alert Engine
            </p>
          </div>
        </div>

        <button
          onClick={handleFocusTerminalB}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white text-xs font-bold shadow-orange-glow transition-all cursor-pointer"
        >
          <Box className="w-3.5 h-3.5" />
          <span>View Forecast Zone in 3D Twin</span>
        </button>
      </header>

      {/* Main Body Grid */}
      <div className="flex-1 p-8 grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto w-full">
        {/* ========================================================================= */}
        {/* LEFT 2 COLUMNS: ACTUAL VS PREDICTED FORECAST CHART */}
        {/* ========================================================================= */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Main Forecast Card */}
          <div className="bg-[#12161E]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-glass">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-bold text-white uppercase tracking-wider block">
                  Terminal B Concourse Occupancy Forecast
                </span>
                <span className="text-[11px] text-white/50">
                  ARIMA + Deep Attention Model (Confidence Interval: 87%)
                </span>
              </div>

              {/* Data Labels Legend */}
              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-1 bg-emerald-400 rounded-full" />
                  Live Measured
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-1 bg-twin-orange rounded-full" />
                  AI Predicted
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 bg-orange-500/20 border border-orange-500/40 rounded-sm" />
                  95% Confidence Band
                </span>
              </div>
            </div>

            {/* Metric Overview Pills */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="text-[10px] text-white/50 block">Current Measured Occupancy</span>
                <span className="text-xl font-black text-white">88%</span>
                <span className="text-[10px] text-emerald-400 block mt-0.5">● Sensor Ground Truth</span>
              </div>

              <div className="p-3.5 rounded-xl bg-orange-500/10 border border-orange-500/30">
                <span className="text-[10px] text-twin-orange font-bold block uppercase">
                  Projected Surge Peak
                </span>
                <span className="text-xl font-black text-orange-400">94%</span>
                <span className="text-[10px] text-white/70 block mt-0.5">in 20 minutes</span>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="text-[10px] text-white/50 block">Model Confidence</span>
                <span className="text-xl font-black text-white">87.4%</span>
                <span className="text-[10px] text-white/40 block mt-0.5">P-value &lt; 0.001</span>
              </div>
            </div>

            {/* Custom High-Fidelity SVG Prediction Chart with Confidence Bands */}
            <div className="relative w-full h-64 bg-slate-950/60 rounded-xl border border-white/10 p-4 flex flex-col justify-between overflow-hidden">
              {/* Grid Lines */}
              <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:4rem_2rem]" />

              {/* Peak Marker Badge in Chart */}
              <div className="absolute top-6 left-[44%] px-2.5 py-1 rounded-full bg-red-500 text-white font-bold text-[10px] shadow-status-red flex items-center gap-1 z-10">
                <span>Peak: 94%</span>
                <span className="text-[9px] opacity-80">(in 20m)</span>
              </div>

              {/* SVG Curve */}
              <svg className="w-full h-44" viewBox="0 0 600 160" preserveAspectRatio="none">
                <defs>
                  {/* Confidence Interval Gradient */}
                  <linearGradient id="bandGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F97316" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#F97316" stopOpacity="0.02" />
                  </linearGradient>
                </defs>

                {/* Upper and Lower Confidence Interval Area */}
                <path
                  d="M 50 80 Q 150 70, 270 20 T 400 35 T 550 110 L 550 140 T 400 70 T 270 50 Q 150 95, 50 100 Z"
                  fill="url(#bandGrad)"
                />

                {/* AI Predicted Line */}
                <path
                  d="M 50 90 Q 150 80, 270 30 T 400 50 T 550 120"
                  fill="none"
                  stroke="#F97316"
                  strokeWidth="3"
                  strokeDasharray="6,4"
                />

                {/* Live Measured Solid Line (up to current point) */}
                <path
                  d="M 50 90 Q 110 86, 170 65"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* Current Time Cutoff Line */}
                <line x1="170" y1="10" x2="170" y2="150" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="3,3" opacity="0.4" />
              </svg>

              {/* Chart X-Axis Labels */}
              <div className="flex justify-between text-[11px] text-white/50 font-mono pt-2 border-t border-white/10 z-10">
                <span>-30 min (Past)</span>
                <span>-15 min</span>
                <span className="font-bold text-white">NOW (04:26 PM)</span>
                <span>+15 min</span>
                <span className="text-twin-orange font-bold">+20 min (Peak)</span>
                <span>+1 Hour</span>
                <span>+2 Hours</span>
              </div>
            </div>

            <p className="mt-4 text-xs text-white/70 leading-relaxed">
              {terminalBPrediction.forecastSummary}
            </p>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: ANOMALY DETECTION ENGINE */}
        {/* ========================================================================= */}
        <div className="flex flex-col gap-4">
          <div className="bg-[#12161E]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-glass">
            <h3 className="text-xs font-bold text-white tracking-wide uppercase mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Active Telemetry Anomalies ({detectedAnomalies.length})
            </h3>

            <div className="space-y-3">
              {detectedAnomalies.map((anom) => (
                <div
                  key={anom.id}
                  className="p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all text-xs"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-white">{anom.metric}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        anom.severity === 'HIGH'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      }`}
                    >
                      +{anom.percentageDeviation}% ABOVE BASELINE
                    </span>
                  </div>

                  <p className="text-[11px] text-white/80 leading-snug">{anom.description}</p>
                  <span className="text-[10px] font-mono text-twin-orange block mt-2">
                    {anom.location}
                  </span>
                </div>
              ))}
            </div>

            {/* AI Recommendation Link */}
            <div className="mt-5 p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs">
              <span className="text-white/60">Automated Resolution Plan</span>
              <Link
                href="/impact-analysis"
                className="text-twin-orange font-bold flex items-center gap-1 hover:underline"
              >
                <span>View Action Plan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
