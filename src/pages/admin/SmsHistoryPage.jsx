import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';
import { smsApi, smsHistoryMapper } from '../../services/api/sms';
import { MessageSquare, ArrowLeft } from 'lucide-react';
import SearchAndFilters from '../../components/admin/sms-history/SearchAndFilters';
import SmsTableHeader from '../../components/admin/sms-history/SmsTableHeader';
import SmsTableRow from '../../components/admin/sms-history/SmsTableRow';
import LoadingState from '../../components/admin/sms-history/LoadingState';
import ErrorState from '../../components/admin/sms-history/ErrorState';
import EmptyState from '../../components/admin/sms-history/EmptyState';
import Pagination from '../../components/admin/sms-history/Pagination';

const SmsHistoryPage = () => {
  const { user } = useAuth();
  const notification = useNotification();
  const navigate = useNavigate();
  const [smsHistory, setSmsHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, success, failed
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date'); // date, client, status, type
  const [sortOrder, setSortOrder] = useState('desc'); // asc, desc
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    loadSmsHistory();
  }, [currentPage]);

  const loadSmsHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use real API call to get SMS history from backend
      const response = await smsApi.getAllSmsHistory(itemsPerPage * 10); // Get more for pagination
      const formattedHistory = response.map(smsHistoryMapper.formatSmsHistory);
      
      setSmsHistory(formattedHistory);
      setTotalPages(Math.ceil(formattedHistory.length / itemsPerPage));
      
    } catch (err) {
      console.error('Error loading SMS history:', err);
      notification.showError('Nie udało się załadować historii SMS');
      setError('Nie udało się załadować historii SMS');
      setSmsHistory([]); // Clear history on error
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedHistory = () => {
    let filtered = smsHistory.filter(sms => {
      const matchesSearch = searchTerm === '' || 
        sms.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sms.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sms.phoneNumber.includes(searchTerm);
      
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'success' && sms.success) ||
        (statusFilter === 'failed' && !sms.success);
      
      const matchesType = typeFilter === 'all' || sms.smsType === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });

    // Sort the filtered results
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.sentAt) - new Date(b.sentAt);
          break;
        case 'client':
          comparison = a.clientName.localeCompare(b.clientName);
          break;
        case 'status':
          comparison = a.success === b.success ? 0 : a.success ? -1 : 1;
          break;
        case 'type':
          comparison = a.displayType.localeCompare(b.displayType);
          break;
        default:
          comparison = 0;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  };

  const paginatedHistory = () => {
    const filtered = filteredAndSortedHistory();
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filtered.slice(startIndex, startIndex + itemsPerPage);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const pageStyle = {
    minHeight: '100vh',
    backgroundColor: '#f5f3ef',
    padding: '20px',
  };

  const containerStyle = {
    maxWidth: '1400px',
    margin: '0 auto',
  };

  const headerStyle = {
    marginBottom: 32,
  };

  const titleStyle = {
    fontSize: 32,
    fontWeight: 700,
    color: '#2c3e50',
    marginBottom: 8,
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  };

  const subtitleStyle = {
    fontSize: 16,
    color: '#5a6c7d',
    marginBottom: 0,
  };


  const tableCardStyle = {
    backgroundColor: 'white',
    borderRadius: 6,
    boxShadow: '0 3px 10px rgba(0, 0, 0, 0.15)',
    borderLeft: '4px solid #e67e22',
    overflow: 'hidden',
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={loadSmsHistory} />;
  }

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <button
                onClick={() => navigate('/dashboard')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 16px',
                  backgroundColor: '#f3f4f6',
                  border: 'none',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontSize: 14,
                  color: '#374151',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
              >
                <ArrowLeft size={16} />
                Powrót do Dashboard
              </button>
              <div>
                <h1 style={titleStyle}>
                  <MessageSquare size={32} color="#e67e22" />
                  Historia SMS
                </h1>
                <p style={subtitleStyle}>
                  Przeglądaj historię wszystkich wysłanych wiadomości SMS
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <SearchAndFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
          filteredCount={filteredAndSortedHistory().length}
          onRefresh={loadSmsHistory}
        />

        {/* SMS History Table */}
        <div style={tableCardStyle}>
          {paginatedHistory().length === 0 ? (
            <EmptyState
              searchTerm={searchTerm}
              statusFilter={statusFilter}
              typeFilter={typeFilter}
            />
          ) : (
            <>
              <SmsTableHeader onSort={handleSort} />

              <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                {paginatedHistory().map((sms, index) => (
                  <SmsTableRow key={sms.id || index} sms={sms} index={index} />
                ))}
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </div>
      </div>

    </div>
  );
};

export default SmsHistoryPage;