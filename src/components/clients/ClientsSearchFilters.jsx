import React from 'react';
import { Search, Filter, Calendar, ArrowUpAZ, ArrowDownZA, Clock, CheckCircle2, X, MessageSquare } from 'lucide-react';

const ClientsSearchFilters = ({ 
  searchQuery, 
  onSearchChange, 
  deviceTypeFilter, 
  onDeviceTypeChange, 
  inspectionFilter, 
  onInspectionChange,
  confirmationFilter,
  onConfirmationChange,
  sortOption,
  onSortChange,
  resultsCount 
}) => {
  const headerStyle = {
    display: 'flex !important',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    gap: 16,
    flexWrap: 'wrap',
    minHeight: 48,
    width: '100%',
    visibility: 'visible',
    position: 'relative',
    zIndex: 10,
  };

  const filtersRowStyle = {
    display: 'flex',
    gap: 12,
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 16,
  };

  const searchBarStyle = {
    display: 'flex',
    alignItems: 'center',
    background: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: 8,
    padding: '12px 16px',
    gap: 8,
    minWidth: 600,
    maxWidth: 750,
    flex: 1,
    zIndex: 10,
    position: 'relative',
    visibility: 'visible',
    opacity: 1,
  };

  const filterSelectStyle = {
    display: 'flex',
    alignItems: 'center',
    background: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: 8,
    padding: '8px 12px',
    gap: 8,
  };

  const selectStyle = {
    border: 'none',
    outline: 'none',
    fontSize: 14,
    background: 'transparent',
    cursor: 'pointer',
  };

  const searchInputStyle = {
    border: 'none',
    outline: 'none',
    fontSize: 16,
    background: 'transparent',
    width: '100%',
    color: '#111827',
    fontWeight: 400,
    visibility: 'visible',
    opacity: 1,
  };

  const getSortIcon = (sortValue) => {
    switch (sortValue) {
      case 'surname-asc':
        return <ArrowUpAZ size={16} color="#6b7280" />;
      case 'surname-desc':
        return <ArrowDownZA size={16} color="#6b7280" />;
      case 'urgency':
        return <Clock size={16} color="#6b7280" />;
      case 'sms-oldest':
        return <MessageSquare size={16} color="#6b7280" />;
      case 'sms-newest':
        return <MessageSquare size={16} color="#6b7280" />;
      default:
        return <Filter size={16} color="#6b7280" />;
    }
  };

  return (
    <>
      <div style={{...headerStyle, justifyContent: 'flex-start'}}>
        <h1 style={{ 
          fontSize: 24, 
          fontWeight: 700, 
          margin: 0,
          flexShrink: 0,
          minWidth: 'fit-content'
        }}>
          Zarządzanie Klientami
        </h1>
      </div>

      <div style={filtersRowStyle}>
        <div style={filterSelectStyle}>
          <Filter size={16} color="#6b7280" />
          <select
            value={deviceTypeFilter}
            onChange={(e) => onDeviceTypeChange(e.target.value)}
            style={selectStyle}
          >
            <option value="all">Wszystkie urządzenia</option>
            <option value="Pompa ciepła">Tylko pompy ciepła</option>
            <option value="Kocioł gazowy">Tylko kotły gazowe</option>
            <option value="Kocioł olejowy">Tylko kotły olejowe</option>
            <option value="Klimatyzator">Tylko klimatyzatory</option>
          </select>
        </div>

        <div style={filterSelectStyle}>
          <Calendar size={16} color="#6b7280" />
          <select
            value={inspectionFilter}
            onChange={(e) => onInspectionChange(e.target.value)}
            style={selectStyle}
          >
            <option value="all">Wszystkie terminy</option>
            <option value="overdue">Tylko przeterminowane</option>
            <option value="week">Przegląd &lt; 1 tydzień</option>
            <option value="twoweeks">Przegląd &lt; 2 tygodnie</option>
          </select>
        </div>

        <div style={filterSelectStyle}>
          <CheckCircle2 size={16} color="#6b7280" />
          <select
            value={confirmationFilter}
            onChange={(e) => onConfirmationChange(e.target.value)}
            style={selectStyle}
          >
            <option value="all">Wszystkie urządzenia</option>
            <option value="confirmed">Urządzenia do serwisu</option>
          </select>
        </div>

        <div style={filterSelectStyle}>
          {getSortIcon(sortOption)}
          <select
            value={sortOption}
            onChange={(e) => onSortChange(e.target.value)}
            style={selectStyle}
          >
            <option value="default">Domyślne sortowanie</option>
            <option value="surname-asc">Nazwisko A → Z</option>
            <option value="surname-desc">Nazwisko Z → A</option>
            <option value="urgency">Najpilniejsze serwisy</option>
            <option value="sms-oldest">Najdawniej wysłany SMS</option>
            <option value="sms-newest">Najświeżej wysłany SMS</option>
          </select>
        </div>

        <div style={searchBarStyle} id="clients-search-bar" data-testid="search-bar">
          <Search size={16} color="#6b7280" />
          <input
            style={searchInputStyle}
            placeholder="Szukaj po ID, nazwie, telefonie..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            data-testid="search-input"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '2px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.2s',
                flexShrink: 0,
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              title="Wyczyść wyszukiwanie"
            >
              <X size={14} color="#6b7280" />
            </button>
          )}
        </div>

        <div style={{ 
          fontSize: 14, 
          color: '#6b7280', 
          marginLeft: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: '#f9fafb',
          padding: '6px 12px',
          borderRadius: 6,
          border: '1px solid #e5e7eb'
        }}>
          <span style={{ fontWeight: 500 }}>Znaleziono:</span>
          <span style={{ 
            fontWeight: 700, 
            color: '#3b82f6',
            fontSize: 15
          }}>
            {resultsCount}
          </span>
          <span>klientów</span>
        </div>
      </div>
    </>
  );
};

export default ClientsSearchFilters;