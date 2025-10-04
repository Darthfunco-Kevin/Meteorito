"use client";

import { Suspense, useEffect, useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Stars,
  Environment,
  Sphere,
  Trail,
  MeshDistortMaterial,
} from "@react-three/drei";
import { useSearchParams, useRouter } from "next/navigation";
import * as THREE from "three";

interface NEOData {
  id: string;
  name: string;
  absolute_magnitude_h: number;
  estimated_diameter: {
    kilometers: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
  };
  is_potentially_hazardous_asteroid: boolean;
  close_approach_data: Array<{
    close_approach_date: string;
    relative_velocity: {
      kilometers_per_second: string;
    };
    miss_distance: {
      astronomical: string;
      kilometers: string;
    };
  }>;
}

function FallingMeteorite({
  scale,
  onImpact,
  isHazardous,
}: {
  scale: number;
  onImpact: () => void;
  isHazardous: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [position, setPosition] = useState<[number, number, number]>([
    0, 20, 0,
  ]);
  const [rotation, setRotation] = useState<[number, number, number]>([0, 0, 0]);
  const [impacted, setImpacted] = useState(false);

  useFrame(() => {
    if (!impacted && meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.015;
      meshRef.current.rotation.z += 0.005;
    }
  });

  useEffect(() => {
    if (impacted) return;

    const interval = setInterval(() => {
      setPosition((prev) => {
        const newY = prev[1] - 0.2;

        if (newY <= 0 && !impacted) {
          setImpacted(true);
          onImpact();
          return [0, 0, 0];
        }

        return [prev[0], newY, prev[2]];
      });
    }, 50);

    return () => clearInterval(interval);
  }, [impacted, onImpact]);

  const baseColor = isHazardous ? "#4a2c1a" : "#6b4423";
  const emissiveColor = isHazardous ? "#ff0000" : "#ff6b35";

  return (
    <Trail
      width={scale * 2}
      length={12}
      color={new THREE.Color(isHazardous ? "#ff4400" : "#ffaa44")}
      attenuation={(t) => t * t * t}
    >
      <group position={position}>
        {/* Main meteorite body - irregular shape */}
        <mesh ref={meshRef} castShadow>
          <icosahedronGeometry args={[scale, 2]} />
          <MeshDistortMaterial
            color={baseColor}
            emissive={emissiveColor}
            emissiveIntensity={0.6}
            metalness={0.8}
            roughness={0.3}
            distort={0.4}
            speed={2}
            envMapIntensity={1.5}
          />
        </mesh>

        {/* Glowing core effect */}
        <mesh scale={0.7}>
          <icosahedronGeometry args={[scale, 1]} />
          <meshBasicMaterial color={emissiveColor} transparent opacity={0.3} />
        </mesh>

        {/* Heat glow around meteorite */}
        <mesh scale={1.3}>
          <sphereGeometry args={[scale, 16, 16]} />
          <meshBasicMaterial
            color="#ff6600"
            transparent
            opacity={0.15}
            side={THREE.BackSide}
          />
        </mesh>

        {/* Fire particles effect */}
        <pointLight
          position={[0, 0, 0]}
          intensity={2}
          distance={scale * 5}
          color={emissiveColor}
        />
      </group>
    </Trail>
  );
}

function Earth() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group position={[0, -3, 0]}>
      {/* Main Earth sphere */}
      <mesh ref={meshRef} receiveShadow>
        <sphereGeometry args={[3, 64, 64]} />
        <meshStandardMaterial
          color="#1a5fb4"
          emissive="#0a2f5a"
          emissiveIntensity={0.15}
          metalness={0.2}
          roughness={0.6}
        />
      </mesh>

      {/* Continents overlay */}
      <mesh scale={1.01}>
        <sphereGeometry args={[3, 64, 64]} />
        <meshStandardMaterial
          color="#2d5016"
          transparent
          opacity={0.6}
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>

      {/* Atmosphere glow */}
      <mesh scale={1.15}>
        <sphereGeometry args={[3, 32, 32]} />
        <meshBasicMaterial
          color="#4a9eff"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Cloud layer simulation */}
      <mesh scale={1.02} rotation={[0, 0, 0]}>
        <sphereGeometry args={[3, 32, 32]} />
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={0.15}
          roughness={1}
        />
      </mesh>

      {/* Atmospheric light */}
      <pointLight
        position={[0, 0, 0]}
        intensity={0.5}
        distance={10}
        color="#4a9eff"
      />
    </group>
  );
}

function ImpactEffect({ show }: { show: boolean }) {
  const [scale, setScale] = useState(0);
  const [innerScale, setInnerScale] = useState(0);

  useEffect(() => {
    if (show) {
      let currentScale = 0;
      const interval = setInterval(() => {
        currentScale += 0.4;
        setScale(currentScale);
        setInnerScale(currentScale * 0.7);

        if (currentScale > 10) {
          clearInterval(interval);
        }
      }, 40);

      return () => clearInterval(interval);
    }
  }, [show]);

  if (!show) return null;

  const opacity = Math.max(0, 1 - scale / 10);

  return (
    <group position={[0, 0, 0]}>
      {/* Outer shockwave - orange */}
      <mesh>
        <sphereGeometry args={[scale, 32, 32]} />
        <meshBasicMaterial
          color="#ff6600"
          transparent
          opacity={opacity * 0.7}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Middle shockwave - red-orange */}
      <mesh>
        <sphereGeometry args={[scale * 0.8, 32, 32]} />
        <meshBasicMaterial
          color="#ff3300"
          transparent
          opacity={opacity * 0.8}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Inner explosion - bright yellow-white */}
      <mesh>
        <sphereGeometry args={[innerScale, 32, 32]} />
        <meshBasicMaterial color="#ffff00" transparent opacity={opacity} />
      </mesh>

      {/* Fire ring effect */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[scale * 0.6, scale * 0.2, 16, 32]} />
        <meshBasicMaterial
          color="#ff4400"
          transparent
          opacity={opacity * 0.6}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Intense light at impact point */}
      <pointLight
        position={[0, 0, 0]}
        intensity={opacity * 50}
        distance={scale * 2}
        color="#ffaa00"
      />

      {/* Debris particles effect */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            Math.cos((i * Math.PI * 2) / 8) * scale * 0.5,
            Math.sin((i * Math.PI * 2) / 8) * scale * 0.3,
            0,
          ]}
        >
          <sphereGeometry args={[scale * 0.1, 8, 8]} />
          <meshBasicMaterial
            color="#8B4513"
            transparent
            opacity={opacity * 0.8}
          />
        </mesh>
      ))}
    </group>
  );
}

function ImpactoContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const meteoriteId = searchParams?.get("id");

  const [meteoriteData, setMeteoriteData] = useState<NEOData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showImpact, setShowImpact] = useState(false);
  const [impactData, setImpactData] = useState<{
    energy: string;
    craterSize: string;
    devastationRadius: string;
  } | null>(null);

  useEffect(() => {
    if (!meteoriteId) {
      router.push("/meteorito");
      return;
    }

    const fetchMeteoriteData = async () => {
      try {
        const response = await fetch(
          "https://api.nasa.gov/neo/rest/v1/feed?start_date=2015-09-07&end_date=2015-09-08&api_key=DEMO_KEY"
        );

        const data = await response.json();
        const allNeos = Object.values(
          data.near_earth_objects
        ).flat() as NEOData[];
        const meteorite = allNeos.find((neo) => neo.id === meteoriteId);

        if (meteorite) {
          setMeteoriteData(meteorite);
          calculateImpactData(meteorite);
        } else {
          router.push("/meteorito");
        }
      } catch (err) {
        console.error("Error fetching meteorite data:", err);
        router.push("/meteorito");
      } finally {
        setLoading(false);
      }
    };

    fetchMeteoriteData();
  }, [meteoriteId, router]);

  const calculateImpactData = (meteorite: NEOData) => {
    const avgDiameter =
      (meteorite.estimated_diameter.kilometers.estimated_diameter_min +
        meteorite.estimated_diameter.kilometers.estimated_diameter_max) /
      2;

    const velocity = parseFloat(
      meteorite.close_approach_data[0]?.relative_velocity
        .kilometers_per_second || "20"
    );

    // Simplified impact calculations
    const mass = (4 / 3) * Math.PI * Math.pow(avgDiameter * 500, 3) * 3000; // kg (assuming 3000 kg/m³ density)
    const energy = (0.5 * mass * Math.pow(velocity * 1000, 2)) / 4.184e12; // megatons TNT
    const craterDiameter =
      1.8 *
      Math.pow(avgDiameter, 0.13) *
      Math.pow(velocity, 0.44) *
      Math.pow(mass, 0.13);
    const devastation = craterDiameter * 3;

    setImpactData({
      energy: energy.toExponential(2) + " megatones TNT",
      craterSize: craterDiameter.toFixed(2) + " km",
      devastationRadius: devastation.toFixed(2) + " km",
    });
  };

  const handleImpact = () => {
    setShowImpact(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <h2 className="text-2xl text-white mb-2">Cargando simulación...</h2>
        </div>
      </div>
    );
  }

  if (!meteoriteData) return null;

  const avgDiameter =
    (meteoriteData.estimated_diameter.kilometers.estimated_diameter_min +
      meteoriteData.estimated_diameter.kilometers.estimated_diameter_max) /
    2;
  const scale = Math.max(0.5, Math.min(2, avgDiameter / 0.3));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-red-950 to-orange-950 relative overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Header with enhanced design */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/60 via-black/40 to-transparent backdrop-blur-md border-b border-red-500/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-5xl font-black bg-gradient-to-r from-red-400 via-orange-400 to-yellow-300 bg-clip-text text-transparent mb-2 drop-shadow-lg animate-pulse">
                Simulación de Impacto
              </h1>
              <div className="flex items-center gap-3">
                <p className="text-gray-200 font-medium text-lg">
                  {meteoriteData.name}
                </p>
                {meteoriteData.is_potentially_hazardous_asteroid && (
                  <span className="px-3 py-1 bg-red-500/20 border border-red-500 rounded-full text-red-300 text-xs font-bold uppercase animate-pulse">
                    ⚠ Peligroso
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() => router.push("/meteorito")}
              className="px-6 py-3 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border border-slate-600"
            >
              <span className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Volver
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 3D Scene */}
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 5, 15], fov: 60 }}
          style={{ background: "transparent" }}
        >
          <Suspense fallback={null}>
            {/* Enhanced lighting setup */}
            <ambientLight intensity={0.2} />
            <directionalLight
              position={[10, 10, 5]}
              intensity={1.2}
              color="#ffffff"
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
            />
            <pointLight
              position={[-10, 5, -10]}
              color="#8B5CF6"
              intensity={0.6}
            />
            <pointLight
              position={[10, -5, 10]}
              color="#4A90E2"
              intensity={0.4}
            />
            <spotLight
              position={[0, 15, 0]}
              angle={0.3}
              penumbra={1}
              intensity={0.5}
              color="#ffffff"
              castShadow
            />

            {/* Enhanced starfield */}
            <Stars
              radius={300}
              depth={60}
              count={8000}
              factor={7}
              saturation={0}
              fade
              speed={1.5}
            />

            <Environment preset="night" />

            <Earth />
            <FallingMeteorite
              scale={scale}
              onImpact={handleImpact}
              isHazardous={meteoriteData.is_potentially_hazardous_asteroid}
            />
            <ImpactEffect show={showImpact} />

            <OrbitControls
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              minDistance={5}
              maxDistance={30}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Impact Information - Enhanced Design */}
      {impactData && (
        <div className="absolute bottom-4 right-4 z-20 max-w-md">
          <div className="bg-gradient-to-br from-slate-900/95 via-red-900/95 to-orange-900/95 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-orange-500/30 transform transition-all duration-300 hover:scale-105">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-black bg-gradient-to-r from-orange-300 via-red-300 to-yellow-300 bg-clip-text text-transparent">
                Datos del Impacto
              </h2>
            </div>

            <div className="space-y-4">
              {/* Energy */}
              <div className="bg-gradient-to-r from-red-500/10 to-transparent rounded-xl p-4 border-l-4 border-red-500">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <p className="text-gray-300 text-xs uppercase tracking-wide font-bold">
                    Energía de impacto
                  </p>
                </div>
                <p className="text-2xl font-black text-red-400">
                  {impactData.energy}
                </p>
              </div>

              {/* Crater Size */}
              <div className="bg-gradient-to-r from-orange-500/10 to-transparent rounded-xl p-4 border-l-4 border-orange-500">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                  <p className="text-gray-300 text-xs uppercase tracking-wide font-bold">
                    Diámetro del cráter
                  </p>
                </div>
                <p className="text-2xl font-black text-orange-400">
                  {impactData.craterSize}
                </p>
              </div>

              {/* Devastation Radius */}
              <div className="bg-gradient-to-r from-yellow-500/10 to-transparent rounded-xl p-4 border-l-4 border-yellow-500">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                  <p className="text-gray-300 text-xs uppercase tracking-wide font-bold">
                    Radio de devastación
                  </p>
                </div>
                <p className="text-2xl font-black text-yellow-400">
                  {impactData.devastationRadius}
                </p>
              </div>

              {/* Separator */}
              <div className="border-t border-gray-700/50 my-4" />

              {/* Additional Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
                  <p className="text-gray-400 text-xs mb-1">Velocidad</p>
                  <p className="text-lg font-bold text-white">
                    {
                      meteoriteData.close_approach_data[0]?.relative_velocity
                        .kilometers_per_second
                    }{" "}
                    km/s
                  </p>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
                  <p className="text-gray-400 text-xs mb-1">Diámetro</p>
                  <p className="text-lg font-bold text-white">
                    {avgDiameter.toFixed(3)} km
                  </p>
                </div>
              </div>
            </div>

            {/* Impact Alert */}
            {showImpact && (
              <div className="mt-5 p-4 bg-gradient-to-r from-red-600 to-red-800 rounded-xl border-2 border-red-400 shadow-lg animate-pulse">
                <div className="flex items-center justify-center gap-3">
                  <svg
                    className="w-6 h-6 text-white animate-bounce"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-white font-black text-lg tracking-wide">
                    ¡IMPACTO DETECTADO!
                  </p>
                  <svg
                    className="w-6 h-6 text-white animate-bounce"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Controls Guide - Bottom Left */}
      <div className="absolute bottom-4 left-4 z-20 bg-gradient-to-br from-slate-900/90 to-purple-900/90 backdrop-blur-xl rounded-2xl p-5 shadow-2xl border border-purple-500/30 max-w-xs">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="font-bold text-white text-lg">Controles</h3>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-start gap-2 text-gray-300">
            <span className="text-purple-400 font-bold">•</span>
            <span>
              <span className="text-white font-semibold">
                Click izquierdo + arrastrar:
              </span>{" "}
              Rotar cámara
            </span>
          </div>
          <div className="flex items-start gap-2 text-gray-300">
            <span className="text-purple-400 font-bold">•</span>
            <span>
              <span className="text-white font-semibold">Rueda del mouse:</span>{" "}
              Zoom in/out
            </span>
          </div>
          <div className="flex items-start gap-2 text-gray-300">
            <span className="text-purple-400 font-bold">•</span>
            <span>
              <span className="text-white font-semibold">
                Click derecho + arrastrar:
              </span>{" "}
              Mover cámara
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Impacto() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-orange-950 to-red-950 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-orange-500 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-white">
              Cargando simulación...
            </h2>
          </div>
        </div>
      }
    >
      <ImpactoContent />
    </Suspense>
  );
}
