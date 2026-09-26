'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import {
  ArrowLeft,
  RotateCw,
  Layers,
  Building2,
  Cpu,
  Plane,
  Zap,
  AlertTriangle,
  Network,
  ChevronDown,
} from 'lucide-react';
import { useTwinStore } from '@/lib/twin/twinStateStore';
import { ContextualEntityModal } from '@/components/3d/ContextualEntityModal';

const AirportTwinScene = dynamic(
  () => import('@/components/3d/AirportTwinScene').then((mod) => mod.AirportTwinScene),
  { ssr: false }
);

const HEADER_TARGETS: Array<{ id: string; name: string; position: [number, number, number] }> = [
  { id: 'terminal-a', name: 'Terminal A', position: [-25, 3, -2] },
  { id: 'terminal-b', name: 'Terminal B', position: [2, 3, 10] },
  { id: 'terminal-c', name: 'Terminal C', position: [35, 4, -22] },
  { id: 'terminal-d', name: 'Terminal D', position: [40, 3, 12] },
  { id: 'runway-1', name: 'Runway 1 (09L/27R)', position: [-5, 0.4, -45] },
  { id: 'atc-tower', name: 'ATC Tower', position: [-4, 18, -12] },
  { id: 'parking', name: 'Parking', position: [-28, 2, 25] },
  { id: 'energy-hub', name: 'Central Energy Substation', position: [-45, 2, 35] },
];

export default function TwinExplorerPage() {
  const {
    focusEntity,
    resetCamera,
    selectedMarkerId,
    activeLayers,
    toggleLayer,
  } = useTwinStore();

  const [isLayersOpen, setIsLayersOpen] = useState(false);

  const layerItems = [
    { key: 'buildings' as const, label: 'Buildings', icon: Building2 },
    { key: 'assets' as const, label: 'Assets', icon: Cpu },
    { key: 'operations' as const, label: 'Operations', icon: Plane },
    { key: 'energy' as const, label: 'Energy', icon: Zap },
    { key: 'incidents' as const, label: 'Incidents', icon: AlertTriangle },
    { key: 'dependencies' as const, label: 'Dependencies', icon: Network },
  ];

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#070B14] font-sans select-none text-white">
      {/* 3D Scene Hero: Complete WebGL Digital Twin */}
      <div className="absolute inset-0 z-0">
        <AirportTwinScene />
      </div>

      {/* Top Floating Control Bar */}
      <header className="absolute top-6 inset-x-8 z-30 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-3">
          {/* Dashboard Back Link */}
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-black/55 hover:bg-black/75 text-white border border-white/10 text-xs font-semibold backdrop-blur-md shadow-xl transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-white" />
            <span>Dashboard</span>
          </Link>

          {/* 3D Twin Explorer Pill */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-black/55 backdrop-blur-md border border-white/10 text-xs shadow-xl">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-extrabold text-white">3D Digital Twin Explorer</span>
            <span className="text-[#94A3B8]">• Airport Environment</span>
          </div>
        </div>

        {/* Spatial Quick Jumps & Layer Controls */}
        <div className="flex items-center gap-2">
          {/* Quick Jump Camera Navigation Bar */}
          <div className="flex items-center gap-1.5 p-1.5 bg-black/55 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl text-xs overflow-x-auto max-w-2xl">
            <button
              onClick={resetCamera}
              title="Reset Camera View to Full Campus Overview"
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Reset View</span>
            </button>

            <div className="w-[1px] h-4 bg-white/15 mx-1 shrink-0" />

            {HEADER_TARGETS.map((target) => (
              <button
                key={target.id}
                onClick={() => focusEntity(target.id, target.position)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  selectedMarkerId === target.id
                    ? 'bg-[#F26A21] text-white font-bold shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {target.name}
              </button>
            ))}
          </div>

          {/* Operational Layers Toggle Button */}
          <div className="relative">
            <button
              onClick={() => setIsLayersOpen(!isLayersOpen)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl backdrop-blur-md border text-xs font-semibold shadow-xl transition-all cursor-pointer ${
                isLayersOpen
                  ? 'bg-black/80 border-[#F26A21] text-white shadow-orange-500/20'
                  : 'bg-black/55 hover:bg-black/75 border-white/10 text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-[#F26A21]" />
              <span>Layers</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                  isLayersOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Dropdown Layers Popover */}
            {isLayersOpen && (
              <div className="absolute right-0 top-12 w-52 p-2 bg-[#0B132B]/95 backdrop-blur-xl border border-white/15 rounded-2xl shadow-2xl z-40 flex flex-col gap-1 text-xs">
                <span className="text-[10px] font-bold text-slate-400 px-2 py-1 uppercase tracking-wider border-b border-white/10">
                  Digital Twin Layers
                </span>
                {layerItems.map((layer) => {
                  const Icon = layer.icon;
                  const isEnabled = activeLayers[layer.key];
                  return (
                    <button
                      key={layer.key}
                      onClick={() => toggleLayer(layer.key)}
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                        isEnabled
                          ? 'bg-white/10 text-white font-semibold'
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon
                          className={`w-3.5 h-3.5 ${
                            isEnabled ? 'text-[#F26A21]' : 'text-slate-500'
                          }`}
                        />
                        <span>{layer.label}</span>
                      </div>
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isEnabled
                            ? 'bg-emerald-400 shadow-[0_0_6px_#34D399]'
                            : 'bg-slate-600'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Contextual Entity Inspection Modal */}
      <ContextualEntityModal />

      {/* Bottom Navigation Controls Guide */}
      <footer className="absolute bottom-6 inset-x-8 z-30 flex justify-center pointer-events-none">
        <div className="px-6 py-2.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs font-normal text-slate-300 shadow-xl pointer-events-auto flex items-center gap-3">
          <span>
            <strong className="text-white font-semibold">Left-Click + Drag:</strong> Rotate
          </span>
          <span className="text-white/20">•</span>
          <span>
            <strong className="text-white font-semibold">Right-Click + Drag:</strong> Pan
          </span>
          <span className="text-white/20">•</span>
          <span>
            <strong className="text-white font-semibold">Scroll:</strong> Zoom
          </span>
          <span className="text-white/20">•</span>
          <span>Click any 3D building, runway, or pin to inspect live telemetry</span>
        </div>
      </footer>
    </div>
  );
}
