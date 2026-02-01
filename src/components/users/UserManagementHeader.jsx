import React from 'react';
import { ArrowLeft, RefreshCw, Plus } from 'lucide-react';

const UserManagementHeader = ({
  onNavigateBack,
  onRefresh,
  onAddUser,
  userCount
}) => {
  const headerStyle = {
    backgroundColor: 'white',
    borderRadius: 6,
    padding: 24,
    marginBottom: 24,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    border: '1px solid #f3f4f6',
  };

  return (
    <div style={headerStyle}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button
            onClick={onNavigateBack}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 16px',
              backgroundColor: '#f3f4f6',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
              fontSize: 14,
              color: '#374151',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
          >
            <ArrowLeft size={16} />
            Powrót do Dashboard
          </button>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: '#111827', margin: 0 }}>
              Zarządzanie Użytkownikami
            </h1>
            <p style={{ fontSize: 14, color: '#6b7280', margin: '4px 0 0 0' }}>
              Zarządzaj kontami użytkowników i ich uprawnieniami {userCount !== undefined && `(${userCount})`}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={onRefresh}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 16px',
              backgroundColor: '#f3f4f6',
              color: '#374151',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 600,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
            title="Odśwież listę użytkowników"
          >
            <RefreshCw size={16} />
            Odśwież
          </button>

          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 20px',
              backgroundColor: '#9ca3af',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              cursor: 'not-allowed',
              fontSize: 14,
              fontWeight: 600,
              opacity: 0.6,
            }}
            disabled
          >
            <Plus size={16} />
            Dodaj Użytkownika
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserManagementHeader;