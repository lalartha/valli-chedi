import Card, { CardTitle } from '../common/Card';
import './ValliScore.css';

const SEVERITY_LABELS = {
  SEED: 'Seed',
  SPROUT: 'Sprout',
  SMALL_VINE: 'Small Vine',
  GROWING_CHEDI: 'Growing',
  OVERGROWN: 'Overgrown',
  VALLI_TAKEOVER: 'Takeover',
  UNCONTAINED: 'Uncontained',
};

const SEVERITY_COPY = {
  SEED: "You're doing fine. Suspiciously fine.",
  SPROUT: 'A sprout has appeared. Proceed with caution.',
  SMALL_VINE: 'Not out of control yet.\nBut it wants to be.',
  GROWING_CHEDI: 'The vine has noticed your calendar.',
  OVERGROWN: 'Your valli chedi is growing...\nslowly but surely 😅',
  VALLI_TAKEOVER: 'This is no longer a plant.\nThis is a situation.',
  UNCONTAINED: 'The chedi has exceeded\nreasonable limits.',
};

export default function ValliScore({ totalPoints = 0, severity = 'SEED', maxPoints = 1000 }) {
  const label = SEVERITY_LABELS[severity] || 'Unknown';
  const copy = SEVERITY_COPY[severity] || "Something is growing.";

  return (
    <Card className="valli-score">
      <CardTitle>Valli Score</CardTitle>

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
    </Card>
  );
}
