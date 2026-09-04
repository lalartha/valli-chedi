import { Pen } from 'lucide-react';
import './WisdomBar.css';

const WISDOM = [
  'Plan early. Inform early. Survive peacefully.',
  'Or enjoy the jungle. Your choice. 🌿',
  'You can handle the work. Can you handle what comes after?',
  'One responsibility at a time, they said. They lied.',
  'The chedi grows whether you plan or not.',
  'Permission is a process. Consequences are immediate.',
  'Today\'s problem is yesterday\'s "I\'ll tell them tomorrow."',
  'The vine remembers. Even if you forget.',
];

export default function WisdomBar() {
  const wisdom = WISDOM[Math.floor(Math.random() * WISDOM.length)];

  return (
    <div className="wisdom-bar">
      <div className="wisdom-bar__content">
        <span className="wisdom-bar__badge">
          🌿 TODAY'S VALLI WISDOM
        </span>
        <p className="wisdom-bar__text">{wisdom}</p>
      </div>
      <button className="wisdom-bar__edit" aria-label="Edit wisdom">
        <Pen size={14} />
      </button>
    </div>
  );
}
