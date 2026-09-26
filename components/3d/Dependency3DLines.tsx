'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTwinStore } from '@/lib/twin/twinStateStore';

interface DependencyLink {
  id: string;
  fromName: string;
  toName: string;
  from: [number, number, number];
  to: [number, number, number];
  color: string;
  type: 'power' | 'data' | 'hvac';
}

const CAMPUS_DEPENDENCY_LINKS: DependencyLink[] = [
  {
    id: 'link-power-t1',
    fromName: 'Central Energy Facility',
    toName: 'Terminal A Primary Grid',
    from: [-32, 2.2, 28],
    to: [-22, 3.5, 8],
    color: '#10B981',
    type: 'power',
  },
  {
    id: 'link-power-t2',
    fromName: 'Central Energy Facility',
    toName: 'Terminal B Substation',
    from: [-32, 2.2, 28],
    to: [-2, 3.2, 4],
    color: '#10B981',
    type: 'power',
  },
  {
    id: 'link-power-t3',
    fromName: 'Central Energy Facility',
    toName: 'Terminal C Grid Node',
    from: [-32, 2.2, 28],
    to: [18, 3.5, 8],
    color: '#F28C18',
    type: 'power',
  },
  {
    id: 'link-power-t4',
    fromName: 'Central Energy Facility',
    toName: 'Terminal D Regional Grid',
    from: [-32, 2.2, 28],
    to: [36, 3.0, 14],
    color: '#38BDF8',
    type: 'power',
  },
  {
    id: 'link-hvac-t3',
    fromName: 'Terminal C Concourse',
    toName: 'Rooftop Chiller Unit 03 (TT-03)',
    from: [18, 3.5, 8],
    to: [21.5, 5.6, 7.5],
    color: '#EF4444',
    type: 'hvac',
  },
  {
    id: 'link-baggage-t1',
    fromName: 'Terminal A Main Hall',
    toName: 'Baggage Logistics Belt 03',
    from: [-22, 3.5, 8],
    to: [-28, 1.4, 12],
    color: '#38BDF8',
    type: 'data',
  },
  {
    id: 'link-atc-rwy1',
    fromName: 'ATC Tower',
    toName: 'Runway 01 (09L/27R) ILS Guidance',
    from: [4, 15.0, -16],
    to: [-38, 0.6, -26],
    color: '#38BDF8',
    type: 'data',
  },
  {
    id: 'link-atc-rwy2',
    fromName: 'ATC Tower',
    toName: 'Runway 02 (09R/27L) ILS Guidance',
    from: [4, 15.0, -16],
    to: [26, 0.6, -42],
    color: '#10B981',
    type: 'data',
  },
  {
    id: 'link-parking-t1',
    fromName: 'Terminal Parking Complex',
    toName: 'Terminal A/B Passenger Access',
    from: [-2, 2.6, 26],
    to: [-12, 3.2, 8],
    color: '#10B981',
    type: 'data',
  },
];

function AnimatedPulseParticle({ curve, color }: { curve: THREE.QuadraticBezierCurve3; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = (state.clock.getElapsedTime() * 0.35) % 1;
    const point = curve.getPoint(t);
    meshRef.current.position.set(point.x, point.y, point.z);
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.26, 10, 10]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}

function DependencyArc({ link, isHighlighted }: { link: DependencyLink; isHighlighted: boolean }) {
  const curve = useMemo(() => {
    const v0 = new THREE.Vector3(...link.from);
    const v2 = new THREE.Vector3(...link.to);
    const midX = (v0.x + v2.x) / 2;
    const midZ = (v0.z + v2.z) / 2;
    const dist = v0.distanceTo(v2);
    const midY = Math.max(v0.y, v2.y) + Math.min(dist * 0.22, 5.5);
    const v1 = new THREE.Vector3(midX, midY, midZ);
    return new THREE.QuadraticBezierCurve3(v0, v1, v2);
  }, [link]);

  const points = useMemo(() => curve.getPoints(32), [curve]);
  const lineGeometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);

  return (
    <group>
      {/* 3D Spline Arc */}
      {/* @ts-ignore */}
      <line geometry={lineGeometry}>
        <lineBasicMaterial
          color={link.color}
          transparent
          opacity={isHighlighted ? 0.95 : 0.4}
          linewidth={isHighlighted ? 3 : 1}
        />
      </line>

      {/* Traveling Energy Pulse */}
      <AnimatedPulseParticle curve={curve} color={link.color} />
    </group>
  );
}

export function Dependency3DLines() {
  const { selectedMarkerId, activeLayer } = useTwinStore();

  // If activeLayer is specifically set and not DEPENDENCIES or ALL, hide unless an asset is selected
  if (activeLayer !== 'ALL' && activeLayer !== 'DEPENDENCIES' && !selectedMarkerId) {
    return null;
  }

  return (
    <group name="CampusDependencyLines">
      {CAMPUS_DEPENDENCY_LINKS.map((link) => {
        const isHighlighted =
          !selectedMarkerId ||
          (selectedMarkerId === 'energy-hub' && link.id.includes('power')) ||
          (selectedMarkerId === 'terminal-c' && (link.id.includes('t3') || link.id.includes('hvac'))) ||
          (selectedMarkerId === 'terminal-a' && (link.id.includes('t1') || link.id.includes('baggage'))) ||
          (selectedMarkerId === 'terminal-b' && link.id.includes('t2')) ||
          (selectedMarkerId === 'terminal-d' && link.id.includes('t4')) ||
          (selectedMarkerId === 'atc-tower' && link.id.includes('atc')) ||
          (selectedMarkerId === 'runway-1' && link.id.includes('rwy1')) ||
          (selectedMarkerId === 'runway-2' && link.id.includes('rwy2')) ||
          (selectedMarkerId === 'parking-garage' && link.id.includes('parking'));

        return (
          <DependencyArc
            key={link.id}
            link={link}
            isHighlighted={Boolean(isHighlighted)}
          />
        );
      })}
    </group>
  );
}
