"use client";

import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useFBX } from "@react-three/drei";
import * as THREE from "three";

interface AsteroidModelProps {
  scale?: number;
  color?: string;
  emissiveColor?: string;
  metalness?: number;
  roughness?: number;
  emissiveIntensity?: number;
  autoRotate?: boolean;
  rotationSpeed?: number;
}

export default function AsteroidModel({
  scale = 1,
  color = "#808080",
  emissiveColor = "#606060",
  metalness = 0.4,
  roughness = 0.6,
  emissiveIntensity = 0.2,
  autoRotate = true,
  rotationSpeed = 0.1,
}: AsteroidModelProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Load FBX model
  const fbx = useFBX("/Asteroid_2a.fbx");

  useEffect(() => {
    if (fbx) {
      // Traverse the FBX model and apply materials
      fbx.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          // Apply custom material with the specified properties
          child.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(color),
            emissive: new THREE.Color(emissiveColor),
            emissiveIntensity: emissiveIntensity,
            metalness: metalness,
            roughness: roughness,
          });
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      // Center the model
      const box = new THREE.Box3().setFromObject(fbx);
      const center = box.getCenter(new THREE.Vector3());
      fbx.position.sub(center);
    }
  }, [fbx, color, emissiveColor, emissiveIntensity, metalness, roughness]);

  // Animation
  useFrame((_, delta) => {
    if (groupRef.current && autoRotate) {
      groupRef.current.rotation.y += delta * rotationSpeed;
      groupRef.current.rotation.x += delta * (rotationSpeed * 0.5);
    }
  });

  return (
    <group ref={groupRef} scale={scale}>
      <primitive object={fbx.clone()} />

      {/* Point light for glow effect */}
      <pointLight
        position={[0, 0, 0]}
        color={emissiveColor}
        intensity={2}
        distance={12}
        decay={2}
      />

      {/* Heat shimmer effect */}
      <mesh scale={1.3}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial
          color={emissiveColor}
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}
