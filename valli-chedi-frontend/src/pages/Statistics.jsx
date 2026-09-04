import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Header from '../components/layout/Header';
import Card, { CardTitle } from '../components/common/Card';
import Loading from '../components/common/Loading';
import { useValliState } from '../hooks/useValliState';
import { useVallis } from '../hooks/useVallis';
import './Statistics.css';

export default function Statistics() {
  const { data: state, isLoading: stateLoading } = useValliState();
  const { data: vallisData, isLoading: vallisLoading } = useVallis();

  if (stateLoading || vallisLoading) return <Loading />;

  const valliState = state || {};
  const vallis = vallisData?.vallis || [];

  // Calculate category distribution
  const categoryCount = {};
  vallis.forEach(v => {
    const cat = v.category || 'OTHER';
    categoryCount[cat] = (categoryCount[cat] || 0) + 1;
  });

  const mostCommon = Object.entries(categoryCount)
    .sort((a, b) => b[1] - a[1])[0];

  // Prepare chart data
  const chartData = Object.entries(categoryCount)
    .map(([category, count]) => ({
      name: category.replace('_', ' '),
      vallis: count,
    }))
    .sort((a, b) => b.vallis - a.vallis)
    .slice(0, 7);

  const stats = [
    { label: 'Total Vallis', value: valliState.totalVallis || 0 },
    { label: 'Growth Points', value: valliState.growthPoints || valliState.totalPoints || 0 },
    { label: 'Active', value: valliState.activeVallis || 0 },
    { label: 'Resolved', value: valliState.resolvedVallis || 0 },
  ];

  return (
    <div className="stats-page">
      <Header title="Statistics" subtitle="The numbers don't lie." />

      {/* Key stats */}
      <div className="stats-page__grid">
        {stats.map(({ label, value }) => (
          <Card key={label} className="stat-card" padding="md">
            <span className="stat-card__value">{value}</span>
            <span className="stat-card__label">{label}</span>
          </Card>
        ))}
      </div>

      {/* Highlights */}
      <div className="stats-page__highlights">
        <Card padding="md">
          <CardTitle>Insights</CardTitle>
          <div className="stats-page__insight-list">
            {mostCommon && (
              <div className="insight-row">
                <span className="insight-label">Most common Valli</span>
                <span className="insight-value">{mostCommon[0].replace('_', ' ')}</span>
              </div>
            )}
            <div className="insight-row">
              <span className="insight-label">Growth Level</span>
              <span className="insight-value">Level {valliState.growthLevel || 1}</span>
            </div>
            <div className="insight-row">
              <span className="insight-label">Severity</span>
              <span className="insight-value">{valliState.severity || 'SEED'}</span>
            </div>
            {valliState.activeReminders > 0 && (
              <div className="insight-row">
                <span className="insight-label">Active Reminders</span>
                <span className="insight-value">{valliState.activeReminders}</span>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <Card className="stats-page__chart" padding="md">
          <CardTitle>Vallis by Category</CardTitle>
          <div className="stats-page__chart-container">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData} margin={{ top: 10, right: 10, bottom: 20, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
                  axisLine={{ stroke: 'var(--border)' }}
                  angle={-30}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
                  axisLine={{ stroke: 'var(--border)' }}
                />
                <Tooltip
                  contentStyle={{
                    background: 'var(--white)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    fontSize: '13px',
                  }}
                />
                <Bar
                  dataKey="vallis"
                  fill="var(--sap-green)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}
    </div>
  );
}
