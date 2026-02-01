import { useState, useEffect } from 'react';
import { DEMO_MODE, simulateDelay, generateClientId, generateDeviceId, demoNotifications } from '../demo/demoMode';
import { mockClients as initialMockClients, mockDevices as initialMockDevices } from '../demo/mockData';
import logger from '../utils/logger';

export const useClients = () => {
  const [clients, setClients] = useState([]);
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch clients - in demo mode, use mock data
  const fetchClients = async () => {
    try {
      setLoading(true);
      setError(null);

      if (DEMO_MODE) {
        await simulateDelay(500);

        // Deep copy mock data to allow modifications
        const clientsCopy = JSON.parse(JSON.stringify(initialMockClients));
        const devicesCopy = JSON.parse(JSON.stringify(initialMockDevices));

        setClients(clientsCopy);
        setDevices(devicesCopy);
        logger.debug('[useClients] Demo mode: Loaded mock clients and devices');
        return;
      }

      // Non-demo mode code would go here
      setError('Demo mode only');

    } catch (err) {
      logger.error('[useClients] Error:', err);
      setError('Nie udało się pobrać klientów');
    } finally {
      setLoading(false);
    }
  };

  // Load clients on mount
  useEffect(() => {
    fetchClients();
  }, []);

  // Add client with their first device
  const addClient = async (clientData) => {
    try {
      logger.debug('[useClients] Adding client with device:', clientData);

      if (DEMO_MODE) {
        await simulateDelay(300);

        const newClientId = generateClientId();
        const newDeviceId = generateDeviceId();

        const newDevice = {
          id: newDeviceId,
          deviceId: newDeviceId,
          clientId: newClientId,
          clientName: `${clientData.firstName} ${clientData.lastName}`,
          address: `${clientData.ulica} ${clientData.nrDomu}${clientData.nrLokalu ? '/' + clientData.nrLokalu : ''}, ${clientData.kodPocztowy} ${clientData.miejscowosc}`,
          position: clientData.position || { lat: 52.2297, lng: 21.0122 },
          deviceType: clientData.deviceType || 'Pompa ciepła',
          typUrzadzenia: clientData.deviceType || 'Pompa ciepła',
          deviceName: clientData.deviceName || '',
          nazwaUrzadzenia: clientData.deviceName || '',
          installationDate: clientData.installationDate,
          nextInspectionDate: clientData.nextInspectionDate,
          notes: clientData.notes || '',
          serviceConfirmed: false,
          ulica: clientData.ulica,
          nrDomu: clientData.nrDomu,
          nrLokalu: clientData.nrLokalu,
          kodPocztowy: clientData.kodPocztowy,
          miejscowosc: clientData.miejscowosc,
          latitude: clientData.position?.lat || 52.2297,
          longitude: clientData.position?.lng || 21.0122,
        };

        const newClient = {
          id: newClientId,
          name: `${clientData.firstName} ${clientData.lastName}`,
          firstName: clientData.firstName,
          lastName: clientData.lastName,
          imie: clientData.firstName,
          nazwisko: clientData.lastName,
          phone: clientData.phone,
          telefon: clientData.phone,
          devices: [newDevice],
        };

        setClients(prev => [...prev, newClient]);
        setDevices(prev => [...prev, {
          ...newDevice,
          id: newClientId,
          name: newClient.name,
          imie: newClient.firstName,
          nazwisko: newClient.lastName,
          telefon: newClient.phone,
          phone: newClient.phone,
        }]);

        logger.debug('[useClients] Demo: Client added successfully');
        return { success: true, client: newClient };
      }

      return { success: false, error: 'Demo mode only' };

    } catch (err) {
      logger.error('[useClients] Error adding client:', err);
      return { success: false, error: 'Nie udało się dodać klienta' };
    }
  };

  // Update client with proper error handling
  const updateClient = async (clientId, updates) => {
    try {
      logger.debug('[useClients] Updating client:', clientId, updates);

      if (DEMO_MODE) {
        await simulateDelay(300);

        const updatedName = updates.firstName && updates.lastName
          ? `${updates.firstName} ${updates.lastName}`
          : null;

        setClients(prev => prev.map(client =>
          client.id === clientId
            ? {
                ...client,
                ...updates,
                name: updatedName || client.name,
              }
            : client
        ));

        if (updatedName || updates.phone) {
          setDevices(prev => prev.map(device =>
            device.clientId === clientId
              ? {
                  ...device,
                  clientName: updatedName || device.clientName,
                  name: updatedName || device.name,
                  clientPhone: updates.phone || device.clientPhone,
                  telefon: updates.phone || device.telefon,
                  phone: updates.phone || device.phone,
                }
              : device
          ));
        }

        logger.debug('[useClients] Demo: Client updated successfully');
        return { success: true };
      }

      return { success: false, error: 'Demo mode only' };

    } catch (err) {
      logger.error('[useClients] Error updating client:', err);
      return { success: false, error: 'Nie udało się zaktualizować klienta' };
    }
  };

  // Add device to client
  const addDeviceToClient = async (clientId, deviceData) => {
    try {
      logger.debug('[useClients] Adding device to client:', clientId, deviceData);

      if (DEMO_MODE) {
        await simulateDelay(300);

        const client = clients.find(c => c.id === clientId);
        if (!client) {
          return { success: false, error: 'Nie znaleziono klienta' };
        }

        const newDeviceId = generateDeviceId();

        const newDevice = {
          id: newDeviceId,
          deviceId: newDeviceId,
          clientId: clientId,
          clientName: client.name,
          address: `${deviceData.ulica} ${deviceData.nrDomu}${deviceData.nrLokalu ? '/' + deviceData.nrLokalu : ''}, ${deviceData.kodPocztowy} ${deviceData.miejscowosc}`,
          position: deviceData.position || { lat: 52.2297, lng: 21.0122 },
          deviceType: deviceData.deviceType || 'Pompa ciepła',
          typUrzadzenia: deviceData.deviceType || 'Pompa ciepła',
          deviceName: deviceData.deviceName || '',
          nazwaUrzadzenia: deviceData.deviceName || '',
          installationDate: deviceData.installationDate,
          nextInspectionDate: deviceData.nextInspectionDate,
          notes: deviceData.notes || '',
          serviceConfirmed: false,
          ulica: deviceData.ulica,
          nrDomu: deviceData.nrDomu,
          nrLokalu: deviceData.nrLokalu,
          kodPocztowy: deviceData.kodPocztowy,
          miejscowosc: deviceData.miejscowosc,
          latitude: deviceData.position?.lat || 52.2297,
          longitude: deviceData.position?.lng || 21.0122,
        };

        setClients(prev => prev.map(c => {
          if (c.id === clientId) {
            return {
              ...c,
              devices: [...(c.devices || []), newDevice]
            };
          }
          return c;
        }));

        setDevices(prev => [...prev, {
          ...newDevice,
          id: clientId,
          name: client.name,
          imie: client.firstName,
          nazwisko: client.lastName,
          telefon: client.phone,
          phone: client.phone,
        }]);

        logger.debug('[useClients] Demo: Device added successfully');
        return { success: true, device: newDevice };
      }

      return { success: false, error: 'Demo mode only' };

    } catch (err) {
      logger.error('[useClients] Error adding device:', err);
      return { success: false, error: 'Nie udało się dodać urządzenia' };
    }
  };

  // Update device
  const updateDevice = async (deviceId, updates) => {
    try {
      logger.debug('[useClients] Updating device:', deviceId, updates);

      if (DEMO_MODE) {
        await simulateDelay(300);

        // Update address if address fields changed
        let newAddress = null;
        if (updates.ulica || updates.nrDomu || updates.kodPocztowy || updates.miejscowosc) {
          newAddress = `${updates.ulica || ''} ${updates.nrDomu || ''}${updates.nrLokalu ? '/' + updates.nrLokalu : ''}, ${updates.kodPocztowy || ''} ${updates.miejscowosc || ''}`;
        }

        // Update client's devices
        setClients(prev => prev.map(client => {
          const deviceIndex = client.devices?.findIndex(d => d.id === deviceId);
          if (deviceIndex !== -1 && deviceIndex !== undefined) {
            const updatedDevices = [...client.devices];
            updatedDevices[deviceIndex] = {
              ...updatedDevices[deviceIndex],
              ...updates,
              address: newAddress || updatedDevices[deviceIndex].address,
            };
            return { ...client, devices: updatedDevices };
          }
          return client;
        }));

        // Update devices list
        setDevices(prev => prev.map(d => {
          if (d.deviceId === deviceId) {
            return {
              ...d,
              ...updates,
              address: newAddress || d.address,
            };
          }
          return d;
        }));

        logger.debug('[useClients] Demo: Device updated successfully');
        return { success: true };
      }

      return { success: false, error: 'Demo mode only' };

    } catch (err) {
      logger.error('[useClients] Error updating device:', err);
      return { success: false, error: 'Nie udało się zaktualizować urządzenia' };
    }
  };

  // Delete device
  const deleteDevice = async (deviceId) => {
    try {
      logger.debug('[useClients] Deleting device:', deviceId);

      if (DEMO_MODE) {
        await simulateDelay(300);

        const device = devices.find(d => d.deviceId === deviceId);

        if (device) {
          setClients(prev => prev.map(client => {
            if (client.id === device.clientId) {
              return {
                ...client,
                devices: client.devices.filter(d => d.id !== deviceId)
              };
            }
            return client;
          }));

          setDevices(prev => prev.filter(d => d.deviceId !== deviceId));
        }

        logger.debug('[useClients] Demo: Device deleted successfully');
        return { success: true };
      }

      return { success: false, error: 'Demo mode only' };

    } catch (err) {
      logger.error('[useClients] Error deleting device:', err);
      return { success: false, error: 'Nie udało się usunąć urządzenia' };
    }
  };

  // Send SMS - in demo mode, simulate success
  const sendSMS = async (deviceData, messageType = 'inspection_reminder', customMessage = null) => {
    try {
      logger.debug('[useClients] Sending SMS:', deviceData, 'Type:', messageType);

      if (DEMO_MODE) {
        await simulateDelay(500);

        logger.debug('[useClients] Demo: SMS sent successfully (simulated)');
        return {
          success: true,
          message: demoNotifications.smsSuccess
        };
      }

      return { success: false, error: 'Demo mode only' };

    } catch (err) {
      logger.error('[useClients] Error sending SMS:', err);
      return { success: false, error: 'Nie udało się wysłać SMS' };
    }
  };

  // Delete client
  const deleteClient = async (clientId) => {
    try {
      logger.debug('[useClients] Deleting client:', clientId);

      if (DEMO_MODE) {
        await simulateDelay(300);

        setClients(prev => prev.filter(c => c.id !== clientId));
        setDevices(prev => prev.filter(d => d.clientId !== clientId));

        logger.debug('[useClients] Demo: Client deleted successfully');
        return { success: true };
      }

      return { success: false, error: 'Demo mode only' };

    } catch (err) {
      logger.error('[useClients] Error deleting client:', err);
      return { success: false, error: 'Nie udało się usunąć klienta' };
    }
  };

  return {
    clients,
    devices,
    loading,
    error,
    fetchClients,
    addClient,
    updateClient,
    deleteClient,
    addDeviceToClient,
    updateDevice,
    deleteDevice,
    sendSMS
  };
};