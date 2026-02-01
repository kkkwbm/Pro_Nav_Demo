import React, { useState, useEffect } from 'react';

const Loading = ({
  size = 'medium',
  color = 'indigo',
  fullScreen = false,
  message = 'Loading...',
  detailed = false // New prop for enhanced loading screen
}) => {
  const [dots, setDots] = useState('');
  const [loadingStep, setLoadingStep] = useState(0);

  // Animated dots effect
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Loading steps progression (for detailed mode)
  useEffect(() => {
    if (!detailed) return;

    const steps = [
      { step: 0, delay: 0 },
      { step: 1, delay: 800 },
      { step: 2, delay: 1600 },
      { step: 3, delay: 2400 }
    ];

    const timers = steps.map(({ step, delay }) =>
      setTimeout(() => setLoadingStep(step), delay)
    );

    return () => timers.forEach(timer => clearTimeout(timer));
  }, [detailed]);

  const loadingSteps = [
    { icon: '🔐', text: 'Uruchamianie systemu', color: '#e67e22' },
    { icon: '📡', text: 'Łączenie z serwerem', color: '#3498db' },
    { icon: '🗺️', text: 'Ładowanie zasobów', color: '#16a085' },
    { icon: '✨', text: 'Prawie gotowe', color: '#27ae60' }
  ];

  const sizeClasses = {
    small: 'h-8 w-8',
    medium: 'h-12 w-12',
    large: 'h-16 w-16',
  };

  const colorClasses = {
    indigo: 'border-indigo-600',
    blue: 'border-blue-600',
    green: 'border-green-600',
    red: 'border-red-600',
    gray: 'border-gray-600',
  };

  // Enhanced detailed loading screen for fullScreen mode
  if (fullScreen && detailed) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated background circles */}
        <div style={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          top: '-250px',
          right: '-250px',
          animation: 'pulse 3s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute',
          width: '400px',
          height: '400px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          bottom: '-200px',
          left: '-200px',
          animation: 'pulse 3s ease-in-out infinite 1s'
        }} />

        {/* Main loading card */}
        <div style={{
          background: 'white',
          borderRadius: '24px',
          padding: '48px 64px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          maxWidth: '500px',
          width: '90%',
          position: 'relative',
          zIndex: 1
        }}>
          {/* Logo/Icon */}
          <div style={{
            fontSize: '64px',
            textAlign: 'center',
            marginBottom: '24px',
            animation: 'bounce 2s ease-in-out infinite'
          }}>
            🔧
          </div>

          {/* Main title */}
          <h2 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#2c3e50',
            textAlign: 'center',
            marginBottom: '8px'
          }}>
            SerwisPro
          </h2>

          <p style={{
            fontSize: '14px',
            color: '#6b7280',
            textAlign: 'center',
            marginBottom: '32px'
          }}>
            Przygotowujemy system{dots}
          </p>

          {/* Progress bar */}
          <div style={{
            width: '100%',
            height: '6px',
            background: '#e5e7eb',
            borderRadius: '3px',
            overflow: 'hidden',
            marginBottom: '32px'
          }}>
            <div style={{
              height: '100%',
              background: 'linear-gradient(90deg, #e67e22 0%, #d35400 100%)',
              borderRadius: '3px',
              width: `${(loadingStep + 1) * 25}%`,
              transition: 'width 0.5s ease-out',
              animation: 'shimmer 2s infinite'
            }} />
          </div>

          {/* Loading steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {loadingSteps.map((step, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  opacity: loadingStep >= index ? 1 : 0.3,
                  transform: loadingStep >= index ? 'translateX(0)' : 'translateX(-10px)',
                  transition: 'all 0.3s ease-out'
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: loadingStep >= index ? step.color : '#e5e7eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  transition: 'all 0.3s ease-out',
                  boxShadow: loadingStep >= index ? `0 0 20px ${step.color}40` : 'none'
                }}>
                  {loadingStep > index ? '✓' : step.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: loadingStep >= index ? '600' : '400',
                    color: loadingStep >= index ? '#1f2937' : '#9ca3af',
                    transition: 'all 0.3s ease-out'
                  }}>
                    {step.text}
                  </div>
                </div>
                {loadingStep === index && (
                  <div style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid',
                    borderColor: `${step.color} transparent transparent transparent`,
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                )}
              </div>
            ))}
          </div>

          {/* Helper text */}
          <p style={{
            marginTop: '32px',
            fontSize: '12px',
            color: '#9ca3af',
            textAlign: 'center'
          }}>
            Pierwsze uruchomienie może potrwać kilka sekund
          </p>
        </div>

        {/* CSS Animations */}
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 0.1; }
            50% { transform: scale(1.1); opacity: 0.15; }
          }
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          @keyframes shimmer {
            0% { background-position: -500px 0; }
            100% { background-position: 500px 0; }
          }
        `}</style>
      </div>
    );
  }

  // Regular spinner for non-detailed mode
  const spinner = (
    <div className="flex flex-col items-center justify-center">
      <div
        className={`animate-spin rounded-full border-b-2 ${sizeClasses[size]} ${colorClasses[color]}`}
      ></div>
      {message && (
        <p className="mt-4 text-sm text-gray-600">{message}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default Loading;