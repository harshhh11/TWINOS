'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  Box,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useTwinStore } from '@/lib/twin/twinStateStore';

interface PredictionItem {
  id: string;
  category: 'EQUIPMENT' | 'RESOURCE' | 'DEGRADATION' | 'INCIDENT';
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
    category: 'DEGRADATION',
    title: 'HVAC-03 Thermal Variance & Bearing Strain',
    location: 'Terminal B South Technical Bay',
    timeframe: 'In 4 hours (20:30)',
    confidence: 88,
    expectedImpact: 'Chiller efficiency will degrade by 18%, causing coil temperatures to rise to 31.5°C during afternoon flight banking.',
    recommendedAction: 'Pre-cool Zone B2 by -1.5°C and shift 35% thermal load to Auxiliary Chiller Unit 4.',
    coordinates: [12, 3.8, 2],
    locationId: 'terminal-b',
    applied: false,
  },
  {
    id: 'pred-2',
    category: 'RESOURCE',
    title: 'Evening Grid Power Surge Demand Peak',
    location: 'Substation South Grid',
    timeframe: 'In 2.5 hours (19:00)',
    confidence: 91,
    expectedImpact: 'Peak load projected at 28.6 MW (+18% above nominal baseline) due to simultaneous ground support operations.',
    recommendedAction: 'Stage secondary transformer bank and balance feeder line B load.',
    coordinates: [-16, 1.2, 14],
    locationId: 'energy-hub',
    applied: false,
  },
  {
    id: 'pred-3',
    category: 'INCIDENT',
    title: 'Baggage Conveyor 03 Bearing Friction Spike',
    location: 'Terminal A Logistics Reclaim Hall',
    timeframe: 'In 35 minutes (17:00)',
    confidence: 82,
    expectedImpact: 'Carousel 3 belt motor under 31.8°C bearing friction could trip automated breaker within 45 minutes.',
    recommendedAction: 'Divert Flight AI-102 luggage transfer to Carousel 4 and dispatch lube maintenance crew.',
    coordinates: [-12, 0.8, 8],
    locationId: 'terminal-a',
    applied: false,
  },
  {
    id: 'pred-4',
    category: 'EQUIPMENT',
    title: 'Substation Transformer 02 Voltage Harmonics Trend',
    location: 'Primary Power Distribution Vault',
    timeframe: 'In 6 hours (22:00)',
    confidence: 85,
    expectedImpact: 'Harmonic distortion on 11kV busbar projected to reach 4.8%, close to 5.0% IEEE threshold.',
    recommendedAction: 'Engage active power harmonic filter bank 2 on Substation Bus B.',
    coordinates: [-16, 1.2, 14],
    locationId: 'energy-hub',
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
    <div className="w-screen min-h-screen bg-[#F0F4F8] text-[#0F172A] font-sans select-none flex flex-col">
      {/* Top Header */}
      <header className="px-8 py-4 border-b border-[#E2E8F0] bg-white sticky top-0 z-30 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] text-xs font-bold text-[#0F172A] transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-[#EA580C]" />
            <span>Dashboard</span>
          </Link>

          <div>
            <h1 className="text-base font-extrabold text-[#0F172A] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#EA580C]" />
              Operational Trend Predictions & Asset Mitigations
            </h1>
            <p className="text-[11px] text-[#64748B]">
              Machine Learning Equipment Degradation Forecasting • Telemetry Projections • Preventative Actions
            </p>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 p-1 bg-[#F1F5F9] border border-[#E2E8F0] rounded-full text-xs">
          {['ALL', 'DEGRADATION', 'RESOURCE', 'EQUIPMENT', 'INCIDENT'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                filterCategory === cat
                  ? 'bg-[#EA580C] text-white font-bold shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
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
        <div className="p-5 rounded-3xl bg-white border border-[#E2E8F0] shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#FFF7ED] border border-[#FFEDD5] flex items-center justify-center text-[#EA580C]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-[#0F172A]">
                {predictions.filter((p) => !p.applied).length} Active Asset & Operational Forecasts Requiring Attention
              </h2>
              <p className="text-xs text-[#64748B] mt-0.5">
                TwinOS predictive engine runs forward degradation projections using sensor history and physical telemetry models.
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-700 bg-[#ECFDF5] px-3.5 py-1.5 rounded-full border border-[#A7F3D0]">
            Avg Confidence: 87%
          </span>
        </div>

        {/* Prediction Cards List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((pred) => {
            return (
              <div
                key={pred.id}
                className={`p-6 rounded-3xl border transition-all flex flex-col justify-between ${
                  pred.applied
                    ? 'bg-[#F8FAFC] border-emerald-300'
                    : 'bg-white hover:shadow-md border-[#E2E8F0] shadow-xs'
                }`}
              >
                <div>
                  {/* Category & Confidence Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#FFF7ED] text-[#EA580C] border border-[#FFEDD5]">
                      {pred.category}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-emerald-600">
                        {pred.confidence}% Confidence
                      </span>
                      <span className="text-xs text-[#94A3B8] font-mono">
                        {pred.timeframe}
                      </span>
                    </div>
                  </div>

                  {/* Title & Location */}
                  <h3 className="text-sm font-extrabold text-[#0F172A] mb-1">
                    {pred.title}
                  </h3>
                  <span className="text-xs text-[#64748B] block mb-3 font-medium">
                    Location: {pred.location}
                  </span>

                  {/* Expected Impact */}
                  <div className="p-3.5 rounded-2xl bg-[#FEF2F2] border border-[#FEE2E2] mb-3 text-xs">
                    <span className="text-[10px] font-bold text-[#DC2626] uppercase block mb-1 font-mono">
                      Expected Operational Impact
                    </span>
                    <p className="text-xs text-[#7F1D1D] leading-relaxed">
                      {pred.expectedImpact}
                    </p>
                  </div>

                  {/* Recommended Action */}
                  <div className="p-3.5 rounded-2xl bg-[#FFF7ED] border border-[#FFEDD5] mb-4 text-xs">
                    <span className="text-[10px] font-bold text-[#EA580C] uppercase block mb-1 font-mono">
                      Recommended Preventive Action
                    </span>
                    <p className="text-xs text-[#9A3412] font-semibold leading-relaxed">
                      {pred.recommendedAction}
                    </p>
                  </div>
                </div>

                {/* Card Bottom Actions */}
                <div className="flex items-center justify-between pt-3.5 border-t border-[#F1F5F9] gap-3">
                  <button
                    onClick={() => handleLocateInTwin(pred)}
                    className="px-3.5 py-2 rounded-2xl bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] text-xs text-[#0F172A] font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Box className="w-4 h-4 text-[#EA580C]" />
                    <span>View in Twin</span>
                  </button>

                  <button
                    onClick={() => handleApplyAction(pred.id)}
                    disabled={pred.applied}
                    className={`flex-1 py-2.5 px-4 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      pred.applied
                        ? 'bg-[#ECFDF5] text-emerald-700 border border-[#A7F3D0]'
                        : 'bg-[#EA580C] hover:bg-[#C2410C] text-white shadow-xs'
                    }`}
                  >
                    {pred.applied ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Mitigation Applied ✓</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Dispatch Preventive Action</span>
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
