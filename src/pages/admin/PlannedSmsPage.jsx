import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { usePlannedSmsData } from '../../hooks/usePlannedSmsData';
import { useSettings } from '../../hooks/useSettings';
import { Clock, ArrowLeft, AlertCircle, AlertTriangle, X, RefreshCw } from 'lucide-react';

// Components
import PlannedSmsStatistics from '../../components/plannedSms/PlannedSmsStatistics';
import PlannedSmsFilters from '../../components/plannedSms/PlannedSmsFilters';
import PlannedSmsTable from '../../components/plannedSms/PlannedSmsTable';
import ViewMessageModal from '../../components/plannedSms/ViewMessageModal';
import EditMessageModal from '../../components/plannedSms/EditMessageModal';

const PlannedSmsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { settings } = useSettings();
  const [showWarning, setShowWarning] = useState(true);

  const {
    // Data
    statistics,
    loading,
    error,

    // Filters
    searchTerm,
    setSearchTerm,
    typeFilter,
    setTypeFilter,
    timeFilter,
    setTimeFilter,
    statusFilter,
    setStatusFilter,

    // Pagination
    currentPage,
    setCurrentPage,
    totalPages,

    // Modals
    selectedSms,
    showMessageModal,
    showEditModal,

    // Computed data
    filteredAndSortedSms,
    paginatedSms,

    // Actions
    handleCancelSms,
    handleDeleteSms,
    handleMarkAsSent,
    handleUpdateSms,
    handleRefreshPlanning,
    handleViewMessage,
    handleEditMessage,
    closeModals,
    handleSort,

    // Utilities
    getStatusIcon,
    refreshData
  } = usePlannedSmsData();

  // Determine which SMS types are disabled
  const automaticSmsEnabled = settings?.smsSettings?.automaticSmsEnabled ?? true;
  const expirationDayEnabled = settings?.smsTemplates?.expirationDayEnabled ?? true;

  const getWarningMessage = () => {
    if (!automaticSmsEnabled && !expirationDayEnabled) {
      return 'Automatyczne wiadomości SMS są wyłączone. Zaplanowane SMS nie będą wysyłane.';
    } else if (!automaticSmsEnabled) {
      return 'Automatyczne wiadomości SMS z przypomnieniem o przeglądzie są wyłączone. Tylko powiadomienia o wygaśnięciu będą wysyłane.';
    } else if (!expirationDayEnabled) {
      return 'Automatyczne wiadomości SMS o wygaśnięciu przeglądu są wyłączone. Tylko przypomnienia będą wysyłane.';
    }
    return null;
  };

  const warningMessage = getWarningMessage();

  // Loading state
  if (loading && paginatedSms().length === 0) {
    return (
      <div className="page">
        <div className="container">
          <div className="loading-state">
            <div className="spinner" />
            <div className="loading-text">
              Ładowanie zaplanowanych SMS...
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && paginatedSms().length === 0) {
    return (
      <div className="page">
        <div className="container">
          <div className="error-state">
            <AlertCircle size={48} color="#c0392b" />
            <div className="error-title">Błąd ładowania danych</div>
            <div className="error-description">{error}</div>
            <button onClick={refreshData} className="retry-button">
              <RefreshCw size={16} />
              Spróbuj ponownie
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      {/* SMS Settings Warning Banner */}
      {warningMessage && showWarning && (
        <div className="warning-banner">
          <div className="warning-content">
            <AlertTriangle size={24} color="#f59e0b" />
            <div className="warning-text">
              <div className="warning-title">Ostrzeżenie - Automatyczne SMS wyłączone</div>
              <div className="warning-description">{warningMessage}</div>
            </div>
            <button
              onClick={() => setShowWarning(false)}
              className="warning-close"
              title="Zamknij ostrzeżenie"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      <div className={`container ${warningMessage && showWarning ? 'with-warning' : ''}`}>
        {/* Header */}
        <div className="header">
          <div className="header-content">
            <div className="header-left">
              <button
                onClick={() => navigate('/dashboard')}
                className="back-button"
              >
                <ArrowLeft size={16} />
                Powrót do Dashboard
              </button>
              <div className="title-section">
                <h1 className="title">
                  <Clock size={32} color="#e67e22" />
                  Zaplanowane SMS
                </h1>
                <p className="subtitle">
                  Zarządzaj wszystkimi zaplanowanymi wiadomościami SMS
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <PlannedSmsStatistics statistics={statistics} />

        {/* Filters */}
        <PlannedSmsFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          timeFilter={timeFilter}
          setTimeFilter={setTimeFilter}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          filteredCount={filteredAndSortedSms().length}
          loading={loading}
          user={user}
          onRefreshPlanning={handleRefreshPlanning}
        />

        {/* Table */}
        <PlannedSmsTable
          paginatedSms={paginatedSms()}
          user={user}
          getStatusIcon={getStatusIcon}
          onViewMessage={handleViewMessage}
          onEditMessage={handleEditMessage}
          onCancelSms={handleCancelSms}
          onDeleteSms={handleDeleteSms}
          onMarkAsSent={handleMarkAsSent}
          onSort={handleSort}
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          settings={settings}
        />

        {/* Modals */}
        <ViewMessageModal
          isOpen={showMessageModal}
          sms={selectedSms}
          getStatusIcon={getStatusIcon}
          onClose={closeModals}
        />

        <EditMessageModal
          isOpen={showEditModal}
          sms={selectedSms}
          onClose={closeModals}
          onSave={(message) => handleUpdateSms(selectedSms?.id, message)}
        />

        <style>{`
          .page {
            min-height: 100vh;
            background-color: #f5f3ef;
            padding: 20px 20px 60px 20px;
            position: relative;
          }

          .container {
            max-width: 1600px;
            margin: 0 auto;
          }

          .container.with-warning {
            padding-top: 80px;
          }

          /* Warning Banner Styles */
          .warning-banner {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background-color: #fffbeb;
            border-bottom: 2px solid #fbbf24;
            z-index: 9999;
            animation: slideDown 0.3s ease;
          }

          .warning-content {
            max-width: 1600px;
            margin: 0 auto;
            padding: 16px 24px;
            display: flex;
            align-items: center;
            gap: 16px;
          }

          .warning-text {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 4px;
          }

          .warning-title {
            font-size: 16px;
            font-weight: 700;
            color: #92400e;
          }

          .warning-description {
            font-size: 14px;
            color: #78350f;
            line-height: 1.5;
          }

          .warning-close {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 8px;
            background-color: transparent;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            color: #92400e;
            transition: all 0.2s ease;
          }

          .warning-close:hover {
            background-color: #fde68a;
          }

          @keyframes slideDown {
            from {
              transform: translateY(-100%);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }

          /* Existing Styles */
          .header {
            margin-bottom: 32px;
          }

          .header-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 16px;
          }

          .header-left {
            display: flex;
            align-items: center;
            gap: 16px;
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

          .title-section {
            display: flex;
            flex-direction: column;
          }

          .title {
            font-size: 32px;
            font-weight: 700;
            color: #2c3e50;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .subtitle {
            font-size: 16px;
            color: #5a6c7d;
            margin: 0;
          }

          .loading-state,
          .error-state {
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

          .error-title {
            font-size: 18px;
            font-weight: 600;
            color: #c0392b;
          }

          .error-description {
            font-size: 14px;
            color: #6b7280;
            text-align: center;
          }

          .retry-button {
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
            font-weight: 600;
            transition: background-color 0.2s ease;
            box-shadow: 0 2px 6px rgba(230, 126, 34, 0.3);
          }

          .retry-button:hover {
            background-color: #d35400;
            box-shadow: 0 4px 12px rgba(230, 126, 34, 0.4);
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          @media (max-width: 768px) {
            .warning-content {
              flex-direction: column;
              align-items: flex-start;
              padding: 12px 16px;
            }

            .warning-close {
              align-self: flex-end;
              margin-top: -8px;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default PlannedSmsPage;