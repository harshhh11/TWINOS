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
  const desiredCamPos = useRef(new THREE.Vector3(48, 58, 68));
  const isTransitioning = useRef(false);

  // When target changes, smoothly fly to entity
  useEffect(() => {
    if (cameraTarget) {
      targetLookAt.current.set(cameraTarget[0], cameraTarget[1], cameraTarget[2]);
      if (cameraPosition) {
        desiredCamPos.current.set(cameraPosition[0], cameraPosition[1], cameraPosition[2]);
      } else {
        desiredCamPos.current.set(
          cameraTarget[0] + 16,
          cameraTarget[1] + 18,
          cameraTarget[2] + 22
        );
      }
      isTransitioning.current = true;
    }
  }, [cameraTarget, cameraPosition]);

  useFrame((_, delta) => {
    if (!controlsRef.current) return;

    if (isTransitioning.current) {
      // Smooth lerp camera position
      camera.position.lerp(desiredCamPos.current, delta * 3.4);

      // Smooth lerp orbit control look-at target
      controlsRef.current.target.lerp(targetLookAt.current, delta * 3.4);
      controlsRef.current.update();

      // Complete transition when within threshold
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
      dampingFactor={0.06}
      maxPolarAngle={Math.PI / 2.05}
      minDistance={8}
      maxDistance={260}
      rotateSpeed={0.8}
      zoomSpeed={1.0}
    />
  );
}
