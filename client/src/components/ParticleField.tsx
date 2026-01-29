/*
  DESIGN: Cosmic Mysticism - Animated particle background
  Creates floating particles that respond to scroll position and mouse interaction.
  UPDATED: Added mouse repulsion/attraction for "S-tier" interactivity.
*/

import { useEffect, useRef } from "react";
// import { useMouse } from "@/hooks/useMouse"; // We'll need to create this hook or use local state if not available.
// For simplicity in this step, I'll track mouse locally in the canvas logic to minimize dependencies.

interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  size: number;
  color: string;
  vx: number;
  vy: number;
  ease: number;
}

export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);

  // Track mouse position directly in the component for canvas usage
  const mouseRef = useRef({ x: 0, y: 0, isActive: false });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.isActive = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.isActive = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseout", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseout", handleMouseLeave);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles(); // Re-init particles on resize to fill screen
    };

    const initParticles = () => {
      const particleCount = Math.floor((window.innerWidth * window.innerHeight) / 12000); // Denser field
      particlesRef.current = [];

      const colors = [
        "rgba(255, 255, 255, 0.3)", // White/Star
        "rgba(212, 165, 116, 0.4)", // Golden
        "rgba(224, 122, 95, 0.3)",  // Coral/Warmth (Human touch)
      ];

      for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;

        particlesRef.current.push({
          x: x,
          y: y,
          originX: x,
          originY: y,
          size: Math.random() * 2 + 0.5,
          color: colors[Math.floor(Math.random() * colors.length)],
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          ease: Math.random() * 0.05 + 0.02, // Different response speeds
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle) => {
        // 1. Natural drift
        particle.originX += particle.vx;
        particle.originY += particle.vy;

        // Wrap around logic for origin
        if (particle.originX < 0) particle.originX = canvas.width;
        if (particle.originX > canvas.width) particle.originX = 0;
        if (particle.originY < 0) particle.originY = canvas.height;
        if (particle.originY > canvas.height) particle.originY = 0;

        // 2. Mouse Interaction (Repulsion)
        let targetX = particle.originX;
        let targetY = particle.originY;

        if (mouseRef.current.isActive) {
          const dx = mouseRef.current.x - particle.originX;
          const dy = mouseRef.current.y - particle.originY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const repulsionRadius = 200;

          if (distance < repulsionRadius) {
            const force = (repulsionRadius - distance) / repulsionRadius;
            const angle = Math.atan2(dy, dx);
            const push = force * 50; // Strength of push

            targetX -= Math.cos(angle) * push;
            targetY -= Math.sin(angle) * push;
          }
        }

        // 3. Smooth Lerp to target position
        particle.x += (targetX - particle.x) * particle.ease;
        particle.y += (targetY - particle.y) * particle.ease;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
      });

      // Draw connecting lines - Optimized
      // Only draw lines for a subset or with stricter distance to save perf
      const particles = particlesRef.current;
      for (let i = 0; i < particles.length; i++) {
        // Only check every other particle for connections to optimize loop
        if (i % 2 !== 0) continue;

        const p1 = particles[i];

        // Check only near neighbors in the array (approximate spatial locality if sorted, but here random)
        // We'll just check against a smaller subset for performance in large viewports
        for (let j = i + 1; j < particles.length; j += 4) {
          const p2 = particles[j];

          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          // Fast distance check (squared)
          const distSq = dx * dx + dy * dy;
          const maxDist = 120;

          if (distSq < maxDist * maxDist) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            // Dynamic opacity based on distance
            const alpha = 0.1 * (1 - Math.sqrt(distSq) / maxDist);
            ctx.strokeStyle = `rgba(212, 165, 116, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      resizeCanvas();
    };

    resizeCanvas();
    animate();

    window.addEventListener("resize", handleResize);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  );
}
