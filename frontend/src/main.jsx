import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import { SidebarProvider } from './context/SidebarContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <SidebarProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'rgba(13, 18, 34, 0.95)',
              color: '#F8FAFC',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(0, 217, 255, 0.2)',
              borderRadius: '16px',
              padding: '16px 20px',
              fontSize: '0.875rem',
              fontWeight: '500',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 20px rgba(0, 217, 255, 0.05)',
            },
            success: {
              iconTheme: { primary: '#22C55E', secondary: '#040814' },
              style: { border: '1px solid rgba(34, 197, 94, 0.3)', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 20px rgba(34, 197, 94, 0.1)' }
            },
            error: {
              iconTheme: { primary: '#FF4D6D', secondary: '#040814' },
              style: { border: '1px solid rgba(255, 77, 109, 0.3)', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 20px rgba(255, 77, 109, 0.1)' }
            }
          }}
        />
      </SidebarProvider>
    </BrowserRouter>
  </React.StrictMode>
);
