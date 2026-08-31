import React from "react";

export function SentinelIcon({ size = 28, className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      fill="none"
      className={className}
      style={{ display: "inline-block", verticalAlign: "middle" }}
    >
      <defs>
        <linearGradient id="sentinelShieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f3be65" />
          <stop offset="100%" stopColor="#d4a24c" />
        </linearGradient>
        <filter id="sentinelGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Outer Angular Sentinel Crest */}
      <polygon
        points="50,8 88,25 88,62 50,92 12,62 12,25"
        fill="#161c23"
        stroke="url(#sentinelShieldGrad)"
        strokeWidth="4"
        strokeLinejoin="round"
      />

      {/* Inner Facets */}
      <polygon
        points="50,16 80,31 80,57 50,82 20,57 20,31"
        fill="#0e141b"
        stroke="#4f4537"
        strokeWidth="1.5"
      />

      {/* Cryptographic Sentinel Core */}
      <polygon points="50,28 68,39 68,61 50,72 32,61 32,39" fill="url(#sentinelShieldGrad)" />
      <polygon points="50,33 63,42 63,58 50,67 37,58 37,42" fill="#090f15" />

      {/* Central Emerald Pulse Node */}
      <circle cx="50" cy="50" r="5.5" fill="#8cd7a5" filter="url(#sentinelGlow)" />
      <path
        d="M50,43 L50,36 M50,57 L50,64 M43,50 L36,50 M57,50 L64,50"
        stroke="#f3be65"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Logo({ size = 32, withText = true, subtitle = null }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "10px" }}>
      <SentinelIcon size={size} />
      {withText && (
        <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 800,
              fontSize: size >= 32 ? "15px" : "13px",
              color: "var(--primary, #f3be65)",
              letterSpacing: "1.5px",
              textTransform: "uppercase",
            }}
          >
            SecureSentinel
          </span>
          {subtitle && (
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "9px",
                color: "var(--on-surface-variant, #d3c4b2)",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}
            >
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
