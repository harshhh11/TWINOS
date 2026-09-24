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
  { label: 'Monitoring', href: '/monitoring', icon: Activity },
  { label: 'Analytics', href: '/analytics', icon: BarChart3 },
  { label: 'Predictions', href: '/predictions', icon: TrendingUp },
  { label: 'Alerts', href: '/alerts', icon: AlertTriangle, badge: '2' },
  { label: 'Assets', href: '/assets', icon: Cpu },
  { label: 'Incidents', href: '/incidents', icon: ShieldAlert, badge: '1' },
  { label: 'Energy', href: '/energy', icon: Zap },
  { label: 'Dependencies', href: '/dependencies', icon: Sparkles },
];

export function LeftSidebar() {
  const pathname = usePathname();
  const { setCopilotOpen, incidents } = useTwinStore();
  const activeAlerts = incidents.filter((i) => i.status !== 'RESOLVED').length;

  return (
    <aside className="w-[230px] shrink-0 bg-white rounded-3xl p-4 border border-[#E2E8F0] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between select-none">
      {/* Top: Logo & Navigation */}
      <div className="flex flex-col">
        {/* TwinOS Brand Header */}
        <Link href="/" className="flex items-center gap-3 px-2 py-1 mb-6 group">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#EA580C] to-[#C2410C] flex items-center justify-center shadow-md shrink-0">
            <svg
              className="w-5 h-5 text-white fill-current"
              viewBox="0 0 24 24"
            >
              <path d="M12 2L2 22h5.5l2.2-4.8h4.6l2.2 4.8H22L12 2zm0 6.5l1.6 3.5h-3.2L12 8.5z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-extrabold text-[#0F172A] tracking-tight leading-none flex items-center gap-0.5">
              TwinOS<span className="text-xs text-[#EA580C] font-bold">™</span>
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
                    ? 'bg-[#FFF7ED] text-[#EA580C] border border-[#FFEDD5] shadow-xs'
                    : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-[#EA580C]' : 'text-[#64748B]'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.label === 'Alerts' && activeAlerts > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FEF2F2] text-[#DC2626] border border-[#FEE2E2]">
                    {activeAlerts}
                  </span>
                )}
                {item.label === 'Incidents' && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]">
                    1
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom: AI Copilot Card & Version */}
      <div className="pt-4 flex flex-col gap-3">
        {/* Compact AI Copilot Card */}
        <div
          onClick={() => setCopilotOpen(true)}
          className="p-3.5 rounded-2xl bg-gradient-to-b from-[#F8FAFC] to-[#F1F5F9] border border-[#E2E8F0] hover:border-[#FDBA74] transition-all cursor-pointer group shadow-xs"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#EA580C] to-[#FB923C] flex items-center justify-center shadow-md text-white shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <button
              className="w-6 h-6 rounded-full bg-white border border-[#E2E8F0] flex items-center justify-center text-[#64748B] group-hover:text-[#EA580C] group-hover:border-[#EA580C] transition-colors"
            >
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <h4 className="text-xs font-bold text-[#0F172A] leading-tight">
            AI Copilot
          </h4>
          <p className="text-[10px] text-[#64748B] mt-0.5 leading-snug">
            Ask anything about your infrastructure
          </p>
        </div>

        {/* Version Footer */}
        <div className="px-2 flex items-center justify-between text-[10px] font-medium text-[#94A3B8]">
          <span>v1.0.0</span>
          <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live Sync
          </span>
        </div>
      </div>
    </aside>
  );
}
