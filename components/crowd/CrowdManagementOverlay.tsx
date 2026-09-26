'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  Shield,
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Zap,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Compass,
  Sparkles,
  ChevronRight,
  X,
  FileText,
  Sliders,
  Eye,
  SlidersHorizontal,
} from 'lucide-react';
import { useTwinStore } from '@/lib/twin/twinStateStore';
import { CROWD_TIMELINE_SNAPSHOTS } from '@/lib/crowd/crowdData';
import { CrowdZone, CrowdZoneStatus } from '@/types/crowd';

export function CrowdManagementOverlay() {
  const {
    isCrowdMode,
    setCrowdMode,
    selectedCrowdTerminal,
    setSelectedCrowdTerminal,
    selectedCrowdZoneId,
    setSelectedCrowdZoneId,
    crowdTerminals,
    crowdTimelineIndex,
    setCrowdTimelineIndex,
    isCrowdPlayback,
    setIsCrowdPlayback,
    crowdAuditTrail,
    executeCrowdLaneOpen,
    executeCrowdRedirectFlow,
    executeCrowdStaffAllocation,
    createCrowdIncident,
    setCopilotOpen,
    setScenarioDrawerOpen,
    activeScenarios,
    focusEntity,
  } = useTwinStore();

  const [actionSuccessNotice, setActionSuccessNotice] = useState<string | null>(null);
  const [aiActionApplied, setAiActionApplied] = useState(false);

  // Playback timer for auto-advancing timeline
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isCrowdPlayback) {
      interval = setInterval(() => {
        const next = (crowdTimelineIndex + 1) % CROWD_TIMELINE_SNAPSHOTS.length;
        setCrowdTimelineIndex(next);
      }, 3500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCrowdPlayback, crowdTimelineIndex, setCrowdTimelineIndex]);

  // Hide success notice after 5s
  useEffect(() => {
    if (actionSuccessNotice) {
      const timer = setTimeout(() => setActionSuccessNotice(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [actionSuccessNotice]);

  const currentTerminalState = crowdTerminals[selectedCrowdTerminal] || crowdTerminals['terminal-b'];
  const activeZone: CrowdZone | undefined = currentTerminalState.zones.find(
    (z) => z.id === (selectedCrowdZoneId || 'sec-zone-2')
  );

  const currentTimeline = CROWD_TIMELINE_SNAPSHOTS[crowdTimelineIndex] || CROWD_TIMELINE_SNAPSHOTS[5];

  const getStatusColor = (status: CrowdZoneStatus) => {
    switch (status) {
      case 'CRITICAL':
        return {
          bg: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
          badge: 'bg-rose-500 text-white font-bold',
          dot: 'bg-rose-500 animate-ping',
          bar: 'bg-rose-500',
        };
      case 'ATTENTION':
        return {
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
          badge: 'bg-amber-500 text-black font-bold',
          dot: 'bg-amber-500',
          bar: 'bg-amber-500',
        };
      default:
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
          badge: 'bg-emerald-500 text-white font-bold',
          dot: 'bg-emerald-500',
          bar: 'bg-emerald-500',
        };
    }
  };

  const handleApply2Lanes = () => {
    executeCrowdLaneOpen('sec-zone-2', 2);
    setAiActionApplied(true);
    setActionSuccessNotice('✓ Applied: Security Lanes 7 & 8 opened. Queue clearing at +26 pax/min net.');
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between pointer-events-none select-none p-4 overflow-hidden">
      {/* ===================================================================== */}
      {/* 1. THIN TOP BAR: TITLE, TERMINAL TABS, SCENARIO CONTROL & COPILOT     */}
      {/* ===================================================================== */}
      <header className="pointer-events-auto flex items-center justify-between gap-3 flex-wrap z-30">
        {/* Brand & Mode Label */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/"
            onClick={() => setCrowdMode(false)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0D1014]/90 hover:bg-[#151A21] backdrop-blur-xl border border-white/[0.08] hover:border-white/20 text-xs font-semibold text-[#F4F4F5] transition-all shadow-card group"
          >
            <Compass className="w-3.5 h-3.5 text-[#8B9199] group-hover:text-sky-400 transition-colors" />
            <span>Campus Twin</span>
          </Link>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0D1014]/90 backdrop-blur-xl border border-white/[0.08] text-xs shadow-card">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span className="font-bold text-white tracking-tight flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-rose-400" />
              TwinOS™ Crowd Operations Twin
            </span>
          </div>
        </div>

        {/* 4 Terminal Tabs with Occupancy Badges */}
        <div className="flex items-center gap-1.5 p-1 bg-[#0D1014]/90 backdrop-blur-xl border border-white/[0.08] rounded-xl shadow-card text-xs">
          {[
            { id: 'terminal-a', label: 'Terminal A', occupancy: 58, status: 'NORMAL' },
            { id: 'terminal-b', label: 'Terminal B', occupancy: currentTerminalState.occupancyPercent, status: currentTerminalState.status, isAlert: currentTerminalState.status === 'CRITICAL' },
            { id: 'terminal-c', label: 'Terminal C', occupancy: 64, status: 'NORMAL' },
            { id: 'terminal-d', label: 'Terminal D', occupancy: 42, status: 'NORMAL' },
          ].map((term) => {
            const isSelected = selectedCrowdTerminal === term.id;
            return (
              <button
                key={term.id}
                onClick={() => {
                  setSelectedCrowdTerminal(term.id);
                  if (term.id === 'terminal-b') {
                    focusEntity('terminal-b', [-2, 0.4, 4]);
                  }
                }}
                className={`relative px-3 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer text-xs ${
                  isSelected
                    ? 'bg-white/15 text-white shadow-sm border border-white/20'
                    : 'text-[#8B9199] hover:text-[#F4F4F5] hover:bg-white/5 border border-transparent'
                }`}
              >
                <span>{term.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                    term.status === 'CRITICAL'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : term.status === 'ATTENTION'
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-emerald-500/20 text-emerald-400'
                  }`}
                >
                  {term.occupancy}%
                </span>
                {term.isAlert && (
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping absolute -top-0.5 -right-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* Right Utility Controls: Reset View, Scenario Control & Copilot */}
        <div className="flex items-center gap-2">
          {/* Live indicator badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>LIVE • 8,420 pax/hr</span>
          </div>

          {/* Reset View Button */}
          <button
            onClick={() => focusEntity('terminal-b', [-2, 0.4, 4])}
            title="Reset 3D Camera View"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0D1014]/90 backdrop-blur-xl border border-white/[0.08] hover:border-white/20 text-xs font-semibold text-[#8B9199] hover:text-white transition-all cursor-pointer shadow-card"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset View</span>
          </button>

          {/* Scenario Control Button */}
          <button
            onClick={() => setScenarioDrawerOpen(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-card ${
              activeScenarios.length > 0
                ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)] animate-pulse'
                : 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30 text-amber-300 hover:border-amber-400'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Scenario Control</span>
            {activeScenarios.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-black text-[9px] font-extrabold">
                {activeScenarios.length}
              </span>
            )}
          </button>

          {/* AI Copilot Button */}
          <button
            onClick={() => setCopilotOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/30 hover:border-orange-500/60 text-xs font-semibold text-orange-300 transition-all cursor-pointer shadow-card"
          >
            <Sparkles className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
            <span className="hidden md:inline">AI Copilot</span>
          </button>
        </div>
      </header>

      {/* Floating Success Notification Toast */}
      {actionSuccessNotice && (
        <div className="pointer-events-auto absolute top-16 left-1/2 -translate-x-1/2 z-40 px-4 py-2 rounded-2xl bg-emerald-950/95 border border-emerald-500/50 text-emerald-200 text-xs font-semibold flex items-center gap-2 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionSuccessNotice}</span>
          <button onClick={() => setActionSuccessNotice(null)} className="ml-2 text-white/60 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 2. COMPACT SLIDE-OVER ZONE INSPECTOR (SHOWN ON ZONE CLICK)            */}
      {/* ===================================================================== */}
      {selectedCrowdZoneId && activeZone && (
        <div className="pointer-events-auto absolute right-6 top-18 z-40 w-96 max-h-[calc(100vh-160px)] overflow-y-auto p-4 rounded-2xl bg-[#0D1014]/95 backdrop-blur-2xl border border-white/[0.1] shadow-2xl flex flex-col gap-3.5 animate-in slide-in-from-right duration-200 scrollbar-thin scrollbar-thumb-white/10">
          {/* Header */}
          <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-white/[0.08]">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#8B9199]">
                {activeZone.category} • {currentTerminalState.terminalName}
              </span>
              <h2 className="text-sm font-bold text-white mt-0.5">{activeZone.name}</h2>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
                  getStatusColor(activeZone.status).badge
                }`}
              >
                {activeZone.status}
              </span>
              <button
                onClick={() => setSelectedCrowdZoneId(null)}
                className="w-6 h-6 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#8B9199] hover:text-white transition-all cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Core Metrics Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex flex-col gap-1">
              <span className="text-[10px] text-[#8B9199]">Occupancy Level</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-base font-bold text-white font-mono">{activeZone.occupancy}</span>
                <span className="text-[10px] text-[#8B9199]">/ {activeZone.capacity} pax</span>
              </div>
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mt-0.5">
                <div
                  className={`h-full rounded-full ${getStatusColor(activeZone.status).bar}`}
                  style={{ width: `${Math.min(100, activeZone.densityPercent)}%` }}
                />
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex flex-col gap-1">
              <span className="text-[10px] text-[#8B9199]">Estimated Queue Wait</span>
              <div className="flex items-baseline gap-1.5">
                <span
                  className={`text-base font-bold font-mono ${
                    activeZone.estimatedWaitMin > 12 ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                >
                  {activeZone.estimatedWaitMin} min
                </span>
              </div>
              <span className="text-[10px] text-[#8B9199]">
                {activeZone.queueLength > 0 ? `${activeZone.queueLength} in physical queue` : 'Free flow'}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex flex-col gap-1">
              <span className="text-[10px] text-[#8B9199]">Screening Lanes</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-base font-bold text-white font-mono">
                  {activeZone.openLanes || 6} / {activeZone.totalLanes || 8}
                </span>
                <span className="text-[10px] text-emerald-400 font-medium">Active</span>
              </div>
              <span className="text-[10px] text-[#8B9199]">Throughput: {activeZone.outgoingFlow} pax/m</span>
            </div>

            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex flex-col gap-1">
              <span className="text-[10px] text-[#8B9199]">Crowd Pressure</span>
              <div className="flex items-baseline gap-1.5">
                <span
                  className={`text-base font-bold font-mono ${
                    activeZone.pressureScore > 80
                      ? 'text-rose-400'
                      : activeZone.pressureScore > 60
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {activeZone.pressureScore}
                </span>
                <span className="text-[10px] text-[#8B9199]">/ 100</span>
              </div>
              <span className="text-[10px] text-[#8B9199]">
                {activeZone.pressureScore > 80 ? 'Severe Constraint' : 'Manageable Flow'}
              </span>
            </div>
          </div>

          {/* Bottleneck Indicator */}
          <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/30 flex items-center justify-between text-xs">
            <div className="space-y-0.5">
              <span className="text-[10px] text-rose-300 font-bold uppercase tracking-wider flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-rose-400" />
                Bottleneck Dynamics
              </span>
              <p className="text-[11px] text-[#8B9199]">
                Inflow ({activeZone.incomingFlow}/m) {activeZone.incomingFlow > activeZone.outgoingFlow ? '>' : '<'}{' '}
                Throughput ({activeZone.outgoingFlow}/m)
              </p>
            </div>
            <div className="text-right">
              <span
                className={`font-mono font-bold text-xs ${
                  activeZone.netFlow > 0 ? 'text-rose-400' : 'text-emerald-400'
                }`}
              >
                {activeZone.netFlow > 0 ? `+${activeZone.netFlow}` : activeZone.netFlow} pax/min
              </span>
              <p className="text-[9px] text-[#8B9199]">
                {activeZone.netFlow > 0 ? 'Queue accumulating' : 'Queue clearing'}
              </p>
            </div>
          </div>

          {/* Fast Human-in-the-Loop Actions */}
          <div className="space-y-2 pt-1 border-t border-white/[0.08]">
            <span className="text-[10px] font-bold text-white/80 uppercase tracking-wider">
              Operational Intervention Actions
            </span>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  executeCrowdLaneOpen(activeZone.id, 1);
                  setActionSuccessNotice(`Lane ${(activeZone.openLanes || 6) + 1} opened. Throughput +26 pax/min.`);
                }}
                className="py-2 px-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] hover:border-white/20 text-xs font-semibold text-white transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-sky-400" />
                <span>+1 Lane</span>
              </button>

              <button
                onClick={() => handleApply2Lanes()}
                className="py-2 px-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-xs font-bold text-white shadow-lg shadow-emerald-600/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>+2 Lanes (Rec)</span>
              </button>
            </div>

            <button
              onClick={() => {
                executeCrowdRedirectFlow(activeZone.id, 'checkin-33');
                setActionSuccessNotice('Passenger flow diverted to Secondary Concourse route.');
              }}
              className="w-full py-2 px-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] text-xs font-medium text-white/80 hover:text-white transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              <span>Redirect 30% Flow to Secondary Island</span>
            </button>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 3. UNOBTRUSIVE AI RECOMMENDATION CARD (BOTTOM-RIGHT CORNER)           */}
      {/* ===================================================================== */}
      <div className="pointer-events-auto absolute right-6 bottom-16 z-30 w-88 p-3.5 rounded-2xl bg-[#0D1014]/94 backdrop-blur-2xl border border-amber-500/40 shadow-2xl flex flex-col gap-2.5 animate-in fade-in slide-in-from-bottom-3 duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            </div>
            <span className="text-xs font-bold text-amber-200">AI Crowd Advisory • Zone 2</span>
          </div>
          <span className="text-[10px] font-mono text-amber-400/80 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
            94% Confidence
          </span>
        </div>

        <p className="text-[11px] text-[#A1A7B1] leading-relaxed">
          {aiActionApplied
            ? '✓ Security Lanes 7 & 8 opened. Screening throughput increased to 118 pax/min. Queue reduced from 184 to 120 pax.'
            : 'Inflow (+124/min) exceeds screening capacity (92/min). Queue at 184 pax with 14.2 min wait. Recommend opening 2 additional screening lanes.'}
        </p>

        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => setSelectedCrowdZoneId('sec-zone-2')}
            className="flex-1 py-1.5 px-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-xs font-semibold text-white/90 hover:text-white transition-all cursor-pointer text-center"
          >
            Review
          </button>
          {!aiActionApplied ? (
            <button
              onClick={() => handleApply2Lanes()}
              className="flex-1 py-1.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-xs font-bold text-black transition-all cursor-pointer shadow-md text-center"
            >
              Apply Action
            </button>
          ) : (
            <div className="flex-1 py-1.5 px-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-xs font-bold text-emerald-300 text-center flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Applied</span>
            </div>
          )}
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 4. THIN BOTTOM BAR: LIVE FLOW STATS & COMPACT TIMELINE SCRUBBER       */}
      {/* ===================================================================== */}
      <footer className="pointer-events-auto flex items-center justify-between gap-4 flex-wrap z-30">
        {/* Left Live Flow Metrics */}
        <div className="flex items-center gap-3 px-3.5 py-1.5 rounded-xl bg-[#0D1014]/90 backdrop-blur-xl border border-white/[0.08] text-xs shadow-card">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[#8B9199]">
            Passenger Flow: <strong className="text-white">8,420 pax/hr</strong>
          </span>
          <span className="text-white/20">•</span>
          <span className="text-[#8B9199]">
            Active Hotspots: <strong className="text-rose-400">1 (Security Zone 2)</strong>
          </span>
          <span className="text-white/20 hidden sm:inline">•</span>
          <span className="text-[#8B9199] hidden sm:inline">
            Network: <strong className="text-emerald-400">Operational</strong>
          </span>
        </div>

        {/* Center Compact Timeline Scrubber */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0D1014]/90 backdrop-blur-xl border border-white/[0.08] shadow-card text-xs">
          <button
            onClick={() => setIsCrowdPlayback(!isCrowdPlayback)}
            title={isCrowdPlayback ? 'Pause Timeline' : 'Auto Play Simulation'}
            className="w-6 h-6 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all cursor-pointer mr-1"
          >
            {isCrowdPlayback ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 ml-0.5" />}
          </button>

          {CROWD_TIMELINE_SNAPSHOTS.map((snap, idx) => {
            const isSelected = idx === crowdTimelineIndex;
            return (
              <button
                key={snap.timeLabel}
                onClick={() => setCrowdTimelineIndex(idx)}
                className={`px-2 py-0.5 rounded-md text-[11px] font-mono font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500 text-black font-bold shadow-sm'
                    : 'text-[#8B9199] hover:text-white hover:bg-white/5'
                }`}
              >
                {snap.timeLabel}
              </button>
            );
          })}
        </div>

        {/* Right Active Simulation indicator (if any) */}
        {activeScenarios.length > 0 && (
          <button
            onClick={() => setScenarioDrawerOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500 text-amber-200 text-xs font-bold animate-pulse cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 fill-amber-400" />
            <span>SIMULATION ACTIVE ({activeScenarios.length})</span>
          </button>
        )}
      </footer>
    </div>
  );
}
