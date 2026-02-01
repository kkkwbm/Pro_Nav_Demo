import React from 'react';
import { Phone, Eye, Edit, X, Trash2, AlertCircle, CheckCircle } from 'lucide-react';
import { PLANNED_SMS_STATUS } from '../../services/api/plannedSms';

const PlannedSmsRow = ({
  sms,
  user,
  getStatusIcon,
  onViewMessage,
  onEditMessage,
  onCancelSms,
  onDeleteSms,
  onMarkAsSent,
  settings
}) => {
  // Check if this SMS will be sent based on settings
  const automaticSmsEnabled = settings?.smsSettings?.automaticSmsEnabled ?? true;
  const expirationDayEnabled = settings?.smsTemplates?.expirationDayEnabled ?? true;

  const willBeSent = () => {
    if (sms.status !== PLANNED_SMS_STATUS.SCHEDULED) {
      return true; // Already sent/failed/cancelled - not applicable
    }
    if (sms.smsType === 'INSPECTION_REMINDER') {
      return automaticSmsEnabled;
    } else if (sms.smsType === 'EXPIRATION_DATE_NOTIFICATION') {
      return expirationDayEnabled;
    }
    return true;
  };

  const showDisabledWarning = !willBeSent();

  return (
    <div
      className={`sms-row ${sms.isOverdue ? 'overdue' : ''} ${sms.isToday ? 'today' : ''} ${showDisabledWarning ? 'disabled-sms' : ''}`}
    >
      <div className="cell client-id">#{sms.clientId || '-'}</div>
      <div className="cell client-name">{sms.clientName}</div>
      <div className="cell phone-number">
        <Phone size={12} />
        {sms.phoneNumber}
      </div>
      <div className="cell status">
        <div className="status-content">
          {getStatusIcon(sms.status)}
          <span className="status-badge" style={{
            color: sms.statusColor,
            backgroundColor: sms.statusBadge.bg
          }}>
            {sms.displayStatus}
          </span>
          {showDisabledWarning && (
            <span className="disabled-warning" title="Ten SMS nie zostanie wysłany - typ wyłączony w ustawieniach">
              <AlertCircle size={14} />
            </span>
          )}
        </div>
      </div>
      <div className="cell type">
        <div className={`type-badge ${
          sms.smsType === 'INSPECTION_REMINDER' ? 'reminder' :
          sms.smsType === 'EXPIRATION_DATE_NOTIFICATION' ? 'expiration' :
          'other'
        }`}>
          {sms.displayType}
        </div>
      </div>
      <div className="cell automation">
        <div className={`automation-badge ${sms.automationStatus === 'Automatyczne' ? 'automatic' : 'manual'}`}>
          {sms.automationStatus}
        </div>
      </div>
      <div className="cell scheduled">
        <div className="scheduled-date">{sms.displayScheduledDate}</div>
        <div className="scheduled-time">{sms.displayScheduledTime}</div>
      </div>
      <div className="cell actions">
        <button
          onClick={() => onViewMessage(sms)}
          className="action-button view"
          title="Zobacz wiadomość"
        >
          <Eye size={14} />
        </button>
        {sms.isScheduled && (user?.roles?.includes('ADMIN') || user?.roles?.includes('MANAGER')) && (
          <>
            <button
              className="action-button edit disabled"
              title="Edytuj SMS"
              disabled
            >
              <Edit size={14} />
            </button>
            <button
              className="action-button mark-sent disabled"
              title="Oznacz jako wysłane"
              disabled
            >
              <CheckCircle size={14} />
            </button>
            <button
              className="action-button cancel disabled"
              title="Anuluj SMS"
              disabled
            >
              <X size={14} />
            </button>
            <button
              className="action-button delete disabled"
              title="Usuń SMS"
              disabled
            >
              <Trash2 size={14} />
            </button>
          </>
        )}
        {!sms.isScheduled && sms.status !== PLANNED_SMS_STATUS.SCHEDULED && (
          <span className="no-actions">-</span>
        )}
      </div>

      <style>{`
        .sms-row {
          display: grid;
          grid-template-columns: 80px minmax(180px, 2fr) minmax(130px, 1.5fr) minmax(120px, 1.5fr) minmax(150px, 1.5fr) minmax(110px, 1fr) minmax(130px, 1.5fr) minmax(180px, 2fr);
          gap: 16px;
          padding: 16px 24px;
          border-bottom: 1px solid #f3f4f6;
          transition: background-color 0.2s ease;
        }

        .sms-row:hover {
          background-color: #f9fafb;
        }

        .sms-row.overdue {
          background-color: #fef2f2;
        }

        .sms-row.overdue:hover {
          background-color: #fee2e2;
        }

        .sms-row.today {
          background-color: #f0f9ff;
        }

        .sms-row.today:hover {
          background-color: #e0f2fe;
        }

        .sms-row.disabled-sms {
          background-color: #fafafa;
          opacity: 0.7;
        }

        .sms-row.disabled-sms:hover {
          background-color: #f5f5f5;
        }

        .cell {
          display: flex;
          align-items: center;
          font-size: 14px;
          list-style: none;
        }

        .cell::before,
        .cell::after {
          content: none !important;
        }

        .client-id {
          font-size: 13px;
          color: #6b7280;
        }

        .client-name {
          font-weight: 600;
          color: #111827;
        }

        .phone-number {
          font-size: 13px;
          color: #6b7280;
          gap: 4px;
        }

        .status-content {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .status-badge {
          font-size: 11px;
          font-weight: 600;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .disabled-warning {
          display: flex;
          align-items: center;
          color: #f59e0b;
          cursor: help;
        }

        .cell.type {
          justify-content: flex-start;
          overflow: hidden;
        }

        .type-badge {
          font-size: 12px;
          font-weight: 600;
          padding: 4px 8px;
          border-radius: 4px;
          text-align: center;
          display: inline-block;
          position: relative;
          white-space: nowrap;
        }

        .type-badge::before,
        .type-badge::after {
          content: none !important;
        }

        .type-badge.reminder {
          background-color: #dbeafe;
          color: #1e40af;
          border: 1px solid #bfdbfe;
        }

        .type-badge.expiration {
          background-color: #fed7aa;
          color: #c2410c;
          border: 1px solid #fdba74;
        }

        .type-badge.other {
          background-color: #f9fafb;
          color: #6b7280;
          border: 1px solid #e5e7eb;
        }

        .automation-badge {
          font-size: 11px;
          font-weight: 600;
          padding: 4px 8px;
          border-radius: 4px;
          text-align: center;
        }

        .automation-badge.automatic {
          background-color: #dcfce7;
          color: #166534;
        }

        .automation-badge.manual {
          background-color: #fef3c7;
          color: #92400e;
        }

        .scheduled {
          flex-direction: column;
          align-items: center;
          font-size: 12px;
          color: #6b7280;
        }

        .scheduled-time {
          font-weight: 600;
        }

        .actions {
          justify-content: center;
          align-items: center;
          gap: 4px;
          flex-wrap: wrap;
        }

        .action-button {
          padding: 4px;
          background-color: transparent;
          border: none;
          cursor: pointer;
          border-radius: 4px;
          transition: background-color 0.2s ease;
        }

        .action-button.view {
          color: #6b7280;
        }

        .action-button.view:hover {
          background-color: #f3f4f6;
        }

        .action-button.edit {
          color: #e67e22;
        }

        .action-button.edit:hover {
          background-color: #eff6ff;
        }

        .action-button.mark-sent {
          color: #10b981;
        }

        .action-button.mark-sent:hover {
          background-color: #ecfdf5;
        }

        .action-button.cancel {
          color: #f59e0b;
        }

        .action-button.cancel:hover {
          background-color: #fffbeb;
        }

        .action-button.delete {
          color: #c0392b;
        }

        .action-button.delete:hover {
          background-color: #fef2f2;
        }

        .action-button.disabled {
          color: #9ca3af !important;
          cursor: not-allowed;
          opacity: 0.6;
        }

        .action-button.disabled:hover {
          background-color: transparent !important;
        }

        .no-actions {
          font-size: 12px;
          color: #6b7280;
        }
      `}</style>
    </div>
  );
};

export default PlannedSmsRow;