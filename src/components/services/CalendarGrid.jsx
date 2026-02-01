import React, { useState } from 'react';

const CalendarGrid = ({ currentDate, services = [], onDayClick, onServiceClick }) => {
  const [hoveredDay, setHoveredDay] = useState(null);
  const dayNames = ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Nie'];

  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    let startDay = firstDay.getDay() - 1;
    if (startDay === -1) startDay = 6;
    
    const days = [];
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const getServicesForDay = (date) => {
    if (!date || !services || !Array.isArray(services)) return [];
    return services.filter(service => {
      const serviceDate = new Date(service.startDateTime);
      return serviceDate.getDate() === date.getDate() &&
             serviceDate.getMonth() === date.getMonth() &&
             serviceDate.getFullYear() === date.getFullYear();
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('pl-PL', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const calendarDays = getCalendarDays();

  return (
    <div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: 8,
        marginBottom: 8
      }}>
        {dayNames.map(day => (
          <div
            key={day}
            style={{
              textAlign: 'center',
              fontWeight: 600,
              fontSize: 13,
              color: '#6b7280',
              padding: '8px 0'
            }}
          >
            {day}
          </div>
        ))}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: 8
      }}>
        {calendarDays.map((date, index) => {
          const dayServices = getServicesForDay(date);
          const hasServices = dayServices.length > 0;
          const isHovered = hoveredDay === index;
          const isTodayDate = isToday(date);

          return (
            <div
              key={index}
              onClick={() => date && onDayClick(date)}
              onMouseEnter={() => setHoveredDay(index)}
              onMouseLeave={() => setHoveredDay(null)}
              style={{
                minHeight: 100,
                backgroundColor: date ? (isTodayDate ? '#dbeafe' : (isHovered ? '#f9fafb' : '#fff')) : 'transparent',
                border: date ? (isTodayDate ? '2px solid #3b82f6' : '1px solid #e5e7eb') : 'none',
                borderRadius: 8,
                padding: date ? 8 : 0,
                cursor: date ? 'pointer' : 'default',
                transition: 'all 0.2s',
                position: 'relative'
              }}
            >
              {date && (
                <>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: 4
                  }}>
                    <span style={{
                      fontSize: 14,
                      fontWeight: isTodayDate ? 600 : 500,
                      color: isTodayDate ? '#1d4ed8' : '#374151'
                    }}>
                      {date.getDate()}
                    </span>
                    {hasServices && (
                      <span style={{
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        fontSize: 10,
                        padding: '2px 6px',
                        borderRadius: 10,
                        fontWeight: 600
                      }}>
                        {dayServices.length}
                      </span>
                    )}
                  </div>

                  <div style={{ marginTop: 4 }}>
                    {dayServices.slice(0, 2).map((service) => (
                      <div
                        key={service.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onServiceClick(service);
                        }}
                        style={{
                          backgroundColor: '#3b82f6',
                          color: 'white',
                          fontSize: 11,
                          padding: '2px 4px',
                          borderRadius: 4,
                          marginBottom: 2,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        <span style={{ marginRight: 4 }}>
                          {formatTime(service.startDateTime)}
                        </span>
                        {service.clientName.split(' ')[0]}
                      </div>
                    ))}
                    {dayServices.length > 2 && (
                      <div style={{
                        fontSize: 11,
                        color: '#6b7280',
                        textAlign: 'center',
                        marginTop: 2
                      }}>
                        +{dayServices.length - 2} więcej
                      </div>
                    )}
                  </div>

                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarGrid;