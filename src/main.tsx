import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { FinanceProvider } from './contexts/FinanceContext.tsx'

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
