"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh, Group } from "three";
import * as THREE from "three";
import { Trail, Text, MeshDistortMaterial } from "@react-three/drei";

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

export default function InteractiveMeteorite({
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
  const trailRef = useRef<Mesh>(null);

  // Animation
  useFrame((_, delta) => {
    if (groupRef.current) {
      // Slow rotation
      groupRef.current.rotation.y += delta * 0.1;
      groupRef.current.rotation.x += delta * 0.05;
    }
  });

  // Calculate diameter for display
  const avgDiameter = (neoData.estimated_diameter.kilometers.estimated_diameter_min + 
                     neoData.estimated_diameter.kilometers.estimated_diameter_max) / 2;

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
      <mesh scale={0.92} castShadow>
        <icosahedronGeometry args={[1, 3]} />
        <MeshDistortMaterial
          color={new THREE.Color().lerpColors(new THREE.Color(color), new THREE.Color("#2a1810"), 0.4)}
          metalness={metalness + 0.4}
          roughness={roughness}
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity * 0.8}
          distort={0.3}
          speed={1}
        />
      </mesh>

      {/* Textured surface overlay */}
      <mesh scale={1.02}>
        <icosahedronGeometry args={[1, 3]} />
        <meshStandardMaterial
          color="#3a2010"
          metalness={0.9}
          roughness={0.8}
          transparent
          opacity={0.5}
          normalScale={new THREE.Vector2(3, 3)}
        />
      </mesh>

      {/* Glowing molten core */}
      <mesh scale={0.65}>
        <icosahedronGeometry args={[1, 2]} />
        <meshBasicMaterial
          color={emissiveColor}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Inner blazing core */}
      <mesh scale={0.35}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial
          color="#ffd700"
          transparent
          opacity={0.95}
        />
      </mesh>

      {/* Heat shimmer effect */}
      <mesh scale={1.3}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial
          color={emissiveColor}
          transparent
          opacity={0.12}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Outer atmospheric glow */}
      <mesh scale={1.5}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshBasicMaterial
          color={emissiveColor}
          transparent
          opacity={0.06}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Enhanced multi-layered trail effect */}
      <Trail
        width={3}
        length={15}
        color={new THREE.Color(emissiveColor)}
        attenuation={(t) => t * t * t}
      >
        <mesh ref={trailRef}>
          <sphereGeometry args={[0.15]} />
          <meshBasicMaterial color={emissiveColor} transparent opacity={1} />
        </mesh>
      </Trail>

      <Trail
        width={2}
        length={12}
        color={new THREE.Color(emissiveColor).multiplyScalar(0.8)}
        attenuation={(t) => t * t}
      >
        <mesh>
          <sphereGeometry args={[0.1]} />
          <meshBasicMaterial
            color={emissiveColor}
            transparent
            opacity={0.8}
          />
        </mesh>
      </Trail>

      <Trail
        width={4}
        length={18}
        color={new THREE.Color(emissiveColor).multiplyScalar(0.5)}
        attenuation={(t) => Math.pow(t, 4)}
      >
        <mesh>
          <sphereGeometry args={[0.18]} />
          <meshBasicMaterial
            color={emissiveColor}
            transparent
            opacity={0.4}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </Trail>

      {/* Enhanced lighting system */}
      <pointLight
        position={[0, 0, 0]}
        color={emissiveColor}
        intensity={2.5}
        distance={15}
        decay={1.5}
      />

      <pointLight
        position={[0, 0, 0]}
        color="#ffd700"
        intensity={1.5}
        distance={10}
        decay={2}
      />

      <pointLight
        position={[0.5, 0, 0]}
        color={emissiveColor}
        intensity={1}
        distance={8}
        decay={2.5}
      />
      
      {/* Meteorite name label */}
      <Text
        position={[0, scale * 2, 0]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {neoData.name}
      </Text>

      {/* Diameter label */}
      <Text
        position={[0, scale * 1.5, 0]}
        fontSize={0.3}
        color="#00d4ff"
        anchorX="center"
        anchorY="middle"
      >
        {avgDiameter.toFixed(2)} km
      </Text>

      {/* Hazard status indicator */}
      {neoData.is_potentially_hazardous_asteroid && (
        <Text
          position={[0, scale * 1.2, 0]}
          fontSize={0.25}
          color="#ff4444"
          anchorX="center"
          anchorY="middle"
        >
          ⚠️ PELIGROSO
        </Text>
      )}
    </group>
  );
}
