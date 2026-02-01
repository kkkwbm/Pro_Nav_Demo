import React from 'react';
import { Clock, ArrowUpDown } from 'lucide-react';
import PlannedSmsRow from './PlannedSmsRow';

const PlannedSmsTable = ({
  paginatedSms,
  user,
  getStatusIcon,
  onViewMessage,
  onEditMessage,
  onCancelSms,
  onDeleteSms,
  onMarkAsSent,
  onSort,
  currentPage,
  totalPages,
  setCurrentPage,
  settings
}) => {
  if (paginatedSms.length === 0) {
    return (
      <div className="table-card">
        <div className="empty-state">
          <Clock size={48} color="#d1d5db" />
          <div className="empty-title">
            Brak zaplanowanych SMS-ów do wyświetlenia
          </div>
          <div className="empty-description">
            Zaplanowane SMS-y pojawią się tutaj po automatycznym lub ręcznym zaplanowaniu
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="table-card">
      {/* Table Header */}
      <div className="table-header">
        <div className="header-grid">
          <div className="header-cell">ID Klienta</div>
          <button
            onClick={() => onSort('client')}
            className="header-button"
          >
            Klient
            <ArrowUpDown size={12} />
          </button>
          <div className="header-cell">Telefon</div>
          <button
            onClick={() => onSort('status')}
            className="header-button"
          >
            Status
            <ArrowUpDown size={12} />
          </button>
          <button
            onClick={() => onSort('type')}
            className="header-button"
          >
            Typ
            <ArrowUpDown size={12} />
          </button>
          <div className="header-cell">Sposób</div>
          <button
            onClick={() => onSort('scheduledAt')}
            className="header-button"
          >
            Zaplanowane
            <ArrowUpDown size={12} />
          </button>
          <div className="header-cell header-center">Akcje</div>
        </div>
      </div>

      {/* Table Body */}
      <div className="table-body">
        {paginatedSms.map((sms, index) => (
          <PlannedSmsRow
            key={sms.id || index}
            sms={sms}
            user={user}
            getStatusIcon={getStatusIcon}
            onViewMessage={onViewMessage}
            onEditMessage={onEditMessage}
            onCancelSms={onCancelSms}
            onDeleteSms={onDeleteSms}
            onMarkAsSent={onMarkAsSent}
            settings={settings}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={`pagination-button ${currentPage === 1 ? 'disabled' : ''}`}
          >
            ← Poprzednia
          </button>

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let page;
            if (totalPages <= 5) {
              page = i + 1;
            } else if (currentPage <= 3) {
              page = i + 1;
            } else if (currentPage >= totalPages - 2) {
              page = totalPages - 4 + i;
            } else {
              page = currentPage - 2 + i;
            }

            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`pagination-button ${page === currentPage ? 'active' : ''}`}
              >
                {page}
              </button>
            );
          })}

          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className={`pagination-button ${currentPage === totalPages ? 'disabled' : ''}`}
          >
            Następna →
          </button>
        </div>
      )}

      <style>{`
        .table-card {
          background-color: white;
          border-radius: 6px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          border: 1px solid #f3f4f6;
          overflow: hidden;
        }

        .empty-state {
          text-align: center;
          color: #6b7280;
          padding: 60px 20px;
          background-color: #f9fafb;
        }

        .empty-title {
          font-size: 18px;
          font-weight: 600;
          margin: 16px 0 8px 0;
        }

        .empty-description {
          font-size: 14px;
        }

        .table-header {
          padding: 24px 24px 0 24px;
        }

        .header-grid {
          display: grid;
          grid-template-columns: 80px minmax(180px, 2fr) minmax(130px, 1.5fr) minmax(120px, 1.5fr) minmax(150px, 1.5fr) minmax(110px, 1fr) minmax(130px, 1.5fr) minmax(180px, 2fr);
          gap: 16px;
          padding: 12px 24px;
          border-bottom: 2px solid #f3f4f6;
        }

        .header-cell {
          font-weight: 600;
          font-size: 14px;
          color: #374151;
        }

        .header-cell.header-center {
          text-align: center;
        }

        .header-button {
          display: flex;
          align-items: center;
          gap: 4px;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          text-align: left;
          padding: 0;
        }

        .header-button:hover {
          color: #e67e22;
        }

        .table-body {
          /* Removed max-height to allow full page scrolling */
        }

        .pagination {
          padding: 16px 24px;
          border-top: 1px solid #f3f4f6;
          display: flex;
          justify-content: center;
          gap: 8px;
        }

        .pagination-button {
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          background-color: white;
          color: #374151;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .pagination-button:hover:not(.disabled) {
          background-color: #f9fafb;
        }

        .pagination-button.active {
          background-color: #e67e22;
          color: white;
          border-color: #e67e22;
        }

        .pagination-button.disabled {
          color: #d1d5db;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default PlannedSmsTable;