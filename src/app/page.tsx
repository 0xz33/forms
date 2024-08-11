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
        MouseDentro: { value: false }
      },
      vertexShader,
      fragmentShader: `
        void main() {
          gl_FragColor = vec4(0.62, 0.59, 0.78, 1.0);
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
}

function Sphere({ sphereSegments, position }: SphereProps) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const materialRef = useRef<CustomShaderMaterial>(null!)
  const wireframeRef = useRef<THREE.LineSegments>(null!)
  const [mouseDentro, setMouseDentro] = useState(false)

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.getElapsedTime()
      materialRef.current.uniforms.MouseDentro.value = mouseDentro
    }
    meshRef.current.rotation.x = meshRef.current.rotation.y += 0.01
    if (wireframeRef.current) {
      wireframeRef.current.rotation.x = wireframeRef.current.rotation.y += 0.01
    }
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
      <lineSegments ref={wireframeRef}>
        <wireframeGeometry args={[new THREE.SphereGeometry(1, sphereSegments, sphereSegments)]} />
        <lineBasicMaterial color="black" />
      </lineSegments>
    </group>
  )
}

export default function Home() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [0, 0, 5] }}>
        <Sphere sphereSegments={2} position={[-5, 0, 0]} />
        <Sphere sphereSegments={3} position={[0 - 2.5, 0, 0]} />
        <Sphere sphereSegments={4} position={[0, 0, 0]} />
        <Sphere sphereSegments={5} position={[2.5, 0, 0]} />
        <Sphere sphereSegments={33} position={[5, 0, 0]} />
      </Canvas>
    </div>
  )
}