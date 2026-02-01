import { useState } from 'react';
import { useNotification } from '@/contexts/NotificationContext';
import { settingsApi } from '@/services/api/settings';

export const useSMSHandlers = ({
  onSendSMS,
  settings,
  generateSMSMessage,
  getMaintenancePrice,
  handleAuthError,
  showSuccessMessage
}) => {
  const [showSMSDialog, setShowSMSDialog] = useState(null);
  const [smsMessage, setSmsMessage] = useState('');
  const [originalSmsMessage, setOriginalSmsMessage] = useState(''); // Store original message to detect edits
  const [smsLoading, setSmsLoading] = useState(false);
  const notification = useNotification();

  const handleSendSMS = async (client, device) => {
    if (!onSendSMS) {
      notification.showError('Funkcja wysyłania SMS nie jest dostępna');
      return;
    }

    try {
      setSmsLoading(true);

      // For custom clients from "Zgłoszenia", show simple empty SMS dialog
      // Custom clients don't have devices in the Device table, so skip preview generation
      if (client.isCustomClient) {
        setShowSMSDialog({ client, device });
        setSmsMessage(''); // Empty message for custom clients
        setOriginalSmsMessage(''); // Mark as empty original
        return;
      }

      // For regular clients, use backend API to generate preview with real confirmation link
      try {
        const previewData = {
          deviceId: device.id,
          clientName: client.name,
          deviceType: device.deviceType,
          deviceName: device.deviceName || device.deviceType,
          address: device.address,
          inspectionDate: device.nextInspectionDate ?
            new Date(device.nextInspectionDate).toLocaleDateString('pl-PL') :
            'do ustalenia'
        };

        const previewResponse = await settingsApi.previewSmsForDevice(previewData);

        const generatedMessage = previewResponse.message || previewResponse;
        setShowSMSDialog({ client, device });
        setSmsMessage(generatedMessage);
        setOriginalSmsMessage(generatedMessage); // Store original for comparison

      } catch (backendError) {
        console.error('Error getting SMS preview from backend:', backendError);

        const fallbackMessage = `Przypomnienie o przeglądzie ${device.deviceType} w adresie ${device.address}. Błąd podczas generowania podglądu.`;

        setShowSMSDialog({ client, device });
        setSmsMessage(fallbackMessage);
        setOriginalSmsMessage(fallbackMessage); // Store fallback as original too

        const errorInfo = handleAuthError(backendError);
        if (errorInfo) {
          // Fallback used due to backend error
        }
      }
    } finally {
      setSmsLoading(false);
    }
  };

  const handleConfirmSMS = async () => {
    if (!showSMSDialog || !onSendSMS) {
      return;
    }

    try {
      setSmsLoading(true);

      // Extract phone number from client (check both telefon and phone fields)
      const phoneNumber = showSMSDialog.client.telefon || showSMSDialog.client.phone;

      if (!phoneNumber) {
        notification.showError('Brak numeru telefonu dla tego klienta');
        return;
      }

      // Check if this is a custom client or if message was edited by user
      const isCustomClient = showSMSDialog.client.isCustomClient;
      const isMessageEdited = smsMessage.trim() !== originalSmsMessage.trim();

      let result;

      // Custom clients or edited messages always use custom message API
      if (isCustomClient || isMessageEdited) {
        // Validate that message is not empty for custom clients
        if (isCustomClient && !smsMessage.trim()) {
          notification.showError('Wpisz treść wiadomości SMS');
          return;
        }

        // For custom clients, don't include device ID (their devices are in CustomClientDevice table, not Device table)
        // For regular clients with edited messages, keep the device ID for history tracking
        const deviceWithPhone = isCustomClient ? {
          phone: phoneNumber
          // No device ID - custom clients don't have devices in the regular Device table
        } : {
          ...showSMSDialog.device,
          phone: phoneNumber
        };

        result = await onSendSMS(deviceWithPhone, 'custom', smsMessage);
      } else {
        // Use inspection reminder API to generate fresh confirmation link
        result = await onSendSMS(showSMSDialog.device, 'inspection_reminder');
      }

      if (!result) {
        notification.showError('Błąd: nie otrzymano odpowiedzi z serwera');
        return;
      }

      if (result.success) {
        const successMsg = isCustomClient
          ? 'SMS został wysłany pomyślnie!'
          : 'SMS z przypomnieniem o przeglądzie został wysłany pomyślnie!';
        showSuccessMessage(successMsg);
        setShowSMSDialog(null);
        setSmsMessage('');
        setOriginalSmsMessage('');
      } else {
        // Show specific error message from backend
        const errorMsg = result.error || result.message || 'Nie udało się wysłać wiadomości tekstowej';
        notification.showError(errorMsg);
      }
    } catch (error) {
      console.error('[useSMSHandlers] Error sending SMS:', error);
      const errorInfo = handleAuthError(error);
      const errorMsg = error.response?.data?.message || error.message || 'Nie udało się wysłać wiadomości tekstowej';
      notification.showError(errorMsg);
    } finally {
      setSmsLoading(false);
    }
  };

  const handleCustomSMS = async (client, device, customMessage) => {
    if (!onSendSMS) {
      return;
    }

    try {
      const result = await onSendSMS(device, 'custom', customMessage);

      if (result.success) {
        showSuccessMessage('SMS niestandardowy został wysłany pomyślnie!');
      } else {
        // Show specific error message from backend
        const errorMsg = result.error || result.message || 'Nie udało się wysłać wiadomości tekstowej';
        notification.showError(errorMsg);
      }
    } catch (error) {
      const errorInfo = handleAuthError(error);
      const errorMsg = error.response?.data?.message || error.message || 'Nie udało się wysłać wiadomości tekstowej';
      notification.showError(errorMsg);
    }
  };

  const closeSMSDialog = () => {
    setShowSMSDialog(null);
    setSmsMessage('');
    setOriginalSmsMessage('');
  };

  const handleTemplateSelect = async (template, device, client) => {
    try {
      // Use backend API to generate preview with replaced variables
      const previewData = {
        deviceId: device.id,
        clientName: client.name,
        deviceType: device.deviceType,
        deviceName: device.deviceName || device.deviceType,
        address: device.address,
        inspectionDate: device.nextInspectionDate ?
          new Date(device.nextInspectionDate).toLocaleDateString('pl-PL') :
          'do ustalenia',
        customTemplate: template.content  // Send the template content to backend
      };

      // Call backend to replace variables in the custom template
      const response = await settingsApi.previewCustomTemplate(previewData);
      const messageWithVariables = response.message || response;

      setSmsMessage(messageWithVariables);
      setOriginalSmsMessage(messageWithVariables); // Mark as original so it's not treated as edited

    } catch (error) {
      console.error('[useSMSHandlers] Error replacing template variables:', error);
      // Fallback: use raw template
      notification.showWarning('Nie udało się wczytać podglądu szablonu');
      setSmsMessage(template.content);
      setOriginalSmsMessage(template.content);
    }
  };

  const handleResetToDefault = async (device, client) => {
    try {
      // Use backend API to generate default inspection reminder preview
      const previewData = {
        deviceId: device.id,
        clientName: client.name,
        deviceType: device.deviceType,
        deviceName: device.deviceName || device.deviceType,
        address: device.address,
        inspectionDate: device.nextInspectionDate ?
          new Date(device.nextInspectionDate).toLocaleDateString('pl-PL') :
          'do ustalenia'
      };

      const response = await settingsApi.previewSmsForDevice(previewData);
      const defaultMessage = response.message || response;

      setSmsMessage(defaultMessage);
      setOriginalSmsMessage(defaultMessage); // Mark as original

    } catch (error) {
      console.error('[useSMSHandlers] Error loading default template:', error);
      notification.showWarning('Nie udało się wczytać domyślnego szablonu');
    }
  };

  return {
    showSMSDialog,
    smsMessage,
    setSmsMessage,
    smsLoading,
    handleSendSMS,
    handleConfirmSMS,
    handleCustomSMS,
    closeSMSDialog,
    handleTemplateSelect,
    handleResetToDefault
  };
};