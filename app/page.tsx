'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ArrowRight, Box, Eye } from 'lucide-react';
import { LeftSidebar } from '@/components/dashboard/LeftSidebar';
import { TopNavBar } from '@/components/dashboard/TopNavBar';
import { HeroKpiCards } from '@/components/dashboard/HeroKpiCards';
import { SpatialLandmarkPins } from '@/components/dashboard/SpatialLandmarkPins';
import { DigitalTwinControlsBar, MapFloatingTools } from '@/components/dashboard/DigitalTwinControlsBar';
import { RightAlertsPanel } from '@/components/dashboard/RightAlertsPanel';
import { BottomDashboardCards } from '@/components/dashboard/BottomDashboardCards';
import { ContextualEntityModal } from '@/components/3d/ContextualEntityModal';
import { NotificationCenter } from '@/components/shared/NotificationCenter';
import { AirportMockupAnimation } from '@/components/3d/AirportMockupAnimation';

const AirportTwinScene = dynamic(
  () => import('@/components/3d/AirportTwinScene').then((mod) => mod.AirportTwinScene),
  { ssr: false }
);

export default function MasterDashboardPage() {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'AERIAL' | '3D'>('AERIAL');

  return (
    <div className="relative min-h-screen bg-[#080B10] text-[#F8FAFC] p-3.5 lg:p-5 flex gap-3.5 select-none font-sans overflow-x-hidden">
      {/* ========================================================================= */}
      {/* 0. FULL-VIEWPORT ATMOSPHERIC AIRPORT BACKDROP (Smoothly Emerges)           */}
      {/* ========================================================================= */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden animate-in fade-in duration-1000 ease-out">
        {/* Full-bleed aerial imagery */}
        <div
          className="absolute inset-0 bg-cover transition-all duration-1000 ease-out"
          style={{
            backgroundImage: 'url(/airport-backdrop.jpg)',
            backgroundPosition: '54% 24%',
            filter: 'brightness(0.72) contrast(1.12) saturate(1.1)',
          }}
        />

        {/* Atmospheric base dark tint */}
        <div className="absolute inset-0 bg-[#080B10]/35" />

        {/* Cinematic radial vignette: luminous center, deep dark perimeter */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 95% 85% at 50% 38%, rgba(8,11,16,0.08) 0%, rgba(8,11,16,0.48) 50%, rgba(8,11,16,0.92) 80%, #080B10 100%)',
          }}
        />

        {/* Top fade under floating nav */}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#080B10] via-[#080B10]/80 to-transparent" />

        {/* Bottom fade under telemetry cards */}
        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-b from-transparent via-[#080B10]/85 to-[#080B10]" />

        {/* Left edge fade for sidebar */}
        <div className="absolute inset-y-0 left-0 w-36 bg-gradient-to-r from-[#080B10] via-[#080B10]/75 to-transparent" />

        {/* Right edge fade for alerts */}
        <div className="absolute inset-y-0 right-0 w-36 bg-gradient-to-l from-[#080B10] via-[#080B10]/75 to-transparent" />
      </div>

      {/* ========================================================================= */}
      {/* 1. COLLAPSIBLE COMPACT SIDEBAR (Section 9)                                */}
      {/* ========================================================================= */}
      <LeftSidebar />

      {/* ========================================================================= */}
      {/* 2. MAIN APPLICATION WORKSPACE                                             */}
      {/* ========================================================================= */}
      <main className="flex-1 flex flex-col gap-3 min-w-0 relative z-10">
        {/* Top Floating Pill-Style Navigation Bar (Section 8) */}
        <TopNavBar onOpenNotifications={() => setIsNotificationsOpen(!isNotificationsOpen)} />

        <NotificationCenter
          isOpen={isNotificationsOpen}
          onClose={() => setIsNotificationsOpen(false)}
        />

        {/* ======================================================================= */}
        {/* HERO SECTION: DIGITAL TWIN OPERATIONAL HUB (55-65% VISUAL WEIGHT)        */}
        {/* ======================================================================= */}
        <div className="flex flex-col lg:flex-row gap-3.5 items-stretch">
          {/* Main Digital Twin Hero Card (Section 11) */}
          <div className="flex-1 relative rounded-[28px] overflow-hidden border border-white/[0.1] shadow-[0_16px_40px_rgba(0,0,0,0.5)] bg-[#0C121E]/10 backdrop-blur-none min-h-[500px] h-[540px] flex flex-col justify-between p-5 lg:p-6">
            {/* Background Digital Twin Visualization: Aerial View or Interactive WebGL 3D */}
            {viewMode === 'AERIAL' ? (
              <>
                <AirportMockupAnimation />
              </>
            ) : (
              <div className="absolute inset-0 z-0 bg-[#080D16]">
                <AirportTwinScene />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080B10]/90 via-transparent to-black/30 pointer-events-none" />
              </div>
            )}

            {/* Minimal Status Markers (Section 11) */}
            <SpatialLandmarkPins />

            {/* Top Row: Hero Information Layer & 4 Core Metrics */}
            <div className="relative z-20 flex flex-col md:flex-row items-start justify-between gap-4 pointer-events-none">
              {/* Hero Information Layer (Section 12: Subtle Glass, Single Primary CTA) */}
              <div className="max-w-xs sm:max-w-sm pointer-events-auto flex flex-col items-start p-4 rounded-2xl bg-[#0C121E]/65 hover:bg-[#0C121E]/80 backdrop-blur-xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                  <span className="text-[10px] font-extrabold tracking-wider text-sky-400 uppercase">
                    LIVE DIGITAL TWIN
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-none">
                  TwinOS<span className="text-xs text-[#F26A21]">™</span>
                </h1>

                <p className="text-xs text-gray-300 mt-1.5 leading-snug font-normal">
                  Real-time infrastructure intelligence.
                </p>

                <div className="mt-3.5 flex items-center gap-2">
                  <Link
                    href="/twin"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#F26A21] hover:bg-[#EA580C] text-white text-xs font-bold transition-all shadow-[0_4px_20px_rgba(242,106,33,0.45)] cursor-pointer group"
                  >
                    <span>EXPLORE TWIN</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  {/* Mode switcher: Aerial vs Live 3D */}
                  <button
                    onClick={() => setViewMode(viewMode === 'AERIAL' ? '3D' : 'AERIAL')}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] text-xs font-semibold text-gray-300 hover:text-white transition-all cursor-pointer"
                    title="Switch visualization render mode"
                  >
                    {viewMode === 'AERIAL' ? (
                      <>
                        <Box className="w-3.5 h-3.5 text-[#F26A21]" />
                        <span>3D Mesh</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5 text-sky-400" />
                        <span>Aerial</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* 4 Core Metrics (Section 13: Monitoring, Analytics, Prediction, Anomaly Detection) */}
              <div className="pointer-events-auto max-w-xl w-full">
                <HeroKpiCards />
              </div>
            </div>

            {/* Contextual Entity Inspection Card Modal */}
            <ContextualEntityModal />

            {/* Bottom Row: Layers Controls & Map Floating Tools */}
            <div className="relative z-20 flex items-end justify-between gap-4 pointer-events-none">
              <div className="pointer-events-auto">
                <DigitalTwinControlsBar />
              </div>

              <div className="pointer-events-auto">
                <MapFloatingTools />
              </div>
            </div>
          </div>

          {/* Right Compact Alerts Panel (Section 15) */}
          <RightAlertsPanel />
        </div>

        {/* ======================================================================= */}
        {/* LOWER AREA: REAL-TIME MONITORING, OPERATIONAL TRENDS & PREDICTIONS      */}
        {/* ======================================================================= */}
        <BottomDashboardCards />
      </main>
    </div>
  );
}
