import React from 'react';
import { Search, RefreshCw } from 'lucide-react';

const SearchAndFilters = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  typeFilter,
  setTypeFilter,
  filteredCount,
  onRefresh
}) => {
  const filtersCardStyle = {
    backgroundColor: 'white',
    borderRadius: 6,
    padding: 24,
    boxShadow: '0 3px 10px rgba(0, 0, 0, 0.15)',
    borderLeft: '4px solid #e67e22',
    marginBottom: 24,
  };

  return (
    <div style={filtersCardStyle}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: 16,
        marginBottom: 16
      }}>
        <div>
          <label style={{
            display: 'block',
            fontSize: 14,
            fontWeight: 600,
            color: '#374151',
            marginBottom: 8
          }}>
            Wyszukaj
          </label>
          <div style={{ position: 'relative' }}>
            <Search size={16} color="#6b7280" style={{
              position: 'absolute',
              left: 12,
              top: '50%',
              transform: 'translateY(-50%)'
            }} />
            <input
              type="text"
              placeholder="Szukaj po kliencie, wiadomości lub telefonie..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 8px 8px 40px',
                border: '1px solid #d1d5db',
                borderRadius: 4,
                fontSize: 14,
                outline: 'none',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#e67e22'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
          </div>
        </div>

        <div>
          <label style={{
            display: 'block',
            fontSize: 14,
            fontWeight: 600,
            color: '#374151',
            marginBottom: 8
          }}>
            Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: 4,
              fontSize: 14,
              outline: 'none',
              backgroundColor: 'white'
            }}
          >
            <option value="all">Wszystkie</option>
            <option value="success">Wysłane pomyślnie</option>
            <option value="failed">Nieudane</option>
          </select>
        </div>

        <div>
          <label style={{
            display: 'block',
            fontSize: 14,
            fontWeight: 600,
            color: '#374151',
            marginBottom: 8
          }}>
            Typ wiadomości
          </label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: 4,
              fontSize: 14,
              outline: 'none',
              backgroundColor: 'white'
            }}
          >
            <option value="all">Wszystkie typy</option>
            <option value="INSPECTION_REMINDER">Przypomnienie o przeglądzie</option>
            <option value="OVERDUE_NOTIFICATION">Powiadomienie o przeterminowaniu</option>
            <option value="CUSTOM">Wiadomość niestandardowa</option>
            <option value="SERVICE_CONFIRMATION">Potwierdzenie serwisu</option>
          </select>
        </div>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 16,
        borderTop: '1px solid #f3f4f6'
      }}>
        <div style={{ fontSize: 14, color: '#6b7280' }}>
          Znaleziono {filteredCount} SMS-ów
        </div>
        <button
          onClick={onRefresh}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 16px',
            backgroundColor: '#f9fafb',
            border: '1px solid #d1d5db',
            borderRadius: 4,
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 600,
            color: '#374151'
          }}
        >
          <RefreshCw size={16} />
          Odśwież
        </button>
      </div>
    </div>
  );
};

export default SearchAndFilters;