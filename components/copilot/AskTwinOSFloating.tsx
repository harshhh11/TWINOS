'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  X,
  Send,
  Sparkles,
  ArrowRight,
  GitFork,
  Box,
  Cpu,
  Zap,
  TrendingUp,
  Activity,
  BarChart3,
  Bot,
  Users,
  ShieldAlert,
  Shield,
  HeartPulse,
} from 'lucide-react';
import { useTwinStore } from '@/lib/twin/twinStateStore';
import { answerTwinOSQuery } from '@/lib/ai/copilotService';
import { CopilotAction } from '@/types';

const SUGGESTED_PROMPTS = [
  'What is happening at Gate B14?',
  'Why is Terminal B crowded?',
  'Which assets require attention?',
  'What does the prediction indicate?',
  'Executive operational summary',
];

export function AskTwinOSFloating() {
  const {
    isCopilotOpen,
    setCopilotOpen,
    copilotMessages,
    addCopilotMessage,
    focusEntity,
    incidents,
    markers,
    assets,
    activeEmergency,
    setEmergencyDrawerOpen,
    focusEmergencyLocation,
    crowdTerminals,
    setCrowdMode,
    setSelectedCrowdTerminal,
  } = useTwinStore();

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeModel, setActiveModel] = useState('Gemini 2.5 Flash');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const termB = crowdTerminals['terminal-b'];
  const secZone2 = termB?.zones.find((z) => z.id === 'sec-zone-2');

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [copilotMessages, isTyping]);

  if (!isCopilotOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    // Add user message
    addCopilotMessage({
      role: 'user',
      content: query,
    });
    setInput('');
    setIsTyping(true);

    const historyPayload = copilotMessages.slice(-4).map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }));

    const contextPayload = {
      markers: markers.map((m) => ({
        id: m.id,
        name: m.name,
        type: m.type,
        status: m.status,
        occupancyPercent: m.occupancyPercent,
        riskLevel: m.riskLevel,
        energyKwh: m.energyKwh,
        aiInsight: m.aiInsight,
        position: m.position,
      })),
      assets: assets.map((a) => ({
        id: a.id,
        name: a.name,
        category: a.category,
        location: a.location,
        healthScore: a.healthScore,
        failureRisk: a.failureRisk,
        temperature: a.temperature,
        status: a.status,
        powerKw: a.powerKw,
      })),
      incidents: incidents.map((i) => ({
        id: i.id,
        title: i.title,
        severity: i.severity,
        locationName: i.locationName,
        status: i.status,
        aiAnalysis: i.aiAnalysis,
        recommendation: i.recommendation,
      })),
      activeEmergency: activeEmergency
        ? {
            id: activeEmergency.id,
            locationName: activeEmergency.locationName,
            status: activeEmergency.status,
            medicalResponseStatus: activeEmergency.medicalResponseStatus,
            terminalOpsStatus: activeEmergency.terminalOpsStatus,
            accessRouteStatus: activeEmergency.accessRouteStatus,
            turnaroundImpactMin: 18,
            operationalContext: activeEmergency.operationalContext,
            aiRecommendations: activeEmergency.aiRecommendations,
          }
        : null,
      crowdState: {
        selectedTerminal: 'terminal-b',
        terminalBPressure: termB?.pressureScore || 84,
        securityQueue: secZone2?.queueLength || 184,
        securityWaitMin: secZone2?.estimatedWaitMin || 17,
        openLanes: secZone2?.openLanes || 6,
        totalLanes: secZone2?.totalLanes || 8,
        activeHotspot: 'Security Checkpoint Zone 2',
        terminalsSummary:
          'Terminal A: 42% (Normal), Terminal B: 84% (Critical), Terminal C: 51% (Normal), Terminal D: 67% (Attention)',
      },
      overallMetrics: {
        energyKwh: 24320,
        avgAssetHealth: 94.2,
        activeIncidentsCount: incidents.filter((i) => i.status !== 'RESOLVED').length,
        activeRunways: 'Runway 01 (09L/27R) & Runway 02 (09R/27L)',
        primaryHotspots: ['Terminal B Security Zone 2 (84 Pressure)', 'Terminal B HVAC-03 (29.2°C)'],
        predictedPeakLoadPercent: 92,
        timeToPeakMinutes: 25,
      },
    };

    try {
      const res = await fetch('/api/copilot/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          context: contextPayload,
          history: historyPayload,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          if (json.data.modelUsed) {
            setActiveModel(json.data.modelUsed);
          }
          addCopilotMessage({
            role: 'assistant',
            content: json.data.content,
            actions: json.data.actions,
          });
          setIsTyping(false);
          return;
        }
      }
    } catch (err) {
      console.warn('API route call error, falling back to local engine:', err);
    }

    // Client-side fallback
    const fallbackResponse = answerTwinOSQuery(query, {
      activeEmergency,
      crowdState: contextPayload.crowdState,
      activeIncidentsCount: incidents.filter((i) => i.status !== 'RESOLVED').length,
      energyKwh: 24320,
    });

    addCopilotMessage({
      role: 'assistant',
      content: fallbackResponse.content,
      actions: fallbackResponse.actions,
    });
    setIsTyping(false);
  };

  const handleActionClick = (action: CopilotAction) => {
    if (action.actionType === 'FOCUS_TWIN') {
      const targetMarker = markers.find((m) => m.id === action.targetId);
      if (targetMarker) {
        focusEntity(targetMarker.id, targetMarker.position);
      }
      router.push('/');
    } else if (action.actionType === 'OPEN_EMERGENCY') {
      setEmergencyDrawerOpen(true);
      focusEmergencyLocation();
    } else if (action.actionType === 'INSPECT_ZONE') {
      if (action.targetPath) {
        router.push(action.targetPath);
      } else {
        setCrowdMode(true);
        setSelectedCrowdTerminal('terminal-b');
        focusEntity('terminal-b', [-2, 0.4, 4]);
        router.push('/crowd');
      }
    } else if (action.actionType === 'OPEN_INCIDENT') {
      router.push('/incidents');
    } else if (action.actionType === 'VIEW_ASSET') {
      router.push('/assets');
    } else if (action.actionType === 'VIEW_PREDICTION') {
      router.push('/predictions');
    } else if (action.actionType === 'VIEW_ANALYTICS') {
      router.push('/analytics');
    } else if (action.actionType === 'VIEW_MONITORING') {
      router.push('/monitoring');
    } else if (action.actionType === 'ANALYZE_IMPACT') {
      router.push('/dependencies');
    } else if (action.targetPath) {
      router.push(action.targetPath);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[440px] max-h-[640px] h-[580px] bg-[#0D1014]/98 border border-white/[0.12] rounded-2xl shadow-2xl flex flex-col overflow-hidden pointer-events-auto select-none backdrop-blur-2xl">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.08] bg-[#12161E]/95">
        <div className="flex items-center gap-2.5">
          {/* Muted Orange Emblem */}
          <div className="w-7 h-7 rounded-xl bg-[#F28C18]/20 border border-[#F28C18]/50 flex items-center justify-center text-[#F28C18] shadow-sm">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-[#F4F4F5] tracking-wide">
                TwinOS Operational Intelligence
              </span>
              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {activeModel}
              </span>
            </div>
            <span className="text-[10px] text-[#8B9199]">
              Digital Twin Grounded • Decision Support Assistant
            </span>
          </div>
        </div>

        <button
          onClick={() => setCopilotOpen(false)}
          className="p-1 rounded text-[#8B9199] hover:text-[#F4F4F5] hover:bg-white/5 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Live Operational Context Ribbon */}
      <div className="px-3 py-1.5 bg-[#090C10] border-b border-white/[0.06] flex items-center gap-2 overflow-x-auto text-[10px] font-mono no-scrollbar">
        <span className="text-[#71717A] uppercase font-bold shrink-0">Live State:</span>

        {activeEmergency && activeEmergency.status !== 'RESOLVED' && (
          <button
            onClick={() => handleSend('What is happening at Gate B14?')}
            className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30 shrink-0 flex items-center gap-1 hover:bg-rose-500/30 transition-colors cursor-pointer"
          >
            <HeartPulse className="w-3 h-3 text-rose-400 animate-pulse" />
            <span>Gate B14 Emergency</span>
          </button>
        )}

        <button
          onClick={() => handleSend('Why is Terminal B crowded?')}
          className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0 flex items-center gap-1 hover:bg-amber-500/30 transition-colors cursor-pointer"
        >
          <Users className="w-3 h-3 text-amber-400" />
          <span>T-B Crowd: {termB?.pressureScore || 84} Critical</span>
        </button>

        <span className="px-2 py-0.5 rounded-md bg-sky-500/10 text-sky-300 border border-sky-500/20 shrink-0 flex items-center gap-1">
          <Zap className="w-3 h-3 text-sky-400" />
          <span>24.3 MW</span>
        </span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3 text-xs">
        {copilotMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[95%] p-3.5 rounded-xl leading-relaxed whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-[#1D1711] text-[#F4F4F5] border border-[#F28C18]/30 shadow-sm'
                  : 'bg-[#12161E] text-[#F4F4F5]/90 border border-white/[0.08] shadow-sm'
              }`}
            >
              {msg.content}
            </div>

            {/* Contextual Action Buttons */}
            {msg.actions && msg.actions.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5 max-w-[98%]">
                {msg.actions.map((act, i) => (
                  <button
                    key={i}
                    onClick={() => handleActionClick(act)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#181D26] hover:bg-[#202733] border border-white/10 hover:border-[#F28C18]/50 text-[#F4F4F5] text-[10px] font-medium transition-all cursor-pointer shadow-sm group"
                  >
                    {act.actionType === 'FOCUS_TWIN' && <Box className="w-3 h-3 text-[#F28C18]" />}
                    {act.actionType === 'OPEN_EMERGENCY' && <ShieldAlert className="w-3 h-3 text-rose-400 animate-pulse" />}
                    {act.actionType === 'INSPECT_ZONE' && <Users className="w-3 h-3 text-rose-400" />}
                    {act.actionType === 'OPEN_INCIDENT' && <Shield className="w-3 h-3 text-amber-400" />}
                    {act.actionType === 'ANALYZE_IMPACT' && <GitFork className="w-3 h-3 text-[#F28C18]" />}
                    {act.actionType === 'VIEW_ASSET' && <Cpu className="w-3 h-3 text-[#F28C18]" />}
                    {act.actionType === 'VIEW_PREDICTION' && <TrendingUp className="w-3 h-3 text-cyan-400" />}
                    {act.actionType === 'VIEW_ANALYTICS' && <BarChart3 className="w-3 h-3 text-amber-400" />}
                    {act.actionType === 'VIEW_MONITORING' && <Activity className="w-3 h-3 text-emerald-400" />}
                    <span>{act.label}</span>
                    <ArrowRight className="w-2.5 h-2.5 text-[#8B9199] group-hover:translate-x-0.5 transition-transform" />
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-[#12161E] border border-white/[0.08] w-28">
            <Bot className="w-3.5 h-3.5 text-[#F28C18] animate-pulse" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#F28C18] animate-bounce" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#F28C18] animate-bounce [animation-delay:0.15s]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#F28C18] animate-bounce [animation-delay:0.3s]" />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-3 py-2 bg-[#12161E]/90 border-t border-white/[0.08] flex gap-1.5 overflow-x-auto no-scrollbar">
        {SUGGESTED_PROMPTS.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSend(prompt)}
            className="shrink-0 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-[#1D1711] hover:border-[#F28C18]/40 text-[#8B9199] hover:text-[#F4F4F5] text-[10px] font-medium transition-colors cursor-pointer border border-white/5"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-3 border-t border-white/[0.08] bg-[#0D1014]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask TwinOS about emergencies, crowd pressure, assets, predictions..."
            className="flex-1 px-3.5 py-2 bg-[#12161E] border border-white/[0.08] rounded-xl text-xs text-[#F4F4F5] placeholder-[#626870] focus:outline-none focus:border-[#F28C18] transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="p-2.5 rounded-xl bg-[#F28C18] hover:bg-[#ff9a2e] disabled:opacity-30 text-black font-bold transition-all cursor-pointer shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
