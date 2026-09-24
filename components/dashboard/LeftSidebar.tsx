'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Box,
  Video,
  Sparkles,
  Layers,
  Cpu,
  Zap,
  Shield,
  Users,
  AlertTriangle,
  FileText,
  ArrowRight,
} from 'lucide-react';
import { useTwinStore } from '@/lib/twin/twinStateStore';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/', icon: Home },
  { label: '3D Twin', href: '/twin', icon: Box },
  { label: 'Live Monitoring', href: '/live-monitoring', icon: Video },
  { label: 'AI Insights', href: '/ai-insights', icon: Sparkles },
  { label: 'Simulation', href: '/impact-analysis', icon: Layers },
  { label: 'Assets', href: '/assets', icon: Cpu },
  { label: 'Energy & Utilities', href: '/analytics#energy', icon: Zap },
  { label: 'Security', href: '/live-monitoring#security', icon: Shield },
  { label: 'Occupancy', href: '/analytics#occupancy', icon: Users },
  { label: 'Incidents', href: '/incidents', icon: AlertTriangle },
  { label: 'Reports', href: '/analytics#reports', icon: FileText },
];

export function LeftSidebar() {
  const pathname = usePathname();
  const { setCopilotOpen } = useTwinStore();

  return (
    <aside className="w-[230px] shrink-0 h-full flex flex-col justify-between p-3 z-30 select-none bg-[#0D1014]/92 backdrop-blur-md border border-white/[0.08] rounded-[20px] shadow-card">
      {/* Top Section */}
      <div className="flex flex-col">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-3 px-1.5 py-1 mb-5 group">
          {/* Exact Stylized Orange Chevron-A Emblem */}
          <div className="w-8 h-8 rounded-xl bg-[#F28C18] flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105">
            <svg
              className="w-5 h-5 text-black fill-current"
              viewBox="0 0 24 24"
            >
              <path d="M12 2L2 22h5.5l2.2-4.8h4.6l2.2 4.8H22L12 2zm0 6.5l1.6 3.5h-3.2L12 8.5z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-[17px] font-bold tracking-tight text-[#F4F4F5] leading-none flex items-center gap-0.5">
              TwinOS<span className="text-[10px] text-[#F28C18] font-normal">™</span>
            </span>
            <span className="text-[10px] text-[#8B9199] tracking-tight mt-1 leading-tight font-medium">
              AI Digital Twin<br />for Smarter Infrastructure
            </span>
          </div>
        </Link>

        {/* Navigation List */}
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
                className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#1D1711] text-[#F4F4F5] border-l-2 border-[#F28C18] shadow-sm'
                    : 'text-[#8B9199] hover:text-[#F4F4F5] hover:bg-[#151A21] border-l-2 border-transparent'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-[#F28C18]' : 'text-[#8B9199]'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Compact AI Copilot Card */}
      <div className="pt-3">
        <button
          onClick={() => setCopilotOpen(true)}
          className="w-full text-left p-3 rounded-2xl bg-[#11151A] hover:bg-[#151A21] border border-white/[0.08] transition-all cursor-pointer group shadow-sm"
        >
          {/* Realistic 3D Glowing Amber Marble Orb matching IMAGE 2 */}
          <div className="relative w-8 h-8 rounded-full mb-2.5 overflow-hidden shadow-md">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FFB866] via-[#F28C18] to-[#451800]" />
            <div className="absolute top-1 left-1.5 w-3 h-2 rounded-full bg-white/70 blur-[1px]" />
            <div className="absolute bottom-1 right-1.5 w-3.5 h-3.5 rounded-full bg-[#FF9D3B]/40 blur-[2px]" />
          </div>

          <div className="flex items-center justify-between">
            <div className="min-w-0 pr-2">
              <h4 className="text-xs font-semibold text-[#F4F4F5]">AI Copilot</h4>
              <p className="text-[10px] text-[#8B9199] leading-tight mt-0.5 truncate">
                Ask anything about your infrastructure
              </p>
            </div>
            <div className="w-6 h-6 rounded-full bg-[#1A2029] border border-white/[0.08] flex items-center justify-center text-[#8B9199] group-hover:text-white group-hover:border-[#F28C18] transition-colors shrink-0">
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </button>

        <div className="mt-2 px-1 text-[10px] text-[#626870] font-mono">
          V1.0.0
        </div>
      </div>
    </aside>
  );
}
