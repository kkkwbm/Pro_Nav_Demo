import React from 'react';

const MonthlyChart = ({ data, formatCurrency }) => {
  const maxRevenue = Math.max(...data.map(d => d.revenue || 0));

  return (
    <div className="chart-container">
      <div className="chart-bars">
        {data.map((month, index) => (
          <div key={index} className="chart-bar-wrapper">
            <div
              className="chart-bar"
              style={{
                height: `${month.revenue ? (month.revenue / maxRevenue) * 100 : 0}%`,
                background: 'linear-gradient(180deg, #e67e22 0%, #2563eb 100%)'
              }}
            >
              <span className="chart-bar-value">{formatCurrency(month.revenue)}</span>
            </div>
            <div className="chart-bar-label">{month.monthName?.substring(0, 3)}</div>
            <div className="chart-bar-services">{month.totalServices} usług</div>
          </div>
        ))}
      </div>

      <style>{`
        .chart-container {
          height: 300px;
        }

        .chart-bars {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          height: 250px;
          gap: 8px;
        }

        .chart-bar-wrapper {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          height: 100%;
          justify-content: flex-end;
        }

        .chart-bar {
          width: 100%;
          border-radius: 4px 4px 0 0;
          position: relative;
          min-height: 4px;
          display: flex;
          align-items: flex-start;
          justify-content: center;
        }

        .chart-bar-value {
          font-size: 10px;
          color: white;
          padding: 4px;
          white-space: nowrap;
        }

        .chart-bar-label {
          font-size: 12px;
          color: #6b7280;
          margin-top: 8px;
        }

        .chart-bar-services {
          font-size: 10px;
          color: #9ca3af;
        }
      `}</style>
    </div>
  );
};

export default MonthlyChart;