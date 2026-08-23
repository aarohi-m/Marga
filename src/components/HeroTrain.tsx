import { motion } from "framer-motion";

/* Reusable coach with windows */
function Coach({ x, accent = "#1557A6" }: { x: number; accent?: string }) {
  return (
    <g transform={`translate(${x} 0)`}>
      <rect x="0" y="10" width="150" height="52" rx="8" fill="#F3F0E7" stroke="#D9D3C3" strokeWidth="1.5" />
      <rect x="0" y="24" width="150" height="6" fill={accent} opacity="0.85" />
      <rect x="0" y="24" width="150" height="1.5" fill={accent} />
      <rect x="4" y="8" width="142" height="3" rx="1.5" fill="#E7E2D6" />
      {[10, 30, 50, 70, 90, 110, 130].map((wx) => (
        <rect key={wx} x={wx} y="36" width="14" height="14" rx="2" fill="#DDE7F1" stroke="#B8CADF" strokeWidth="0.8" />
      ))}
      <circle cx="24" cy="66" r="6" fill="#2A3A52" />
      <circle cx="24" cy="66" r="2.5" fill="#98A2B3" />
      <circle cx="126" cy="66" r="6" fill="#2A3A52" />
      <circle cx="126" cy="66" r="2.5" fill="#98A2B3" />
      <rect x="148" y="52" width="8" height="4" rx="1" fill="#98A2B3" />
    </g>
  );
}

/* Locomotive — WAP-style electric */
function Locomotive({ x }: { x: number }) {
  return (
    <g transform={`translate(${x} 0)`}>
      <path
        d="M 0 62 L 0 22 Q 0 10 12 10 L 128 10 Q 140 10 148 20 L 168 40 L 168 62 Z"
        fill="#174F91"
        stroke="#0D3A73"
        strokeWidth="1.5"
      />
      <path d="M 12 10 L 128 10 Q 138 10 145 18 L 162 38 L 162 42 L 12 42 Z" fill="#1557A6" opacity="0.9" />
      <rect x="0" y="52" width="168" height="4" fill="#F4C542" />
      <path d="M 138 20 L 155 38 L 162 38 L 148 20 Z" fill="#DDE7F1" opacity="0.9" />
      {[22, 46, 70, 94, 118].map((wx) => (
        <rect key={wx} x={wx} y="20" width="18" height="14" rx="2" fill="#DDE7F1" stroke="#7B96B6" strokeWidth="0.6" />
      ))}
      <circle cx="164" cy="46" r="2.5" fill="#FFF3C4" />
      <circle cx="164" cy="46" r="4.5" fill="#FFF3C4" opacity="0.35" />
      <rect x="6" y="16" width="12" height="8" rx="1" fill="#F3F0E7" />
      <text x="12" y="22.5" textAnchor="middle" fontSize="5.5" fontWeight="700" fill="#174F91">WAP-7</text>
      <line x1="70" y1="10" x2="70" y2="0" stroke="#2A3A52" strokeWidth="1.5" />
      <line x1="90" y1="10" x2="90" y2="0" stroke="#2A3A52" strokeWidth="1.5" />
      <line x1="65" y1="0" x2="95" y2="0" stroke="#2A3A52" strokeWidth="1.8" />
      <line x1="60" y1="-3" x2="100" y2="-3" stroke="#2A3A52" strokeWidth="2" />
      <circle cx="30" cy="66" r="7" fill="#2A3A52" />
      <circle cx="30" cy="66" r="3" fill="#98A2B3" />
      <circle cx="60" cy="66" r="7" fill="#2A3A52" />
      <circle cx="60" cy="66" r="3" fill="#98A2B3" />
      <circle cx="130" cy="66" r="7" fill="#2A3A52" />
      <circle cx="130" cy="66" r="3" fill="#98A2B3" />
      <rect x="-6" y="52" width="8" height="4" rx="1" fill="#98A2B3" />
    </g>
  );
}

/* OHE mast + catenary */
function OHEMast({ x }: { x: number }) {
  return (
    <g transform={`translate(${x} 0)`} opacity="0.55">
      <line x1="0" y1="80" x2="0" y2="0" stroke="#98A2B3" strokeWidth="1.5" />
      <line x1="0" y1="6" x2="18" y2="6" stroke="#98A2B3" strokeWidth="1.2" />
      <line x1="0" y1="12" x2="16" y2="12" stroke="#98A2B3" strokeWidth="1" />
      <line x1="0" y1="18" x2="14" y2="8" stroke="#98A2B3" strokeWidth="0.8" />
      <circle cx="14" cy="10" r="1.8" fill="#98A2B3" />
    </g>
  );
}

export function HeroTrain({ className = "" }: { className?: string }) {
  const TRAIN_WIDTH = 168 + 4 * 156 + 20;
  const VIEW_W = 1400;

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {/* Soft gradient background wash */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 100% at 100% 0%, rgba(21,87,166,0.04) 0%, rgba(21,87,166,0) 55%), linear-gradient(180deg, #FBFAF6 0%, #F3F0E7 100%)",
        }}
      />

      {/* SVG scene — heavily faded so text reads clearly */}
      <svg
        viewBox={`0 0 ${VIEW_W} 300`}
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        style={{ opacity: 0.35, filter: "blur(0.6px)" }}
      >
        {/* Distant OHE contact wire (fixed) */}
        <line x1="0" y1="86" x2={VIEW_W} y2="86" stroke="#C9C1AE" strokeWidth="1" opacity="0.5" />
        <line x1="0" y1="94" x2={VIEW_W} y2="94" stroke="#B8B09B" strokeWidth="0.6" opacity="0.4" />

        {/* OHE masts */}
        <g transform="translate(0 90)">
          {Array.from({ length: 12 }).map((_, i) => (
            <OHEMast key={i} x={40 + i * 130} />
          ))}
        </g>

        {/* Ground/rail shadow */}
        <rect x="0" y="238" width={VIEW_W} height="62" fill="#ECE7D8" opacity="0.45" />

        {/* Rails */}
        <line x1="0" y1="236" x2={VIEW_W} y2="236" stroke="#98A2B3" strokeWidth="2" opacity="0.45" />
        <line x1="0" y1="252" x2={VIEW_W} y2="252" stroke="#98A2B3" strokeWidth="2" opacity="0.35" />

        {/* Sleepers */}
        <g opacity="0.25">
          {Array.from({ length: 46 }).map((_, i) => (
            <rect key={i} x={i * 32} y="238" width="18" height="16" fill="#B8B09B" rx="1" />
          ))}
        </g>

        {/* Distant tiny train (parallax layer) */}
        <motion.g
          initial={{ x: VIEW_W + 200 }}
          animate={{ x: -200 }}
          transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
          opacity="0.2"
        >
          <g transform="translate(0 128) scale(0.45)">
            <rect x="0" y="10" width="360" height="34" rx="6" fill="#7B96B6" />
            <rect x="0" y="20" width="360" height="4" fill="#174F91" />
          </g>
        </motion.g>

        {/* Main train */}
        <motion.g
          initial={{ x: VIEW_W + 40 }}
          animate={{ x: -TRAIN_WIDTH - 40 }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear", delay: 0.4 }}
        >
          <g transform="translate(0 158)">
            <Locomotive x={0} />
            <Coach x={172} accent="#1557A6" />
            <Coach x={172 + 156} accent="#18845B" />
            <Coach x={172 + 156 * 2} accent="#1557A6" />
            <Coach x={172 + 156 * 3} accent="#C98218" />
          </g>
        </motion.g>

        {/* Subtle motion blur / speed lines under train */}
        <motion.g
          initial={{ x: VIEW_W }}
          animate={{ x: -400 }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear", delay: 0.4 }}
          opacity="0.3"
        >
          {[0, 40, 80, 120, 160, 200, 240, 280].map((dx) => (
            <line key={dx} x1={dx} y1="232" x2={dx + 26} y2="232" stroke="#98A2B3" strokeWidth="1" />
          ))}
        </motion.g>

        {/* Foreground vignette to blend edges */}
        <defs>
          <linearGradient id="hero-fade-left" x1="0" x2="1">
            <stop offset="0%" stopColor="#FBFAF6" stopOpacity="1" />
            <stop offset="100%" stopColor="#FBFAF6" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="hero-fade-right" x1="1" x2="0">
            <stop offset="0%" stopColor="#F3F0E7" stopOpacity="1" />
            <stop offset="100%" stopColor="#F3F0E7" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="220" height="300" fill="url(#hero-fade-left)" />
        <rect x={VIEW_W - 280} y="0" width="280" height="300" fill="url(#hero-fade-right)" />
      </svg>

      {/* Extra frosted overlay — ensures text always pops */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, rgba(251,250,246,0.65) 0%, rgba(243,240,231,0.5) 50%, rgba(251,250,246,0.7) 100%)",
          backdropFilter: "blur(0.5px)",
        }}
      />
    </div>
  );
}
