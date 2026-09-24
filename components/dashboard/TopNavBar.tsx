'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  Bell,
  Plane,
  Building2,
  Building,
  Factory,
  Hospital,
  Sun,
  Moon,
  CloudSun,
} from 'lucide-react';
import { useTwinStore } from '@/lib/twin/twinStateStore';

interface TopNavBarProps {
  onOpenNotifications?: () => void;
}

const ENVIRONMENTS = [
  { id: 'airport', label: 'Airport', icon: Plane },
  { id: 'campus', label: 'Campus', icon: Building2 },
  { id: 'smart-city', label: 'Smart City', icon: Building },
  { id: 'industrial', label: 'Industrial', icon: Factory },
  { id: 'hospital', label: 'Hospital', icon: Hospital },
];

export function TopNavBar({ onOpenNotifications }: TopNavBarProps) {
  const { setSearchOpen, incidents } = useTwinStore();
  const [activeEnv, setActiveEnv] = useState('airport');
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
    <header className="w-full flex items-center justify-between gap-4 select-none mb-1">
      {/* 1. Left Environment Selector Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 glass-pill rounded-full shadow-sm">
        {ENVIRONMENTS.map((env) => {
          const Icon = env.icon;
          const isSelected = activeEnv === env.id;

          return (
            <button
              key={env.id}
              onClick={() => setActiveEnv(env.id)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-white text-[#10233F] shadow-sm border border-slate-200/60'
                  : 'text-[#64748B] hover:text-[#10233F] hover:bg-white/40'
              }`}
            >
              <Icon
                className={`w-3.5 h-3.5 ${
                  isSelected ? 'text-[#F26A21]' : 'text-[#64748B]'
                }`}
              />
              <span>{env.label}</span>
            </button>
          );
        })}
      </div>

      {/* 2. Center Search Command Bar */}
      <div className="flex-1 max-w-md">
        <button
          onClick={() => setSearchOpen(true)}
          className="w-full flex items-center justify-between px-4 py-2 glass-pill hover:bg-white/90 rounded-full text-xs text-[#64748B] transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-3.5 h-3.5 text-[#94A3B8] group-hover:text-[#10233F]" />
            <span className="text-xs text-[#64748B] group-hover:text-[#10233F]">
              Search buildings, assets, incidents...
            </span>
          </div>
          <kbd className="px-2 py-0.5 rounded-md bg-white/80 border border-slate-200 text-[10px] text-[#64748B] font-mono shadow-2xs">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* 3. Right: Date/Time, Weather & Profile Controls */}
      <div className="flex items-center gap-3">
        {/* Date and Time */}
        <div className="hidden xl:flex flex-col text-right leading-tight">
          <span className="text-[10px] font-medium text-[#64748B]">{currentDate}</span>
          <span className="text-sm font-black text-[#10233F] tracking-tight">{currentTime}</span>
        </div>

        {/* Weather Indicator */}
        <div className="hidden lg:flex items-center gap-2 text-left leading-tight pl-3 border-l border-slate-200/80">
          <CloudSun className="w-4 h-4 text-[#F26A21]" />
          <div className="flex flex-col">
            <span className="text-[10px] text-[#64748B] font-medium">Mumbai</span>
            <span className="text-xs font-bold text-[#10233F]">29°C Partly Cloudy</span>
          </div>
        </div>

        {/* Theme, Notification and Avatar Controls */}
        <div className="flex items-center gap-2">
          {/* Day / Night Theme Toggle */}
          <button
            title="Theme Toggle"
            className="w-8 h-8 rounded-full glass-pill hover:bg-white flex items-center justify-center text-[#F26A21] transition-all cursor-pointer shadow-2xs"
          >
            <Sun className="w-4 h-4" />
          </button>

          {/* Notifications */}
          <button
            onClick={onOpenNotifications}
            title="Notifications"
            className="relative w-8 h-8 rounded-full glass-pill hover:bg-white flex items-center justify-center text-[#10233F] transition-all cursor-pointer shadow-2xs"
          >
            <Bell className="w-4 h-4" />
            {unreadAlerts > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#D94A4A] ring-2 ring-white" />
            )}
          </button>

          {/* User Avatar */}
          <div className="w-8 h-8 rounded-full bg-[#10233F] text-white flex items-center justify-center text-xs font-bold shadow-2xs cursor-pointer border border-white/40">
            H
          </div>
        </div>
      </div>
    </header>
  );
}
