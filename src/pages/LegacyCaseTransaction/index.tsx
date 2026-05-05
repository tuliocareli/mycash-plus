import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { Layout } from '../../components/layout/Layout';
import LegacyDashboard from './LegacyDashboard';

/**
 * Legacy Case Transaction Route
 * This route is intended for embedding inside a portfolio case study iframe.
 * It automatically logs in with the demo credentials (if not already logged in)
 * and renders a special "Legacy Dashboard" which features the previous iteration
 * of the transaction modal without inline account/card creation.
 */

const DEMO_EMAIL = 'demo2@purso.app';
const DEMO_PASSWORD = import.meta.env.VITE_DEMO_PASSWORD || '';

export default function LegacyCaseTransaction() {
    const { signIn, user } = useAuth();
    const [isLoggingIn, setIsLoggingIn] = useState(!user);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            setIsLoggingIn(false);
            return;
        }

        const loginAsDemo = async () => {
            try {
                const { error: signInError } = await signIn({
                    email: DEMO_EMAIL,
                    password: DEMO_PASSWORD,
                });

                if (signInError) {
                    throw signInError;
                }
                
                // Once logged in, AuthContext's onAuthStateChange handles setting user
            } catch (err: any) {
                console.error('Demo login failed:', err);
                setError('Não foi possível acessar o modo demo legacy. Tente novamente.');
                setIsLoggingIn(false);
            }
        };

        loginAsDemo();
    }, [user, signIn]);

    if (isLoggingIn || !user) {
        return (
            <div className="min-h-screen w-full flex flex-col items-center justify-center bg-neutral-900 gap-6 px-4">
                <div className="flex items-center gap-2">
                    <img src="/purso-icon.svg" alt="Purso Icon" className="h-10 w-auto" />
                    <img src="/purso-text.svg" alt="Purso" className="h-7 w-auto brightness-0 invert" />
                </div>
                
                {error ? (
                    <div className="flex flex-col items-center gap-4 animate-fade-in max-w-sm">
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-center">
                            <p className="text-red-400 text-sm font-medium">{error}</p>
                        </div>
                        <button
                            onClick={() => {
                                setIsLoggingIn(true);
                                setError(null);
                                window.location.reload();
                            }}
                            className="px-6 py-3 bg-brand-500 text-neutral-1100 rounded-xl font-bold text-sm hover:bg-brand-700 active:scale-95 transition-all"
                        >
                            Tentar novamente
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-4 animate-fade-in">
                        <Loader2 size={32} className="animate-spin text-brand-500" />
                        <p className="text-white/60 text-sm font-medium text-center">
                            Preparando ambiente demo legado...
                        </p>
                    </div>
                )}
            </div>
        );
    }

    // Render the layout wrapping our specialized LegacyDashboard
    return (
        <Layout>
            <LegacyDashboard />
        </Layout>
    );
}
