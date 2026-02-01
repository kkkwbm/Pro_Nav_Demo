import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Create root element
const root = ReactDOM.createRoot(document.getElementById('root'));

// Add CSS reset and global styles to prevent scrolling issues
const globalStyles = `
  /* CSS Reset */
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  /* Base HTML and Body */
  html {
    height: 100%;
    overflow-x: hidden;
  }
  
  body {
    height: 100%;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #f9fafb;
    overflow-x: hidden;
  }
  
  /* Root element */
  #root {
    min-height: 100%;
    width: 100%;
  }
  
  /* Remove default button styles */
  button {
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
    border: none;
    background: none;
    cursor: pointer;
  }
  
  /* Input and form elements */
  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
  }
  
  /* Links */
  a {
    color: inherit;
    text-decoration: none;
  }
  
  /* Lists */
  ul, ol {
    list-style: none;
  }
  
  /* Scrollbar styling */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
  
  /* Prevent text selection on UI elements */
  .no-select {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
`;

// Inject global styles
if (!document.getElementById('global-styles')) {
  const styleElement = document.createElement('style');
  styleElement.id = 'global-styles';
  styleElement.textContent = globalStyles;
  document.head.appendChild(styleElement);
}

// Render the app
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);