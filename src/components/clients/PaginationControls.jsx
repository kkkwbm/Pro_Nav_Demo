import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const PaginationControls = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  startIndex,
  endIndex
}) => {
  if (totalPages <= 1) return null;

  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    backgroundColor: 'white',
    borderRadius: 12,
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    marginTop: 20,
    marginBottom: 20,
  };

  const buttonGroupStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  };

  const buttonStyle = (disabled) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px 12px',
    backgroundColor: disabled ? '#f3f4f6' : 'white',
    border: '1px solid #e5e7eb',
    borderRadius: 8,
    cursor: disabled ? 'not-allowed' : 'pointer',
    color: disabled ? '#9ca3af' : '#374151',
    fontSize: 14,
    fontWeight: 500,
    transition: 'all 0.2s ease',
    opacity: disabled ? 0.5 : 1,
  });

  const pageButtonStyle = (isActive) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 36,
    height: 36,
    padding: '0 12px',
    backgroundColor: isActive ? '#3b82f6' : 'white',
    border: `1px solid ${isActive ? '#3b82f6' : '#e5e7eb'}`,
    borderRadius: 8,
    cursor: 'pointer',
    color: isActive ? 'white' : '#374151',
    fontSize: 14,
    fontWeight: isActive ? 600 : 500,
    transition: 'all 0.2s ease',
  });

  const infoStyle = {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: 500,
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxButtons = 5;

    if (totalPages <= maxButtons) {
      // Show all pages if total is less than max
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      // Always show last page
      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div style={containerStyle}>
      <div style={infoStyle}>
        Wyświetlanie {startIndex + 1}-{Math.min(endIndex, totalItems)} z {totalItems} klientów
      </div>

      <div style={buttonGroupStyle}>
        {/* First Page */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          style={buttonStyle(currentPage === 1)}
          onMouseEnter={(e) => {
            if (currentPage !== 1) {
              e.currentTarget.style.backgroundColor = '#f9fafb';
              e.currentTarget.style.borderColor = '#3b82f6';
            }
          }}
          onMouseLeave={(e) => {
            if (currentPage !== 1) {
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.borderColor = '#e5e7eb';
            }
          }}
          title="Pierwsza strona"
        >
          <ChevronsLeft size={16} />
        </button>

        {/* Previous Page */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={buttonStyle(currentPage === 1)}
          onMouseEnter={(e) => {
            if (currentPage !== 1) {
              e.currentTarget.style.backgroundColor = '#f9fafb';
              e.currentTarget.style.borderColor = '#3b82f6';
            }
          }}
          onMouseLeave={(e) => {
            if (currentPage !== 1) {
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.borderColor = '#e5e7eb';
            }
          }}
          title="Poprzednia strona"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Page Numbers */}
        {pageNumbers.map((page, index) => (
          page === '...' ? (
            <span key={`ellipsis-${index}`} style={{ padding: '0 4px', color: '#9ca3af' }}>
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              style={pageButtonStyle(currentPage === page)}
              onMouseEnter={(e) => {
                if (currentPage !== page) {
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                  e.currentTarget.style.borderColor = '#3b82f6';
                }
              }}
              onMouseLeave={(e) => {
                if (currentPage !== page) {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.borderColor = '#e5e7eb';
                }
              }}
            >
              {page}
            </button>
          )
        ))}

        {/* Next Page */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={buttonStyle(currentPage === totalPages)}
          onMouseEnter={(e) => {
            if (currentPage !== totalPages) {
              e.currentTarget.style.backgroundColor = '#f9fafb';
              e.currentTarget.style.borderColor = '#3b82f6';
            }
          }}
          onMouseLeave={(e) => {
            if (currentPage !== totalPages) {
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.borderColor = '#e5e7eb';
            }
          }}
          title="Następna strona"
        >
          <ChevronRight size={16} />
        </button>

        {/* Last Page */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          style={buttonStyle(currentPage === totalPages)}
          onMouseEnter={(e) => {
            if (currentPage !== totalPages) {
              e.currentTarget.style.backgroundColor = '#f9fafb';
              e.currentTarget.style.borderColor = '#3b82f6';
            }
          }}
          onMouseLeave={(e) => {
            if (currentPage !== totalPages) {
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.borderColor = '#e5e7eb';
            }
          }}
          title="Ostatnia strona"
        >
          <ChevronsRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default PaginationControls;
