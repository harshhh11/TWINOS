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
      router.push('/monitoring');
    } else if (action.actionType === 'VIEW_ASSET') {
      router.push('/monitoring');
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 max-h-[580px] h-[520px] bg-[#0C121E]/95 backdrop-blur-2xl border border-white/[0.1] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden pointer-events-auto select-none text-white animate-in fade-in slide-in-from-bottom-4 duration-200">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/[0.08] bg-white/[0.02]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FF7A1A] to-[#E55310] flex items-center justify-center text-white shadow-[0_2px_10px_rgba(242,106,33,0.4)]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-white tracking-tight">
              TwinOS AI Copilot
            </span>
            <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Connected to Digital Twin Telemetry
            </span>
          </div>
        </div>

        <button
          onClick={() => setCopilotOpen(false)}
          className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
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
                  ? 'bg-[#F26A21]/20 text-white border border-[#F26A21]/40'
                  : 'bg-white/[0.04] text-gray-200 border border-white/[0.06]'
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
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] text-white text-[11px] font-semibold transition-colors cursor-pointer shadow-sm"
                  >
                    {act.actionType === 'FOCUS_TWIN' && <Box className="w-3 h-3 text-[#F26A21]" />}
                    {act.actionType === 'ANALYZE_IMPACT' && <GitFork className="w-3 h-3 text-[#F26A21]" />}
                    {act.actionType === 'VIEW_ASSET' && <Cpu className="w-3 h-3 text-[#F26A21]" />}
                    <span>{act.label}</span>
                    <ArrowRight className="w-2.5 h-2.5 text-gray-400" />
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-1.5 p-2 rounded-xl bg-white/[0.04] border border-white/[0.06] w-16">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F26A21] animate-bounce" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#F26A21] animate-bounce [animation-delay:0.15s]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#F26A21] animate-bounce [animation-delay:0.3s]" />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-3.5 py-2 bg-white/[0.02] border-t border-white/[0.06] flex gap-1.5 overflow-x-auto no-scrollbar">
        {SUGGESTED_PROMPTS.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSend(prompt)}
            className="shrink-0 px-2.5 py-1 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-gray-400 hover:text-white text-[10px] font-medium transition-colors cursor-pointer border border-white/[0.06]"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-3 border-t border-white/[0.08] bg-white/[0.02]">
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
            className="flex-1 px-3.5 py-2 bg-white/[0.04] border border-white/[0.08] focus:border-[#F26A21] rounded-2xl text-xs text-white placeholder-gray-500 focus:outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="p-2.5 rounded-2xl bg-[#F26A21] hover:bg-[#EA580C] disabled:opacity-30 text-white font-bold transition-colors cursor-pointer shadow-[0_2px_10px_rgba(242,106,33,0.3)]"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
