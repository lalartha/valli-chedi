import Card, { CardTitle } from '../common/Card';
import './GrowthLevel.css';

const LEVEL_LABELS = {
  1: 'Seed',
  2: 'Sprout',
  3: 'Small Vine',
  4: 'Growing',
  5: 'Growing',
  6: 'Overgrown',
  7: 'Takeover',
};

const LEVEL_DESCRIPTIONS = {
  1: 'A tiny seed. The chedi barely exists.',
  2: 'A sprout emerges. The consequences have begun.',
  3: 'A small vine. It\'s growing steadily.',
  4: 'Multiple branches reaching out.',
  5: 'The vine is spreading nicely.',
  6: 'The chedi has taken notice.',
  7: 'VALLI CHEDI HAS ESCAPED CONTROL.',
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
        <p>It's not the work.<br/>It's everything that comes with it. 😅</p>
      </div>
    </Card>
  );
}
