import './Loading.css';

export default function Loading({ message = 'Growing the chedi...' }) {
  return (
    <div className="loading" role="status">
      <div className="loading__plant">
        <span className="loading__leaf">🌱</span>
      </div>
      <p className="loading__text">{message}</p>
    </div>
  );
}
