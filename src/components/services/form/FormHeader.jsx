import React from 'react';
import { Plus, Edit2, X } from 'lucide-react';

const FormHeader = ({ isEditing, onClose }) => {
  return (
    <div style={{
      background: isEditing ? 
        'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' : 
        'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      color: 'white',
      padding: 24,
      borderRadius: '16px 16px 0 0',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {isEditing ? <Edit2 size={24} /> : <Plus size={24} />}
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>
            {isEditing ? 'Edytuj serwis' : 'Nowy serwis'}
          </h2>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            borderRadius: 8,
            padding: 8,
            cursor: 'pointer',
          }}
        >
          <X size={20} color="white" />
        </button>
      </div>
    </div>
  );
};

export default FormHeader;