import React from 'react';
import { TrendingUp } from 'lucide-react';

const StatCard = ({ icon: Icon, title, value, color, description, trend }) => (
  <div className="stat-card">
    <div className="stat-icon" style={{ background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)` }}>
      <Icon size={24} color="white" />
    </div>
    <div className="stat-value">{value}</div>
    <div className="stat-title">{title}</div>
    <div className="stat-description">{description}</div>
    {trend && (
      <div className="stat-trend" style={{ color: trend > 0 ? '#27ae60' : '#c0392b' }}>
        <TrendingUp size={16} />
        <span>{trend > 0 ? '+' : ''}{trend}%</span>
      </div>
    )}

    <style>{`
      .stat-card {
        background-color: white;
        border-radius: 6px;
        padding: 20px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        border: 1px solid #f3f4f6;
        text-align: center;
        position: relative;
      }

      .stat-icon {
        width: 48px;
        height: 48px;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 16px;
      }

      .stat-value {
        font-size: 28px;
        font-weight: 700;
        color: #111827;
        margin-bottom: 4px;
      }

      .stat-title {
        font-size: 14px;
        font-weight: 600;
        color: #111827;
        margin-bottom: 4px;
      }

      .stat-description {
        font-size: 12px;
        color: #6b7280;
      }

      .stat-trend {
        position: absolute;
        top: 20px;
        right: 20px;
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 12px;
        font-weight: 600;
      }
    `}</style>
  </div>
);

export default StatCard;