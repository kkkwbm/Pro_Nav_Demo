import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Calendar, 
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useNotification } from '@/contexts/NotificationContext';

// Import components
import CalendarGrid from '../components/services/CalendarGrid';
import DayViewModal from '../components/services/DayViewModal';
import ServiceFormModal from '../components/services/ServiceFormModal';
import ServiceImages from '../components/services/ServiceImages';
import MonthNavigation from '../components/services/MonthNavigation';

// Import API service
import ServicesAPI from '../services/api/services';

const ServicesPage = () => {
  const notification = useNotification();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDayView, setShowDayView] = useState(false);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [monthServices, setMonthServices] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showServiceImages, setShowServiceImages] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [pendingNavigation, setPendingNavigation] = useState(null);
  const [highlightServiceId, setHighlightServiceId] = useState(null);

  useEffect(() => {
    loadClients();
    checkForServiceNavigation();
  }, []);

  useEffect(() => {
    loadMonthServices();
  }, [currentDate]);

  // Handle pending navigation after services are loaded
  useEffect(() => {
    if (pendingNavigation && !loading && monthServices.length >= 0) {
      const { serviceId, serviceDate } = pendingNavigation;
      setSelectedDate(serviceDate);
      setShowDayView(true);
      setHighlightServiceId(serviceId);
      setPendingNavigation(null);
    }
  }, [pendingNavigation, loading, monthServices]);

  // Check for service navigation from service history
  const checkForServiceNavigation = () => {
    const highlightServiceId = sessionStorage.getItem('highlightServiceId');
    const highlightServiceDate = sessionStorage.getItem('highlightServiceDate');
    
    if (highlightServiceId && highlightServiceDate) {
      // Clear the session storage
      sessionStorage.removeItem('highlightServiceId');
      sessionStorage.removeItem('highlightServiceDate');
      
      // Navigate to the service date
      const serviceDate = new Date(highlightServiceDate);
      
      // Set the current date to the service month
      setCurrentDate(serviceDate);
      
      // Set pending navigation to be handled after services load
      setPendingNavigation({
        serviceId: highlightServiceId,
        serviceDate: serviceDate
      });
    }
  };

  const loadClients = async () => {
    try {
      const clientsData = await ServicesAPI.getClients();
      setClients(clientsData);
    } catch (err) {
      console.error('Failed to load clients:', err);
      notification.showError('Nie udało się załadować klientów');
      setError('Nie udało się załadować listy klientów');
    }
  };

  const loadMonthServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const startDate = new Date(year, month, 1);
      const endDate = new Date(year, month + 1, 0, 23, 59, 59);
      
      const services = await ServicesAPI.getServicesForDateRange(startDate, endDate);
      setMonthServices(services);
    } catch (err) {
      console.error('Failed to load services:', err);
      notification.showError('Nie udało się załadować serwisów');
      setError('Nie udało się załadować serwisów');
      setMonthServices([]);
    } finally {
      setLoading(false);
    }
  };

  const getServicesForDay = (date) => {
    if (!date) return [];
    return monthServices.filter(service => {
      const serviceDate = new Date(service.startDateTime);
      return serviceDate.getDate() === date.getDate() &&
             serviceDate.getMonth() === date.getMonth() &&
             serviceDate.getFullYear() === date.getFullYear();
    });
  };

  const handleDayClick = (date) => {
    setSelectedDate(date);
    setShowDayView(true);
  };

  const handleAddService = (date = null) => {
    setSelectedDate(date);
    setEditingService(null);
    setShowServiceForm(true);
    setShowDayView(false);
  };

  const handleEditService = (service) => {
    setEditingService(service);
    setShowServiceForm(true);
    setShowDayView(false);
  };

  const handleDeleteService = async (service) => {
    if (window.confirm(`Czy na pewno chcesz usunąć serwis dla ${service.clientName}?`)) {
      try {
        await ServicesAPI.deleteService(service.id);
        await loadMonthServices();
        setShowDayView(false);
      } catch (err) {
        notification.showError('Nie udało się zaktualizować serwisu');
      }
    }
  };

  const handleSubmitService = async (data) => {
    try {
      let result;
      if (editingService) {
        result = await ServicesAPI.updateService(editingService.id, data);
      } else {
        result = await ServicesAPI.createService(data);
      }

      await loadMonthServices();

      // Return the result so ServiceFormModal can get the service ID for photo uploads
      return result;
    } catch (error) {
      console.error('Error submitting service:', error);

      // Re-throw the error so the form can handle it and display the message
      throw error;
    }
  };

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleMonthSelect = (monthIndex) => {
    setCurrentDate(new Date(currentDate.getFullYear(), monthIndex));
  };

  const handleViewServiceImages = (service) => {
    setSelectedService(service);
    setShowServiceImages(true);
    setShowDayView(false);
  };

  return (
    <div style={{ padding: 20, paddingTop: 85, minHeight: '100vh', backgroundColor: '#f5f3ef' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
        flexWrap: 'wrap',
        gap: 16
      }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0, color: '#2c3e50' }}>
          Kalendarz Serwisów
        </h1>
        <button
          onClick={() => setCurrentDate(new Date())}
          style={{
            padding: '8px 16px',
            backgroundColor: '#fff',
            border: '1px solid #d1d5db',
            borderRadius: 4,
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            transition: 'all 0.2s ease'
          }}
        >
          <Calendar size={16} />
          Dzisiaj
        </button>
      </div>

      <div style={{
        backgroundColor: 'white',
        borderRadius: 6,
        padding: 20,
        boxShadow: '0 3px 10px rgba(0, 0, 0, 0.15)',
        borderLeft: '4px solid #e67e22',
        marginBottom: 20,
        position: 'relative',
      }}>
        <MonthNavigation
          currentDate={currentDate}
          onPreviousMonth={handlePreviousMonth}
          onNextMonth={handleNextMonth}
          onMonthSelect={handleMonthSelect}
        />

        {error && (
          <div style={{
            padding: 12,
            backgroundColor: '#fef2f2',
            color: '#c0392b',
            borderRadius: 4,
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        {loading ? (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 400,
          }}>
            <Loader2 size={48} className="animate-spin" color="#e67e22" />
          </div>
        ) : (
          <CalendarGrid
            currentDate={currentDate}
            services={monthServices}
            onDayClick={handleDayClick}
            onServiceClick={handleEditService}
          />
        )}
      </div>

      <button
        onClick={() => handleAddService(null)}
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          width: 56,
          height: 56,
          borderRadius: '50%',
          backgroundColor: '#27ae60',
          color: 'white',
          border: 'none',
          boxShadow: '0 4px 12px rgba(39, 174, 96, 0.3)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.backgroundColor = '#229954';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.backgroundColor = '#27ae60';
        }}
        title="Dodaj nowy serwis"
      >
        <Plus size={24} />
      </button>

      {showDayView && (
        <DayViewModal
          date={selectedDate}
          services={selectedDate ? getServicesForDay(selectedDate) : []}
          onClose={() => {
            setShowDayView(false);
            setSelectedDate(null);
            setHighlightServiceId(null);
          }}
          onAddService={() => handleAddService(selectedDate)}
          onEditService={handleEditService}
          onDeleteService={handleDeleteService}
          onViewImages={handleViewServiceImages}
          highlightServiceId={highlightServiceId}
        />
      )}

      <ServiceFormModal
        isOpen={showServiceForm}
        editingService={editingService}
        selectedDate={selectedDate}
        clients={clients}
        onSubmit={handleSubmitService}
        onClose={() => {
          setShowServiceForm(false);
          setEditingService(null);
          setSelectedDate(null);
        }}
      />

      <ServiceImages
        serviceId={selectedService?.id}
        isOpen={showServiceImages}
        onClose={() => {
          setShowServiceImages(false);
          setSelectedService(null);
        }}
      />
    </div>
  );
};

export default ServicesPage;