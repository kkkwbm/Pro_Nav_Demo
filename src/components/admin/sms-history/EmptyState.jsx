import React from 'react';
import { Send } from 'lucide-react';

const EmptyState = ({ searchTerm, statusFilter, typeFilter }) => {
  const hasFilters = searchTerm || statusFilter !== 'all' || typeFilter !== 'all';

  return (
    <div style={{
      textAlign: 'center',
      color: '#6b7280',
      padding: '60px 20px',
      backgroundColor: '#f9fafb'
    }}>
      <Send size={48} color="#d1d5db" style={{ marginBottom: 16 }} />
      <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>
        Brak SMS-ów do wyświetlenia
      </div>
      <div style={{ fontSize: 14 }}>
        {hasFilters
          ? 'Spróbuj zmienić filtry wyszukiwania'
          : 'Historia SMS-ów pojawi się tutaj po wysłaniu pierwszej wiadomości'
        }
      </div>
    </div>
  );
};

export default EmptyState;