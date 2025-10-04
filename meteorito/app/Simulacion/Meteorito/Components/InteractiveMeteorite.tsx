"use client";

import { useMemo, memo, Suspense } from "react";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import AsteroidModel from "./AsteroidModel";

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

interface InteractiveMeteoriteProps {
  scale: number;
  color: string;
  emissiveColor: string;
  metalness: number;
  roughness: number;
  emissiveIntensity: number;
  neoData: NEOData;
}

const InteractiveMeteorite = memo(function InteractiveMeteorite({
  scale,
  color,
  emissiveColor,
  metalness,
  roughness,
  emissiveIntensity,
  neoData
}: InteractiveMeteoriteProps) {
  // Calculate diameter for display - memoized
  const avgDiameter = useMemo(() =>
    (neoData.estimated_diameter.kilometers.estimated_diameter_min +
     neoData.estimated_diameter.kilometers.estimated_diameter_max) / 2,
    [neoData]
  );

  return (
    <group scale={scale}>
      {/* FBX Asteroid Model */}
      <Suspense fallback={null}>
        <AsteroidModel
          scale={0.01}
          color={color}
          emissiveColor={emissiveColor}
          metalness={metalness}
          roughness={roughness}
          emissiveIntensity={emissiveIntensity}
          autoRotate={true}
          rotationSpeed={0.1}
        />
      </Suspense>

      {/* Meteorite labels - Using HTML for 2D overlay */}
      <Html
        position={[0, scale * 2, 0]}
        center
        distanceFactor={10}
        style={{
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        <div className="flex flex-col items-center gap-1">
          <div className="text-white font-bold text-lg whitespace-nowrap drop-shadow-lg">
            {neoData.name}
          </div>
          <div className="text-cyan-400 font-semibold text-sm drop-shadow-lg">
            {avgDiameter.toFixed(2)} km
          </div>
          {neoData.is_potentially_hazardous_asteroid && (
            <div className="text-red-400 font-bold text-xs drop-shadow-lg animate-pulse">
              ⚠️ PELIGROSO
            </div>
          )}
        </div>
      </Html>
    </group>
  );
});

export default InteractiveMeteorite;
