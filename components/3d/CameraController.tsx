'use client';

import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useTwinStore } from '@/lib/twin/twinStateStore';

export function CameraController() {
  const { cameraTarget, cameraPosition, is2DView } = useTwinStore();
  const controlsRef = useRef<any>(null);
  const { camera } = useThree();

  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const desiredCamPos = useRef(new THREE.Vector3(28, 36, 42));
  const isTransitioning = useRef(false);

  // Switch between 3D perspective and top-down 2D orthographic-like view
  useEffect(() => {
    if (is2DView) {
      desiredCamPos.current.set(0, 65, 0.1);
      targetLookAt.current.set(0, 0, 0);
      isTransitioning.current = true;
    } else {
      desiredCamPos.current.set(28, 36, 42);
      targetLookAt.current.set(0, 0, 0);
      isTransitioning.current = true;
    }
  }, [is2DView]);

  // When target changes, smoothly fly to entity
  useEffect(() => {
    if (cameraTarget) {
      targetLookAt.current.set(cameraTarget[0], cameraTarget[1], cameraTarget[2]);
      if (cameraPosition) {
        desiredCamPos.current.set(cameraPosition[0], cameraPosition[1], cameraPosition[2]);
      } else {
        desiredCamPos.current.set(
          cameraTarget[0] + 10,
          cameraTarget[1] + 12,
          cameraTarget[2] + 14
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
        camera.position.distanceTo(desiredCamPos.current) < 0.2 &&
        controlsRef.current.target.distanceTo(targetLookAt.current) < 0.2
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
      maxPolarAngle={is2DView ? 0.05 : Math.PI / 2.15}
      minDistance={6}
      maxDistance={120}
      rotateSpeed={0.8}
      zoomSpeed={1.0}
    />
  );
}
