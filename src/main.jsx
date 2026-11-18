import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            style: { borderRadius: '14px', background: '#12121a', color: '#fff', fontSize: '14px', fontWeight: 500 },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
