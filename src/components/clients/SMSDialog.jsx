import React from 'react';
import { Send, FileText } from 'lucide-react';

const SMSDialog = ({
  showSMSDialog,
  smsMessage,
  setSmsMessage,
  onConfirm,
  onCancel,
  loading = false,
  customTemplates = [],
  onTemplateSelect,
  onResetToDefault,
  isCustomClient = false
}) => {
  if (!showSMSDialog) return null;

  const handleTemplateSelect = async (template) => {
    // If parent provided a callback, use it to replace variables
    if (onTemplateSelect) {
      await onTemplateSelect(template, showSMSDialog.device, showSMSDialog.client);
    } else {
      // Fallback: just set the raw template content
      setSmsMessage(template.content);
    }
  };

  const handleResetToDefault = async () => {
    if (onResetToDefault) {
      await onResetToDefault(showSMSDialog.device, showSMSDialog.client);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 3000,
    }}>
      <div style={{
        background: 'white',
        borderRadius: 12,
        padding: 24,
        maxWidth: 600,
        width: '90%',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      }}>
        <h3 style={{ fontSize: 18, fontWeight: 600, margin: '0 0 16px 0' }}>
          Wyślij SMS do klienta
        </h3>
        
        <div style={{ marginBottom: 16, padding: 16, backgroundColor: '#f9fafb', borderRadius: 8 }}>
          <div style={{ 
            fontSize: 12, 
            color: '#9ca3af', 
            fontWeight: 500,
            marginBottom: 2,
            letterSpacing: 0.5
          }}>
            ID - {showSMSDialog.client.id}
          </div>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>
            {showSMSDialog.client.name}
          </div>
          <div style={{ fontSize: 14, color: '#6b7280', marginBottom: 4 }}>
            📱 {showSMSDialog.client.phone}
          </div>
          <div style={{ fontSize: 14, color: '#6b7280' }}>
            🔧 {showSMSDialog.device.deviceType} - {showSMSDialog.device.address}
          </div>
        </div>

        {/* Custom Templates Selector - Only show for regular clients, not custom clients */}
        {!isCustomClient && (
          <div style={{ marginBottom: 16 }}>
            <label style={{
              display: 'block',
              fontSize: 14,
              fontWeight: 600,
              marginBottom: 6,
              color: '#374151'
            }}>
              Wybierz szablon:
            </label>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 8
            }}>
              {/* Default Template Button */}
              <button
                onClick={handleResetToDefault}
                disabled={loading}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  opacity: loading ? 0.6 : 1,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (!loading) e.target.style.backgroundColor = '#059669';
                }}
                onMouseLeave={(e) => {
                  if (!loading) e.target.style.backgroundColor = '#10b981';
                }}
              >
                <FileText size={14} />
                Domyślny
              </button>

              {/* Custom Templates */}
              {customTemplates && customTemplates.length > 0 && customTemplates.map((template, index) => (
                <button
                  key={index}
                  onClick={() => handleTemplateSelect(template)}
                  disabled={loading}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#8b5cf6',
                    color: 'white',
                    border: 'none',
                    borderRadius: 6,
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    opacity: loading ? 0.6 : 1,
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) e.target.style.backgroundColor = '#7c3aed';
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) e.target.style.backgroundColor = '#8b5cf6';
                }}
              >
                <FileText size={14} />
                {template.name}
              </button>
            ))}
            </div>
          </div>
        )}

        <div style={{ marginBottom: 16 }}>
          <label style={{
            display: 'block',
            fontSize: 14,
            fontWeight: 600,
            marginBottom: 6,
            color: '#374151'
          }}>
            Treść wiadomości SMS:
          </label>
          <textarea
            value={smsMessage}
            onChange={(e) => setSmsMessage(e.target.value)}
            style={{
              width: '100%',
              minHeight: 120,
              padding: 12,
              border: '1px solid #d1d5db',
              borderRadius: 6,
              fontSize: 14,
              resize: 'vertical',
              boxSizing: 'border-box',
              fontFamily: 'inherit',
            }}
            placeholder="Wpisz treść wiadomości SMS..."
          />
          <div style={{
            fontSize: 12,
            color: '#6b7280',
            marginTop: 4,
            textAlign: 'right'
          }}>
            Znaków: {smsMessage.length} | SMS: {Math.ceil(smsMessage.length / 68) || 1}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <span
            style={{
              flex: 1,
              padding: '10px 16px',
              backgroundColor: '#9ca3af',
              color: 'white',
              border: 'none',
              borderRadius: 6,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              opacity: 0.7,
              userSelect: 'none',
              pointerEvents: 'none',
            }}
          >
            <Send size={16} />
            Wyślij SMS
          </span>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: '10px 16px',
              backgroundColor: '#f3f4f6',
              color: '#374151',
              border: '1px solid #d1d5db',
              borderRadius: 6,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Anuluj
          </button>
        </div>
      </div>
    </div>
  );
};

export default SMSDialog;