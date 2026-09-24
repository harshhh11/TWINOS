'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Cpu,
  Box,
  Thermometer,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Zap,
  Filter,
  ArrowRight,
} from 'lucide-react';
import { useTwinStore } from '@/lib/twin/twinStateStore';
import { Asset, AssetCategory } from '@/types';

export default function AssetsPage() {
  const router = useRouter();
  const { assets, focusEntity, markers } = useTwinStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(assets[0] || null);

  const filtered = selectedCategory === 'ALL'
    ? assets
    : assets.filter((a) => a.category === selectedCategory);

  const handleLocateInTwin = (asset: Asset) => {
    focusEntity(asset.id, asset.coordinates);
    router.push('/');
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
              <Cpu className="w-4 h-4 text-twin-orange" />
              Infrastructure Asset Intelligence & Health Telemetry
            </h1>
            <p className="text-[11px] text-white/50">
              Predictive Maintenance • Thermal Diagnostics • Failure Risk Scoring
            </p>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 p-1 bg-white/5 border border-white/10 rounded-full text-xs">
          {['ALL', 'HVAC', 'ELEVATOR', 'BAGGAGE', 'POWER', 'CCTV'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-twin-orange text-white shadow-orange-glow font-bold'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* Main Grid */}
      <div className="flex-1 p-8 grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto w-full">
        {/* ========================================================================= */}
        {/* LEFT 2 COLUMNS: ASSET REGISTRY TABLE */}
        {/* ========================================================================= */}
        <div className="lg:col-span-2 flex flex-col gap-3">
          <div className="bg-[#12161E]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-glass">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02] text-white/50 text-[10px] uppercase font-mono tracking-wider">
                  <th className="py-3 px-4">Asset ID / Name</th>
                  <th className="py-3 px-3">Location & Zone</th>
                  <th className="py-3 px-3">Health Score</th>
                  <th className="py-3 px-3">Failure Risk</th>
                  <th className="py-3 px-3">Temperature</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((asset) => {
                  const isSelected = selectedAsset?.id === asset.id;

                  return (
                    <tr
                      key={asset.id}
                      onClick={() => setSelectedAsset(asset)}
                      className={`hover:bg-white/[0.04] transition-colors cursor-pointer ${
                        isSelected ? 'bg-orange-500/10' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-twin-orange shrink-0">
                            <Cpu className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <span className="font-bold text-white block leading-snug">
                              {asset.name}
                            </span>
                            <span className="text-[10px] font-mono text-white/40">
                              {asset.id.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        <span className="text-white/80 block">{asset.location}</span>
                        <span className="text-[10px] text-white/40">{asset.zone}</span>
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-bold ${
                              asset.healthScore < 80
                                ? 'text-amber-400'
                                : asset.healthScore < 70
                                ? 'text-red-400'
                                : 'text-emerald-400'
                            }`}
                          >
                            {asset.healthScore}%
                          </span>
                          <div className="w-12 h-1.5 rounded-full bg-white/10 overflow-hidden">
                            <div
                              style={{ width: `${asset.healthScore}%` }}
                              className={`h-full rounded-full ${
                                asset.healthScore < 80 ? 'bg-amber-400' : 'bg-emerald-400'
                              }`}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        <span
                          className={`font-bold ${
                            asset.failureRisk > 20
                              ? 'text-red-400'
                              : asset.failureRisk > 10
                              ? 'text-amber-400'
                              : 'text-emerald-400'
                          }`}
                        >
                          {asset.failureRisk}%
                        </span>
                      </td>

                      <td className="py-3.5 px-3">
                        <span className="text-white/90 font-mono">{asset.temperature}°C</span>
                      </td>

                      <td className="py-3.5 px-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLocateInTwin(asset);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-twin-orange hover:text-orange-400 text-[11px] font-medium transition-colors inline-flex items-center gap-1"
                        >
                          <Box className="w-3 h-3" />
                          <span>Twin</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: ASSET TELEMETRY & DIAGNOSTICS */}
        {/* ========================================================================= */}
        <div className="flex flex-col gap-4">
          {selectedAsset ? (
            <div className="bg-[#12161E]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-glass flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Equipment Telemetry
                  </span>
                  <span className="text-[10px] font-mono text-twin-orange">
                    {selectedAsset.category}
                  </span>
                </div>

                <h2 className="text-sm font-bold text-white mb-1">{selectedAsset.name}</h2>
                <span className="text-[11px] text-white/50 block mb-4">
                  {selectedAsset.location} • {selectedAsset.zone}
                </span>

                <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <span className="text-white/40 block text-[10px]">Health Score</span>
                    <span className="text-lg font-bold text-white">{selectedAsset.healthScore}%</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <span className="text-white/40 block text-[10px]">Operating Temp</span>
                    <span className="text-lg font-bold text-white">{selectedAsset.temperature}°C</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <span className="text-white/40 block text-[10px]">Failure Risk</span>
                    <span className="text-lg font-bold text-amber-400">{selectedAsset.failureRisk}%</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <span className="text-white/40 block text-[10px]">Maintenance</span>
                    <span className="text-lg font-bold text-white">
                      Due in {selectedAsset.maintenanceDaysDue}d
                    </span>
                  </div>
                </div>

                {/* Energy & Load specs */}
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 mb-4 text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-white/50">Electrical Load:</span>
                    <span className="font-mono text-white">{selectedAsset.powerKw} kW</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Operational Duty Cycle:</span>
                    <span className="font-mono text-white">{selectedAsset.usagePercent}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Last Inspection:</span>
                    <span className="font-mono text-white">{selectedAsset.lastInspection}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleLocateInTwin(selectedAsset)}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-bold text-xs shadow-orange-glow transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Box className="w-4 h-4" />
                <span>Locate Asset in 3D Digital Twin</span>
              </button>
            </div>
          ) : (
            <div className="p-8 text-center text-white/40 text-xs">Select an asset to view telemetry</div>
          )}
        </div>
      </div>
    </div>
  );
}
