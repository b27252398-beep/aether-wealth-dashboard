import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'sonner'
import App from './App'
import './index.css'

import { ErrorBoundary } from './ErrorBoundary'

const rootEl = document.getElementById('root')
if (!rootEl) throw new Error('Root element not found — check your index.html')

ReactDOM.createRoot(rootEl).render(
  <ErrorBoundary>
    <BrowserRouter basename="/aether-wealth-dashboard">
    <App />
    <Toaster
      position="bottom-right"
      toastOptions={{
        style: {
          background: '#171f33',
          border: '1px solid rgba(255,255,255,0.1)',
          color: '#dae2fd',
          fontFamily: 'Inter, system-ui, sans-serif',
        },
      }}
    />
  </BrowserRouter>
  </ErrorBoundary>
)
