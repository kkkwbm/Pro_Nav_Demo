// Demo mode configuration and utilities
// This file controls whether the app runs in demo mode

export const DEMO_MODE = true;

// Simulated delay to make it feel more realistic
export const simulateDelay = (ms = 300) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Generate unique IDs for new items
let nextClientId = 100;
let nextDeviceId = 100;
let nextServiceId = 100;

export const generateClientId = () => ++nextClientId;
export const generateDeviceId = () => ++nextDeviceId;
export const generateServiceId = () => ++nextServiceId;

// Demo notification messages
export const demoNotifications = {
  smsSuccess: 'SMS wysłany pomyślnie (tryb demo - wiadomość nie została faktycznie wysłana)',
  smsFailed: 'Błąd wysyłania SMS (tryb demo)',
  clientAdded: 'Klient dodany pomyślnie (tryb demo)',
  clientUpdated: 'Dane klienta zaktualizowane (tryb demo)',
  clientDeleted: 'Klient usunięty (tryb demo)',
  deviceAdded: 'Urządzenie dodane pomyślnie (tryb demo)',
  deviceUpdated: 'Urządzenie zaktualizowane (tryb demo)',
  deviceDeleted: 'Urządzenie usunięte (tryb demo)',
  serviceCreated: 'Serwis utworzony pomyślnie (tryb demo)',
  serviceUpdated: 'Serwis zaktualizowany (tryb demo)',
  serviceDeleted: 'Serwis usunięty (tryb demo)',
  settingsUpdated: 'Ustawienia zapisane (tryb demo)',
};
