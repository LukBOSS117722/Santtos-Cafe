import { Suspense, useMemo, Component, ErrorInfo, ReactNode, useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, PerspectiveCamera, ContactShadows, Float } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

// ── WebGL helpers ─────────────────────────────────────────────────────────────

function isWebGLAvailable() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl') || c.getContext('experimental-webgl'));
  } catch { return false; }
}

class WebGLErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(e: Error) { console.warn('WebGL unavailable:', e.message); }
  render() { return this.state.hasError ? this.props.fallback : this.props.children; }
}

// ── SVG fallback ──────────────────────────────────────────────────────────────

function CoffeeFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative flex flex-col items-center">
        <motion.div
          animate={{ y: [0, -16, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg width="220" height="280" viewBox="0 0 220 280" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="110" cy="245" rx="90" ry="16" fill="#1e1410" stroke="#d4a96a" strokeWidth="1.5"/>
            <ellipse cx="110" cy="238" rx="70" ry="10" fill="#2a1a0e" stroke="#c9923a" strokeWidth="1"/>
            <path d="M60 140 Q55 230 110 235 Q165 230 160 140 Z" fill="#1e1410"/>
            <path d="M60 140 L160 140" stroke="#d4a96a" strokeWidth="2.5"/>
            <path d="M68 148 Q65 225 110 228 Q155 225 152 148 Z" fill="#2a1a0e" opacity="0.5"/>
            <ellipse cx="110" cy="145" rx="50" ry="9" fill="#301b10"/>
            <ellipse cx="110" cy="140" rx="50" ry="8" fill="none" stroke="#d4a96a" strokeWidth="3"/>
            <path d="M159 165 Q195 165 195 190 Q195 215 159 215" fill="none" stroke="#1e1410" strokeWidth="14" strokeLinecap="round"/>
            <path d="M159 165 Q190 165 190 190 Q190 215 159 215" fill="none" stroke="#2a1a0e" strokeWidth="8" strokeLinecap="round"/>
            {(['M90 120 Q85 105 90 90 Q95 75 90 60', 'M110 115 Q105 98 110 80 Q115 62 110 45', 'M130 120 Q125 103 130 86 Q135 69 130 52'] as const).map((d, i) => (
              <motion.path key={i} d={d} stroke="#d4a96a" strokeWidth="2.5" fill="none" strokeLinecap="round"
                initial={{ opacity: 0.1, pathLength: 0 }}
                animate={{ opacity: [0.1, 0.6, 0.1], pathLength: [0, 1, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
              />
            ))}
          </svg>
        </motion.div>
        <div className="absolute bottom-0 w-40 h-6 bg-primary/20 blur-xl rounded-full" />
      </div>
    </div>
  );
}

// ── 3D coffee cup (merged from CoffeeCup3D.tsx) ───────────────────────────────

function SteamParticles() {
  const ref = useRef<THREE.Points>(null);
  const count = 40;
  const [positions, phases] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const ph = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 0.8;
      pos[i * 3 + 1] = Math.random() * 2;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.8;
      ph[i] = Math.random() * Math.PI * 2;
    }
    return [pos, ph];
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    const p = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      p[i * 3 + 1] += 0.015;
      p[i * 3] += Math.sin(t * 2 + phases[i]) * 0.002;
      p[i * 3 + 2] += Math.cos(t * 1.5 + phases[i]) * 0.002;
      if (p[i * 3 + 1] > 3) {
        p[i * 3 + 1] = 0.5;
        p[i * 3] = (Math.random() - 0.5) * 0.5;
        p[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.15} color="#ede0c4" transparent opacity={0.3} depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

function CoffeeCup() {
  const groupRef = useRef<THREE.Group>(null);
  useFrame(({ pointer }) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += (pointer.x * 0.3 - groupRef.current.rotation.y) * 0.05;
    groupRef.current.rotation.x += (pointer.y * 0.2 - groupRef.current.rotation.x) * 0.05;
  });
  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={groupRef} position={[0, -0.5, 0]}>
        <group position={[0, 1.2, 0]}><SteamParticles /></group>
        <mesh position={[0, 1.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[1.05, 32]} />
          <meshStandardMaterial color="#301b10" roughness={0.1} metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.2, 0.8, 1.6, 32, 1, false]} />
          <meshPhysicalMaterial color="#1e1410" roughness={0.1} clearcoat={0.3} clearcoatRoughness={0.1} />
        </mesh>
        <mesh position={[0, 0.4, 0]}>
          <cylinderGeometry args={[1.1, 0.7, 1.6, 32, 1, true]} />
          <meshStandardMaterial color="#f5e6d3" roughness={0.3} side={THREE.BackSide} />
        </mesh>
        <mesh position={[0, 1.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.15, 0.05, 16, 64]} />
          <meshStandardMaterial color="#d4a96a" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[1.1, 0.5, 0]} rotation={[0, 0, -Math.PI / 12]} castShadow>
          <torusGeometry args={[0.4, 0.12, 16, 32]} />
          <meshPhysicalMaterial color="#1e1410" roughness={0.1} clearcoat={0.3} />
        </mesh>
        <mesh position={[0, -0.4, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.8, 1.2, 0.15, 32]} />
          <meshPhysicalMaterial color="#1e1410" roughness={0.2} />
        </mesh>
        <mesh position={[0, -0.32, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.75, 0.03, 16, 64]} />
          <meshStandardMaterial color="#d4a96a" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>
    </Float>
  );
}

function ThreeDScene() {
  return (
    <Canvas shadows>
      <PerspectiveCamera makeDefault position={[0, 2, 7]} fov={45} />
      <ambientLight intensity={0.5} />
      <spotLight position={[5, 5, 5]} angle={0.15} penumbra={1} intensity={1.5} castShadow />
      <pointLight position={[-5, 5, -5]} intensity={0.5} color="#d4a96a" />
      <Suspense fallback={null}>
        <CoffeeCup />
        <Environment preset="city" />
        <ContactShadows position={[0, -1.5, 0]} opacity={0.5} scale={10} blur={2} far={4} />
      </Suspense>
    </Canvas>
  );
}

function ThreeCanvas() {
  const [webglOk, setWebglOk] = useState<boolean | null>(null);
  useEffect(() => { setWebglOk(isWebGLAvailable()); }, []);
  if (webglOk === null) return null;
  if (!webglOk) return <CoffeeFallback />;
  return (
    <WebGLErrorBoundary fallback={<CoffeeFallback />}>
      <ThreeDScene />
    </WebGLErrorBoundary>
  );
}

// ── Floating particles ────────────────────────────────────────────────────────

function ParticleBackground() {
  const particles = useMemo(() =>
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDuration: `${Math.random() * 5 + 5}s`,
      animationDelay: `${Math.random() * 5}s`,
    })), []);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map(p => (
        <div key={p.id} className="absolute w-1 h-1 rounded-full bg-primary/40 animate-pulse"
          style={{ left: p.left, top: p.top, animationDuration: p.animationDuration, animationDelay: p.animationDelay }} />
      ))}
    </div>
  );
}

// ── Hero export ───────────────────────────────────────────────────────────────

export default function Hero() {
  return (
    <section id="hero" className="relative w-full h-screen min-h-[600px] flex items-center overflow-hidden bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background z-0" />
      <ParticleBackground />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between h-full">
        <motion.div
          className="w-full md:w-1/2 pt-20 md:pt-0 z-20 text-center md:text-left"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}>
            <span className="inline-block py-1 px-3 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-6 uppercase tracking-wider backdrop-blur-sm">
              Zvolen, Slovakia
            </span>
          </motion.div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-4">
            <span className="text-foreground">Santtos</span><br />
            <span className="text-gradient-gold">Caffee & Bar</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-lg mx-auto md:mx-0">
            Najlepšia káva v Zvolene
          </p>
          <motion.a
            href="#menu"
            className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-primary-foreground bg-gradient-gold rounded-full shadow-[0_0_20px_rgba(201,146,58,0.3)] hover:shadow-[0_0_30px_rgba(201,146,58,0.5)] transition-all duration-300 hover:-translate-y-1"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Navštív nás
          </motion.a>
        </motion.div>

        <div className="w-full md:w-1/2 h-[50vh] md:h-full relative z-10 hidden sm:block">
          <ThreeCanvas />
        </div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <span className="text-xs text-muted-foreground mb-2 uppercase tracking-widest">Rolujte dole</span>
        <motion.div
          className="w-[1px] h-12 bg-gradient-to-b from-primary to-transparent"
          animate={{ height: ['0px', '48px', '0px'], y: [0, 0, 48] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  );
}
