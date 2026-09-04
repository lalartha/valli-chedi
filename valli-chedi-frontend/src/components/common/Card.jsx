import './Card.css';

export default function Card({
  children,
  className = '',
  padding = 'md',
  hover = false,
  ...props
}) {
  return (
    <div
      className={`card card--pad-${padding} ${hover ? 'card--hover' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return <div className={`card__header ${className}`}>{children}</div>;
}

export function CardTitle({ children, icon, className = '' }) {
  return (
    <h3 className={`card__title ${className}`}>
      {icon && <span className="card__title-icon">{icon}</span>}
      {children}
    </h3>
  );
}
