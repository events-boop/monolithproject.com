
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  varying vec2 vUv;

  // Simple noise
  float random (in vec2 _st) {
    return fract(sin(dot(_st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }

  // Value Noise by Inigo Quilez
  float noise (in vec2 _st) {
    vec2 i = floor(_st);
    vec2 f = fract(_st);
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
  }

  void main() {
    vec2 st = vUv;
    st.x *= uResolution.x / uResolution.y;

    // Slow organic movement
    float n = noise(st * 3.0 + uTime * 0.1);
    float n2 = noise(st * 6.0 - uTime * 0.05);

    // Mouse influence (warp the space)
    float dist = distance(st, uMouse * vec2(uResolution.x/uResolution.y, 1.0));
    float mouseGlow = smoothstep(0.4, 0.0, dist);

    // Combine layers
    float finalNoise = mix(n, n2, 0.5);

    // Monolith Palette
    vec3 colorDeep = vec3(0.05, 0.05, 0.07); // Almost black
    vec3 colorFog = vec3(0.12, 0.12, 0.15);  // Dark grey
    vec3 colorClay = vec3(0.65, 0.25, 0.15); // Clay/Orange accent

    // Mix colors based on noise
    vec3 color = mix(colorDeep, colorFog, finalNoise);
    
    // Add mouse light
    color += colorClay * mouseGlow * 0.15; // Subtle tint

    // Cinematic grain
    float grain = (random(st * uTime) - 0.5) * 0.08;

    gl_FragColor = vec4(color + grain, 1.0);
  }
`;

function ReactiveMesh() {
    const mesh = useRef<THREE.Mesh>(null);

    const uniforms = useMemo(
        () => ({
            uTime: { value: 0 },
            uResolution: { value: new THREE.Vector2(1, 1) }, // Start neutral
            uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        }),
        []
    );

    useFrame((state) => {
        if (mesh.current) {
            // @ts-ignore
            mesh.current.material.uniforms.uTime.value = state.clock.getElapsedTime();
            // @ts-ignore
            mesh.current.material.uniforms.uMouse.value.set(
                (state.mouse.x + 1) / 2,
                (state.mouse.y + 1) / 2
            );
            // @ts-ignore
            mesh.current.material.uniforms.uResolution.value.set(
                state.size.width,
                state.size.height
            );
        }
    });

    return (
        <mesh ref={mesh} scale={[2, 2, 1]}> {/* Full screen quad */}
            <planeGeometry args={[2, 2]} />
            <shaderMaterial
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
                depthWrite={false}
                depthTest={false}
            />
        </mesh>
    );
}

export default function ReactiveBackground() {
    return (
        <div className="fixed inset-0 z-[-1] pointer-events-none opacity-60 mix-blend-screen">
            <Canvas
                camera={{ position: [0, 0, 1] }}
                dpr={[1, 1.5]} // Performance optimization
                gl={{ alpha: true, antialias: false }}
            >
                <ReactiveMesh />
            </Canvas>
        </div>
    );
}
