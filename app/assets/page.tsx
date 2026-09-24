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
    <div className="w-screen min-h-screen bg-[#F0F4F8] text-[#0F172A] font-sans select-none flex flex-col">
      {/* Top Header */}
      <header className="px-8 py-4 border-b border-[#E2E8F0] bg-white sticky top-0 z-30 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] text-xs font-bold text-[#0F172A] transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-[#EA580C]" />
            <span>Dashboard</span>
          </Link>

          <div>
            <h1 className="text-base font-extrabold text-[#0F172A] flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#EA580C]" />
              Infrastructure Asset Inventory & Telemetry
            </h1>
            <p className="text-[11px] text-[#64748B]">
              Physical Assets Registry • Health Diagnostics • Interconnected 3D Localization
            </p>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 p-1 bg-[#F1F5F9] border border-[#E2E8F0] rounded-full text-xs">
          {['ALL', 'HVAC', 'ELEVATOR', 'BAGGAGE', 'POWER', 'LIGHTING'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#EA580C] text-white font-bold shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
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
          <div className="bg-white rounded-3xl border border-[#E2E8F0] overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B] text-[10px] uppercase font-mono font-bold tracking-wider">
                  <th className="py-3 px-4">Asset ID / Name</th>
                  <th className="py-3 px-3">Location & Zone</th>
                  <th className="py-3 px-3">Health Score</th>
                  <th className="py-3 px-3">Failure Risk</th>
                  <th className="py-3 px-3">Operating Temp</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {filtered.map((asset) => {
                  const isSelected = selectedAsset?.id === asset.id;

                  return (
                    <tr
                      key={asset.id}
                      onClick={() => setSelectedAsset(asset)}
                      className={`hover:bg-[#F8FAFC] transition-colors cursor-pointer ${
                        isSelected ? 'bg-[#FFF7ED]' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-[#F8FAFC] flex items-center justify-center text-[#EA580C] shrink-0 border border-[#E2E8F0]">
                            <Cpu className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-bold text-[#0F172A] block leading-snug">
                              {asset.name}
                            </span>
                            <span className="text-[10px] font-mono text-[#64748B]">
                              {asset.id.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        <span className="text-[#0F172A] font-semibold block">{asset.location}</span>
                        <span className="text-[10px] text-[#64748B]">{asset.zone}</span>
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-bold ${
                              asset.healthScore < 80
                                ? 'text-[#D97706]'
                                : asset.healthScore < 70
                                ? 'text-[#DC2626]'
                                : 'text-emerald-600'
                            }`}
                          >
                            {asset.healthScore}%
                          </span>
                          <div className="w-12 h-1.5 rounded-full bg-[#F1F5F9] overflow-hidden">
                            <div
                              style={{ width: `${asset.healthScore}%` }}
                              className={`h-full rounded-full ${
                                asset.healthScore < 80 ? 'bg-[#F59E0B]' : 'bg-emerald-500'
                              }`}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        <span
                          className={`font-bold ${
                            asset.failureRisk > 20
                              ? 'text-[#DC2626]'
                              : asset.failureRisk > 10
                              ? 'text-[#D97706]'
                              : 'text-emerald-600'
                          }`}
                        >
                          {asset.failureRisk}%
                        </span>
                      </td>

                      <td className="py-3.5 px-3">
                        <span className="text-[#0F172A] font-mono font-bold">{asset.temperature}°C</span>
                      </td>

                      <td className="py-3.5 px-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLocateInTwin(asset);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] text-[#EA580C] text-xs font-bold transition-colors inline-flex items-center gap-1 cursor-pointer"
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
            <div className="bg-white rounded-3xl border border-[#E2E8F0] p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3 mb-4">
                  <span className="text-xs font-extrabold text-[#0F172A] uppercase tracking-wider">
                    Equipment Telemetry
                  </span>
                  <span className="text-[10px] font-mono font-bold text-[#EA580C] bg-[#FFF7ED] px-2.5 py-0.5 rounded-full border border-[#FFEDD5]">
                    {selectedAsset.category}
                  </span>
                </div>

                <h2 className="text-sm font-extrabold text-[#0F172A] mb-1">{selectedAsset.name}</h2>
                <span className="text-xs text-[#64748B] block mb-4 font-medium">
                  {selectedAsset.location} • {selectedAsset.zone}
                </span>

                <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                  <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
                    <span className="text-[#64748B] block text-[10px] font-semibold">Health Score</span>
                    <span className="text-lg font-black text-[#0F172A]">{selectedAsset.healthScore}%</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
                    <span className="text-[#64748B] block text-[10px] font-semibold">Operating Temp</span>
                    <span className="text-lg font-black text-[#0F172A]">{selectedAsset.temperature}°C</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
                    <span className="text-[#64748B] block text-[10px] font-semibold">Failure Risk</span>
                    <span className="text-lg font-black text-[#D97706]">{selectedAsset.failureRisk}%</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
                    <span className="text-[#64748B] block text-[10px] font-semibold">Maintenance</span>
                    <span className="text-lg font-black text-[#0F172A]">
                      Due in {selectedAsset.maintenanceDaysDue}d
                    </span>
                  </div>
                </div>

                {/* Energy & Load specs */}
                <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] mb-4 text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Electrical Power Draw:</span>
                    <span className="font-mono font-bold text-[#0F172A]">{selectedAsset.powerKw} kW</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Operational Duty Cycle:</span>
                    <span className="font-mono font-bold text-[#0F172A]">{selectedAsset.usagePercent}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Last Certified Inspection:</span>
                    <span className="font-mono font-bold text-[#0F172A]">{selectedAsset.lastInspection}</span>
                  </div>
                </div>

                {/* Interconnected shortcuts */}
                <div className="space-y-2 mb-4">
                  <span className="text-[10px] text-[#64748B] font-bold block">Interconnected Workflows:</span>
                  <Link
                    href="/dependencies"
                    className="w-full py-2.5 px-3.5 rounded-2xl bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] text-xs font-semibold text-[#0F172A] flex items-center justify-between transition-colors"
                  >
                    <span>Analyze System Dependencies</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#EA580C]" />
                  </Link>

                  <Link
                    href="/predictions"
                    className="w-full py-2.5 px-3.5 rounded-2xl bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] text-xs font-semibold text-[#0F172A] flex items-center justify-between transition-colors"
                  >
                    <span>View Degradation Forecast</span>
                    <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
                  </Link>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleLocateInTwin(selectedAsset)}
                className="w-full py-3 px-4 rounded-2xl bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Box className="w-4 h-4" />
                <span>Locate Asset in 3D Digital Twin</span>
              </button>
            </div>
          ) : (
            <div className="p-8 text-center text-[#64748B] text-xs">Select an asset to view telemetry</div>
          )}
        </div>
      </div>
    </div>
  );
}
