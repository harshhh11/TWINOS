'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  GitFork,
  Sparkles,
  Box,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import { useTwinStore } from '@/lib/twin/twinStateStore';
import { AIRPORT_DEPENDENCY_EDGES, calculateCascadeImpact } from '@/lib/dependencies/airportGraph';

export default function DependenciesPage() {
  const router = useRouter();
  const { dependencyNodes, focusEntity, markers } = useTwinStore();
  const [selectedNodeId, setSelectedNodeId] = useState<string>('power-node-b-root');
  const [isMitigationExecuted, setIsMitigationExecuted] = useState(false);

  const selectedNode =
    dependencyNodes.find((n) => n.id === selectedNodeId) || dependencyNodes[0];

  const impactResult = calculateCascadeImpact(
    selectedNode?.id || 'power-node-b-root',
    dependencyNodes,
    AIRPORT_DEPENDENCY_EDGES
  );

  const handleFocusInTwin = () => {
    const terminalB = markers.find((m) => m.id === 'terminal-b');
    if (terminalB) {
      focusEntity(terminalB.id, terminalB.position);
      router.push('/');
    }
  };

  return (
    <div className="w-screen min-h-screen bg-[#080B10] text-[#F8FAFC] font-sans select-none flex flex-col">
      {/* Top Header */}
      <header className="px-8 py-4 border-b border-white/[0.08] bg-[#0C121E]/95 backdrop-blur-2xl flex items-center justify-between sticky top-0 z-30 shadow-lg">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-semibold text-white transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#F26A21]" />
            <span>Dashboard</span>
          </Link>

          <div>
            <h1 className="text-base font-bold text-white flex items-center gap-2">
              <GitFork className="w-4 h-4 text-[#F26A21]" />
              Infrastructure Dependency & Cascade Analysis
            </h1>
            <p className="text-[11px] text-gray-400">
              Power Grid → HVAC Distribution → Concourse Subsystems Cascade
            </p>
          </div>
        </div>

        {/* View in Twin Button */}
        <button
          onClick={handleFocusInTwin}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-semibold text-white transition-all cursor-pointer"
        >
          <Box className="w-3.5 h-3.5 text-[#F26A21]" />
          <span>Locate in 3D Twin</span>
        </button>
      </header>

      {/* Main Grid: Interactive Graph on Left, Impact Panel on Right */}
      <div className="flex-1 p-8 grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto w-full">
        {/* ========================================================================= */}
        {/* LEFT 2 COLUMNS: INTERACTIVE DEPENDENCY GRAPH                              */}
        {/* ========================================================================= */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="relative rounded-3xl bg-[#0C121E]/95 backdrop-blur-2xl border border-white/[0.08] p-6 shadow-md h-[560px] flex flex-col justify-between overflow-hidden">
            {/* Top Graph Instructions */}
            <div className="flex items-center justify-between z-10">
              <div>
                <span className="text-xs font-bold text-white">Topological Dependency Hierarchy</span>
                <span className="text-[11px] text-gray-400 block mt-0.5">
                  Select any infrastructure node to evaluate upstream power feed and downstream cascading risk
                </span>
              </div>

              <div className="flex items-center gap-3 text-[10px] font-mono">
                <span className="flex items-center gap-1.5 text-gray-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  Critical
                </span>
                <span className="flex items-center gap-1.5 text-gray-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  Warning
                </span>
                <span className="flex items-center gap-1.5 text-gray-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  Normal
                </span>
              </div>
            </div>

            {/* Glowing Interactive SVG Node-Link Canvas */}
            <div className="relative flex-1 my-4 flex items-center justify-center">
              {/* Background Graph Grid */}
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#94A3B8_1px,transparent_1px)] [background-size:24px_24px]" />

              {/* Glowing SVG Connections */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <defs>
                  <linearGradient id="edgeGlowDep" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F26A21" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#EF4444" stopOpacity={0.8} />
                  </linearGradient>
                </defs>

                <path d="M 120 180 Q 220 150, 310 130" stroke="url(#edgeGlowDep)" strokeWidth="2.5" fill="none" strokeDasharray="6,4" />
                <path d="M 120 180 Q 220 250, 310 300" stroke="#38BDF8" strokeWidth="2" fill="none" />
                <path d="M 310 130 Q 430 140, 520 160" stroke="url(#edgeGlowDep)" strokeWidth="2.5" fill="none" strokeDasharray="6,4" />
                <path d="M 310 130 Q 430 240, 520 260" stroke="#F59E0B" strokeWidth="2" fill="none" />
                <path d="M 520 160 Q 590 190, 640 220" stroke="#10B981" strokeWidth="1.5" fill="none" />
              </svg>

              {/* Positioned Interactive Nodes */}
              <div className="relative w-full h-full">
                {/* Node 1: Power Substation Root */}
                <button
                  onClick={() => setSelectedNodeId('power-node-b-root')}
                  style={{ left: '30px', top: '140px' }}
                  className={`absolute p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer text-left shadow-sm ${
                    selectedNodeId === 'power-node-b-root'
                      ? 'bg-[#F26A21]/20 border-[#F26A21] scale-105 z-20 shadow-[0_0_20px_rgba(242,106,33,0.3)]'
                      : 'bg-white/[0.04] border-white/[0.08] hover:border-white/[0.18] hover:scale-102 z-10'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="w-4 h-4 text-[#F26A21]" />
                    <span className="text-xs font-bold text-white">Main Substation (Primary Grid)</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-medium block">Health: 95% • Optimal</span>
                </button>

                {/* Node 2: HVAC Chiller Unit 03 */}
                <button
                  onClick={() => setSelectedNodeId('hvac-03-node')}
                  style={{ left: '260px', top: '90px' }}
                  className={`absolute p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer text-left shadow-sm ${
                    selectedNodeId === 'hvac-03-node'
                      ? 'bg-amber-500/20 border-amber-400 scale-105 z-20 shadow-[0_0_20px_rgba(245,158,11,0.3)]'
                      : 'bg-white/[0.04] border-white/[0.08] hover:border-white/[0.18] hover:scale-102 z-10'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span className="text-xs font-bold text-white">HVAC Chiller Unit 03</span>
                  </div>
                  <span className="text-[10px] text-gray-400 block">Temp: 29.2°C • 145 kW</span>
                </button>

                {/* Node 3: Terminal B Power Dist */}
                <button
                  onClick={() => setSelectedNodeId('terminal-b-power-dist')}
                  style={{ left: '260px', top: '260px' }}
                  className={`absolute p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer text-left shadow-sm ${
                    selectedNodeId === 'terminal-b-power-dist'
                      ? 'bg-sky-500/20 border-sky-400 scale-105 z-20 shadow-[0_0_20px_rgba(56,189,248,0.3)]'
                      : 'bg-white/[0.04] border-white/[0.08] hover:border-white/[0.18] hover:scale-102 z-10'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-sky-400" />
                    <span className="text-xs font-bold text-white">Terminal B Power Busbar</span>
                  </div>
                  <span className="text-[10px] text-gray-400 block">Load: 1,250 kW • Normal</span>
                </button>

                {/* Node 4: Terminal B Concourse */}
                <button
                  onClick={() => setSelectedNodeId('terminal-b-concourse')}
                  style={{ left: '460px', top: '120px' }}
                  className={`absolute p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer text-left shadow-sm ${
                    selectedNodeId === 'terminal-b-concourse'
                      ? 'bg-amber-500/20 border-amber-400 scale-105 z-20 shadow-[0_0_20px_rgba(245,158,11,0.3)]'
                      : 'bg-white/[0.04] border-white/[0.08] hover:border-white/[0.18] hover:scale-102 z-10'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span className="text-xs font-bold text-white">Terminal B Operations</span>
                  </div>
                  <span className="text-[10px] text-gray-400 block">Gates B1-B8 Facilities</span>
                </button>

                {/* Node 5: Baggage Conveyor 03 */}
                <button
                  onClick={() => setSelectedNodeId('baggage-03-dep')}
                  style={{ left: '460px', top: '230px' }}
                  className={`absolute p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer text-left shadow-sm ${
                    selectedNodeId === 'baggage-03-dep'
                      ? 'bg-amber-500/20 border-amber-400 scale-105 z-20 shadow-[0_0_20px_rgba(245,158,11,0.3)]'
                      : 'bg-white/[0.04] border-white/[0.08] hover:border-white/[0.18] hover:scale-102 z-10'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span className="text-xs font-bold text-white">Baggage Belt 03</span>
                  </div>
                  <span className="text-[10px] text-gray-400 block">Friction 4.2 mm/s • Warning</span>
                </button>

                {/* Node 6: Escalator Bank 04 */}
                <button
                  onClick={() => setSelectedNodeId('escalator-04-node')}
                  style={{ left: '570px', top: '180px' }}
                  className={`absolute p-3 rounded-2xl border transition-all duration-200 cursor-pointer text-left shadow-sm ${
                    selectedNodeId === 'escalator-04-node'
                      ? 'bg-emerald-500/20 border-emerald-400 scale-105 z-20 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                      : 'bg-white/[0.04] border-white/[0.08] hover:border-white/[0.18] hover:scale-102 z-10'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-xs font-bold text-white">Escalator 04</span>
                  </div>
                  <span className="text-[10px] text-gray-400 block">Transit Duty 68% • Optimal</span>
                </button>
              </div>
            </div>

            {/* Bottom Status bar */}
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between text-xs">
              <span className="text-gray-300">
                Active Traverse Path: <strong className="text-white">{impactResult.impactPath.length} Connected Subsystems</strong>
              </span>
              <span className="text-[#F26A21] font-bold font-mono">
                Cascade Delay Propagation: +{impactResult.cascadingDelayMinutes} mins
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: CASCADE IMPACT & RECOMMENDED ACTIONS                        */}
        {/* ========================================================================= */}
        <div className="flex flex-col gap-4">
          <div className="bg-[#0C121E]/95 backdrop-blur-2xl border border-white/[0.08] rounded-3xl p-6 shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-[#F26A21]" />
                <h3 className="text-xs font-bold text-white tracking-wide uppercase">
                  Downstream Impact Assessment
                </h3>
              </div>

              {/* Selected Node Header */}
              <div className="p-4 rounded-2xl bg-[#F26A21]/15 border border-[#F26A21]/30 mb-4">
                <span className="text-[10px] font-mono text-[#F26A21] block uppercase font-bold">
                  Selected Infrastructure Component
                </span>
                <span className="text-sm font-bold text-white block mt-0.5">
                  {selectedNode?.name || 'Selected Component'}
                </span>
                <p className="text-[11px] text-gray-300 mt-1 leading-snug">
                  {selectedNode?.description || ''}
                </p>
              </div>

              {/* Impact Details */}
              <div className="space-y-2.5 text-xs">
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between">
                  <span className="text-gray-400 font-medium">Risk Rating</span>
                  <span className="text-sm font-bold text-[#F26A21]">
                    {impactResult.riskRating} ({impactResult.systemRiskScore}%)
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between">
                  <span className="text-gray-400 font-medium">Cascading Delay</span>
                  <span className="text-sm font-bold text-white">
                    +{impactResult.cascadingDelayMinutes} minutes
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                  <span className="text-[10px] text-gray-400 font-medium block mb-1.5">Affected Zones</span>
                  <div className="flex flex-wrap gap-1.5">
                    {impactResult.affectedZones.map((z, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[10px] text-gray-300 font-mono">
                        {z}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                  <span className="text-[10px] text-gray-400 font-medium block mb-1.5">Downstream Assets</span>
                  <div className="flex flex-wrap gap-1.5">
                    {impactResult.affectedAssets.map((a, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-lg bg-[#F26A21]/20 text-[#F26A21] font-mono border border-[#F26A21]/30 font-semibold text-[10px]">
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recommended Action */}
              <div className="mt-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                  AI Prescriptive Recommendation
                </span>
                <p className="text-xs text-gray-200 leading-relaxed font-medium">
                  {impactResult.recommendation.primaryAction}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-5 flex flex-col gap-2">
              <button
                onClick={() => setIsMitigationExecuted(true)}
                disabled={isMitigationExecuted}
                className={`w-full py-3 px-4 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  isMitigationExecuted
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#F26A21] hover:bg-[#EA580C] text-white shadow-[0_4px_16px_rgba(242,106,33,0.35)]'
                }`}
              >
                {isMitigationExecuted ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Mitigation Dispatched to Operations ✓</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Execute Prescriptive Action</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
