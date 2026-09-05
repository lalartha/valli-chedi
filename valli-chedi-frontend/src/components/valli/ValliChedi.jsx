import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ValliChedi.css';

/**
 * ----------------------------------------------------------------------------
 * VALLI CHEDI — Stage Mapping
 * The backend is the source of truth for Valli points. This simply maps
 * the total consequences (valliCount) to the 10 visual stages.
 * ----------------------------------------------------------------------------
 */
function getValliStage(valliCount) {
  if (valliCount <= 0) return 1;
  if (valliCount <= 4) return 2;
  if (valliCount <= 8) return 3;
  if (valliCount <= 12) return 4;
  return 5;
}

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

export default function ValliChedi({
  valliCount = 0,
  growthLevel = 1,
  severity = 'SEED',
}) {
  const stage = getValliStage(valliCount);
  const imageSrc = `/valli/valli-${String(stage).padStart(2, '0')}.png`;
  
  const [prevStage, setPrevStage] = useState(stage);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    if (stage > prevStage) {
      // Detected growth! Show notification briefly
      setShowNotification(true);
      const timer = setTimeout(() => setShowNotification(false), 2500);
      setPrevStage(stage);
      return () => clearTimeout(timer);
    } else if (stage < prevStage) {
      // Shrank (e.g. debt resolved or activity deleted)
      setPrevStage(stage);
    }
  }, [stage, prevStage]);

  return (
    <div className="valli-chedi" role="img" aria-label={`Valli Chedi growth stage ${stage}`}>
      <div className="valli-chedi__stage-container">
        
        {/* Floating Notification */}
        <AnimatePresence>
          {showNotification && (
            <motion.div 
              className="valli-chedi__notification"
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: -20, scale: 1 }}
              exit={{ opacity: 0, y: -40, scale: 0.8 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              🌿 New growth detected!
            </motion.div>
          )}
        </AnimatePresence>

        {/* Plant Artwork Container */}
        <div className="valli-chedi__artwork-wrapper">
          <AnimatePresence>
            <motion.img
              key={stage}
              src={imageSrc}
              alt="Valli Chedi"
              className="valli-chedi__artwork"
              initial={{
                opacity: 0,
                scale: 0.96,
                y: 10
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                // Subtle organic breathing animation once settled
                rotate: [-0.3, 0.3, -0.3],
                transition: {
                  opacity: { duration: 1.2, ease: "easeOut" },
                  scale: { duration: 1.2, ease: "easeOut" },
                  y: { duration: 1.2, ease: "easeOut" },
                  rotate: { 
                    duration: 8, 
                    ease: "easeInOut", 
                    repeat: Infinity,
                    delay: 1.2 // wait for enter animation to finish
                  }
                }
              }}
              exit={{
                opacity: 0,
                transition: { duration: 1.2, ease: "easeOut" }
              }}
            />
          </AnimatePresence>
        </div>

        {/* Humorous parental consequence alert badge */}
        <div className="valli-chedi__consequence-badge">
          <span className="valli-chedi__consequence-icon">⚡</span>
          <span className="valli-chedi__consequence-text">
            {LEVEL_CONSEQUENCES[growthLevel] || LEVEL_CONSEQUENCES[5]}
          </span>
        </div>
      </div>
    </div>
  );
}
