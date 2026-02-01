import React from 'react';
import {
  Users,
  Calendar,
  CheckCircle,
  Clock,
  Wrench,
  DollarSign,
  ArrowLeft,
  RefreshCw,
  AlertTriangle,
  Flame,
  Wind,
  Thermometer,
  Droplets,
  TrendingUp,
  Award
} from 'lucide-react';
import { useReportsData } from '../../hooks/useReportsData';
import StatCard from '../../components/reports/StatCard';
import MonthlyChart from '../../components/reports/MonthlyChart';
import SmsStatsCard from '../../components/reports/SmsStatsCard';
import { mockReportsData, mockClients } from '../../demo/mockData';

const ReportsPage = () => {
  const { data, loading, refreshing, error, refreshData } = useReportsData();

  const handleRefresh = async () => {
    await refreshData();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN'
    }).format(amount || 0);
  };

  const formatDateTime = (datetime) => {
    if (!datetime) return 'N/A';
    return new Date(datetime).toLocaleString('pl-PL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (datetime) => {
    if (!datetime) return 'N/A';
    const date = new Date(datetime);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} dni temu`;
    if (hours > 0) return `${hours} godzin temu`;
    if (minutes > 0) return `${minutes} minut temu`;
    return 'Przed chwilą';
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
        <div className="loading-text">Ładowanie statystyk...</div>
      </div>
    );
  }

  return (
    <div className="reports-page">
      <div className="container">
        {/* Header */}
        <div className="header">
          <button className="back-button" onClick={() => window.location.href = '/dashboard'}>
            <ArrowLeft size={16} />
            Powrót do Dashboard
          </button>
          <div className="header-content">
            <h1 className="title">Raporty i Statystyki</h1>
            <p className="subtitle">Analizuj dane biznesowe i wydajność systemu</p>
          </div>
          <button
            className="refresh-button"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw size={16} className={refreshing ? 'spinning' : ''} />
            {refreshing ? 'Odświeżanie...' : 'Odśwież'}
          </button>
        </div>

        {error && (
          <div className="error-banner">
            <AlertTriangle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* Quick Stats */}
        <div className="stats-grid">
          <StatCard
            icon={Users}
            title="Łączna liczba klientów"
            value={data.stats.totalClients}
            color="#e67e22"
            description="Zarejestrowani klienci"
          />
          <StatCard
            icon={Wrench}
            title="Urządzenia w systemie"
            value={data.stats.totalDevices}
            color="#27ae60"
            description="Kotły i piece"
          />
          <StatCard
            icon={Calendar}
            title="Serwisy w tym miesiącu"
            value={data.stats.totalServices}
            color="#f59e0b"
            description="Wszystkie wizyty"
          />
          <StatCard
            icon={Clock}
            title="Oczekujące serwisy"
            value={data.stats.pendingServices}
            color="#c0392b"
            description="Do realizacji"
          />
          <StatCard
            icon={CheckCircle}
            title="Ukończone serwisy"
            value={data.stats.completedServices}
            color="#27ae60"
            description="W tym miesiącu"
          />
          <StatCard
            icon={DollarSign}
            title="Przychód"
            value={formatCurrency(data.stats.revenue)}
            color="#8b5cf6"
            description="Łączny przychód"
          />
        </div>

        {/* Monthly Activity Chart */}
        {data.monthlyActivity.length > 0 && (
          <div className="chart-card">
            <h3>Miesięczna aktywność</h3>
            <MonthlyChart data={data.monthlyActivity} formatCurrency={formatCurrency} />
          </div>
        )}

        {/* Two column layout for SMS and Device Types */}
        <div className="two-column-grid">
          {/* SMS Statistics */}
          <SmsStatsCard smsStats={data.smsStats} formatCurrency={formatCurrency} />

          {/* Device Types */}
          <div className="report-card">
            <h3>Urządzenia wg typu</h3>
            <div className="device-types-list">
              {Object.entries(mockReportsData.devicesByType).map(([type, count]) => {
                const getIcon = (deviceType) => {
                  if (deviceType.includes('Pompa')) return Thermometer;
                  if (deviceType.includes('gazowy')) return Flame;
                  if (deviceType.includes('olejowy')) return Droplets;
                  if (deviceType.includes('Klimatyzator')) return Wind;
                  return Wrench;
                };
                const getColor = (deviceType) => {
                  if (deviceType.includes('Pompa')) return '#27ae60';
                  if (deviceType.includes('gazowy')) return '#e67e22';
                  if (deviceType.includes('olejowy')) return '#8b5cf6';
                  if (deviceType.includes('Klimatyzator')) return '#3b82f6';
                  return '#6b7280';
                };
                const Icon = getIcon(type);
                const color = getColor(type);
                const total = Object.values(mockReportsData.devicesByType).reduce((a, b) => a + b, 0);
                const percentage = ((count / total) * 100).toFixed(0);

                return (
                  <div key={type} className="device-type-item">
                    <div className="device-type-icon" style={{ backgroundColor: `${color}20`, color }}>
                      <Icon size={18} />
                    </div>
                    <div className="device-type-info">
                      <span className="device-type-name">{type}</span>
                      <div className="device-type-bar-container">
                        <div
                          className="device-type-bar"
                          style={{ width: `${percentage}%`, backgroundColor: color }}
                        />
                      </div>
                    </div>
                    <span className="device-type-count">{count} ({percentage}%)</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Revenue Summary */}
        <div className="report-card revenue-card">
          <h3>Podsumowanie przychodów</h3>
          <div className="revenue-grid">
            <div className="revenue-item">
              <div className="revenue-icon" style={{ backgroundColor: '#27ae6020', color: '#27ae60' }}>
                <TrendingUp size={24} />
              </div>
              <div className="revenue-details">
                <span className="revenue-label">Ten miesiąc</span>
                <span className="revenue-value">{formatCurrency(mockReportsData.revenue.thisMonth)}</span>
              </div>
            </div>
            <div className="revenue-item">
              <div className="revenue-icon" style={{ backgroundColor: '#6b728020', color: '#6b7280' }}>
                <Calendar size={24} />
              </div>
              <div className="revenue-details">
                <span className="revenue-label">Poprzedni miesiąc</span>
                <span className="revenue-value">{formatCurrency(mockReportsData.revenue.lastMonth)}</span>
              </div>
            </div>
            <div className="revenue-item highlight">
              <div className="revenue-icon" style={{ backgroundColor: '#e67e2220', color: '#e67e22' }}>
                <DollarSign size={24} />
              </div>
              <div className="revenue-details">
                <span className="revenue-label">Cały rok</span>
                <span className="revenue-value large">{formatCurrency(mockReportsData.revenue.thisYear)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Clients */}
        <div className="report-card">
          <h3>Top klienci</h3>
          <div className="top-clients-list">
            {mockClients.slice(0, 5).map((client, index) => (
              <div key={client.id} className="top-client-item">
                <div className="top-client-rank" style={{
                  backgroundColor: index === 0 ? '#fbbf24' : index === 1 ? '#9ca3af' : index === 2 ? '#cd7f32' : '#e5e7eb',
                  color: index < 3 ? 'white' : '#6b7280'
                }}>
                  {index + 1}
                </div>
                <div className="top-client-info">
                  <span className="top-client-name">{client.name}</span>
                  <span className="top-client-devices">{client.devices?.length || 0} urządzeń</span>
                </div>
                <div className="top-client-stats">
                  <Award size={16} color="#e67e22" />
                  <span>{Math.floor(Math.random() * 8) + 2} serwisów</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .reports-page {
          min-height: 100vh;
          background-color: #f5f3ef;
          padding: 20px;
          overflow-y: auto;
          max-height: 100vh;
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
        }

        .header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 32px;
        }

        .back-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background-color: #f3f4f6;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          color: #374151;
          transition: all 0.2s ease;
        }

        .back-button:hover {
          background-color: #e5e7eb;
        }

        .header-content {
          flex: 1;
        }

        .title {
          font-size: 32px;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 8px;
        }

        .subtitle {
          font-size: 16px;
          color: #5a6c7d;
          margin: 0;
        }

        .refresh-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background-color: #e67e22;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s ease;
          box-shadow: 0 2px 6px rgba(230, 126, 34, 0.3);
        }

        .refresh-button:hover {
          background-color: #d35400;
          box-shadow: 0 4px 12px rgba(230, 126, 34, 0.4);
        }

        .refresh-button:disabled {
          background-color: #94a3b8;
          cursor: not-allowed;
          box-shadow: none;
        }

        .spinning {
          animation: spin 1s linear infinite;
        }

        .error-banner {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background-color: #fef2f2;
          border: 1px solid #c0392b;
          border-radius: 4px;
          color: #c0392b;
          margin-bottom: 24px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 32px;
        }

        .chart-card {
          background-color: white;
          border-radius: 6px;
          padding: 24px;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
          border-left: 4px solid #e67e22;
          margin-bottom: 24px;
        }

        .chart-card h3 {
          font-size: 18px;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 20px;
        }

        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 50vh;
          flex-direction: column;
          gap: 16px;
        }

        .spinner {
          width: 48px;
          height: 48px;
          border: 4px solid #f3f4f6;
          border-top: 4px solid #e67e22;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .loading-text {
          font-size: 16px;
          color: #6b7280;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .two-column-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
          margin-bottom: 24px;
        }

        .report-card {
          background-color: white;
          border-radius: 6px;
          padding: 24px;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
          border-left: 4px solid #e67e22;
        }

        .report-card h3 {
          font-size: 18px;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 20px;
        }

        .device-types-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .device-type-item {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .device-type-icon {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .device-type-info {
          flex: 1;
        }

        .device-type-name {
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          display: block;
          margin-bottom: 4px;
        }

        .device-type-bar-container {
          width: 100%;
          height: 6px;
          background-color: #f3f4f6;
          border-radius: 3px;
          overflow: hidden;
        }

        .device-type-bar {
          height: 100%;
          border-radius: 3px;
          transition: width 0.5s ease;
        }

        .device-type-count {
          font-size: 14px;
          font-weight: 600;
          color: #111827;
          min-width: 70px;
          text-align: right;
        }

        .revenue-card {
          margin-bottom: 24px;
        }

        .revenue-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .revenue-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background-color: #f9fafb;
          border-radius: 8px;
        }

        .revenue-item.highlight {
          background-color: #fef3c7;
        }

        .revenue-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .revenue-details {
          display: flex;
          flex-direction: column;
        }

        .revenue-label {
          font-size: 12px;
          color: #6b7280;
          margin-bottom: 4px;
        }

        .revenue-value {
          font-size: 18px;
          font-weight: 700;
          color: #111827;
        }

        .revenue-value.large {
          font-size: 24px;
          color: #e67e22;
        }

        .top-clients-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .top-client-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background-color: #f9fafb;
          border-radius: 8px;
          transition: background-color 0.2s ease;
        }

        .top-client-item:hover {
          background-color: #f3f4f6;
        }

        .top-client-rank {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 700;
          flex-shrink: 0;
        }

        .top-client-info {
          flex: 1;
        }

        .top-client-name {
          font-size: 14px;
          font-weight: 600;
          color: #111827;
          display: block;
        }

        .top-client-devices {
          font-size: 12px;
          color: #6b7280;
        }

        .top-client-stats {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: #6b7280;
        }

        @media (max-width: 1024px) {
          .two-column-grid {
            grid-template-columns: 1fr;
          }

          .revenue-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default ReportsPage;