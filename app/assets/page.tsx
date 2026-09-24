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
  GitFork,
  TrendingUp,
} from 'lucide-react';
import { useTwinStore } from '@/lib/twin/twinStateStore';
import { Asset } from '@/types';

export default function AssetsPage() {
  const router = useRouter();
  const { assets, focusEntity } = useTwinStore();
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
            <h1 className="text-base font-bold text-[#F4F4F5] flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#F28C18]" />
              Infrastructure Asset Inventory & Telemetry
            </h1>
            <p className="text-[11px] text-[#8B9199]">
              Physical Assets Registry • Health Diagnostics • Interconnected 3D Localization
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
                  ? 'bg-[#F28C18] text-black font-bold shadow-sm'
                  : 'text-[#8B9199] hover:text-[#F4F4F5]'
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
        {/* LEFT 2 COLUMNS: ASSET REGISTRY TABLE                                      */}
        {/* ========================================================================= */}
        <div className="lg:col-span-2 flex flex-col gap-3">
          <div className="bg-[#0D1014]/90 backdrop-blur-xl border border-white/[0.08] rounded-2xl overflow-hidden shadow-card">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/[0.08] bg-white/[0.02] text-[#8B9199] text-[10px] uppercase font-mono tracking-wider">
                  <th className="py-3 px-4">Asset ID / Name</th>
                  <th className="py-3 px-3">Location & Zone</th>
                  <th className="py-3 px-3">Health Score</th>
                  <th className="py-3 px-3">Failure Risk</th>
                  <th className="py-3 px-3">Operating Temp</th>
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
                      className={`hover:bg-white/[0.03] transition-colors cursor-pointer ${
                        isSelected ? 'bg-[#F28C18]/10' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-[#F28C18] shrink-0">
                            <Cpu className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <span className="font-bold text-[#F4F4F5] block leading-snug">
                              {asset.name}
                            </span>
                            <span className="text-[10px] font-mono text-[#8B9199]">
                              {asset.id.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        <span className="text-[#F4F4F5]/90 block">{asset.location}</span>
                        <span className="text-[10px] text-[#8B9199]">{asset.zone}</span>
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
                        <span className="text-[#F4F4F5] font-mono">{asset.temperature}°C</span>
                      </td>

                      <td className="py-3.5 px-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLocateInTwin(asset);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[#F28C18] text-[11px] font-medium transition-colors inline-flex items-center gap-1 cursor-pointer"
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
        {/* RIGHT COLUMN: ASSET TELEMETRY & INTERCONNECTED SHORTCUTS                  */}
        {/* ========================================================================= */}
        <div className="flex flex-col gap-4">
          {selectedAsset ? (
            <div className="bg-[#0D1014]/90 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 shadow-card flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 mb-4">
                  <span className="text-xs font-bold text-[#F4F4F5] uppercase tracking-wider">
                    Equipment Telemetry
                  </span>
                  <span className="text-[10px] font-mono text-[#F28C18]">
                    {selectedAsset.category}
                  </span>
                </div>

                <h2 className="text-sm font-bold text-[#F4F4F5] mb-1">{selectedAsset.name}</h2>
                <span className="text-[11px] text-[#8B9199] block mb-4">
                  {selectedAsset.location} • {selectedAsset.zone}
                </span>

                <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-[#8B9199] block text-[10px]">Health Score</span>
                    <span className="text-lg font-bold text-[#F4F4F5]">{selectedAsset.healthScore}%</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-[#8B9199] block text-[10px]">Operating Temp</span>
                    <span className="text-lg font-bold text-[#F4F4F5]">{selectedAsset.temperature}°C</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-[#8B9199] block text-[10px]">Failure Risk</span>
                    <span className="text-lg font-bold text-amber-400">{selectedAsset.failureRisk}%</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-[#8B9199] block text-[10px]">Maintenance</span>
                    <span className="text-lg font-bold text-[#F4F4F5]">
                      Due in {selectedAsset.maintenanceDaysDue}d
                    </span>
                  </div>
                </div>

                {/* Energy & Load specs */}
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 mb-4 text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#8B9199]">Electrical Power Draw:</span>
                    <span className="font-mono text-[#F4F4F5]">{selectedAsset.powerKw} kW</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8B9199]">Operational Duty Cycle:</span>
                    <span className="font-mono text-[#F4F4F5]">{selectedAsset.usagePercent}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8B9199]">Last Certified Inspection:</span>
                    <span className="font-mono text-[#F4F4F5]">{selectedAsset.lastInspection}</span>
                  </div>
                </div>

                {/* Interconnected shortcuts */}
                <div className="space-y-1.5 mb-4">
                  <span className="text-[10px] text-[#8B9199] font-medium block">Interconnected Workflows:</span>
                  <Link
                    href="/dependencies"
                    className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-[#F4F4F5] flex items-center justify-between transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <GitFork className="w-3.5 h-3.5 text-[#F28C18]" />
                      Analyze System Dependencies
                    </span>
                    <ArrowRight className="w-3 h-3 text-[#8B9199]" />
                  </Link>

                  <Link
                    href="/predictions"
                    className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-[#F4F4F5] flex items-center justify-between transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                      View Degradation Forecast
                    </span>
                    <ArrowRight className="w-3 h-3 text-[#8B9199]" />
                  </Link>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleLocateInTwin(selectedAsset)}
                className="w-full py-2.5 px-4 rounded-xl bg-[#F28C18] hover:bg-[#ff9a2e] text-black font-bold text-xs shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Box className="w-4 h-4" />
                <span>Locate Asset in 3D Digital Twin</span>
              </button>
            </div>
          ) : (
            <div className="p-8 text-center text-[#8B9199] text-xs">Select an asset to view telemetry</div>
          )}
        </div>
      </div>
    </div>
  );
}
