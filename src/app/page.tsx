'use client'

import React, { useRef, useState } from 'react'
import { Canvas, useFrame, extend, Object3DNode } from '@react-three/fiber'
import * as THREE from 'three'
import vertexShader from './form0'

class CustomShaderMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        time: { value: 0 },
        MouseDentro: { value: false },
        seed: { value: 0 } // New uniform for the seed
      },
      vertexShader,
      fragmentShader: `
        void main() {
          gl_FragColor = vec4(0.62, 0.59, 0.78, 1.0); // Black color for wireframe
        }
      `,
      wireframe: true
    })
  }
}

extend({ CustomShaderMaterial })

declare global {
  namespace JSX {
    interface IntrinsicElements {
      customShaderMaterial: Object3DNode<CustomShaderMaterial, typeof CustomShaderMaterial>
    }
  }
}

interface SphereProps {
  sphereSegments: number;
  position: [number, number, number];
  seed: number; // New prop for the seed
}

function Sphere({ sphereSegments, position, seed }: SphereProps) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const materialRef = useRef<CustomShaderMaterial>(null!)
  const [mouseDentro, setMouseDentro] = useState(false)

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.getElapsedTime()
      materialRef.current.uniforms.MouseDentro.value = mouseDentro
      materialRef.current.uniforms.seed.value = seed // Set the seed uniform
    }
    meshRef.current.rotation.x = meshRef.current.rotation.y += 0.01
  })

  return (
    <group
      position={position}
      onPointerEnter={() => setMouseDentro(true)}
      onPointerLeave={() => setMouseDentro(false)}
    >
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, sphereSegments, sphereSegments]} />
        <customShaderMaterial ref={materialRef} />
      </mesh>
    </group>
  )
}

export default function Home() {
  const spheres = [
    { segments: 2, position: [-5, 0, 0] },
    { segments: 3, position: [-2.5, 0, 0] },
    { segments: 8, position: [0, 0, 0] },
    { segments: 22, position: [2.5, 0, 0] },
    { segments: 111, position: [5, 0, 0] }
  ]

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
      <Canvas camera={{ position: [0, 0, 5] }}>
        {spheres.map((sphere, index) => (
          <Sphere
            key={index}
            sphereSegments={sphere.segments}
            position={sphere.position as [number, number, number]}
            seed={Math.random() * 100} // Generate a random seed for each sphere
          />
        ))}
      </Canvas>
    </div>
  )
}