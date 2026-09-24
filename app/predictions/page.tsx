'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  TrendingUp,
  Sparkles,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Box,
  Layers,
  Zap,
  Cpu,
  Users,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useTwinStore } from '@/lib/twin/twinStateStore';

interface PredictionItem {
  id: string;
  category: 'CONGESTION' | 'RESOURCE' | 'DEGRADATION' | 'INCIDENT';
  title: string;
  location: string;
  timeframe: string;
  confidence: number;
  expectedImpact: string;
  recommendedAction: string;
  coordinates: [number, number, number];
  locationId: string;
  applied: boolean;
}

const INITIAL_PREDICTIONS: PredictionItem[] = [
  {
    id: 'pred-1',
    category: 'CONGESTION',
    title: 'Passenger Queue Bottleneck at Terminal B Security',
    location: 'Terminal B - Concourse B2',
    timeframe: 'In 20 minutes (16:45)',
    confidence: 94,
    expectedImpact: 'Security queue will exceed capacity (+14 min delay for 480 passengers), potentially delaying 3 flight departures.',
    recommendedAction: 'Open Security Checkpoint C and deploy 2 mobile passenger flow marshals to divert line.',
    coordinates: [11, 2.5, 3],
    locationId: 'terminal-b',
    applied: false,
  },
  {
    id: 'pred-2',
    category: 'DEGRADATION',
    title: 'HVAC-03 Thermal Variance & Bearing Strain',
    location: 'Terminal B South Roof',
    timeframe: 'In 4 hours (20:30)',
    confidence: 88,
    expectedImpact: 'Internal temperature in Concourse B will rise by +3.4°C during peak passenger arrival wave.',
    recommendedAction: 'Pre-cool Zone B2 by -1.5°C right now and shift 35% load to Auxiliary Chiller Unit 4.',
    coordinates: [12, 3.8, 2],
    locationId: 'terminal-b',
    applied: false,
  },
  {
    id: 'pred-3',
    category: 'RESOURCE',
    title: 'Evening Grid Power Surge Demand Peak',
    location: 'Substation South Grid',
    timeframe: 'In 2.5 hours (19:00)',
    confidence: 91,
    expectedImpact: 'Peak load projected at 28.6 MW (+18% above nominal), triggering tiered peak tariff penalty.',
    recommendedAction: 'Initiate automated peak shaving on non-essential baggage apron lighting (-1.2 MW).',
    coordinates: [-16, 1.2, 14],
    locationId: 'energy-hub',
    applied: false,
  },
  {
    id: 'pred-4',
    category: 'INCIDENT',
    title: 'Baggage Conveyor 03 Jam Risk via Luggage Volume Spike',
    location: 'Terminal A Logistics Reclaim Hall',
    timeframe: 'In 35 minutes (17:00)',
    confidence: 82,
    expectedImpact: 'Carousel 3 belt slowdown under 84°C friction could cause 12-minute baggage retrieval bottleneck.',
    recommendedAction: 'Divert Flight AI-102 luggage transfer to Carousel 4 and alert ground logistics crew.',
    coordinates: [-12, 0.8, 8],
    locationId: 'terminal-a',
    applied: false,
  },
];

export default function PredictionsPage() {
  const router = useRouter();
  const { focusEntity } = useTwinStore();
  const [predictions, setPredictions] = useState<PredictionItem[]>(INITIAL_PREDICTIONS);
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const handleApplyAction = (id: string) => {
    setPredictions((prev) =>
      prev.map((p) => (p.id === id ? { ...p, applied: true } : p))
    );
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  const handleLocateInTwin = (pred: PredictionItem) => {
    focusEntity(pred.locationId, pred.coordinates);
    router.push('/');
  };

  const filtered = filterCategory === 'ALL'
    ? predictions
    : predictions.filter((p) => p.category === filterCategory);

  return (
    <div className="w-screen h-screen overflow-y-auto bg-[#080A0D] text-[#F4F4F5] font-sans select-none flex flex-col">
      {/* Top Header */}
      <header className="px-8 py-4 border-b border-white/[0.08] bg-[#0D1014]/90 backdrop-blur-xl flex items-center justify-between sticky top-0 z-30 shadow-card">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-[#F4F4F5] transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </Link>

          <div>
            <h1 className="text-base font-bold text-[#F4F4F5] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#F28C18]" />
              AI Operational Predictions & Proactive Mitigations
            </h1>
            <p className="text-[11px] text-[#8B9199]">
              Machine Learning Bottleneck Forecasting • Degradation Simulation • Prescriptive Remedies
            </p>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 p-1 bg-white/5 border border-white/10 rounded-full text-xs">
          {['ALL', 'CONGESTION', 'DEGRADATION', 'RESOURCE', 'INCIDENT'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                filterCategory === cat
                  ? 'bg-[#F28C18] text-black font-bold shadow-sm'
                  : 'text-[#8B9199] hover:text-[#F4F4F5]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* Main Grid */}
      <div className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-6">
        {/* Top Summary Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#1D1711] to-[#12161E] border border-[#F28C18]/30 shadow-card flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F28C18]/20 border border-[#F28C18]/40 flex items-center justify-center text-[#F28C18]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#F4F4F5]">
                {predictions.filter((p) => !p.applied).length} Active Proactive Forecasts Requiring Attention
              </h2>
              <p className="text-xs text-[#8B9199] mt-0.5">
                TwinOS predictive intelligence runs 15-minute forward simulations using physics models and historical neural baselines.
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            Avg Confidence: 89%
          </span>
        </div>

        {/* Prediction Cards List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((pred) => {
            return (
              <div
                key={pred.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                  pred.applied
                    ? 'bg-[#0D1014]/60 border-emerald-500/30'
                    : 'bg-[#0D1014]/90 hover:bg-[#12161E] border-white/[0.08] shadow-card'
                }`}
              >
                <div>
                  {/* Category & Confidence Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/5 text-[#F28C18] border border-white/10">
                      {pred.category}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-emerald-400">
                        {pred.confidence}% Confidence
                      </span>
                      <span className="text-[10px] text-[#8B9199] font-mono">
                        {pred.timeframe}
                      </span>
                    </div>
                  </div>

                  {/* Title & Location */}
                  <h3 className="text-sm font-bold text-[#F4F4F5] mb-1">
                    {pred.title}
                  </h3>
                  <span className="text-xs text-[#8B9199] block mb-3 font-medium">
                    Location: {pred.location}
                  </span>

                  {/* Expected Impact */}
                  <div className="p-3 rounded-xl bg-red-950/20 border border-red-500/20 mb-3 text-xs">
                    <span className="text-[10px] font-bold text-red-400 uppercase block mb-1">
                      Expected Operational Impact
                    </span>
                    <p className="text-[11px] text-white/80 leading-relaxed">
                      {pred.expectedImpact}
                    </p>
                  </div>

                  {/* Recommended Action */}
                  <div className="p-3 rounded-xl bg-[#F28C18]/10 border border-[#F28C18]/25 mb-4 text-xs">
                    <span className="text-[10px] font-bold text-[#F28C18] uppercase block mb-1">
                      Recommended Action
                    </span>
                    <p className="text-[11px] text-[#F4F4F5] font-medium leading-relaxed">
                      {pred.recommendedAction}
                    </p>
                  </div>
                </div>

                {/* Card Bottom Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-white/5 gap-3">
                  <button
                    onClick={() => handleLocateInTwin(pred)}
                    className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-[#8B9199] hover:text-[#F4F4F5] font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Box className="w-3.5 h-3.5 text-[#F28C18]" />
                    <span>View in Twin</span>
                  </button>

                  <button
                    onClick={() => handleApplyAction(pred.id)}
                    disabled={pred.applied}
                    className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      pred.applied
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-[#F28C18] hover:bg-[#ff9a2e] text-black shadow-sm'
                    }`}
                  >
                    {pred.applied ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Action Dispatched ✓</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Execute Recommended Action</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
