'use client';

import React, { useState } from 'react';
import {
  Zap,
  X,
  AlertTriangle,
  RotateCcw,
  Sliders,
  Users,
  HeartPulse,
  Package,
  CheckCircle2,
  Activity,
  Play,
  Flame,
  ArrowRight,
} from 'lucide-react';
import { useTwinStore } from '@/lib/twin/twinStateStore';
import { ScenarioType, ScenarioSeverity } from '@/types/scenario';

export function ScenarioControlDrawer() {
  const {
    activeScenarios,
    isScenarioDrawerOpen,
    setScenarioDrawerOpen,
    triggerConveyorScenario,
    triggerCrowdScenario,
    triggerMedicalScenario,
    resolveScenario,
    resetAllScenarios,
    focusEntity,
  } = useTwinStore();

  const [activeTab, setActiveTab] = useState<ScenarioType>('CONVEYOR_FAILURE');

  // Conveyor form state
  const [conveyorTerminal, setConveyorTerminal] = useState('terminal-b');
  const [conveyorAsset, setConveyorAsset] = useState('b-17');
  const [conveyorSeverity, setConveyorSeverity] = useState(85);
  const [conveyorFailureMode, setConveyorFailureMode] = useState<'Degraded' | 'Intermittent' | 'Offline'>('Offline');

  // Crowd form state
  const [crowdTerminal, setCrowdTerminal] = useState('terminal-b');
  const [crowdLocation, setCrowdLocation] = useState('Security Checkpoint (Zone 2)');
  const [crowdCount, setCrowdCount] = useState(12000);
  const [crowdSeverity, setCrowdSeverity] = useState<ScenarioSeverity>('CRITICAL');

  // Medical form state
  const [medTerminal, setMedTerminal] = useState('terminal-b');
  const [medLocation, setMedLocation] = useState('Gate B14 Boarding Corridor');
  const [medCases, setMedCases] = useState(1);
  const [medSeverity, setMedSeverity] = useState<ScenarioSeverity>('CRITICAL');

  if (!isScenarioDrawerOpen) return null;

  const handleTriggerConveyor = (e: React.FormEvent) => {
    e.preventDefault();
    triggerConveyorScenario({
      terminalId: conveyorTerminal,
      assetId: conveyorAsset,
      severityPercent: conveyorSeverity,
      failureMode: conveyorFailureMode,
    });
  };

  const handleTriggerCrowd = (e: React.FormEvent) => {
    e.preventDefault();
    triggerCrowdScenario({
      terminalId: crowdTerminal,
      location: crowdLocation,
      passengerCount: crowdCount,
      severity: crowdSeverity,
    });
  };

  const handleTriggerMedical = (e: React.FormEvent) => {
    e.preventDefault();
    triggerMedicalScenario({
      terminalId: medTerminal,
      location: medLocation,
      casesCount: medCases,
      severity: medSeverity,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm pointer-events-auto animate-in fade-in duration-200">
      <div className="w-full max-w-lg h-full bg-[#0D1014] border-l border-white/[0.12] flex flex-col shadow-2xl animate-in slide-in-from-right duration-250">
        {/* Drawer Header */}
        <div className="p-5 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Zap className="w-5 h-5 fill-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">Scenario Control</h2>
                {activeScenarios.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-[10px] text-amber-300 font-bold animate-pulse">
                    {activeScenarios.length} ACTIVE
                  </span>
                )}
              </div>
              <p className="text-xs text-[#8B9199]">Introduce simulated operational stress events</p>
            </div>
          </div>
          <button
            onClick={() => setScenarioDrawerOpen(false)}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#8B9199] hover:text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin scrollbar-thumb-white/10">
          {/* Active Scenarios List (If any) */}
          {activeScenarios.length > 0 && (
            <div className="space-y-2.5 p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5 uppercase tracking-wider">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  Active Simulations ({activeScenarios.length})
                </span>
                <button
                  onClick={() => resetAllScenarios()}
                  className="text-[11px] text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset All
                </button>
              </div>

              <div className="space-y-2">
                {activeScenarios.map((scen) => (
                  <div
                    key={scen.id}
                    className="p-3 rounded-xl bg-[#13171F] border border-white/[0.08] flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white truncate">{scen.title}</span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                            scen.severity === 'CRITICAL'
                              ? 'bg-rose-500/20 text-rose-400'
                              : 'bg-amber-500/20 text-amber-400'
                          }`}
                        >
                          {scen.severity}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#8B9199] truncate">{scen.operationalImpact}</p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => focusEntity(scen.terminalId, scen.locationCoords)}
                        title="Locate in 3D Twin"
                        className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 text-[10px] font-medium transition-all cursor-pointer"
                      >
                        Locate
                      </button>
                      <button
                        onClick={() => resolveScenario(scen.id)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[10px] font-bold transition-all cursor-pointer"
                      >
                        Resolve
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Event Category Selector Tabs */}
          <div className="grid grid-cols-3 gap-2 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <button
              onClick={() => setActiveTab('CONVEYOR_FAILURE')}
              className={`py-2 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'CONVEYOR_FAILURE'
                  ? 'bg-white/10 text-white shadow-sm'
                  : 'text-[#8B9199] hover:text-white'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Conveyor</span>
            </button>
            <button
              onClick={() => setActiveTab('CROWD_SURGE')}
              className={`py-2 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'CROWD_SURGE'
                  ? 'bg-white/10 text-white shadow-sm'
                  : 'text-[#8B9199] hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Crowd Surge</span>
            </button>
            <button
              onClick={() => setActiveTab('MEDICAL_EMERGENCY')}
              className={`py-2 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'MEDICAL_EMERGENCY'
                  ? 'bg-white/10 text-white shadow-sm'
                  : 'text-[#8B9199] hover:text-white'
              }`}
            >
              <HeartPulse className="w-3.5 h-3.5" />
              <span>Medical</span>
            </button>
          </div>

          {/* Tab 1: Baggage Conveyor Failure Form */}
          {activeTab === 'CONVEYOR_FAILURE' && (
            <form onSubmit={handleTriggerConveyor} className="space-y-4">
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs text-[#8B9199]">
                Simulate mechanical motor failure, belt stall, or sensor disconnection along primary sortation loops.
              </div>

              {/* Terminal Select */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/90">Select Terminal</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'terminal-a', label: 'Terminal 1 (A)' },
                    { id: 'terminal-b', label: 'Terminal 2 (B)' },
                    { id: 'terminal-c', label: 'Terminal 3 (C)' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        setConveyorTerminal(t.id);
                        if (t.id === 'terminal-a') setConveyorAsset('baggage-03');
                        if (t.id === 'terminal-b') setConveyorAsset('b-17');
                        if (t.id === 'terminal-c') setConveyorAsset('b-21');
                      }}
                      className={`py-2 px-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                        conveyorTerminal === t.id
                          ? 'bg-amber-500/15 border-amber-500/50 text-amber-200'
                          : 'bg-white/[0.02] border-white/[0.08] text-[#8B9199] hover:text-white'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Asset Select */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/90">Target Conveyor Asset</label>
                <select
                  value={conveyorAsset}
                  onChange={(e) => setConveyorAsset(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#13171F] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="b-17">Baggage Infeed Conveyor B-17 (Terminal B Concourse)</option>
                  <option value="baggage-03">Carousel Belt 03 (Terminal A Reclaim)</option>
                  <option value="b-21">Main Sortation Loop B-21 (Terminal C Vault)</option>
                </select>
              </div>

              {/* Severity Slider */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white/90">Failure Severity</span>
                  <span className="font-mono font-bold text-amber-400">{conveyorSeverity}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  step="5"
                  value={conveyorSeverity}
                  onChange={(e) => setConveyorSeverity(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              {/* Failure Mode */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/90">Failure Mode</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Degraded', 'Intermittent', 'Offline'] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setConveyorFailureMode(mode)}
                      className={`py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                        conveyorFailureMode === mode
                          ? 'bg-rose-500/20 border-rose-500 text-rose-300 font-bold'
                          : 'bg-white/[0.02] border-white/[0.08] text-[#8B9199] hover:text-white'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Trigger Button */}
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs shadow-lg shadow-amber-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>TRIGGER CONVEYOR SCENARIO</span>
              </button>
            </form>
          )}

          {/* Tab 2: Crowd Surge Form */}
          {activeTab === 'CROWD_SURGE' && (
            <form onSubmit={handleTriggerCrowd} className="space-y-4">
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs text-[#8B9199]">
                Inject massive influx of arriving or departing passengers, stressing checkpoint lanes and baggage belts.
              </div>

              {/* Terminal Select */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/90">Select Terminal</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'terminal-a', label: 'Terminal 1' },
                    { id: 'terminal-b', label: 'Terminal 2 (B)' },
                    { id: 'terminal-c', label: 'Terminal 3' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setCrowdTerminal(t.id)}
                      className={`py-2 px-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                        crowdTerminal === t.id
                          ? 'bg-rose-500/15 border-rose-500/50 text-rose-200'
                          : 'bg-white/[0.02] border-white/[0.08] text-[#8B9199] hover:text-white'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/90">Location Zone</label>
                <select
                  value={crowdLocation}
                  onChange={(e) => setCrowdLocation(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#13171F] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-rose-500"
                >
                  <option value="Security Checkpoint (Zone 2)">Security Checkpoint (Zone 2)</option>
                  <option value="Main Departure Concourse">Main Departure Concourse</option>
                  <option value="Check-In Hall Islands 32/33">Check-In Hall Islands 32/33</option>
                  <option value="Gate B14 Holding Area">Gate B14 Holding Area</option>
                </select>
              </div>

              {/* Passenger Count */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white/90">Simulated Surge Volume</span>
                  <span className="font-mono font-bold text-rose-400">
                    {crowdCount.toLocaleString()} pax (120% capacity)
                  </span>
                </div>
                <input
                  type="range"
                  min="6000"
                  max="16000"
                  step="500"
                  value={crowdCount}
                  onChange={(e) => setCrowdCount(Number(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
              </div>

              {/* Severity */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/90">Severity</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['MEDIUM', 'HIGH', 'CRITICAL'] as const).map((sev) => (
                    <button
                      key={sev}
                      type="button"
                      onClick={() => setCrowdSeverity(sev)}
                      className={`py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                        crowdSeverity === sev
                          ? 'bg-rose-500/20 border-rose-500 text-rose-300 font-bold'
                          : 'bg-white/[0.02] border-white/[0.08] text-[#8B9199] hover:text-white'
                      }`}
                    >
                      {sev}
                    </button>
                  ))}
                </div>
              </div>

              {/* Trigger Button */}
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Users className="w-4 h-4" />
                <span>TRIGGER CROWD SURGE</span>
              </button>
            </form>
          )}

          {/* Tab 3: Medical Emergency Form */}
          {activeTab === 'MEDICAL_EMERGENCY' && (
            <form onSubmit={handleTriggerMedical} className="space-y-4">
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs text-[#8B9199]">
                Trigger acute medical emergency requiring rapid response paramedical triage and aerobridge corridor clearance.
              </div>

              {/* Terminal Select */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/90">Select Terminal</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'terminal-a', label: 'Terminal 1' },
                    { id: 'terminal-b', label: 'Terminal 2 (B)' },
                    { id: 'terminal-c', label: 'Terminal 3' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setMedTerminal(t.id)}
                      className={`py-2 px-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                        medTerminal === t.id
                          ? 'bg-red-500/15 border-red-500/50 text-red-200'
                          : 'bg-white/[0.02] border-white/[0.08] text-[#8B9199] hover:text-white'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/90">Location</label>
                <select
                  value={medLocation}
                  onChange={(e) => setMedLocation(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#13171F] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-red-500"
                >
                  <option value="Gate B14 Boarding Corridor">Gate B14 Boarding Corridor</option>
                  <option value="Departure Hall Level 2">Departure Hall Level 2</option>
                  <option value="Security Checkpoint Screening Lane 4">Security Checkpoint Screening Lane 4</option>
                </select>
              </div>

              {/* Number of Cases */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/90">Number of Cases</label>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setMedCases(n)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        medCases === n
                          ? 'bg-red-600/30 border-red-500 text-white font-bold'
                          : 'bg-white/[0.02] border-white/[0.08] text-[#8B9199] hover:text-white'
                      }`}
                    >
                      {n} {n === 1 ? 'Patient' : 'Patients'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Trigger Button */}
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-bold text-xs shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <HeartPulse className="w-4 h-4" />
                <span>TRIGGER MEDICAL EMERGENCY</span>
              </button>
            </form>
          )}

          {/* Reset All Simulations Button */}
          <div className="pt-4 border-t border-white/[0.08]">
            <button
              onClick={() => resetAllScenarios()}
              className="w-full py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-xs font-semibold text-rose-300 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>RESET ALL ACTIVE SIMULATIONS</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
