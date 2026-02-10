import { motion } from "framer-motion";

/*
  Flat mercator-style map with artist location pins.
  No Three.js, no WebGL — just SVG dots on a grid.
  Coordinates mapped to a 1000x500 viewBox (simple equirectangular).
*/

interface LocationPin {
  label: string;
  lat: number;
  lon: number;
  type: "artist" | "listener";
}

const locations: LocationPin[] = [
  // Artists (real roster)
  { label: "HAAi", lat: 51.5, lon: -0.12, type: "artist" },
  { label: "AUTOGRAF", lat: 41.87, lon: -87.62, type: "artist" },
  { label: "LAZARE", lat: 48.85, lon: 2.35, type: "artist" },
  { label: "JOEZI", lat: 32.06, lon: 34.78, type: "artist" },
  // Listener clusters (aspirational but plausible)
  { label: "NYC", lat: 40.71, lon: -74.0, type: "listener" },
  { label: "LA", lat: 34.05, lon: -118.24, type: "listener" },
  { label: "Berlin", lat: 52.52, lon: 13.4, type: "listener" },
  { label: "Tokyo", lat: 35.67, lon: 139.65, type: "listener" },
  { label: "Tulum", lat: 20.21, lon: -87.46, type: "listener" },
  { label: "Ibiza", lat: 38.9, lon: 1.41, type: "listener" },
  { label: "Chicago", lat: 41.87, lon: -87.62, type: "listener" },
  { label: "Dubai", lat: 25.2, lon: 55.27, type: "listener" },
];

function toXY(lat: number, lon: number): { x: number; y: number } {
  const x = ((lon + 180) / 360) * 1000;
  const y = ((90 - lat) / 180) * 500;
  return { x, y };
}

export default function GlobalListenerMap() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <svg
        viewBox="0 0 1000 500"
        className="w-full h-full max-h-[500px]"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Grid lines — raw, exposed */}
        {Array.from({ length: 13 }, (_, i) => (
          <line
            key={`h${i}`}
            x1={0} y1={i * (500 / 12)} x2={1000} y2={i * (500 / 12)}
            stroke="currentColor" strokeOpacity={0.06} strokeWidth={0.5}
          />
        ))}
        {Array.from({ length: 25 }, (_, i) => (
          <line
            key={`v${i}`}
            x1={i * (1000 / 24)} y1={0} x2={i * (1000 / 24)} y2={500}
            stroke="currentColor" strokeOpacity={0.06} strokeWidth={0.5}
          />
        ))}

        {/* Equator */}
        <line x1={0} y1={250} x2={1000} y2={250} stroke="currentColor" strokeOpacity={0.1} strokeWidth={1} />

        {/* Location pins */}
        {locations.map((loc, i) => {
          const { x, y } = toXY(loc.lat, loc.lon);
          const isArtist = loc.type === "artist";
          return (
            <g key={i}>
              {/* Pulse ring for artists */}
              {isArtist && (
                <motion.circle
                  cx={x} cy={y} r={12}
                  fill="none"
                  stroke="var(--primary)"
                  strokeWidth={1}
                  initial={{ opacity: 0.6, r: 6 }}
                  animate={{ opacity: 0, r: 20 }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                />
              )}
              {/* Dot */}
              <circle
                cx={x} cy={y}
                r={isArtist ? 4 : 2}
                fill={isArtist ? "var(--primary)" : "currentColor"}
                opacity={isArtist ? 1 : 0.3}
              />
              {/* Label for artists */}
              {isArtist && (
                <text
                  x={x + 8} y={y + 4}
                  className="fill-current"
                  fontSize={10}
                  fontFamily="monospace"
                  opacity={0.5}
                >
                  {loc.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
