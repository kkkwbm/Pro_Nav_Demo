import React from 'react';
import { getClientStats } from '@/services/utils/clientUtils';
import { Users, Droplet, Flame, AlertTriangle, Clock, AlertCircle } from 'lucide-react';

const ClientStats = ({ clients }) => {
  const stats = getClientStats(clients);

  const statsStyle = {
    position: 'absolute',
    top: 600, // Positioned below the smaller legend
    left: 20, // Moved to left side
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(229, 231, 235, 0.8)',
    borderRadius: 12,
    padding: 14, // Smaller padding
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1), 0 4px 10px rgba(0, 0, 0, 0.05)',
    fontSize: 12, // Smaller font
    minWidth: 180, // Smaller width
    maxWidth: 200,
    zIndex: 900, // Lower z-index than legend
  };

  const headerStyle = {
    fontWeight: 700,
    fontSize: 14, // Smaller header
    marginBottom: 12, // Less margin
    color: '#1f2937',
    display: 'flex',
    alignItems: 'center',
    gap: 6, // Smaller gap
  };

  const sectionStyle = {
    marginBottom: 12, // Less margin
  };

  const iconStyle = {
    width: 24, // Smaller icon container
    height: 24,
    borderRadius: 6,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8, // Less margin
  };

  const statCardStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '6px 0', // Less padding
  };

  const alertCardStyle = (color, bgColor, borderColor) => ({
    background: bgColor,
    border: `1px solid ${borderColor}`,
    borderRadius: 8, // Smaller radius
    padding: '8px 12px', // Smaller padding
    marginBottom: 6, // Less margin
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    transition: 'all 0.2s ease',
    cursor: 'default',
  });

  return (
    <div style={statsStyle}>
      <div style={headerStyle}>
        <div style={{
          width: 3, // Smaller decorative line
          height: 16,
          background: 'linear-gradient(180deg, #3b82f6 0%, #2563eb 100%)',
          borderRadius: 2,
        }} />
        Statystyki
      </div>
      
      {/* Device counts */}
      <div style={sectionStyle}>
        <div style={statCardStyle}>
          <div style={{ ...iconStyle, background: '#eff6ff' }}>
            <Users size={14} color="#3b82f6" /> {/* Smaller icon */}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ color: '#6b7280', fontSize: 10 }}>Wszystkich klientów</div> {/* Smaller text */}
            <div style={{ fontWeight: 700, fontSize: 16, color: '#1f2937' }}>{stats.total}</div> {/* Smaller number */}
          </div>
        </div>
      </div>

      <div style={{ 
        borderTop: '1px solid #e5e7eb', 
        marginTop: 12, // Less margin
        paddingTop: 12 
      }}>
        <div style={{ 
          fontSize: 10, // Smaller font
          fontWeight: 600, 
          color: '#6b7280', 
          marginBottom: 8, // Less margin
          textTransform: 'uppercase',
          letterSpacing: 0.5
        }}>
          Status przeglądów
        </div>
        
        {stats.overdueInspections > 0 && (
          <div style={alertCardStyle('#991b1b', '#fee2e2', '#fecaca')}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}> {/* Smaller gap */}
              <AlertTriangle size={12} color="#991b1b" /> {/* Smaller icon */}
              <span style={{ fontWeight: 600, color: '#991b1b', fontSize: 11 }}>Przeterminowane</span> {/* Smaller text */}
            </div>
            <span style={{ fontWeight: 700, fontSize: 14, color: '#991b1b' }}> {/* Smaller number */}
              {stats.overdueInspections}
            </span>
          </div>
        )}
        
        <div style={alertCardStyle('#dc2626', '#fef2f2', '#fecaca')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}> {/* Smaller gap */}
            <AlertCircle size={12} color="#dc2626" /> {/* Smaller icon */}
            <span style={{ fontWeight: 600, color: '#dc2626', fontSize: 11 }}>Pilne (&lt; 1 mies.)</span> {/* Smaller text */}
          </div>
          <span style={{ fontWeight: 700, fontSize: 14, color: '#dc2626' }}> {/* Smaller number */}
            {stats.urgentInspections}
          </span>
        </div>
        
        <div style={alertCardStyle('#ea580c', '#fff7ed', '#fed7aa')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}> {/* Smaller gap */}
            <Clock size={12} color="#ea580c" /> {/* Smaller icon */}
            <span style={{ fontWeight: 600, color: '#ea580c', fontSize: 11 }}>Wkrótce (1-3 mies.)</span> {/* Smaller text */}
          </div>
          <span style={{ fontWeight: 700, fontSize: 14, color: '#ea580c' }}> {/* Smaller number */}
            {stats.soonInspections}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ClientStats;