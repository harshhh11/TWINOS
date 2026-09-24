'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { LeftSidebar } from '@/components/dashboard/LeftSidebar';
import { TopNavBar } from '@/components/dashboard/TopNavBar';
import { HeroKpiCards } from '@/components/dashboard/HeroKpiCards';
import { SpatialLandmarkPins } from '@/components/dashboard/SpatialLandmarkPins';
import { DigitalTwinControlsBar, MapFloatingTools } from '@/components/dashboard/DigitalTwinControlsBar';
import { RightAlertsPanel } from '@/components/dashboard/RightAlertsPanel';
import { BottomDashboardCards } from '@/components/dashboard/BottomDashboardCards';
import { ContextualEntityModal } from '@/components/3d/ContextualEntityModal';
import { NotificationCenter } from '@/components/shared/NotificationCenter';

// Dynamically import 3D Scene with ssr: false for high-performance WebGL
const AirportTwinScene = dynamic(
  () => import('@/components/3d/AirportTwinScene').then((mod) => mod.AirportTwinScene),
  { ssr: false }
);

export default function MasterDashboardPage() {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#10233F] p-4 lg:p-5 flex gap-5 select-none font-sans">
      {/* ========================================================================= */}
      {/* 1. LEFT SIDEBAR                                                           */}
      {/* ========================================================================= */}
      <LeftSidebar />

      {/* ========================================================================= */}
      {/* 2. MAIN APPLICATION WORKSPACE                                             */}
      {/* ========================================================================= */}
      <main className="flex-1 flex flex-col gap-4 min-w-0">
        {/* Top Header Pill Bar */}
        <TopNavBar onOpenNotifications={() => setIsNotificationsOpen(!isNotificationsOpen)} />

        <NotificationCenter
          isOpen={isNotificationsOpen}
          onClose={() => setIsNotificationsOpen(false)}
        />

        {/* ======================================================================= */}
        {/* HERO SECTION & RIGHT ALERTS PANEL                                       */}
        {/* ======================================================================= */}
        <div className="flex flex-col lg:flex-row gap-4 items-stretch">
          {/* Main 3D Digital Twin Hero Card */}
          <div className="flex-1 relative rounded-[28px] overflow-hidden border border-white/80 shadow-[0_8px_32px_rgba(16,35,63,0.06)] bg-white min-h-[490px] h-[530px] flex flex-col justify-between p-6">
            {/* 3D Scene WebGL Canvas & Realistic Airport Backdrop */}
            <div className="absolute inset-0 z-0">
              <AirportTwinScene />
            </div>

            {/* Spatial Landmark Interactive Pins */}
            <SpatialLandmarkPins />

            {/* Top Row: Hero Headline & Floating KPI Cards */}
            <div className="relative z-20 flex flex-col md:flex-row items-start justify-between gap-4 pointer-events-none">
              {/* Left Headline Overlay */}
              <div className="max-w-xs sm:max-w-sm pointer-events-auto">
                <span className="inline-block px-2.5 py-1 rounded-md bg-white/70 backdrop-blur-md text-[10px] font-extrabold tracking-wider text-[#10233F] uppercase mb-2 border border-white/80 shadow-2xs">
                  LIVE DIGITAL TWIN
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-[#10233F] tracking-tight leading-[1.1] drop-shadow-xs">
                  A Smarter<br />Tomorrow, Today.
                </h1>
                <p className="text-xs text-[#334155] mt-2 leading-relaxed drop-shadow-xs font-medium">
                  Realtime intelligence. Predictive insights.<br />Safer, more efficient infrastructure.
                </p>

                <Link
                  href="/twin"
                  className="inline-flex items-center gap-2 mt-3.5 px-5 py-2.5 rounded-full bg-[#F26A21] hover:bg-[#d85817] text-white text-xs font-bold transition-all shadow-[0_4px_16px_rgba(242,106,33,0.35)] hover:shadow-[0_6px_20px_rgba(242,106,33,0.45)] group cursor-pointer"
                >
                  <span>Explore the Twin</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Right Floating KPI Cards */}
              <div className="pointer-events-auto max-w-xl w-full">
                <HeroKpiCards />
              </div>
            </div>

            {/* Contextual Entity Inspection Card */}
            <ContextualEntityModal />

            {/* Bottom Row: Controls Bar & Map Tools */}
            <div className="relative z-20 flex items-end justify-between gap-4 pointer-events-none">
              <div className="pointer-events-auto">
                <DigitalTwinControlsBar />
              </div>

              <div className="pointer-events-auto">
                <MapFloatingTools />
              </div>
            </div>
          </div>

          {/* Right Side Alerts & AI Recommendation Panel */}
          <RightAlertsPanel />
        </div>

        {/* ======================================================================= */}
        {/* BOTTOM 4 DASHBOARD CARDS                                                */}
        {/* ======================================================================= */}
        <BottomDashboardCards />
      </main>
    </div>
  );
}
