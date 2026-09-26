'use client';

import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useTwinStore } from '@/lib/twin/twinStateStore';

export function CameraController() {
  const { cameraTarget, cameraPosition } = useTwinStore();
  const controlsRef = useRef<any>(null);
  const { camera } = useThree();

  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const desiredCamPos = useRef(new THREE.Vector3(0, 48, 65));
  const isTransitioning = useRef(false);

  // When target changes, smoothly fly to entity
  useEffect(() => {
    if (cameraTarget) {
      targetLookAt.current.set(cameraTarget[0], cameraTarget[1], cameraTarget[2]);
      if (cameraPosition) {
        desiredCamPos.current.set(cameraPosition[0], cameraPosition[1], cameraPosition[2]);
      } else {
        desiredCamPos.current.set(
          cameraTarget[0] + 12,
          cameraTarget[1] + 14,
          cameraTarget[2] + 16
        );
      }
      isTransitioning.current = true;
    }
  }, [cameraTarget, cameraPosition]);

  useFrame((_, delta) => {
    if (!controlsRef.current) return;

    if (isTransitioning.current) {
      // Lerp camera position
      camera.position.lerp(desiredCamPos.current, delta * 3.2);

      // Lerp orbit control target
      controlsRef.current.target.lerp(targetLookAt.current, delta * 3.2);
      controlsRef.current.update();

      // Check if close enough to finish transition
      if (
        camera.position.distanceTo(desiredCamPos.current) < 0.25 &&
        controlsRef.current.target.distanceTo(targetLookAt.current) < 0.25
      ) {
        isTransitioning.current = false;
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.07}
      maxPolarAngle={Math.PI / 2.15}
      minDistance={6}
      maxDistance={240}
      rotateSpeed={0.8}
      zoomSpeed={1.0}
    />
  );
}
