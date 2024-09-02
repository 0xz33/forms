'use client'

import React, { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, extend, Object3DNode } from '@react-three/fiber'
import * as THREE from 'three'
import { PerspectiveCamera } from '@react-three/drei'

const vertexShader = `
  uniform float time;
  uniform float seed;
  uniform bool MouseDentro;
  uniform float noiseFrequency;
  uniform float noiseAmplitude;

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vBarycentric;

  attribute vec3 barycentric;

  //	Classic Perlin 3D Noise 
  //	by Stefan Gustavson
  vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
  vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

  float cnoise(vec3 P){
    vec3 Pi0 = floor(P); // Integer part for indexing
    vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
    Pi0 = mod(Pi0, 289.0);
    Pi1 = mod(Pi1, 289.0);
    vec3 Pf0 = fract(P); // Fractional part for interpolation
    vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
    vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
    vec4 iy = vec4(Pi0.yy, Pi1.yy);
    vec4 iz0 = Pi0.zzzz;
    vec4 iz1 = Pi1.zzzz;

    vec4 ixy = permute(permute(ix) + iy);
    vec4 ixy0 = permute(ixy + iz0);
    vec4 ixy1 = permute(ixy + iz1);

    vec4 gx0 = ixy0 / 7.0;
    vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
    gx0 = fract(gx0);
    vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
    vec4 sz0 = step(gz0, vec4(0.0));
    gx0 -= sz0 * (step(0.0, gx0) - 0.5);
    gy0 -= sz0 * (step(0.0, gy0) - 0.5);

    vec4 gx1 = ixy1 / 7.0;
    vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
    gx1 = fract(gx1);
    vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
    vec4 sz1 = step(gz1, vec4(0.0));
    gx1 -= sz1 * (step(0.0, gx1) - 0.5);
    gy1 -= sz1 * (step(0.0, gy1) - 0.5);

    vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
    vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
    vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
    vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
    vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
    vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
    vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
    vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

    vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
    g000 *= norm0.x;
    g010 *= norm0.y;
    g100 *= norm0.z;
    g110 *= norm0.w;
    vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
    g001 *= norm1.x;
    g011 *= norm1.y;
    g101 *= norm1.z;
    g111 *= norm1.w;

    float n000 = dot(g000, Pf0);
    float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
    float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
    float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
    float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
    float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
    float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
    float n111 = dot(g111, Pf1);

    vec3 fade_xyz = fade(Pf0);
    vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
    vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
    float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
    return 2.2 * n_xyz;
  }

  void main() {
    vUv = uv;
    vNormal = normal;
    vBarycentric = barycentric;
    
    vec3 pos = position;
    vec3 noisePos = vec3(pos.x * noiseFrequency + time, pos.y * noiseFrequency, pos.z * noiseFrequency);
    float noiseValue = cnoise(noisePos);
    pos += normal * noiseValue * noiseAmplitude;
    
    if (MouseDentro) {
      pos += normal * (sin(time * 0.5) + 1.0) * 0.1;
    }

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const fragmentShader = `
  uniform vec3 color;
  varying vec3 vNormal;
  varying vec3 vBarycentric;

  float edgeFactor() {
    vec3 d = fwidth(vBarycentric);
    vec3 a3 = smoothstep(vec3(0.0), d * 1.5, vBarycentric);
    return min(min(a3.x, a3.y), a3.z);
  }

  void main() {
    // Ambient light component
    float ambientStrength = .99;
    vec3 ambient = ambientStrength * color;

    // Diffuse light component
    vec3 lightDir = normalize(vec3(0.0, 0.0, 0.0));  // Light from directly in front
    float diff = max(dot(vNormal, lightDir), 0.0);
    vec3 diffuse = diff * color;

    // Combine lighting
    vec3 shade = ambient + diffuse;
    
    float wireframe = 1.0 - edgeFactor();
    vec3 finalColor = mix(vec3(0.0), shade, wireframe);
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`

class CustomShaderMaterial extends THREE.ShaderMaterial {
    constructor(color: THREE.Color) {
        super({
            uniforms: {
                time: { value: 0 },
                MouseDentro: { value: false },
                seed: { value: 0 },
                color: { value: color },
                noiseFrequency: { value: 1.5 },
                noiseAmplitude: { value: 0.25 }
            },
            vertexShader,
            fragmentShader,
            side: THREE.DoubleSide
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
    noiseFrequency: number;
    noiseAmplitude: number;
    rotationSpeed: number;
}

function addBarycentricCoordinates(geometry: THREE.BufferGeometry) {
    const positions = geometry.attributes.position.array;
    const barycentricCoords = [];

    for (let i = 0; i < positions.length; i += 9) {
        barycentricCoords.push(
            1, 0, 0, 0, 1, 0, 0, 0, 1,
        );
    }

    geometry.setAttribute('barycentric', new THREE.Float32BufferAttribute(barycentricCoords, 3));
}

function Sphere({ sphereSegments, seed, speed, color, noiseFrequency, noiseAmplitude, rotationSpeed }: SphereProps) {
    const meshRef = useRef<THREE.Mesh>(null!)
    const materialRef = useRef<CustomShaderMaterial>(null!)
    const [mouseDentro, setMouseDentro] = useState(false)

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.time.value = state.clock.getElapsedTime() * speed
            materialRef.current.uniforms.MouseDentro.value = mouseDentro
            materialRef.current.uniforms.seed.value = seed
            materialRef.current.uniforms.color.value = color
            materialRef.current.uniforms.noiseFrequency.value = noiseFrequency
            materialRef.current.uniforms.noiseAmplitude.value = noiseAmplitude
        }
        // Apply rotation
        meshRef.current.rotation.x += rotationSpeed * 0.01
        meshRef.current.rotation.y += rotationSpeed * 0.01
    })

    useEffect(() => {
        if (meshRef.current) {
            addBarycentricCoordinates(meshRef.current.geometry);
        }
    }, [sphereSegments]);

    return (
        <group
            onPointerEnter={() => setMouseDentro(true)}
            onPointerLeave={() => setMouseDentro(false)}
        >
            <mesh ref={meshRef}>
                <icosahedronGeometry args={[1, sphereSegments]} />
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
    noiseFrequency?: number;
    noiseAmplitude?: number;
    rotationSpeed?: number;
}

export default function SuperSphere({
    width = '100%',
    height = '100%',
    className,
    style,
    vertices = 32,
    speed = 1,
    color = '#B2ACD2',
    noiseFrequency = 1.5,
    noiseAmplitude = 0.25,
    rotationSpeed = 1
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
                    noiseFrequency={noiseFrequency}
                    noiseAmplitude={noiseAmplitude}
                    rotationSpeed={rotationSpeed}
                />
            </Canvas>
        </div>
    )
}