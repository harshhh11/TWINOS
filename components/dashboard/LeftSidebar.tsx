'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
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
  ArrowRight,
  GitFork,
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
  { label: '3D Twin', href: '/twin', icon: Box },
  { label: 'Live Monitoring', href: '/monitoring', icon: Activity },
  { label: 'AI Insights', href: '/analytics', icon: BarChart3 },
  { label: 'Predictions', href: '/predictions', icon: TrendingUp },
  { label: 'Alerts', href: '/alerts', icon: AlertTriangle, badge: '2' },
  { label: 'Assets', href: '/assets', icon: Cpu },
  { label: 'Incidents', href: '/incidents', icon: ShieldAlert, badge: '1' },
  { label: 'Energy & Utilities', href: '/energy', icon: Zap },
  { label: 'Dependencies', href: '/dependencies', icon: GitFork },
];

export function LeftSidebar() {
  const pathname = usePathname();
  const { setCopilotOpen, incidents } = useTwinStore();
  const activeAlerts = incidents.filter((i) => i.status !== 'RESOLVED').length;

  return (
    <aside className="w-[236px] shrink-0 glass-panel rounded-[26px] p-4 flex flex-col justify-between select-none">
      {/* Top: Logo & Navigation */}
      <div className="flex flex-col">
        {/* TwinOS Brand Header */}
        <Link href="/" className="flex items-center gap-3 px-2 py-1 mb-5 group">
          <div className="w-10 h-10 rounded-2xl bg-[#F26A21] flex items-center justify-center shadow-md shrink-0">
            <svg
              className="w-5 h-5 text-white fill-current"
              viewBox="0 0 24 24"
            >
              <path d="M12 2L2 22h5.5l2.2-4.8h4.6l2.2 4.8H22L12 2zm0 6.5l1.6 3.5h-3.2L12 8.5z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black text-[#10233F] tracking-tight leading-none flex items-center gap-0.5">
              TwinOS<span className="text-xs text-[#F26A21] font-bold">™</span>
            </span>
            <span className="text-[10px] font-medium text-[#64748B] leading-tight mt-1">
              AI Digital Twin<br />for Smarter Infrastructure
            </span>
          </div>
        </Link>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1">
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
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#F26A21]/10 text-[#F26A21] border border-[#F26A21]/25 shadow-xs'
                    : 'text-[#475569] hover:text-[#10233F] hover:bg-white/60'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-[#F26A21]' : 'text-[#64748B]'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.label === 'Alerts' && activeAlerts > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FEF2F2] text-[#D94A4A] border border-[#FEE2E2]">
                    {activeAlerts}
                  </span>
                )}
                {item.label === 'Incidents' && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FFFBEB] text-[#E6A11A] border border-[#FEF3C7]">
                    1
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom: AI Copilot Card & Version */}
      <div className="pt-3 flex flex-col gap-2.5">
        {/* Compact Glass AI Copilot Card */}
        <div
          onClick={() => setCopilotOpen(true)}
          className="p-3.5 rounded-[20px] glass-card hover:bg-white/90 border border-white/80 transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between mb-2">
            {/* Glowing Amber Orb */}
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#EA580C] via-[#F97316] to-[#FED7AA] flex items-center justify-center shadow-[0_2px_10px_rgba(242,106,33,0.35)] shrink-0 border border-white/50">
              <Sparkles className="w-4 h-4 text-white drop-shadow-xs" />
            </div>
            <div className="w-7 h-7 rounded-full bg-white/90 border border-slate-200/80 flex items-center justify-center text-[#64748B] group-hover:text-[#F26A21] group-hover:border-[#F26A21] transition-all shadow-xs">
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
          <h4 className="text-xs font-bold text-[#10233F] leading-tight">
            AI Copilot
          </h4>
          <p className="text-[10px] text-[#64748B] mt-0.5 leading-snug">
            Ask anything about your infrastructure
          </p>
        </div>

        {/* Version Footer */}
        <div className="px-2 flex items-center justify-between text-[10px] font-medium text-[#94A3B8]">
          <span>v1.0.0</span>
          <span className="flex items-center gap-1.5 text-[#18A875] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#18A875] animate-pulse" />
            Live Sync
          </span>
        </div>
      </div>
    </aside>
  );
}
