import React from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import { useHomeDebt, useResolveDebt } from '../../hooks/useHomeDebt';
import './ValliDebt.css';

export default function ValliDebt() {
  const { data, isLoading } = useHomeDebt({ status: 'PENDING' });
  const resolveMutation = useResolveDebt();

  if (isLoading || !data) return null;

  const { pendingCount, pendingPoints, debts } = data;

  if (pendingCount === 0) {
    return (
      <Card className="valli-debt-card empty" padding="md">
        <h4>VALLI DEBT</h4>
        <p>You owe the house nothing... for now.</p>
      </Card>
    );
  }

  const handleResolve = (id) => {
    resolveMutation.mutate(id);
  };

  return (
    <Card className="valli-debt-card" padding="md">
      <div className="valli-debt-card__header">
        <h4>VALLI DEBT</h4>
        <div className="debt-score">🌿 {pendingPoints}</div>
      </div>
      <p className="debt-subtitle">You owe the house {pendingPoints} Valli.</p>
      
      <ul className="debt-list">
        {debts.map(debt => (
          <li key={debt.id} className="debt-item">
            <div className="debt-info">
              <span className="debt-reason">{debt.reason}</span>
              <span className="debt-points">+{debt.points} Valli</span>
            </div>
            <Button size="sm" variant="outline" onClick={() => handleResolve(debt.id)} loading={resolveMutation.isPending}>
              Resolve
            </Button>
          </li>
        ))}
      </ul>
      <p className="debt-footer">Do some household chores to recover.</p>
    </Card>
  );
}
