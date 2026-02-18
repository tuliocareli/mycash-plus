import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Cards from './pages/Cards';
import Goals from './pages/Goals';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Categories from './pages/Categories';

import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

function App() {
    return (
        <BrowserRouter>
            {/*
          Usando Layout Route Wrapper:
          Todas as rotas filhas serão renderizadas dentro do <Outlet /> do Layout.
      */}
            <Routes>
                {/* Public Route */}
                <Route path="/login" element={<Login />} />

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
                    {/* Default redirect to Dashboard */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App
