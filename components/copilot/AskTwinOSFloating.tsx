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
    <div className="fixed bottom-6 right-6 z-50 w-96 max-h-[580px] h-[520px] bg-[#0D1014] border border-white/[0.12] rounded-2xl shadow-2xl flex flex-col overflow-hidden pointer-events-auto select-none backdrop-blur-2xl">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.08] bg-[#12161E]">
        <div className="flex items-center gap-2.5">
          {/* Muted Orange Orb Icon */}
          <div className="w-6 h-6 rounded-lg bg-[#F28C18]/20 border border-[#F28C18]/40 flex items-center justify-center text-[#F28C18]">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-[#F4F4F5] tracking-wide flex items-center gap-1">
              TwinOS AI Copilot
            </span>
            <span className="text-[9px] text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Connected to Digital Twin Telemetry
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

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3 text-xs">
        {copilotMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[90%] p-3 rounded-xl leading-relaxed whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-[#1D1711] text-[#F4F4F5] border border-[#F28C18]/30'
                  : 'bg-[#12161E] text-[#F4F4F5]/90 border border-white/[0.08]'
              }`}
            >
              {msg.content}
            </div>

            {/* Contextual Action Buttons */}
            {msg.actions && msg.actions.length > 0 && (
              <div className="mt-1.5 flex flex-wrap gap-1.5 max-w-[95%]">
                {msg.actions.map((act, i) => (
                  <button
                    key={i}
                    onClick={() => handleActionClick(act)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[#F4F4F5] text-[10px] font-medium transition-colors cursor-pointer"
                  >
                    {act.actionType === 'FOCUS_TWIN' && <Box className="w-3 h-3 text-[#F28C18]" />}
                    {act.actionType === 'ANALYZE_IMPACT' && <GitFork className="w-3 h-3 text-[#F28C18]" />}
                    {act.actionType === 'VIEW_ASSET' && <Cpu className="w-3 h-3 text-[#F28C18]" />}
                    <span>{act.label}</span>
                    <ArrowRight className="w-2.5 h-2.5 text-[#8B9199]" />
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-1.5 p-2 rounded-lg bg-[#12161E] border border-white/[0.08] w-16">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F28C18] animate-bounce" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#F28C18] animate-bounce [animation-delay:0.15s]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#F28C18] animate-bounce [animation-delay:0.3s]" />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-3 py-2 bg-[#12161E] border-t border-white/[0.08] flex gap-1.5 overflow-x-auto no-scrollbar">
        {SUGGESTED_PROMPTS.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSend(prompt)}
            className="shrink-0 px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[#8B9199] hover:text-[#F4F4F5] text-[10px] font-medium transition-colors cursor-pointer border border-white/5"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-2.5 border-t border-white/[0.08] bg-[#0D1014]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-1.5"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about Twin status, incidents, assets, energy..."
            className="flex-1 px-3 py-1.5 bg-[#12161E] border border-white/[0.08] rounded-xl text-xs text-[#F4F4F5] placeholder-[#626870] focus:outline-none focus:border-[#F28C18] transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="p-2 rounded-xl bg-[#F28C18] hover:bg-[#ff9a2e] disabled:opacity-30 text-black font-bold transition-colors cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
