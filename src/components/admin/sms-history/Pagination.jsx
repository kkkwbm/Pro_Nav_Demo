import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div style={{
      padding: '16px 24px',
      borderTop: '1px solid #f3f4f6',
      display: 'flex',
      justifyContent: 'center',
      gap: 8
    }}>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          style={{
            padding: '8px 12px',
            border: '1px solid #d1d5db',
            backgroundColor: page === currentPage ? '#e67e22' : 'white',
            color: page === currentPage ? 'white' : '#374151',
            borderRadius: 4,
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 600
          }}
        >
          {page}
        </button>
      ))}
    </div>
  );
};

export default Pagination;