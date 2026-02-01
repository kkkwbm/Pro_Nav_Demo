import React from 'react';
import { Search, Loader, RefreshCw } from 'lucide-react';

const PlannedSmsFilters = ({
  searchTerm,
  setSearchTerm,
  timeFilter,
  setTimeFilter,
  typeFilter,
  setTypeFilter,
  statusFilter,
  setStatusFilter,
  dateSort,
  setDateSort,
  filteredCount,
  loading,
  user,
  onRefreshPlanning
}) => {
  const isAdmin = user?.roles?.includes('ADMIN');
  const isManager = user?.roles?.includes('MANAGER');
  return (
    <div className="filters-card">
      <div className="filters-grid">
        <div className="filter-group">
          <label className="filter-label">
            Wyszukaj (ID klienta, nazwa, telefon, wiadomość)
          </label>
          <div className="search-input-wrapper">
            <Search size={16} color="#6b7280" className="search-icon" />
            <input
              type="text"
              placeholder="Szukaj po ID, kliencie, telefonie..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="filter-group">
          <label className="filter-label">Okres czasu</label>
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="filter-select"
          >
            <option value="next7days">7 dni</option>
            <option value="month">Miesiąc</option>
            <option value="sixmonths">6 miesięcy</option>
            <option value="all">Rok (wszystkie)</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="upcoming">Zaplanowane</option>
            <option value="sent">Wysłane</option>
            <option value="cancelled">Anulowane</option>
            <option value="failed">Błędne</option>
            <option value="all">Wszystkie statusy</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Typ wiadomości</label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">Wszystkie typy</option>
            <option value="INSPECTION_REMINDER">Przypomnienie o przeglądzie</option>
            <option value="EXPIRATION_DATE_NOTIFICATION">Powiadomienie o wygaśnięciu</option>
          </select>
        </div>
      </div>

      <div className="filters-footer">
        <div className="results-count">
          {loading ? (
            <>
              <Loader size={14} className="loading-spinner" />
              Ładowanie...
            </>
          ) : (
            <>Znaleziono {filteredCount} SMS-ów</>
          )}
        </div>

        {(isAdmin || isManager) && onRefreshPlanning && (
          <button
            onClick={onRefreshPlanning}
            disabled={loading}
            className={`refresh-button ${loading ? 'disabled' : ''}`}
            title="Odśwież zaplanowane SMS - usuń wszystkie zaplanowane i utwórz ponownie"
          >
            <RefreshCw size={16} />
            Odśwież planowanie
          </button>
        )}
      </div>

      <style>{`
        .filters-card {
          background-color: white;
          border-radius: 6px;
          padding: 24px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          border: 1px solid #f3f4f6;
          margin-bottom: 24px;
        }

        .filters-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 16px;
          margin-bottom: 16px;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
        }

        .filter-label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 8px;
        }

        .search-input-wrapper {
          position: relative;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
        }

        .search-input {
          width: 100%;
          padding: 8px 8px 8px 40px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s ease;
        }

        .search-input:focus {
          border-color: #e67e22;
        }

        .filter-select {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          outline: none;
          background-color: white;
          cursor: pointer;
        }

        .filter-select:focus {
          border-color: #e67e22;
        }

        .filters-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 16px;
          border-top: 1px solid #f3f4f6;
        }

        .results-count {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #6b7280;
          font-weight: 500;
        }

        .loading-spinner {
          animation: spin 1s linear infinite;
        }

        .refresh-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px 16px;
          background-color: #3b82f6;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .refresh-button:hover:not(.disabled) {
          background-color: #2563eb;
          box-shadow: 0 2px 4px rgba(37, 99, 235, 0.3);
        }

        .refresh-button.disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default PlannedSmsFilters;