import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext.jsx'
import { Toaster } from 'react-hot-toast'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
      {/* Toast container */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#ffffff',
            color: '#1f2937',
            boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
            borderRadius: '8px',
            fontSize: '14px'
          }
        }}
      />
    </AuthProvider>
  </React.StrictMode>
)
