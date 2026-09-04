import { Shield, FileText, Clock, MapPin, Phone, Home as HomeIcon, AlertTriangle } from 'lucide-react';
import Header from '../components/layout/Header';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Loading from '../components/common/Loading';
import EmptyState from '../components/common/EmptyState';
import { useVallis } from '../hooks/useVallis';
import './ValliChainPage.css';

const CATEGORY_ICONS = {
  PERMISSION: Shield,
  RESPONSIBILITY: FileText,
  TIME_COLLISION: Clock,
  TRAVEL: MapPin,
  COMMUNICATION: Phone,
  HOME: HomeIcon,
  OVERNIGHT: AlertTriangle,
};

function getSeverityVariant(severity) {
  if (severity >= 8) return 'danger';
  if (severity >= 5) return 'warning';
  return 'default';
}

export default function ValliChainPage() {
  const { data, isLoading } = useVallis();

  if (isLoading) return <Loading />;

  const vallis = data?.vallis || [];

  // Group vallis by activity
  const grouped = {};
  vallis.forEach(v => {
    const key = v.activity_id || 'standalone';
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(v);
  });

  return (
    <div className="valli-chain-page">
      <Header title="Valli Chain" subtitle="Trace the consequences." />

      {vallis.length === 0 ? (
        <EmptyState
          icon="🔗"
          title="No chains yet"
          message="When consequences emerge, they'll appear here as connected chains."
        />
      ) : (
        <div className="valli-chain-page__chains">
          {Object.entries(grouped).map(([activityId, chainVallis]) => (
            <Card key={activityId} className="chain-group" padding="md">
              <div className="chain-group__timeline">
                {chainVallis.map((valli, index) => {
                  const Icon = CATEGORY_ICONS[valli.category] || FileText;
                  return (
                    <div key={valli.id} className="chain-node">
                      <div className="chain-node__connector">
                        <div className={`chain-node__dot ${valli.status === 'RESOLVED' ? 'chain-node__dot--resolved' : ''}`}>
                          <Icon size={14} />
                        </div>
                        {index < chainVallis.length - 1 && (
                          <div className="chain-node__line" />
                        )}
                      </div>
                      <div className="chain-node__content">
                        <div className="chain-node__header">
                          <h4 className="chain-node__title">{valli.title}</h4>
                          <span className="chain-node__points">+{valli.growth_points} pts</span>
                        </div>
                        <div className="chain-node__meta">
                          <Badge variant={getSeverityVariant(valli.severity)}>
                            {valli.category?.replace('_', ' ')}
                          </Badge>
                          <Badge variant={valli.status === 'RESOLVED' ? 'success' : 'warning'}>
                            {valli.status}
                          </Badge>
                        </div>
                        {valli.description && (
                          <p className="chain-node__description">{valli.description}</p>
                        )}
                        <span className="chain-node__time">
                          {new Date(valli.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
