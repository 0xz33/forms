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
          gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
        }
      `,
      wireframe: true
    })
  }
}

extend({ CustomShaderMaterial })

// Add this type declaration to fix the TypeScript error
declare global {
  namespace JSX {
    interface IntrinsicElements {
      customShaderMaterial: Object3DNode<CustomShaderMaterial, typeof CustomShaderMaterial>
    }
  }
}

function Sphere() {
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

  // Reduced segment count for fewer triangles
  const sphereSegments = 3 // Reduced from 64

  return (
    <group
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
      <Canvas camera={{ position: [0, 0, 3] }}>
        <Sphere />
      </Canvas>
    </div>
  )
}