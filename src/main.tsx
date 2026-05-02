import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { FinanceProvider } from './contexts/FinanceContext.tsx'

// Detect if app is running inside an iframe (portfolio embed)
if (window.self !== window.top) {
    document.body.classList.add('in-iframe');
}

// Check if root exists
const rootElement = document.getElementById('root');
if (!rootElement) {
    throw new Error('Failed to find the root element');
}

import { AuthProvider } from './contexts/AuthContext'

createRoot(rootElement).render(
    <StrictMode>
        <AuthProvider>
            <FinanceProvider>
                <App />
            </FinanceProvider>
        </AuthProvider>
    </StrictMode>,
)

// Registrar o Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(error => {
            console.error('Falha ao registrar Service Worker:', error);
        });
    });
}
