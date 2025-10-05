import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sky } from "@react-three/drei";
import * as THREE from "three";

// --- Particle bloom system ---
function BloomParticles({ count = 200 }: { count?: number }) {
  const meshRef = useRef<THREE.Points>(null);

  // Generate random positions over waterbody
  const positions = useMemo(() => {
    const arr: number[] = [];
    for (let i = 0; i < count; i++) {
      const x = THREE.MathUtils.randFloatSpread(6); // spread over plane width
      const y = 0.05 + Math.random() * 0.2; // slight height
      const z = THREE.MathUtils.randFloatSpread(6);
      arr.push(x, y, z);
    }
    return new Float32Array(arr);
  }, [count]);

  // Animate particles slightly
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const positions = meshRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < positions.length; i += 3) {
      positions[i + 1] += Math.sin(state.clock.elapsedTime + i) * 0.001; // subtle vertical float
    }
    meshRef.current.geometry.attributes.position.needsUpdate = true;
  });

  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geom;
  }, [positions]);

  const material = useMemo(() => {
    return new THREE.PointsMaterial({ size: 0.09, color: "pink", opacity: 0.7 });
  }, []);

  return <points ref={meshRef} geometry={geometry} material={material} />;
}

// --- Main California Bloom VR Component ---
export default function CaliforniaBloomParticlesVR() {
  return (
    <div style={{ height: "80vh", width: "100%", position: "relative" }}>
      <Canvas camera={{ position: [0, 3, 5], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 10, 5]} intensity={1} />
        <Sky distance={450000} sunPosition={[5, 1, 2]} />

        {/* Waterbody */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[6, 6]} />
          <meshStandardMaterial color="#00FF00" />
        </mesh>

        {/* Bloom particles */}
        <BloomParticles count={250} />

        <OrbitControls enablePan enableZoom />
      </Canvas>

      {/* Info Panel */}
      <div
        style={{
          position: "absolute",
          left: 14,
          bottom: 14,
          padding: 12,
          background: "rgba(255,255,255,0.9)",
          borderRadius: 10,
          width: 320,
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: 8, color: "#2f4f2f" }}>Plant Blooms VR</div>
        <div style={{ fontSize: 12, color: "#2f4f2f" }}>
          Pink floating particles represent bloom areas on land. The subtle floating motion simulates bloom movement.
        </div>
      </div>
    </div>
  );
}
