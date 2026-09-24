'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  X,
  Building,
  Cpu,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { useTwinStore } from '@/lib/twin/twinStateStore';

interface SearchResultItem {
  id: string;
  title: string;
  category: 'Building' | 'Asset' | 'Incident';
  subtitle: string;
  targetId: string;
  coords?: [number, number, number];
  route?: string;
}

export function GlobalSearchModal() {
  const { isSearchOpen, setSearchOpen, markers, assets, incidents, focusEntity } =
    useTwinStore();
  const [query, setQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(!isSearchOpen);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setSearchOpen]);

  if (!isSearchOpen) return null;

  const allItems: SearchResultItem[] = [
    ...markers.map((m) => ({
      id: `marker-${m.id}`,
      title: m.name,
      category: 'Building' as const,
      subtitle: `${m.status} • Risk: ${m.riskLevel || 'Normal'}`,
      targetId: m.id,
      coords: m.position,
    })),
    ...assets.map((a) => ({
      id: `asset-${a.id}`,
      title: `${a.name} (${a.id.toUpperCase()})`,
      category: 'Asset' as const,
      subtitle: `${a.location} • Health: ${a.healthScore}% • Temp: ${a.temperature}°C`,
      targetId: a.id,
      coords: a.coordinates,
      route: '/assets',
    })),
    ...incidents.map((i) => ({
      id: `incident-${i.id}`,
      title: i.title,
      category: 'Incident' as const,
      subtitle: `${i.locationName} • Severity: ${i.severity} • ${i.status}`,
      targetId: i.locationId,
      coords: i.coordinates,
      route: '/incidents',
    })),
  ];

  const filteredItems = query.trim()
    ? allItems.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
      )
    : allItems.slice(0, 8);

  const handleSelect = (item: SearchResultItem) => {
    if (item.coords) {
      focusEntity(item.targetId, item.coords);
    }
    if (item.route) {
      router.push(item.route);
    }
    setSearchOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white border border-[#E2E8F0] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#E2E8F0]">
          <Search className="w-4 h-4 text-[#EA580C] shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search buildings, assets (e.g. HVAC-03), incidents..."
            className="flex-1 bg-transparent text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none"
          />
          <button
            onClick={() => setSearchOpen(false)}
            className="p-1.5 rounded-full text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-72 overflow-y-auto p-3 flex flex-col gap-1.5">
          {filteredItems.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#64748B]">
              No matching twin infrastructure items found.
            </div>
          ) : (
            filteredItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelect(item)}
                className="w-full flex items-center justify-between p-2.5 rounded-2xl hover:bg-[#F8FAFC] border border-transparent hover:border-[#E2E8F0] transition-colors text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#F8FAFC] group-hover:bg-[#FFF7ED] flex items-center justify-center text-[#64748B] group-hover:text-[#EA580C] transition-colors">
                    {item.category === 'Building' && <Building className="w-4 h-4" />}
                    {item.category === 'Asset' && <Cpu className="w-4 h-4" />}
                    {item.category === 'Incident' && <AlertTriangle className="w-4 h-4 text-[#EF4444]" />}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#0F172A] group-hover:text-[#EA580C] transition-colors">
                      {item.title}
                    </span>
                    <span className="text-[11px] text-[#64748B]">{item.subtitle}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-mono font-bold text-[#94A3B8]">
                    {item.category}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#94A3B8] group-hover:text-[#0F172A] transition-colors" />
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between text-[11px] text-[#64748B]">
          <span>Select to focus camera in 3D Twin</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
}
