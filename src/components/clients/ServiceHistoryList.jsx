import React, { useState, useMemo } from 'react';
import { Search, Filter, Calendar, SortAsc, SortDesc, AlertCircle } from 'lucide-react';
import ServiceHistoryCard from './ServiceHistoryCard';

const ServiceHistoryList = ({ 
  serviceHistory = [], 
  loading = false,
  error = null,
  onEdit, 
  onDelete,
  onNavigateToCalendar,
  onViewImages,
  canEdit = false 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' = newest first

  // Filter and sort service history
  const filteredAndSortedHistory = useMemo(() => {
    let filtered = [...serviceHistory];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(entry => 
        entry.technician?.toLowerCase().includes(query) ||
        entry.notes?.toLowerCase().includes(query) ||
        entry.serviceType?.toLowerCase().includes(query)
      );
    }

    // Service type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(entry => entry.serviceType === filterType);
    }


    // Sort by date
    filtered.sort((a, b) => {
      const dateA = new Date(a.serviceDate);
      const dateB = new Date(b.serviceDate);
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  }, [serviceHistory, searchQuery, filterType, sortOrder]);

  const serviceTypes = [
    { value: 'all', label: 'Wszystkie typy' },
    { value: 'KONSERWACJA', label: 'Konserwacja' },
    { value: 'NAPRAWA', label: 'Naprawa' },
    { value: 'PRZEGLAD_OKRESOWY', label: 'Przegląd okresowy' },
    { value: 'INSTALACJA', label: 'Instalacja' },
    { value: 'DIAGNOSTYKA', label: 'Diagnostyka' },
    { value: 'MODERNIZACJA', label: 'Modernizacja' },
    { value: 'AWARIA', label: 'Awaria' },
  ];

  const containerStyle = {
    background: 'white',
    borderRadius: 8,
    border: '1px solid #e5e7eb',
    overflow: 'hidden',
  };

  const headerStyle = {
    padding: 16,
    borderBottom: '1px solid #e5e7eb',
    backgroundColor: '#f9fafb',
  };

  const filtersStyle = {
    display: 'flex',
    gap: 12,
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 12,
  };

  const searchStyle = {
    display: 'flex',
    alignItems: 'center',
    background: 'white',
    border: '1px solid #d1d5db',
    borderRadius: 6,
    padding: '8px 12px',
    flex: '1 1 250px',
    maxWidth: 400,
  };

  const inputStyle = {
    border: 'none',
    outline: 'none',
    fontSize: 14,
    background: 'transparent',
    width: '100%',
    marginLeft: 8,
  };

  const selectStyle = {
    border: '1px solid #d1d5db',
    borderRadius: 6,
    padding: '8px 12px',
    fontSize: 14,
    background: 'white',
    cursor: 'pointer',
    outline: 'none',
  };

  const buttonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: 6,
    background: 'white',
    cursor: 'pointer',
    fontSize: 14,
    transition: 'all 0.2s',
  };


  const contentStyle = {
    padding: 16,
    maxHeight: 500,
    overflowY: 'auto',
  };

  const emptyStateStyle = {
    textAlign: 'center',
    padding: 40,
    color: '#6b7280',
  };

  const statsStyle = {
    display: 'flex',
    gap: 16,
    fontSize: 12,
    color: '#6b7280',
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={contentStyle}>
          <div style={emptyStateStyle}>
            Ładowanie historii serwisów...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={containerStyle}>
        <div style={contentStyle}>
          <div style={{...emptyStateStyle, color: '#dc2626'}}>
            <AlertCircle size={24} style={{ marginBottom: 8 }} />
            <div>Błąd podczas ładowania historii serwisów</div>
            <div style={{ fontSize: 12, marginTop: 4 }}>{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div style={filtersStyle}>
          <div style={searchStyle}>
            <Search size={16} color="#6b7280" />
            <input
              style={inputStyle}
              placeholder="Szukaj w historii serwisów..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            style={selectStyle}
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            {serviceTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>

          <button
            style={{
              ...buttonStyle,
              backgroundColor: sortOrder === 'desc' ? '#eff6ff' : 'white',
              borderColor: sortOrder === 'desc' ? '#3b82f6' : '#d1d5db',
              color: sortOrder === 'desc' ? '#3b82f6' : '#374151',
            }}
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            title={`Sortuj ${sortOrder === 'desc' ? 'od najstarszych' : 'od najnowszych'}`}
          >
            {sortOrder === 'desc' ? <SortDesc size={16} /> : <SortAsc size={16} />}
            {sortOrder === 'desc' ? 'Najnowsze' : 'Najstarsze'}
          </button>


        </div>

        <div style={statsStyle}>
          <span>Znaleziono: <strong>{filteredAndSortedHistory.length}</strong> wpisów</span>
          <span>Łącznie: <strong>{serviceHistory.length}</strong> wpisów</span>
        </div>
      </div>

      <div style={contentStyle}>
        {filteredAndSortedHistory.length === 0 ? (
          <div style={emptyStateStyle}>
            {searchQuery || filterType !== 'all' ? (
              <>
                <Filter size={24} color="#6b7280" style={{ marginBottom: 8 }} />
                <div>Nie znaleziono wpisów spełniających kryteria</div>
                <div style={{ fontSize: 12, marginTop: 4 }}>
                  Spróbuj zmienić filtry lub wyszukać inną frazę
                </div>
              </>
            ) : (
              <>
                <Calendar size={24} color="#6b7280" style={{ marginBottom: 8 }} />
                <div>Brak historii serwisów</div>
                <div style={{ fontSize: 12, marginTop: 4 }}>
                  Historia serwisów pojawi się tutaj po dodaniu wpisów
                </div>
              </>
            )}
          </div>
        ) : (
          <div>
            {filteredAndSortedHistory.map(entry => (
              <ServiceHistoryCard
                key={`${entry.id}-${entry.isManualEntry ? 'manual' : 'scheduled'}`}
                serviceEntry={entry}
                isManualEntry={entry.isManualEntry}
                onEdit={onEdit}
                onDelete={(serviceId) => onDelete(serviceId, entry.isManualEntry)}
                onNavigateToCalendar={onNavigateToCalendar}
                onViewImages={onViewImages}
                canEdit={canEdit}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceHistoryList;