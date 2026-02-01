import React, { useState, useEffect } from 'react';
import { Edit, X } from 'lucide-react';

const EditMessageModal = ({ isOpen, sms, onClose, onSave }) => {
  const [editingMessage, setEditingMessage] = useState('');

  useEffect(() => {
    if (isOpen && sms) {
      setEditingMessage(sms.message || '');
    }
  }, [isOpen, sms]);

  if (!isOpen || !sms) return null;

  const handleSave = () => {
    if (!editingMessage.trim()) {
      alert('Wiadomość nie może być pusta');
      return;
    }
    onSave(editingMessage);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            <Edit size={24} />
            Edytuj wiadomość SMS
          </h3>
          <button onClick={onClose} className="close-button">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="detail-row">
            <div className="detail-label">Klient</div>
            <div className="detail-value">
              {sms.clientName}
            </div>
          </div>

          <div className="detail-row">
            <div className="detail-label">Zaplanowane na</div>
            <div className="detail-value">
              {sms.displayScheduledDate} o {sms.displayScheduledTime}
            </div>
          </div>

          <div className="detail-row">
            <label className="textarea-label">
              Treść wiadomości
            </label>
            <textarea
              value={editingMessage}
              onChange={(e) => setEditingMessage(e.target.value)}
              className="message-textarea"
              placeholder="Wprowadź treść wiadomości SMS..."
            />
            <div className="character-count">
              Długość: {editingMessage.length} znaków
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="cancel-button">
            Anuluj
          </button>
          <button onClick={handleSave} className="save-button">
            Zapisz zmiany
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

          .detail-value {
            font-size: 16px;
            font-weight: 600;
            color: #111827;
          }

          .textarea-label {
            font-size: 12px;
            color: #6b7280;
            margin-bottom: 4px;
            display: block;
          }

          .message-textarea {
            width: 100%;
            min-height: 150px;
            padding: 12px;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            font-size: 14px;
            font-family: inherit;
            resize: vertical;
            outline: none;
            transition: border-color 0.2s ease;
          }

          .message-textarea:focus {
            border-color: #e67e22;
          }

          .character-count {
            font-size: 12px;
            color: #6b7280;
            margin-top: 4px;
          }

          .modal-footer {
            display: flex;
            justify-content: flex-end;
            gap: 12px;
          }

          .cancel-button {
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

          .cancel-button:hover {
            background-color: #e5e7eb;
          }

          .save-button {
            padding: 8px 16px;
            background-color: #e67e22;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            transition: background-color 0.2s ease;
          }

          .save-button:hover {
            background-color: #2563eb;
          }
        `}</style>
      </div>
    </div>
  );
};

export default EditMessageModal;