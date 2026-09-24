'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  Bell,
  CloudSun,
  ShieldCheck,
} from 'lucide-react';
import { useTwinStore } from '@/lib/twin/twinStateStore';

interface TopNavBarProps {
  onOpenNotifications?: () => void;
}

export function TopNavBar({ onOpenNotifications }: TopNavBarProps) {
  const { setSearchOpen, incidents } = useTwinStore();
  const [isDarkMode, setIsDarkMode] = useState(true);
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
    <div className="w-full flex flex-col z-30 select-none">
      {/* Top Main Navigation Bar */}
      <header className="w-full flex items-center justify-between gap-4 px-6 pt-3 pb-1 bg-transparent">
        {/* 1. Global Command Search Field (⌘K) */}
        <div className="flex-1 max-w-lg">
          <button
            onClick={() => setSearchOpen(true)}
            className="w-full flex items-center justify-between px-4 py-2 bg-[#0D1014]/90 backdrop-blur-xl hover:bg-[#151A21] border border-white/[0.08] hover:border-white/20 rounded-2xl text-xs text-[#8B9199] transition-all cursor-pointer group shadow-card"
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

        {/* 2. Utility & Status Controls */}
        <div className="flex items-center gap-4">
          {/* Time & Date */}
          <div className="hidden sm:flex flex-col text-right leading-tight">
            <span className="text-[10px] text-[#8B9199] font-medium tracking-tight">{currentDate}</span>
            <span className="text-sm font-bold text-[#F4F4F5] tracking-tight">{currentTime}</span>
          </div>

          {/* Weather Widget */}
          <div className="hidden md:flex items-center gap-2 text-left leading-tight pl-2 border-l border-white/10">
            <CloudSun className="w-4 h-4 text-[#8B9199]" />
            <div className="flex flex-col">
              <span className="text-[10px] text-[#8B9199] font-medium">Terminal Weather</span>
              <span className="text-xs font-bold text-[#F4F4F5]">29°C • Nominal</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Day/Night Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              title="Toggle Mode"
              className="w-8.5 h-8.5 rounded-full bg-[#0D1014]/90 backdrop-blur-xl hover:bg-[#151A21] border border-white/[0.08] flex items-center justify-center text-[#8B9199] hover:text-[#F4F4F5] transition-all cursor-pointer shadow-card"
            >
              <svg className="w-4 h-4 text-[#F4F4F5]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
                <path d="M12 7a5 5 0 0 0 0 10V7z" fill="currentColor" />
                <path d="M12 7a5 5 0 1 1 0 10V7z" />
              </svg>
            </button>

            {/* Notifications Bell */}
            <button
              onClick={onOpenNotifications}
              title="Notifications"
              className="relative w-8.5 h-8.5 rounded-full bg-[#0D1014]/90 backdrop-blur-xl hover:bg-[#151A21] border border-white/[0.08] flex items-center justify-center text-[#8B9199] hover:text-[#F4F4F5] transition-all cursor-pointer shadow-card"
            >
              <Bell className="w-4 h-4" />
              {unreadAlerts > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-[#0D1014]" />
              )}
            </button>

            {/* Profile Avatar */}
            <div className="w-8.5 h-8.5 rounded-full bg-[#0D1014]/90 backdrop-blur-xl border border-white/[0.08] flex items-center justify-center text-xs font-bold text-[#F4F4F5] cursor-pointer hover:border-white/20 transition-all shadow-card">
              H
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
