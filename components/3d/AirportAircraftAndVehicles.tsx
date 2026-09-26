'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface AircraftProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  liveryColor?: string;
  hasStrobe?: boolean;
}

export function CommercialAircraft({
  position,
  rotation = [0, 0, 0],
  scale = 1.0,
  liveryColor = '#F28C18',
  hasStrobe = true,
}: AircraftProps) {
  const strobeRef = useRef<THREE.Mesh>(null);
  const beaconRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!hasStrobe) return;
    const t = state.clock.getElapsedTime();
    // Quick double-flash wingtip strobe
    if (strobeRef.current) {
      const flash = (Math.sin(t * 8) > 0.85) ? 1.0 : 0.0;
      (strobeRef.current.material as THREE.MeshBasicMaterial).opacity = flash;
    }
    // Pulsing anti-collision beacon
    if (beaconRef.current) {
      const beaconFlash = (Math.sin(t * 4) > 0.4) ? 1.0 : 0.1;
      (beaconRef.current.material as THREE.MeshBasicMaterial).opacity = beaconFlash;
    }
  });

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* 1. Fuselage Main Body */}
      <mesh position={[0, 1.2, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.9, 0.9, 12, 16]} />
        <meshStandardMaterial color="#F8FAFC" roughness={0.25} metalness={0.4} />
      </mesh>

      {/* Streamlined Nose Cone */}
      <mesh position={[0, 1.2, 6.8]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <sphereGeometry args={[0.9, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#F8FAFC" roughness={0.25} metalness={0.4} />
      </mesh>

      {/* Cockpit Windshield Visor */}
      <mesh position={[0, 1.6, 6.2]} rotation={[0.45, 0, 0]}>
        <boxGeometry args={[0.85, 0.35, 0.4]} />
        <meshStandardMaterial color="#0B0F19" roughness={0.1} metalness={0.9} />
      </mesh>

      {/* Tapered Aft Fuselage Tail Cone */}
      <mesh position={[0, 1.35, -6.8]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <coneGeometry args={[0.9, 2.6, 16]} />
        <meshStandardMaterial color="#F8FAFC" roughness={0.25} metalness={0.4} />
      </mesh>

      {/* 2. Swept-Back Main Wings */}
      {/* Port (Left) Wing */}
      <group position={[-0.8, 1.0, 0.5]}>
        <mesh rotation={[0, -0.32, -0.06]} position={[-3.8, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[7.2, 0.14, 1.8]} />
          <meshStandardMaterial color="#E2E8F0" roughness={0.3} metalness={0.5} />
        </mesh>
        {/* Winglet Sharklet */}
        <mesh position={[-7.4, 0.45, -1.2]} rotation={[0, 0, 0.45]}>
          <boxGeometry args={[0.1, 0.9, 0.5]} />
          <meshStandardMaterial color={liveryColor} />
        </mesh>
        {/* Navigation Red Light */}
        <mesh position={[-7.4, 0.1, -1.2]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshBasicMaterial color="#EF4444" />
        </mesh>
      </group>

      {/* Starboard (Right) Wing */}
      <group position={[0.8, 1.0, 0.5]}>
        <mesh rotation={[0, 0.32, 0.06]} position={[3.8, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[7.2, 0.14, 1.8]} />
          <meshStandardMaterial color="#E2E8F0" roughness={0.3} metalness={0.5} />
        </mesh>
        {/* Winglet Sharklet */}
        <mesh position={[7.4, 0.45, -1.2]} rotation={[0, 0, -0.45]}>
          <boxGeometry args={[0.1, 0.9, 0.5]} />
          <meshStandardMaterial color={liveryColor} />
        </mesh>
        {/* Navigation Green Light */}
        <mesh position={[7.4, 0.1, -1.2]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshBasicMaterial color="#10B981" />
        </mesh>
      </group>

      {/* 3. Turbofan Jet Engines */}
      {/* Port Engine */}
      <group position={[-2.8, 0.4, 1.2]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.48, 0.48, 2.2, 16]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0, 1.1]}>
          <circleGeometry args={[0.42, 16]} />
          <meshStandardMaterial color="#1E293B" metalness={0.9} />
        </mesh>
      </group>

      {/* Starboard Engine */}
      <group position={[2.8, 0.4, 1.2]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.48, 0.48, 2.2, 16]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0, 1.1]}>
          <circleGeometry args={[0.42, 16]} />
          <meshStandardMaterial color="#1E293B" metalness={0.9} />
        </mesh>
      </group>

      {/* 4. Vertical Tail Fin & Horizontal Stabilizers */}
      <group position={[0, 2.6, -6.2]}>
        <mesh rotation={[-0.38, 0, 0]} position={[0, 0.8, -0.4]} castShadow>
          <boxGeometry args={[0.15, 2.4, 1.8]} />
          <meshStandardMaterial color={liveryColor} roughness={0.25} metalness={0.4} />
        </mesh>
      </group>
      <mesh position={[0, 1.6, -7.0]} castShadow>
        <boxGeometry args={[4.4, 0.1, 1.2]} />
        <meshStandardMaterial color="#CBD5E1" />
      </mesh>

      {/* 5. Tricycle Landing Gear */}
      <group position={[0, 0.4, 5.0]}>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.8, 8]} />
          <meshStandardMaterial color="#475569" metalness={0.8} />
        </mesh>
        <mesh position={[0, -0.35, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.18, 0.18, 0.25, 12]} />
          <meshStandardMaterial color="#0F172A" roughness={0.9} />
        </mesh>
      </group>
      {[-1.6, 1.6].map((x, idx) => (
        <group key={`gear-${idx}`} position={[x, 0.4, -0.4]}>
          <mesh>
            <cylinderGeometry args={[0.08, 0.08, 0.8, 8]} />
            <meshStandardMaterial color="#475569" metalness={0.8} />
          </mesh>
          <mesh position={[0, -0.35, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.22, 0.22, 0.35, 12]} />
            <meshStandardMaterial color="#0F172A" roughness={0.9} />
          </mesh>
        </group>
      ))}

      {/* 6. Beacons & Strobes */}
      <mesh ref={beaconRef} position={[0, 2.2, 0]}>
        <sphereGeometry args={[0.09, 8, 8]} />
        <meshBasicMaterial color="#EF4444" transparent opacity={1.0} />
      </mesh>
      <mesh ref={strobeRef} position={[-8.2, 1.2, -0.8]}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshBasicMaterial color="#FFFFFF" transparent opacity={1.0} />
      </mesh>
      <mesh ref={strobeRef} position={[8.2, 1.2, -0.8]}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshBasicMaterial color="#FFFFFF" transparent opacity={1.0} />
      </mesh>
    </group>
  );
}

export function AirportAircraftAndVehicles() {
  const patrolCarRef = useRef<THREE.Group>(null);
  const apronBusRef = useRef<THREE.Group>(null);
  const baggageTug1Ref = useRef<THREE.Group>(null);
  const baggageTug2Ref = useRef<THREE.Group>(null);

  // Animate dynamic ground vehicles across the airport campus
  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Security patrol SUV looping along perimeter road
    if (patrolCarRef.current) {
      const z = ((t * 4.5) % 160) - 80;
      patrolCarRef.current.position.z = z;
    }

    // Apron transfer bus between Terminal D and Main Concourse
    if (apronBusRef.current) {
      const x = 12 + Math.sin(t * 0.4) * 22;
      apronBusRef.current.position.x = x;
    }

    // Baggage Tug 1 at Terminal A
    if (baggageTug1Ref.current) {
      const z = -4 + Math.sin(t * 0.8) * 8;
      baggageTug1Ref.current.position.z = z;
    }

    // Baggage Tug 2 at Terminal C
    if (baggageTug2Ref.current) {
      const z = 6 + Math.cos(t * 0.7) * 7;
      baggageTug2Ref.current.position.z = z;
    }
  });

  return (
    <group name="CampusAircraftAndVehicles">
      {/* ========================================================================= */}
      {/* 1. COMMERCIAL AIRLINERS AT TERMINALS A, B, C, D & TAXIWAYS                */}
      {/* ========================================================================= */}
      {/* Terminal A Gate A2: Widebody Flagship (B777 class) */}
      <CommercialAircraft
        position={[-20.5, 0, -8]}
        rotation={[0, 0.25, 0]}
        scale={0.92}
        liveryColor="#F28C18"
      />

      {/* Terminal A Gate A4: Long-Haul Airliner (A350 class) */}
      <CommercialAircraft
        position={[-20.5, 0, 4]}
        rotation={[0, -0.2, 0]}
        scale={0.88}
        liveryColor="#38BDF8"
      />

      {/* Terminal B Gate B2: Domestic Airliner (A321 class) */}
      <CommercialAircraft
        position={[-2.0, 0, -6]}
        rotation={[0, 0.15, 0]}
        scale={0.84}
        liveryColor="#F28C18"
      />

      {/* Terminal C Gate C3: Star Concourse Airliner (B737 MAX class) */}
      <CommercialAircraft
        position={[16.0, 0, -6]}
        rotation={[0, -0.25, 0]}
        scale={0.85}
        liveryColor="#10B981"
      />

      {/* Terminal C Gate C5: International Narrowbody */}
      <CommercialAircraft
        position={[16.0, 0, 6]}
        rotation={[0, 0.2, 0]}
        scale={0.82}
        liveryColor="#38BDF8"
      />

      {/* Terminal D Gate D2: Regional Jet (E190 class) */}
      <CommercialAircraft
        position={[34.0, 0, 6]}
        rotation={[0, -0.15, 0]}
        scale={0.75}
        liveryColor="#F59E0B"
      />

      {/* Holding at Taxiway Alpha (Ready for Departure on Runway 01) */}
      <CommercialAircraft
        position={[-24, 0, 45]}
        rotation={[0, Math.PI, 0]}
        scale={0.90}
        liveryColor="#E2E8F0"
      />

      {/* Holding at Taxiway Bravo (Runway 02 Intersection) */}
      <CommercialAircraft
        position={[12, 0, -55]}
        rotation={[0, 0, 0]}
        scale={0.86}
        liveryColor="#38BDF8"
      />

      {/* ========================================================================= */}
      {/* 2. AIRPORT GROUND SERVICE EQUIPMENT (GSE) & VEHICLES                      */}
      {/* ========================================================================= */}
      {/* Pushback Tractor at Terminal A Gate A2 */}
      <group position={[-20.5, 0, -1.2]}>
        <mesh position={[0, 0.35, 0]} castShadow>
          <boxGeometry args={[1.5, 0.75, 2.4]} />
          <meshStandardMaterial color="#EAB308" roughness={0.4} />
        </mesh>
      </group>

      {/* Pushback Tractor at Terminal C Gate C3 */}
      <group position={[16.0, 0, 0.8]}>
        <mesh position={[0, 0.35, 0]} castShadow>
          <boxGeometry args={[1.5, 0.75, 2.4]} />
          <meshStandardMaterial color="#EAB308" roughness={0.4} />
        </mesh>
      </group>

      {/* Fuel Bowser Tanker Truck at Terminal A */}
      <group position={[-25.5, 0, -7.5]}>
        <mesh position={[0, 0.5, 1.4]} castShadow>
          <boxGeometry args={[1.1, 1.0, 1.2]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.65, -0.8]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.65, 0.65, 2.8, 12]} />
          <meshStandardMaterial color="#E2E8F0" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>

      {/* Baggage Tug Train 1 (Terminal A) */}
      <group ref={baggageTug1Ref} position={[-16, 0, 0]}>
        <mesh position={[0, 0.3, 0]} castShadow>
          <boxGeometry args={[0.85, 0.6, 1.3]} />
          <meshStandardMaterial color="#F59E0B" />
        </mesh>
        <mesh position={[0, 0.25, -1.6]} castShadow>
          <boxGeometry args={[0.8, 0.4, 1.1]} />
          <meshStandardMaterial color="#64748B" />
        </mesh>
        <mesh position={[0, 0.25, -3.0]} castShadow>
          <boxGeometry args={[0.8, 0.4, 1.1]} />
          <meshStandardMaterial color="#64748B" />
        </mesh>
      </group>

      {/* Baggage Tug Train 2 (Terminal C) */}
      <group ref={baggageTug2Ref} position={[22, 0, 4]}>
        <mesh position={[0, 0.3, 0]} castShadow>
          <boxGeometry args={[0.85, 0.6, 1.3]} />
          <meshStandardMaterial color="#F59E0B" />
        </mesh>
        <mesh position={[0, 0.25, -1.6]} castShadow>
          <boxGeometry args={[0.8, 0.4, 1.1]} />
          <meshStandardMaterial color="#64748B" />
        </mesh>
      </group>

      {/* Apron Passenger Shuttle Bus */}
      <group ref={apronBusRef} position={[20, 0, 22]}>
        <mesh position={[0, 0.65, 0]} castShadow>
          <boxGeometry args={[1.4, 1.3, 3.8]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.3} metalness={0.3} />
        </mesh>
        <mesh position={[0, 0.75, 0]}>
          <boxGeometry args={[1.42, 0.5, 3.2]} />
          <meshPhysicalMaterial color="#0284C7" transmission={0.6} transparent opacity={0.8} />
        </mesh>
      </group>

      {/* Security Patrol Vehicle looping along perimeter road */}
      <group ref={patrolCarRef} position={[-48, 0, 0]}>
        <mesh position={[0, 0.4, 0]} castShadow>
          <boxGeometry args={[1.0, 0.75, 2.0]} />
          <meshStandardMaterial color="#1E293B" roughness={0.3} metalness={0.5} />
        </mesh>
        <mesh position={[0, 0.85, 0]}>
          <boxGeometry args={[0.75, 0.14, 0.22]} />
          <meshBasicMaterial color="#38BDF8" />
        </mesh>
      </group>
    </group>
  );
}
