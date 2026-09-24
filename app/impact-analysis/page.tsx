'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  GitFork,
  Sparkles,
  AlertTriangle,
  Box,
  Cpu,
  CheckCircle2,
  Clock,
  Zap,
  ArrowRight,
  Shield,
} from 'lucide-react';
import { useTwinStore } from '@/lib/twin/twinStateStore';
import { AIRPORT_DEPENDENCY_EDGES, calculateCascadeImpact } from '@/lib/dependencies/airportGraph';
import { DependencyNode } from '@/types';

export default function ImpactAnalysisPage() {
  const router = useRouter();
  const { dependencyNodes, focusEntity, markers } = useTwinStore();
  const [selectedNodeId, setSelectedNodeId] = useState<string>('terminal-b-root');
  const [isMitigationExecuted, setIsMitigationExecuted] = useState(false);

  const selectedNode =
    dependencyNodes.find((n) => n.id === selectedNodeId) || dependencyNodes[0];

  const impactResult = calculateCascadeImpact(
    selectedNode.id,
    dependencyNodes,
    AIRPORT_DEPENDENCY_EDGES
  );

  const handleFocusInTwin = () => {
    // If Terminal B, fly to terminal B
    const terminalB = markers.find((m) => m.id === 'terminal-b');
    if (terminalB) {
      focusEntity(terminalB.id, terminalB.position);
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
              <GitFork className="w-4 h-4 text-twin-orange" />
              AI Impact & Infrastructure Dependency Mapping
            </h1>
            <p className="text-[11px] text-white/50">
              Graph Topology Traversal • Cascading Delay Simulation • Automated Mitigation Actions
            </p>
          </div>
        </div>

        {/* View in Twin Button */}
        <button
          onClick={handleFocusInTwin}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-semibold text-white transition-all cursor-pointer"
        >
          <Box className="w-3.5 h-3.5 text-twin-orange" />
          <span>View Affected Location in Twin</span>
        </button>
      </header>

      {/* Main Grid: Interactive Graph on Left, Impact Panel on Right */}
      <div className="flex-1 p-8 grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto w-full">
        {/* ========================================================================= */}
        {/* LEFT 2 COLUMNS: INTERACTIVE DEPENDENCY GRAPH */}
        {/* ========================================================================= */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="relative rounded-2xl bg-[#12161E]/80 backdrop-blur-xl border border-white/10 p-6 shadow-glass h-[560px] flex flex-col justify-between overflow-hidden">
            {/* Top Graph Instructions */}
            <div className="flex items-center justify-between z-10">
              <div>
                <span className="text-xs font-bold text-white">Infrastructure Dependency Topology</span>
                <span className="text-[11px] text-white/40 block mt-0.5">
                  Click any node to evaluate cascading failure propagation and downstream risk
                </span>
              </div>

              <div className="flex items-center gap-3 text-[10px] font-mono">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-status-red" />
                  Critical
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  Warning
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  Normal
                </span>
              </div>
            </div>

            {/* Glowing Interactive SVG Node-Link Canvas */}
            <div className="relative flex-1 my-4 flex items-center justify-center">
              {/* Background Graph Grid */}
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#F97316_1px,transparent_1px)] [background-size:32px_32px]" />

              {/* Glowing SVG Connections */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <defs>
                  <linearGradient id="edgeGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F97316" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#EF4444" stopOpacity="0.8" />
                  </linearGradient>
                </defs>

                {/* Curved Connector Lines Between Nodes */}
                <path d="M 120 180 Q 220 150, 310 130" stroke="url(#edgeGlow)" strokeWidth="2.5" fill="none" strokeDasharray="6,4" />
                <path d="M 120 180 Q 220 230, 310 270" stroke="url(#edgeGlow)" strokeWidth="2.5" fill="none" strokeDasharray="6,4" />
                <path d="M 310 130 Q 420 140, 520 180" stroke="url(#edgeGlow)" strokeWidth="2.5" fill="none" strokeDasharray="6,4" />
                <path d="M 310 270 Q 420 240, 520 180" stroke="url(#edgeGlow)" strokeWidth="2.5" fill="none" strokeDasharray="6,4" />
                <path d="M 520 180 Q 580 260, 640 310" stroke="#F59E0B" strokeWidth="2" fill="none" />
                <path d="M 310 130 Q 340 70, 480 70" stroke="#38BDF8" strokeWidth="1.5" fill="none" />
              </svg>

              {/* Positioned Interactive Nodes */}
              <div className="relative w-full h-full">
                {/* Node 1: Terminal B Root */}
                <button
                  onClick={() => setSelectedNodeId('terminal-b-root')}
                  style={{ left: '60px', top: '140px' }}
                  className={`absolute p-3 rounded-2xl border backdrop-blur-xl transition-all duration-300 cursor-pointer text-left ${
                    selectedNodeId === 'terminal-b-root'
                      ? 'bg-red-500/25 border-red-500 shadow-[0_0_25px_rgba(239,68,68,0.5)] scale-110 z-20'
                      : 'bg-[#181D26] border-red-500/40 hover:scale-105 z-10'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                    <span className="text-xs font-bold text-white">Terminal B Hub</span>
                  </div>
                  <span className="text-[10px] text-white/50 block">Risk: 88% • Critical</span>
                </button>

                {/* Node 2: Security Checkpoint B */}
                <button
                  onClick={() => setSelectedNodeId('sec-checkpoint-b')}
                  style={{ left: '260px', top: '90px' }}
                  className={`absolute p-3 rounded-2xl border backdrop-blur-xl transition-all duration-300 cursor-pointer text-left ${
                    selectedNodeId === 'sec-checkpoint-b'
                      ? 'bg-red-500/25 border-red-500 shadow-[0_0_25px_rgba(239,68,68,0.5)] scale-110 z-20'
                      : 'bg-[#181D26] border-red-500/40 hover:scale-105 z-10'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-red-400" />
                    <span className="text-xs font-bold text-white">Security Checkpoint B</span>
                  </div>
                  <span className="text-[10px] text-white/50 block">Queue Delay: +28 min</span>
                </button>

                {/* Node 3: HVAC Unit 03 */}
                <button
                  onClick={() => setSelectedNodeId('hvac-03-node')}
                  style={{ left: '260px', top: '240px' }}
                  className={`absolute p-3 rounded-2xl border backdrop-blur-xl transition-all duration-300 cursor-pointer text-left ${
                    selectedNodeId === 'hvac-03-node'
                      ? 'bg-amber-500/25 border-amber-500 shadow-orange-glow scale-110 z-20'
                      : 'bg-[#181D26] border-amber-500/40 hover:scale-105 z-10'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span className="text-xs font-bold text-white">HVAC Unit 03</span>
                  </div>
                  <span className="text-[10px] text-white/50 block">Temp: 29.2°C • 145 kW</span>
                </button>

                {/* Node 4: Passenger Zone B2 */}
                <button
                  onClick={() => setSelectedNodeId('passenger-zone-b2')}
                  style={{ left: '460px', top: '150px' }}
                  className={`absolute p-3 rounded-2xl border backdrop-blur-xl transition-all duration-300 cursor-pointer text-left ${
                    selectedNodeId === 'passenger-zone-b2'
                      ? 'bg-red-500/25 border-red-500 shadow-[0_0_25px_rgba(239,68,68,0.5)] scale-110 z-20'
                      : 'bg-[#181D26] border-red-500/40 hover:scale-105 z-10'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-xs font-bold text-white">Passenger Zone B2</span>
                  </div>
                  <span className="text-[10px] text-white/50 block">Crowd Density: 2.8/m²</span>
                </button>

                {/* Node 5: Baggage Conveyor 03 */}
                <button
                  onClick={() => setSelectedNodeId('baggage-03-dep')}
                  style={{ left: '560px', top: '270px' }}
                  className={`absolute p-3 rounded-2xl border backdrop-blur-xl transition-all duration-300 cursor-pointer text-left ${
                    selectedNodeId === 'baggage-03-dep'
                      ? 'bg-amber-500/25 border-amber-500 shadow-orange-glow scale-110 z-20'
                      : 'bg-[#181D26] border-amber-500/40 hover:scale-105 z-10'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span className="text-xs font-bold text-white">Baggage Belt 03</span>
                  </div>
                  <span className="text-[10px] text-white/50 block">Health: 76%</span>
                </button>

                {/* Node 6: CCTV Sensor B2 */}
                <button
                  onClick={() => setSelectedNodeId('cctv-b2-node')}
                  style={{ left: '440px', top: '40px' }}
                  className={`absolute p-3 rounded-2xl border backdrop-blur-xl transition-all duration-300 cursor-pointer text-left ${
                    selectedNodeId === 'cctv-b2-node'
                      ? 'bg-sky-500/25 border-sky-500 scale-110 z-20'
                      : 'bg-[#181D26] border-sky-500/40 hover:scale-105 z-10'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-sky-400" />
                    <span className="text-xs font-bold text-white">Optical CCTV-B2</span>
                  </div>
                  <span className="text-[10px] text-white/50 block">4K 60fps • 98% Health</span>
                </button>
              </div>
            </div>

            {/* Bottom Status bar */}
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between text-xs">
              <span className="text-white/60">
                Active Traverse Path: <strong className="text-white">{impactResult.impactPath.length} Cascaded Nodes</strong>
              </span>
              <span className="text-twin-orange font-bold font-mono">
                Projected System Delay: +{impactResult.cascadingDelayMinutes} mins
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: AI IMPACT ANALYSIS PANEL */}
        {/* ========================================================================= */}
        <div className="flex flex-col gap-4">
          <div className="bg-[#12161E]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-glass flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-twin-orange" />
                <h3 className="text-xs font-bold text-white tracking-wide uppercase">
                  AI Impact Analysis
                </h3>
              </div>

              {/* Incident Header */}
              <div className="p-3.5 rounded-xl bg-red-950/30 border border-red-500/30 mb-4">
                <span className="text-[10px] font-mono text-red-400 block uppercase font-bold">
                  Root Incident / Bottleneck
                </span>
                <span className="text-sm font-bold text-white block mt-0.5">
                  {selectedNode.name}
                </span>
                <p className="text-[11px] text-white/70 mt-1 leading-snug">
                  {selectedNode.description}
                </p>
              </div>

              {/* Impact Breakdown Cards */}
              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
                  <span className="text-white/60">System Risk Rating</span>
                  <span className="text-sm font-bold text-red-400">
                    {impactResult.riskRating} ({impactResult.systemRiskScore}%)
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
                  <span className="text-white/60">Cascading Delay Impact</span>
                  <span className="text-sm font-bold text-white">
                    +{impactResult.cascadingDelayMinutes} minutes
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                  <span className="text-[10px] text-white/50 block mb-1">Affected Zones</span>
                  <div className="flex flex-wrap gap-1.5">
                    {impactResult.affectedZones.map((z, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-white/80 font-mono">
                        {z}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                  <span className="text-[10px] text-white/50 block mb-1">Affected Infrastructure Assets</span>
                  <div className="flex flex-wrap gap-1.5">
                    {impactResult.affectedAssets.map((a, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-orange-500/10 text-[10px] text-orange-300 font-mono border border-orange-500/20">
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* AI Recommendation Box */}
              <div className="mt-4 p-4 rounded-xl bg-gradient-to-tr from-orange-500/15 to-amber-500/10 border border-orange-500/30">
                <span className="text-[10px] font-bold text-twin-orange uppercase tracking-wider block mb-1">
                  AI Prescriptive Recommendation
                </span>
                <p className="text-xs text-white/90 leading-relaxed font-medium">
                  {impactResult.recommendation.primaryAction}
                </p>
                <span className="text-[10px] text-emerald-400 font-medium block mt-1.5">
                  Estimated Relief: {impactResult.recommendation.estimatedReliefPercent}% within {impactResult.recommendation.timeframeMinutes} minutes
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-5 flex flex-col gap-2">
              <button
                onClick={() => setIsMitigationExecuted(true)}
                disabled={isMitigationExecuted}
                className={`w-full py-3 px-4 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  isMitigationExecuted
                    ? 'bg-emerald-500 text-white shadow-status-green'
                    : 'bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white shadow-orange-glow'
                }`}
              >
                {isMitigationExecuted ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Mitigation Action Dispatched to Operations</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Execute AI Recommendation</span>
                  </>
                )}
              </button>

              <button
                onClick={handleFocusInTwin}
                className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white font-medium text-xs transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Box className="w-3.5 h-3.5 text-twin-orange" />
                <span>Locate Impact Zone in 3D Twin</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
