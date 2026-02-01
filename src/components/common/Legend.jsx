import React from 'react';
import { MARKER_COLORS, DEVICE_TYPES } from '@/config/mapConfig';
import { Droplet, Flame, Snowflake, AlertCircle, AlertTriangle, Clock, CheckCircle2, Check } from 'lucide-react';

const Legend = ({
  selectedTypes = [],
  selectedPeriods = [],
  serviceConfirmedOnly = false,
  onTypeToggle,
  onPeriodToggle,
  onServiceConfirmedToggle,
  stats = {}
}) => {
  const legendStyle = {
    position: 'absolute',
    top: 155,
    left: 20,
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(229, 231, 235, 0.8)',
    borderRadius: 12,
    padding: 14,
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1), 0 4px 10px rgba(0, 0, 0, 0.05)',
    fontSize: 12,
    minWidth: 200,
    maxWidth: 230,
    zIndex: 1000,
  };

  const headerStyle = {
    fontWeight: 700,
    fontSize: 13,
    marginBottom: 10,
    color: '#1f2937',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  };

  const sectionHeaderStyle = {
    fontSize: 10,
    fontWeight: 600,
    color: '#6b7280',
    marginBottom: 6,
    marginTop: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  };

  const legendItemStyle = (isActive) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
    padding: '6px 8px',
    borderRadius: 6,
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    opacity: isActive ? 1 : 0.4,
    filter: isActive ? 'none' : 'grayscale(100%)',
    userSelect: 'none',
  });

  const markerStyle = (color, isActive) => ({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
    background: isActive ? color : '#9ca3af',
    borderRadius: '50%',
    flexShrink: 0,
    boxShadow: isActive ? '0 2px 4px rgba(0, 0, 0, 0.1)' : 'none',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 11,
    transition: 'all 0.2s ease',
  });

  const countBadgeStyle = (isActive) => ({
    marginLeft: 'auto',
    fontSize: 10,
    fontWeight: 600,
    color: isActive ? '#374151' : '#9ca3af',
    background: isActive ? '#f3f4f6' : 'transparent',
    padding: '2px 6px',
    borderRadius: 10,
  });

  // Device types with their configuration
  const deviceTypes = [
    {
      type: DEVICE_TYPES.HEAT_PUMP,
      color: MARKER_COLORS.HEAT_PUMP,
      icon: <Droplet size={12} />,
      bgColor: '#eff6ff',
      marker: 'P',
      count: stats.heatPumps || 0,
    },
    {
      type: DEVICE_TYPES.GAS_BOILER,
      color: MARKER_COLORS.GAS_BOILER,
      icon: <Flame size={12} />,
      bgColor: '#f0fdf4',
      marker: 'K',
      count: stats.gasBoilers || 0,
    },
    {
      type: DEVICE_TYPES.OIL_BOILER,
      color: MARKER_COLORS.OIL_BOILER,
      icon: <Flame size={12} />,
      bgColor: '#faf5ff',
      marker: 'O',
      count: stats.oilBoilers || 0,
    },
    {
      type: DEVICE_TYPES.AIR_CONDITIONER,
      color: MARKER_COLORS.AIR_CONDITIONER,
      icon: <Snowflake size={12} />,
      bgColor: '#fefce8',
      marker: 'A',
      count: stats.airConditioners || 0,
    },
  ];

  // Inspection periods with their configuration
  const inspectionPeriods = [
    {
      period: 'overdue',
      label: 'Przeterminowane',
      color: '#991b1b',
      icon: <AlertTriangle size={12} />,
      bgColor: '#fee2e2',
      marker: '!!',
      count: stats.overdueInspections || 0,
    },
    {
      period: 'urgent',
      label: 'Pilne (< 1 mies.)',
      color: MARKER_COLORS.URGENT,
      icon: <AlertCircle size={12} />,
      bgColor: '#fef2f2',
      marker: '!',
      count: stats.urgentInspections || 0,
    },
    {
      period: 'soon',
      label: 'Wkrótce (1-3 mies.)',
      color: '#ea580c',
      icon: <Clock size={12} />,
      bgColor: '#fff7ed',
      marker: '•',
      count: stats.soonInspections || 0,
    },
    {
      period: 'later',
      label: 'Później (> 3 mies.)',
      color: '#10b981',
      icon: <Check size={12} />,
      bgColor: '#f0fdf4',
      marker: '✓',
      count: stats.laterInspections || 0,
    },
  ];

  const handleTypeClick = (type) => {
    if (onTypeToggle) {
      onTypeToggle(type);
    }
  };

  const handlePeriodClick = (period) => {
    if (onPeriodToggle) {
      onPeriodToggle(period);
    }
  };

  const handleServiceConfirmedClick = () => {
    if (onServiceConfirmedToggle) {
      onServiceConfirmedToggle();
    }
  };

  // Check if all types are selected (none deselected)
  const allTypesSelected = selectedTypes.length === deviceTypes.length;
  const allPeriodsSelected = selectedPeriods.length === inspectionPeriods.length;

  return (
    <div style={legendStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div style={{
          width: 3,
          height: 16,
          background: 'linear-gradient(180deg, #3b82f6 0%, #2563eb 100%)',
          borderRadius: 2,
        }} />
        Filtry i legenda
        {(!allTypesSelected || !allPeriodsSelected || serviceConfirmedOnly) && (
          <span style={{
            marginLeft: 'auto',
            fontSize: 9,
            background: '#3b82f6',
            color: 'white',
            padding: '2px 6px',
            borderRadius: 10,
            fontWeight: 600,
          }}>
            Aktywne
          </span>
        )}
      </div>

      {/* Device Types Section */}
      <div style={sectionHeaderStyle}>Typy urządzeń</div>
      {deviceTypes.map(({ type, color, icon, bgColor, marker, count }) => {
        const isActive = selectedTypes.includes(type);
        return (
          <div
            key={type}
            style={{
              ...legendItemStyle(isActive),
              background: isActive ? bgColor : 'transparent',
            }}
            onClick={() => handleTypeClick(type)}
            onMouseEnter={(e) => {
              if (isActive) {
                e.currentTarget.style.transform = 'translateX(2px)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateX(0)';
            }}
            title={isActive ? `Kliknij aby ukryć: ${type}` : `Kliknij aby pokazać: ${type}`}
          >
            <span style={markerStyle(color, isActive)}>
              {marker}
            </span>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 4 }}>
              {React.cloneElement(icon, { color: isActive ? color : '#9ca3af' })}
              <span style={{
                color: isActive ? '#374151' : '#9ca3af',
                fontWeight: 500,
                fontSize: 11,
                lineHeight: 1.3,
                textDecoration: isActive ? 'none' : 'line-through',
              }}>
                {type}
              </span>
            </div>
            <span style={countBadgeStyle(isActive)}>{count}</span>
          </div>
        );
      })}

      {/* Inspection Periods Section */}
      <div style={{ ...sectionHeaderStyle, borderTop: '1px solid #e5e7eb', paddingTop: 10 }}>
        Terminy przeglądów
      </div>
      {inspectionPeriods.map(({ period, label, color, icon, bgColor, marker, count }) => {
        const isActive = selectedPeriods.includes(period);
        return (
          <div
            key={period}
            style={{
              ...legendItemStyle(isActive),
              background: isActive ? bgColor : 'transparent',
            }}
            onClick={() => handlePeriodClick(period)}
            onMouseEnter={(e) => {
              if (isActive) {
                e.currentTarget.style.transform = 'translateX(2px)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateX(0)';
            }}
            title={isActive ? `Kliknij aby ukryć: ${label}` : `Kliknij aby pokazać: ${label}`}
          >
            <span style={markerStyle(color, isActive)}>
              {marker}
            </span>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 4 }}>
              {React.cloneElement(icon, { color: isActive ? color : '#9ca3af' })}
              <span style={{
                color: isActive ? '#374151' : '#9ca3af',
                fontWeight: 500,
                fontSize: 11,
                lineHeight: 1.3,
                textDecoration: isActive ? 'none' : 'line-through',
              }}>
                {label}
              </span>
            </div>
            <span style={countBadgeStyle(isActive)}>{count}</span>
          </div>
        );
      })}

      {/* Service Confirmed Section */}
      <div style={{ ...sectionHeaderStyle, borderTop: '1px solid #e5e7eb', paddingTop: 10 }}>
        Status serwisu
      </div>
      <div
        style={{
          ...legendItemStyle(serviceConfirmedOnly),
          background: serviceConfirmedOnly ? '#fef2f2' : 'transparent',
          border: serviceConfirmedOnly ? '1px solid #fecaca' : '1px solid transparent',
        }}
        onClick={handleServiceConfirmedClick}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateX(2px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateX(0)';
        }}
        title={serviceConfirmedOnly ? 'Kliknij aby pokazać wszystkie' : 'Kliknij aby pokazać tylko gotowe do serwisu'}
      >
        <div style={{ position: 'relative', display: 'inline-flex' }}>
          <span style={markerStyle('#3b82f6', true)}>P</span>
          <div style={{
            position: 'absolute',
            top: -2,
            right: -2,
            width: 8,
            height: 8,
            background: serviceConfirmedOnly ? '#dc2626' : '#9ca3af',
            borderRadius: '50%',
            border: '1px solid white',
          }} />
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 4 }}>
          <CheckCircle2 size={12} color={serviceConfirmedOnly ? '#dc2626' : '#9ca3af'} />
          <span style={{
            color: serviceConfirmedOnly ? '#dc2626' : '#374151',
            fontWeight: serviceConfirmedOnly ? 600 : 500,
            fontSize: 11,
            lineHeight: 1.3,
          }}>
            Tylko do serwisu
          </span>
        </div>
      </div>

      {/* Multiple devices indicator - not clickable, just info */}
      <div style={{
        marginTop: 10,
        paddingTop: 10,
        borderTop: '1px solid #e5e7eb',
      }}>
        <div style={{
          fontSize: 10,
          color: '#6b7280',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '6px 8px',
          backgroundColor: '#f8fafc',
          borderRadius: 6,
        }}>
          <div style={{
            width: 18,
            height: 18,
            background: '#1f2937',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: 9,
            fontWeight: 'bold',
            flexShrink: 0,
          }}>
            3
          </div>
          <span style={{ lineHeight: 1.3, fontSize: 10 }}>Wiele urządzeń w lokalizacji</span>
        </div>
      </div>
    </div>
  );
};

export default Legend;
