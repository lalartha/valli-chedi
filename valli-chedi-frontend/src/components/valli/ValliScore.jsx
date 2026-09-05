import Card, { CardTitle } from '../common/Card';
import { ACHAN_SCORE_REMARK } from '../../utils/malayalamQuotes';
import './ValliScore.css';

const SEVERITY_LABELS = {
  SEED: 'Seed',
  SPROUT: 'Sprout',
  SMALL_VINE: 'Average',
  GROWING_CHEDI: 'Growing',
  OVERGROWN: 'Overgrown',
  VALLI_TAKEOVER: 'Takeover',
  UNCONTAINED: 'Uncontained',
};

// High-stakes humorous consequences reflecting strict Kerala / Indian parental reactions
const SEVERITY_COPY = {
  SEED: "Suspiciously peaceful.\nParents haven't checked your whereabouts yet.",
  SPROUT: "Achan noticed you came home after 10 PM.\nEyebrow slightly raised.",
  SMALL_VINE: "Not out of control yet.\nBut it wants to be.",
  GROWING_CHEDI: "The Talk is scheduled:\n'Sit in the hall. We need to talk about your future.'",
  OVERGROWN: "Pack your bags warning:\n'Keep this up and you can live on the street!' Serious dispute.",
  VALLI_TAKEOVER: "Imminent Eviction:\nAmma is crying, Achan is pacing, bags placed by the door.",
  UNCONTAINED: "Officially kicked out of the house.\nYou are now an NRI on your own verandah.",
};

const SEVERITY_SUBTEXT = {
  SEED: 'Status: Under the radar',
  SPROUT: 'Status: Mild suspicion',
  SMALL_VINE: 'Status: Preliminary questioning',
  GROWING_CHEDI: 'Status: Spectacles removed (Danger zone)',
  OVERGROWN: 'Status: Domestic dispute pending',
  VALLI_TAKEOVER: 'Status: Relatives WhatsApp group mobilized',
  UNCONTAINED: 'Status: Disowned & homeless',
};

export default function ValliScore({ totalPoints = 0, severity = 'SEED', maxPoints = 100 }) {
  const label = SEVERITY_LABELS[severity] || 'Average';
  const copy = SEVERITY_COPY[severity] || 'Not out of control yet.\nBut it wants to be.';
  const subtext = SEVERITY_SUBTEXT[severity] || 'Status: Consequence pending';

  return (
    <Card className="valli-score">
      <CardTitle>VALLI SCORE</CardTitle>

      <div className="valli-score__number">
        <span className="valli-score__value">{totalPoints}</span>
        <span className="valli-score__max">/ {maxPoints}</span>
      </div>

      <div className="valli-score__severity">
        <span className="valli-score__badge">
          🌿 {label.toUpperCase()}
        </span>
      </div>

      <p className="valli-score__copy">{copy}</p>

      {/* Achan's verdict on the score */}
      <div className="valli-score__achan-remark">
        <div className="valli-score__achan-header">
          <span className="valli-score__achan-tag">👨‍🦳 Achan's Verdict</span>
        </div>
        <p className="valli-score__achan-quote">"{ACHAN_SCORE_REMARK}"</p>
      </div>

      {/* Decorative terracotta curved accent stroke matching reference mockup */}
      <div className="valli-score__accent-stroke" aria-hidden="true">
        <svg width="48" height="8" viewBox="0 0 48 8" fill="none">
          <path
            d="M 2 4 C 12 1, 24 7, 36 3 C 40 1.5, 44 2.5, 46 3"
            stroke="#965236"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="valli-score__consequence-status">
        <span className="valli-score__status-tag">{subtext}</span>
      </div>
    </Card>
  );
}
