'use client';

import React, { useState, useEffect } from 'react';
import {
  Plane,
  Building2,
  Building,
  Factory,
  Hospital,
  Search,
  Sun,
  Moon,
  Bell,
  CloudSun,
} from 'lucide-react';
import { useTwinStore } from '@/lib/twin/twinStateStore';
import { EnvironmentType } from '@/types';

interface EnvOption {
  type: EnvironmentType;
  label: string;
  icon: React.ElementType;
}

const ENVIRONMENTS: EnvOption[] = [
  { type: 'airport', label: 'Airport', icon: Plane },
  { type: 'campus', label: 'Campus', icon: Building2 },
  { type: 'smart_city', label: 'Smart City', icon: Building },
  { type: 'industrial', label: 'Industrial', icon: Factory },
  { type: 'hospital', label: 'Hospital', icon: Hospital },
];

interface TopNavBarProps {
  onOpenNotifications?: () => void;
}

export function TopNavBar({ onOpenNotifications }: TopNavBarProps) {
  const { currentEnvironment, setEnvironment, setSearchOpen, incidents } = useTwinStore();
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
        {/* 1. Category Switcher (Segmented pill dock) */}
        <div className="flex items-center gap-1 p-1 bg-[#11151A]/88 backdrop-blur-md border border-white/[0.08] rounded-2xl shadow-card">
          {ENVIRONMENTS.map((env) => {
            const isSelected = currentEnvironment === env.type;
            const Icon = env.icon;

            return (
              <button
                key={env.type}
                onClick={() => setEnvironment(env.type)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#1A2029] text-[#F4F4F5] shadow-inner'
                    : 'text-[#8B9199] hover:text-[#F4F4F5] hover:bg-[#151A21]'
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 transition-colors ${
                    isSelected ? 'text-[#F28C18]' : 'text-[#8B9199]'
                  }`}
                />
                <span>{env.label}</span>
              </button>
            );
          })}
        </div>

        {/* 2. Global Search Field (⌘K) */}
        <div className="flex-1 max-w-md">
          <button
            onClick={() => setSearchOpen(true)}
            className="w-full flex items-center justify-between px-4 py-2 bg-[#11151A]/88 backdrop-blur-md hover:bg-[#151A21] border border-white/[0.08] rounded-2xl text-xs text-[#8B9199] transition-all cursor-pointer group shadow-card"
          >
            <div className="flex items-center gap-2.5">
              <Search className="w-3.5 h-3.5 text-[#8B9199] group-hover:text-[#F4F4F5]" />
              <span className="text-xs text-[#8B9199] group-hover:text-[#F4F4F5]">
                Search buildings, assets, incidents...
              </span>
            </div>
            <kbd className="px-1.5 py-0.5 rounded bg-[#1A2029] border border-white/[0.08] text-[9px] text-[#626870] font-mono">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* 3. Utility Buttons */}
        <div className="flex items-center gap-2.5">
          {/* Split Sun / Moon Icon Button */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            title="Toggle Day/Night"
            className="w-9 h-9 rounded-full bg-[#11151A]/88 backdrop-blur-md hover:bg-[#151A21] border border-white/[0.08] flex items-center justify-center text-[#8B9199] hover:text-[#F4F4F5] transition-all cursor-pointer shadow-card"
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
            className="relative w-9 h-9 rounded-full bg-[#11151A]/88 backdrop-blur-md hover:bg-[#151A21] border border-white/[0.08] flex items-center justify-center text-[#8B9199] hover:text-[#F4F4F5] transition-all cursor-pointer shadow-card"
          >
            <Bell className="w-4 h-4" />
            {unreadAlerts > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#EF4444] ring-2 ring-[#0D1014]" />
            )}
          </button>

          {/* User Profile Avatar */}
          <div className="w-9 h-9 rounded-full bg-[#11151A]/88 backdrop-blur-md border border-white/[0.08] flex items-center justify-center text-xs font-bold text-[#F4F4F5] cursor-pointer hover:border-white/20 transition-all shadow-card">
            H
          </div>
        </div>
      </header>

      {/* Sub-Header Row: Date, Time & Weather on the far right (matching IMAGE 2) */}
      <div className="w-full flex justify-end px-6 pt-1 pointer-events-none">
        <div className="flex items-center gap-5 text-right pointer-events-auto">
          {/* Time & Date */}
          <div className="flex flex-col text-right leading-tight">
            <span className="text-[10px] text-[#8B9199] font-medium tracking-tight">{currentDate}</span>
            <span className="text-base font-bold text-[#F4F4F5] tracking-tight">{currentTime}</span>
          </div>

          {/* Weather Widget */}
          <div className="flex items-center gap-2 text-left leading-tight">
            <CloudSun className="w-4 h-4 text-[#8B9199]" />
            <div className="flex flex-col">
              <span className="text-[10px] text-[#8B9199] font-medium">Mumbai</span>
              <span className="text-xs font-bold text-[#F4F4F5]">29°C</span>
              <span className="text-[9px] text-[#626870]">Partly Cloudy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
