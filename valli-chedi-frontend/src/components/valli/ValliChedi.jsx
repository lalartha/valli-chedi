import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import './ValliChedi.css';

/**
 * VALLI CHEDI — Signature Botanical Creeper Visualization
 *
 * An illustrated Kerala-style creeping vine (Valli Chedi) that grows
 * organically based on backend data: growthLevel (1-7+) and growthPercentage (0-100).
 */

// Natural leaf archetypes with veins and subtle botanical shading
function Leaf({
  x = 0,
  y = 0,
  rotation = 0,
  scale = 1,
  type = 'medium', // 'mature', 'medium', 'young', 'curled', 'bud'
  delay = 0,
}) {
  // Palette according to leaf maturity
  const leafTheme = {
    mature: {
      fillLeft: '#365D24',
      fillRight: '#44722E',
      vein: '#223D17',
      baseScale: 1.15,
      opacity: 0.95,
    },
    medium: {
      fillLeft: '#4F7F32',
      fillRight: '#5E943D',
      vein: '#2D4F1E',
      baseScale: 0.95,
      opacity: 0.92,
    },
    young: {
      fillLeft: '#6CA644',
      fillRight: '#7EB953',
      vein: '#416B27',
      baseScale: 0.72,
      opacity: 0.9,
    },
    curled: {
      fillLeft: '#46752D',
      fillRight: '#588E39',
      vein: '#2B4D1A',
      baseScale: 0.88,
      opacity: 0.92,
    },
    bud: {
      fillLeft: '#8AC75E',
      fillRight: '#9BDB6E',
      vein: '#52832E',
      baseScale: 0.5,
      opacity: 0.88,
    },
  }[type] || {
    fillLeft: '#4F7F32',
    fillRight: '#5E943D',
    vein: '#2D4F1E',
    baseScale: 1,
    opacity: 0.9,
  };

  const finalScale = scale * leafTheme.baseScale;

  return (
    <motion.g
      transform={`translate(${x}, ${y}) rotate(${rotation}) scale(${finalScale})`}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: finalScale, opacity: leafTheme.opacity }}
      transition={{
        type: 'spring',
        stiffness: 140,
        damping: 18,
        delay: delay,
      }}
    >
      {/* Petiole / leaf stalk */}
      <path
        d="M0 0 Q-1 -4 0 -7"
        stroke={leafTheme.vein}
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />

      {type === 'curled' ? (
        // Asymmetric leaf seen at an angle
        <g transform="translate(0, -7)">
          <path
            d="M 0 0 C -11 -6, -12 -18, -2 -26 C 6 -20, 8 -10, 0 0 Z"
            fill={leafTheme.fillLeft}
          />
          <path
            d="M 0 0 C 4 -6, 7 -14, -2 -26 C 2 -17, 1 -8, 0 0 Z"
            fill={leafTheme.fillRight}
            opacity="0.85"
          />
          <path
            d="M 0 0 C 1 -8, 0 -18, -2 -26"
            stroke={leafTheme.vein}
            strokeWidth="0.8"
            strokeLinecap="round"
            fill="none"
            opacity="0.75"
          />
        </g>
      ) : (
        // Heart/pointed oval Kerala creeper leaf with split botanical shading
        <g transform="translate(0, -7)">
          {/* Left blade */}
          <path
            d="M 0 0 C -9 -5, -12 -16, 0 -25 C 0 -17, -1 -8, 0 0 Z"
            fill={leafTheme.fillLeft}
          />
          {/* Right blade */}
          <path
            d="M 0 0 C 9 -5, 12 -16, 0 -25 C 0 -17, 1 -8, 0 0 Z"
            fill={leafTheme.fillRight}
          />
          {/* Central vein */}
          <path
            d="M 0 0 Q -0.5 -12 0 -24"
            stroke={leafTheme.vein}
            strokeWidth="0.9"
            strokeLinecap="round"
            fill="none"
            opacity="0.8"
          />
          {/* Delicate lateral veins */}
          {type !== 'bud' && (
            <>
              <path
                d="M 0 -8 Q -4 -11 -7 -10"
                stroke={leafTheme.vein}
                strokeWidth="0.6"
                strokeLinecap="round"
                fill="none"
                opacity="0.5"
              />
              <path
                d="M 0 -7 Q 4 -10 7 -9"
                stroke={leafTheme.vein}
                strokeWidth="0.6"
                strokeLinecap="round"
                fill="none"
                opacity="0.5"
              />
              <path
                d="M 0 -14 Q -3 -17 -6 -17"
                stroke={leafTheme.vein}
                strokeWidth="0.5"
                strokeLinecap="round"
                fill="none"
                opacity="0.45"
              />
              <path
                d="M 0 -13 Q 3 -16 6 -16"
                stroke={leafTheme.vein}
                strokeWidth="0.5"
                strokeLinecap="round"
                fill="none"
                opacity="0.45"
              />
            </>
          )}
        </g>
      )}
    </motion.g>
  );
}

// Organic coiling tendril
function Tendril({ d, delay = 0.5, strokeWidth = 1.6 }) {
  return (
    <motion.path
      d={d}
      stroke="#52832E"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      fill="none"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 0.85 }}
      transition={{
        duration: 1.1,
        ease: 'easeOut',
        delay: delay,
      }}
    />
  );
}

// Illustrated organic soil mound with pebbles & root crown
function SoilBase() {
  return (
    <g className="valli-chedi__soil">
      {/* Soft ground cast shadow */}
      <ellipse cx="190" cy="308" rx="82" ry="14" fill="#E2DDD5" opacity="0.5" />

      {/* Main earthy soil mound */}
      <path
        d="M 105 306 C 120 294, 150 286, 190 285 C 230 286, 260 294, 275 306 C 260 318, 225 323, 190 323 C 155 323, 120 318, 105 306 Z"
        fill="#573B25"
      />

      {/* Deep loam layer with irregular edge */}
      <path
        d="M 120 307 C 140 298, 165 292, 190 292 C 215 292, 240 298, 260 307 C 242 316, 215 320, 190 320 C 165 320, 138 316, 120 307 Z"
        fill="#3D2719"
      />

      {/* Surface soil humus highlights */}
      <path
        d="M 135 299 C 155 292, 175 288, 190 288 C 205 288, 225 292, 245 299 C 230 303, 210 306, 190 306 C 170 306, 150 303, 135 299 Z"
        fill="#7D583B"
        opacity="0.85"
      />

      {/* Tiny soil clods and pebbles */}
      <circle cx="145" cy="305" r="3" fill="#3D2719" />
      <circle cx="165" cy="312" r="2.2" fill="#7D583B" />
      <circle cx="218" cy="310" r="2.8" fill="#3D2719" />
      <circle cx="236" cy="304" r="2" fill="#7D583B" />
      <ellipse cx="185" cy="315" rx="3.5" ry="2" fill="#2E1C12" />
      <circle cx="132" cy="309" r="1.5" fill="#8C6344" />
      <circle cx="248" cy="308" r="1.6" fill="#8C6344" />

      {/* Root flare anchoring the creeper base */}
      <path
        d="M 183 293 C 180 297, 174 300, 168 302"
        stroke="#47301E"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 197 293 C 200 297, 206 300, 212 302"
        stroke="#47301E"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
    </g>
  );
}

export default function ValliChedi({
  growthLevel = 1,
  growthPercentage = 0,
  severity = 'SEED',
}) {
  const level = Math.min(Math.max(Number(growthLevel) || 1, 1), 7);
  const pct = Math.min(Math.max(Number(growthPercentage) || 0, 0), 100);

  // Growth level copy (calm, funny Kerala creeper personality)
  const LEVEL_MESSAGES = {
    1: 'Tiny seed asleep in the soil.',
    2: 'A tender sprout emerges with cautious curiosity.',
    3: 'Small vine reaching for something to climb.',
    4: 'Multiple branches actively seeking territory.',
    5: 'The vine has noticed your calendar and settled in.',
    6: 'Takeover mode: leaves flourishing everywhere.',
    7: 'Uncontained Kerala creeper. The chedi has full autonomy.',
  };

  // Botanical architecture data per growth level
  const plantData = useMemo(() => {
    // ---------------- LEVEL 1 (Seed / Sprout) ----------------
    if (level === 1) {
      return {
        stemD: 'M 190 293 C 188 280, 185 272, 188 260',
        stemWidth: 3.5,
        branches: [],
        leaves: [
          { x: 184, y: 266, rotation: -48, type: 'young', scale: 0.9, delay: 0.2 },
          { x: 192, y: 264, rotation: 42, type: 'young', scale: 0.85, delay: 0.3 },
          { x: 188, y: 258, rotation: -8, type: 'bud', scale: 0.75, delay: 0.4 },
        ],
        tendrils: [
          { d: 'M 188 259 C 189 253, 193 250, 192 245 C 190 241, 185 243, 186 247', delay: 0.5 },
        ],
        extra: (
          <g className="valli-chedi__seed-coat">
            {/* Split seed hull */}
            <path
              d="M 180 295 C 180 290, 186 288, 190 292 C 186 295, 182 297, 180 295 Z"
              fill="#523724"
            />
            <path
              d="M 198 296 C 197 291, 193 289, 190 292 C 193 295, 196 297, 198 296 Z"
              fill="#3D2719"
            />
          </g>
        ),
      };
    }

    // ---------------- LEVEL 2 (Young Vine) ----------------
    if (level === 2) {
      return {
        stemD: 'M 190 293 C 187 274, 184 252, 189 226',
        stemWidth: 4,
        branches: [
          { d: 'M 187 262 Q 175 256 166 252', width: 2.2, delay: 0.2 },
          { d: 'M 188 244 Q 198 238 209 235', width: 2, delay: 0.3 },
        ],
        leaves: [
          { x: 187, y: 278, rotation: 55, type: 'mature', scale: 0.85, delay: 0.2 },
          { x: 166, y: 252, rotation: -60, type: 'medium', scale: 0.9, delay: 0.3 },
          { x: 176, y: 257, rotation: -35, type: 'young', scale: 0.75, delay: 0.35 },
          { x: 209, y: 235, rotation: 62, type: 'medium', scale: 0.9, delay: 0.4 },
          { x: 198, y: 239, rotation: 30, type: 'young', scale: 0.75, delay: 0.45 },
          { x: 189, y: 226, rotation: 5, type: 'bud', scale: 0.8, delay: 0.5 },
        ],
        tendrils: [
          { d: 'M 189 226 C 192 216, 200 214, 198 206 C 196 200, 188 202, 189 208', delay: 0.55 },
        ],
      };
    }

    // ---------------- LEVEL 3 (Small Vine) ----------------
    if (level === 3) {
      return {
        stemD: 'M 190 293 C 187 268, 181 234, 192 198 C 196 182, 191 168, 186 154',
        stemWidth: 4.4,
        branches: [
          { d: 'M 186 266 Q 170 258 155 252', width: 2.5, delay: 0.2 },
          { d: 'M 185 238 Q 202 228 218 222', width: 2.3, delay: 0.3 },
          { d: 'M 190 198 Q 172 186 160 178', width: 2, delay: 0.4 },
          { d: 'M 190 174 Q 204 165 214 158', width: 1.8, delay: 0.45 },
        ],
        leaves: [
          { x: 187, y: 280, rotation: 50, type: 'mature', scale: 0.9, delay: 0.2 },
          { x: 155, y: 252, rotation: -68, type: 'mature', scale: 0.95, delay: 0.25 },
          { x: 168, y: 258, rotation: -40, type: 'medium', scale: 0.85, delay: 0.3 },
          { x: 218, y: 222, rotation: 65, type: 'medium', scale: 0.95, delay: 0.35 },
          { x: 202, y: 228, rotation: 38, type: 'medium', scale: 0.85, delay: 0.4 },
          { x: 160, y: 178, rotation: -58, type: 'curled', scale: 0.85, delay: 0.45 },
          { x: 174, y: 186, rotation: -30, type: 'young', scale: 0.8, delay: 0.5 },
          { x: 214, y: 158, rotation: 52, type: 'young', scale: 0.85, delay: 0.55 },
          { x: 186, y: 154, rotation: -12, type: 'young', scale: 0.8, delay: 0.6 },
          { x: 184, y: 148, rotation: 8, type: 'bud', scale: 0.8, delay: 0.65 },
        ],
        tendrils: [
          { d: 'M 155 252 C 146 248, 140 240, 144 234 C 148 228, 154 233, 152 238', delay: 0.5 },
          { d: 'M 186 154 C 185 142, 194 136, 191 127 C 188 120, 178 122, 180 130', delay: 0.65 },
        ],
      };
    }

    // ---------------- LEVEL 4 (Growing Chedi) ----------------
    if (level === 4) {
      return {
        stemD: 'M 190 293 C 186 264, 179 230, 194 194 C 201 168, 184 138, 183 108',
        stemWidth: 4.8,
        branches: [
          { d: 'M 186 270 Q 164 260 144 252', width: 2.8, delay: 0.2 },
          { d: 'M 184 240 Q 208 230 230 220', width: 2.6, delay: 0.25 },
          { d: 'M 189 204 Q 168 190 148 180', width: 2.3, delay: 0.35 },
          { d: 'M 198 172 Q 220 158 236 146', width: 2, delay: 0.4 },
          { d: 'M 188 136 Q 168 122 152 114', width: 1.8, delay: 0.45 },
          { d: 'M 183 118 Q 198 106 210 98', width: 1.6, delay: 0.5 },
        ],
        leaves: [
          { x: 187, y: 282, rotation: -45, type: 'mature', scale: 1, delay: 0.15 },
          { x: 189, y: 275, rotation: 52, type: 'mature', scale: 0.95, delay: 0.2 },
          { x: 144, y: 252, rotation: -70, type: 'mature', scale: 1.05, delay: 0.25 },
          { x: 162, y: 258, rotation: -42, type: 'medium', scale: 0.95, delay: 0.3 },
          { x: 230, y: 220, rotation: 68, type: 'mature', scale: 1.05, delay: 0.3 },
          { x: 210, y: 226, rotation: 40, type: 'medium', scale: 0.95, delay: 0.35 },
          { x: 148, y: 180, rotation: -65, type: 'medium', scale: 0.95, delay: 0.4 },
          { x: 168, y: 188, rotation: -32, type: 'curled', scale: 0.9, delay: 0.42 },
          { x: 236, y: 146, rotation: 62, type: 'medium', scale: 0.9, delay: 0.45 },
          { x: 218, y: 154, rotation: 35, type: 'curled', scale: 0.85, delay: 0.48 },
          { x: 152, y: 114, rotation: -55, type: 'young', scale: 0.85, delay: 0.5 },
          { x: 168, y: 122, rotation: -24, type: 'young', scale: 0.8, delay: 0.52 },
          { x: 210, y: 98, rotation: 50, type: 'young', scale: 0.8, delay: 0.55 },
          { x: 183, y: 108, rotation: -10, type: 'young', scale: 0.8, delay: 0.6 },
          { x: 182, y: 100, rotation: 12, type: 'bud', scale: 0.85, delay: 0.65 },
        ],
        tendrils: [
          { d: 'M 144 252 C 132 248, 126 238, 131 230 C 136 222, 145 228, 142 235', delay: 0.45 },
          { d: 'M 230 220 C 242 216, 248 206, 243 198 C 238 190, 229 196, 232 203', delay: 0.5 },
          { d: 'M 183 108 C 184 94, 196 88, 192 78 C 187 70, 176 74, 178 82', delay: 0.7 },
        ],
      };
    }

    // ---------------- LEVEL 5 (HERO DEFAULT / OVERGROWN) ----------------
    // Designed as the centerpiece: lush, beautifully balanced, full of vitality!
    if (level === 5) {
      return {
        stemD: 'M 190 293 C 185 264, 176 226, 195 186 C 205 150, 180 114, 184 74 C 186 58, 193 48, 189 38',
        stemWidth: 5.2,
        branches: [
          // Lower strong branches
          { d: 'M 185 272 Q 158 262 134 252', width: 3.2, delay: 0.15 },
          { d: 'M 134 252 Q 116 244 102 238', width: 2.2, delay: 0.25 }, // secondary
          { d: 'M 183 245 Q 212 234 242 222', width: 3.2, delay: 0.2 },
          { d: 'M 242 222 Q 262 212 278 202', width: 2.2, delay: 0.3 }, // secondary

          // Mid-tier climbing branches
          { d: 'M 188 206 Q 160 190 136 178', width: 2.8, delay: 0.3 },
          { d: 'M 136 178 Q 120 166 108 156', width: 1.8, delay: 0.4 }, // secondary
          { d: 'M 200 174 Q 228 158 252 144', width: 2.6, delay: 0.35 },
          { d: 'M 252 144 Q 270 132 284 120', width: 1.8, delay: 0.45 }, // secondary

          // Upper branches
          { d: 'M 185 138 Q 158 122 138 110', width: 2.3, delay: 0.45 },
          { d: 'M 184 105 Q 208 92 228 80', width: 2.1, delay: 0.5 },
          { d: 'M 184 75 Q 164 62 148 52', width: 1.8, delay: 0.55 },
          { d: 'M 188 56 Q 204 46 216 38', width: 1.6, delay: 0.6 },
        ],
        leaves: [
          // Base & Lower Tier Foliage (Rich, Mature)
          { x: 186, y: 284, rotation: -48, type: 'mature', scale: 1.05, delay: 0.15 },
          { x: 191, y: 278, rotation: 50, type: 'mature', scale: 1, delay: 0.18 },
          { x: 102, y: 238, rotation: -72, type: 'mature', scale: 1.1, delay: 0.25 },
          { x: 120, y: 246, rotation: -50, type: 'curled', scale: 1, delay: 0.28 },
          { x: 134, y: 252, rotation: -30, type: 'medium', scale: 0.95, delay: 0.3 },
          { x: 156, y: 260, rotation: -60, type: 'mature', scale: 1.05, delay: 0.32 },
          { x: 278, y: 202, rotation: 74, type: 'mature', scale: 1.1, delay: 0.3 },
          { x: 258, y: 214, rotation: 52, type: 'curled', scale: 1, delay: 0.32 },
          { x: 242, y: 222, rotation: 32, type: 'medium', scale: 0.95, delay: 0.35 },
          { x: 216, y: 232, rotation: 62, type: 'mature', scale: 1.05, delay: 0.38 },

          // Mid Tier Foliage (Vibrant Sap Green)
          { x: 108, y: 156, rotation: -68, type: 'mature', scale: 1.05, delay: 0.4 },
          { x: 124, y: 168, rotation: -42, type: 'medium', scale: 0.95, delay: 0.42 },
          { x: 136, y: 178, rotation: -20, type: 'curled', scale: 0.92, delay: 0.45 },
          { x: 160, y: 188, rotation: -58, type: 'medium', scale: 1, delay: 0.45 },
          { x: 284, y: 120, rotation: 70, type: 'mature', scale: 1.05, delay: 0.42 },
          { x: 266, y: 134, rotation: 48, type: 'medium', scale: 0.95, delay: 0.45 },
          { x: 252, y: 144, rotation: 26, type: 'curled', scale: 0.92, delay: 0.48 },
          { x: 226, y: 160, rotation: 56, type: 'medium', scale: 1, delay: 0.48 },

          // Upper Tier (Young & Fresh Shoots)
          { x: 138, y: 110, rotation: -60, type: 'medium', scale: 0.95, delay: 0.5 },
          { x: 156, y: 118, rotation: -32, type: 'young', scale: 0.9, delay: 0.52 },
          { x: 228, y: 80, rotation: 58, type: 'medium', scale: 0.95, delay: 0.52 },
          { x: 206, y: 90, rotation: 34, type: 'young', scale: 0.88, delay: 0.55 },
          { x: 148, y: 52, rotation: -54, type: 'young', scale: 0.88, delay: 0.58 },
          { x: 166, y: 60, rotation: -25, type: 'young', scale: 0.82, delay: 0.6 },
          { x: 216, y: 38, rotation: 50, type: 'young', scale: 0.85, delay: 0.62 },
          { x: 198, y: 46, rotation: 24, type: 'curled', scale: 0.8, delay: 0.65 },

          // Active Apex Tip
          { x: 189, y: 38, rotation: -12, type: 'young', scale: 0.85, delay: 0.68 },
          { x: 187, y: 28, rotation: 10, type: 'bud', scale: 0.9, delay: 0.72 },
          { x: 193, y: 26, rotation: -20, type: 'bud', scale: 0.85, delay: 0.75 },
        ],
        tendrils: [
          // 4 graceful curling spirals
          { d: 'M 102 238 C 88 232, 80 220, 86 210 C 92 200, 104 206, 98 216 C 94 222, 88 218, 90 212', delay: 0.45 },
          { d: 'M 278 202 C 294 196, 304 184, 296 174 C 288 164, 276 170, 282 180 C 286 186, 292 182, 290 176', delay: 0.5 },
          { d: 'M 108 156 C 96 148, 90 136, 96 126 C 102 116, 112 122, 106 130', delay: 0.55 },
          { d: 'M 284 120 C 298 112, 306 98, 298 88 C 290 78, 280 84, 286 94', delay: 0.6 },
          { d: 'M 189 38 C 190 22, 204 14, 198 4 C 192 -6, 180 -2, 184 8', delay: 0.75 },
        ],
      };
    }

    // ---------------- LEVEL 6 (Valli Takeover) ----------------
    if (level === 6) {
      return {
        stemD: 'M 190 293 C 185 260, 174 220, 196 176 C 206 140, 178 100, 185 60 C 188 42, 200 30, 192 18',
        stemWidth: 5.6,
        branches: [
          { d: 'M 185 272 Q 152 260 124 250', width: 3.5, delay: 0.15 },
          { d: 'M 124 250 Q 98 240 76 232', width: 2.4, delay: 0.25 },
          { d: 'M 183 245 Q 218 232 254 218', width: 3.5, delay: 0.2 },
          { d: 'M 254 218 Q 282 204 308 190', width: 2.4, delay: 0.3 },
          { d: 'M 188 206 Q 154 188 126 174', width: 3, delay: 0.3 },
          { d: 'M 126 174 Q 102 158 84 144', width: 2, delay: 0.4 },
          { d: 'M 200 174 Q 236 156 266 140', width: 2.8, delay: 0.35 },
          { d: 'M 266 140 Q 294 124 318 108', width: 2, delay: 0.45 },
          { d: 'M 185 138 Q 150 118 124 102', width: 2.5, delay: 0.45 },
          { d: 'M 184 105 Q 216 90 242 74', width: 2.3, delay: 0.5 },
          { d: 'M 184 75 Q 158 58 138 44', width: 2, delay: 0.55 },
          { d: 'M 188 54 Q 212 42 228 30', width: 1.8, delay: 0.6 },
          { d: 'M 192 32 Q 174 20 156 12', width: 1.5, delay: 0.65 },
        ],
        leaves: [
          // Base
          { x: 186, y: 284, rotation: -48, type: 'mature', scale: 1.1, delay: 0.15 },
          { x: 191, y: 278, rotation: 50, type: 'mature', scale: 1.05, delay: 0.18 },
          { x: 76, y: 232, rotation: -74, type: 'mature', scale: 1.15, delay: 0.25 },
          { x: 104, y: 242, rotation: -55, type: 'curled', scale: 1.05, delay: 0.28 },
          { x: 124, y: 250, rotation: -32, type: 'mature', scale: 1, delay: 0.3 },
          { x: 154, y: 260, rotation: -62, type: 'mature', scale: 1.05, delay: 0.32 },
          { x: 308, y: 190, rotation: 76, type: 'mature', scale: 1.15, delay: 0.3 },
          { x: 280, y: 206, rotation: 55, type: 'curled', scale: 1.05, delay: 0.32 },
          { x: 254, y: 218, rotation: 35, type: 'mature', scale: 1, delay: 0.35 },
          { x: 218, y: 230, rotation: 65, type: 'mature', scale: 1.05, delay: 0.38 },

          // Mid
          { x: 84, y: 144, rotation: -70, type: 'mature', scale: 1.1, delay: 0.4 },
          { x: 106, y: 160, rotation: -45, type: 'medium', scale: 1, delay: 0.42 },
          { x: 126, y: 174, rotation: -22, type: 'curled', scale: 0.95, delay: 0.45 },
          { x: 156, y: 186, rotation: -60, type: 'medium', scale: 1, delay: 0.45 },
          { x: 318, y: 108, rotation: 72, type: 'mature', scale: 1.1, delay: 0.42 },
          { x: 292, y: 126, rotation: 50, type: 'medium', scale: 1, delay: 0.45 },
          { x: 266, y: 140, rotation: 28, type: 'curled', scale: 0.95, delay: 0.48 },
          { x: 232, y: 158, rotation: 58, type: 'medium', scale: 1, delay: 0.48 },

          // Upper
          { x: 124, y: 102, rotation: -64, type: 'medium', scale: 1, delay: 0.5 },
          { x: 148, y: 114, rotation: -35, type: 'young', scale: 0.92, delay: 0.52 },
          { x: 242, y: 74, rotation: 60, type: 'medium', scale: 1, delay: 0.52 },
          { x: 214, y: 86, rotation: 36, type: 'young', scale: 0.9, delay: 0.55 },
          { x: 138, y: 44, rotation: -56, type: 'young', scale: 0.9, delay: 0.58 },
          { x: 162, y: 54, rotation: -28, type: 'young', scale: 0.85, delay: 0.6 },
          { x: 228, y: 30, rotation: 52, type: 'young', scale: 0.88, delay: 0.62 },
          { x: 206, y: 40, rotation: 25, type: 'curled', scale: 0.82, delay: 0.65 },
          { x: 156, y: 12, rotation: -45, type: 'bud', scale: 0.9, delay: 0.68 },
          { x: 192, y: 18, rotation: 0, type: 'young', scale: 0.85, delay: 0.7 },
          { x: 190, y: 8, rotation: 15, type: 'bud', scale: 0.9, delay: 0.72 },
        ],
        tendrils: [
          { d: 'M 76 232 C 60 226, 50 212, 58 200 C 66 188, 80 196, 72 208 C 68 214, 60 210, 62 204', delay: 0.4 },
          { d: 'M 308 190 C 326 182, 338 168, 328 156 C 318 144, 304 152, 312 164', delay: 0.45 },
          { d: 'M 84 144 C 70 134, 62 120, 70 108 C 78 96, 90 104, 82 114', delay: 0.5 },
          { d: 'M 318 108 C 334 98, 344 82, 334 70 C 324 58, 312 66, 320 78', delay: 0.55 },
          { d: 'M 138 44 C 124 34, 116 22, 124 12 C 132 2, 142 8, 136 18', delay: 0.6 },
          { d: 'M 192 18 C 195 2, 210 -8, 202 -18 C 194 -28, 180 -22, 186 -10', delay: 0.7 },
        ],
      };
    }

    // ---------------- LEVEL 7+ (UNCONTAINED / TAKEOVER) ----------------
    // The creeper is sprawling out with unrestrained botanical joy!
    return {
      stemD: 'M 190 293 C 185 254, 170 210, 198 162 C 210 126, 172 82, 186 42 C 190 24, 208 14, 194 4',
      stemWidth: 6,
      branches: [
        { d: 'M 185 272 Q 146 258 114 246', width: 3.8, delay: 0.15 },
        { d: 'M 114 246 Q 84 234 58 224', width: 2.6, delay: 0.22 },
        { d: 'M 183 245 Q 224 230 264 214', width: 3.8, delay: 0.18 },
        { d: 'M 264 214 Q 298 198 328 180', width: 2.6, delay: 0.26 },
        { d: 'M 188 206 Q 148 186 116 170', width: 3.2, delay: 0.28 },
        { d: 'M 116 170 Q 88 152 66 136', width: 2.2, delay: 0.36 },
        { d: 'M 200 174 Q 242 154 278 134', width: 3, delay: 0.32 },
        { d: 'M 278 134 Q 310 114 338 94', width: 2.2, delay: 0.4 },
        { d: 'M 185 138 Q 144 114 112 96', width: 2.7, delay: 0.42 },
        { d: 'M 184 105 Q 222 86 254 68', width: 2.5, delay: 0.46 },
        { d: 'M 184 72 Q 152 52 128 36', width: 2.2, delay: 0.52 },
        { d: 'M 188 50 Q 218 36 238 22', width: 2, delay: 0.56 },
        { d: 'M 194 24 Q 170 10 148 0', width: 1.7, delay: 0.62 },
        { d: 'M 194 4 Q 212 -8 224 -20', width: 1.5, delay: 0.68 },
      ],
      leaves: [
        // Sprawling canopy with 35+ foliage nodes
        { x: 186, y: 284, rotation: -48, type: 'mature', scale: 1.15, delay: 0.15 },
        { x: 191, y: 278, rotation: 50, type: 'mature', scale: 1.1, delay: 0.18 },
        { x: 58, y: 224, rotation: -76, type: 'mature', scale: 1.2, delay: 0.22 },
        { x: 88, y: 236, rotation: -56, type: 'curled', scale: 1.1, delay: 0.25 },
        { x: 114, y: 246, rotation: -34, type: 'mature', scale: 1.05, delay: 0.28 },
        { x: 150, y: 258, rotation: -64, type: 'mature', scale: 1.1, delay: 0.3 },
        { x: 328, y: 180, rotation: 78, type: 'mature', scale: 1.2, delay: 0.26 },
        { x: 298, y: 198, rotation: 56, type: 'curled', scale: 1.1, delay: 0.3 },
        { x: 264, y: 214, rotation: 36, type: 'mature', scale: 1.05, delay: 0.32 },
        { x: 224, y: 228, rotation: 66, type: 'mature', scale: 1.1, delay: 0.35 },
        { x: 66, y: 136, rotation: -72, type: 'mature', scale: 1.15, delay: 0.36 },
        { x: 92, y: 154, rotation: -46, type: 'medium', scale: 1.05, delay: 0.4 },
        { x: 116, y: 170, rotation: -24, type: 'curled', scale: 1, delay: 0.42 },
        { x: 152, y: 184, rotation: -62, type: 'medium', scale: 1.05, delay: 0.42 },
        { x: 338, y: 94, rotation: 74, type: 'mature', scale: 1.15, delay: 0.4 },
        { x: 308, y: 116, rotation: 52, type: 'medium', scale: 1.05, delay: 0.42 },
        { x: 278, y: 134, rotation: 30, type: 'curled', scale: 1, delay: 0.45 },
        { x: 238, y: 154, rotation: 60, type: 'medium', scale: 1.05, delay: 0.45 },
        { x: 112, y: 96, rotation: -66, type: 'medium', scale: 1.05, delay: 0.48 },
        { x: 140, y: 110, rotation: -36, type: 'young', scale: 0.95, delay: 0.5 },
        { x: 254, y: 68, rotation: 62, type: 'medium', scale: 1.05, delay: 0.5 },
        { x: 222, y: 82, rotation: 38, type: 'young', scale: 0.95, delay: 0.52 },
        { x: 128, y: 36, rotation: -58, type: 'young', scale: 0.95, delay: 0.55 },
        { x: 154, y: 48, rotation: -30, type: 'young', scale: 0.9, delay: 0.58 },
        { x: 238, y: 22, rotation: 54, type: 'young', scale: 0.92, delay: 0.6 },
        { x: 212, y: 34, rotation: 26, type: 'curled', scale: 0.85, delay: 0.62 },
        { x: 148, y: 0, rotation: -48, type: 'young', scale: 0.85, delay: 0.66 },
        { x: 224, y: -20, rotation: 48, type: 'young', scale: 0.85, delay: 0.7 },
        { x: 194, y: 4, rotation: -5, type: 'young', scale: 0.85, delay: 0.72 },
        { x: 192, y: -8, rotation: 12, type: 'bud', scale: 0.95, delay: 0.75 },
      ],
      tendrils: [
        { d: 'M 58 224 C 40 216, 28 200, 38 186 C 48 172, 64 180, 54 196 C 50 202, 40 198, 42 192', delay: 0.35 },
        { d: 'M 328 180 C 350 170, 364 152, 352 138 C 340 124, 324 134, 334 148', delay: 0.4 },
        { d: 'M 66 136 C 48 124, 38 108, 48 94 C 58 80, 72 90, 62 102', delay: 0.45 },
        { d: 'M 338 94 C 358 82, 370 64, 358 50 C 346 36, 332 46, 342 58', delay: 0.5 },
        { d: 'M 128 36 C 110 24, 100 10, 110 -2 C 120 -14, 132 -6, 124 6', delay: 0.55 },
        { d: 'M 238 22 C 256 10, 266 -4, 256 -16 C 246 -28, 234 -18, 242 -8', delay: 0.6 },
        { d: 'M 148 0 C 134 -12, 128 -26, 138 -36 C 148 -46, 158 -38, 150 -28', delay: 0.68 },
        { d: 'M 194 4 C 196 -14, 214 -24, 206 -36 C 198 -48, 182 -40, 190 -26', delay: 0.75 },
      ],
    };
  }, [level]);

  // Subtle dynamic scale adjustment based on growthPercentage within level
  const growthScaleBonus = 1 + (pct / 100) * 0.06;

  return (
    <div
      className="valli-chedi"
      role="img"
      aria-label={`Valli Chedi at Level ${level}: ${LEVEL_MESSAGES[level] || ''}. ${pct}% progress.`}
    >
      <div className="valli-chedi__stage">
        <svg
          viewBox="-20 -50 420 380"
          className="valli-chedi__svg"
          preserveAspectRatio="xMidYMax meet"
        >
          <defs>
            {/* Soft botanical gradients */}
            <linearGradient id="mainStemGrad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#2A4A1B" />
              <stop offset="60%" stopColor="#3B6527" />
              <stop offset="100%" stopColor="#5E963D" />
            </linearGradient>

            <linearGradient id="branchGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#365D24" />
              <stop offset="100%" stopColor="#538634" />
            </linearGradient>
          </defs>

          {/* Earthy illustrated soil base */}
          <SoilBase />

          {/* Plant structure container with growth percentage subtle scaling */}
          <g
            id="valli-plant-body"
            style={{
              transformOrigin: '190px 293px',
              transform: `scale(${growthScaleBonus})`,
              transition: 'transform 800ms ease-out',
            }}
          >
            {/* Extra stage-specific props (e.g., split seed hull at level 1) */}
            {plantData.extra}

            {/* Sinuous undulating main stem */}
            <motion.path
              d={plantData.stemD}
              stroke="url(#mainStemGrad)"
              strokeWidth={plantData.stemWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.1, ease: 'easeOut' }}
            />

            {/* Organic Branches */}
            {plantData.branches.map((branch, index) => (
              <motion.path
                key={`branch-${level}-${index}`}
                d={branch.d}
                stroke="url(#branchGrad)"
                strokeWidth={branch.width}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: 0.9,
                  ease: 'easeOut',
                  delay: branch.delay || 0.2 + index * 0.05,
                }}
              />
            ))}

            {/* Natural Curling Tendrils */}
            {plantData.tendrils.map((tendril, index) => (
              <Tendril
                key={`tendril-${level}-${index}`}
                d={tendril.d}
                delay={tendril.delay}
              />
            ))}

            {/* Handcrafted Botanical Leaves */}
            {plantData.leaves.map((leaf, index) => (
              <Leaf
                key={`leaf-${level}-${index}`}
                x={leaf.x}
                y={leaf.y}
                rotation={leaf.rotation}
                scale={leaf.scale}
                type={leaf.type}
                delay={leaf.delay || 0.15 + index * 0.02}
              />
            ))}
          </g>
        </svg>

        {/* Minimal status caption */}
        <div className="valli-chedi__caption">
          <p className="valli-chedi__status-text">{LEVEL_MESSAGES[level]}</p>
        </div>
      </div>
    </div>
  );
}
