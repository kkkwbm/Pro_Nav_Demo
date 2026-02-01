import React from 'react';
import { Phone, CheckCircle, XCircle } from 'lucide-react';

const SmsTableRow = ({ sms, index }) => {
  return (
    <div
      key={sms.id || index}
      style={{
        display: 'grid',
        gridTemplateColumns: '200px 150px 120px 1fr 120px 100px 120px',
        gap: 16,
        padding: '16px 24px',
        borderBottom: '1px solid #f3f4f6',
        transition: 'background-color 0.2s ease'
      }}
      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
    >
      <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>
        {sms.clientName}
      </div>
      <div style={{
        fontSize: 13,
        color: '#6b7280',
        display: 'flex',
        alignItems: 'center',
        gap: 4
      }}>
        <Phone size={12} />
        {sms.phoneNumber}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {sms.success ? (
          <CheckCircle size={16} color="#27ae60" />
        ) : (
          <XCircle size={16} color="#c0392b" />
        )}
        <span style={{
          fontSize: 12,
          fontWeight: 600,
          color: sms.success ? '#27ae60' : '#c0392b'
        }}>
          {sms.statusText}
        </span>
      </div>
      <div style={{
        fontSize: 13,
        color: '#374151',
        lineHeight: 1.4,
        maxHeight: '60px',
        overflow: 'hidden',
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical'
      }}>
        {sms.message}
      </div>
      <div style={{
        fontSize: 12,
        fontWeight: 600,
        color: '#6b7280',
        backgroundColor: '#f9fafb',
        padding: '4px 8px',
        borderRadius: 4,
        textAlign: 'center'
      }}>
        {sms.displayType}
      </div>
      <div style={{
        fontSize: 11,
        fontWeight: 600,
        backgroundColor: sms.automationStatus === 'Automatyczne' ? '#dcfce7' : '#fef3c7',
        color: sms.automationStatus === 'Automatyczne' ? '#166534' : '#92400e',
        padding: '4px 8px',
        borderRadius: 4,
        textAlign: 'center'
      }}>
        {sms.automationStatus || 'Inne'}
      </div>
      <div style={{
        fontSize: 12,
        color: '#6b7280',
        textAlign: 'right'
      }}>
        <div>{sms.displayDate}</div>
        <div style={{ fontWeight: 600 }}>{sms.displayTime}</div>
      </div>
    </div>
  );
};

export default SmsTableRow;