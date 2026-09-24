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
  GitFork,
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
  { label: 'Dependencies', href: '/dependencies', icon: GitFork },
];

export function LeftSidebar() {
  const pathname = usePathname();
  const { setCopilotOpen, incidents } = useTwinStore();
  const activeIncidents = incidents.filter((i) => i.status !== 'RESOLVED').length;

  return (
    <aside className="w-[220px] shrink-0 h-full flex flex-col justify-between p-3 z-30 select-none bg-[#0D1014]/95 backdrop-blur-xl border border-white/[0.08] rounded-[20px] shadow-2xl">
      {/* Top Section */}
      <div className="flex flex-col">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-3 px-2 py-1.5 mb-4 group">
          {/* Muted Orange TwinOS Emblem */}
          <div className="w-8 h-8 rounded-xl bg-[#F28C18] flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105">
            <svg
              className="w-4.5 h-4.5 text-black fill-current"
              viewBox="0 0 24 24"
            >
              <path d="M12 2L2 22h5.5l2.2-4.8h4.6l2.2 4.8H22L12 2zm0 6.5l1.6 3.5h-3.2L12 8.5z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-[16px] font-bold tracking-tight text-[#F4F4F5] leading-none flex items-center gap-0.5">
              TwinOS<span className="text-[9px] text-[#F28C18] font-semibold">™</span>
            </span>
            <span className="text-[10px] text-[#8B9199] tracking-tight mt-1 leading-tight font-medium">
              Enterprise Command
            </span>
          </div>
        </Link>

        {/* Navigation List */}
        <nav className="flex flex-col gap-0.5">
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
                className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#1D1711] text-[#F4F4F5] border-l-2 border-[#F28C18] shadow-sm'
                    : 'text-[#8B9199] hover:text-[#F4F4F5] hover:bg-[#151A21] border-l-2 border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-[#F28C18]' : 'text-[#8B9199]'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.label === 'Alerts' && activeIncidents > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    {activeIncidents}
                  </span>
                )}
                {item.label === 'Incidents' && (
                  <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                    1
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Compact AI Copilot Trigger */}
      <div className="pt-2">
        <button
          onClick={() => setCopilotOpen(true)}
          className="w-full text-left p-2.5 rounded-xl bg-[#11151A] hover:bg-[#151A21] border border-white/[0.08] hover:border-[#F28C18]/40 transition-all cursor-pointer group shadow-sm"
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
            Ask anything about infrastructure
          </p>
        </button>

        <div className="mt-2 px-1 flex items-center justify-between text-[10px] text-[#626870] font-mono">
          <span>TwinOS v2.4</span>
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Sync Active
          </span>
        </div>
      </div>
    </aside>
  );
}
