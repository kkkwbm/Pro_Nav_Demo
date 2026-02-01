import React from 'react';
import { BarChart3 } from 'lucide-react';

const PlannedSmsStatistics = ({ statistics }) => {
  if (!statistics) return null;

  return (
    <div className="stats-card">
      <div className="stats-header">
        <h3>Statystyki</h3>
        <BarChart3 size={20} color="#6b7280" />
      </div>
      <div className="stats-grid">
        <div className="stat-item">
          <div className="stat-value scheduled">{statistics.scheduled}</div>
          <div className="stat-label">Zaplanowane</div>
        </div>
        <div className="stat-item">
          <div className="stat-value pending">{statistics.pending}</div>
          <div className="stat-label">Oczekujące</div>
        </div>
        <div className="stat-item">
          <div className="stat-value sent">{statistics.sent}</div>
          <div className="stat-label">Wysłane</div>
        </div>
        <div className="stat-item">
          <div className="stat-value failed">{statistics.failed}</div>
          <div className="stat-label">Nieudane</div>
        </div>
        <div className="stat-item">
          <div className="stat-value today">{statistics.scheduledToday}</div>
          <div className="stat-label">Dzisiaj</div>
        </div>
      </div>

      <style>{`
        .stats-card {
          background-color: white;
          border-radius: 6px;
          padding: 20px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          border: 1px solid #f3f4f6;
          margin-bottom: 24px;
        }

        .stats-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .stats-header h3 {
          font-size: 18px;
          font-weight: 600;
          color: #111827;
          margin: 0;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 16px;
        }

        .stat-item {
          text-align: center;
        }

        .stat-value {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 4px;
        }

        .stat-value.scheduled {
          color: #e67e22;
        }

        .stat-value.pending {
          color: #f59e0b;
        }

        .stat-value.sent {
          color: #22c55e;
        }

        .stat-value.failed {
          color: #c0392b;
        }

        .stat-value.today {
          color: #06b6d4;
        }

        .stat-label {
          font-size: 14px;
          color: #6b7280;
        }
      `}</style>
    </div>
  );
};

export default PlannedSmsStatistics;