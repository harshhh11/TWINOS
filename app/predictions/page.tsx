'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  Box,
  RotateCw,
  AlertTriangle,
  Clock,
  Zap,
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
    timeframe: 'In 22 minutes (16:48)',
    confidence: 88,
    expectedImpact: 'Chiller efficiency will degrade by 18%, causing coil temperatures to reach 31.5°C threshold.',
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
    timeframe: 'In 50 minutes (17:15)',
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
    recommendedAction: 'Reroute Terminal A baggage transfer to Conveyor 04 and dispatch lubrication maintenance crew.',
    coordinates: [-12, 0.8, 8],
    locationId: 'terminal-a',
    applied: false,
  },
  {
    id: 'pred-4',
    category: 'EQUIPMENT',
    title: 'Substation Transformer 02 Voltage Harmonics Trend',
    location: 'Primary Power Distribution Vault',
    timeframe: 'In 2 hours (18:30)',
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

  const [geminiForecast, setGeminiForecast] = useState<any>(null);
  const [isLoadingGemini, setIsLoadingGemini] = useState(false);

  const fetchGeminiPrediction = async () => {
    setIsLoadingGemini(true);
    try {
      const res = await fetch('/api/prediction/gemini', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setGeminiForecast(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingGemini(false);
    }
  };

  useEffect(() => {
    fetchGeminiPrediction();
  }, []);

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
    <div className="w-screen min-h-screen bg-[#080D16] text-[#F8FAFC] font-sans select-none flex flex-col">
      {/* Top Header */}
      <header className="px-8 py-4 border-b border-white/[0.08] bg-[#0C121E]/95 backdrop-blur-2xl sticky top-0 z-30 shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-bold text-white transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-[#F26A21]" />
            <span>Dashboard</span>
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#F26A21]" />
                Predictive Horizon & System Forecast
              </h1>
              <span className="text-[10px] font-mono font-bold bg-[#F26A21]/20 text-[#F26A21] px-2 py-0.5 rounded-full border border-[#F26A21]/30">
                Gemini 3.8 Flash
              </span>
            </div>
            <p className="text-[11px] text-gray-400">
              Predict upcoming operational conditions • Forecast asset trends • Identify approaching thresholds
            </p>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 p-1 bg-white/[0.04] border border-white/[0.08] rounded-full text-xs">
          {['ALL', 'DEGRADATION', 'RESOURCE', 'EQUIPMENT', 'INCIDENT'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                filterCategory === cat
                  ? 'bg-[#F26A21] text-white font-bold shadow-[0_2px_12px_rgba(242,106,33,0.4)]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-6">
        {/* Gemini Live Forecast Hero Card */}
        <div className="p-6 rounded-3xl bg-[#0C121E]/95 backdrop-blur-2xl border border-white/[0.08] shadow-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF7A1A] to-[#E55310] flex items-center justify-center text-white shadow-[0_4px_16px_rgba(242,106,33,0.45)] shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-black text-white">
                    Gemini 3.8 Flash Live Predictive Horizon
                  </h2>
                  <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    Active Horizon: {geminiForecast?.forecastHorizon || '+30 Minutes'}
                  </span>
                </div>
                <p className="text-xs text-gray-300 mt-0.5 font-medium">
                  {geminiForecast?.operationalOutlook || 'Synthesizing real-time sensor streams and thermal variance metrics...'}
                </p>
              </div>
            </div>

            <button
              onClick={fetchGeminiPrediction}
              disabled={isLoadingGemini}
              className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-xs font-bold text-white transition-all flex items-center gap-2 cursor-pointer shadow-sm shrink-0 disabled:opacity-50"
            >
              <RotateCw className={`w-4 h-4 text-[#F26A21] ${isLoadingGemini ? 'animate-spin' : ''}`} />
              <span>{isLoadingGemini ? 'Querying Gemini...' : 'Refresh AI Forecast'}</span>
            </button>
          </div>

          {/* Approaching Threshold Visual Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {(geminiForecast?.approachingThresholds || [
              { asset: 'Terminal B HVAC-03 Chiller', parameter: 'Coil Temperature', currentValue: '29.2°C', threshold: '31.5°C', timeToThreshold: '22 mins', severity: 'HIGH' },
              { asset: 'Conveyor Drive Motor B03', parameter: 'Harmonic Vibration', currentValue: '4.2 mm/s', threshold: '4.5 mm/s', timeToThreshold: '35 mins', severity: 'MEDIUM' },
              { asset: 'Substation Secondary Feeder', parameter: 'Transformer Current', currentValue: '1,250 kW', threshold: '1,450 kW', timeToThreshold: '50 mins', severity: 'LOW' },
            ]).map((thresh: any, idx: number) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-white truncate">{thresh.asset}</span>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      thresh.severity === 'HIGH' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {thresh.timeToThreshold}
                    </span>
                  </div>
                  <span className="text-[11px] text-gray-400 block mb-2">{thresh.parameter}</span>
                </div>
                <div className="flex items-center justify-between text-xs pt-2 border-t border-white/[0.06]">
                  <span className="text-gray-300 font-medium">Current: <strong className="text-white">{thresh.currentValue}</strong></span>
                  <span className="font-mono text-[10px] text-red-400 font-bold">Limit: {thresh.threshold}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Prediction Cards List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((pred) => {
            return (
              <div
                key={pred.id}
                className={`p-6 rounded-3xl border transition-all flex flex-col justify-between bg-[#0C121E]/95 backdrop-blur-2xl shadow-md ${
                  pred.applied
                    ? 'border-emerald-500/40 bg-emerald-500/[0.03]'
                    : 'border-white/[0.08] hover:border-white/[0.16]'
                }`}
              >
                <div>
                  {/* Category & Confidence Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#F26A21]/20 text-[#F26A21] border border-[#F26A21]/30">
                      {pred.category}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-emerald-400">
                        {pred.confidence}% Confidence
                      </span>
                      <span className="text-xs text-gray-500 font-mono">
                        {pred.timeframe}
                      </span>
                    </div>
                  </div>

                  {/* Title & Location */}
                  <h3 className="text-sm font-extrabold text-white mb-1">
                    {pred.title}
                  </h3>
                  <span className="text-xs text-gray-400 block mb-3 font-medium">
                    Location: {pred.location}
                  </span>

                  {/* Expected Impact */}
                  <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 mb-3 text-xs">
                    <span className="text-[10px] font-bold text-red-400 uppercase block mb-1 font-mono">
                      Approaching Operational Threshold
                    </span>
                    <p className="text-xs text-red-200 leading-relaxed">
                      {pred.expectedImpact}
                    </p>
                  </div>

                  {/* Recommended Action */}
                  <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 mb-4 text-xs">
                    <span className="text-[10px] font-bold text-amber-400 uppercase block mb-1 font-mono">
                      Preventative Mitigation Action
                    </span>
                    <p className="text-xs text-amber-200 font-semibold leading-relaxed">
                      {pred.recommendedAction}
                    </p>
                  </div>
                </div>

                {/* Card Bottom Actions */}
                <div className="flex items-center justify-between pt-3.5 border-t border-white/[0.06] gap-3">
                  <button
                    onClick={() => handleLocateInTwin(pred)}
                    className="px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs text-white font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Box className="w-4 h-4 text-[#F26A21]" />
                    <span>View in 3D Twin</span>
                  </button>

                  <button
                    onClick={() => handleApplyAction(pred.id)}
                    disabled={pred.applied}
                    className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      pred.applied
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-[#F26A21] hover:bg-[#EA580C] text-white shadow-[0_4px_16px_rgba(242,106,33,0.35)]'
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
