import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ValliChedi.css';

/**
 * VALLI CHEDI — Botanical Creeper Visual
 * ----------------------------------------------------------------------------
 * Hand-illustrated Kerala creeper vine faithfully recreating the approved
 * mockup proportions, silhouette, leaf design, and visual character:
 * - Earthy layered soil mound with pebbles & root flares
 * - Fleshy 3D painted green trunk with bark contour lines
 * - Horizontal ground runner snaking left towards the Valli Score
 * - Graceful S-curve climbing vine arching upwards to the right
 * - Authentic cordate (heart/betel) leaves with veins, folds & dual-tone shading
 * - Delicate coiling tendrils and ambient drifting petals
 * - Sliced data-driven layers that grow on level up and shrink on cancellation
 */

const GROWTH_CONFIG = {
  1: { branches: 0, leaves: 2, tendrils: 0, runner: false },
  2: { branches: 1, leaves: 4, tendrils: 0, runner: false },
  3: { branches: 2, leaves: 8, tendrils: 1, runner: true },
  4: { branches: 3, leaves: 12, tendrils: 2, runner: true },
  5: { branches: 5, leaves: 16, tendrils: 5, runner: true }, // Approved Mockup Hero State
  6: { branches: 6, leaves: 20, tendrils: 6, runner: true },
  7: { branches: 7, leaves: 25, tendrils: 8, runner: true },
  8: { branches: 8, leaves: 30, tendrils: 10, runner: true },
  9: { branches: 9, leaves: 35, tendrils: 12, runner: true },
  10: { branches: 10, leaves: 42, tendrils: 15, runner: true },
};

const LEVEL_CONSEQUENCES = {
  1: 'Suspiciously peaceful. Parents assume you are studying.',
  2: 'Sprout. Achan noticed you were out late.',
  3: 'Preliminary questioning: Amma asked "Who are these friends?"',
  4: 'The Serious Talk: "Sit in the hall." Spectacles removed.',
  5: 'High Alert: "Keep this up and pack your bags!" Achan threatened eviction.',
  6: 'Domestic Crisis: Emotional speeches, bags placed near the door.',
  7: 'Eviction Complete: Kicked out of the house. NRI on your own porch.',
  8: 'Neighborhood WhatsApp group convened. Disownment papers drafted.',
  9: 'Relatives from Gulf called to offer condolences to parents.',
  10: 'The Valli Chedi has taken your room. You belong to the vine now.',
};

/* ----------------------------------------------------------------------------
   Custom Botanical Cordate Leaf (Heart/Betel Vine Shape)
   ---------------------------------------------------------------------------- */
function CordateLeaf({
  id,
  x,
  y,
  rotation = 0,
  scale = 1,
  variant = 'standard', // 'standard', 'broad', 'drooping', 'folded', 'young', 'bud'
  delay = 0,
  isInitial = false,
}) {
  const finalDelay = isInitial ? delay : 0.05;

  // Custom leaf geometry based on botanical variant
  const renderLeafBlade = () => {
    switch (variant) {
      case 'folded':
        // Folded 3/4 perspective leaf showing shaded face & light folded margin
        return (
          <g>
            {/* Petiole stalk */}
            <path d="M 0 0 Q -2 4 0 8" stroke="#31551D" strokeWidth="2" fill="none" strokeLinecap="round" />
            {/* Left/lower shaded half */}
            <path
              d="M 0 8 C -14 4, -18 18, -4 34 C 4 22, 6 12, 0 8 Z"
              fill="#528130"
              stroke="#2B4918"
              strokeWidth="1.1"
              strokeLinejoin="round"
            />
            {/* Folded highlighted rim */}
            <path
              d="M 0 8 C 6 10, 10 22, -4 34 C 2 20, 2 12, 0 8 Z"
              fill="#7CB74E"
              stroke="#2B4918"
              strokeWidth="1"
              strokeLinejoin="round"
            />
            {/* Vein */}
            <path d="M 0 8 Q 0 20 -3 32" stroke="#233E14" strokeWidth="1.1" fill="none" strokeLinecap="round" />
          </g>
        );

      case 'broad':
      case 'drooping':
      case 'standard':
      default:
        // Broad lush cordate heart leaf with basal notch, tapering tip & veins
        return (
          <g>
            {/* Petiole stalk */}
            <path d="M 0 0 Q -1 4 0 7" stroke="#31551D" strokeWidth="2.2" fill="none" strokeLinecap="round" />
            
            {/* Main leaf blade */}
            <path
              d="
                M 0 7
                C -12 1, -22 7, -20 21
                C -18 35, -8 43, 0 51
                C 8 43, 18 35, 20 21
                C 22 7, 12 1, 0 7
                Z
              "
              fill="#669D3C"
              stroke="#294617"
              strokeWidth="1.1"
              strokeLinejoin="round"
            />

            {/* Left shaded lobe */}
            <path
              d="
                M 0 7
                C -12 1, -22 7, -20 21
                C -18 35, -8 43, 0 51
                C -2 35, -1 19, 0 7
                Z
              "
              fill="#52802F"
              opacity="0.9"
            />

            {/* Right subtle highlight */}
            <path
              d="
                M 0 7
                C 6 9, 14 15, 12 25
                C 10 33, 4 43, 0 51
                C 2 39, 4 23, 0 7
                Z
              "
              fill="#7FBA4F"
              opacity="0.6"
            />

            {/* Curved midrib vein */}
            <path
              d="M 0 7 Q -0.5 28 0 49"
              stroke="#244114"
              strokeWidth="1.3"
              fill="none"
              strokeLinecap="round"
            />

            {/* Delicate lateral veins */}
            {variant !== 'bud' && (
              <>
                <path d="M 0 18 Q -6 22 -14 22" stroke="#244114" strokeWidth="0.75" fill="none" opacity="0.6" strokeLinecap="round" />
                <path d="M 0 20 Q 6 24 14 24" stroke="#244114" strokeWidth="0.75" fill="none" opacity="0.6" strokeLinecap="round" />
                <path d="M 0 29 Q -5 33 -11 35" stroke="#244114" strokeWidth="0.65" fill="none" opacity="0.5" strokeLinecap="round" />
                <path d="M 0 31 Q 5 35 11 37" stroke="#244114" strokeWidth="0.65" fill="none" opacity="0.5" strokeLinecap="round" />
              </>
            )}
          </g>
        );
    }
  };

  return (
    <motion.g
      key={id}
      transform={`translate(${x} ${y}) rotate(${rotation}) scale(${scale})`}
      initial={{ opacity: 0, scale: 0, rotate: rotation - 15 }}
      animate={{ opacity: 1, scale, rotate: rotation }}
      exit={{ opacity: 0, scale: 0, transition: { duration: 0.35 } }}
      transition={{ duration: 0.55, delay: finalDelay, ease: 'easeOut' }}
      style={{ transformOrigin: '0px 0px' }}
    >
      {renderLeafBlade()}
    </motion.g>
  );
}

/* ----------------------------------------------------------------------------
   Micro-Growth Leaf (Dynamic Percentage Sprout)
   ---------------------------------------------------------------------------- */
function MicroLeaf({ id, x, y, rotation = 0, delay = 0, isInitial = false }) {
  const finalDelay = isInitial ? delay : 0.05;

  return (
    <motion.g
      key={id}
      transform={`translate(${x} ${y}) rotate(${rotation}) scale(0.6)`}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 0.6 }}
      exit={{ opacity: 0, scale: 0, transition: { duration: 0.3 } }}
      transition={{ duration: 0.45, delay: finalDelay }}
      style={{ transformOrigin: '0px 0px' }}
    >
      <path
        d="M 0 0 C 6 -9, 16 -11, 21 -5 C 16 5, 6 8, 0 0 Z"
        fill="#77AE47"
        stroke="#2D4D1A"
        strokeWidth="1"
      />
    </motion.g>
  );
}

/* ----------------------------------------------------------------------------
   Illustrated Soil Base (Matching the Approved Mockup)
   ---------------------------------------------------------------------------- */
function SoilMound() {
  return (
    <g className="valli-chedi__soil">
      {/* Ground soft shadow */}
      <ellipse cx="370" cy="378" rx="95" ry="14" fill="#E8DFD3" opacity="0.75" />

      {/* Dark base loam mound */}
      <path
        d="
          M 285 368
          C 305 342, 345 332, 375 332
          C 410 332, 445 345, 465 368
          C 440 384, 310 384, 285 368
          Z
        "
        fill="#4A2F1B"
      />

      {/* Mid warm soil mound */}
      <path
        d="
          M 300 366
          C 320 348, 350 340, 375 340
          C 400 338, 430 350, 450 366
          C 430 376, 320 376, 300 366
          Z
        "
        fill="#664126"
      />

      {/* Surface soil clods with dark base & warm highlights */}
      <ellipse cx="330" cy="365" rx="14" ry="7" fill="#3A2213" />
      <ellipse cx="331" cy="364" rx="12" ry="5" fill="#754E30" />

      <ellipse cx="420" cy="368" rx="16" ry="8" fill="#3A2213" />
      <ellipse cx="419" cy="367" rx="13" ry="6" fill="#754E30" />

      <ellipse cx="370" cy="374" rx="20" ry="9" fill="#2E1A0E" />
      <circle cx="305" cy="372" r="3.5" fill="#3A2213" />
      <circle cx="440" cy="372" r="3.5" fill="#754E30" />
      <circle cx="350" cy="378" r="3" fill="#2E1A0E" />
      <circle cx="395" cy="378" r="3" fill="#885E39" />

      {/* Anchoring root flares */}
      <path
        d="M 362 344 C 352 352, 335 358, 320 364"
        stroke="#332012"
        strokeWidth="3.2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 382 344 C 394 352, 412 358, 430 364"
        stroke="#332012"
        strokeWidth="3.2"
        strokeLinecap="round"
        fill="none"
      />
    </g>
  );
}

/* ----------------------------------------------------------------------------
   Floating Ambient Petal
   ---------------------------------------------------------------------------- */
function FloatingPetal({ top, left, delay = 0 }) {
  return (
    <motion.div
      className="valli-chedi__ambient-leaf"
      style={{ top, left, width: 14, height: 14 }}
      animate={{
        y: [-5, 5, -5],
        x: [-3, 3, -3],
        rotate: [-8, 8, -8],
        opacity: [0.5, 0.85, 0.5],
      }}
      transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay }}
    >
      <svg viewBox="0 0 20 20" width="100%" height="100%">
        <path d="M 2 10 C 4 5, 10 2, 18 2 C 18 10, 15 16, 10 18 C 5 16, 2 13, 2 10 Z" fill="#6EA445" opacity="0.8" />
        <path d="M 2 10 Q 10 10 18 2" stroke="#365C1F" strokeWidth="1" fill="none" opacity="0.6" />
      </svg>
    </motion.div>
  );
}

/* ----------------------------------------------------------------------------
   MAIN VALLI CHEDI COMPONENT
   ---------------------------------------------------------------------------- */
export default function ValliChedi({
  growthLevel = 5,
  growthPercentage = 54,
  severity = 'SEED',
}) {
  const level = Math.min(10, Math.max(1, Math.round(Number(growthLevel) || 1)));
  const pct = Math.min(100, Math.max(0, Math.round(Number(growthPercentage) || 0)));

  const isInitialMount = useRef(true);
  useEffect(() => {
    isInitialMount.current = false;
  }, []);

  const config = GROWTH_CONFIG[level] || GROWTH_CONFIG[5];

  /*
    Exact SVG Branch Paths Traced from Approved Mockup:
    Features the horizontal ground runner snaking left
    and the S-curve climbing vine arching right
  */
  const branches = [
    // Branch 0: Left Horizontal Ground Runner (signature creeper branch)
    {
      id: 'b-runner',
      d: 'M 366 324 C 342 300, 322 284, 298 290 C 275 296, 258 322, 238 338 C 218 352, 192 344, 168 336 C 142 328, 115 340, 88 354 C 76 360, 68 360, 58 358',
      strokeWidth: 4.2,
      delay: 0.4,
    },

    // Branch 1: Upper-left branch to broad heart leaf
    {
      id: 'b-upper-left',
      d: 'M 425 192 C 405 180, 388 172, 368 170',
      strokeWidth: 3.2,
      delay: 0.8,
    },

    // Branch 2: Mid-right climbing branch
    {
      id: 'b-mid-right',
      d: 'M 390 316 C 410 306, 424 298, 438 294',
      strokeWidth: 3.2,
      delay: 1.0,
    },

    // Branch 3: Upper-right folded leaf branch
    {
      id: 'b-upper-right',
      d: 'M 428 188 C 448 180, 468 178, 484 182',
      strokeWidth: 3.0,
      delay: 1.2,
    },

    // Branch 4: High-right shoot
    {
      id: 'b-high-right',
      d: 'M 428 138 C 438 128, 444 120, 448 112',
      strokeWidth: 2.6,
      delay: 1.4,
    },

    // Branch 5: Right ground runner shoot
    {
      id: 'b-ground-right',
      d: 'M 418 372 C 448 376, 482 374, 516 368 C 524 366, 530 364, 534 362',
      strokeWidth: 2.6,
      delay: 1.6,
    },

    // Branch 6: Apex tip shoot
    {
      id: 'b-apex',
      d: 'M 428 65 C 430 55, 432 48, 434 40',
      strokeWidth: 2.2,
      delay: 1.8,
    },

    // Branches 7-9 (for Levels 8–10)
    {
      id: 'b-ext-1',
      d: 'M 368 170 C 348 165, 330 155, 315 142',
      strokeWidth: 2.2,
      delay: 2.0,
    },
    {
      id: 'b-ext-2',
      d: 'M 484 182 C 504 175, 522 172, 540 180',
      strokeWidth: 2.2,
      delay: 2.2,
    },
    {
      id: 'b-ext-3',
      d: 'M 434 40 C 438 28, 448 18, 458 10',
      strokeWidth: 2.0,
      delay: 2.4,
    },
  ];

  /*
    Exact Leaf Coordinates & Variants Traced from Approved Mockup
  */
  const leaves = [
    // ── Lower Base / Level 1–2 leaves ──
    { id: 'lf-base-1', x: 358, y: 326, rotation: -40, scale: 0.85, variant: 'standard', delay: 0.3 },
    { id: 'lf-base-2', x: 385, y: 322, rotation: 35, scale: 0.8, variant: 'standard', delay: 0.4 },

    // ── Horizontal Runner Leaves (Snaking Left) ──
    // Leaf 2: Signature broad drooping heart leaf hanging from the runner arch
    { id: 'lf-runner-droop', x: 304, y: 295, rotation: -60, scale: 1.25, variant: 'drooping', delay: 0.6 },
    // Leaf 3: Upright leaf standing on the runner arch
    { id: 'lf-runner-upright', x: 326, y: 278, rotation: -28, scale: 1.1, variant: 'broad', delay: 0.8 },
    // Leaf 4: Drooping leaf under mid-runner
    { id: 'lf-runner-mid-droop', x: 238, y: 338, rotation: 32, scale: 1.05, variant: 'drooping', delay: 1.0 },
    // Leaf 5: Upright leaf on mid-runner
    { id: 'lf-runner-mid-up', x: 212, y: 342, rotation: -62, scale: 1.1, variant: 'standard', delay: 1.2 },
    // Leaf 6: Outer runner leaf pointing up
    { id: 'lf-runner-outer-up', x: 168, y: 336, rotation: -25, scale: 1.0, variant: 'standard', delay: 1.4 },
    // Leaf 7: Outer runner small leaf pointing down
    { id: 'lf-runner-outer-down', x: 140, y: 348, rotation: 42, scale: 0.9, variant: 'standard', delay: 1.5 },
    // Leaf 8: Runner tip leaf
    { id: 'lf-runner-tip', x: 86, y: 360, rotation: -78, scale: 0.85, variant: 'young', delay: 1.6 },

    // ── Vertical S-Curve Climber Leaves (Arching Right) ──
    // Leaf 9: Big drooping cordate leaf at mid-right
    { id: 'lf-climber-mid-droop', x: 436, y: 292, rotation: 45, scale: 1.25, variant: 'drooping', delay: 1.0 },
    // Leaf 10: Big broad cordate leaf at upper-left
    { id: 'lf-climber-upper-left', x: 366, y: 170, rotation: -68, scale: 1.3, variant: 'broad', delay: 1.2 },
    // Leaf 11: Folded perspective leaf at upper-right
    { id: 'lf-climber-upper-right', x: 484, y: 182, rotation: 62, scale: 1.15, variant: 'folded', delay: 1.4 },
    // Leaf 12: High right leaf
    { id: 'lf-climber-high-right', x: 446, y: 114, rotation: 38, scale: 1.05, variant: 'standard', delay: 1.6 },
    // Leaf 13: Climber low-right branch leaf
    { id: 'lf-climber-low-right', x: 420, y: 316, rotation: 30, scale: 0.95, variant: 'standard', delay: 1.7 },
    // Leaf 14: Apex young leaf 1
    { id: 'lf-apex-1', x: 426, y: 48, rotation: -35, scale: 0.8, variant: 'young', delay: 1.8 },
    // Leaf 15: Apex young leaf 2
    { id: 'lf-apex-2', x: 432, y: 42, rotation: 25, scale: 0.7, variant: 'young', delay: 1.9 },

    // ── Right Ground Runner Leaves ──
    { id: 'lf-ground-right-1', x: 482, y: 372, rotation: 28, scale: 0.8, variant: 'young', delay: 2.0 },
    { id: 'lf-ground-right-2', x: 518, y: 368, rotation: 48, scale: 0.75, variant: 'young', delay: 2.1 },

    // Higher Level Leaves (Levels 6–10)
    { id: 'lf-ext-1', x: 315, y: 142, rotation: -50, scale: 1.1, variant: 'broad', delay: 2.2 },
    { id: 'lf-ext-2', x: 540, y: 180, rotation: 65, scale: 1.05, variant: 'folded', delay: 2.3 },
    { id: 'lf-ext-3', x: 458, y: 10, rotation: 20, scale: 0.85, variant: 'young', delay: 2.4 },
    { id: 'lf-ext-4', x: 195, y: 348, rotation: 30, scale: 0.95, variant: 'standard', delay: 2.5 },
    { id: 'lf-ext-5', x: 265, y: 310, rotation: -40, scale: 1.0, variant: 'standard', delay: 2.6 },
    { id: 'lf-ext-6', x: 456, y: 220, rotation: 50, scale: 0.9, variant: 'standard', delay: 2.7 },
    { id: 'lf-ext-7', x: 395, y: 140, rotation: -30, scale: 0.85, variant: 'young', delay: 2.8 },
  ];

  /*
    Curated Coiling Tendrils Traced from Approved Mockup
  */
  const tendrils = [
    // Tendril 0: Runner tip curl
    {
      id: 't-runner-tip',
      d: 'M 58 358 C 45 354, 38 344, 44 334 C 50 324, 62 330, 56 340 C 52 346, 44 342, 46 336',
      delay: 1.8,
    },
    // Tendril 1: Mid-climber curl left
    {
      id: 't-mid-left',
      d: 'M 416 218 C 402 214, 394 204, 400 194 C 406 184, 418 190, 412 200 C 408 206, 400 202, 402 196',
      delay: 1.4,
    },
    // Tendril 2: Mid-climber curl right
    {
      id: 't-mid-right',
      d: 'M 430 220 C 444 214, 454 200, 446 188 C 438 176, 424 184, 432 196',
      delay: 1.5,
    },
    // Tendril 3: Apex top spiral curl reaching the sky
    {
      id: 't-apex-spiral',
      d: 'M 434 40 C 438 24, 452 16, 446 4 C 440 -8, 424 -4, 430 8 C 434 16, 442 12, 440 6',
      delay: 2.0,
    },
    // Tendril 4: Right ground runner tip curl
    {
      id: 't-ground-right-tip',
      d: 'M 534 362 C 546 356, 554 344, 546 334 C 538 324, 526 332, 534 342',
      delay: 2.2,
    },
    // Tendrils 5–9 (Levels 6–10)
    {
      id: 't-ext-1',
      d: 'M 315 142 C 298 135, 290 120, 298 108 C 306 96, 320 104, 312 116',
      delay: 2.4,
    },
    {
      id: 't-ext-2',
      d: 'M 540 180 C 558 172, 568 158, 558 144 C 548 130, 532 140, 542 154',
      delay: 2.6,
    },
  ];

  return (
    <div className="valli-chedi" role="img" aria-label={`Valli Chedi growth level ${level}`}>
      <div className="valli-chedi__stage">
        {/* Floating ambient leaf petals around the plant */}
        <FloatingPetal top="22%" left="38%" delay={0.2} />
        <FloatingPetal top="38%" left="30%" delay={1.4} />
        <FloatingPetal top="15%" left="62%" delay={2.2} />

        <svg
          viewBox="0 0 580 410"
          className="valli-chedi__svg"
          preserveAspectRatio="xMidYMax meet"
        >
          {/* Earthy Layered Soil Mound */}
          <SoilMound />

          {/* 
            Main Succulent Climbing Trunk:
            Thick painted stem with dark green contour ink,
            sap green succulent body, and lighter green highlight stripe
          */}
          <g id="valli-main-trunk">
            {/* Dark green outline/shadow base */}
            <motion.path
              d="
                M 370 344
                C 367 305, 380 270, 407 230
                C 426 195, 432 160, 424 125
                C 418 95, 426 75, 430 50
              "
              fill="none"
              stroke="#2B4918"
              strokeWidth="9"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.6, ease: 'easeInOut' }}
            />

            {/* Fleshy green trunk body */}
            <motion.path
              d="
                M 370 344
                C 367 305, 380 270, 407 230
                C 426 195, 432 160, 424 125
                C 418 95, 426 75, 430 50
              "
              fill="none"
              stroke="#62953B"
              strokeWidth="6.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.6, ease: 'easeInOut' }}
            />

            {/* Fleshy inner bark shading line (gives 3D cylinder depth) */}
            <motion.path
              d="
                M 367 344
                C 364 305, 377 270, 404 230
                C 422 195, 428 160, 420 125
                C 415 95, 423 75, 427 50
              "
              fill="none"
              stroke="#385F22"
              strokeWidth="2.2"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.6, delay: 0.1, ease: 'easeInOut' }}
            />

            {/* Top highlight contour stripe */}
            <motion.path
              d="
                M 373 344
                C 370 305, 383 270, 410 230
                C 429 195, 435 160, 427 125
                C 422 95, 429 75, 433 50
              "
              fill="none"
              stroke="#88C056"
              strokeWidth="1.8"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.6, delay: 0.15, ease: 'easeInOut' }}
            />
          </g>

          {/* Dynamic Branches: slices down on cancellation, unfurls on growth */}
          <AnimatePresence>
            {branches.slice(0, config.branches).map((branch) => (
              <g key={branch.id}>
                {/* Dark outline */}
                <motion.path
                  d={branch.d}
                  fill="none"
                  stroke="#2B4918"
                  strokeWidth={branch.strokeWidth + 2.2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  exit={{ pathLength: 0, opacity: 0, transition: { duration: 0.35 } }}
                  transition={{
                    duration: 1.1,
                    delay: isInitialMount.current ? branch.delay : 0.05,
                    ease: 'easeInOut',
                  }}
                />
                {/* Green branch body */}
                <motion.path
                  d={branch.d}
                  fill="none"
                  stroke="#62953B"
                  strokeWidth={branch.strokeWidth}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  exit={{ pathLength: 0, opacity: 0, transition: { duration: 0.35 } }}
                  transition={{
                    duration: 1.1,
                    delay: isInitialMount.current ? branch.delay : 0.05,
                    ease: 'easeInOut',
                  }}
                />
              </g>
            ))}
          </AnimatePresence>

          {/* Dynamic Coiling Tendrils */}
          <AnimatePresence>
            {tendrils.slice(0, config.tendrils).map((tendril) => (
              <motion.path
                key={tendril.id}
                d={tendril.d}
                fill="none"
                stroke="#5A8E35"
                strokeWidth="2.2"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                exit={{ pathLength: 0, opacity: 0, transition: { duration: 0.35 } }}
                transition={{
                  duration: 1.3,
                  delay: isInitialMount.current ? tendril.delay : 0.05,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </AnimatePresence>

          {/* Dynamic Cordate Leaves: directly bound to growthLevel */}
          <AnimatePresence>
            {leaves.slice(0, config.leaves).map((leaf) => (
              <CordateLeaf
                key={leaf.id}
                {...leaf}
                isInitial={isInitialMount.current}
              />
            ))}
          </AnimatePresence>

          {/* Micro-growth leaflets dynamically appearing within current level percentage */}
          <AnimatePresence>
            {pct >= 25 && (
              <MicroLeaf
                key="pct-leaf-25"
                id="pct-leaf-25"
                x={275}
                y={305}
                rotation={-30}
                delay={0.2}
                isInitial={isInitialMount.current}
              />
            )}
            {pct >= 50 && (
              <MicroLeaf
                key="pct-leaf-50"
                id="pct-leaf-50"
                x={415}
                y={245}
                rotation={35}
                delay={0.3}
                isInitial={isInitialMount.current}
              />
            )}
            {pct >= 75 && (
              <MicroLeaf
                key="pct-leaf-75"
                id="pct-leaf-75"
                x={185}
                y={330}
                rotation={-25}
                delay={0.4}
                isInitial={isInitialMount.current}
              />
            )}
            {pct >= 90 && (
              <MicroLeaf
                key="pct-leaf-90"
                id="pct-leaf-90"
                x={432}
                y={80}
                rotation={20}
                delay={0.5}
                isInitial={isInitialMount.current}
              />
            )}
          </AnimatePresence>
        </svg>

        {/* Humorous parental consequence alert badge */}
        <div className="valli-chedi__consequence-badge">
          <span className="valli-chedi__consequence-icon">⚡</span>
          <span className="valli-chedi__consequence-text">
            {LEVEL_CONSEQUENCES[level] || LEVEL_CONSEQUENCES[5]}
          </span>
        </div>
      </div>
    </div>
  );
}
