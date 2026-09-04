import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Shield, Clock, MapPin, Phone, Home as HomeIcon, AlertTriangle, Zap, Scissors } from 'lucide-react';
import Card, { CardHeader, CardTitle } from '../common/Card';
import { useResolveValli } from '../../hooks/useVallis';
import './ValliList.css';

const CATEGORY_ICONS = {
  PERMISSION: Shield,
  RESPONSIBILITY: FileText,
  TIME_COLLISION: Clock,
  TRAVEL: MapPin,
  COMMUNICATION: Phone,
  HOME: HomeIcon,
  OVERNIGHT: AlertTriangle,
  COLLEGE: FileText,
  NSS: Zap,
  FAMILY: HomeIcon,
  PERSONAL: FileText,
  NOTICE_PERIOD: Clock,
  OTHER: FileText,
};

const CATEGORY_LABELS = {
  PERMISSION: 'Permission Valli',
  RESPONSIBILITY: 'Responsibility Valli',
  TIME_COLLISION: 'Time Collision Valli',
  TRAVEL: 'Travel Valli',
  COMMUNICATION: 'Communication Valli',
  HOME: 'Home Valli',
  OVERNIGHT: 'Overnight Valli',
  COLLEGE: 'College Valli',
  NSS: 'NSS Valli',
  FAMILY: 'Family Valli',
  PERSONAL: 'Personal Valli',
  NOTICE_PERIOD: 'Notice Period Valli',
  OTHER: 'Valli',
};

function timeAgo(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const diff = Math.floor((now - date) / 1000);

  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)} day${Math.floor(diff / 86400) > 1 ? 's' : ''} ago`;
}

export default function ValliList({ vallis = [], totalCount = 0 }) {
  const navigate = useNavigate();
  const resolveMutation = useResolveValli();
  const [cancellingId, setCancellingId] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const displayVallis = vallis.slice(0, 5);
  const remaining = totalCount - displayVallis.length;

  const handleCancelValli = async (valli) => {
    try {
      setCancellingId(valli.id);
      await resolveMutation.mutateAsync(valli.id);
      setFeedback({
        title: valli.title,
        points: valli.growth_points || 0,
      });
      setTimeout(() => setFeedback(null), 4000);
    } catch (err) {
      console.error('Failed to cancel valli:', err);
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <Card className="valli-list" padding="md">
      <CardHeader>
        <CardTitle>Active Vallis ({totalCount})</CardTitle>
        {totalCount > 5 && (
          <button
            className="valli-list__view-all"
            onClick={() => navigate('/valli-chain')}
          >
            View all →
          </button>
        )}
      </CardHeader>

      {/* Cancellation confirmation banner */}
      {feedback && (
        <div className="valli-list__feedback">
          <span>✂️ Cancelled "{feedback.title}" (-{feedback.points} pts). The chedi has shrunk!</span>
        </div>
      )}

      {displayVallis.length === 0 ? (
        <div className="valli-list__empty">
          <p>No vallis active.<br/>Enjoy the peace while it lasts. 🌿</p>
        </div>
      ) : (
        <div className="valli-list__items">
          {displayVallis.map((valli) => {
            const Icon = CATEGORY_ICONS[valli.category] || FileText;
            const isCancelling = cancellingId === valli.id;

            return (
              <div key={valli.id} className="valli-list__item">
                <div className="valli-list__icon">
                  <Icon size={16} strokeWidth={2} />
                </div>
                <div className="valli-list__info">
                  <span className="valli-list__title">{valli.title}</span>
                  <span className="valli-list__category">
                    {CATEGORY_LABELS[valli.category] || 'Valli'}
                  </span>
                </div>
                <div className="valli-list__meta">
                  <span className="valli-list__points">+{valli.growth_points || 0} pts</span>
                  <span className="valli-list__time">
                    {valli.created_at ? timeAgo(valli.created_at) : ''}
                  </span>
                </div>
                <div className="valli-list__action">
                  <button
                    className="valli-list__cancel-btn"
                    onClick={() => handleCancelValli(valli)}
                    disabled={isCancelling}
                    title="Cancel this Valli, deduct points & shrink plant"
                  >
                    <Scissors size={13} />
                    <span>{isCancelling ? 'Pruning...' : 'Cancel'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {remaining > 0 && (
        <button
          className="valli-list__more"
          onClick={() => navigate('/valli-chain')}
        >
          ...and {remaining} more vallis
        </button>
      )}
    </Card>
  );
}
