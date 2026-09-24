'use client';

import React from 'react';
import { Plus, Minus, Layers, RotateCcw } from 'lucide-react';
import { useTwinStore } from '@/lib/twin/twinStateStore';

export function CompassControlWidget() {
  const { is2DView, toggle2DView, resetCamera } = useTwinStore();

  return (
    <div className="flex flex-col items-center gap-1.5 p-1.5 bg-[#11151A] border border-white/[0.08] rounded-full shadow-card select-none pointer-events-auto">
      {/* 1. Compass Dial */}
      <button
        onClick={resetCamera}
        title="Reset Camera & Align North"
        className="w-8 h-8 rounded-full bg-[#151A21] hover:bg-[#1E2530] border border-white/[0.08] flex items-center justify-center text-[#F4F4F5] transition-all cursor-pointer shadow-sm group"
      >
        <div className="relative w-4 h-4 flex items-center justify-center">
          <div className="w-0.5 h-2 bg-[#EF4444] rounded-t-full absolute top-0" />
          <div className="w-0.5 h-2 bg-[#8B9199] rounded-b-full absolute bottom-0" />
          <span className="text-[7px] font-bold text-[#EF4444] absolute -top-1.5">N</span>
        </div>
      </button>

      {/* 2. 2D / 3D Toggle */}
      <button
        onClick={toggle2DView}
        title="Toggle 2D / 3D"
        className={`w-8 h-8 rounded-full text-[11px] font-bold border transition-all cursor-pointer flex items-center justify-center shadow-sm ${
          is2DView
            ? 'bg-[#1E2530] text-[#F28C18] border-[#F28C18]'
            : 'bg-[#151A21] text-[#8B9199] hover:text-[#F4F4F5] border-white/[0.08]'
        }`}
      >
        2D
      </button>

      {/* 3. Zoom In */}
      <button
        onClick={() => {
          const event = new WheelEvent('wheel', { deltaY: -200 });
          window.dispatchEvent(event);
        }}
        title="Zoom In"
        className="w-8 h-8 rounded-full bg-[#151A21] hover:bg-[#1E2530] border border-white/[0.08] flex items-center justify-center text-[#8B9199] hover:text-[#F4F4F5] transition-all cursor-pointer shadow-sm"
      >
        <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
      </button>

      {/* 4. Zoom Out */}
      <button
        onClick={() => {
          const event = new WheelEvent('wheel', { deltaY: 200 });
          window.dispatchEvent(event);
        }}
        title="Zoom Out"
        className="w-8 h-8 rounded-full bg-[#151A21] hover:bg-[#1E2530] border border-white/[0.08] flex items-center justify-center text-[#8B9199] hover:text-[#F4F4F5] transition-all cursor-pointer shadow-sm"
      >
        <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
      </button>

      {/* 5. Reset View / Layers */}
      <button
        onClick={resetCamera}
        title="Reset Perspective"
        className="w-8 h-8 rounded-full bg-[#151A21] hover:bg-[#1E2530] border border-white/[0.08] flex items-center justify-center text-[#8B9199] hover:text-[#F4F4F5] transition-all cursor-pointer shadow-sm"
      >
        <Layers className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
