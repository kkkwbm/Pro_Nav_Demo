import { useState, useEffect } from 'react';
import { useNotification } from '../contexts/NotificationContext';
import { plannedSmsService } from '../services/api/plannedSmsService';
import { PLANNED_SMS_STATUS } from '../services/api/plannedSms';
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  X,
  AlertCircle
} from 'lucide-react';

export const usePlannedSmsData = () => {
  const notification = useNotification();

  // Main data state
  const [plannedSms, setPlannedSms] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('upcoming'); // 'upcoming', 'sent', 'cancelled', 'failed', 'all'
  const [sortBy, setSortBy] = useState('scheduledAt');
  const [sortOrder, setSortOrder] = useState('asc');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 20;

  // Modal state
  const [selectedSms, setSelectedSms] = useState(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Load data when filters change (NOT when page changes - we do client-side pagination)
  useEffect(() => {
    loadPlannedSms();
    loadStatistics();
    setCurrentPage(1); // Reset to first page when filter changes
  }, [timeFilter]);

  // Load planned SMS data - Load ALL data for the selected time period
  const loadPlannedSms = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load ALL data without pagination (pass large page size)
      const response = await plannedSmsService.loadFilteredData(
        { timeFilter },
        0,
        1000 // Large page size to get all data
      );

      setPlannedSms(response.content);
      // Don't set totalPages here - it will be calculated from filtered results
    } catch (err) {
      console.error('Error loading planned SMS:', err);
      notification.showError('Nie udało się załadować zaplanowanych SMS');
      setError('Nie udało się załadować zaplanowanych SMS');
      setPlannedSms([]);
    } finally {
      setLoading(false);
    }
  };

  // Load statistics
  const loadStatistics = async () => {
    try {
      const stats = await plannedSmsService.getStatistics();
      setStatistics(stats);
    } catch (err) {
      console.error('Error loading statistics:', err);
    }
  };

  // Refresh all data
  const refreshData = async () => {
    await Promise.all([loadPlannedSms(), loadStatistics()]);
  };

  // SMS Actions
  const handleCancelSms = async (id) => {
    if (!window.confirm('Czy na pewno chcesz anulować ten zaplanowany SMS?')) {
      return;
    }

    try {
      await plannedSmsService.cancelPlannedSms(id, 'Anulowane przez użytkownika');
      notification.showSuccess('SMS został anulowany');
      refreshData();
    } catch (err) {
      console.error('Error cancelling SMS:', err);
      notification.showError('Nie udało się anulować SMS');
    }
  };

  const handleDeleteSms = async (id) => {
    if (!window.confirm('Czy na pewno chcesz usunąć ten zaplanowany SMS? Tej operacji nie można cofnąć.')) {
      return;
    }

    try {
      await plannedSmsService.deletePlannedSms(id);
      notification.showSuccess('SMS został usunięty');
      refreshData();
    } catch (err) {
      console.error('Error deleting SMS:', err);
      notification.showError('Nie udało się usunąć SMS');
    }
  };

  const handleMarkAsSent = async (id) => {
    if (!window.confirm('Czy na pewno chcesz oznaczyć ten SMS jako wysłany? Zmieni to status SMS na "Wysłane".')) {
      return;
    }

    try {
      await plannedSmsService.markPlannedSmsAsSent(id);
      notification.showSuccess('SMS został oznaczony jako wysłany');
      refreshData();
    } catch (err) {
      console.error('Error marking SMS as sent:', err);
      notification.showError('Nie udało się oznaczyć SMS jako wysłany');
    }
  };

  const handleUpdateSms = async (id, message) => {
    try {
      await plannedSmsService.updatePlannedSms(id, { message });
      notification.showSuccess('SMS został zaktualizowany');
      setShowEditModal(false);
      refreshData();
    } catch (err) {
      console.error('Error updating SMS:', err);
      notification.showError('Nie udało się zaktualizować SMS');
    }
  };

  const handleRefreshPlanning = async () => {
    try {
      setLoading(true);
      const result = await plannedSmsService.refreshPlanning();

      if (result.success) {
        if (result.addedTotal > 0) {
          notification.showSuccess(result.message);
        } else {
          notification.showInfo('Brak nowych SMS do zaplanowania. Wszystkie aktualne SMS są już zaplanowane.');
        }
      } else {
        notification.showWarning('Nie udało się odświeżyć planowania');
      }

      refreshData();
    } catch (err) {
      console.error('Error refreshing planning:', err);
      notification.showError('Nie udało się odświeżyć planowania SMS');
    } finally {
      setLoading(false);
    }
  };

  // Modal handlers
  const handleViewMessage = (sms) => {
    setSelectedSms(sms);
    setShowMessageModal(true);
  };

  const handleEditMessage = (sms) => {
    if (!sms.isScheduled) {
      notification.showWarning('Można edytować tylko zaplanowane SMS-y');
      return;
    }
    setSelectedSms(sms);
    setShowEditModal(true);
  };

  const closeModals = () => {
    setShowMessageModal(false);
    setShowEditModal(false);
    setSelectedSms(null);
  };

  // Filtering and sorting logic
  const filteredAndSortedSms = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today

    let filtered = plannedSms.filter(sms => {
      // Search filter
      const matchesSearch = searchTerm === '' ||
        sms.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sms.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sms.phoneNumber.includes(searchTerm) ||
        sms.deviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (sms.clientId && sms.clientId.toString().includes(searchTerm));

      // Type filter
      const matchesType = typeFilter === 'all' || sms.smsType === typeFilter;

      // Status filter
      let matchesStatus = true;
      const smsDate = new Date(sms.scheduledAt);

      switch (statusFilter) {
        case 'upcoming':
          // Show SCHEDULED SMS from today onwards
          matchesStatus = sms.status === PLANNED_SMS_STATUS.SCHEDULED && smsDate >= today;
          break;
        case 'sent':
          matchesStatus = sms.status === PLANNED_SMS_STATUS.SENT;
          break;
        case 'cancelled':
          matchesStatus = sms.status === PLANNED_SMS_STATUS.CANCELLED;
          break;
        case 'failed':
          matchesStatus = sms.status === PLANNED_SMS_STATUS.FAILED;
          break;
        case 'all':
          matchesStatus = true;
          break;
        default:
          matchesStatus = true;
      }

      return matchesSearch && matchesType && matchesStatus;
    });

    // Sort by scheduled date (always upcoming/soonest first)
    filtered.sort((a, b) => {
      let comparison = 0;

      // Primary sort: scheduledAt date (ascending - soonest first)
      comparison = new Date(a.scheduledAt) - new Date(b.scheduledAt);

      // Secondary sort: If user clicked a column header, use that as tiebreaker
      if (comparison === 0 && sortBy !== 'scheduledAt') {
        switch (sortBy) {
          case 'client':
            comparison = a.clientName.localeCompare(b.clientName);
            break;
          case 'status':
            comparison = a.status.localeCompare(b.status);
            break;
          case 'type':
            comparison = a.displayType.localeCompare(b.displayType);
            break;
        }
        comparison = sortOrder === 'asc' ? comparison : -comparison;
      }

      return comparison;
    });

    return filtered;
  };

  const paginatedSms = () => {
    const filtered = filteredAndSortedSms();
    // Calculate total pages based on filtered results
    const calculatedTotalPages = Math.ceil(filtered.length / itemsPerPage);

    // Update totalPages state if it's different
    if (calculatedTotalPages !== totalPages) {
      setTotalPages(calculatedTotalPages);
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    return filtered.slice(startIndex, startIndex + itemsPerPage);
  };

  // Sorting handler
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Status icon utility
  const getStatusIcon = (status) => {
    switch (status) {
      case PLANNED_SMS_STATUS.SCHEDULED:
        return <Clock size={16} color="#3b82f6" />;
      case PLANNED_SMS_STATUS.SENT:
        return <CheckCircle size={16} color="#22c55e" />;
      case PLANNED_SMS_STATUS.FAILED:
        return <XCircle size={16} color="#ef4444" />;
      case PLANNED_SMS_STATUS.SKIPPED:
        return <AlertTriangle size={16} color="#f59e0b" />;
      case PLANNED_SMS_STATUS.CANCELLED:
        return <X size={16} color="#6b7280" />;
      default:
        return <AlertCircle size={16} color="#6b7280" />;
    }
  };

  return {
    // Data
    plannedSms,
    statistics,
    loading,
    error,

    // Filters
    searchTerm,
    setSearchTerm,
    typeFilter,
    setTypeFilter,
    timeFilter,
    setTimeFilter,
    statusFilter,
    setStatusFilter,

    // Pagination
    currentPage,
    setCurrentPage,
    totalPages,

    // Modals
    selectedSms,
    showMessageModal,
    showEditModal,

    // Computed data
    filteredAndSortedSms,
    paginatedSms,

    // Actions
    handleCancelSms,
    handleDeleteSms,
    handleMarkAsSent,
    handleUpdateSms,
    handleRefreshPlanning,
    handleViewMessage,
    handleEditMessage,
    closeModals,
    handleSort,
    refreshData,
    loadPlannedSms,

    // Utilities
    getStatusIcon
  };
};