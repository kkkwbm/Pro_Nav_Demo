import React from 'react';
import { Search } from 'lucide-react';

const UserFilters = ({
  searchQuery,
  onSearchChange,
  filterRole,
  onRoleChange,
  filterStatus,
  onStatusChange
}) => {
  return (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
      <div style={{ position: 'relative', flex: 1, minWidth: 250 }}>
        <Search size={16} style={{
          position: 'absolute',
          left: 12,
          top: '50%',
          transform: 'translateY(-50%)',
          color: '#9ca3af'
        }} />
        <input
          type="text"
          placeholder="Szukaj użytkowników..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 12px 10px 40px',
            border: '1px solid #d1d5db',
            borderRadius: 4,
            fontSize: 14,
            outline: 'none',
            transition: 'border-color 0.2s ease',
          }}
          onFocus={(e) => e.target.style.borderColor = '#e67e22'}
          onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
        />
      </div>

      <select
        value={filterRole}
        onChange={(e) => onRoleChange(e.target.value)}
        style={{
          padding: '10px 12px',
          border: '1px solid #d1d5db',
          borderRadius: 4,
          fontSize: 14,
          backgroundColor: 'white',
          cursor: 'pointer',
          outline: 'none',
        }}
      >
        <option value="ALL">Wszystkie role</option>
        <option value="ADMIN">Administrator</option>
        <option value="MANAGER">Manager</option>
        <option value="TECHNICIAN">Technik</option>
        <option value="VIEWER">Przeglądający</option>
      </select>

      <select
        value={filterStatus}
        onChange={(e) => onStatusChange(e.target.value)}
        style={{
          padding: '10px 12px',
          border: '1px solid #d1d5db',
          borderRadius: 4,
          fontSize: 14,
          backgroundColor: 'white',
          cursor: 'pointer',
          outline: 'none',
        }}
      >
        <option value="ALL">Wszystkie statusy</option>
        <option value="ACTIVE">Aktywni</option>
        <option value="PENDING">Oczekują zatwierdzenia</option>
      </select>
    </div>
  );
};

export default UserFilters;