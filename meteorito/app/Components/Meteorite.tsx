"use client";

import { useRef, useMemo, useCallback } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh, Vector3, BufferGeometry, Points, PointsMaterial, Group } from "three";
import * as THREE from "three";
import { Trail, Sphere, useTexture, shaderMaterial, MeshDistortMaterial } from "@react-three/drei";

interface MeteoriteProps {
  position: [number, number, number];
  scale?: number;
}

// Custom shader material for meteorite surface
const MeteoriteMaterial = shaderMaterial(
  {
    time: 0,
    color: new THREE.Color("#8B4513"),
    emissive: new THREE.Color("#FF4500"),
    emissiveIntensity: 0.2,
  },
  // Vertex shader
  `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    
    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment shader
  `
    uniform float time;
    uniform vec3 color;
    uniform vec3 emissive;
    uniform float emissiveIntensity;
    
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    
    // Noise function
    float noise(vec3 p) {
      return fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
    }
    
    void main() {
      // Create surface variations
      vec3 pos = vPosition * 3.0;
      float n1 = noise(pos);
      float n2 = noise(pos * 2.0);
      float n3 = noise(pos * 4.0);
      
      // Combine noise for surface detail
      float surface = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;
      
      // Create crater-like depressions
      float craters = smoothstep(0.7, 0.9, n1) * 0.3;
      
      // Base color with surface variations
      vec3 baseColor = mix(color, color * 0.7, surface);
      baseColor = mix(baseColor, baseColor * 0.5, craters);
      
      // Add metallic highlights
      float metallic = smoothstep(0.6, 0.8, n2) * 0.4;
      baseColor += metallic * vec3(0.3, 0.2, 0.1);
      
      // Emissive glow
      vec3 glow = emissive * emissiveIntensity * (1.0 + sin(time * 2.0) * 0.1);
      
      gl_FragColor = vec4(baseColor + glow, 1.0);
    }
  `
);

export default function Meteorite({ position, scale = 1 }: MeteoriteProps) {
  const meshRef = useRef<Mesh>(null);
  const trailRef = useRef<Mesh>(null);
  const particlesRef = useRef<Points>(null);
  const groupRef = useRef<Group>(null);
  
  // Create more realistic meteorite geometry using sphere as base
  const meteoriteGeometry = useMemo(() => {
    // Start with a sphere for more organic shape
    const geometry = new THREE.SphereGeometry(1, 32, 24);
    
    // Add dramatic surface variations to make it look like a real meteorite
    const positions = geometry.attributes.position.array;
    const normals = geometry.attributes.normal.array;
    
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];
      const z = positions[i + 2];
      
      // Calculate distance from center for more controlled deformation
      const distance = Math.sqrt(x * x + y * y + z * z);
      
      // Create layered noise for more realistic surface
      const noise1 = (Math.random() - 0.5) * 0.3;
      const noise2 = (Math.random() - 0.5) * 0.15;
      const noise3 = (Math.random() - 0.5) * 0.08;
      
      // Add elongation in one direction (meteorites are often elongated)
      const elongationFactor = 1.2 + Math.random() * 0.6; // 1.2 to 1.8
      const elongationDirection = Math.atan2(z, x);
      const elongation = Math.cos(elongationDirection) * 0.3;
      
      // Add some flattening on one side (impact side)
      const flattening = Math.sin(elongationDirection) * 0.2;
      
      // Apply deformations with NaN checks
      let newX = x + noise1 + elongation;
      let newY = y + noise2 + flattening;
      let newZ = z + noise3;
      
      // Scale the meteorite to be more elongated
      newX *= elongationFactor;
      newY *= (0.8 + Math.random() * 0.4); // More variation in Y
      newZ *= (0.9 + Math.random() * 0.2);
      
      // Add some random bumps and dents
      if (Math.random() > 0.8) {
        const bumpFactor = 0.7 + Math.random() * 0.6; // 0.7 to 1.3
        newX *= bumpFactor;
        newY *= bumpFactor;
        newZ *= bumpFactor;
      }
      
      // Create some crater-like depressions
      if (Math.random() > 0.9) {
        const craterFactor = 0.6 + Math.random() * 0.3; // 0.6 to 0.9
        newX *= craterFactor;
        newY *= craterFactor;
        newZ *= craterFactor;
      }
      
      // Ensure no NaN values
      positions[i] = isNaN(newX) ? x : newX;
      positions[i + 1] = isNaN(newY) ? y : newY;
      positions[i + 2] = isNaN(newZ) ? z : newZ;
    }
    
    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals();
    
    return geometry;
  }, []);

  // Create enhanced particle system for trail
  const particleGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(2000);
    const colors = new Float32Array(2000 * 3);
    const sizes = new Float32Array(2000);
    
    for (let i = 0; i < 2000; i++) {
      // Ensure no NaN values in positions
      positions[i] = (Math.random() - 0.5) * 15;
      positions[i + 1] = (Math.random() - 0.5) * 15;
      positions[i + 2] = (Math.random() - 0.5) * 15;
      
      // Validate positions
      if (isNaN(positions[i])) positions[i] = 0;
      if (isNaN(positions[i + 1])) positions[i + 1] = 0;
      if (isNaN(positions[i + 2])) positions[i + 2] = 0;
      
      // More varied colors for realistic fire trail
      const colorVariation = Math.random();
      if (colorVariation < 0.3) {
        colors[i * 3] = 1; // Red
        colors[i * 3 + 1] = 0.2 + Math.random() * 0.3; // Orange
        colors[i * 3 + 2] = 0; // No blue
      } else if (colorVariation < 0.6) {
        colors[i * 3] = 1; // Red
        colors[i * 3 + 1] = 0.5 + Math.random() * 0.3; // Yellow-orange
        colors[i * 3 + 2] = 0.1; // Slight blue
      } else {
        colors[i * 3] = 0.8 + Math.random() * 0.2; // Red-orange
        colors[i * 3 + 1] = 0.1 + Math.random() * 0.2; // Dark orange
        colors[i * 3 + 2] = 0; // No blue
      }
      
      // Validate colors
      if (isNaN(colors[i * 3])) colors[i * 3] = 1;
      if (isNaN(colors[i * 3 + 1])) colors[i * 3 + 1] = 0.5;
      if (isNaN(colors[i * 3 + 2])) colors[i * 3 + 2] = 0;
      
      sizes[i] = 0.01 + Math.random() * 0.03;
      if (isNaN(sizes[i])) sizes[i] = 0.02;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    return geometry;
  }, []);

  // Animation loop
  useFrame((state, delta) => {
    if (groupRef.current) {
      // Rotate the entire meteorite group
      groupRef.current.rotation.x += delta * 0.3;
      groupRef.current.rotation.y += delta * 0.2;
      groupRef.current.rotation.z += delta * 0.1;
      
      // Move the meteorite from right to left
      groupRef.current.position.x -= delta * 2.5;
      
      // Add slight vertical movement
      groupRef.current.position.y += Math.sin(state.clock.elapsedTime * 1.5) * 0.02;
      
      // Add slight rotation around the movement axis
      groupRef.current.rotation.y += delta * 0.1;
      
      // Reset position when it goes off screen
      if (groupRef.current.position.x < -25) {
        groupRef.current.position.x = 25;
        groupRef.current.position.y = position[1] + (Math.random() - 0.5) * 6;
        groupRef.current.position.z = position[2] + (Math.random() - 0.5) * 4;
      }
    }

    // Animate particles with more realistic movement
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      const colors = particlesRef.current.geometry.attributes.color.array as Float32Array;
      
      for (let i = 0; i < positions.length; i += 3) {
        // Move particles backward and add some drift
        const deltaX = delta * 1.5;
        const deltaY = (Math.random() - 0.5) * delta * 0.5;
        const deltaZ = (Math.random() - 0.5) * delta * 0.3;
        
        // Apply movement with NaN checks
        let newX = positions[i] - deltaX;
        let newY = positions[i + 1] + deltaY;
        let newZ = positions[i + 2] + deltaZ;
        
        // Validate positions
        if (isNaN(newX)) newX = positions[i];
        if (isNaN(newY)) newY = positions[i + 1];
        if (isNaN(newZ)) newZ = positions[i + 2];
        
        positions[i] = newX;
        positions[i + 1] = newY;
        positions[i + 2] = newZ;
        
        // Fade particles as they move away
        const alpha = Math.max(0, 1 - Math.abs(positions[i]) / 20);
        if (!isNaN(alpha)) {
          colors[i * 3 + 1] *= alpha; // Fade green component
          colors[i * 3 + 2] *= alpha; // Fade blue component
        }
        
        // Reset particles when they go off screen
        if (positions[i] < -20) {
          positions[i] = 20;
          positions[i + 1] = (Math.random() - 0.5) * 10;
          positions[i + 2] = (Math.random() - 0.5) * 10;
          
          // Validate reset positions
          if (isNaN(positions[i])) positions[i] = 20;
          if (isNaN(positions[i + 1])) positions[i + 1] = 0;
          if (isNaN(positions[i + 2])) positions[i + 2] = 0;
        }
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
      particlesRef.current.geometry.attributes.color.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Main meteorite body - Enhanced with distortion */}
      <mesh ref={meshRef} castShadow receiveShadow>
        <icosahedronGeometry args={[1, 4]} />
        <MeshDistortMaterial
          color="#4a2c1a"
          emissive="#ff6b35"
          emissiveIntensity={0.7}
          metalness={0.9}
          roughness={0.2}
          distort={0.5}
          speed={1.5}
          envMapIntensity={2}
        />
      </mesh>

      {/* Secondary rocky layer */}
      <mesh scale={0.92} castShadow>
        <icosahedronGeometry args={[1, 3]} />
        <MeshDistortMaterial
          color="#654321"
          metalness={0.7}
          roughness={0.6}
          emissive="#ff4500"
          emissiveIntensity={0.3}
          distort={0.3}
          speed={1}
        />
      </mesh>

      {/* Glowing molten core */}
      <mesh scale={0.65}>
        <icosahedronGeometry args={[1, 2]} />
        <meshBasicMaterial
          color="#ff8c00"
          transparent
          opacity={0.8}
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

      {/* Surface texture overlay */}
      <mesh scale={1.05}>
        <icosahedronGeometry args={[1, 3]} />
        <meshStandardMaterial
          color="#3a1f0f"
          metalness={0.95}
          roughness={0.85}
          transparent
          opacity={0.4}
          normalScale={new THREE.Vector2(2, 2)}
        />
      </mesh>

      {/* Heat shimmer effect */}
      <mesh scale={1.2}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial
          color="#ff6600"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Enhanced particle trail system */}
      <points ref={particlesRef} geometry={particleGeometry}>
        <pointsMaterial
          size={0.05}
          vertexColors
          transparent
          opacity={0.95}
          blending={THREE.AdditiveBlending}
          sizeAttenuation={true}
        />
      </points>

      {/* Multiple layered trail effects for ultra realism */}
      <Trail
        width={2.5}
        length={20}
        color={new THREE.Color("#ff4400")}
        attenuation={(t) => t * t * t * t}
      >
        <mesh ref={trailRef}>
          <sphereGeometry args={[0.12]} />
          <meshBasicMaterial color="#ff4400" transparent opacity={1} />
        </mesh>
      </Trail>

      <Trail
        width={1.8}
        length={16}
        color={new THREE.Color("#ff6600")}
        attenuation={(t) => t * t * t}
      >
        <mesh>
          <sphereGeometry args={[0.09]} />
          <meshBasicMaterial color="#ff8800" transparent opacity={0.9} />
        </mesh>
      </Trail>

      <Trail
        width={1.2}
        length={12}
        color={new THREE.Color("#ffaa00")}
        attenuation={(t) => t * t}
      >
        <mesh>
          <sphereGeometry args={[0.06]} />
          <meshBasicMaterial color="#ffaa00" transparent opacity={0.7} />
        </mesh>
      </Trail>

      {/* Outer glow trail */}
      <Trail
        width={3.5}
        length={25}
        color={new THREE.Color("#ff2200")}
        attenuation={(t) => Math.pow(t, 5)}
      >
        <mesh>
          <sphereGeometry args={[0.15]} />
          <meshBasicMaterial
            color="#ff2200"
            transparent
            opacity={0.4}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </Trail>
      
      {/* Enhanced lighting system - Multiple colored lights */}
      <pointLight
        position={[0, 0, 0]}
        color="#ff4500"
        intensity={2.5}
        distance={25}
        decay={1}
      />

      <pointLight
        position={[0, 0, 0]}
        color="#ffd700"
        intensity={1.5}
        distance={15}
        decay={1.5}
      />

      <pointLight
        position={[-0.5, 0, 0]}
        color="#ff6b00"
        intensity={1}
        distance={10}
        decay={2}
      />

      {/* Trailing lights for motion effect */}
      <pointLight
        position={[-2, 0, 0]}
        color="#ff8800"
        intensity={0.8}
        distance={8}
        decay={2.5}
      />

      {/* Atmospheric glow layers */}
      <mesh scale={1.6}>
        <sphereGeometry args={[1, 20, 20]} />
        <meshBasicMaterial
          color="#ff4500"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <mesh scale={2}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial
          color="#ff6600"
          transparent
          opacity={0.08}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Outer atmospheric halo */}
      <mesh scale={2.5}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshBasicMaterial
          color="#ff8800"
          transparent
          opacity={0.04}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

