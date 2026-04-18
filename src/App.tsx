import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Cards from './pages/Cards';
import Goals from './pages/Goals';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Categories from './pages/Categories';
import AdminAnalytics from './pages/AdminAnalytics';
import History from './pages/History';
import Terms from './pages/Terms';
import SplitBill from './pages/SplitBill';

import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { SplashScreen } from './components/layout/SplashScreen';

function App() {
    return (
        <BrowserRouter>
            <SplashScreen />
            {/*
          Usando Layout Route Wrapper:
          Todas as rotas filhas serão renderizadas dentro do <Outlet /> do Layout.
      */}
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/terms" element={<Terms />} />

                {/* Private Routes Wrapper */}
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Layout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<Dashboard />} />
                    <Route path="transactions" element={<Transactions />} />
                    <Route path="cards" element={<Cards />} />
                    <Route path="goals" element={<Goals />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="categories" element={<Categories />} />
                    <Route path="admin" element={<AdminAnalytics />} />
                    <Route path="history" element={<History />} />
                    <Route path="split" element={<SplitBill />} />
                    {/* Default redirect to Dashboard */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App
