'use client'

import React, { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, extend, Object3DNode } from '@react-three/fiber'
import * as THREE from 'three'
import vertexShader from '../app/form0'
import { PerspectiveCamera } from '@react-three/drei'

class CustomShaderMaterial extends THREE.ShaderMaterial {
    constructor() {
        super({
            uniforms: {
                time: { value: 0 },
                MouseDentro: { value: false },
                seed: { value: 0 }
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
    seed: number;
    speed: number;
}

function Sphere({ sphereSegments, seed, speed }: SphereProps) {
    const meshRef = useRef<THREE.Mesh>(null!)
    const materialRef = useRef<CustomShaderMaterial>(null!)
    const [mouseDentro, setMouseDentro] = useState(false)

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.time.value = state.clock.getElapsedTime()
            materialRef.current.uniforms.MouseDentro.value = mouseDentro
            materialRef.current.uniforms.seed.value = seed
        }
        meshRef.current.rotation.x = meshRef.current.rotation.y += 0.01 * speed
    })

    return (
        <group
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

interface SuperSphereProps {
    width?: string | number;
    height?: string | number;
    className?: string;
    style?: React.CSSProperties;
    vertices?: number; // New prop for number of vertices
    speed?: number; // New prop for rotation speed
}

export default function SuperSphere({
    width = '100%',
    height = '100%',
    className,
    style,
    vertices = 32, // Default value if not provided
    speed = 1 // Default speed if not provided
}: SuperSphereProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const [size, setSize] = useState({ width: 0, height: 0 })

    useEffect(() => {
        const updateSize = () => {
            if (containerRef.current) {
                setSize({
                    width: containerRef.current.clientWidth,
                    height: containerRef.current.clientHeight
                })
            }
        }

        window.addEventListener('resize', updateSize)
        updateSize()

        return () => window.removeEventListener('resize', updateSize)
    }, [])

    return (
        <div ref={containerRef} style={{ width, height, ...style }} className={className}>
            <Canvas style={{ width: '100%', height: '100%' }}>
                <PerspectiveCamera
                    makeDefault
                    position={[0, 0, 5]}
                    fov={50}
                    aspect={size.width / size.height}
                />
                <Sphere
                    sphereSegments={vertices}
                    seed={Math.random() * 100}
                    speed={speed}
                />
            </Canvas>
        </div>
    )
}