import React from 'react';

const SmsStatsCard = ({ smsStats, formatCurrency }) => {
  if (!smsStats) return null;

  return (
    <div className="report-card">
      <h3>Statystyki SMS</h3>
      <div className="report-content">
        <div className="metric-row">
          <span>Wysłane SMS-y</span>
          <strong>{smsStats.totalSent}</strong>
        </div>
        <div className="metric-row">
          <span>Wskaźnik sukcesu</span>
          <strong className="success-text">
            {smsStats.successRate?.toFixed(1)}%
          </strong>
        </div>
        <div className="metric-row">
          <span>Przypomnienia</span>
          <strong>{smsStats.remindersSent}</strong>
        </div>
        <div className="metric-row">
          <span>Szacowany koszt</span>
          <strong>{formatCurrency(smsStats.estimatedCost)}</strong>
        </div>
      </div>

      <style>{`
        .report-card {
          background-color: white;
          border-radius: 6px;
          padding: 24px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          border: 1px solid #f3f4f6;
        }

        .report-card h3 {
          font-size: 18px;
          font-weight: 700;
          color: #111827;
          margin-bottom: 20px;
        }

        .report-content {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .metric-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 14px;
          color: #6b7280;
        }

        .metric-row strong {
          font-size: 16px;
          font-weight: 600;
          color: #111827;
        }

        .success-text {
          color: #22c55e !important;
        }
      `}</style>
    </div>
  );
};

export default SmsStatsCard;