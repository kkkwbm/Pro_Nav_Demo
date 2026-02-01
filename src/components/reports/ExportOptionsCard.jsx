import React from 'react';
import { Download } from 'lucide-react';

const ExportOptionsCard = ({ onExportNotImplemented }) => {
  return (
    <div className="report-card">
      <h3>Eksport danych</h3>
      <div className="export-options">
        <button
          className="export-button"
          onClick={() => onExportNotImplemented('eksportu do CSV')}
        >
          <Download size={16} />
          Eksportuj do CSV
        </button>
        <button
          className="export-button"
          onClick={() => onExportNotImplemented('generowania PDF')}
        >
          <Download size={16} />
          Generuj PDF
        </button>
        <button
          className="export-button"
          onClick={() => onExportNotImplemented('raportu miesięcznego')}
        >
          <Download size={16} />
          Raport miesięczny
        </button>
      </div>

      <style>{`
        .report-card {
          background-color: white;
          border-radius: 6px;
          padding: 24px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          border: 1px solid #f3f4f6;
        }

        .report-card h3 {
          font-size: 18px;
          font-weight: 700;
          color: #111827;
          margin-bottom: 20px;
        }

        .export-options {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .export-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px;
          background-color: #f3f4f6;
          border: 1px solid #e5e7eb;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          color: #374151;
          transition: all 0.2s ease;
        }

        .export-button:hover {
          background-color: #e5e7eb;
        }
      `}</style>
    </div>
  );
};

export default ExportOptionsCard;