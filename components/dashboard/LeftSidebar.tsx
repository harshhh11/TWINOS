'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Box,
  MapPin,
  Sparkles,
  Atom,
  Building2,
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
  { label: 'Live Monitoring', href: '/monitoring', icon: MapPin },
  { label: 'AI Insights', href: '/analytics', icon: Sparkles },
  { label: 'Simulation', href: '/predictions', icon: Atom },
  { label: 'Assets', href: '/assets', icon: Building2 },
  { label: 'Energy & Utilities', href: '/energy', icon: Zap },
  { label: 'Security', href: '/dependencies', icon: Shield },
  { label: 'Occupancy', href: '/analytics', icon: Users },
  { label: 'Incidents', href: '/incidents', icon: AlertTriangle },
  { label: 'Reports', href: '/alerts', icon: FileText },
];

export function LeftSidebar() {
  const pathname = usePathname();
  const { setCopilotOpen } = useTwinStore();

  return (
    <aside className="w-[220px] shrink-0 glass-panel rounded-[26px] p-3.5 flex flex-col justify-between select-none shadow-sm">
      {/* Top: Logo & Navigation */}
      <div className="flex flex-col">
        {/* TwinOS Brand Header */}
        <Link href="/" className="flex items-center gap-3 px-2 py-1 mb-4 group">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#F97316] to-[#EA580C] flex items-center justify-center shadow-md shrink-0">
            <span className="text-white text-xl font-black font-sans">A</span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black text-[#10233F] tracking-tight leading-none flex items-center gap-0.5">
              TwinOS<span className="text-[10px] text-[#F26A21] font-bold">™</span>
            </span>
            <span className="text-[9px] font-medium text-[#64748B] leading-tight mt-1">
              AI Digital Twin<br />for Smarter Infrastructure
            </span>
          </div>
        </Link>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-0.5">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2 rounded-2xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#FFF7ED] text-[#EA580C] border border-[#FFEDD5] shadow-2xs font-bold'
                    : 'text-[#475569] hover:text-[#10233F] hover:bg-white/60'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-[#EA580C]' : 'text-[#64748B]'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom: AI Copilot Card & Version */}
      <div className="pt-2 flex flex-col gap-2">
        {/* Compact Glass AI Copilot Card with 3D Sphere */}
        <div
          onClick={() => setCopilotOpen(true)}
          className="p-3.5 rounded-2xl bg-white/85 hover:bg-white border border-white/90 transition-all cursor-pointer group shadow-sm flex flex-col items-start"
        >
          {/* Glowing Metallic Bronze Sphere */}
          <div className="w-10 h-10 rounded-full bg-radial from-[#FFEDD5] via-[#EA580C] to-[#7C2D12] shadow-[0_4px_16px_rgba(234,88,12,0.4)] mb-2 border border-white/60" />

          <div className="w-full flex items-center justify-between">
            <div>
              <h4 className="text-xs font-extrabold text-[#10233F] leading-tight">
                AI Copilot
              </h4>
              <p className="text-[9px] text-[#64748B] mt-0.5 leading-snug">
                Ask anything<br />about your<br />infrastructure
              </p>
            </div>
            <div className="w-7 h-7 rounded-full bg-white border border-slate-200/80 flex items-center justify-center text-[#64748B] group-hover:text-[#EA580C] group-hover:border-[#EA580C] transition-all shadow-2xs">
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* Version Footer */}
        <div className="px-2 text-[9px] font-medium text-[#94A3B8]">
          <span>V1.0.0</span>
        </div>
      </div>
    </aside>
  );
}
