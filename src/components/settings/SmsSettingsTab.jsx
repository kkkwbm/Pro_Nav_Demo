import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  AlertTriangle,
  Info,
  Calendar,
  Clock,
  Bell,
  Plus,
  Trash2,
  Edit
} from 'lucide-react';
import { useNotification } from '@/contexts/NotificationContext';
import { advertisingSmsApi, formatAdvertisingStats } from '@/services/api/advertisingSms';
import { smsSchedulerApi } from '@/services/api/smsScheduler';

const SmsSettingsTab = ({ formData, onInputChange }) => {
  const notification = useNotification();

  // Advertising SMS state
  const [advertisingMessage, setAdvertisingMessage] = useState('');
  const [advertisingStats, setAdvertisingStats] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // SMS Scheduler state
  const [schedulerSettings, setSchedulerSettings] = useState(null);
  const [isUpdatingScheduler, setIsUpdatingScheduler] = useState(false);

  // Custom templates state
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplateContent, setNewTemplateContent] = useState('');

  // Load stats on mount
  useEffect(() => {
    loadAdvertisingStats();
    loadSchedulerSettings();
  }, []);

  const loadAdvertisingStats = async () => {
    try {
      const stats = await advertisingSmsApi.getStats();
      setAdvertisingStats(formatAdvertisingStats(stats));
    } catch (error) {
      console.error('Error loading advertising stats:', error);
    }
  };

  const loadSchedulerSettings = async () => {
    try {
      const settings = await smsSchedulerApi.getSettings();
      setSchedulerSettings(settings);
    } catch (error) {
      console.error('Error loading scheduler settings:', error);
    }
  };

  // SMS Scheduler functions - Updated for separate toggles
  const handleToggleBeforeDeadlineReminders = async () => {
    setIsUpdatingScheduler(true);
    try {
      const newValue = !formData.automaticSmsEnabled;
      onInputChange('automaticSmsEnabled', newValue);
      
      const result = await smsSchedulerApi.toggleReminders();
      notification.showSuccess(result.enabled ? 
        'Włączono przypomnienia przed terminem' : 
        'Wyłączono przypomnienia przed terminem');
    } catch (error) {
      console.error('Error toggling reminders:', error);
      notification.showError('Nie udało się zmienić ustawienia przypomnień');
    } finally {
      setIsUpdatingScheduler(false);
    }
  };

  const handleToggleExpirationDayNotifications = async () => {
    setIsUpdatingScheduler(true);
    try {
      const newValue = !formData.expirationDayEnabled;
      onInputChange('expirationDayEnabled', newValue);
      
      const result = await smsSchedulerApi.toggleExpirationDay();
      notification.showSuccess(result.enabled ? 
        'Włączono powiadomienia w dniu wygaśnięcia' : 
        'Wyłączono powiadomienia w dniu wygaśnięcia');
    } catch (error) {
      console.error('Error toggling expiration day notifications:', error);
      notification.showError('Nie udało się zmienić ustawienia powiadomień');
    } finally {
      setIsUpdatingScheduler(false);
    }
  };

  const handleUpdateDaysAhead = async (days) => {
    try {
      const result = await smsSchedulerApi.updateDaysAhead(days);
      setSchedulerSettings(prev => ({ ...prev, daysAhead: days }));
      onInputChange('smsReminderDaysAhead', days);
      notification.showSuccess(result.message);
    } catch (error) {
      console.error('Error updating days ahead:', error);
      notification.showError('Nie udało się zaktualizować dni wyprzedzenia');
    }
  };

  const handleUpdateSendTime = async (hour) => {
    try {
      const result = await smsSchedulerApi.updateSendTime(hour);
      setSchedulerSettings(prev => ({ ...prev, sendTime: hour }));
      notification.showSuccess(result.message);
    } catch (error) {
      console.error('Error updating send time:', error);
      notification.showError('Nie udało się zaktualizować godziny wysyłania');
    }
  };

  // Custom templates functions
  const handleAddTemplate = () => {
    setEditingTemplate(null);
    setNewTemplateName('');
    setNewTemplateContent('');
    setShowTemplateModal(true);
  };

  const handleEditTemplate = (template, index) => {
    setEditingTemplate({ ...template, index });
    setNewTemplateName(template.name);
    setNewTemplateContent(template.content);
    setShowTemplateModal(true);
  };

  const handleSaveTemplate = () => {
    if (!newTemplateName.trim() || !newTemplateContent.trim()) {
      notification.showWarning('Wypełnij nazwę i treść szablonu');
      return;
    }

    const currentTemplates = formData.customSmsTemplates || [];
    let updatedTemplates;

    if (editingTemplate !== null) {
      // Edit existing template
      updatedTemplates = currentTemplates.map((t, idx) =>
        idx === editingTemplate.index
          ? { name: newTemplateName, content: newTemplateContent }
          : t
      );
    } else {
      // Add new template
      updatedTemplates = [...currentTemplates, { name: newTemplateName, content: newTemplateContent }];
    }

    onInputChange('customSmsTemplates', updatedTemplates);
    setShowTemplateModal(false);
    notification.showSuccess(editingTemplate !== null ? 'Szablon zaktualizowany' : 'Szablon dodany');
  };

  const handleDeleteTemplate = (index) => {
    if (!window.confirm('Czy na pewno chcesz usunąć ten szablon?')) {
      return;
    }

    const currentTemplates = formData.customSmsTemplates || [];
    const updatedTemplates = currentTemplates.filter((_, idx) => idx !== index);
    onInputChange('customSmsTemplates', updatedTemplates);
    notification.showSuccess('Szablon usunięty');
  };

  // Advertising SMS functions
  const handleSendAdvertising = () => {
    if (!advertisingMessage.trim()) {
      notification.showWarning('Wprowadź treść wiadomości');
      return;
    }

    setShowConfirmModal(true);
  };

  const confirmSendAdvertising = async () => {
    setShowConfirmModal(false);
    setIsSending(true);

    try {
      const result = await advertisingSmsApi.sendToAll(advertisingMessage, false);

      if (result.success) {
        notification.showSuccess(`Sukces! ${result.message}`);
        setAdvertisingMessage('');
        loadAdvertisingStats();
      } else {
        notification.showError(`Błąd: ${result.message}`);
      }
    } catch (error) {
      console.error('Error sending advertising SMS:', error);
      notification.showError('Nie udało się wysłać wiadomości tekstowej');
    } finally {
      setIsSending(false);
    }
  };

  // Styles
  const sectionStyle = {
    background: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: 6,
    padding: 24,
    marginBottom: 24,
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  };

  const sectionHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
    paddingBottom: 12,
    borderBottom: '1px solid #f3f4f6',
  };

  const sectionTitleStyle = {
    fontSize: 18,
    fontWeight: 600,
    margin: 0,
  };

  const formRowStyle = {
    marginBottom: 16,
  };

  const labelStyle = {
    display: 'block',
    fontSize: 14,
    fontWeight: 600,
    marginBottom: 6,
    color: '#374151',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #d1d5db',
    borderRadius: 6,
    fontSize: 14,
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: 120,
    resize: 'vertical',
    fontFamily: 'inherit',
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: 16,
  };

  const infoBoxStyle = {
    background: '#eff6ff',
    border: '1px solid #bfdbfe',
    borderRadius: 6,
    padding: 12,
    fontSize: 13,
    color: '#1e40af',
    display: 'flex',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 8,
  };

  const warningBoxStyle = {
    background: '#fef3c7',
    border: '1px solid #fcd34d',
    borderRadius: 6,
    padding: 12,
    fontSize: 13,
    color: '#92400e',
    display: 'flex',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 8,
  };

  const statsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 16,
    marginBottom: 20,
  };

  const statBoxStyle = {
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: 4,
    padding: 16,
    textAlign: 'center',
  };

  const dangerButtonStyle = {
    padding: '10px 16px',
    backgroundColor: '#c0392b',
    color: 'white',
    border: 'none',
    borderRadius: 6,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  };

  const toggleCardStyle = {
    backgroundColor: '#f8fafc',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    marginBottom: '20px'
  };

  const toggleRowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px'
  };

  const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  };

  const modalStyle = {
    background: 'white',
    borderRadius: 6,
    padding: 24,
    maxWidth: 500,
    width: '90%',
    maxHeight: '80vh',
    overflow: 'auto',
  };

  const secondaryButtonStyle = {
    padding: '12px 24px',
    backgroundColor: '#f3f4f6',
    color: '#374151',
    border: '1px solid #d1d5db',
    borderRadius: 6,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  };

  return (
    <>
      {/* SMS Templates Section */}
      <div style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <MessageSquare size={20} color="#27ae60" />
          <h2 style={sectionTitleStyle}>Szablon wiadomości SMS</h2>
        </div>

        {/* Automatic SMS Toggles Card */}
        <div style={toggleCardStyle}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: '#1f2937' }}>
            <Calendar size={18} style={{ display: 'inline', marginRight: 8 }} />
            Automatyczne przypomnienia SMS
          </h3>

          {/* Days ahead and Send time settings - moved to top */}
          <div style={{ ...gridStyle, marginBottom: 20 }}>
            <div style={formRowStyle}>
              <label style={labelStyle}>Dni wyprzedzenia (1-365)</label>
              <input
                type="number"
                min="1"
                max="365"
                value={formData.smsReminderDaysAhead || 14}
                onChange={(e) => {
                  const days = parseInt(e.target.value) || 14;
                  handleUpdateDaysAhead(days);
                }}
                style={inputStyle}
              />
              <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
                SMS przypomnienia będą wysyłane tyle dni przed terminem przeglądu
              </div>
            </div>

            <div style={formRowStyle}>
              <label style={labelStyle}>Godzina wysyłania (0-23)</label>
              <input
                type="number"
                min="0"
                max="23"
                value={schedulerSettings?.sendTime || 9}
                onChange={(e) => {
                  const hour = parseInt(e.target.value) || 9;
                  handleUpdateSendTime(hour);
                }}
                style={inputStyle}
              />
              <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
                O której godzinie mają być wysyłane automatyczne SMS-y
              </div>
            </div>
          </div>

          {/* Toggle 1: Before deadline reminders */}
          <div style={toggleRowStyle}>
            <div>
              <label style={{ ...labelStyle, marginBottom: '4px', display: 'block' }}>
                <Bell size={16} style={{ display: 'inline', marginRight: 6 }} />
                Przypomnienia przed terminem przeglądu
              </label>
              <div style={{ fontSize: 13, color: '#6b7280' }}>
                Wysyłaj SMS {formData.smsReminderDaysAhead || 14} dni przed terminem przeglądu
              </div>
            </div>
            <div style={{
              position: 'relative',
              width: '60px',
              height: '32px',
              backgroundColor: '#9ca3af',
              borderRadius: '16px',
              cursor: 'not-allowed',
              transition: 'background-color 0.3s',
              display: 'flex',
              alignItems: 'center',
              padding: '2px',
              opacity: 0.6,
            }}>
              <div style={{
                width: '28px',
                height: '28px',
                backgroundColor: 'white',
                borderRadius: '50%',
                transform: formData.automaticSmsEnabled ? 'translateX(28px)' : 'translateX(0)',
                transition: 'transform 0.3s',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
              }} />
            </div>
          </div>

          {/* Toggle 2: Expiration day notifications */}
          <div style={toggleRowStyle}>
            <div>
              <label style={{ ...labelStyle, marginBottom: '4px', display: 'block' }}>
                <Clock size={16} style={{ display: 'inline', marginRight: 6 }} />
                Powiadomienia w dniu wygaśnięcia
              </label>
              <div style={{ fontSize: 13, color: '#6b7280' }}>
                Wysyłaj SMS w dniu, gdy termin przeglądu wygasa
              </div>
            </div>
            <div style={{
              position: 'relative',
              width: '60px',
              height: '32px',
              backgroundColor: '#9ca3af',
              borderRadius: '16px',
              cursor: 'not-allowed',
              transition: 'background-color 0.3s',
              display: 'flex',
              alignItems: 'center',
              padding: '2px',
              opacity: 0.6,
            }}>
              <div style={{
                width: '28px',
                height: '28px',
                backgroundColor: 'white',
                borderRadius: '50%',
                transform: formData.expirationDayEnabled ? 'translateX(28px)' : 'translateX(0)',
                transition: 'transform 0.3s',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
              }} />
            </div>
          </div>
        </div>

        <div style={formRowStyle}>
          <label style={labelStyle}>Szablon SMS przypomnienia o przeglądzie</label>
          <textarea
            value={formData.defaultSmsTemplate || ''}
            onChange={(e) => onInputChange('defaultSmsTemplate', e.target.value)}
            style={textareaStyle}
            placeholder="Wpisz szablon wiadomości SMS przypomnienia..."
          />
          <div style={infoBoxStyle}>
            <Info size={16} />
            <div>
              <strong>Dostępne zmienne:</strong><br />
              {'{clientName}'} - imię klienta<br />
              {'{clientSurname}'} - nazwisko klienta<br />
              {'{deviceType}'} - typ urządzenia<br />
              {'{deviceName}'} - nazwa/model urządzenia<br />
              {'{address}'} - adres urządzenia<br />
              {'{inspectionDate}'} - data przeglądu<br />
              {'{contactPhoneNumber}'} - numer kontaktowy firmy<br />
              {'{customConfirmationURL}'} - link do potwierdzenia
            </div>
          </div>
        </div>

        <div style={formRowStyle}>
          <label style={labelStyle}>Szablon SMS w dniu wygaśnięcia</label>
          <textarea
            value={formData.expirationSmsTemplate || ''}
            onChange={(e) => onInputChange('expirationSmsTemplate', e.target.value)}
            style={textareaStyle}
            placeholder="Wpisz szablon wiadomości SMS wysyłanej w dniu wygaśnięcia..."
          />
          <div style={infoBoxStyle}>
            <Info size={16} />
            <div>
              <strong>Dostępne zmienne:</strong><br />
              {'{clientName}'} - imię klienta<br />
              {'{clientSurname}'} - nazwisko klienta<br />
              {'{deviceType}'} - typ urządzenia<br />
              {'{deviceName}'} - nazwa/model urządzenia<br />
              {'{address}'} - adres urządzenia<br />
              {'{inspectionDate}'} - data przeglądu<br />
              {'{contactPhoneNumber}'} - numer kontaktowy firmy<br />
              {'{customConfirmationURL}'} - link do potwierdzenia
            </div>
          </div>
        </div>
      </div>

      {/* Custom SMS Templates Section */}
      <div style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <MessageSquare size={20} color="#8b5cf6" />
          <h2 style={sectionTitleStyle}>Własne szablony SMS</h2>
        </div>

        <div style={{ marginBottom: 16 }}>
          <button
            style={{
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
              gap: 8,
              opacity: 0.6,
            }}
            disabled
          >
            <Plus size={16} />
            Dodaj nowy szablon
          </button>
        </div>

        {formData.customSmsTemplates && formData.customSmsTemplates.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {formData.customSmsTemplates.map((template, index) => (
              <div
                key={index}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 6,
                  padding: 16,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 8 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 16, fontWeight: 600, color: '#1f2937', marginBottom: 4 }}>
                      {template.name}
                    </div>
                    <div style={{ fontSize: 14, color: '#6b7280', whiteSpace: 'pre-wrap' }}>
                      {template.content}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginLeft: 12 }}>
                    <button
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#9ca3af',
                        color: 'white',
                        border: 'none',
                        borderRadius: 4,
                        fontSize: 13,
                        cursor: 'not-allowed',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        opacity: 0.6,
                      }}
                      title="Edytuj"
                      disabled
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#9ca3af',
                        color: 'white',
                        border: 'none',
                        borderRadius: 4,
                        fontSize: 13,
                        cursor: 'not-allowed',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        opacity: 0.6,
                      }}
                      title="Usuń"
                      disabled
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ ...infoBoxStyle, background: '#f3f4f6', border: '1px solid #d1d5db', color: '#6b7280' }}>
            <Info size={16} />
            <div>Brak własnych szablonów. Dodaj nowy szablon, aby móc szybko wysyłać wiadomości SMS z predefiniowaną treścią.</div>
          </div>
        )}
      </div>

      {/* Advertising SMS Section - simplified */}
      <div style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <Send size={20} color="#8b5cf6" />
          <h2 style={sectionTitleStyle}>SMS Reklamowe</h2>
        </div>

        {advertisingStats && (
          <div style={statsGridStyle}>
            <div style={statBoxStyle}>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#e67e22' }}>
                {advertisingStats.totalSent}
              </div>
              <div style={{ fontSize: 12, color: '#6b7280' }}>
                Łącznie wysłane
              </div>
            </div>
            <div style={statBoxStyle}>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#27ae60' }}>
                {advertisingStats.thisMonthSent}
              </div>
              <div style={{ fontSize: 12, color: '#6b7280' }}>
                W tym miesiącu
              </div>
            </div>
            <div style={statBoxStyle}>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#f59e0b' }}>
                {advertisingStats.totalRecipients}
              </div>
              <div style={{ fontSize: 12, color: '#6b7280' }}>
                Odbiorcy
              </div>
            </div>
            <div style={statBoxStyle}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#6b7280' }}>
                {advertisingStats.lastCampaignDate}
              </div>
              <div style={{ fontSize: 12, color: '#6b7280' }}>
                Ostatnia kampania
              </div>
            </div>
          </div>
        )}

        <div style={formRowStyle}>
          <label style={labelStyle}>Treść wiadomości reklamowej</label>
          <textarea
            value={advertisingMessage}
            onChange={(e) => setAdvertisingMessage(e.target.value)}
            style={textareaStyle}
            placeholder="Wpisz treść wiadomości reklamowej..."
            maxLength={640}
          />
          <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
            {advertisingMessage.length}/640 znaków
          </div>
        </div>

        <div style={formRowStyle}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              style={{
                ...dangerButtonStyle,
                backgroundColor: '#9ca3af',
                opacity: 0.6,
                cursor: 'not-allowed'
              }}
              disabled
            >
              <Send size={16} />
              Wyślij do wszystkich
            </button>
          </div>
        </div>

        <div style={warningBoxStyle}>
          <AlertTriangle size={16} />
          <div>
            <strong>Uwaga!</strong> SMS-y reklamowe będą wysłane do wszystkich klientów z aktywnym numerem telefonu.
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            <h3 style={{ marginTop: 0, marginBottom: 16, fontSize: 18, fontWeight: 600 }}>
              Potwierdzenie wysyłania SMS
            </h3>

            <div style={{ marginBottom: 20 }}>
              <p style={{ margin: '0 0 12px 0' }}>
                Czy na pewno chcesz wysłać wiadomość SMS do wszystkich klientów?
              </p>

              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: 6,
                padding: 12,
                fontSize: 14,
                lineHeight: 1.4,
                fontFamily: 'monospace'
              }}>
                {advertisingMessage}
              </div>

              <p style={{ margin: '12px 0 0 0', fontSize: 13, color: '#6b7280' }}>
                Ta akcja nie może być cofnięta.
              </p>
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowConfirmModal(false)}
                style={secondaryButtonStyle}
              >
                Anuluj
              </button>
              <button
                onClick={confirmSendAdvertising}
                style={dangerButtonStyle}
              >
                Wyślij do wszystkich
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Template Editor Modal */}
      {showTemplateModal && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            <h3 style={{ marginTop: 0, marginBottom: 16, fontSize: 18, fontWeight: 600 }}>
              {editingTemplate !== null ? 'Edytuj szablon SMS' : 'Nowy szablon SMS'}
            </h3>

            <div style={{ marginBottom: 20 }}>
              <div style={formRowStyle}>
                <label style={labelStyle}>Nazwa szablonu</label>
                <input
                  type="text"
                  value={newTemplateName}
                  onChange={(e) => setNewTemplateName(e.target.value)}
                  style={inputStyle}
                  placeholder="np. Kontakt, Wygasło, Przypomnienie..."
                  maxLength={50}
                />
              </div>

              <div style={formRowStyle}>
                <label style={labelStyle}>Treść wiadomości</label>
                <textarea
                  value={newTemplateContent}
                  onChange={(e) => setNewTemplateContent(e.target.value)}
                  style={textareaStyle}
                  placeholder="Wpisz treść szablonu wiadomości SMS..."
                  maxLength={640}
                />
                <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
                  {newTemplateContent.length}/640 znaków
                </div>
              </div>

              <div style={infoBoxStyle}>
                <Info size={16} />
                <div>
                  <strong>Dostępne zmienne:</strong><br />
                  {'{clientName}'} - imię klienta<br />
                  {'{clientSurname}'} - nazwisko klienta<br />
                  {'{deviceType}'} - typ urządzenia<br />
                  {'{deviceName}'} - nazwa/model urządzenia<br />
                  {'{address}'} - adres urządzenia<br />
                  {'{inspectionDate}'} - data przeglądu<br />
                  {'{contactPhoneNumber}'} - numer kontaktowy firmy<br />
                  {'{customConfirmationURL}'} - link do potwierdzenia
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowTemplateModal(false)}
                style={secondaryButtonStyle}
              >
                Anuluj
              </button>
              <button
                onClick={handleSaveTemplate}
                disabled={!newTemplateName.trim() || !newTemplateContent.trim()}
                style={{
                  ...secondaryButtonStyle,
                  backgroundColor: newTemplateName.trim() && newTemplateContent.trim() ? '#8b5cf6' : '#d1d5db',
                  color: 'white',
                  border: 'none',
                  cursor: newTemplateName.trim() && newTemplateContent.trim() ? 'pointer' : 'not-allowed',
                }}
              >
                {editingTemplate !== null ? 'Zaktualizuj' : 'Dodaj szablon'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SmsSettingsTab;