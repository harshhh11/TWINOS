'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  X,
  Send,
  Sparkles,
  ArrowRight,
  Layers,
  Box,
  Cpu,
  Video,
} from 'lucide-react';
import { useTwinStore } from '@/lib/twin/twinStateStore';
import { answerTwinOSQuery } from '@/lib/ai/copilotService';
import { CopilotAction } from '@/types';

const SUGGESTED_PROMPTS = [
  'Why is Terminal B congested?',
  'What incidents are currently active?',
  'Which assets are at high risk?',
  'What is causing the peak energy usage?',
  'Summarize the current airport status',
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
    }, 450);
  };

  const handleActionClick = (action: CopilotAction) => {
    if (action.actionType === 'FOCUS_TWIN') {
      const targetMarker = markers.find((m) => m.id === action.targetId);
      if (targetMarker) {
        focusEntity(targetMarker.id, targetMarker.position);
      }
    } else if (action.actionType === 'ANALYZE_IMPACT') {
      router.push('/impact-analysis');
    } else if (action.actionType === 'VIEW_ASSET') {
      router.push('/assets');
    } else if (action.actionType === 'VIEW_CAMERA') {
      router.push('/live-monitoring');
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 max-h-[580px] h-[520px] bg-[#111418] border border-[#262B31] rounded-2xl shadow-card flex flex-col overflow-hidden pointer-events-auto select-none">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#262B31] bg-[#14181D]">
        <div className="flex items-center gap-2.5">
          {/* Amber Orb Icon */}
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#9A4B00] via-[#F28C18] to-[#FFD188] flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-white/60 blur-[0.5px] -mt-1 -ml-1" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-[#F2F3F5] tracking-wide flex items-center gap-1">
              Ask TwinOS <span className="text-[9px] text-[#F28C18] font-mono">AI</span>
            </span>
            <span className="text-[9px] text-[#10B981] flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-[#10B981]" />
              Digital Twin Telemetry Connected
            </span>
          </div>
        </div>

        <button
          onClick={() => setCopilotOpen(false)}
          className="p-1 rounded text-[#8D939B] hover:text-[#F2F3F5] hover:bg-[#1C2128] transition-colors cursor-pointer"
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
                  ? 'bg-[#1C2128] text-[#F2F3F5] border border-[#262B31]'
                  : 'bg-[#14181D] text-[#F2F3F5]/90 border border-[#262B31]'
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
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#1C2128] hover:bg-[#252B35] border border-[#262B31] text-[#F2F3F5] text-[10px] font-medium transition-colors cursor-pointer"
                  >
                    {act.actionType === 'FOCUS_TWIN' && <Box className="w-3 h-3 text-[#F28C18]" />}
                    {act.actionType === 'ANALYZE_IMPACT' && (
                      <Layers className="w-3 h-3 text-[#F28C18]" />
                    )}
                    {act.actionType === 'VIEW_ASSET' && <Cpu className="w-3 h-3 text-[#F28C18]" />}
                    {act.actionType === 'VIEW_CAMERA' && <Video className="w-3 h-3 text-[#F28C18]" />}
                    <span>{act.label}</span>
                    <ArrowRight className="w-2.5 h-2.5 text-[#8D939B]" />
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-1.5 p-2 rounded-lg bg-[#14181D] border border-[#262B31] w-16">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F28C18] animate-bounce" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#F28C18] animate-bounce [animation-delay:0.15s]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#F28C18] animate-bounce [animation-delay:0.3s]" />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-3 py-1.5 bg-[#14181D] border-t border-[#262B31] flex gap-1.5 overflow-x-auto no-scrollbar">
        {SUGGESTED_PROMPTS.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSend(prompt)}
            className="shrink-0 px-2 py-0.5 rounded bg-[#1C2128] hover:bg-[#252B35] text-[#8D939B] hover:text-[#F2F3F5] text-[9px] font-medium transition-colors cursor-pointer border border-[#262B31]"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-2.5 border-t border-[#262B31] bg-[#111418]">
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
            placeholder="Ask about Twin status, incidents, assets..."
            className="flex-1 px-3 py-1.5 bg-[#14181D] border border-[#262B31] rounded-lg text-xs text-[#F2F3F5] placeholder-[#626870] focus:outline-none focus:border-[#F28C18] transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="p-2 rounded-lg bg-[#F28C18] hover:bg-[#E07D10] disabled:opacity-40 text-[#0B0D0F] font-bold transition-colors cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
