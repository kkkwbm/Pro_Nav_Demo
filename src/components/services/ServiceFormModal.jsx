import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import ClientSelector from './form/ClientSelector';
import ServiceDetails from './form/ServiceDetails';
import FormHeader from './form/FormHeader';
import ServicesAPI from '../../services/api/services';

const ServiceFormModal = ({
  isOpen,
  editingService,
  selectedDate,
  clients = [],
  preselectedClientId,
  preselectedDeviceId,
  onClose
}) => {
  const getInitialFormData = () => ({
    clientId: '',
    deviceId: '',
    serviceType: 'PRZEGLAD_OKRESOWY',
    date: '',
    startTime: '09:00',
    duration: 60,
    notes: '',
    technician: '',
    photos: [],
  });

  const [formData, setFormData] = useState(getInitialFormData());
  const [clientSearch, setClientSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showClientDropdown, setShowClientDropdown] = useState(false);

  // Helper function to format date to YYYY-MM-DD in local timezone
  const formatDateLocal = (date) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Helper function to format time to HH:MM in local timezone
  const formatTimeLocal = (date) => {
    if (!date) return '09:00';
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // Helper function to create local date from UTC datetime string
  const createLocalDateFromUTC = (utcDateTimeStr) => {
    const utcDate = new Date(utcDateTimeStr);
    // Create local date by adding timezone offset
    const localDate = new Date(utcDate.getTime() + (utcDate.getTimezoneOffset() * 60000));
    return localDate;
  };

  // Reset form when modal is closed
  useEffect(() => {
    if (!isOpen) {
      // Reset form state when modal closes
      setFormData(getInitialFormData());
      setClientSearch('');
      setSearchResults([]);
      setShowClientDropdown(false);
    }
  }, [isOpen]);

  // Initialize form data when opening
  useEffect(() => {
    if (isOpen) {
      if (editingService) {
        // Editing existing service - convert UTC times to local
        const startDate = createLocalDateFromUTC(editingService.startDateTime);
        const endDate = createLocalDateFromUTC(editingService.endDateTime);
        const duration = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60));
        
        setFormData({
          clientId: editingService.clientId.toString(),
          deviceId: editingService.deviceId.toString(),
          serviceType: editingService.serviceType,
          date: formatDateLocal(startDate),
          startTime: formatTimeLocal(startDate),
          duration: duration,
          notes: editingService.notes || '',
          technician: editingService.technician || '',
        });

        // Set client search for editing
        const editingClient = clients.find(c => c.id === editingService.clientId);
        if (editingClient) {
          setClientSearch(`${editingClient.imie} ${editingClient.nazwisko}`);
        }
      } else if (selectedDate) {
        // Creating new service with selected date
        setFormData(prev => ({
          ...getInitialFormData(),
          date: formatDateLocal(selectedDate),
          clientId: preselectedClientId ? preselectedClientId.toString() : '',
          deviceId: preselectedDeviceId ? preselectedDeviceId.toString() : '',
        }));
      } else {
        // Creating new service without date
        setFormData({
          ...getInitialFormData(),
          clientId: preselectedClientId ? preselectedClientId.toString() : '',
          deviceId: preselectedDeviceId ? preselectedDeviceId.toString() : '',
        });
      }

      // Set client search for preselected client
      if (preselectedClientId && clients.length > 0) {
        const preselectedClient = clients.find(c => c.id === preselectedClientId);
        if (preselectedClient) {
          setClientSearch(`${preselectedClient.imie} ${preselectedClient.nazwisko}`);
        }
      }
    }
  }, [isOpen, editingService, selectedDate, clients, preselectedClientId, preselectedDeviceId]);

  // Search clients with debouncing
  useEffect(() => {
    const searchClients = async () => {
      if (clientSearch.length < 2) {
        setSearchResults(clients.slice(0, 10));
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      try {
        const results = await ServicesAPI.searchClients(clientSearch);
        setSearchResults(results);
      } catch (err) {
        console.error('Search failed:', err);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const timeoutId = setTimeout(searchClients, 300);
    return () => clearTimeout(timeoutId);
  }, [clientSearch, clients]);

  // Initialize search results
  useEffect(() => {
    if (clients && clients.length > 0 && !clientSearch) {
      setSearchResults(clients.slice(0, 10));
    }
  }, [clients, clientSearch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('[data-client-search]')) {
        setShowClientDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const selectedClient = clients.find(c => c.id === parseInt(formData.clientId));

  const handleClientSelect = (client) => {
    setFormData({...formData, clientId: client.id.toString(), deviceId: ''});
    setClientSearch(`${client.imie} ${client.nazwisko}`);
    setShowClientDropdown(false);
  };

  const handleClientSearchChange = (value) => {
    setClientSearch(value);
    setShowClientDropdown(true);
    if (!value) {
      setFormData({...formData, clientId: '', deviceId: ''});
    }
  };

  if (!isOpen) return null;

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
      zIndex: 4000,
    }}>
      <div style={{
        background: 'white',
        borderRadius: 16,
        width: '90%',
        maxWidth: 700,
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      }}>
        <FormHeader 
          isEditing={!!editingService}
          onClose={onClose}
        />

        <div style={{ padding: 24 }}>
          <ClientSelector
            clientSearch={clientSearch}
            onClientSearchChange={handleClientSearchChange}
            showClientDropdown={showClientDropdown}
            setShowClientDropdown={setShowClientDropdown}
            searchResults={searchResults}
            isSearching={isSearching}
            onClientSelect={handleClientSelect}
            selectedClient={selectedClient}
            formData={formData}
            setFormData={setFormData}
            isEditing={!!editingService}
          />

          <ServiceDetails
            formData={formData}
            setFormData={setFormData}
            editingService={editingService}
          />

          <div style={{ display: 'flex', gap: 12 }}>
            <span
              style={{
                flex: 1,
                padding: '12px 24px',
                backgroundColor: '#9ca3af',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                opacity: 0.7,
                userSelect: 'none',
                pointerEvents: 'none',
              }}
            >
              <Check size={18} />
              Zaplanuj serwis
            </span>
            <button
              onClick={onClose}
              style={{
                flex: 1,
                padding: '12px 24px',
                backgroundColor: '#f3f4f6',
                color: '#374151',
                border: '1px solid #d1d5db',
                borderRadius: 8,
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
    </div>
  );
};

export default ServiceFormModal;