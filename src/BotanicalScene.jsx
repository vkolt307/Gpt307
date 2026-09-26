import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function Field({ pointer }) {
  const group = useRef();
  const blades = useMemo(() => Array.from({ length: 90 }, (_, i) => ({
    x: (Math.random() - 0.5) * 15,
    y: -3 + Math.random() * 6,
    z: -Math.random() * 8,
    r: Math.random() * Math.PI,
    s: 0.55 + Math.random() * 0.8,
    phase: Math.random() * Math.PI * 2
  })), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (!group.current) return;
    group.current.rotation.y += ((pointer.current.x * 0.11) - group.current.rotation.y) * 0.018;
    group.current.rotation.x += ((pointer.current.y * 0.05) - group.current.rotation.x) * 0.018;
    group.current.position.y = Math.sin(t * 0.23) * 0.08;
    group.current.children.forEach((leaf, i) => {
      leaf.rotation.z = blades[i].r + Math.sin(t * 0.9 + blades[i].phase) * 0.16;
      leaf.rotation.y = Math.sin(t * 0.55 + blades[i].phase) * 0.2;
    });
  });

  return (
    <group ref={group}>
      {blades.map((b, i) => (
        <mesh key={i} position={[b.x, b.y, b.z]} rotation={[0, b.r, b.r]} scale={[b.s, b.s * 1.8, b.s]}>
          <planeGeometry args={[0.42, 0.12, 1, 1]} />
          <meshStandardMaterial color={i % 5 === 0 ? "#d3b66d" : "#7fa46f"} transparent opacity={0.18 + (i % 4) * 0.055} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

function Pollen({ pointer }) {
  const ref = useRef();
  const positions = useMemo(() => {
    const data = new Float32Array(320 * 3);
    for (let i = 0; i < 320; i++) {
      data[i * 3] = (Math.random() - 0.5) * 16;
      data[i * 3 + 1] = (Math.random() - 0.5) * 10;
      data[i * 3 + 2] = -Math.random() * 10;
    }
    return data;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (!ref.current) return;
    ref.current.rotation.y = pointer.current.x * 0.05 + t * 0.012;
    ref.current.rotation.x = pointer.current.y * 0.03;
    ref.current.position.y = Math.sin(t * 0.35) * 0.12;
  });

  return (
    <points ref={ref} position={[0, 0, -2]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#d6bd79" size={0.018} transparent opacity={0.34} sizeAttenuation />
    </points>
  );
}

function LightField() {
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 5, 4]} intensity={1.2} color="#f6e5ba" />
      <pointLight position={[-4, 1, 2]} intensity={1.5} color="#97bf8d" distance={10} />
    </>
  );
}

export default function BotanicalScene() {
  const pointer = useRef({ x: 0, y: 0 });
  return (
    <div className="botanical-canvas" onPointerMove={(e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      pointer.current.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      pointer.current.y = ((e.clientY - rect.top) / rect.height - 0.5) * -2;
    }}>
      <Canvas camera={{ position: [0, 0, 7], fov: 45 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
        <LightField />
        <Field pointer={pointer} />
        <Pollen pointer={pointer} />
      </Canvas>
    </div>
  );
}
