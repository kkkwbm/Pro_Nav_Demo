// Create this as a temporary component to debug API key issues
// src/components/debug/ApiKeyDebug.jsx

import React from 'react';

const ApiKeyDebug = () => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  
  console.log('=== API KEY DEBUG ===');
  console.log('Raw API Key:', apiKey);
  console.log('API Key exists:', !!apiKey);
  console.log('API Key length:', apiKey?.length || 0);
  console.log('Starts with AIza:', apiKey?.startsWith('AIza') || false);
  console.log('All env vars:', import.meta.env);
  console.log('===================');

  return (
    <div style={{
      position: 'fixed',
      top: 10,
      left: 10,
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 9999,
      fontFamily: 'monospace'
    }}>
      <div>API Key Status:</div>
      <div>Exists: {apiKey ? '✅' : '❌'}</div>
      <div>Length: {apiKey?.length || 0}</div>
      <div>Valid format: {apiKey?.startsWith('AIza') ? '✅' : '❌'}</div>
      <div>First 10 chars: {apiKey?.substring(0, 10) || 'None'}</div>
    </div>
  );
};

export default ApiKeyDebug;