'use client';

import React from 'react';
import { Html } from '@react-three/drei';
import { useTwinStore } from '@/lib/twin/twinStateStore';
import { Users, AlertTriangle, ShieldCheck, TowerControl, Car } from 'lucide-react';

export function SpatialFloatingLabels() {
  const { markers, selectedMarkerId, focusEntity } = useTwinStore();

  return (
    <group>
      {markers.map((marker) => {
        const isSelected = selectedMarkerId === marker.id;

        return (
          <group key={marker.id} position={marker.position}>
            <Html
              center
              distanceFactor={38}
              zIndexRange={[100, 0]}
              style={{
                pointerEvents: 'auto',
                userSelect: 'none',
                transition: 'all 0.2s ease',
              }}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  focusEntity(marker.id, marker.position);
                }}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-all shadow-card ${
                  isSelected
                    ? 'bg-[#1D1711] border border-[#F28C18] text-[#F4F4F5]'
                    : 'bg-[#0D1014]/95 hover:bg-[#151A21] border border-white/[0.08] text-[#F4F4F5]'
                }`}
              >
                {/* Specific Icon by Marker Type matching IMAGE 2 */}
                {marker.id === 'terminal-a' && (
                  <div className="w-5 h-5 rounded-lg bg-[#251A14] flex items-center justify-center text-[#F28C18] shrink-0">
                    <Users className="w-3 h-3" />
                  </div>
                )}
                {marker.id === 'terminal-b' && (
                  <div className="w-5 h-5 rounded-lg bg-[#2D1619] flex items-center justify-center text-[#EF4444] shrink-0">
                    <AlertTriangle className="w-3 h-3" />
                  </div>
                )}
                {marker.id === 'runway-1' && (
                  <div className="w-4 h-4 rounded-full bg-[#122820] flex items-center justify-center text-[#10B981] shrink-0">
                    <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                  </div>
                )}
                {marker.id === 'atc-tower' && (
                  <div className="w-4 h-4 rounded-full bg-[#122820] flex items-center justify-center text-[#10B981] shrink-0">
                    <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                  </div>
                )}
                {marker.id === 'parking' && (
                  <div className="w-5 h-5 rounded-lg bg-[#142338] flex items-center justify-center text-[#38BDF8] shrink-0 font-bold text-[10px]">
                    P
                  </div>
                )}
                {marker.id === 'energy-hub' && (
                  <div className="w-5 h-5 rounded-lg bg-[#251A14] flex items-center justify-center text-[#F28C18] shrink-0">
                    <ShieldCheck className="w-3 h-3" />
                  </div>
                )}

                {/* Text Hierarchy */}
                <div className="flex flex-col text-left leading-tight">
                  <span className="text-[10px] font-semibold text-[#F4F4F5]">
                    {marker.name}
                  </span>
                  <span
                    className={`text-[9px] font-medium ${
                      marker.id === 'terminal-b'
                        ? 'text-[#EF4444]'
                        : marker.id === 'terminal-a' || marker.id === 'parking'
                        ? 'text-[#F28C18]'
                        : 'text-[#10B981]'
                    }`}
                  >
                    {marker.id === 'terminal-a' && '72% Occupancy'}
                    {marker.id === 'terminal-b' && 'High Crowd'}
                    {marker.id === 'runway-1' && 'Operational'}
                    {marker.id === 'atc-tower' && 'Normal'}
                    {marker.id === 'parking' && '68% Occupied'}
                    {marker.id === 'energy-hub' && 'High Usage'}
                  </span>
                </div>
              </button>
            </Html>
          </group>
        );
      })}
    </group>
  );
}
