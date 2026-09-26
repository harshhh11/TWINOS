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
  Compass,
  Sparkles,
  X,
  FileText,
  SlidersHorizontal,
  Layers,
  Plane,
  Eye,
  UserCheck,
  Check,
  HelpCircle,
} from 'lucide-react';
import { useTwinStore } from '@/lib/twin/twinStateStore';
import { CROWD_TIMELINE_SNAPSHOTS, calculateCrowdPressureScore } from '@/lib/crowd/crowdData';
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
    isFlowRedirected,
    isLayerPassengers,
    isLayerHeatmap,
    isLayerAircraft,
    toggleCrowdLayer,
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
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [aiActionApplied, setAiActionApplied] = useState(false);

  // Pending action state for the confirmation modal
  const [pendingAction, setPendingAction] = useState<{
    title: string;
    targetZone: string;
    terminalName: string;
    rationale: string;
    projectedImpact: string;
    execute: () => void;
  } | null>(null);

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
    (z) => z.id === selectedCrowdZoneId
  ) || currentTerminalState.zones[0];

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
          dot: 'bg-amber-400',
          bar: 'bg-amber-500',
        };
      default:
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
          badge: 'bg-emerald-500 text-white font-bold',
          dot: 'bg-emerald-400',
          bar: 'bg-emerald-500',
        };
    }
  };

  // Deterministic pressure breakdown
  const pressureBreakdown = activeZone ? calculateCrowdPressureScore(activeZone) : null;

  // Open review confirmation modal
  const handleReviewAction = () => {
    if (selectedCrowdTerminal === 'terminal-b') {
      setPendingAction({
        title: 'Open Additional Security Screening Lanes 7 & 8',
        targetZone: 'Security Checkpoint Zone 2',
        terminalName: 'Terminal B (International Wing)',
        rationale: 'Inflow (+124/m) exceeds screening throughput (-92/m). Current queue is 184 passengers (+16% / 10 min surge).',
        projectedImpact: 'Screening lanes active: 6 → 8 (+33% capacity). Throughput: 92 → 118 pax/min. Queue reduced from 184 to ~120 passengers within 6 minutes. Wait time SLA drops from 17 min to 6.5 min.',
        execute: () => {
          executeCrowdLaneOpen('sec-zone-2', 2);
          setAiActionApplied(true);
          setActionSuccessNotice('✓ Action Approved: Security Lanes 7 & 8 opened in Terminal B.');
        },
      });
    } else if (selectedCrowdTerminal === 'terminal-c') {
      setPendingAction({
        title: 'Redirect 25% Ingress Flow from Checkpoint C-East to Checkpoint C-West',
        targetZone: 'Terminal C Screening Concourse',
        terminalName: 'Terminal C (Regional North)',
        rationale: 'Checkpoint C-East is congested (88 pax queue, +28/m net accumulation) while Checkpoint C-West has surplus capacity (16 queue, 3 min wait).',
        projectedImpact: 'Transfers 25 pax/min from C-East to C-West. C-East queue drops from 88 to 38 pax. Both checkpoints normalize within 5 min SLA.',
        execute: () => {
          executeCrowdRedirectFlow('sec-zone-c2', 'sec-zone-c1');
          setAiActionApplied(true);
          setActionSuccessNotice('✓ Action Approved: Flow redirected to Checkpoint C-West.');
        },
      });
    } else if (selectedCrowdTerminal === 'terminal-d') {
      setPendingAction({
        title: 'Stage Additional Floor Marshals at Screening Gate D',
        targetZone: 'Terminal D Screening Gate',
        terminalName: 'Terminal D (General & Charter)',
        rationale: 'Charter group arrival creating temporary queue spike (58 pax, 9m wait).',
        projectedImpact: 'Stages 4 customer marshals to streamline pre-security stanchions. Prevents queue from breaching 10-minute SLA.',
        execute: () => {
          executeCrowdStaffAllocation('sec-zone-d', 4);
          setAiActionApplied(true);
          setActionSuccessNotice('✓ Action Approved: 4 Floor Marshals deployed to Terminal D.');
        },
      });
    } else {
      setPendingAction({
        title: 'Terminal A Routine Concourse Flow Sweep',
        targetZone: 'Concourse A & Central Security',
        terminalName: 'Terminal A (Domestic Core)',
        rationale: 'Operations nominal. Re-verify automated turnstile sensors.',
        projectedImpact: 'Zero operational disruption. Maintains 3.8 min average passenger transit.',
        execute: () => {
          setAiActionApplied(true);
          setActionSuccessNotice('✓ Nominal Status Confirmed: Terminal A operating within SLA.');
        },
      });
    }
    setIsConfirmModalOpen(true);
  };

  const handleConfirmAction = () => {
    if (pendingAction) {
      pendingAction.execute();
      setIsConfirmModalOpen(false);
      setPendingAction(null);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between pointer-events-none select-none p-4 overflow-hidden">
      {/* ===================================================================== */}
      {/* 1. THIN TOP BAR: TITLE, 4 TERMINAL TABS, LAYER TOGGLES & UTILITIES   */}
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

        {/* 4 Interactive Terminal Tabs with Dynamic Live Camera Focus */}
        <div className="flex items-center gap-1.5 p-1 bg-[#0D1014]/90 backdrop-blur-xl border border-white/[0.08] rounded-xl shadow-card text-xs">
          {[
            { id: 'terminal-a', label: 'Terminal A', coords: [-22, 0.4, 8] as [number, number, number], termState: crowdTerminals['terminal-a'] },
            { id: 'terminal-b', label: 'Terminal B', coords: [-2, 0.4, 4] as [number, number, number], termState: crowdTerminals['terminal-b'] },
            { id: 'terminal-c', label: 'Terminal C', coords: [18, 0.4, 8] as [number, number, number], termState: crowdTerminals['terminal-c'] },
            { id: 'terminal-d', label: 'Terminal D', coords: [36, 0.4, 14] as [number, number, number], termState: crowdTerminals['terminal-d'] },
          ].map((term) => {
            const isSelected = selectedCrowdTerminal === term.id;
            const occupancy = term.termState?.occupancyPercent || 50;
            const status = term.termState?.status || 'NORMAL';
            const isAlert = status === 'CRITICAL';

            return (
              <button
                key={term.id}
                onClick={() => {
                  setSelectedCrowdTerminal(term.id);
                  focusEntity(term.id, term.coords);
                  setAiActionApplied(false);
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
                    status === 'CRITICAL'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : status === 'ATTENTION'
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-emerald-500/20 text-emerald-400'
                  }`}
                >
                  {occupancy}%
                </span>
                {isAlert && (
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping absolute -top-0.5 -right-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* 3D Operational Layer Toggles */}
        <div className="flex items-center gap-1 p-1 bg-[#0D1014]/90 backdrop-blur-xl border border-white/[0.08] rounded-xl shadow-card text-xs">
          <button
            onClick={() => toggleCrowdLayer('passengers')}
            title="Toggle Moving Passenger Crowds"
            className={`px-2 py-1 rounded-lg font-mono text-[11px] transition-all flex items-center gap-1 cursor-pointer ${
              isLayerPassengers
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30 font-bold'
                : 'text-[#8B9199] hover:text-white opacity-60'
            }`}
          >
            <Users className="w-3 h-3" />
            <span className="hidden sm:inline">Pax</span>
          </button>

          <button
            onClick={() => toggleCrowdLayer('heatmap')}
            title="Toggle Density Heatmaps"
            className={`px-2 py-1 rounded-lg font-mono text-[11px] transition-all flex items-center gap-1 cursor-pointer ${
              isLayerHeatmap
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold'
                : 'text-[#8B9199] hover:text-white opacity-60'
            }`}
          >
            <Layers className="w-3 h-3" />
            <span className="hidden sm:inline">Heatmap</span>
          </button>

          <button
            onClick={() => toggleCrowdLayer('aircraft')}
            title="Toggle Airside Flight Operations"
            className={`px-2 py-1 rounded-lg font-mono text-[11px] transition-all flex items-center gap-1 cursor-pointer ${
              isLayerAircraft
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold'
                : 'text-[#8B9199] hover:text-white opacity-60'
            }`}
          >
            <Plane className="w-3 h-3" />
            <span className="hidden sm:inline">Flights</span>
          </button>
        </div>

        {/* Right Utility Controls: Audit Trail, Reset View, Scenario Control & Copilot */}
        <div className="flex items-center gap-2">
          {/* Audit Log Button */}
          <button
            onClick={() => setIsAuditModalOpen(true)}
            title="View Immutable Audit Log"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0D1014]/90 backdrop-blur-xl border border-white/[0.08] hover:border-white/20 text-xs font-semibold text-[#8B9199] hover:text-white transition-all cursor-pointer shadow-card"
          >
            <FileText className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden md:inline">Audit Trail ({crowdAuditTrail.length})</span>
          </button>

          {/* Reset View Button */}
          <button
            onClick={() => {
              const coords: [number, number, number] =
                selectedCrowdTerminal === 'terminal-a' ? [-22, 0.4, 8] :
                selectedCrowdTerminal === 'terminal-b' ? [-2, 0.4, 4] :
                selectedCrowdTerminal === 'terminal-c' ? [18, 0.4, 8] : [36, 0.4, 14];
              focusEntity(selectedCrowdTerminal, coords);
            }}
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
        <div className="pointer-events-auto absolute top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-2xl bg-emerald-950/95 border border-emerald-500/50 text-emerald-200 text-xs font-semibold flex items-center gap-2 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionSuccessNotice}</span>
          <button onClick={() => setActionSuccessNotice(null)} className="ml-2 text-white/60 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 2. COMPACT SLIDE-OVER ZONE INSPECTOR WITH DETERMINISTIC BREAKDOWN     */}
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
                    activeZone.estimatedWaitMin > 10 ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                >
                  {activeZone.estimatedWaitMin} min
                </span>
              </div>
              <span className="text-[10px] text-[#8B9199]">
                {activeZone.queueLength > 0 ? `${activeZone.queueLength} in queue` : 'Free flow'}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex flex-col gap-1">
              <span className="text-[10px] text-[#8B9199]">Inspection Lanes</span>
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
                {activeZone.pressureScore > 80 ? 'Bottleneck' : 'Nominal'}
              </span>
            </div>
          </div>

          {/* Explainable Deterministic Pressure Engine Breakdown */}
          {pressureBreakdown && (
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.08] flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-white/90 tracking-wide flex items-center gap-1.5">
                  <Activity className="w-3 h-3 text-sky-400" />
                  Deterministic Pressure Engine
                </span>
                <span className="text-[9px] font-mono text-amber-400 font-bold">
                  Score: {pressureBreakdown.score}/100
                </span>
              </div>

              <div className="space-y-1.5 text-[10px]">
                <div>
                  <div className="flex justify-between text-[#8B9199]">
                    <span>Density Ratio (35%)</span>
                    <span className="font-mono text-white">{pressureBreakdown.breakdown.densityContrib}/35</span>
                  </div>
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden mt-0.5">
                    <div
                      className="h-full bg-sky-400 rounded-full"
                      style={{ width: `${(pressureBreakdown.breakdown.densityContrib / 35) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[#8B9199]">
                    <span>Queue Depth ({activeZone.queueLength} pax) (30%)</span>
                    <span className="font-mono text-white">{pressureBreakdown.breakdown.queueContrib}/30</span>
                  </div>
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden mt-0.5">
                    <div
                      className="h-full bg-rose-400 rounded-full"
                      style={{ width: `${(pressureBreakdown.breakdown.queueContrib / 30) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[#8B9199]">
                    <span>Net Accumulation Flow (25%)</span>
                    <span className="font-mono text-white">{pressureBreakdown.breakdown.netFlowContrib}/25</span>
                  </div>
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden mt-0.5">
                    <div
                      className="h-full bg-amber-400 rounded-full"
                      style={{ width: `${(pressureBreakdown.breakdown.netFlowContrib / 25) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[#8B9199]">
                    <span>Estimated Wait Time (10%)</span>
                    <span className="font-mono text-white">{pressureBreakdown.breakdown.waitContrib}/10</span>
                  </div>
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden mt-0.5">
                    <div
                      className="h-full bg-emerald-400 rounded-full"
                      style={{ width: `${(pressureBreakdown.breakdown.waitContrib / 10) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Human-in-the-Loop Fast Actions */}
          <div className="space-y-2 pt-1 border-t border-white/[0.08]">
            <span className="text-[10px] font-bold text-white/80 uppercase tracking-wider">
              Operational Actions
            </span>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  executeCrowdLaneOpen(activeZone.id, 1);
                  setActionSuccessNotice(`Lane ${(activeZone.openLanes || 6) + 1} opened. Throughput +13 pax/min.`);
                }}
                className="py-2 px-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] hover:border-white/20 text-xs font-semibold text-white transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-sky-400" />
                <span>+1 Lane</span>
              </button>

              <button
                onClick={() => handleReviewAction()}
                className="py-2 px-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-xs font-bold text-white shadow-lg shadow-emerald-600/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Review Action</span>
              </button>
            </div>

            {selectedCrowdTerminal === 'terminal-c' && (
              <button
                onClick={() => {
                  executeCrowdRedirectFlow('sec-zone-c2', 'sec-zone-c1');
                  setActionSuccessNotice('Passenger flow diverted 25% from C-East to C-West.');
                }}
                className="w-full py-2 px-3 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 text-xs font-bold text-sky-200 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <ArrowRight className="w-3.5 h-3.5 text-sky-400" />
                <span>Redirect 25% Flow to Checkpoint C-West</span>
              </button>
            )}

            <button
              onClick={() => {
                createCrowdIncident(activeZone.id, 'HIGH');
                setActionSuccessNotice(`Incident logged for ${activeZone.name}.`);
              }}
              className="w-full py-1.5 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-[11px] font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <AlertTriangle className="w-3 h-3 text-rose-400" />
              <span>Raise Operational Incident Ticket</span>
            </button>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 3. DYNAMIC AI RECOMMENDATION CARD (ADAPTS TO SELECTED TERMINAL)       */}
      {/* ===================================================================== */}
      <div className="pointer-events-auto absolute right-6 bottom-16 z-30 w-92 p-3.5 rounded-2xl bg-[#0D1014]/94 backdrop-blur-2xl border border-amber-500/40 shadow-2xl flex flex-col gap-2.5 animate-in fade-in slide-in-from-bottom-3 duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            </div>
            <span className="text-xs font-bold text-amber-200">
              AI Advisory • {currentTerminalState.terminalName.split(' ')[0]} {currentTerminalState.terminalName.split(' ')[1]}
            </span>
          </div>
          <span className="text-[10px] font-mono text-amber-400/80 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
            94% Confidence
          </span>
        </div>

        <p className="text-[11px] text-[#A1A7B1] leading-relaxed">
          {aiActionApplied
            ? selectedCrowdTerminal === 'terminal-c'
              ? '✓ Flow successfully diverted: 25% routed to Checkpoint C-West. C-East queue dropped to 38 pax. Operations balanced.'
              : '✓ Lanes 7 & 8 opened. Screening throughput elevated to 118 pax/min. Queue reduced from 184 to 120 pax.'
            : selectedCrowdTerminal === 'terminal-b'
            ? 'Inflow (+124/m) exceeds screening capacity (92/min). Queue at 184 pax with 14.2 min wait. Recommend opening 2 additional screening lanes.'
            : selectedCrowdTerminal === 'terminal-c'
            ? 'Significant queue imbalance: Checkpoint C-East is congested (88 pax, +28/m) while Checkpoint C-West has surplus capacity. Recommend redirecting 25% flow to C-West.'
            : selectedCrowdTerminal === 'terminal-d'
            ? 'Charter tour group surge: Screening Gate D queue at 58 pax approaching 10 min SLA. Recommend staging 4 additional roving queue marshals.'
            : 'Terminal A domestic passenger flow is nominal. All 6 screening checkpoints processing within 3.8 min SLA.'}
        </p>

        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => handleReviewAction()}
            className="flex-1 py-1.5 px-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-xs font-semibold text-white/90 hover:text-white transition-all cursor-pointer text-center"
          >
            Review Impact
          </button>
          {!aiActionApplied ? (
            <button
              onClick={() => handleReviewAction()}
              className="flex-1 py-1.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-xs font-bold text-black transition-all cursor-pointer shadow-md text-center"
            >
              Apply Action
            </button>
          ) : (
            <div className="flex-1 py-1.5 px-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-xs font-bold text-emerald-300 text-center flex items-center justify-center gap-1">
              <Check className="w-3.5 h-3.5" />
              <span>Applied</span>
            </div>
          )}
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 4. HUMAN-IN-THE-LOOP OPERATIONAL ACTION CONFIRMATION MODAL            */}
      {/* ===================================================================== */}
      {isConfirmModalOpen && pendingAction && (
        <div className="pointer-events-auto fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl bg-[#0D1014] border border-amber-500/40 shadow-2xl p-6 flex flex-col gap-4 text-xs">
            {/* Modal Title */}
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Administrator Operational Authorization</h3>
                  <p className="text-[11px] text-[#8B9199]">TwinOS™ Closed-Loop Human-in-the-Loop Decision</p>
                </div>
              </div>
              <button
                onClick={() => setIsConfirmModalOpen(false)}
                className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Action Details */}
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
                <span className="text-[10px] uppercase font-bold text-sky-400 tracking-wider">Proposed Intervention</span>
                <p className="font-bold text-white text-xs">{pendingAction.title}</p>
                <p className="text-[11px] text-[#8B9199]">Target: {pendingAction.targetZone} ({pendingAction.terminalName})</p>
              </div>

              <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-1">
                <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider">Operational Rationale</span>
                <p className="text-[11px] text-[#E2E8F0] leading-relaxed">{pendingAction.rationale}</p>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1">
                <span className="text-[10px] uppercase font-bold text-emerald-300 tracking-wider">Projected Operational Impact</span>
                <p className="text-[11px] text-[#E2E8F0] leading-relaxed">{pendingAction.projectedImpact}</p>
              </div>

              <div className="flex items-center justify-between text-[11px] px-2 text-[#8B9199]">
                <span>Authorizing Officer:</span>
                <strong className="text-white font-mono">H. Shereef (Operations Duty Manager)</strong>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-2 border-t border-white/[0.08]">
              <button
                onClick={() => setIsConfirmModalOpen(false)}
                className="flex-1 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white/80 hover:text-white font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleConfirmAction()}
                className="flex-1 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold shadow-lg shadow-emerald-600/30 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Confirm & Execute</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 5. IMMUTABLE AUDIT TRAIL MODAL                                        */}
      {/* ===================================================================== */}
      {isAuditModalOpen && (
        <div className="pointer-events-auto fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-2xl max-h-[80vh] flex flex-col rounded-2xl bg-[#0D1014] border border-white/[0.12] shadow-2xl p-5 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-sky-400" />
                <h3 className="text-sm font-bold text-white">Immutable Operational Crowd Audit Trail</h3>
              </div>
              <button
                onClick={() => setIsAuditModalOpen(false)}
                className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-2 py-3 scrollbar-thin scrollbar-thumb-white/10">
              {crowdAuditTrail.map((entry) => (
                <div key={entry.id} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex flex-col gap-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-white">{entry.action}</span>
                    <span className="font-mono text-[#8B9199]">{entry.time}</span>
                  </div>
                  <p className="text-[11px] text-[#A1A7B1]">{entry.result}</p>
                  <div className="flex items-center justify-between text-[10px] text-[#8B9199] pt-1 border-t border-white/[0.04]">
                    <span>Actor: <strong className="text-white/80">{entry.actor}</strong> • Zone: {entry.zoneName}</span>
                    <span>Pressure: <span className="text-rose-400">{entry.pressureBefore}</span> → <span className="text-emerald-400">{entry.pressureAfter}</span></span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-white/[0.08] flex justify-end">
              <button
                onClick={() => setIsAuditModalOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-white font-medium cursor-pointer"
              >
                Close Audit Log
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 6. THIN BOTTOM BAR: LIVE FLOW STATS & COMPACT TIMELINE SCRUBBER       */}
      {/* ===================================================================== */}
      <footer className="pointer-events-auto flex items-center justify-between gap-4 flex-wrap z-30">
        {/* Left Live Flow Metrics */}
        <div className="flex items-center gap-3 px-3.5 py-1.5 rounded-xl bg-[#0D1014]/90 backdrop-blur-xl border border-white/[0.08] text-xs shadow-card">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[#8B9199]">
            Active Terminal: <strong className="text-white">{currentTerminalState.terminalName}</strong>
          </span>
          <span className="text-white/20">•</span>
          <span className="text-[#8B9199]">
            Status:{' '}
            <strong className={currentTerminalState.status === 'CRITICAL' ? 'text-rose-400' : 'text-emerald-400'}>
              {currentTerminalState.status} (Pressure {currentTerminalState.pressureScore}/100)
            </strong>
          </span>
          <span className="text-white/20 hidden sm:inline">•</span>
          <span className="text-[#8B9199] hidden sm:inline">
            Campus Pax: <strong className="text-white">{currentTerminalState.totalPax.toLocaleString()}</strong>
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
