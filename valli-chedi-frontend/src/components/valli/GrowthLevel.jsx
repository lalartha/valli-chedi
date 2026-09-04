import Card, { CardTitle } from '../common/Card';
import './GrowthLevel.css';

const LEVEL_DESCRIPTIONS = {
  1: 'A tiny seed. Parents think you are peacefully studying.',
  2: 'Sprout. Achan heard your scooter engine after 10 PM.',
  3: 'Small vine. Amma has initiated preliminary interrogation.',
  4: "'Sit in the hall': The dreaded serious talk has commenced.",
  5: 'Danger Zone: Achan threatened to kick you out of the house.',
  6: 'High-voltage family dispute: emotional speeches & luggage packed.',
  7: 'Uncontained: You have been officially expelled from the house.',
};

const MILESTONE_LEVELS = [
  { level: 1, label: 'Seed' },
  { level: 3, label: 'Sprout' },
  { level: 5, label: 'Growing' },
  { level: 7, label: 'Overgrown' },
];

export default function GrowthLevel({ growthLevel = 1, growthPercentage = 0 }) {
  const description = LEVEL_DESCRIPTIONS[growthLevel] || LEVEL_DESCRIPTIONS[1];

  return (
    <Card className="growth-level">
      <CardTitle icon="🌿">Valli Chedi Growth</CardTitle>

      <div className="growth-level__current">
        <span className="growth-level__number">Level {growthLevel}</span>
        <span className="growth-level__description">{description}</span>
      </div>

      {/* Progress bar */}
      <div className="growth-level__progress">
        <div className="growth-level__bar">
          <div
            className="growth-level__fill"
            style={{ width: `${growthPercentage}%` }}
            role="progressbar"
            aria-valuenow={growthPercentage}
            aria-valuemin={0}
            aria-valuemax={100}
          />
          <div
            className="growth-level__dot"
            style={{ left: `${growthPercentage}%` }}
          />
        </div>
        <span className="growth-level__pct">{growthPercentage}%</span>
      </div>

      {/* Level milestones */}
      <div className="growth-level__milestones">
        {MILESTONE_LEVELS.map(({ level, label }) => (
          <div
            key={level}
            className={`growth-level__milestone ${growthLevel >= level ? 'growth-level__milestone--reached' : ''} ${growthLevel === level ? 'growth-level__milestone--current' : ''}`}
          >
            <div className="growth-level__milestone-dot">
              {growthLevel === level ? (
                <span className="growth-level__milestone-active">{level}</span>
              ) : (
                <span>{level}</span>
              )}
            </div>
            <span className="growth-level__milestone-label">{label}</span>
          </div>
        ))}
      </div>

      {/* Wisdom quote */}
      <div className="growth-level__wisdom">
        <p>You can handle the work.<br/>Can you handle what comes after? 😅</p>
      </div>
    </Card>
  );
}
