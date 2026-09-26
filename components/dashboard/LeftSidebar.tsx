'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Box,
  Activity,
  BarChart3,
  TrendingUp,
  AlertCircle,
  Network,
  Bell,
  Cpu,
  AlertTriangle,
  Zap,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useTwinStore } from '@/lib/twin/twinStateStore';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

// STRICT D-DAY SUPPORTING & CORE PLATFORM MODULES (Section 9)
const SIDEBAR_MODULES: NavItem[] = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Digital Twin', href: '/twin', icon: Box },
  { label: 'Monitoring', href: '/monitoring', icon: Activity },
  { label: 'Analytics', href: '/analytics', icon: BarChart3 },
  { label: 'Predictions', href: '/predictions', icon: TrendingUp },
  { label: 'Anomaly Detection', href: '/anomalies', icon: AlertCircle },
  { label: 'Dependencies', href: '/dependencies', icon: Network },
  { label: 'Alerts', href: '/alerts', icon: Bell },
  { label: 'Assets', href: '/assets', icon: Cpu },
  { label: 'Incidents', href: '/incidents', icon: AlertTriangle },
  { label: 'Energy', href: '/energy', icon: Zap },
];

export function LeftSidebar() {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const { setCopilotOpen } = useTwinStore();

  const showExpanded = isPinned || isExpanded;

  return (
    <motion.aside
      onMouseEnter={() => !isPinned && setIsExpanded(true)}
      onMouseLeave={() => !isPinned && setIsExpanded(false)}
      animate={{ width: showExpanded ? 220 : 64 }}
      transition={{ duration: 0.22, ease: [0.25, 1, 0.5, 1] }}
      className="shrink-0 bg-[#0C121E]/95 backdrop-blur-2xl rounded-[24px] p-2.5 flex flex-col justify-between select-none shadow-[0_12px_40px_rgba(0,0,0,0.6)] border border-white/[0.08] sticky top-4 h-[calc(100vh-2rem)] overflow-hidden z-30"
    >
      {/* Top: Brand Toggle & Module List */}
      <div className="flex flex-col min-w-0">
        {/* Brand Header */}
        <div className="flex items-center justify-between px-1.5 py-1 mb-3">
          <Link href="/" className="flex items-center gap-2.5 overflow-hidden group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FF7A1A] to-[#E55310] flex items-center justify-center shadow-[0_2px_10px_rgba(242,106,33,0.4)] shrink-0">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="text-white">
                <path
                  d="M12 2L3 7V17L12 22L21 17V7L12 2Z"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 22V12M12 12L21 7M12 12L3 7"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <AnimatePresence>
              {showExpanded && (
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.15 }}
                  className="flex flex-col min-w-0"
                >
                  <span className="text-xs font-black text-white tracking-tight leading-none">
                    TwinOS<span className="text-[10px] text-[#F26A21]">™</span>
                  </span>
                  <span className="text-[9px] text-gray-400 font-medium leading-tight mt-0.5 truncate">
                    Operations Hub
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </Link>

          {showExpanded && (
            <button
              onClick={() => setIsPinned(!isPinned)}
              title={isPinned ? 'Unpin sidebar' : 'Pin sidebar'}
              className="w-5 h-5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
            >
              {isPinned ? <ChevronLeft className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </button>
          )}
        </div>

        {/* Modules Navigation (11 Approved Core + Supporting Modules) */}
        <nav className="flex flex-col gap-1 py-1 overflow-y-auto max-h-[calc(100vh-14rem)] pr-0.5 no-scrollbar">
          {SIDEBAR_MODULES.map((item) => {
            const isActive = item.href === '/' ? pathname === '/' : pathname === item.href;
            const Icon = item.icon;

            return (
              <Link key={item.label} href={item.href}>
                <div
                  className={`flex items-center gap-3 px-2.5 py-2 rounded-xl text-xs transition-all group relative cursor-pointer ${
                    isActive
                      ? 'bg-[#F26A21]/15 text-[#F26A21] font-bold border border-[#F26A21]/30 shadow-[inset_0_0_10px_rgba(242,106,33,0.12)]'
                      : 'text-gray-400 hover:text-white hover:bg-white/[0.05] border border-transparent font-medium'
                  } ${!showExpanded ? 'justify-center px-0' : ''}`}
                  title={!showExpanded ? item.label : undefined}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-[#F26A21]' : 'text-gray-400 group-hover:text-white'
                    }`}
                  />
                  {showExpanded && (
                    <span className="truncate tracking-tight text-[11px]">{item.label}</span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom: Contextual AI Copilot Trigger (Module 12) */}
      <div className="pt-2 border-t border-white/[0.06] flex flex-col gap-1">
        <button
          onClick={() => setCopilotOpen(true)}
          className={`flex items-center gap-2.5 p-2 rounded-xl bg-white/[0.03] hover:bg-[#F26A21]/15 border border-white/[0.06] hover:border-[#F26A21]/30 text-gray-300 hover:text-white transition-all cursor-pointer group ${
            !showExpanded ? 'justify-center' : ''
          }`}
          title="TwinOS AI Copilot"
        >
          <div className="w-6 h-6 rounded-lg bg-[#F26A21]/20 text-[#F26A21] flex items-center justify-center shrink-0">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          {showExpanded && (
            <div className="flex flex-col text-left min-w-0">
              <span className="text-[11px] font-bold text-white tracking-tight leading-tight">
                AI Copilot
              </span>
              <span className="text-[9px] text-gray-400 leading-tight truncate">
                Ask about infrastructure
              </span>
            </div>
          )}
        </button>

        {showExpanded && (
          <div className="text-center text-[9px] font-mono text-gray-500 pt-1">
            v1.0.0
          </div>
        )}
      </div>
    </motion.aside>
  );
}
