import React from 'react';
import { MessageSquare, User, Phone, X } from 'lucide-react';

const ViewMessageModal = ({ isOpen, sms, getStatusIcon, onClose }) => {
  if (!isOpen || !sms) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            <MessageSquare size={24} />
            Szczegóły wiadomości SMS
          </h3>
          <button onClick={onClose} className="close-button">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="detail-row">
            <div className="detail-label">Klient</div>
            <div className="detail-value">
              <User size={16} />
              {sms.clientName} (ID: {sms.clientId || '-'})
            </div>
          </div>

          <div className="detail-row">
            <div className="detail-label">Numer telefonu</div>
            <div className="detail-value">
              <Phone size={16} />
              {sms.phoneNumber}
            </div>
          </div>

          <div className="detail-row">
            <div className="detail-label">Status</div>
            <div className="detail-value status">
              {getStatusIcon(sms.status)}
              <span style={{ color: sms.statusColor }}>
                {sms.displayStatus}
              </span>
            </div>
          </div>

          <div className="detail-row">
            <div className="detail-label">Typ wiadomości</div>
            <div className="detail-value">
              {sms.displayType}
            </div>
          </div>

          <div className="detail-row">
            <div className="detail-label">Zaplanowane na</div>
            <div className="detail-value">
              {sms.displayScheduledDate} o {sms.displayScheduledTime}
            </div>
          </div>

          <div className="detail-row">
            <div className="detail-label">Treść wiadomości</div>
            <div className="message-content">
              {sms.message}
            </div>
          </div>

          {sms.errorMessage && (
            <div className="detail-row">
              <div className="detail-label error">Błąd</div>
              <div className="error-content">
                {sms.errorMessage}
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="close-modal-button">
            Zamknij
          </button>
        </div>

        <style>{`
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
          }

          .modal-content {
            background-color: white;
            border-radius: 6px;
            padding: 24px;
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
            overflow: auto;
          }

          .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
          }

          .modal-title {
            font-size: 20px;
            font-weight: 700;
            color: #111827;
            margin: 0;
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .close-button {
            background: none;
            border: none;
            cursor: pointer;
            padding: 4px;
            color: #6b7280;
            border-radius: 4px;
            transition: background-color 0.2s ease;
          }

          .close-button:hover {
            background-color: #f3f4f6;
          }

          .modal-body {
            margin-bottom: 24px;
          }

          .detail-row {
            margin-bottom: 16px;
          }

          .detail-label {
            font-size: 12px;
            color: #6b7280;
            margin-bottom: 4px;
          }

          .detail-label.error {
            color: #c0392b;
          }

          .detail-value {
            font-size: 16px;
            font-weight: 600;
            color: #111827;
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .detail-value.status {
            font-size: 14px;
          }

          .message-content {
            background-color: #f9fafb;
            padding: 12px;
            border-radius: 4px;
            font-size: 14px;
            line-height: 1.5;
            border: 1px solid #e5e7eb;
          }

          .error-content {
            background-color: #fee2e2;
            padding: 12px;
            border-radius: 4px;
            font-size: 14px;
            color: #dc2626;
          }

          .modal-footer {
            display: flex;
            justify-content: flex-end;
          }

          .close-modal-button {
            padding: 8px 16px;
            background-color: #f3f4f6;
            color: #374151;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            transition: background-color 0.2s ease;
          }

          .close-modal-button:hover {
            background-color: #e5e7eb;
          }
        `}</style>
      </div>
    </div>
  );
};

export default ViewMessageModal;