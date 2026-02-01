import React from 'react';
import { ArrowUpDown } from 'lucide-react';

const SmsTableHeader = ({ onSort }) => {
  const handleSort = (field) => {
    onSort(field);
  };

  return (
    <div style={{ padding: '24px 24px 0 24px' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '200px 150px 120px 1fr 120px 100px 120px',
        gap: 16,
        padding: '12px 0',
        borderBottom: '2px solid #f3f4f6',
        fontWeight: 600,
        fontSize: 14,
        color: '#374151'
      }}>
        <button
          onClick={() => handleSort('client')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 600,
            color: '#374151',
            textAlign: 'left'
          }}
        >
          Klient
          <ArrowUpDown size={12} />
        </button>
        <div>Telefon</div>
        <button
          onClick={() => handleSort('status')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 600,
            color: '#374151',
            textAlign: 'left'
          }}
        >
          Status
          <ArrowUpDown size={12} />
        </button>
        <div>Wiadomość</div>
        <button
          onClick={() => handleSort('type')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 600,
            color: '#374151',
            textAlign: 'left'
          }}
        >
          Typ
          <ArrowUpDown size={12} />
        </button>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>
          Sposób
        </div>
        <button
          onClick={() => handleSort('date')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 600,
            color: '#374151',
            textAlign: 'left'
          }}
        >
          Data
          <ArrowUpDown size={12} />
        </button>
      </div>
    </div>
  );
};

export default SmsTableHeader;