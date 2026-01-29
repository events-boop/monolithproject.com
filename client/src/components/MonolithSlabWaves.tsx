'use client'

import * as React from 'react'
import { useEffect, useRef } from 'react'
import { createNoise2D } from 'simplex-noise'

interface Point {
    x: number
    y: number
    originX: number
    originY: number
    wave: { x: number; y: number }
    cursor: { x: number; y: number; vx: number; vy: number }
}

interface MonolithSlabWavesProps {
    className?: string
    slabWidthPx?: number
    slabHeightPx?: number
    borderRadiusPx?: number

    /* Appearance */
    backgroundColor?: string
    borderColor?: string
    strokeColor?: string // Kept for interface, but we might override with gradient

    /* Animation props */
    xGap?: number
    yGap?: number
    amplitude?: number
    flowSpeed?: number
    pointerInfluence?: number
    pointerRadius?: number

    /* Interaction Extras */
    showPointerDot?: boolean
    pointerSizeRem?: number
    interactive?: boolean
}

export function MonolithSlabWaves({
    className = '',
    slabWidthPx = 90,
    slabHeightPx = 280,
    borderRadiusPx = 10,

    backgroundColor = 'rgba(0,0,0,0)',
    borderColor = 'rgba(192, 192, 192, 0.3)', // Silver-ish

    xGap = 5,
    yGap = 12,

    amplitude = 6,
    flowSpeed = 0.002,
    pointerInfluence = 0.00035, // Adjusted for new physics
    pointerRadius = 200,

    showPointerDot = false,
    pointerSizeRem = 0.35,

    interactive = true,
}: MonolithSlabWavesProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const svgRef = useRef<SVGSVGElement>(null)

    // Advanced mouse physics ref
    const mouseRef = useRef({
        x: -9999,
        y: -9999,
        lx: 0,
        ly: 0,
        sx: 0, // smoothed x
        sy: 0, // smoothed y
        v: 0,  // velocity
        vs: 0, // smoothed velocity
        a: 0,  // angle
        set: false,
    })

    const pointsRef = useRef<Point[][]>([])
    const strokeWidthsRef = useRef<number[]>([]) // Store random widths per row
    const pathsRef = useRef<SVGPathElement[]>([])

    const noiseRef = useRef<any>(null)
    const rafRef = useRef<number | null>(null)
    const gradientId = React.useId()

    useEffect(() => {
        noiseRef.current = createNoise2D()

        // 1. Setup Grid 
        // We use the ROBUST filling logic from before to ensure no gaps
        const bufferY = 60
        const bufferX = 40 // Generous X buffer

        const minX = -bufferX
        const maxX = slabWidthPx + bufferX

        const minY = -bufferY
        const maxY = slabHeightPx + bufferY

        const newPoints: Point[][] = []
        const newWidths: number[] = []

        // Generate rows top to bottom
        for (let y = minY; y <= maxY; y += yGap) {
            const row: Point[] = []
            for (let x = minX; x <= maxX; x += xGap) {
                row.push({
                    x: x,
                    y: y,
                    originX: x,
                    originY: y,
                    wave: { x: 0, y: 0 },
                    cursor: { x: 0, y: 0, vx: 0, vy: 0 },
                })
            }
            newPoints.push(row)
            newWidths.push(0.5 + Math.random() * 1.5) // Random "data stream" widths
        }

        pointsRef.current = newPoints
        strokeWidthsRef.current = newWidths

        // 2. Setup SVG Paths
        if (svgRef.current) {
            // Clean old
            const existing = svgRef.current.querySelectorAll('path')
            existing.forEach(p => p.remove())
            pathsRef.current = []

            newPoints.forEach((_, i) => {
                const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path')
                pathEl.setAttribute('fill', 'none')
                // Restore the Premium Silver Gradient
                pathEl.setAttribute('stroke', `url(#${gradientId})`)
                pathEl.setAttribute('stroke-width', newWidths[i].toFixed(2))
                pathEl.setAttribute('stroke-opacity', '0.9')
                pathEl.setAttribute('stroke-linecap', 'round')
                pathEl.setAttribute('stroke-linejoin', 'round')
                svgRef.current!.appendChild(pathEl)
                pathsRef.current.push(pathEl)
            })
        }

        // 3. Event Listeners
        const handleMouseMove = (e: MouseEvent) => {
            if (!interactive || !containerRef.current) return
            const rect = containerRef.current.getBoundingClientRect()
            updateMouse(e.clientX - rect.left, e.clientY - rect.top)
        }

        const handleTouchMove = (e: TouchEvent) => {
            if (!interactive || !containerRef.current) return
            const rect = containerRef.current.getBoundingClientRect()
            const t = e.touches[0]
            updateMouse(t.clientX - rect.left, t.clientY - rect.top)
        }

        if (interactive) {
            window.addEventListener('mousemove', handleMouseMove)
            containerRef.current?.addEventListener('touchmove', handleTouchMove, { passive: false })
        }

        // 4. Animation Loop
        let time = 0
        const loop = () => {
            // Sync time
            time += flowSpeed

            // Update Mouse Physics
            const mouse = mouseRef.current

            // smooth pointer easing
            mouse.sx += (mouse.x - mouse.sx) * 0.12
            mouse.sy += (mouse.y - mouse.sy) * 0.12

            // velocity calculation
            const dx = mouse.x - mouse.lx
            const dy = mouse.y - mouse.ly
            const dist = Math.hypot(dx, dy)
            mouse.v = dist
            mouse.vs += (dist - mouse.vs) * 0.12
            mouse.vs = Math.min(100, mouse.vs) // clamp max velocity velocity

            mouse.lx = mouse.x
            mouse.ly = mouse.y
            mouse.a = Math.atan2(dy, dx)

            if (containerRef.current) {
                containerRef.current.style.setProperty('--x', `${mouse.sx}px`)
                containerRef.current.style.setProperty('--y', `${mouse.sy}px`)
            }

            // Move Points
            if (noiseRef.current) {
                pointsRef.current.forEach((row, i) => {
                    let pathD = ''
                    const isFirst = true

                    row.forEach((p, j) => {
                        // A. Noise (Vertical Flow)
                        const n = noiseRef.current(p.originX * 0.002, (p.originY + time * 100) * 0.003) * amplitude

                        p.wave.x = Math.cos(n) * (amplitude * 0.5)
                        p.wave.y = Math.sin(n) * (amplitude * 1.2)

                        // B. Physics Cursor Interaction
                        if (interactive) {
                            const dx = p.x - mouse.sx
                            const dy = p.y - mouse.sy
                            const d = Math.hypot(dx, dy)

                            const l = Math.max(pointerRadius, mouse.vs * 5) // Influence grows with speed

                            if (d < l) {
                                const s = 1 - d / l
                                const f = Math.cos(d * 0.001) * s

                                // Drag force based on mouse velocity
                                p.cursor.vx += Math.cos(mouse.a) * f * l * mouse.vs * pointerInfluence
                                p.cursor.vy += Math.sin(mouse.a) * f * l * mouse.vs * pointerInfluence
                            }

                            // Spring back to origin
                            p.cursor.vx += (0 - p.cursor.x) * 0.015
                            p.cursor.vy += (0 - p.cursor.y) * 0.015

                            // Damping
                            p.cursor.vx *= 0.92
                            p.cursor.vy *= 0.92

                            p.cursor.x += p.cursor.vx
                            p.cursor.y += p.cursor.vy
                        }

                        // Final Position
                        const finalX = p.originX + p.wave.x + p.cursor.x
                        const finalY = p.originY + p.wave.y + p.cursor.y

                        if (j === 0) {
                            pathD += `M ${finalX.toFixed(1)} ${finalY.toFixed(1)}`
                        } else {
                            pathD += ` L ${finalX.toFixed(1)} ${finalY.toFixed(1)}`
                        }
                    })

                    // Update Path
                    if (pathsRef.current[i]) {
                        pathsRef.current[i].setAttribute('d', pathD)
                    }
                })
            }

            rafRef.current = requestAnimationFrame(loop)
        }

        rafRef.current = requestAnimationFrame(loop)

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current)
            window.removeEventListener('mousemove', handleMouseMove)
            if (containerRef.current) {
                containerRef.current.removeEventListener('touchmove', handleTouchMove)
            }
        }
    }, [slabWidthPx, slabHeightPx, xGap, yGap, amplitude, flowSpeed, pointerInfluence, pointerRadius, interactive])


    const updateMouse = (x: number, y: number) => {
        const m = mouseRef.current
        m.x = x
        m.y = y
        if (!m.set) {
            m.sx = x; m.sy = y; m.lx = x; m.ly = y; m.set = true
        }
    }

    return (
        <div
            ref={containerRef}
            className={`relative overflow-hidden ${className}`}
            style={{
                width: slabWidthPx,
                height: slabHeightPx,
                borderRadius: borderRadiusPx,
                border: `1px solid ${borderColor}`,
                backgroundColor,
                boxShadow: '0 10px 40px rgba(0,0,0,0.5)', // Premium Depth
                '--x': '50%',
                '--y': '50%',
            } as React.CSSProperties}
        >
            {/* Gradient Vignette for that "Cinematic" feel */}
            <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none z-10"
                style={{
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.05) 30%, rgba(0,0,0,0.05) 70%, rgba(0,0,0,0.6))'
                }}
            />

            <svg
                ref={svgRef}
                className="block h-full w-full relative z-0"
                style={{ overflow: 'visible' }}
            >
                <defs>
                    <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#666" />     {/* Darker Silver */}
                        <stop offset="50%" stopColor="#fff" />     {/* Peak Shine */}
                        <stop offset="100%" stopColor="#666" />    {/* Darker Silver */}
                    </linearGradient>
                </defs>
            </svg>

            {showPointerDot && (
                <div
                    aria-hidden="true"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: `${pointerSizeRem}rem`,
                        height: `${pointerSizeRem}rem`,
                        background: '#fff',
                        borderRadius: '999px',
                        transform: 'translate3d(calc(var(--x) - 50%), calc(var(--y) - 50%), 0)',
                        willChange: 'transform',
                        zIndex: 20,
                        opacity: interactive ? 0.8 : 0,
                        boxShadow: '0 0 10px rgba(255,255,255,0.8)'
                    }}
                />
            )}
        </div>
    )
}
