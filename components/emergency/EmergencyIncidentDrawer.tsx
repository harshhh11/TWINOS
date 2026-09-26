'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  HeartPulse,
  Clock,
  MapPin,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Sparkles,
  ExternalLink,
  Users,
  Plane,
  Building,
  Radio,
  FileText,
  Download,
  Send,
  Zap,
  Navigation,
  Video,
  Activity,
  UserCheck,
} from 'lucide-react';
import { useTwinStore } from '@/lib/twin/twinStateStore';
import { exportAuditReportJson } from '@/lib/emergency/emergencyService';
import { EmergencyLifecycleStatus, MedicalResponseStatus, TerminalOpsStatus } from '@/types';

export function EmergencyIncidentDrawer() {
  const {
    activeEmergency,
    isEmergencyDrawerOpen,
    setEmergencyDrawerOpen,
    acknowledgeEmergency,
    setPendingConfirmation,
    updateMedicalResponseStatus,
    updateTerminalOpsStatus,
    updateAccessRouteStatus,
    addEmergencyNote,
    escalateEmergency,
    setResolveModalOpen,
    focusEmergencyLocation,
  } = useTwinStore();

  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'COORDINATION' | 'TIMELINE' | 'AUDIT'>('OVERVIEW');
  const [elapsedTime, setElapsedTime] = useState('00:00:00');
  const [newNoteText, setNewNoteText] = useState('');
  const [adminAuthor, setAdminAuthor] = useState('H. Shereef (Duty Manager)');

  // Elapsed timer ticker
  useEffect(() => {
    if (!activeEmergency || activeEmergency.status === 'RESOLVED') return;

    const updateTimer = () => {
      const now = Date.now();
      const diffMs = Math.max(0, now - activeEmergency.reportedTimestamp);
      const totalSec = Math.floor(diffMs / 1000);
      const hours = Math.floor(totalSec / 3600).toString().padStart(2, '0');
      const minutes = Math.floor((totalSec % 3600) / 60).toString().padStart(2, '0');
      const seconds = (totalSec % 60).toString().padStart(2, '0');
      setElapsedTime(`${hours}:${minutes}:${seconds}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [activeEmergency]);

  if (!isEmergencyDrawerOpen || !activeEmergency) return null;

  const handleAcknowledge = () => {
    acknowledgeEmergency(adminAuthor);
  };

  const handleTriggerAction = (rec: any) => {
    setPendingConfirmation({
      title: rec.actionLabel,
      description: rec.description,
      recipient: rec.targetRecipient,
      impact: rec.expectedImpact,
      actionType: rec.actionType,
      onConfirm: (notes?: string) => {
        useTwinStore.getState().approveEmergencyRecommendation(rec.id, adminAuthor, notes);
      },
    });
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    addEmergencyNote(newNoteText.trim(), adminAuthor);
    setNewNoteText('');
  };

  const handleEscalate = () => {
    setPendingConfirmation({
      title: 'Escalate to Level-2 Operations Priority',
      description:
        'Elevate incident priority to Airport-Wide Level-2. Dispatches secondary medical triage unit, alerts Airport Operations Center (AOC), and stages dedicated ambulance at Apron Gate B14.',
      recipient: 'Airport Operations Center (AOC) & City Emergency Services',
      impact: 'Activates airport-wide emergency dispatch protocol and restricts apron transit near Gate B14.',
      actionType: 'ESCALATION',
      isDangerous: true,
      onConfirm: (notes?: string) => {
        escalateEmergency(notes || 'Passenger condition warrants secondary emergency response escalation.', adminAuthor);
      },
    });
  };

  const stages: { key: EmergencyLifecycleStatus; label: string }[] = [
    { key: 'REPORTED', label: 'Reported' },
    { key: 'ACKNOWLEDGED', label: 'Acknowledged' },
    { key: 'RESPONSE_INITIATED', label: 'Action Approved' },
    { key: 'RESPONDING', label: 'Responding' },
    { key: 'RESOLVED', label: 'Resolved' },
  ];

  const currentStageIndex = stages.findIndex((s) => s.key === activeEmergency.status);

  return (
    <aside className="fixed inset-y-0 right-0 z-40 w-full sm:w-[540px] lg:w-[600px] bg-[#0A0D11]/98 backdrop-blur-3xl border-l border-white/[0.12] shadow-[-20px_0_60px_rgba(0,0,0,0.85)] flex flex-col pointer-events-auto select-none animate-in slide-in-from-right duration-300">
      {/* ===================================================================== */}
      {/* DRAWER TOP BAR: INCIDENT IDENTITY, TIME ELAPSED, LIFECYCLE CHIP       */}
      {/* ===================================================================== */}
      <div className="p-4 border-b border-white/[0.08] bg-[#0D1014]/90 shrink-0">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-2xl flex items-center justify-center ${
                activeEmergency.status === 'RESOLVED'
                  ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
                  : 'bg-red-500/20 border border-red-500/40 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.3)]'
              }`}
            >
              <HeartPulse
                className={`w-5 h-5 ${activeEmergency.status !== 'RESOLVED' ? 'animate-pulse' : ''}`}
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-[#F4F4F5]">
                  {activeEmergency.incidentNumber}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                    activeEmergency.status === 'RESOLVED'
                      ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
                      : activeEmergency.status === 'RESPONDING'
                      ? 'bg-sky-500/20 border border-sky-500/40 text-sky-400'
                      : activeEmergency.status === 'RESPONSE_INITIATED'
                      ? 'bg-orange-500/20 border border-orange-500/40 text-orange-400'
                      : activeEmergency.status === 'ACKNOWLEDGED'
                      ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300'
                      : 'bg-red-500/20 border border-red-500/40 text-red-400 animate-pulse'
                  }`}
                >
                  {activeEmergency.status.replace(/_/g, ' ')}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-white/5 border border-white/10 text-red-400">
                  {activeEmergency.severity}
                </span>
              </div>
              <h2 className="text-sm font-bold text-[#F4F4F5] mt-0.5">
                {activeEmergency.locationName}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={focusEmergencyLocation}
              title="Focus 3D Viewport on Gate B14"
              className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-[#F4F4F5] flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5 text-[#F28C18]" />
              <span className="text-[11px] hidden sm:inline">Focus Twin</span>
            </button>
            <button
              onClick={() => setEmergencyDrawerOpen(false)}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#8B9199] hover:text-[#F4F4F5] transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Timer & Reported Source Bar */}
        <div className="flex items-center justify-between text-xs px-3 py-2 rounded-xl bg-white/[0.02] border border-white/[0.06]">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px] text-[#8B9199]">Elapsed Response Time:</span>
            <span className="text-xs font-mono font-bold text-[#F4F4F5]">
              {activeEmergency.status === 'RESOLVED' ? `${Math.round((activeEmergency.metrics?.totalResolutionTimeSec || 660) / 60)} min (Final)` : elapsedTime}
            </span>
          </div>

          <span className="text-[10px] text-[#8B9199] font-mono">
            Reported: {activeEmergency.reportedAt}
          </span>
        </div>

        {/* 5-Stage Lifecycle Progress Bar */}
        <div className="mt-3 pt-2 border-t border-white/[0.06]">
          <div className="grid grid-cols-5 gap-1.5">
            {stages.map((st, idx) => {
              const isPassed = currentStageIndex >= idx;
              const isCurrent = currentStageIndex === idx;
              return (
                <div key={st.key} className="flex flex-col gap-1">
                  <div
                    className={`h-1.5 rounded-full transition-all ${
                      isCurrent
                        ? 'bg-[#F28C18] shadow-[0_0_8px_#F28C18]'
                        : isPassed
                        ? 'bg-emerald-500'
                        : 'bg-white/10'
                    }`}
                  />
                  <span
                    className={`text-[9px] font-mono tracking-tight truncate text-center ${
                      isCurrent
                        ? 'text-[#F28C18] font-bold'
                        : isPassed
                        ? 'text-emerald-400'
                        : 'text-[#8B9199]'
                    }`}
                  >
                    {st.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Drawer Tabs */}
        <div className="flex items-center gap-1 mt-3 bg-white/5 p-1 rounded-xl border border-white/10 text-xs">
          {[
            { id: 'OVERVIEW' as const, label: 'Context & AI Guidance' },
            { id: 'COORDINATION' as const, label: 'Response Tracking' },
            { id: 'TIMELINE' as const, label: `Audit Log (${activeEmergency.timeline.length})` },
            ...(activeEmergency.status === 'RESOLVED' ? [{ id: 'AUDIT' as const, label: 'Resolution SLA' }] : []),
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#F28C18] text-black font-bold shadow-md'
                  : 'text-[#8B9199] hover:text-[#F4F4F5]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ===================================================================== */}
      {/* DRAWER CONTENT BODY                                                   */}
      {/* ===================================================================== */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* TAB 1: OPERATIONAL CONTEXT & AI RECOMMENDATIONS */}
        {activeTab === 'OVERVIEW' && (
          <>
            {/* Operational Context Card */}
            <div className="p-4 rounded-2xl bg-[#0F1318] border border-white/[0.08] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#8B9199] uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#F28C18]" />
                  Operational Environment Context
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-[#8B9199] font-mono">
                  Station B-2: 0.3km
                </span>
              </div>

              {/* Grid Metrics */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <span className="text-[9px] text-[#8B9199] uppercase font-mono block">Nearest Medical Station</span>
                  <span className="text-xs font-bold text-[#F4F4F5] mt-0.5 block">
                    {activeEmergency.operationalContext.nearestMedicalStation}
                  </span>
                  <span className="text-[10px] text-emerald-400 mt-1 block">
                    Transit: ~{activeEmergency.operationalContext.estimatedResponseTimeMinutes} mins
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <span className="text-[9px] text-[#8B9199] uppercase font-mono block">Nearest AED Defibrillator</span>
                  <span className="text-xs font-bold text-[#F4F4F5] mt-0.5 block">
                    {activeEmergency.operationalContext.nearestAEDLocation}
                  </span>
                  <span className="text-[10px] text-sky-400 mt-1 block">
                    Status: Tested & Operational
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <span className="text-[9px] text-[#8B9199] uppercase font-mono block">Passenger Density</span>
                  <span className="text-xs font-bold text-amber-300 mt-0.5 block">
                    High (~{activeEmergency.operationalContext.passengerCountNearby} pax)
                  </span>
                  <span className="text-[10px] text-[#8B9199] mt-1 block">
                    Gate B14 Lounge Area
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <span className="text-[9px] text-[#8B9199] uppercase font-mono block">Impacted Flight</span>
                  <span className="text-xs font-bold text-[#F4F4F5] mt-0.5 block">
                    {activeEmergency.operationalContext.currentFlightImpact.flightNumber} ({activeEmergency.operationalContext.currentFlightImpact.destination})
                  </span>
                  <span className="text-[10px] text-amber-400 mt-1 block">
                    {activeEmergency.operationalContext.currentFlightImpact.boardingStatus}
                  </span>
                </div>
              </div>

              {/* Transit Corridor */}
              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between text-xs">
                <div>
                  <span className="text-[9px] text-[#8B9199] uppercase font-mono block">Primary Access Corridor</span>
                  <span className="text-xs font-bold text-[#F4F4F5]">
                    {activeEmergency.operationalContext.accessRoute.primaryCorridor}
                  </span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {activeEmergency.operationalContext.accessRoute.routeClearanceStatus.split('—')[0]}
                </span>
              </div>

              {/* Simulated CCTV Stream */}
              <div className="p-2.5 rounded-xl bg-black border border-white/[0.1] relative overflow-hidden">
                <div className="flex items-center justify-between mb-1.5 text-[10px] font-mono text-[#8B9199]">
                  <span className="flex items-center gap-1.5 text-red-400 font-bold">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    LIVE FEED: {activeEmergency.operationalContext.cctvFeedId}
                  </span>
                  <span>30 FPS • CONCOURSE B14 CAM</span>
                </div>
                <div className="h-24 bg-gradient-to-br from-[#12161E] via-[#0B0E12] to-black rounded-lg flex items-center justify-center relative border border-white/5">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.08)_0%,transparent_70%)]" />
                  <div className="flex flex-col items-center gap-1 text-[#8B9199] z-10">
                    <Video className="w-5 h-5 text-[#8B9199]" />
                    <span className="text-[9px] font-mono">GATE B14 CONCOURSE SECURE OPTICAL</span>
                    <span className="text-[8px] text-white/40">Timestamp: {new Date().toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Operational Guidance Section */}
            <div className="p-4 rounded-2xl bg-[#12161E] border border-[#F28C18]/30 space-y-3 shadow-lg">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#F28C18]" />
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                      AI Operational Guidance
                    </h3>
                  </div>
                  <p className="text-[10px] text-[#8B9199] mt-0.5">
                    Human Review Required • Decision Support Only — Does Not Autonomously Dispatch
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#F28C18]/15 border border-[#F28C18]/30 text-[#F28C18]">
                  OPERATIONS ONLY
                </span>
              </div>

              {/* Recommendation Cards */}
              <div className="space-y-2.5">
                {activeEmergency.aiRecommendations.map((rec) => {
                  const isApproved = rec.status === 'APPROVED';
                  return (
                    <div
                      key={rec.id}
                      className={`p-3 rounded-xl border transition-all ${
                        isApproved
                          ? 'bg-emerald-950/20 border-emerald-500/30'
                          : 'bg-black/40 border-white/[0.08] hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-1.5">
                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.2 rounded font-mono ${
                                rec.priority === 'URGENT'
                                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                  : rec.priority === 'HIGH'
                                  ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                                  : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                              }`}
                            >
                              {rec.priority}
                            </span>
                            <span className="text-xs font-bold text-white leading-tight">
                              {rec.actionLabel}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#8B9199] mt-1 leading-snug">
                            {rec.description}
                          </p>
                        </div>

                        {/* Action Execution Button */}
                        {isApproved ? (
                          <div className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>EXECUTED</span>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleTriggerAction(rec)}
                            className="shrink-0 px-3 py-1.5 rounded-lg bg-[#F28C18] hover:bg-[#E07D10] text-black font-bold text-[11px] shadow-sm transition-all cursor-pointer flex items-center gap-1"
                          >
                            <span>APPROVE & DISPATCH</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>

                      {/* Operational Rationale Box */}
                      <div className="mt-2 pt-2 border-t border-white/[0.06] text-[10px] flex items-start gap-1.5 text-[#8B9199]">
                        <strong className="text-white/80 shrink-0">Rationale:</strong>
                        <span>{rec.operationalRationale}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* TAB 2: FIELD RESPONSE COORDINATION */}
        {activeTab === 'COORDINATION' && (
          <div className="space-y-4">
            {/* Medical Response Team Status Card */}
            <div className="p-4 rounded-2xl bg-[#0F1318] border border-white/[0.08] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <HeartPulse className="w-4 h-4 text-red-400" />
                  Medical Response Unit
                </span>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                    activeEmergency.medicalResponseStatus === 'ON_SCENE'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : activeEmergency.medicalResponseStatus === 'EN_ROUTE'
                      ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                      : activeEmergency.medicalResponseStatus === 'NOTIFIED'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-white/5 text-[#8B9199] border border-white/10'
                  }`}
                >
                  {activeEmergency.medicalResponseStatus.replace(/_/g, ' ')}
                </span>
              </div>

              <div className="text-xs text-[#8B9199] leading-relaxed">
                Assigned Unit: <strong className="text-white">{activeEmergency.medicalTeamAssigned}</strong>
                <br />
                Location: Station B-2 Concourse Level 2 • Primary Comms: Radio Ch. 1
              </div>

              {/* Status Advance Buttons (Field Simulation) */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => updateMedicalResponseStatus('EN_ROUTE', 'Unit Alpha-2 Lead')}
                  disabled={activeEmergency.medicalResponseStatus === 'EN_ROUTE' || activeEmergency.medicalResponseStatus === 'ON_SCENE'}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    activeEmergency.medicalResponseStatus === 'EN_ROUTE'
                      ? 'bg-sky-500/20 text-sky-300 border-sky-500/40 ring-1 ring-sky-500/30'
                      : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.07] text-[#F4F4F5]'
                  }`}
                >
                  Mark En Route
                </button>

                <button
                  type="button"
                  onClick={() => updateMedicalResponseStatus('ON_SCENE', 'Unit Alpha-2 Lead')}
                  disabled={activeEmergency.medicalResponseStatus === 'ON_SCENE'}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    activeEmergency.medicalResponseStatus === 'ON_SCENE'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 ring-1 ring-emerald-500/30'
                      : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.07] text-[#F4F4F5]'
                  }`}
                >
                  Mark On Scene
                </button>
              </div>
            </div>

            {/* Terminal Operations Status Card */}
            <div className="p-4 rounded-2xl bg-[#0F1318] border border-white/[0.08] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <Building className="w-4 h-4 text-orange-400" />
                  Terminal B Concourse Operations
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-amber-300">
                  {activeEmergency.terminalOpsStatus.replace(/_/g, ' ')}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { key: 'MONITORING' as const, label: 'Monitoring' },
                  { key: 'CROWD_CONTROL_REQUESTED' as const, label: 'Crowd Control' },
                  { key: 'GATE_HOLD_ACTIVE' as const, label: 'Gate Hold Active' },
                  { key: 'CLEAR' as const, label: 'Operations Clear' },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => updateTerminalOpsStatus(item.key)}
                    className={`p-2 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                      activeEmergency.terminalOpsStatus === item.key
                        ? 'bg-orange-500/20 border-orange-500/40 text-orange-300 font-bold'
                        : 'bg-white/[0.02] border-white/[0.08] text-[#8B9199] hover:bg-white/[0.06]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Vertical Transit & Elevator E4 Access */}
            <div className="p-4 rounded-2xl bg-[#0F1318] border border-white/[0.08] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-sky-400" />
                  Elevator E4 & Corridor Access
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-sky-300">
                  {activeEmergency.accessRouteStatus.replace(/_/g, ' ')}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => updateAccessRouteStatus('ELEVATOR_PRIORITY_ACTIVE')}
                  className={`flex-1 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer ${
                    activeEmergency.accessRouteStatus === 'ELEVATOR_PRIORITY_ACTIVE'
                      ? 'bg-sky-500/20 border-sky-500/40 text-sky-300 font-bold'
                      : 'bg-white/[0.02] border-white/[0.08] text-[#8B9199]'
                  }`}
                >
                  Priority Mode Active
                </button>
                <button
                  type="button"
                  onClick={() => updateAccessRouteStatus('STANDARD')}
                  className={`flex-1 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer ${
                    activeEmergency.accessRouteStatus === 'STANDARD'
                      ? 'bg-white/10 border-white/20 text-white font-bold'
                      : 'bg-white/[0.02] border-white/[0.08] text-[#8B9199]'
                  }`}
                >
                  Standard Mode
                </button>
              </div>
            </div>

            {/* Add Free-Text Operational Note */}
            <form onSubmit={handleAddNote} className="p-4 rounded-2xl bg-[#0F1318] border border-white/[0.08] space-y-2.5">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#F28C18]" />
                Log Operational Note to Audit Stream
              </span>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  placeholder="e.g. Paramedic cart arrived at Gate B14 podium. Passenger responsive."
                  className="flex-1 bg-[#151A21] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-[#F4F4F5] focus:outline-none focus:border-[#F28C18]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white transition-all cursor-pointer shrink-0"
                >
                  Add Note
                </button>
              </div>
            </form>

            {/* Escalation Button */}
            {activeEmergency.status !== 'RESOLVED' && (
              <button
                type="button"
                onClick={handleEscalate}
                className="w-full py-2.5 rounded-2xl bg-red-950/40 hover:bg-red-900/50 border border-red-500/40 text-red-300 font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
              >
                <ShieldAlert className="w-4 h-4 text-red-400" />
                <span>ESCALATE INCIDENT (LEVEL-2 PRIORITY)</span>
              </button>
            )}
          </div>
        )}

        {/* TAB 3: DYNAMIC AUDIT TIMELINE */}
        {activeTab === 'TIMELINE' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-[#8B9199] pb-1 border-b border-white/[0.06]">
              <span>Chronological Event Stream</span>
              <span>{activeEmergency.timeline.length} Entries Logged</span>
            </div>

            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
              {activeEmergency.timeline.map((evt) => (
                <div key={evt.id} className="relative group">
                  {/* Dot */}
                  <span
                    className={`absolute -left-6 top-1 w-3 h-3 rounded-full border-2 border-[#0A0D11] ${
                      evt.type === 'RESOLUTION'
                        ? 'bg-emerald-400'
                        : evt.type === 'DISPATCH'
                        ? 'bg-sky-400'
                        : evt.type === 'REPORT'
                        ? 'bg-red-500'
                        : evt.type === 'AI_RECOMMENDATION'
                        ? 'bg-[#F28C18]'
                        : 'bg-amber-400'
                    }`}
                  />

                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-all">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="text-xs font-bold text-white leading-tight">
                        {evt.title}
                      </span>
                      <span className="text-[10px] font-mono text-[#8B9199] shrink-0">
                        {evt.formattedTime}
                      </span>
                    </div>

                    <p className="text-[11px] text-[#8B9199] leading-relaxed">
                      {evt.description}
                    </p>

                    <div className="mt-2 pt-1.5 border-t border-white/[0.04] flex items-center justify-between text-[10px]">
                      <span className="text-[#8B9199]">
                        Actor: <strong className="text-white/80">{evt.actor}</strong>
                      </span>
                      {evt.statusBadge && (
                        <span className="px-1.5 py-0.2 rounded bg-white/5 font-mono text-[9px] text-[#F28C18]">
                          {evt.statusBadge}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: RESOLUTION AUDIT & METRICS */}
        {activeTab === 'AUDIT' && activeEmergency.status === 'RESOLVED' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Incident Resolved & Sealed
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                  SLA COMPLIANT
                </span>
              </div>
              <p className="text-xs text-white/90">
                {activeEmergency.resolutionNotes}
              </p>
              <div className="text-[10px] text-[#8B9199]">
                Closed by: <strong>{activeEmergency.resolvedBy}</strong> at {activeEmergency.resolvedAt}
              </div>
            </div>

            {/* Key SLA Metrics */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <span className="text-[9px] text-[#8B9199] uppercase font-mono block">Time to Acknowledge</span>
                <span className="text-sm font-bold text-white mt-0.5 block">
                  {activeEmergency.metrics?.timeToAcknowledgeSec || 45} sec
                </span>
                <span className="text-[9px] text-emerald-400">Target: &lt; 60 sec</span>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <span className="text-[9px] text-[#8B9199] uppercase font-mono block">Time to Dispatch</span>
                <span className="text-sm font-bold text-white mt-0.5 block">
                  {Math.round((activeEmergency.metrics?.timeToDispatchSec || 75) / 60)} min { (activeEmergency.metrics?.timeToDispatchSec || 75) % 60 } sec
                </span>
                <span className="text-[9px] text-emerald-400">Target: &lt; 2 min</span>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <span className="text-[9px] text-[#8B9199] uppercase font-mono block">Time to On-Scene</span>
                <span className="text-sm font-bold text-white mt-0.5 block">
                  {Math.round((activeEmergency.metrics?.timeToOnSceneSec || 255) / 60)} min { (activeEmergency.metrics?.timeToOnSceneSec || 255) % 60 } sec
                </span>
                <span className="text-[9px] text-emerald-400">Target: &lt; 6 min (Achieved)</span>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <span className="text-[9px] text-[#8B9199] uppercase font-mono block">Total Resolution Time</span>
                <span className="text-sm font-bold text-emerald-400 mt-0.5 block">
                  {Math.round((activeEmergency.metrics?.totalResolutionTimeSec || 660) / 60)} min
                </span>
                <span className="text-[9px] text-white/60">Gate B14 Queue Cleared</span>
              </div>
            </div>

            {/* Export Button */}
            <button
              type="button"
              onClick={() => exportAuditReportJson(activeEmergency)}
              className="w-full py-2.5 rounded-xl bg-[#F28C18] hover:bg-[#E07D10] text-black font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>EXPORT COMPLETE AUDIT REPORT (JSON)</span>
            </button>
          </div>
        )}
      </div>

      {/* ===================================================================== */}
      {/* DRAWER FOOTER: LIFECYCLE ACTION BUTTONS                               */}
      {/* ===================================================================== */}
      <div className="p-4 border-t border-white/[0.08] bg-[#0D1014]/95 shrink-0 flex items-center justify-between gap-3">
        {activeEmergency.status === 'REPORTED' && (
          <button
            type="button"
            onClick={handleAcknowledge}
            className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
          >
            <UserCheck className="w-4 h-4" />
            <span>ACKNOWLEDGE INCIDENT</span>
          </button>
        )}

        {activeEmergency.status !== 'RESOLVED' && (
          <button
            type="button"
            onClick={() => setResolveModalOpen(true)}
            className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>RESOLVE INCIDENT</span>
          </button>
        )}

        {activeEmergency.status === 'RESOLVED' && (
          <button
            type="button"
            onClick={() => exportAuditReportJson(activeEmergency)}
            className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>DOWNLOAD AUDIT REPORT</span>
          </button>
        )}
      </div>
    </aside>
  );
}
