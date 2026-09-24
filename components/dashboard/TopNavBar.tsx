'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Plane,
  CloudSun,
} from 'lucide-react';
import { useTwinStore } from '@/lib/twin/twinStateStore';

interface TopNavBarProps {
  onOpenNotifications?: () => void;
}

export function TopNavBar({ onOpenNotifications }: TopNavBarProps) {
  const { setSearchOpen, incidents } = useTwinStore();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentTime, setCurrentTime] = useState('04:26 PM');
  const [currentDate, setCurrentDate] = useState('Mon, 23 Sep 2026');

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

  return (
    <header className="w-full flex items-center justify-between gap-4 select-none">
      {/* Left: Environment Badge & Command Search */}
      <div className="flex items-center gap-3 flex-1 max-w-2xl">
        {/* Single Demonstration Environment Badge (Airport) */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-full border border-[#E2E8F0] shadow-xs shrink-0">
          <div className="w-5 h-5 rounded-full bg-[#FFF7ED] flex items-center justify-center text-[#EA580C]">
            <Plane className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-[#0F172A]">Airport</span>
        </div>

        {/* Global Search Pill Bar (⌘K) */}
        <button
          onClick={() => setSearchOpen(true)}
          className="flex-1 flex items-center justify-between px-5 py-2.5 bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#CBD5E1] rounded-full text-xs text-[#64748B] transition-all cursor-pointer group shadow-xs"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-3.5 h-3.5 text-[#94A3B8] group-hover:text-[#0F172A]" />
            <span className="text-xs text-[#64748B] group-hover:text-[#0F172A]">
              Search buildings, assets, incidents...
            </span>
          </div>
          <kbd className="px-2 py-0.5 rounded-md bg-[#F1F5F9] border border-[#E2E8F0] text-[10px] text-[#64748B] font-mono">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: Date/Time, Weather & Utility Controls */}
      <div className="flex items-center gap-4">
        {/* Time & Date */}
        <div className="hidden lg:flex flex-col text-right leading-tight">
          <span className="text-[10px] font-medium text-[#64748B]">{currentDate}</span>
          <span className="text-sm font-extrabold text-[#0F172A] tracking-tight">{currentTime}</span>
        </div>

        {/* Weather Indicator */}
        <div className="hidden sm:flex items-center gap-2 text-left leading-tight pl-3 border-l border-[#E2E8F0]">
          <CloudSun className="w-4 h-4 text-[#EA580C]" />
          <div className="flex flex-col">
            <span className="text-[10px] text-[#64748B] font-medium">Mumbai</span>
            <span className="text-xs font-bold text-[#0F172A]">29°C Partly Cloudy</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Light / Dark Mode Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            title="Theme Toggle"
            className="w-9 h-9 rounded-full bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:text-[#0F172A] transition-all cursor-pointer shadow-xs"
          >
            {isDarkMode ? <Moon className="w-4 h-4 text-[#EA580C]" /> : <Sun className="w-4 h-4 text-[#EA580C]" />}
          </button>

          {/* Notifications Bell */}
          <button
            onClick={onOpenNotifications}
            title="Notifications"
            className="relative w-9 h-9 rounded-full bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:text-[#0F172A] transition-all cursor-pointer shadow-xs"
          >
            <Bell className="w-4 h-4" />
            {unreadAlerts > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#EF4444] ring-2 ring-white" />
            )}
          </button>

          {/* Profile Avatar */}
          <div className="w-9 h-9 rounded-full bg-[#0F172A] text-white flex items-center justify-center text-xs font-bold shadow-xs cursor-pointer">
            H
          </div>
        </div>
      </div>
    </header>
  );
}
