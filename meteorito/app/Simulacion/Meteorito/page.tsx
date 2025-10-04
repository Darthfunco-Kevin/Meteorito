"use client";

import { Suspense, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Stars,
  Environment,
  Text,
  Html,
} from "@react-three/drei";
import InteractiveMeteorite from "./Components/InteractiveMeteorite";
import ControlPanel from "@/app/Simulacion/Meteorito/Components/ControlPanel";
import MeteoriteInfo from "@/app/Simulacion/Meteorito/Components/MeteoriteInfo";
import { useRouter } from "next/navigation";

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

export default function Meteorito() {
  const router = useRouter();
  const [neoData, setNeoData] = useState<NEOData[]>([]);
  const [selectedMeteorite, setSelectedMeteorite] = useState<NEOData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Meteorite properties
  const [scale, setScale] = useState(1);
  const [color, setColor] = useState("#8B4513");
  const [emissiveColor, setEmissiveColor] = useState("#FF4500");
  const [metalness, setMetalness] = useState(0.4);
  const [roughness, setRoughness] = useState(0.6);
  const [emissiveIntensity, setEmissiveIntensity] = useState(0.2);

  // Fetch NASA NEO data
  useEffect(() => {
    const fetchNEOData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://api.nasa.gov/neo/rest/v1/feed?start_date=2015-09-07&end_date=2015-09-08&api_key=zVzegaI3w4VmNN670raPf3di530WmWynSaJslIej"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch NEO data");
        }

        const data = await response.json();
        const allNeos = Object.values(
          data.near_earth_objects
        ).flat() as NEOData[];
        setNeoData(allNeos);

        // Select first meteorite by default
        if (allNeos.length > 0) {
          setSelectedMeteorite(allNeos[0]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        console.error("Error fetching NEO data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNEOData();
  }, []);

  const handleMeteoriteSelect = (meteorite: NEOData) => {
    setSelectedMeteorite(meteorite);

    // Calculate scale based on diameter
    const avgDiameter =
      (meteorite.estimated_diameter.kilometers.estimated_diameter_min +
        meteorite.estimated_diameter.kilometers.estimated_diameter_max) /
      2;
    const calculatedScale = Math.max(0.1, Math.min(5, avgDiameter / 0.5)); // Normalize to reasonable scale
    setScale(calculatedScale);

    // Set color based on hazard status
    if (meteorite.is_potentially_hazardous_asteroid) {
      setColor("#8B0000"); // Dark red for hazardous
      setEmissiveColor("#FF0000"); // Bright red
    } else {
      setColor("#8B4513"); // Brown for safe
      setEmissiveColor("#FF4500"); // Orange
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-indigo-950 flex items-center justify-center relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </div>

        <div className="text-center relative z-10">
          <div className="relative inline-block mb-6">
            <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-purple-500 mx-auto"></div>
            <div
              className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-cyan-500 mx-auto absolute inset-0"
              style={{
                animationDirection: "reverse",
                animationDuration: "1.5s",
              }}
            ></div>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent mb-3">
            Cargando datos de la NASA...
          </h2>
          <p className="text-gray-300 text-lg">
            Obteniendo información de meteoritos reales
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" />
            <div
              className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            />
            <div
              className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.4s" }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-red-950 to-orange-950 flex items-center justify-center relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-96 h-96 bg-red-500/20 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-20 right-20 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </div>

        <div className="text-center relative z-10 max-w-md mx-auto px-6">
          <div className="mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-red-500/50">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-red-400 mb-3">
            Error al cargar datos
          </h2>
          <p className="text-gray-300 mb-6 text-lg">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold rounded-xl hover:from-red-700 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-xl shadow-red-500/30"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-indigo-950 relative overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-500/15 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1.5s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "3s" }}
        />
      </div>

      {/* Enhanced Header */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/60 via-black/40 to-transparent backdrop-blur-md border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-black bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2 drop-shadow-lg">
                Simulador de Meteoritos
              </h1>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-purple-600/20 border border-purple-500/40 rounded-full text-xs text-purple-300 font-semibold">
                  Datos NASA
                </span>
                <p className="text-gray-300 text-sm">
                  Interactúa con el mouse para explorar
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3D Scene */}
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0, 10], fov: 60 }}
          style={{ background: "transparent" }}
          gl={{ antialias: true, alpha: true }}
        >
          <Suspense fallback={null}>
            {/* Lighting */}
            <ambientLight intensity={0.3} />
            <directionalLight
              position={[10, 10, 5]}
              intensity={0.8}
              color="#4A90E2"
            />
            <pointLight
              position={[-10, -10, -10]}
              color="#8B5CF6"
              intensity={0.4}
            />
            <pointLight
              position={[10, -10, 10]}
              color="#06B6D4"
              intensity={0.3}
            />

            {/* Background stars */}
            <Stars
              radius={300}
              depth={60}
              count={5000}
              factor={6}
              saturation={0}
              fade
              speed={0.5}
            />

            {/* Environment */}
            <Environment preset="night" />

            {/* Interactive Meteorite */}
            {selectedMeteorite && (
              <InteractiveMeteorite
                scale={scale}
                color={color}
                emissiveColor={emissiveColor}
                metalness={metalness}
                roughness={roughness}
                emissiveIntensity={emissiveIntensity}
                neoData={selectedMeteorite}
              />
            )}

            {/* Orbit Controls */}
            <OrbitControls
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              minDistance={2}
              maxDistance={50}
              autoRotate={false}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Control Panel */}
      <ControlPanel
        neoData={neoData}
        selectedMeteorite={selectedMeteorite}
        onMeteoriteSelect={handleMeteoriteSelect}
        scale={scale}
        setScale={setScale}
        color={color}
        setColor={setColor}
        emissiveColor={emissiveColor}
        setEmissiveColor={setEmissiveColor}
        metalness={metalness}
        setMetalness={setMetalness}
        roughness={roughness}
        setRoughness={setRoughness}
        emissiveIntensity={emissiveIntensity}
        setEmissiveIntensity={setEmissiveIntensity}
      />

      {/* Meteorite Information */}
      {selectedMeteorite && <MeteoriteInfo meteorite={selectedMeteorite} />}

      {/* Instructions - Enhanced */}
      <div className="absolute bottom-4 right-4 z-20 bg-gradient-to-br from-slate-900/90 to-purple-900/90 backdrop-blur-xl rounded-2xl p-5 text-white shadow-2xl border border-purple-500/30 max-w-xs">
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
          <h3 className="font-bold text-lg">Controles</h3>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-start gap-2 text-gray-300">
            <span className="text-purple-400 font-bold">•</span>
            <span>
              <span className="text-white font-semibold">
                Click izquierdo + arrastrar:
              </span>{" "}
              Rotar vista
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
          <div className="flex items-start gap-2 text-gray-300">
            <span className="text-purple-400 font-bold">•</span>
            <span>
              <span className="text-white font-semibold">Panel lateral:</span>{" "}
              Ajustar propiedades
            </span>
          </div>
        </div>
      </div>

      {/* Impact Button - Enhanced */}
      {selectedMeteorite && (
        <div className="absolute bottom-4 left-4 z-20">
          <button
            onClick={() =>
              router.push(`/Simulacion/Impacto?id=${selectedMeteorite.id}`)
            }
            className="group relative overflow-hidden px-10 py-4 bg-gradient-to-r from-red-600 via-orange-600 to-red-600 text-white font-bold rounded-2xl hover:from-red-700 hover:via-orange-700 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-red-500/40 hover:shadow-red-500/60 border border-red-500/50"
          >
            <span className="relative z-10 flex items-center gap-3">
              <svg
                className="w-6 h-6 group-hover:animate-pulse"
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
              Ver Simulación de Impacto
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </span>
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
          </button>
        </div>
      )}
    </div>
  );
}
