import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { OnboardingFlow } from '../onboarding/OnboardingFlow';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-neutral-100 dark:bg-neutral-900">
                <Loader2 size={48} className="animate-spin text-neutral-400" />
            </div>
        );
    }

    if (!user) {
        // Redireciona para login mas salva o local que o usuário tentou acessar
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return (
        <>
            <OnboardingFlow />
            {children}
        </>
    );
}
