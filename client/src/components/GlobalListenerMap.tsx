import { useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';

export default function GlobalListenerMap() {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mountRef.current) return;

        // Scene Setup
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x050505); // Match background
        // Add some fog for depth
        scene.fog = new THREE.FogExp2(0x050505, 0.002);

        const camera = new THREE.PerspectiveCamera(45, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
        camera.position.z = 180; // Distance from globe
        camera.position.y = 20;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        mountRef.current.appendChild(renderer.domElement);

        // Globe Group
        const globeGroup = new THREE.Group();
        scene.add(globeGroup);

        // 1. The Globe Sphere (Dark, barely visible, wireframe-ish or point cloud?)
        // User asked for "Dark, translucent globe... continents barely visible"
        // We can use a SphereGeometry with a dark material
        const globeGeometry = new THREE.SphereGeometry(60, 64, 64);
        const globeMaterial = new THREE.MeshPhongMaterial({
            color: 0x222222, // Lighter
            emissive: 0x111111, // Emissive
            specular: 0x444444,
            shininess: 30,
            transparent: true,
            opacity: 0.6,
        });
        const globe = new THREE.Mesh(globeGeometry, globeMaterial);
        globeGroup.add(globe);

        // 2. Atmosphere / Glow
        const atmosphereGeometry = new THREE.SphereGeometry(62, 64, 64);
        const atmosphereMaterial = new THREE.ShaderMaterial({
            vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
            fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.6 - dot(vNormal, vec3(0, 0, 1.0)), 4.0);
          gl_FragColor = vec4(0.83, 0.65, 0.45, 1.0) * intensity * 1.5; // Brighter Gold-ish glow
        }
      `,
            blending: THREE.AdditiveBlending,
            side: THREE.BackSide,
            transparent: true
        });
        const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
        scene.add(atmosphere);


        // 3. Golden Dots (Listeners) - Simulated Cities
        const particleCount = 200;
        const particlesGeometry = new THREE.BufferGeometry();
        const particlePositions: number[] = [];
        const particleSizes: number[] = [];

        // Helper to convert lat/ren/lon to vector
        const latLongToVector3 = (lat: number, lon: number, radius: number) => {
            const phi = (90 - lat) * (Math.PI / 180);
            const theta = (lon + 180) * (Math.PI / 180);
            const x = -(radius * Math.sin(phi) * Math.cos(theta));
            const z = (radius * Math.sin(phi) * Math.sin(theta));
            const y = (radius * Math.cos(phi));
            return new THREE.Vector3(x, y, z);
        }

        // Generate random "city" points tailored to usually populated areas (simplified)
        for (let i = 0; i < particleCount; i++) {
            // Random lat/lon distribution (naive)
            const lat = (Math.random() - 0.5) * 160;
            const lon = (Math.random() - 0.5) * 360;
            const pos = latLongToVector3(lat, lon, 60.5); // Slightly above surface
            particlePositions.push(pos.x, pos.y, pos.z);
            particleSizes.push(Math.random());
        }

        particlesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(particlePositions, 3));

        // Custom Shader for pulsing dots
        const particlesMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color(0xD4A574) } // Gold
            },
            vertexShader: `
            attribute float size;
            varying float vOpacity;
            uniform float time;
            void main() {
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                // Pulse effect
                float pulse = sin(time * 3.0 + position.x) * 0.5 + 0.5;
                vOpacity = 0.5 + pulse * 0.5;
                gl_PointSize = size * (15.0 + pulse * 10.0) * (300.0 / -mvPosition.z); // Larger
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
            fragmentShader: `
            uniform vec3 color;
            varying float vOpacity;
            void main() {
                // Circular particle
                vec2 center = gl_PointCoord - vec2(0.5);
                float dist = length(center);
                if (dist > 0.5) discard;
                
                // Soft edge
                float alpha = 1.0 - smoothstep(0.4, 0.5, dist);
                gl_FragColor = vec4(color, alpha * vOpacity * 2.5); // Brighter
            }
        `,
            transparent: true,
            blending: THREE.AdditiveBlending,
        });

        const particles = new THREE.Points(particlesGeometry, particlesMaterial);
        globeGroup.add(particles);

        // 4. Connection Lines (Golden Threads)
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0xD4A574,
            transparent: true,
            opacity: 0.15,
            blending: THREE.AdditiveBlending
        });

        // Create some random connections
        const lineGeometry = new THREE.BufferGeometry();
        const linePositions: number[] = [];

        for (let i = 0; i < 50; i++) {
            const idx1 = Math.floor(Math.random() * particleCount) * 3;
            const idx2 = Math.floor(Math.random() * particleCount) * 3;

            const p1 = new THREE.Vector3(particlePositions[idx1], particlePositions[idx1 + 1], particlePositions[idx1 + 2]);
            const p2 = new THREE.Vector3(particlePositions[idx2], particlePositions[idx2 + 1], particlePositions[idx2 + 2]);

            // Curve points (bezier) would be better but straight lines inside/through surface looks cool too or specifically arc
            // For simplicity, straight lines (will go through globe) or large arcs.
            // Let's do huge arcs using CatmullRomCurve3

            const midPoint = p1.clone().add(p2).multiplyScalar(0.5).normalize().multiplyScalar(60 * 1.5); // Control point high above
            const curve = new THREE.QuadraticBezierCurve3(p1, midPoint, p2);
            const points = curve.getPoints(20);

            points.forEach(p => linePositions.push(p.x, p.y, p.z));
        }

        lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
        const connections = new THREE.LineSegments(lineGeometry, lineMaterial);
        // Wait, LineSegments expects pairs. We generated a strip. use Line
        // Actually simpler: just draw lines between points.

        // Re-do lines as simpler segments
        const simpleLinePos: number[] = [];
        for (let i = 0; i < 30; i++) {
            const idx1 = Math.floor(Math.random() * particleCount) * 3;
            const idx2 = Math.floor(Math.random() * particleCount) * 3;
            simpleLinePos.push(particlePositions[idx1], particlePositions[idx1 + 1], particlePositions[idx1 + 2]);
            simpleLinePos.push(particlePositions[idx2], particlePositions[idx2 + 1], particlePositions[idx2 + 2]);
        }
        const segmentsGeom = new THREE.BufferGeometry();
        segmentsGeom.setAttribute('position', new THREE.Float32BufferAttribute(simpleLinePos, 3));
        const segments = new THREE.LineSegments(segmentsGeom, lineMaterial);
        globeGroup.add(segments);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
        scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 2);
        dirLight.position.set(50, 50, 100);
        scene.add(dirLight);

        // Animation Loop
        let animationId: number;
        const animate = () => {
            animationId = requestAnimationFrame(animate);

            globeGroup.rotation.y += 0.001; // Slow rotation

            // Update shader time
            particlesMaterial.uniforms.time.value += 0.01;

            renderer.render(scene, camera);
        };
        animate();

        // Handle Resize
        const handleResize = () => {
            if (!mountRef.current) return;
            camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationId);
            if (mountRef.current) {
                mountRef.current.innerHTML = '';
            }
        };
    }, []);

    return <div ref={mountRef} className="w-full h-full" />;
}
