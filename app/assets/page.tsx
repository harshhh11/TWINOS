'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Cpu,
  Box,
  ArrowRight,
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
    <div className="w-screen min-h-screen bg-[#080B10] text-[#F8FAFC] font-sans select-none flex flex-col">
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
            <h1 className="text-base font-extrabold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#F26A21]" />
              Infrastructure Asset Inventory & Telemetry
            </h1>
            <p className="text-[11px] text-gray-400">
              Physical Assets Registry • Health Diagnostics • Interconnected 3D Localization
            </p>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 p-1 bg-white/[0.04] border border-white/[0.08] rounded-full text-xs">
          {['ALL', 'HVAC', 'ELEVATOR', 'BAGGAGE', 'POWER', 'LIGHTING'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#F26A21] text-white font-bold shadow-[0_2px_10px_rgba(242,106,33,0.4)]'
                  : 'text-gray-400 hover:text-white'
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
          <div className="bg-[#0C121E]/95 backdrop-blur-2xl rounded-3xl border border-white/[0.08] overflow-hidden shadow-md">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/[0.08] bg-white/[0.02] text-gray-400 text-[10px] uppercase font-mono font-bold tracking-wider">
                  <th className="py-3 px-4">Asset ID / Name</th>
                  <th className="py-3 px-3">Location & Zone</th>
                  <th className="py-3 px-3">Health Score</th>
                  <th className="py-3 px-3">Failure Risk</th>
                  <th className="py-3 px-3">Operating Temp</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filtered.map((asset) => {
                  const isSelected = selectedAsset?.id === asset.id;

                  return (
                    <tr
                      key={asset.id}
                      onClick={() => setSelectedAsset(asset)}
                      className={`hover:bg-white/[0.03] transition-colors cursor-pointer ${
                        isSelected ? 'bg-white/[0.05]' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-white/[0.04] flex items-center justify-center text-[#F26A21] shrink-0 border border-white/[0.06]">
                            <Cpu className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-bold text-white block leading-snug">
                              {asset.name}
                            </span>
                            <span className="text-[10px] font-mono text-gray-500">
                              {asset.id.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        <span className="text-white font-semibold block">{asset.location}</span>
                        <span className="text-[10px] text-gray-400">{asset.zone}</span>
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
                          <div className="w-12 h-1.5 rounded-full bg-white/[0.08] overflow-hidden">
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
                        <span className="text-white font-mono font-bold">{asset.temperature}°C</span>
                      </td>

                      <td className="py-3.5 px-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLocateInTwin(asset);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-[#F26A21] text-xs font-bold transition-colors inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Box className="w-3.5 h-3.5" />
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
            <div className="bg-[#0C121E]/95 backdrop-blur-2xl rounded-3xl border border-white/[0.08] p-6 shadow-md flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
                  <span className="text-xs font-extrabold text-white uppercase tracking-wider">
                    Equipment Telemetry
                  </span>
                  <span className="text-[10px] font-mono font-bold text-[#F26A21] bg-[#F26A21]/20 px-2.5 py-0.5 rounded-full border border-[#F26A21]/30">
                    {selectedAsset.category}
                  </span>
                </div>

                <h2 className="text-sm font-extrabold text-white mb-1">{selectedAsset.name}</h2>
                <span className="text-xs text-gray-400 block mb-4 font-medium">
                  {selectedAsset.location} • {selectedAsset.zone}
                </span>

                <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                  <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                    <span className="text-gray-400 block text-[10px] font-semibold">Health Score</span>
                    <span className="text-lg font-black text-white">{selectedAsset.healthScore}%</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                    <span className="text-gray-400 block text-[10px] font-semibold">Operating Temp</span>
                    <span className="text-lg font-black text-white">{selectedAsset.temperature}°C</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                    <span className="text-gray-400 block text-[10px] font-semibold">Failure Risk</span>
                    <span className="text-lg font-black text-amber-400">{selectedAsset.failureRisk}%</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                    <span className="text-gray-400 block text-[10px] font-semibold">Maintenance</span>
                    <span className="text-lg font-black text-white">
                      Due in {selectedAsset.maintenanceDaysDue}d
                    </span>
                  </div>
                </div>

                {/* Energy & Load specs */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] mb-4 text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Electrical Power Draw:</span>
                    <span className="font-mono font-bold text-white">{selectedAsset.powerKw} kW</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Operational Duty Cycle:</span>
                    <span className="font-mono font-bold text-white">{selectedAsset.usagePercent}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Last Certified Inspection:</span>
                    <span className="font-mono font-bold text-white">{selectedAsset.lastInspection}</span>
                  </div>
                </div>

                {/* Interconnected shortcuts */}
                <div className="space-y-2 mb-4">
                  <span className="text-[10px] text-gray-400 font-bold block">Interconnected Workflows:</span>
                  <Link
                    href="/dependencies"
                    className="w-full py-2.5 px-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-xs font-semibold text-white flex items-center justify-between transition-colors"
                  >
                    <span>Analyze System Dependencies</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#F26A21]" />
                  </Link>

                  <Link
                    href="/predictions"
                    className="w-full py-2.5 px-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-xs font-semibold text-white flex items-center justify-between transition-colors"
                  >
                    <span>View Degradation Forecast</span>
                    <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                  </Link>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleLocateInTwin(selectedAsset)}
                className="w-full py-3 px-4 rounded-2xl bg-[#F26A21] hover:bg-[#EA580C] text-white font-bold text-xs shadow-[0_4px_16px_rgba(242,106,33,0.35)] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Box className="w-4 h-4" />
                <span>Locate Asset in 3D Digital Twin</span>
              </button>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500 text-xs">Select an asset to view telemetry</div>
          )}
        </div>
      </div>
    </div>
  );
}
