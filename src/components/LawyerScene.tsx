'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

export type SceneState = 'idle' | 'searching' | 'success' | 'failed';

interface SceneProps {
  state: SceneState;
}

function ScalesOfJustice() {
  const scaleGroup = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (scaleGroup.current) {
      scaleGroup.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.8) * 0.08;
      scaleGroup.current.position.y = Math.sin(state.clock.getElapsedTime() * 1.2) * 0.1 + 1.8;
    }
  });

  return (
    <group ref={scaleGroup} position={[0, 1.8, -4]}>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.1, 2.5, 16]} />
        <meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[2.2, 0.06, 0.06]} />
        <meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[-1, 0.2, 0]}>
        <cylinderGeometry args={[0.4, 0.02, 0.08, 16]} />
        <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[1, 0.2, 0]}>
        <cylinderGeometry args={[0.4, 0.02, 0.08, 16]} />
        <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  );
}

function LawyerAvatar({ state }: { state: SceneState }) {
  const avatarGroup = useRef<THREE.Group>(null);
  const bookRef = useRef<THREE.Mesh>(null);

  useFrame((clockState) => {
    if (!avatarGroup.current) return;
    const t = clockState.clock.getElapsedTime();

    if (state === 'idle') {
      avatarGroup.current.position.set(-0.2, -0.2, 0);
      avatarGroup.current.rotation.set(0, 0, 0);
    } else if (state === 'searching') {
      avatarGroup.current.position.x = THREE.MathUtils.lerp(avatarGroup.current.position.x, 2.0, 0.05);
      avatarGroup.current.position.z = THREE.MathUtils.lerp(avatarGroup.current.position.z, -0.5, 0.05);
      avatarGroup.current.rotation.y = THREE.MathUtils.lerp(avatarGroup.current.rotation.y, -Math.PI / 3, 0.05);

      if (bookRef.current) {
        bookRef.current.rotation.y = Math.sin(t * 8) * 0.5;
      }
    } else if (state === 'success') {
      avatarGroup.current.position.x = THREE.MathUtils.lerp(avatarGroup.current.position.x, -0.2, 0.08);
      avatarGroup.current.position.z = THREE.MathUtils.lerp(avatarGroup.current.position.z, 0, 0.08);
      avatarGroup.current.rotation.y = THREE.MathUtils.lerp(avatarGroup.current.rotation.y, 0, 0.08);
    } else if (state === 'failed') {
      avatarGroup.current.position.x = THREE.MathUtils.lerp(avatarGroup.current.position.x, 0.5, 0.1);
      avatarGroup.current.position.y = THREE.MathUtils.lerp(avatarGroup.current.position.y, -1.2, 0.1);
      avatarGroup.current.rotation.z = THREE.MathUtils.lerp(avatarGroup.current.rotation.z, -Math.PI / 2, 0.1);
      avatarGroup.current.rotation.x = THREE.MathUtils.lerp(avatarGroup.current.rotation.x, 0.3, 0.1);
    }
  });

  return (
    <group ref={avatarGroup} position={[-0.2, -0.2, 0]}>
      {/* Black Legal Gown */}
      <mesh position={[0, 0.5, 0]}>
        <coneGeometry args={[0.45, 1.1, 16]} />
        <meshStandardMaterial color="#111827" roughness={0.8} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 1.25, 0]}>
        <sphereGeometry args={[0.22, 32, 32]} />
        <meshStandardMaterial color="#8d5524" roughness={0.5} />
      </mesh>

      {/* Barrister Wig */}
      <mesh position={[0, 1.38, -0.02]}>
        <sphereGeometry args={[0.25, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#f3f4f6" roughness={0.9} />
      </mesh>

      {/* White Legal Bib */}
      <mesh position={[0, 1.0, 0.18]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[0.15, 0.25, 0.02]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Animated Law Book */}
      {state === 'searching' && (
        <mesh ref={bookRef} position={[0.3, 0.7, 0.3]}>
          <boxGeometry args={[0.25, 0.35, 0.06]} />
          <meshStandardMaterial color="#991b1b" />
        </mesh>
      )}
    </group>
  );
}

function OfficeEnvironment() {
  return (
    <group position={[0, -1, 0]}>
      {/* Desk */}
      <mesh position={[-0.2, 0.4, 0.4]}>
        <boxGeometry args={[1.6, 0.1, 0.8]} />
        <meshStandardMaterial color="#3f1d0b" roughness={0.4} />
      </mesh>
      <mesh position={[-0.9, 0, 0.4]}>
        <boxGeometry args={[0.1, 0.7, 0.7]} />
        <meshStandardMaterial color="#2d1508" />
      </mesh>
      <mesh position={[0.5, 0, 0.4]}>
        <boxGeometry args={[0.1, 0.7, 0.7]} />
        <meshStandardMaterial color="#2d1508" />
      </mesh>

      {/* Bookshelf beside desk */}
      <group position={[2.3, 1.2, -0.6]}>
        <mesh>
          <boxGeometry args={[0.8, 2.4, 0.4]} />
          <meshStandardMaterial color="#2d1508" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.4, 0.05]}>
          <boxGeometry args={[0.65, 0.35, 0.25]} />
          <meshStandardMaterial color="#1e3a8a" />
        </mesh>
        <mesh position={[0, -0.3, 0.05]}>
          <boxGeometry args={[0.65, 0.35, 0.25]} />
          <meshStandardMaterial color="#065f46" />
        </mesh>
      </group>

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.35, 0]}>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.8} />
      </mesh>
    </group>
  );
}

export default function LawyerScene({ state }: SceneProps) {
  return (
    <div className="w-full h-[420px] relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 0.8, 4.5]} fov={45} />
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />
        <pointLight position={[-3, 3, 2]} intensity={0.5} color="#38bdf8" />

        <ScalesOfJustice />
        <OfficeEnvironment />
        <LawyerAvatar state={state} />

        <OrbitControls enableZoom={false} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 3} />
      </Canvas>
    </div>
  );
}