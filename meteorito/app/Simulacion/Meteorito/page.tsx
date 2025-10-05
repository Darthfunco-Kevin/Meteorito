"use client";

import { Suspense, useState, useEffect, useMemo, memo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars, Environment } from "@react-three/drei";
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

  // Date states
  const getDefaultStartDate = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split("T")[0];
  };

  const getDefaultEndDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  const [startDate, setStartDate] = useState(getDefaultStartDate());
  const [endDate, setEndDate] = useState(getDefaultEndDate());
  const [dateError, setDateError] = useState<string | null>(null);

  // Meteorite properties
  const [scale, setScale] = useState(1);
  const [color, setColor] = useState("#808080");
  const [emissiveColor, setEmissiveColor] = useState("#606060");
  const [metalness, setMetalness] = useState(0.4);
  const [roughness, setRoughness] = useState(0.6);
  const [emissiveIntensity, setEmissiveIntensity] = useState(0.2);

  // Fetch NASA NEO data with dynamic dates
  useEffect(() => {
    // Don't fetch if there's a date error
    if (dateError) {
      return;
    }

    const fetchNEOData = async () => {
      try {
        setLoading(true);
        setError(null);

        // NASA API Key
        const apiKey = "zVzegaI3w4VmNN670raPf3di530WmWynSaJslIej";

        const response = await fetch(
          `https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=${apiKey}`
        );

        if (!response.ok) {
          throw new Error("Error fetching NASA data");
        }

        const data = await response.json();
        const allNeos = Object.values(
          data.near_earth_objects
        ).flat() as NEOData[];

        if (allNeos.length === 0) {
          throw new Error(
            "No meteorite data available for these dates"
          );
        }

        setNeoData(allNeos);

        // Select first meteorite by default
        if (allNeos.length > 0) {
          handleMeteoriteSelect(allNeos[0]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        console.error("Error fetching NEO data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNEOData();
  }, [startDate, endDate, dateError]);

  // Validate and handle date changes
  const handleDateChange = (start: string, end: string) => {
    const startDateObj = new Date(start);
    const endDateObj = new Date(end);

    // Validate start date is not after end date
    if (startDateObj > endDateObj) {
      setDateError("Start date must be before end date");
      return;
    }

    // Validate dates are not in the future
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (endDateObj > today) {
      setDateError("Cannot select future dates");
      return;
    }

    // Validate date range (NASA API allows max 7 days)
    const diffTime = Math.abs(endDateObj.getTime() - startDateObj.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 7) {
      setDateError("Maximum range is 7 days");
      return;
    }

    setDateError(null);
    setStartDate(start);
    setEndDate(end);
  };

  const handleMeteoriteSelect = (meteorite: NEOData) => {
    setSelectedMeteorite(meteorite);

    // Calculate scale based on diameter
    const avgDiameter =
      (meteorite.estimated_diameter.kilometers.estimated_diameter_min +
        meteorite.estimated_diameter.kilometers.estimated_diameter_max) /
      2;
    const calculatedScale = Math.max(0.1, Math.min(5, avgDiameter / 0.5)) * 3; // Aumentar escala 3x
    setScale(calculatedScale);

    // Set color to gray for all meteorites
    setColor("#808080"); // Gray
    setEmissiveColor("#606060"); // Dark gray
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
            Loading NASA data...
          </h2>
          <p className="text-gray-300 text-lg">
            Getting real meteorite information
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
            Error loading data
          </h2>
          <p className="text-gray-300 mb-6 text-lg">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold rounded-xl hover:from-red-700 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-xl shadow-red-500/30"
          >
            Retry
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
      <div className="absolute top-16 left-0 right-0 z-20 bg-gradient-to-b from-black/70 via-black/50 to-transparent backdrop-blur-lg border-b border-purple-500/30 shadow-2xl shadow-purple-900/20">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            {/* Title Section */}
            <div className="flex-1">
              <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent mb-3 drop-shadow-2xl">
                Meteorite Simulator
              </h1>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="px-4 py-1.5 bg-gradient-to-r from-purple-600/30 to-blue-600/30 border border-purple-500/50 rounded-full text-xs text-purple-300 font-bold shadow-lg shadow-purple-500/20">
                  🛰️ NASA Data
                </span>
                <p className="text-gray-300 text-sm font-medium">
                  🖱️ Interact with the mouse to explore
                </p>
              </div>
            </div>

            {/* Date Selectors */}
            <div className="flex flex-col gap-2 w-full lg:w-auto">
              <div className="flex items-center gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-gray-300 font-bold uppercase tracking-wide">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => {
                      const newStart = e.target.value;
                      handleDateChange(newStart, endDate);
                    }}
                    max={endDate}
                    className="px-4 py-2.5 bg-slate-900/90 border-2 border-purple-500/40 rounded-xl text-white text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/50 transition-all shadow-lg hover:bg-slate-800/90"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-gray-300 font-bold uppercase tracking-wide">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => {
                      const newEnd = e.target.value;
                      handleDateChange(startDate, newEnd);
                    }}
                    min={startDate}
                    max={new Date().toISOString().split("T")[0]}
                    className="px-4 py-2.5 bg-slate-900/90 border-2 border-purple-500/40 rounded-xl text-white text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/50 transition-all shadow-lg hover:bg-slate-800/90"
                  />
                </div>
              </div>

              {/* Date Error Message */}
              {dateError && (
                <div className="flex items-center gap-2 px-4 py-2.5 bg-red-900/40 border-2 border-red-500/50 rounded-xl shadow-lg shadow-red-500/20">
                  <svg
                    className="w-5 h-5 text-red-400 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-sm text-red-300 font-semibold">
                    {dateError}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3D Scene */}
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0, 10], fov: 60 }}
          style={{ background: "transparent" }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
            stencil: false,
            depth: true,
          }}
          dpr={[1, 2]}
          performance={{ min: 0.5 }}
        >
          <Suspense fallback={null}>
            {/* Lighting */}
            <ambientLight intensity={0.3} />
            <directionalLight
              position={[10, 10, 5]}
              intensity={0.8}
              color="#4A90E2"
              castShadow={false}
            />
            <pointLight
              position={[-10, -10, -10]}
              color="#8B5CF6"
              intensity={0.4}
            />

            {/* Background stars - Reduced count */}
            <Stars
              radius={300}
              depth={60}
              count={2000}
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
              enableDamping={true}
              dampingFactor={0.05}
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

      {/* Impact Button - Enhanced - Moved to bottom right */}
      {selectedMeteorite && (
        <div className="absolute bottom-6 right-6 z-20">
          <button
            onClick={() =>
              router.push(`/Simulacion/Impacto?id=${selectedMeteorite.id}`)
            }
            className="group relative overflow-hidden px-8 py-4 bg-gradient-to-br from-red-600 via-orange-600 to-red-700 text-white font-bold rounded-2xl hover:from-red-700 hover:via-orange-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-2xl shadow-red-500/50 hover:shadow-red-500/70 border-2 border-red-400/50 hover:border-red-300/70"
          >
            <span className="relative z-10 flex items-center gap-3 text-base">
              <svg
                className="w-6 h-6 group-hover:animate-pulse drop-shadow-lg"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <span className="drop-shadow-lg">Impact Simulation</span>
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200 drop-shadow-lg"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </span>
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
            {/* Pulsing glow */}
            <div className="absolute inset-0 rounded-2xl bg-red-400/20 blur-xl group-hover:bg-red-400/40 transition-all duration-300" />
          </button>
        </div>
      )}
    </div>
  );
}
