'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  Home,
  Box,
  Activity,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Cpu,
  ShieldAlert,
  Zap,
  Sparkles,
  GitFork,
  ArrowRight,
  Users,
} from 'lucide-react';
import { useTwinStore } from '@/lib/twin/twinStateStore';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/', icon: Home },
  { label: 'Digital Twin', href: '/twin', icon: Box },
  { label: 'Crowd Operations', href: '/crowd', icon: Users, badge: '84%' },
  { label: 'Monitoring', href: '/monitoring', icon: Activity },
  { label: 'Analytics', href: '/analytics', icon: BarChart3 },
  { label: 'Predictions', href: '/predictions', icon: TrendingUp },
  { label: 'Alerts', href: '/alerts', icon: AlertTriangle, badge: '2' },
  { label: 'Assets', href: '/assets', icon: Cpu },
  { label: 'Incidents', href: '/incidents', icon: ShieldAlert, badge: '1' },
  { label: 'Energy', href: '/energy', icon: Zap },
  { label: 'Dependencies', href: '/dependencies', icon: GitFork },
];

export function LeftSidebar() {
  const pathname = usePathname();
  const { isSidebarOpen, setSidebarOpen, toggleSidebar, setCopilotOpen, incidents } = useTwinStore();
  const activeIncidents = incidents.filter((i) => i.status !== 'RESOLVED').length;

  return (
    <>
      {/* 1. Collapsed Floating Trigger Button (Visible when sidebar is closed) */}
      <div className="pointer-events-auto">
        <button
          onClick={toggleSidebar}
          title="Open Navigation Menu"
          className="flex items-center gap-2.5 px-3 py-2 rounded-2xl bg-[#0D1014]/92 hover:bg-[#151A21] backdrop-blur-xl border border-white/[0.08] hover:border-[#F28C18]/40 text-[#F4F4F5] transition-all shadow-card group cursor-pointer"
        >
          {/* Muted Orange TwinOS Emblem */}
          <div className="w-7 h-7 rounded-xl bg-[#F28C18] flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105">
            <svg
              className="w-4 h-4 text-black fill-current"
              viewBox="0 0 24 24"
            >
              <path d="M12 2L2 22h5.5l2.2-4.8h4.6l2.2 4.8H22L12 2zm0 6.5l1.6 3.5h-3.2L12 8.5z" />
            </svg>
          </div>
          <div className="flex flex-col text-left leading-tight pr-1">
            <span className="text-xs font-bold text-[#F4F4F5] flex items-center gap-1">
              TwinOS<span className="text-[9px] text-[#F28C18]">™</span>
            </span>
            <span className="text-[10px] text-[#8B9199]">Menu</span>
          </div>
          <Menu className="w-4 h-4 text-[#8B9199] group-hover:text-[#F4F4F5] transition-colors ml-1" />
        </button>
      </div>

      {/* 2. Slide-over Backdrop Overlay */}
      {isSidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity pointer-events-auto"
        />
      )}

      {/* 3. Slide-Out Side Navigation Drawer */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-[270px] h-full flex flex-col justify-between p-4 bg-[#0D1014]/98 backdrop-blur-2xl border-r border-white/[0.08] shadow-2xl transition-transform duration-300 ease-in-out pointer-events-auto select-none ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header of Drawer */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between pb-4 mb-2 border-b border-white/[0.08]">
            <Link
              href="/"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-2.5 group"
            >
              <div className="w-8 h-8 rounded-xl bg-[#F28C18] flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105">
                <svg
                  className="w-4.5 h-4.5 text-black fill-current"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2L2 22h5.5l2.2-4.8h4.6l2.2 4.8H22L12 2zm0 6.5l1.6 3.5h-3.2L12 8.5z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold text-[#F4F4F5] leading-none flex items-center gap-0.5">
                  TwinOS<span className="text-[9px] text-[#F28C18] font-semibold">™</span>
                </span>
                <span className="text-[10px] text-[#8B9199] mt-1 font-medium">
                  Command Center
                </span>
              </div>
            </Link>

            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#8B9199] hover:text-[#F4F4F5] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1 mt-2">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#1D1711] text-[#F4F4F5] border-l-2 border-[#F28C18] shadow-sm'
                      : 'text-[#8B9199] hover:text-[#F4F4F5] hover:bg-[#151A21] border-l-2 border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive ? 'text-[#F28C18]' : 'text-[#8B9199]'
                      }`}
                    />
                    <span className="truncate text-xs">{item.label}</span>
                  </div>

                  {item.label === 'Alerts' && activeIncidents > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      {activeIncidents}
                    </span>
                  )}
                  {item.label === 'Incidents' && (
                    <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                      1
                    </span>
                  )}
                  {item.label === 'Crowd Operations' && (
                    <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse">
                      84% ⚠️
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Drawer Section */}
        <div className="pt-3 border-t border-white/[0.08]">
          <button
            onClick={() => {
              setSidebarOpen(false);
              setCopilotOpen(true);
            }}
            className="w-full text-left p-3 rounded-xl bg-[#11151A] hover:bg-[#151A21] border border-white/[0.08] hover:border-[#F28C18]/40 transition-all cursor-pointer group shadow-sm"
          >
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-6 h-6 rounded-lg bg-[#F28C18]/15 border border-[#F28C18]/30 flex items-center justify-center text-[#F28C18] shrink-0">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-semibold text-[#F4F4F5] flex items-center justify-between">
                  <span>AI Copilot</span>
                  <ArrowRight className="w-3 h-3 text-[#8B9199] group-hover:text-[#F28C18] transition-colors" />
                </h4>
              </div>
            </div>
            <p className="text-[10px] text-[#8B9199] leading-tight truncate">
              Query telemetry & system state
            </p>
          </button>

          <div className="mt-3 px-1 flex items-center justify-between text-[10px] text-[#626870] font-mono">
            <span>TwinOS v2.4 • Airport</span>
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Sync
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
