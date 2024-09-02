'use client'

import React, { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, extend, Object3DNode } from '@react-three/fiber'
import * as THREE from 'three'
import { PerspectiveCamera } from '@react-three/drei'

const vertexShader = `
uniform float time;
uniform float seed;
uniform bool MouseDentro;

varying vec2 vUv;

void main() {
    vUv = uv;
    
    vec3 pos = position;
    
    float noiseFreq = 1.5;
    float noiseAmp = 0.25;
    vec3 noisePos = vec3(pos.x * noiseFreq + time, pos.y, pos.z);
    pos += normal * (sin(time * 0.5) + 1.0) * 0.1;
    
    if (MouseDentro) {
        pos += normal * (sin(time * 0.5) + 1.0) * 0.1;
    }

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`

class CustomShaderMaterial extends THREE.ShaderMaterial {
    constructor(color: THREE.Color) {
        super({
            uniforms: {
                time: { value: 0 },
                MouseDentro: { value: false },
                seed: { value: 0 },
                color: { value: color }
            },
            vertexShader,
            fragmentShader: `
        uniform vec3 color;
        void main() {
          gl_FragColor = vec4(color, 1.0);
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
    color: THREE.Color;
}

function Sphere({ sphereSegments, seed, speed, color }: SphereProps) {
    const meshRef = useRef<THREE.Mesh>(null!)
    const materialRef = useRef<CustomShaderMaterial>(null!)
    const [mouseDentro, setMouseDentro] = useState(false)

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.time.value = state.clock.getElapsedTime()
            materialRef.current.uniforms.MouseDentro.value = mouseDentro
            materialRef.current.uniforms.seed.value = seed
            materialRef.current.uniforms.color.value = color
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
                <customShaderMaterial ref={materialRef} args={[color]} />
            </mesh>
        </group>
    )
}

interface SuperSphereProps {
    width?: string | number;
    height?: string | number;
    className?: string;
    style?: React.CSSProperties;
    vertices?: number;
    speed?: number;
    color?: string;
}

export default function SuperSphere({
    width = '100%',
    height = '100%',
    className,
    style,
    vertices = 32,
    speed = 1,
    color = '#9E96C6'
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

    const threeColor = new THREE.Color(color)

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
                    color={threeColor}
                />
            </Canvas>
        </div>
    )
}