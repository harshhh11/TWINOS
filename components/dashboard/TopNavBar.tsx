'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  Bell,
  CloudSun,
  Moon,
  Sun,
  Database,
  CheckCircle2,
  ExternalLink,
  X,
  RefreshCw,
  Sparkles,
  HeartPulse,
  AlertTriangle,
  Zap,
} from 'lucide-react';
import { useTwinStore } from '@/lib/twin/twinStateStore';
import { LeftSidebar } from '@/components/dashboard/LeftSidebar';
import { isSupabaseConfigured } from '@/lib/supabase/client';

interface TopNavBarProps {
  onOpenNotifications?: () => void;
}

export function TopNavBar({ onOpenNotifications }: TopNavBarProps) {
  const {
    setSearchOpen,
    incidents,
    activeEmergency,
    setReportModalOpen,
    setEmergencyDrawerOpen,
    simulateDemoEmergency,
    activeScenarios = [],
    setScenarioDrawerOpen,
  } = useTwinStore();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [currentTime, setCurrentTime] = useState('04:26 PM');
  const [currentDate, setCurrentDate] = useState('Mon, 23 Sep 2026');
  const [isDatasetModalOpen, setIsDatasetModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  const unreadAlerts = incidents.filter((i) => i.status !== 'RESOLVED').length;

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSyncToSupabase = async () => {
    setIsSyncing(true);
    setSyncMessage(null);
    try {
      const res = await fetch('/api/dataset/seed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (data.success) {
        setSyncMessage('✓ Dataset successfully synchronized with your Supabase database!');
      } else {
        setSyncMessage(data.message || data.error || 'Sync status: Ready for API Key');
      }
    } catch (err: any) {
      setSyncMessage('Sync request failed: ' + err.message);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="w-full flex flex-col z-30 select-none">
      {/* Top Main Navigation Bar */}
      <header className="w-full flex items-center justify-between gap-4 px-6 pt-3 pb-1 bg-transparent">
        {/* Left: Side Navbar Trigger & Search Field */}
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          {/* Side Navbar Trigger (Drawer) */}
          <LeftSidebar />

          {/* Global Command Search Field (⌘K) */}
          <button
            onClick={() => setSearchOpen(true)}
            className="flex-1 flex items-center justify-between px-4 py-2.5 bg-[#0D1014]/90 backdrop-blur-xl hover:bg-[#151A21] border border-white/[0.08] hover:border-white/20 rounded-2xl text-xs text-[#8B9199] transition-all cursor-pointer group shadow-card"
          >
            <div className="flex items-center gap-2.5">
              <Search className="w-3.5 h-3.5 text-[#8B9199] group-hover:text-[#F4F4F5]" />
              <span className="text-xs text-[#8B9199] group-hover:text-[#F4F4F5]">
                Search infrastructure assets, incidents, telemetry...
              </span>
            </div>
            <kbd className="px-1.5 py-0.5 rounded bg-[#1A2029] border border-white/[0.08] text-[9px] text-[#626870] font-mono">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right: Utility & Status Controls */}
        <div className="flex items-center gap-3">
          {/* Active Emergency Live Alert Pill OR Quick Demo/Report Buttons */}
          {activeEmergency && activeEmergency.status !== 'RESOLVED' ? (
            <button
              onClick={() => setEmergencyDrawerOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-950/80 border border-red-500/50 hover:border-red-400 text-red-200 transition-all cursor-pointer animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.4)]"
            >
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <div className="flex flex-col text-left leading-tight">
                <span className="text-[9px] text-red-400 font-mono uppercase font-bold">EMERGENCY ACTIVE</span>
                <span className="text-xs font-bold text-white flex items-center gap-1">
                  {activeEmergency.locationName}
                </span>
              </div>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => simulateDemoEmergency()}
                title="Simulate Terminal B Gate B14 Medical Emergency"
                className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>TEST INCIDENT (B14)</span>
              </button>

              <button
                onClick={() => setReportModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg shadow-red-600/30 transition-all cursor-pointer"
              >
                <HeartPulse className="w-3.5 h-3.5" />
                <span>+ REPORT EMERGENCY</span>
              </button>
            </div>
          )}

          {/* Scenario Control Trigger */}
          <button
            onClick={() => setScenarioDrawerOpen(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-card ${
              activeScenarios.length > 0
                ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)] animate-pulse'
                : 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30 text-amber-300 hover:border-amber-400'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="hidden sm:inline">Scenario Control</span>
            {activeScenarios.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-black text-[9px] font-extrabold">
                {activeScenarios.length}
              </span>
            )}
          </button>

          {/* Time & Date */}
          <div className="hidden sm:flex flex-col text-right leading-tight">
            <span className="text-[10px] text-[#8B9199] font-medium tracking-tight">{currentDate}</span>
            <span className="text-sm font-bold text-[#F4F4F5] tracking-tight">{currentTime}</span>
          </div>

          {/* Weather Widget */}
          <div className="hidden md:flex items-center gap-2 text-left leading-tight pl-2 border-l border-white/10">
            <CloudSun className="w-4 h-4 text-[#8B9199]" />
            <div className="flex flex-col">
              <span className="text-[10px] text-[#8B9199] font-medium">Airport Weather</span>
              <span className="text-xs font-bold text-[#F4F4F5]">29°C • Nominal</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Day/Night Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              title={isDarkMode ? 'Night Mode' : 'Day Mode'}
              className="w-9 h-9 shrink-0 aspect-square rounded-full bg-[#0D1014]/90 backdrop-blur-xl hover:bg-[#151A21] border border-white/[0.08] hover:border-white/20 flex items-center justify-center text-[#8B9199] hover:text-[#F4F4F5] transition-all cursor-pointer shadow-card"
            >
              {isDarkMode ? (
                <Moon className="w-4 h-4 text-[#E2E8F0]" />
              ) : (
                <Sun className="w-4 h-4 text-[#F59E0B]" />
              )}
            </button>

            {/* Notifications Bell */}
            <button
              onClick={onOpenNotifications}
              title="Notifications"
              className="relative w-9 h-9 shrink-0 aspect-square rounded-full bg-[#0D1014]/90 backdrop-blur-xl hover:bg-[#151A21] border border-white/[0.08] hover:border-white/20 flex items-center justify-center text-[#8B9199] hover:text-[#F4F4F5] transition-all cursor-pointer shadow-card group"
            >
              <Bell className="w-4 h-4 text-[#8B9199] group-hover:text-[#F4F4F5] transition-colors" />
              {unreadAlerts > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500 ring-2 ring-[#0D1014]"></span>
                </span>
              )}
            </button>

            {/* Profile Avatar */}
            <div className="w-9 h-9 shrink-0 aspect-square rounded-full bg-gradient-to-tr from-[#161B22] to-[#21262D] border border-white/10 hover:border-white/25 flex items-center justify-center text-xs font-semibold text-white/90 shadow-card cursor-pointer transition-all">
              H
            </div>
          </div>
        </div>
      </header>

      {/* Dataset & Supabase Status Modal */}
      {isDatasetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 pointer-events-auto">
          <div className="w-full max-w-lg bg-[#0D1014] border border-white/[0.12] rounded-3xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#F28C18]/15 border border-[#F28C18]/30 flex items-center justify-center text-[#F28C18]">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#F4F4F5]">Airport Dataset & Supabase Integration</h3>
                  <p className="text-xs text-[#8B9199]">Indira Gandhi International Airport (DEL) Multi-Table Data</p>
                </div>
              </div>
              <button
                onClick={() => setIsDatasetModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#8B9199] hover:text-[#F4F4F5] transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Status Details */}
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[#8B9199]">Target Supabase Project:</span>
                  <span className="font-mono font-bold text-sky-400">xbkaffjfbyzunmrjqouh</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#8B9199]">Connection URL:</span>
                  <span className="font-mono text-[11px] text-white/70">https://xbkaffjfbyzunmrjqouh.supabase.co</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#8B9199]">Connection Status:</span>
                  <span className="font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    Local Engine & Cache Online
                  </span>
                </div>
              </div>

              {/* Synchronized Tables Grid */}
              <div>
                <span className="text-[11px] uppercase font-mono text-[#8B9199] block mb-2">
                  Loaded Relational Tables (8 Total):
                </span>
                <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                  {[
                    { name: 'airport_flights', count: '1,000 flights' },
                    { name: 'airport_passengers', count: '2,500 passengers' },
                    { name: 'airport_baggage', count: '2,800 items' },
                    { name: 'airport_gate_events', count: '1,200 events' },
                    { name: 'airport_security', count: '2,500 screenings' },
                    { name: 'airport_staff', count: '600 shifts' },
                    { name: 'airport_retail', count: '3,000 txns (₹12.6M)' },
                    { name: 'airport_maintenance', count: '400 work orders' },
                  ].map((table) => (
                    <div key={table.name} className="p-2 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
                      <span className="text-[#F4F4F5] font-semibold">{table.name}</span>
                      <span className="text-[#F28C18] text-[10px]">{table.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instructions */}
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-[#8B9199] text-[11px] leading-relaxed">
                <strong className="text-amber-400 block mb-1">To execute live upload to Supabase:</strong>
                1. Run <code className="text-white bg-black/40 px-1 py-0.5 rounded">lib/supabase/airport_operations_schema.sql</code> in your Supabase SQL Editor.<br />
                2. Put your Supabase <code className="text-white bg-black/40 px-1 py-0.5 rounded">anon</code> key in <code className="text-white bg-black/40 px-1 py-0.5 rounded">.env.local</code>.<br />
                3. Run <code className="text-white bg-black/40 px-1 py-0.5 rounded">python scripts/seed_supabase.py</code> to batch insert all records!
              </div>

              {syncMessage && (
                <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
                  {syncMessage}
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleSyncToSupabase}
                disabled={isSyncing}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#F28C18] hover:bg-[#ff9a2e] text-black font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Synchronizing...' : 'Sync Dataset to Supabase'}</span>
              </button>

              <Link
                href="/analytics"
                onClick={() => setIsDatasetModalOpen(false)}
                className="py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-[#F4F4F5] transition-all"
              >
                View Analytics
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
