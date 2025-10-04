"use client";

import { useRef, useMemo, memo } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh, Group } from "three";
import * as THREE from "three";
import { Html, MeshDistortMaterial } from "@react-three/drei";

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
  const meshRef = useRef<Mesh>(null);
  const groupRef = useRef<Group>(null);

  // Animation
  useFrame((_, delta) => {
    if (groupRef.current) {
      // Slow rotation
      groupRef.current.rotation.y += delta * 0.1;
      groupRef.current.rotation.x += delta * 0.05;
    }
  });

  // Calculate diameter for display - memoized
  const avgDiameter = useMemo(() =>
    (neoData.estimated_diameter.kilometers.estimated_diameter_min +
     neoData.estimated_diameter.kilometers.estimated_diameter_max) / 2,
    [neoData]
  );

  // Memoize colors
  const secondaryColor = useMemo(
    () => new THREE.Color().lerpColors(new THREE.Color(color), new THREE.Color("#2a1810"), 0.4),
    [color]
  );

  return (
    <group ref={groupRef} scale={scale}>
      {/* Main meteorite body - Enhanced with distortion */}
      <mesh ref={meshRef} castShadow receiveShadow>
        <icosahedronGeometry args={[1, 4]} />
        <MeshDistortMaterial
          color={color}
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity * 1.5}
          metalness={metalness + 0.3}
          roughness={roughness - 0.2}
          distort={0.4}
          speed={1.5}
          envMapIntensity={2}
        />
      </mesh>

      {/* Secondary rocky layer with distortion */}
      <mesh scale={0.92}>
        <icosahedronGeometry args={[1, 2]} />
        <MeshDistortMaterial
          color={secondaryColor}
          metalness={metalness + 0.4}
          roughness={roughness}
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity * 0.8}
          distort={0.3}
          speed={1}
        />
      </mesh>

      {/* Glowing molten core */}
      <mesh scale={0.65}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshBasicMaterial
          color={emissiveColor}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Heat shimmer effect */}
      <mesh scale={1.3}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshBasicMaterial
          color={emissiveColor}
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Simplified lighting */}
      <pointLight
        position={[0, 0, 0]}
        color={emissiveColor}
        intensity={2}
        distance={12}
        decay={2}
      />
      
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
