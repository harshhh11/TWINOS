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
} from 'lucide-react';
import { useTwinStore } from '@/lib/twin/twinStateStore';
import { answerTwinOSQuery } from '@/lib/ai/copilotService';
import { CopilotAction } from '@/types';

const SUGGESTED_PROMPTS = [
  'Which assets require attention?',
  'What incidents are currently active?',
  'Why is energy consumption increasing?',
  'What systems are affected by this asset?',
  "Summarize today's operational issues.",
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
  } = useTwinStore();

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [copilotMessages, isTyping]);

  if (!isCopilotOpen) return null;

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    addCopilotMessage({
      role: 'user',
      content: query,
    });
    setInput('');
    setIsTyping(true);

    const terminalA = markers.find((m) => m.id === 'terminal-a');
    const terminalB = markers.find((m) => m.id === 'terminal-b');

    setTimeout(() => {
      const response = answerTwinOSQuery(query, {
        terminalAOccupancy: terminalA?.occupancyPercent || 72,
        terminalBOccupancy: terminalB?.occupancyPercent || 88,
        activeIncidentsCount: incidents.filter((i) => i.status !== 'RESOLVED').length,
        energyKwh: 24320,
      });

      addCopilotMessage({
        role: 'assistant',
        content: response.content,
        actions: response.actions,
      });
      setIsTyping(false);
    }, 400);
  };

  const handleActionClick = (action: CopilotAction) => {
    if (action.actionType === 'FOCUS_TWIN') {
      const targetMarker = markers.find((m) => m.id === action.targetId);
      if (targetMarker) {
        focusEntity(targetMarker.id, targetMarker.position);
      }
      router.push('/');
    } else if (action.actionType === 'ANALYZE_IMPACT') {
      router.push('/dependencies');
    } else if (action.actionType === 'VIEW_ASSET') {
      router.push('/assets');
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 max-h-[580px] h-[520px] bg-white border border-[#E2E8F0] rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] flex flex-col overflow-hidden pointer-events-auto select-none">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#E2E8F0] bg-[#F8FAFC]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#EA580C] to-[#FB923C] flex items-center justify-center text-white shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-[#0F172A] tracking-tight">
              TwinOS AI Copilot
            </span>
            <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Connected to Digital Twin Telemetry
            </span>
          </div>
        </div>

        <button
          onClick={() => setCopilotOpen(false)}
          className="p-1.5 rounded-full text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#E2E8F0] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
        {copilotMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[90%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-[#FFF7ED] text-[#0F172A] border border-[#FFEDD5]'
                  : 'bg-[#F8FAFC] text-[#1E293B] border border-[#E2E8F0]'
              }`}
            >
              {msg.content}
            </div>

            {/* Contextual Action Buttons */}
            {msg.actions && msg.actions.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5 max-w-[95%]">
                {msg.actions.map((act, i) => (
                  <button
                    key={i}
                    onClick={() => handleActionClick(act)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#F1F5F9] border border-[#E2E8F0] text-[#0F172A] text-[11px] font-semibold transition-colors cursor-pointer shadow-2xs"
                  >
                    {act.actionType === 'FOCUS_TWIN' && <Box className="w-3 h-3 text-[#EA580C]" />}
                    {act.actionType === 'ANALYZE_IMPACT' && <GitFork className="w-3 h-3 text-[#EA580C]" />}
                    {act.actionType === 'VIEW_ASSET' && <Cpu className="w-3 h-3 text-[#EA580C]" />}
                    <span>{act.label}</span>
                    <ArrowRight className="w-2.5 h-2.5 text-[#94A3B8]" />
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-1.5 p-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] w-16">
            <span className="w-1.5 h-1.5 rounded-full bg-[#EA580C] animate-bounce" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#EA580C] animate-bounce [animation-delay:0.15s]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#EA580C] animate-bounce [animation-delay:0.3s]" />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-3.5 py-2 bg-[#F8FAFC] border-t border-[#E2E8F0] flex gap-1.5 overflow-x-auto no-scrollbar">
        {SUGGESTED_PROMPTS.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSend(prompt)}
            className="shrink-0 px-2.5 py-1 rounded-xl bg-white hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A] text-[10px] font-semibold transition-colors cursor-pointer border border-[#E2E8F0]"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-3 border-t border-[#E2E8F0] bg-white">
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
            placeholder="Ask about Twin status, incidents, assets, energy..."
            className="flex-1 px-3.5 py-2 bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#EA580C] rounded-2xl text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="p-2.5 rounded-2xl bg-[#EA580C] hover:bg-[#C2410C] disabled:opacity-30 text-white font-bold transition-colors cursor-pointer shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
