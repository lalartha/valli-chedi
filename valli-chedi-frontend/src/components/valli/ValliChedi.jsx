import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VALLI_STAGE_QUOTES } from '../../utils/malayalamQuotes';
import './ValliChedi.css';

/**
 * ----------------------------------------------------------------------------
 * VALLI CHEDI — Stage Mapping
 * The backend is the source of truth for Valli points. This maps
 * the total consequences (valliCount) to the visual stages.
 * ----------------------------------------------------------------------------
 */
function getValliStage(score) {
  if (score <= 0) return 1;
  if (score < 15) return 3;
  if (score < 25) return 5;
  if (score < 50) return 7;
  if (score < 75) return 9;
  return 10;
}

export default function ValliChedi({
  valliCount = 0,
  growthLevel = 1,
  severity = 'SEED',
}) {
  const stage = getValliStage(valliCount);
  const imageSrc = `/valli/valli-${String(stage).padStart(2, '0')}.png`;
  const malayalamQuote = VALLI_STAGE_QUOTES[stage] || VALLI_STAGE_QUOTES[1];
  
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
                scale: [1, 1.04, 1],
                y: 0,
                rotate: [-2, 2, -2],
                skewX: [-1.5, 1.5, -1.5],
                transition: {
                  opacity: { duration: 1.2, ease: "easeOut" },
                  scale: { 
                    duration: 4,
                    ease: "easeInOut", 
                    repeat: Infinity,
                    delay: 1.2 
                  },
                  skewX: { 
                    duration: 5,
                    ease: "easeInOut", 
                    repeat: Infinity,
                    delay: 1.2 
                  },
                  y: { duration: 1.2, ease: "easeOut" },
                  rotate: { 
                    duration: 6,
                    ease: "easeInOut", 
                    repeat: Infinity,
                    delay: 1.2 
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

        {/* Malayalam Parental Punchline Dialogue */}
        <div className="valli-chedi__malayalam-quote">
          <span className="valli-chedi__malayalam-icon">💬</span>
          <span className="valli-chedi__malayalam-text">
            "{malayalamQuote}"
          </span>
        </div>
      </div>
    </div>
  );
}
