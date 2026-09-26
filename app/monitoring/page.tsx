'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Activity,
  Box,
  AlertTriangle,
  Cpu,
  Zap,
  CheckCircle2,
  Clock,
  Radio,
  RefreshCw,
  TrendingUp,
  Shield,
  Layers,
  Plane,
  Search,
  Filter,
  Luggage,
} from 'lucide-react';
import { useTwinStore } from '@/lib/twin/twinStateStore';
import { airportDataService } from '@/lib/data/airportDataService';

export default function MonitoringPage() {
  const router = useRouter();
  const { assets, incidents, focusEntity } = useTwinStore();
  const summary = airportDataService.getSummary();
  const [ticker, setTicker] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'DELAYED' | 'ON_TIME' | 'DEPARTED'>('ALL');

  // Real-time simulated telemetry ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setTicker((prev) => prev + 1);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const flights = summary.fids_sample || [];

  const filteredFlights = flights.filter((f) => {
    const matchesSearch =
      f.flight_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.airline_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.destination_airport.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.gate.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (statusFilter === 'DELAYED') return f.is_delayed;
    if (statusFilter === 'ON_TIME') return !f.is_delayed;
    if (statusFilter === 'DEPARTED') return f.flight_status === 'Departed';
    return true;
  });

  return (
    <div className="w-screen h-screen overflow-y-auto bg-[#080A0D] text-[#F4F4F5] font-sans select-none flex flex-col">
      {/* Top Header */}
      <header className="px-8 py-4 border-b border-white/[0.08] bg-[#0D1014]/90 backdrop-blur-xl flex items-center justify-between sticky top-0 z-30 shadow-card">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-[#F4F4F5] transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </Link>

          <div>
            <h1 className="text-base font-bold text-[#F4F4F5] flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#F28C18]" />
              Real-Time Flight Radar & Infrastructure Operations
            </h1>
            <p className="text-[11px] text-[#8B9199]">
              Indira Gandhi International Airport (DEL) • Live Telemetry • FIDS Boards • Sensor Streams
            </p>
          </div>
        </div>

        {/* Real-Time Live Pulse Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono font-bold">RADAR: LIVE</span>
            <span className="text-white/40 font-mono text-[10px]">T+{ticker}s</span>
          </div>

          <Link
            href="/twin"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#F28C18] hover:bg-[#ff9a2e] text-black font-bold text-xs shadow-sm transition-all"
          >
            <Box className="w-3.5 h-3.5" />
            <span>Open 3D Twin</span>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-6">
        {/* 1. Live Operational High-Level Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-[#0D1014]/90 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-4 shadow-card">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-[#8B9199] font-medium">Daily Operations</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <div className="text-2xl font-black text-[#F4F4F5]">{summary.kpis.total_flights} Movements</div>
            <span className="text-[11px] text-emerald-400 block mt-1">
              {summary.kpis.on_time_performance_pct}% On-Time Performance (DEL Hub)
            </span>
          </div>

          <div className="bg-[#0D1014]/90 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-4 shadow-card">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-[#8B9199] font-medium">Delayed Flights</span>
              <span className="w-2 h-2 rounded-full bg-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-400">{summary.kpis.delayed_flights} Flights</div>
            <span className="text-[11px] text-[#8B9199] block mt-1">
              Avg delay {summary.kpis.avg_delay_minutes} min (Primary: ATC & WX)
            </span>
          </div>

          <div className="bg-[#0D1014]/90 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-4 shadow-card">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-[#8B9199] font-medium">Security Throughput</span>
              <span className="w-2 h-2 rounded-full bg-sky-400" />
            </div>
            <div className="text-2xl font-black text-sky-400">{summary.kpis.security_hourly_throughput} pax/hr</div>
            <span className="text-[11px] text-emerald-400 block mt-1">
              Avg wait {(summary.kpis.security_avg_wait_sec / 60).toFixed(1)} min across 8 lanes
            </span>
          </div>

          <div className="bg-[#0D1014]/90 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-4 shadow-card">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-[#8B9199] font-medium">Baggage & Ground Support</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <div className="text-2xl font-black text-[#F4F4F5]">{summary.kpis.total_baggage_handled.toLocaleString()} Bags</div>
            <span className="text-[11px] text-emerald-400 block mt-1">
              100% sortation accuracy • Ramp nominal
            </span>
          </div>
        </div>

        {/* 2. Flight Information Display System (FIDS) */}
        <div className="bg-[#0D1014]/90 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 shadow-card space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-[#F4F4F5] flex items-center gap-2">
                <Plane className="w-4 h-4 text-[#F28C18]" />
                Live Flight Information Display System (FIDS)
              </h3>
              <p className="text-[11px] text-[#8B9199]">
                Showing scheduled departures from Terminal 3 with real-time ML delay predictions
              </p>
            </div>

            {/* Search & Status Filters */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8B9199]" />
                <input
                  type="text"
                  placeholder="Search flight, airline, gate..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-[#F4F4F5] placeholder-[#8B9199] focus:outline-none w-56"
                />
              </div>

              <div className="flex items-center gap-1 bg-white/5 border border-white/10 p-1 rounded-xl text-xs">
                {(['ALL', 'DELAYED', 'ON_TIME'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setStatusFilter(filter)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                      statusFilter === filter
                        ? 'bg-[#F28C18] text-black font-bold'
                        : 'text-[#8B9199] hover:text-[#F4F4F5]'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* FIDS Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/[0.08] text-[#8B9199] text-[10px] uppercase font-mono">
                  <th className="py-2.5 px-3">Flight</th>
                  <th className="py-2.5 px-3">Airline</th>
                  <th className="py-2.5 px-3">Destination</th>
                  <th className="py-2.5 px-3">Scheduled</th>
                  <th className="py-2.5 px-3">Gate</th>
                  <th className="py-2.5 px-3">Aircraft</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">ML Delay Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredFlights.slice(0, 15).map((f) => (
                  <tr key={f.flight_id} className="hover:bg-white/[0.02]">
                    <td className="py-3 px-3 font-mono font-bold text-[#F4F4F5]">{f.flight_id}</td>
                    <td className="py-3 px-3 text-[#F4F4F5] font-medium">{f.airline_name}</td>
                    <td className="py-3 px-3 font-mono font-semibold text-sky-400">DEL → {f.destination_airport}</td>
                    <td className="py-3 px-3 font-mono text-[#8B9199]">{f.scheduled_departure.slice(11, 16)}</td>
                    <td className="py-3 px-3 font-mono font-bold text-[#F28C18]">{f.gate}</td>
                    <td className="py-3 px-3 font-mono text-white/70">{f.aircraft_type} ({f.tail_number})</td>
                    <td className="py-3 px-3">
                      {f.is_delayed ? (
                        <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 font-bold font-mono text-[10px] border border-red-500/30">
                          Delayed (+{f.delay_minutes}m)
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold font-mono text-[10px] border border-emerald-500/30">
                          On-Time
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right font-mono">
                      <span className={`font-bold ${
                        (f.predicted_delay_prob || 0) > 60 ? 'text-red-400' : (f.predicted_delay_prob || 0) > 30 ? 'text-amber-400' : 'text-emerald-400'
                      }`}>
                        {f.predicted_delay_prob || 15}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. Operational Ground Support & Baggage Hub */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#0D1014]/90 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 shadow-card space-y-3">
            <h3 className="text-sm font-bold text-[#F4F4F5] flex items-center gap-2">
              <Luggage className="w-4 h-4 text-[#F28C18]" />
              Baggage Carousel Logistics (DEL Terminal 3)
            </h3>
            <div className="space-y-2 text-xs">
              {[
                { belt: 'Carousel C12', flight: 'AF-3841 / UK-633', bags: '420 bags', status: 'UNLOADING', speed: '1.2 m/s' },
                { belt: 'Carousel C14', flight: 'BA-6017', bags: '310 bags', status: 'ACTIVE', speed: '1.1 m/s' },
                { belt: 'Carousel C18', flight: 'SQ-3327', bags: '540 bags', status: 'SCHEDULED', speed: 'STANDBY' },
              ].map((item, i) => (
                <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#F4F4F5] block">{item.belt} • {item.flight}</span>
                    <span className="text-[11px] text-[#8B9199]">{item.bags} • Velocity: {item.speed}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-[#F28C18]/15 border border-[#F28C18]/30 text-[10px] font-mono text-[#F28C18] font-bold">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#0D1014]/90 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 shadow-card space-y-3">
            <h3 className="text-sm font-bold text-[#F4F4F5] flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              Security Screening Lane Real-Time Status
            </h3>
            <div className="space-y-2 text-xs">
              {[
                { lane: 'Lane 1 (XRAY-1)', officer: 'RET-0KANP', queue: '180s', throughput: '400 pax/hr', state: 'NORMAL' },
                { lane: 'Lane 3 (XRAY-2)', officer: 'RET-2EQ36', queue: '210s', throughput: '380 pax/hr', state: 'NORMAL' },
                { lane: 'Lane 7 (Fast-Track)', officer: 'CC-KAK8T', queue: '90s', throughput: '450 pax/hr', state: 'OPTIMAL' },
              ].map((item, i) => (
                <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#F4F4F5] block">{item.lane} • Officer {item.officer}</span>
                    <span className="text-[11px] text-[#8B9199]">Queue: {item.queue} • Throughput: {item.throughput}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-mono text-emerald-400 font-bold">
                    {item.state}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
