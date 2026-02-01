import React from 'react';
import { Plus } from 'lucide-react';

const AddClientButton = ({ onClick }) => {
  return (
    <button
      style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        width: 56,
        height: 56,
        borderRadius: '50%',
        backgroundColor: '#3b82f6',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        zIndex: 1000,
        transition: 'transform 0.2s ease',
      }}
      onClick={onClick}
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      title="Dodaj nowego klienta"
    >
      <Plus size={24} />
    </button>
  );
};

export default AddClientButton;