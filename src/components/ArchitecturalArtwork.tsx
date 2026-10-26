import React, { useState } from 'react';
import { VisualMotifId } from '../types/portfolio';

interface ArchitecturalArtworkProps {
  motif: VisualMotifId;
  customImageUrl?: string;
  customVideoUrl?: string;
  enableVideoControls?: boolean;
  accentColor: string;
  isDark: boolean;
  title: string;
  subtitle?: string;
  className?: string;
}

export const ArchitecturalArtwork: React.FC<ArchitecturalArtworkProps> = ({
  motif,
  customImageUrl,
  customVideoUrl,
  enableVideoControls = false,
  accentColor,
  isDark,
  title,
  subtitle,
  className = '',
}) => {
  const [imgFailed, setImgFailed] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  const showCustomVideo = Boolean(customVideoUrl && customVideoUrl.trim() && !videoFailed);
  const showCustomImage = Boolean(
    !showCustomVideo && customImageUrl && customImageUrl.trim() && !imgFailed
  );

  const bgPrimary = isDark ? '#111114' : '#EDEAE2';
  const bgSecondary = isDark ? '#1A1A20' : '#E2DDD2';
  const strokeColor = isDark ? 'rgba(255,255,255,0.14)' : 'rgba(17,17,16,0.14)';
  const strongStroke = isDark ? 'rgba(255,255,255,0.45)' : 'rgba(17,17,16,0.45)';
  const fgText = isDark ? '#F4F4F6' : '#181816';
  const mutedText = isDark ? '#8E8E99' : '#6E6B65';

  return (
    <div
      className={`relative overflow-hidden select-none ${className}`}
      style={{
        backgroundColor: bgPrimary,
        backgroundImage: `
          linear-gradient(to right, ${strokeColor} 1px, transparent 1px),
          linear-gradient(to bottom, ${strokeColor} 1px, transparent 1px),
          linear-gradient(135deg, ${bgPrimary} 0%, ${bgSecondary} 100%)
        `,
        backgroundSize: '36px 36px, 36px 36px, 100% 100%',
      }}
    >
      {showCustomVideo ? (
        <video
          src={customVideoUrl}
          controls={enableVideoControls}
          autoPlay
          loop
          muted={!enableVideoControls}
          playsInline
          onError={() => setVideoFailed(true)}
          className="w-full h-full object-cover"
          aria-label={title}
        />
      ) : showCustomImage ? (
        <img
          src={customImageUrl}
          alt={title}
          referrerPolicy="no-referrer"
          onError={() => setImgFailed(true)}
          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
        />
      ) : (
        <svg
          viewBox="0 0 800 600"
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-full transition-transform duration-200 group-hover:scale-[1.02]"
          role="img"
          aria-label={title}
        >

          {motif === 'spatial-controller' && (
            <g>
              {/* Anodized Aluminum Chassis */}
              <rect
                x="140"
                y="90"
                width="520"
                height="420"
                rx="28"
                fill={isDark ? '#18181D' : '#F7F5F0'}
                stroke={strongStroke}
                strokeWidth="2"
              />
              {/* Precision Rotary Dial */}
              <circle
                cx="400"
                cy="280"
                r="132"
                fill={bgPrimary}
                stroke={strongStroke}
                strokeWidth="2"
              />
              <circle
                cx="400"
                cy="280"
                r="102"
                fill="none"
                stroke={strokeColor}
                strokeWidth="1.5"
                strokeDasharray="6 6"
              />
              <circle
                cx="400"
                cy="280"
                r="56"
                fill={isDark ? '#222228' : '#FFFFFF'}
                stroke={strongStroke}
                strokeWidth="2"
              />
              {/* Indicator Line */}
              <line
                x1="400"
                y1="280"
                x2="465"
                y2="215"
                stroke={accentColor}
                strokeWidth="4"
                strokeLinecap="round"
              />
              <circle cx="400" cy="280" r="7" fill={accentColor} />
              {/* Tactile Function Keys */}
              {[200, 300, 400, 500].map((x, idx) => (
                <rect
                  key={x}
                  x={x - 35}
                  y="440"
                  width="70"
                  height="34"
                  rx="6"
                  fill={idx === 1 ? accentColor : bgPrimary}
                  stroke={strongStroke}
                  strokeWidth="1.5"
                />
              ))}
              {/* Corner Calibration Crosshairs */}
              <path
                d="M175 125 H195 M185 115 V135 M605 125 H625 M615 115 V135"
                stroke={mutedText}
                strokeWidth="1.5"
              />
            </g>
          )}

          {motif === 'modular-synth' && (
            <g>
              {/* Field Synthesizer Faceplate */}
              <rect
                x="90"
                y="80"
                width="620"
                height="440"
                rx="20"
                fill={isDark ? '#141418' : '#1E1E22'}
                stroke={strongStroke}
                strokeWidth="2"
              />
              {/* OLED Acousticograph Screen */}
              <rect
                x="130"
                y="120"
                width="340"
                height="160"
                rx="8"
                fill="#09090B"
                stroke="rgba(255,255,255,0.22)"
                strokeWidth="1.5"
              />
              {/* Harmonic Envelope Curve */}
              <path
                d="M 150 250 Q 210 130, 265 210 T 380 165 T 450 240"
                fill="none"
                stroke={accentColor}
                strokeWidth="3.5"
              />
              <path
                d="M 150 250 L 450 250"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="1"
              />
              {/* 4 Rotary Encoders */}
              {[530, 630].map((cx) =>
                [160, 245].map((cy, i) => (
                  <g key={`${cx}-${cy}`}>
                    <circle
                      cx={cx}
                      cy={cy}
                      r="32"
                      fill="#27272A"
                      stroke="rgba(255,255,255,0.45)"
                      strokeWidth="2"
                    />
                    <line
                      x1={cx}
                      y1={cy}
                      x2={cx + (i === 0 ? 18 : -16)}
                      y2={cy - 18}
                      stroke={i === 0 && cx === 530 ? accentColor : '#FAFAFA'}
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </g>
                ))
              )}
              {/* Mechanical Piano Keybed */}
              {Array.from({ length: 10 }).map((_, idx) => (
                <rect
                  key={idx}
                  x={130 + idx * 54}
                  y="320"
                  width="46"
                  height="160"
                  rx="5"
                  fill={idx === 3 ? accentColor : '#F4F4F0'}
                />
              ))}
            </g>
          )}

          {motif === 'swiss-editorial' && (
            <g>
              {/* Swiss Monograph Spread */}
              <rect
                x="120"
                y="70"
                width="560"
                height="460"
                fill={isDark ? '#18181C' : '#FAF8F5'}
                stroke={strongStroke}
                strokeWidth="2"
              />
              <line
                x1="400"
                y1="70"
                x2="400"
                y2="530"
                stroke={strongStroke}
                strokeWidth="1.5"
              />
              {/* Left Plate Typographic Hierarchy */}
              <rect x="155" y="115" width="76" height="76" fill={accentColor} />
              <line x1="155" y1="230" x2="360" y2="230" stroke={fgText} strokeWidth="10" />
              <line x1="155" y1="254" x2="320" y2="254" stroke={fgText} strokeWidth="10" />
              <line x1="155" y1="295" x2="355" y2="295" stroke={mutedText} strokeWidth="3" />
              <line x1="155" y1="312" x2="345" y2="312" stroke={mutedText} strokeWidth="3" />
              <line x1="155" y1="329" x2="300" y2="329" stroke={mutedText} strokeWidth="3" />
              {/* Right Plate Geometric Proportion Study */}
              <circle
                cx="540"
                cy="245"
                r="92"
                fill="none"
                stroke={fgText}
                strokeWidth="2.5"
              />
              <circle
                cx="512"
                cy="245"
                r="58"
                fill="none"
                stroke={accentColor}
                strokeWidth="2.5"
              />
              <rect
                x="445"
                y="375"
                width="190"
                height="100"
                fill="none"
                stroke={strongStroke}
                strokeWidth="1.5"
              />
              <line x1="445" y1="375" x2="635" y2="475" stroke={strokeColor} strokeWidth="1.5" />
            </g>
          )}

          {motif === 'nordic-pavilion' && (
            <g>
              {/* Architectural Elevation & Cantilever */}
              <line x1="60" y1="450" x2="740" y2="450" stroke={strongStroke} strokeWidth="2.5" />
              {/* Cantilevered Roof Slab */}
              <polygon
                points="110,200 690,150 670,220 110,235"
                fill={fgText}
              />
              {/* Timber & Glass Columns */}
              {[180, 290, 400, 510, 610].map((x) => (
                <line
                  key={x}
                  x1={x}
                  y1="215"
                  x2={x}
                  y2="450"
                  stroke={strongStroke}
                  strokeWidth="4"
                />
              ))}
              {/* Glazing Thermal Accent Core */}
              <rect
                x="292"
                y="265"
                width="216"
                height="185"
                fill={accentColor}
                fillOpacity="0.82"
              />
              {/* Topographic Fjord Reflections */}
              <path
                d="M 140 485 H 660 M 210 512 H 580 M 290 538 H 490"
                stroke={mutedText}
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="615" cy="105" r="24" fill={accentColor} />
            </g>
          )}

          {motif === 'chrono-optics' && (
            <g>
              {/* Concentric Tourbillon & Caliper Rings */}
              <circle
                cx="400"
                cy="300"
                r="195"
                fill="none"
                stroke={strongStroke}
                strokeWidth="2"
              />
              <circle
                cx="400"
                cy="300"
                r="155"
                fill="none"
                stroke={fgText}
                strokeWidth="1.5"
                strokeDasharray="3 9"
              />
              <circle
                cx="400"
                cy="300"
                r="112"
                fill="none"
                stroke={accentColor}
                strokeWidth="2.5"
              />
              <circle
                cx="440"
                cy="300"
                r="54"
                fill="none"
                stroke={strongStroke}
                strokeWidth="2"
              />
              <line x1="160" y1="300" x2="640" y2="300" stroke={strokeColor} strokeWidth="1.5" />
              <line x1="400" y1="60" x2="400" y2="540" stroke={strokeColor} strokeWidth="1.5" />
              <circle cx="400" cy="300" r="9" fill={accentColor} />
            </g>
          )}

          {motif === 'kinetic-grid' && (
            <g>
              {/* Distributed Consensus Topology Matrix */}
              {[180, 325, 475, 620].map((x, xi) =>
                [150, 300, 450].map((y, yi) => {
                  const isPrimary = (xi === 1 && yi === 1) || (xi === 2 && yi === 1);
                  return (
                    <g key={`${x}-${y}`}>
                      {xi < 3 && (
                        <line
                          x1={x}
                          y1={y}
                          x2={x + 145}
                          y2={y}
                          stroke={isPrimary ? accentColor : strongStroke}
                          strokeWidth={isPrimary ? '3' : '1.5'}
                        />
                      )}
                      {yi < 2 && (
                        <line
                          x1={x}
                          y1={y}
                          x2={x}
                          y2={y + 150}
                          stroke={strongStroke}
                          strokeWidth="1.5"
                        />
                      )}
                      <rect
                        x={x - 28}
                        y={y - 28}
                        width="56"
                        height="56"
                        rx="12"
                        fill={isPrimary ? accentColor : bgPrimary}
                        stroke={strongStroke}
                        strokeWidth="2"
                      />
                    </g>
                  );
                })
              )}
            </g>
          )}

          {/* Subtle Editorial Plate Index Footer */}
          <text
            x="40"
            y="565"
            fill={mutedText}
            fontSize="13"
            fontFamily="JetBrains Mono, monospace"
          >
            {subtitle || title}
          </text>
        </svg>
      )}
    </div>
  );
};
