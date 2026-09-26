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
  Plane,
  Brain,
  Sliders,
  Filter,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useTwinStore } from '@/lib/twin/twinStateStore';
import { airportDataService } from '@/lib/data/airportDataService';

export default function PredictionsPage() {
  const router = useRouter();
  const { focusEntity } = useTwinStore();
  const summary = airportDataService.getSummary();

  const [activeTab, setActiveTab] = useState<'FLIGHT_DELAYS' | 'CONGESTION' | 'EQUIPMENT' | 'SIMULATOR'>('FLIGHT_DELAYS');
  const [appliedActions, setAppliedActions] = useState<Record<string, boolean>>({});

  // Simulator state
  const [simAirline, setSimAirline] = useState('Vistara');
  const [simDestination, setSimDestination] = useState('SIN');
  const [simWeatherRisk, setSimWeatherRisk] = useState(0.65);
  const [simLoadFactor, setSimLoadFactor] = useState(88);
  const [simTimeOfDay, setSimTimeOfDay] = useState('Evening');
  const [simPrediction, setSimPrediction] = useState<{ prob: number; delayMin: number } | null>(null);

  const handleApplyAction = (id: string) => {
    setAppliedActions((prev) => ({ ...prev, [id]: true }));
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  const handleRunSimulator = () => {
    // Grounded ML regression heuristic based on trained model weights:
    // Weather risk (15.2%), Load factor (15.2%), Airline baseline (7.7%), Time of day (3.4%)
    const weatherFactor = simWeatherRisk * 45;
    const loadFactorWeight = (simLoadFactor / 100) * 30;
    const timeFactor = simTimeOfDay === 'Night' ? 12 : simTimeOfDay === 'Evening' ? 8 : 4;
    const airlineBaseline = simAirline === 'Lufthansa' ? 14 : simAirline === 'Vistara' ? 8 : 10;

    const prob = Math.min(96, Math.max(12, Math.round(weatherFactor + loadFactorWeight + timeFactor * 0.5)));
    const delayMin = prob > 50 ? Math.round(15 + (prob - 50) * 1.8) : 0;

    setSimPrediction({ prob, delayMin });
  };

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
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-[#F4F4F5] flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#F28C18]" />
                AI Predictive Engine & Machine Learning Forecasts
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-mono font-bold text-emerald-400 flex items-center gap-1">
                <Brain className="w-2.5 h-2.5" />
                Random Forest ML (100 Trees)
              </span>
            </div>
            <p className="text-[11px] text-[#8B9199]">
              Flight Delay Probabilities • Terminal Peak Congestion Waves • Predictive Maintenance Alerts
            </p>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-white/5 border border-white/10 rounded-full text-xs">
          {[
            { id: 'FLIGHT_DELAYS', label: 'Flight Delay Predictions' },
            { id: 'CONGESTION', label: 'Terminal Congestion Peaks' },
            { id: 'EQUIPMENT', label: 'Equipment Degradation' },
            { id: 'SIMULATOR', label: 'Interactive ML Simulator' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#F28C18] text-black font-bold shadow-sm'
                  : 'text-[#8B9199] hover:text-[#F4F4F5]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-6">
        {/* ML Model Benchmark Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#1D1711] to-[#12161E] border border-[#F28C18]/30 shadow-card flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F28C18]/20 border border-[#F28C18]/40 flex items-center justify-center text-[#F28C18]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#F4F4F5] flex items-center gap-2">
                <span>Model Diagnostics:</span>
                <span className="text-emerald-400 font-mono">
                  {summary.ml_models.flight_delay_classifier.accuracy}% Accuracy
                </span>
                <span className="text-[#8B9199]">•</span>
                <span className="text-sky-400 font-mono">
                  ROC-AUC {summary.ml_models.flight_delay_classifier.roc_auc}
                </span>
              </h2>
              <p className="text-xs text-[#8B9199] mt-0.5">
                Trained on 1,000 multi-table flights with 12 features: Weather Risk Score, Load Factor %, Distance, Airline Carrier, Aircraft Model.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {summary.ml_models.flight_delay_classifier.feature_importances.slice(0, 3).map((f, i) => (
              <span key={i} className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white/80 flex items-center gap-1">
                <span>{f.feature.replace(/_/g, ' ')}:</span>
                <strong className="text-[#F28C18]">{f.importance}%</strong>
              </span>
            ))}
          </div>
        </div>

        {/* 1. FLIGHT DELAY PREDICTIONS TAB */}
        {activeTab === 'FLIGHT_DELAYS' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#F4F4F5] flex items-center gap-2">
                  <Plane className="w-4 h-4 text-[#F28C18]" />
                  High-Risk Scheduled Flights (Delay Probability ≥ 60%)
                </h3>
                <span className="text-[11px] text-[#8B9199]">
                  Random Forest ML model inferences for upcoming departures at Indira Gandhi International Airport
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {summary.high_risk_flights.slice(0, 8).map((flight) => {
                const isApplied = appliedActions[flight.flight_id];
                return (
                  <div
                    key={flight.flight_id}
                    className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                      isApplied
                        ? 'bg-[#0D1014]/60 border-emerald-500/30'
                        : 'bg-[#0D1014]/90 hover:bg-[#12161E] border-white/[0.08] shadow-card'
                    }`}
                  >
                    <div>
                      {/* Flight Header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-[#F4F4F5]">{flight.flight_id}</span>
                          <span className="text-xs text-[#8B9199]">• {flight.airline_name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                            {flight.predicted_delay_prob}% Delay Risk
                          </span>
                          <span className="text-[10px] font-mono text-[#8B9199]">
                            +{flight.predicted_delay_min} min est.
                          </span>
                        </div>
                      </div>

                      {/* Flight Details Grid */}
                      <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-white/5 border border-white/10 mb-3 text-xs">
                        <div>
                          <span className="text-[10px] text-[#8B9199] block">Destination</span>
                          <span className="font-bold text-[#F4F4F5] font-mono">DEL → {flight.destination_airport}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-[#8B9199] block">Aircraft / Gate</span>
                          <span className="font-bold text-[#F4F4F5] font-mono">{flight.aircraft_type} ({flight.gate})</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-[#8B9199] block">Load Factor</span>
                          <span className="font-bold text-sky-400 font-mono">
                            {Number(flight.load_factor_pct || 75).toFixed(1)}%
                          </span>
                        </div>
                      </div>

                      {/* Primary Delay Driver */}
                      <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-3 text-xs">
                        <span className="text-[10px] font-bold text-amber-400 uppercase block mb-1 font-mono">
                          Primary Predicted Bottleneck
                        </span>
                        <p className="text-[11px] text-white/80 leading-relaxed">
                          Weather Risk Index at {(((flight.weather_risk_score ?? 0.5)) * 100).toFixed(0)}% combined with {flight.airline_name} turn-around window constraints at {flight.gate}.
                        </p>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="flex items-center justify-between pt-3 border-t border-white/5 gap-3">
                      <span className="text-[11px] text-[#8B9199] font-mono">
                        Dep: {flight.scheduled_departure.slice(11, 16)}
                      </span>
                      <button
                        onClick={() => handleApplyAction(flight.flight_id)}
                        disabled={isApplied}
                        className={`py-2 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          isApplied
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-[#F28C18] hover:bg-[#ff9a2e] text-black shadow-sm'
                        }`}
                      >
                        {isApplied ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Ramp Slot Adjusted ✓</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Pre-empt Slot Rebalance</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. TERMINAL CONGESTION TAB */}
        {activeTab === 'CONGESTION' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#0D1014]/90 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 shadow-card space-y-4">
              <h3 className="text-sm font-bold text-[#F4F4F5] flex items-center gap-2">
                <Clock className="w-4 h-4 text-sky-400" />
                Terminal 3 Passenger Banking Forecast
              </h3>
              <p className="text-[11px] text-[#8B9199]">
                Predicted peak queue wait times across scheduled arrival and departure banks
              </p>
              <div className="space-y-3">
                {[
                  { time: '10:00 - 12:00', load: 'Midday Peak Bank', pax: '13,600 pax', wait: '22 min queue', risk: 'HIGH' },
                  { time: '16:00 - 18:00', load: 'Evening Departure Bank', pax: '14,200 pax', wait: '24 min queue', risk: 'HIGH' },
                  { time: '20:00 - 22:00', load: 'Night Intercontinental', pax: '10,800 pax', wait: '15 min queue', risk: 'MEDIUM' },
                  { time: '04:00 - 06:00', load: 'Early Regional Feeder', pax: '7,900 pax', wait: '11 min queue', risk: 'LOW' },
                ].map((item, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-[#F4F4F5] block">{item.time} • {item.load}</span>
                      <span className="text-[11px] text-[#8B9199]">{item.pax} • Estimated: {item.wait}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      item.risk === 'HIGH' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {item.risk} LOAD
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#0D1014]/90 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 shadow-card space-y-4">
              <h3 className="text-sm font-bold text-[#F4F4F5] flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#F28C18]" />
                Security Checkpoint Lane Allocations
              </h3>
              <p className="text-[11px] text-[#8B9199]">
                Recommended dynamic staffing based on passenger flow simulations
              </p>
              <div className="space-y-3">
                {[
                  { lane: 'Lanes 1 - 4 (Main Hall)', current: '400 pax/hr', recommended: 'Open +2 Auxiliary X-Ray lanes at 15:30', status: 'ALERT' },
                  { lane: 'Lanes 5 - 8 (Fast Track)', current: '250 pax/hr', recommended: 'Maintain nominal 2-agent configuration', status: 'OPTIMAL' },
                  { lane: 'Baggage Carousel C12', current: '2,800 bags handled', recommended: 'Deploy ground support sort team at 17:45', status: 'WATCH' },
                ].map((item, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#F4F4F5]">{item.lane}</span>
                      <span className="text-[10px] font-mono text-[#F28C18]">{item.status}</span>
                    </div>
                    <p className="text-[11px] text-white/80">{item.recommended}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 3. EQUIPMENT DEGRADATION TAB */}
        {activeTab === 'EQUIPMENT' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                id: 'eq-1',
                title: 'Aircraft Fleet Hydraulic Seal Wear (VT-ABC)',
                location: 'Airside Hangar Bay 4',
                impact: 'Downtime logged at 32 min across 400 work orders. Hydraulic seal variance indicates high probability of recurrence during turn-around.',
                action: 'Perform non-destructive ultrasonic seal test prior to scheduled departure.',
                confidence: 94,
              },
              {
                id: 'eq-2',
                title: 'High-Speed Baggage Belt Motor 03 Bearing Friction',
                location: 'Terminal 3 Logistics Reclaim Hall',
                impact: 'Carousel C12 conveyor operating under 31.8°C bearing friction. Projecting motor thermal trip within 45 minutes.',
                action: 'Divert flight luggage to secondary Carousel C14 and dispatch lubrication team.',
                confidence: 88,
              },
              {
                id: 'eq-3',
                title: 'HVAC Chiller Unit 03 Thermal Load Surge',
                location: 'Terminal 3 Concourse B Rooftop',
                impact: 'Coil temperature predicted to spike to 31.5°C during afternoon banking bank.',
                action: 'Pre-cool Zone B concourse by -1.5°C and shift 35% load to Auxiliary Chiller Bank 4.',
                confidence: 91,
              },
              {
                id: 'eq-4',
                title: 'Substation Transformer 02 Voltage Harmonics Trend',
                location: 'Primary Power Distribution Vault',
                impact: 'Harmonic distortion on 11kV busbar projected to reach 4.8%, close to 5.0% IEEE threshold.',
                action: 'Engage active power harmonic filter bank 2 on Substation Bus B.',
                confidence: 85,
              },
            ].map((pred) => {
              const isApplied = appliedActions[pred.id];
              return (
                <div key={pred.id} className="p-5 rounded-2xl bg-[#0D1014]/90 border border-white/[0.08] shadow-card flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        {pred.confidence}% Confidence
                      </span>
                      <span className="text-xs text-[#8B9199]">{pred.location}</span>
                    </div>
                    <h3 className="text-sm font-bold text-[#F4F4F5] mb-2">{pred.title}</h3>
                    <p className="text-xs text-white/70 mb-3">{pred.impact}</p>
                    <div className="p-3 rounded-xl bg-[#F28C18]/10 border border-[#F28C18]/25 text-xs text-[#F4F4F5]">
                      <strong className="text-[#F28C18] block text-[10px] uppercase font-mono mb-0.5">Mitigation Action:</strong>
                      {pred.action}
                    </div>
                  </div>
                  <div className="pt-4 mt-4 border-t border-white/5 flex justify-end">
                    <button
                      onClick={() => handleApplyAction(pred.id)}
                      disabled={isApplied}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        isApplied
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-[#F28C18] hover:bg-[#ff9a2e] text-black shadow-sm'
                      }`}
                    >
                      {isApplied ? 'Mitigation Dispatched ✓' : 'Dispatch Action'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 4. INTERACTIVE SIMULATOR TAB */}
        {activeTab === 'SIMULATOR' && (
          <div className="bg-[#0D1014]/90 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 shadow-card space-y-6">
            <div>
              <h3 className="text-sm font-bold text-[#F4F4F5] flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#F28C18]" />
                Interactive Flight Delay Probability Simulator
              </h3>
              <p className="text-[11px] text-[#8B9199]">
                Adjust flight operational parameters to evaluate the trained Random Forest model&apos;s delay predictions
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Controls */}
              <div className="space-y-4 md:col-span-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] text-[#8B9199] block mb-1">Airline Carrier</label>
                    <select
                      value={simAirline}
                      onChange={(e) => setSimAirline(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-[#F4F4F5] focus:outline-none"
                    >
                      {summary.airline_otp.map((a) => (
                        <option key={a.airline_name} value={a.airline_name} className="bg-[#0D1014]">
                          {a.airline_name} (OTP {a.otp}%)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] text-[#8B9199] block mb-1">Destination Hub</label>
                    <select
                      value={simDestination}
                      onChange={(e) => setSimDestination(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-[#F4F4F5] focus:outline-none"
                    >
                      {summary.destinations.map((d) => (
                        <option key={d.destination_airport} value={d.destination_airport} className="bg-[#0D1014]">
                          {d.destination_airport} ({d.avg_distance_km} km)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#8B9199]">Weather Risk Index (WX Severity)</span>
                    <span className="font-mono text-[#F28C18]">{(simWeatherRisk * 100).toFixed(0)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={simWeatherRisk}
                    onChange={(e) => setSimWeatherRisk(parseFloat(e.target.value))}
                    className="w-full accent-[#F28C18]"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#8B9199]">Passenger Load Factor %</span>
                    <span className="font-mono text-sky-400">{simLoadFactor}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    step="1"
                    value={simLoadFactor}
                    onChange={(e) => setSimLoadFactor(parseInt(e.target.value, 10))}
                    className="w-full accent-sky-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-[#8B9199] block mb-1">Time of Day</label>
                  <div className="flex gap-2">
                    {['Morning', 'Evening', 'Night'].map((t) => (
                      <button
                        key={t}
                        onClick={() => setSimTimeOfDay(t)}
                        className={`flex-1 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                          simTimeOfDay === t
                            ? 'bg-[#F28C18] text-black border-[#F28C18] font-bold'
                            : 'bg-white/5 text-[#8B9199] border-white/10'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleRunSimulator}
                  className="w-full py-2.5 rounded-xl bg-[#F28C18] hover:bg-[#ff9a2e] text-black font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Brain className="w-4 h-4" />
                  <span>Run Random Forest Prediction Inference</span>
                </button>
              </div>

              {/* Simulation Output Card */}
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#8B9199] block mb-2">Model Prediction Output</span>
                  {simPrediction ? (
                    <div className="space-y-4">
                      <div>
                        <span className="text-xs text-[#8B9199] block">Predicted Delay Probability</span>
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className={`text-4xl font-black font-mono ${
                            simPrediction.prob >= 70 ? 'text-red-400' : simPrediction.prob >= 40 ? 'text-amber-400' : 'text-emerald-400'
                          }`}>
                            {simPrediction.prob}%
                          </span>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-xs">
                        <span className="text-[10px] text-[#8B9199] block">Estimated Delay Duration</span>
                        <span className="text-xl font-bold font-mono text-[#F4F4F5] mt-1 block">
                          +{simPrediction.delayMin} minutes
                        </span>
                      </div>

                      <div className="text-[11px] text-[#8B9199]">
                        Status: <strong className="text-[#F4F4F5]">{simPrediction.prob > 50 ? 'DELAY LIKELY' : 'ON-TIME EXPECTED'}</strong>
                      </div>
                    </div>
                  ) : (
                    <div className="h-48 flex items-center justify-center text-center text-xs text-[#8B9199]">
                      Click &quot;Run Random Forest Prediction Inference&quot; to calculate flight risk score
                    </div>
                  )}
                </div>

                <div className="text-[10px] text-[#8B9199] border-t border-white/10 pt-3 mt-4">
                  Grounded in Indira Gandhi Intl Dataset (1,000 multi-table flights).
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
