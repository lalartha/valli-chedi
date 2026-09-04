import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Home, Phone, BookOpen, Car } from 'lucide-react';
import Button from '../common/Button';
import './ConsequenceSummaryModal.css';

const ICON_MAP = {
  home: <Home size={16} />,
  communication: <Phone size={16} />,
  college: <BookOpen size={16} />,
  travel: <Car size={16} />,
  default: <Leaf size={16} />
};

export default function ConsequenceSummaryModal({ data, onClose }) {
  if (!data) return null;

  const { activity, vallisCreated, homeImpact, valliAdded } = data;

  return (
    <div className="modal-overlay">
      <motion.div 
        className="summary-modal"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
      >
        <div className="summary-modal__header">
          <Leaf className="summary-icon" size={24} />
          <h3>VALLI ADDED</h3>
        </div>

        <div className="summary-modal__activity">
          <h4>{activity.title}</h4>
          {activity.location && <span>{activity.location}</span>}
          <div className="valli-badge">+{valliAdded} Valli</div>
        </div>

        <div className="summary-section">
          <h5>WHY?</h5>
          <ul className="why-list">
            {vallisCreated.map((v, i) => (
              <li key={i}>
                <span>{v.title || v.category}</span>
                <span className="why-points">+{v.growthPoints || v.rawScore || 5}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="summary-section">
          <h5>WHAT THIS MEANS</h5>
          
          <div className="impact-card">
            <div className="impact-card__header">
              <Home size={16} />
              <span>Home</span>
            </div>
            <p className="impact-message">{homeImpact?.messages?.[0] || "Achan might notice."}</p>
          </div>
          
          {vallisCreated.some(v => v.category === 'OVERNIGHT') && (
            <div className="impact-card">
              <div className="impact-card__header">
                <Phone size={16} />
                <span>Communication</span>
              </div>
              <p className="impact-message">Achan check-in required.</p>
            </div>
          )}

          {vallisCreated.some(v => v.category === 'TRAVEL') && (
            <div className="impact-card">
              <div className="impact-card__header">
                <Car size={16} />
                <span>Travel</span>
              </div>
              <p className="impact-message">That's a long way from home.</p>
            </div>
          )}
        </div>

        <div className="summary-footer">
          <p className="summary-punchline">
            One activity. {vallisCreated.length} consequences. Classic.
          </p>
          <Button onClick={onClose} className="w-full">
            Understood
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
