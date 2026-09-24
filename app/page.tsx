'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { LeftSidebar } from '@/components/dashboard/LeftSidebar';
import { TopNavBar } from '@/components/dashboard/TopNavBar';
import { TopStatusPills } from '@/components/dashboard/TopStatusPills';
import { BottomCommandDock } from '@/components/dashboard/BottomCommandDock';
import { SpatialLandmarkPins } from '@/components/dashboard/SpatialLandmarkPins';
import { ContextualEntityModal } from '@/components/3d/ContextualEntityModal';
import { NotificationCenter } from '@/components/shared/NotificationCenter';
import { AskTwinOSFloating } from '@/components/copilot/AskTwinOSFloating';
import { GlobalSearchModal } from '@/components/shared/GlobalSearchModal';

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
      {/* 1. THE HERO ENVIRONMENT: Fullscreen Airport Digital Twin 3D Viewport      */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 z-0">
        <AirportTwinScene />
      </div>

      {/* ========================================================================= */}
      {/* 2. CLEAN SPATIAL LANDMARK PINS (Anchored to physical assets in 3D space)  */}
      {/* ========================================================================= */}
      <SpatialLandmarkPins />

      {/* ========================================================================= */}
      {/* 3. UNIFIED TRANSLUCENT ENTERPRISE COMMAND OVERLAY                         */}
      {/* ========================================================================= */}
      <div className="relative z-20 w-full h-full p-3 flex gap-3 overflow-hidden pointer-events-none">
        {/* Left Fixed Floating Navigation Sidebar */}
        <div className="pointer-events-auto h-full shrink-0">
          <LeftSidebar />
        </div>

        {/* Main Command Center Viewport */}
        <div className="relative flex-1 h-full flex flex-col justify-between overflow-hidden min-h-0">
          {/* Top Layer: Navigation Bar + Search & Time */}
          <div className="pointer-events-auto shrink-0">
            <TopNavBar onOpenNotifications={() => setIsNotificationsOpen(!isNotificationsOpen)} />
            <NotificationCenter
              isOpen={isNotificationsOpen}
              onClose={() => setIsNotificationsOpen(false)}
            />
          </div>

          {/* Upper Status Row: 4 Clean Status Indicators (System Status, Alerts, Asset Health, Energy) */}
          <div className="px-6 pt-1 flex items-center justify-between pointer-events-none shrink-0">
            <div className="pointer-events-auto">
              <TopStatusPills />
            </div>

            {/* Subtle View Mode Badge */}
            <div className="pointer-events-auto hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0D1014]/85 backdrop-blur-md border border-white/[0.08] text-[11px] text-[#8B9199]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[#F4F4F5] font-semibold">Airport Digital Twin</span>
              <span>• Real-Time Synchronized</span>
            </div>
          </div>

          {/* Central Layer: Spacious Unobstructed 3D Airfield Viewport */}
          <div className="relative flex-1 pointer-events-none" />

          {/* Contextual Entity Inspection Card (appears on landmark/asset click) */}
          <ContextualEntityModal />

          {/* Bottom Layer: Clean 4-Card Command Dock (Monitoring | Alerts | Asset Health | Energy) */}
          <div className="px-6 pb-2 pointer-events-none shrink-0">
            <div className="pointer-events-auto w-full">
              <BottomCommandDock />
            </div>
          </div>
        </div>
      </div>

      {/* Global AI Copilot Interactive Drawer */}
      <AskTwinOSFloating />

      {/* Global Command Search (⌘K) */}
      <GlobalSearchModal />
    </main>
  );
}
