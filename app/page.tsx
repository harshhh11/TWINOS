'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { LeftSidebar } from '@/components/dashboard/LeftSidebar';
import { TopNavBar } from '@/components/dashboard/TopNavBar';
import { HeroHeadline } from '@/components/dashboard/HeroHeadline';
import { TopKpiCards } from '@/components/dashboard/TopKpiCards';
import { LiveCameraFeedCard } from '@/components/dashboard/LiveCameraFeedCard';
import { AiAlertsCard } from '@/components/dashboard/AiAlertsCard';
import { WhatIfSimulatorCard } from '@/components/dashboard/WhatIfSimulatorCard';
import { CompassControlWidget } from '@/components/dashboard/CompassControlWidget';
import { AirportLayerManager } from '@/components/dashboard/AirportLayerManager';
import { BottomAnalyticsDock } from '@/components/dashboard/BottomAnalyticsDock';
import { SpatialLandmarkPins } from '@/components/dashboard/SpatialLandmarkPins';
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
    <main className="relative w-screen h-screen overflow-hidden font-sans select-none bg-[#080A0D]">
      {/* ========================================================================= */}
      {/* 1. THE HERO ENVIRONMENT: Fullscreen Airport Digital Twin Backdrop */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 z-0">
        <AirportTwinScene />
      </div>

      {/* ========================================================================= */}
      {/* 2. SPATIAL LANDMARK PINS (Anchored to physical runways, terminal, tower) */}
      {/* ========================================================================= */}
      <SpatialLandmarkPins />

      {/* ========================================================================= */}
      {/* 3. UNIFIED TRANSLUCENT ENTERPRISE UI OVERLAY */}
      {/* ========================================================================= */}
      <div className="relative z-20 w-full h-full p-3 flex gap-3 overflow-hidden pointer-events-none">
        {/* Left Fixed Floating Sidebar */}
        <div className="pointer-events-auto h-full shrink-0">
          <LeftSidebar />
        </div>

        {/* Main Dashboard Viewport */}
        <div className="relative flex-1 h-full flex flex-col justify-between overflow-hidden min-h-0">
          {/* Top Layer: Category Switcher, Search, Utilities, Time & Weather */}
          <div className="pointer-events-auto shrink-0">
            <TopNavBar onOpenNotifications={() => setIsNotificationsOpen(!isNotificationsOpen)} />
            <NotificationCenter
              isOpen={isNotificationsOpen}
              onClose={() => setIsNotificationsOpen(false)}
            />
          </div>

          {/* Upper Middle Layer: Hero Title & Top KPI Cards (pr-[295px] leaves dedicated space for right rail) */}
          <div className="px-5 pt-0.5 pr-[295px] flex items-start justify-between pointer-events-none shrink-0">
            <div className="pointer-events-auto">
              <HeroHeadline />
            </div>
            <div className="pointer-events-auto">
              <TopKpiCards />
            </div>
          </div>

          {/* Central Layer: Open Airfield Viewport + 3D Compass Dock + Right Rail */}
          <div className="relative flex-1 min-h-[140px] flex items-start justify-end px-5 pointer-events-none pt-0.5">
            {/* 3D Compass & Controls Floating Dock */}
            <div className="pointer-events-auto mr-2.5 self-center">
              <CompassControlWidget />
            </div>

            {/* Right Information Rail */}
            <div className="flex flex-col gap-1.5 shrink-0 pointer-events-auto">
              <LiveCameraFeedCard />
              <AiAlertsCard />
              <WhatIfSimulatorCard />
            </div>
          </div>

          {/* Contextual Entity Inspection Card (appears on landmark click) */}
          <ContextualEntityModal />

          {/* Bottom Layer: Centered Layer Bar & 5-Card Analytics Dock */}
          <div className="px-5 pb-1 flex flex-col gap-1.5 pointer-events-none shrink-0">
            {/* Floating 3D Layer Selector Bar */}
            <div className="flex items-center justify-center pointer-events-auto">
              <AirportLayerManager />
            </div>

            {/* Bottom 5-Card Analytics Dock */}
            <div className="pointer-events-auto w-full">
              <BottomAnalyticsDock />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
