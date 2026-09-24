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
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-[#111418] border border-[#262B31] rounded-2xl shadow-card overflow-hidden flex flex-col">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[#262B31]">
          <Search className="w-4 h-4 text-[#F28C18] shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search buildings, assets (e.g. HVAC-03), incidents, cameras..."
            className="flex-1 bg-transparent text-xs text-[#F2F3F5] placeholder-[#626870] focus:outline-none"
          />
          <button
            onClick={() => setSearchOpen(false)}
            className="p-1 rounded text-[#8D939B] hover:text-[#F2F3F5] hover:bg-[#161B22] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-72 overflow-y-auto p-2 flex flex-col gap-1">
          {filteredItems.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#626870]">
              No matching twin infrastructure items found.
            </div>
          ) : (
            filteredItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelect(item)}
                className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-[#161B22] border border-transparent hover:border-[#262B31] transition-colors text-left group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#1C2128] flex items-center justify-center text-[#8D939B] group-hover:text-[#F28C18] transition-colors">
                    {item.category === 'Building' && <Building className="w-3.5 h-3.5" />}
                    {item.category === 'Asset' && <Cpu className="w-3.5 h-3.5" />}
                    {item.category === 'Incident' && <AlertTriangle className="w-3.5 h-3.5 text-[#EF4444]" />}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-[#F2F3F5] group-hover:text-[#F28C18] transition-colors">
                      {item.title}
                    </span>
                    <span className="text-[10px] text-[#8D939B]">{item.subtitle}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[9px] uppercase font-mono text-[#626870]">
                    {item.category}
                  </span>
                  <ArrowRight className="w-3 h-3 text-[#626870] group-hover:text-[#F2F3F5] transition-colors" />
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-[#262B31] bg-[#14181D] flex items-center justify-between text-[10px] text-[#626870]">
          <span>Select to focus camera in 3D Twin</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
}
