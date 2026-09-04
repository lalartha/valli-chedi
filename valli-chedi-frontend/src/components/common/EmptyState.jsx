import './EmptyState.css';
import Button from './Button';

export default function EmptyState({
  icon = '🌱',
  title,
  message,
  action,
  onAction,
}) {
  return (
    <div className="empty-state">
      <span className="empty-state__icon">{icon}</span>
      {title && <h3 className="empty-state__title">{title}</h3>}
      <p className="empty-state__message">{message}</p>
      {action && onAction && (
        <Button variant="secondary" onClick={onAction}>
          {action}
        </Button>
      )}
    </div>
  );
}
