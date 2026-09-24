'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useTwinStore } from '@/lib/twin/twinStateStore';

export function LiveCameraFeedCard() {
  const { cameraFeeds, activeCameraId } = useTwinStore();
  const currentFeed = cameraFeeds.find((c) => c.id === activeCameraId) || cameraFeeds[0];

  return (
    <div className="w-[260px] rounded-2xl bg-[#11151A]/88 backdrop-blur-md border border-white/[0.08] p-2 select-none pointer-events-auto shadow-card">
      {/* Header */}
      <div className="flex items-center justify-between mb-1 px-1">
        <h3 className="text-xs font-semibold text-[#F4F4F5]">Live Camera Feed</h3>
        <Link
          href="/live-monitoring"
          className="text-[10px] font-medium text-[#8B9199] hover:text-[#F4F4F5] flex items-center gap-1 transition-colors"
        >
          <span>View All</span>
          <ArrowRight className="w-2.5 h-2.5" />
        </Link>
      </div>

      {/* CCTV Frame */}
      <div className="relative w-full h-[92px] rounded-xl overflow-hidden bg-[#0A0D11] border border-white/[0.08] group">
        {/* Realistic Airport Security Checkpoint CCTV Scene */}
        <div 
          className="absolute inset-0 bg-cover bg-center overflow-hidden"
          style={{ backgroundImage: 'url(/cctv-checkpoint.jpg)' }}
        >
          {/* Subtle surveillance scanline tint */}
          <div className="absolute inset-0 bg-[#0F172A]/20 pointer-events-none" />

          {/* AI Bounding Box Overlay */}
          <div className="absolute left-[38%] top-[25%] w-[22%] h-[60%] border border-[#10B981] rounded-sm bg-[#10B981]/10 pointer-events-none">
            <span className="text-[8px] font-mono font-bold text-[#10B981] px-1 bg-[#080A0D]/90 absolute -top-3.5 left-0 rounded">
              PERSON 0.94
            </span>
          </div>
        </div>

        {/* Bottom CCTV Meta Bar */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent px-2.5 py-1.5 flex items-center justify-between text-[10px]">
          <span className="text-[10px] font-medium text-[#F4F4F5]">
            {currentFeed.name}
          </span>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
            <span className="text-[9px] font-semibold text-[#10B981]">Live</span>
          </div>
        </div>
      </div>
    </div>
  );
}
