'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, Bell } from 'lucide-react';
import { useTwinStore } from '@/lib/twin/twinStateStore';

interface TopNavBarProps {
  onOpenNotifications?: () => void;
}

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/' },
  { label: 'Digital Twin', href: '/twin' },
  { label: 'Monitoring', href: '/monitoring' },
  { label: 'Analytics', href: '/analytics' },
  { label: 'Predictions', href: '/predictions' },
];

export function TopNavBar({ onOpenNotifications }: TopNavBarProps) {
  const pathname = usePathname();
  const { setSearchOpen } = useTwinStore();
  const [currentTime, setCurrentTime] = useState('04:26 PM');

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
    <header className="w-full flex items-center justify-between gap-4 select-none mb-2 z-30">
      {/* 1. Left: Minimal Brand Pill */}
      <Link
        href="/"
        className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#111722]/70 hover:bg-[#151D2B]/90 backdrop-blur-xl border border-white/[0.08] shadow-[0_4px_20px_rgba(0,0,0,0.35)] transition-all cursor-pointer group shrink-0"
      >
        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#FF7A1A] to-[#E55310] flex items-center justify-center shadow-[0_2px_8px_rgba(242,106,33,0.4)]">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" className="text-white">
            <path
              d="M12 2L3 7V17L12 22L21 17V7L12 2Z"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 22V12M12 12L21 7M12 12L3 7"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <span className="text-xs font-extrabold text-white tracking-tight">
          TwinOS<span className="text-[10px] text-[#F26A21]">™</span>
        </span>
        <span className="text-[10px] text-gray-400 font-mono hidden sm:inline">• Airport</span>
      </Link>

      {/* 2. Center: Floating Pill Capsule Navbar (Inspired by Reference Design) */}
      <nav className="flex items-center gap-1 p-1 bg-[#111722]/80 backdrop-blur-2xl border border-white/[0.08] rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        {NAV_ITEMS.map((item) => {
          const isActive = item.href === '/' ? pathname === '/' : pathname === item.href;

          return (
            <Link key={item.href} href={item.href} className="relative">
              <span
                className={`relative z-10 block px-4 py-1.5 rounded-full text-xs transition-colors duration-200 cursor-pointer ${
                  isActive
                    ? 'text-white font-semibold'
                    : 'text-gray-400 hover:text-gray-200 font-medium'
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="activeNavPill"
                  className="absolute inset-0 bg-white/[0.14] border border-white/[0.12] rounded-full shadow-[0_2px_12px_rgba(0,0,0,0.3)]"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* 3. Right: Status & Utilities Capsule */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Telemetry Status & Time Pill */}
        <div className="hidden md:flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#111722]/70 backdrop-blur-xl border border-white/[0.08] text-xs shadow-[0_4px_20px_rgba(0,0,0,0.35)]">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-medium text-emerald-400">Live Sync</span>
          </div>
          <span className="text-gray-600">|</span>
          <span className="text-[11px] font-mono text-gray-300">{currentTime}</span>
        </div>

        {/* Search Command Trigger */}
        <button
          onClick={() => setSearchOpen(true)}
          title="Search infrastructure (⌘K)"
          className="w-8 h-8 rounded-full bg-[#111722]/70 hover:bg-[#151D2B]/90 backdrop-blur-xl border border-white/[0.08] flex items-center justify-center text-gray-400 hover:text-white transition-all cursor-pointer shadow-sm"
        >
          <Search className="w-3.5 h-3.5" />
        </button>

        {/* Notifications Bell */}
        <button
          onClick={onOpenNotifications}
          title="Alerts"
          className="relative w-8 h-8 rounded-full bg-[#111722]/70 hover:bg-[#151D2B]/90 backdrop-blur-xl border border-white/[0.08] flex items-center justify-center text-gray-400 hover:text-white transition-all cursor-pointer shadow-sm"
        >
          <Bell className="w-3.5 h-3.5" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#F26A21]" />
        </button>

        {/* Operator Profile Avatar */}
        <div
          title="Lead Operator"
          className="w-8 h-8 rounded-full bg-[#1E293B] border border-white/15 text-white flex items-center justify-center text-xs font-bold shadow-md cursor-pointer hover:border-white/30 transition-all"
        >
          H
        </div>
      </div>
    </header>
  );
}
