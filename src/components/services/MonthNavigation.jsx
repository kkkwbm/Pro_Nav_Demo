import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const MonthNavigation = ({ 
  currentDate, 
  onPreviousMonth, 
  onNextMonth, 
  onMonthSelect 
}) => {
  const monthNames = [
    'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
    'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
  ];

  return (
    <>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20
      }}>
        <button
          onClick={onPreviousMonth}
          style={{
            padding: 8,
            backgroundColor: '#f3f4f6',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            transition: 'all 0.2s ease'
          }}
        >
          <ChevronLeft size={20} />
        </button>

        <h2 style={{
          fontSize: 24,
          fontWeight: 600,
          margin: 0,
          color: '#2c3e50'
        }}>
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>

        <button
          onClick={onNextMonth}
          style={{
            padding: 8,
            backgroundColor: '#f3f4f6',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            transition: 'all 0.2s ease'
          }}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Month Tabs */}
      <div style={{
        display: 'flex',
        gap: 8,
        marginBottom: 20,
        overflowX: 'auto',
        paddingBottom: 8
      }}>
        {monthNames.map((month, index) => (
          <button
            key={month}
            onClick={() => onMonthSelect(index)}
            style={{
              padding: '6px 12px',
              backgroundColor: currentDate.getMonth() === index ? '#e67e22' : '#f3f4f6',
              color: currentDate.getMonth() === index ? 'white' : '#374151',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 500,
              whiteSpace: 'nowrap',
              transition: 'all 0.2s',
              boxShadow: currentDate.getMonth() === index ? '0 2px 6px rgba(230, 126, 34, 0.3)' : 'none'
            }}
          >
            {month.substring(0, 3)}
          </button>
        ))}
      </div>
    </>
  );
};

export default MonthNavigation;