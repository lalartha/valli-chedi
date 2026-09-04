import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Leaf } from 'lucide-react';
import Button from '../common/Button';
import './ConsequenceWarningDialog.css';

export default function ConsequenceWarningDialog({ preview, onConfirm, onCancel }) {
  const { warning, consequences, valliAdded } = preview;
  
  if (!warning || !warning.required) return null;

  return (
    <div className="modal-overlay">
      <motion.div 
        className={`warning-dialog ${warning.intensity === 'EXTREME' ? 'warning-dialog--extreme' : ''}`}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <div className="warning-dialog__header">
          {warning.intensity === 'EXTREME' ? (
            <AlertTriangle className="warning-icon extreme" size={32} />
          ) : (
            <Leaf className="warning-icon" size={24} />
          )}
          <h3>{warning.title}</h3>
        </div>
        
        <div className="warning-dialog__content">
          <p className="warning-message">{warning.message}</p>
          
          <div className="warning-preview">
            <h4>WHAT THIS ACTIVITY MIGHT CREATE</h4>
            <div className="valli-score-preview">
              🌿 +{valliAdded} Valli
            </div>
            
            <ul className="consequence-list">
              {consequences.map((c, i) => (
                <li key={i}>
                  <span className="consequence-label">{c.label}</span>
                  <span className="consequence-points">+{c.points}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="warning-dialog__actions">
          <Button variant="outline" onClick={onCancel}>
            {warning.intensity === 'EXTREME' ? 'LET ME THINK' : 'Maybe I should think about it'}
          </Button>
          <Button variant={warning.intensity === 'EXTREME' ? 'danger' : 'primary'} onClick={onConfirm}>
            {warning.intensity === 'EXTREME' ? "I'M DOING IT" : "Yeah, it's necessary"}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
