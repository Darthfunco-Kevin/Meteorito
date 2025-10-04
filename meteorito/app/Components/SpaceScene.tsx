"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars, Environment } from "@react-three/drei";
import Meteorite from "./Meteorite";

export default function SpaceScene() {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 15], fov: 60 }}
        style={{ background: "transparent" }}
        gl={{ antialias: true, alpha: true }}
        shadows
      >
        <Suspense fallback={null}>
          {/* Enhanced lighting system */}
          <ambientLight intensity={0.15} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={0.5}
            color="#4A90E2"
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          <pointLight position={[-10, -10, -10]} color="#8B5CF6" intensity={0.4} />
          <pointLight position={[10, -10, 10]} color="#06B6D4" intensity={0.3} />
          <pointLight position={[0, 10, -5]} color="#9333EA" intensity={0.25} />
          <spotLight
            position={[15, 15, 15]}
            angle={0.3}
            penumbra={1}
            intensity={0.3}
            color="#60A5FA"
            castShadow
          />
          
          {/* Enhanced fog for atmospheric depth */}
          <fog attach="fog" args={["#0a0a1a", 25, 120]} />

          {/* Multi-layered starfield system */}
          <Stars
            radius={350}
            depth={80}
            count={12000}
            factor={8}
            saturation={0}
            fade
            speed={0.3}
          />

          <Stars
            radius={250}
            depth={50}
            count={6000}
            factor={5}
            saturation={0}
            fade
            speed={0.8}
          />

          <Stars
            radius={150}
            depth={25}
            count={3000}
            factor={3}
            saturation={0.1}
            fade
            speed={1.5}
          />

          {/* Environment for realistic reflections */}
          <Environment preset="night" />

          {/* Main meteorite cluster */}
          <Meteorite position={[18, 3, 0]} scale={2.2} />

          {/* Additional meteorites with varied sizes and positions */}
          <Meteorite position={[24, -2, -4]} scale={1.4} />
          <Meteorite position={[30, 5, 3]} scale={1.8} />
          <Meteorite position={[35, -1, -2]} scale={1} />
          <Meteorite position={[28, 2, 6]} scale={1.6} />
          <Meteorite position={[22, -4, -6]} scale={0.9} />
          
          {/* Disable orbit controls for fixed view */}
          <OrbitControls enabled={false} />
        </Suspense>
      </Canvas>
    </div>
  );
}
