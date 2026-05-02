import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

/**
 * Demo page — auto-logs in with a read-only demo user.
 * Used to bypass Google OAuth in iframe embeds (portfolio case study).
 * 
 * The demo user has pre-populated mock data so visitors can
 * explore the app without creating an account.
 */

const DEMO_EMAIL = 'demo@purso.app';
const DEMO_PASSWORD = 'PursoDemo2026!';

export default function Demo() {
    const { signIn, user } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [isLoggingIn, setIsLoggingIn] = useState(true);

    useEffect(() => {
        // If user is already logged in, go straight to dashboard
        if (user) {
            navigate('/', { replace: true });
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

                // AuthContext's onAuthStateChange will update `user`,
                // which triggers the redirect above on re-render.
                // But let's also navigate explicitly for faster UX.
                navigate('/', { replace: true });
            } catch (err: any) {
                console.error('Demo login failed:', err);
                setError('Não foi possível acessar o modo demo. Tente novamente.');
                setIsLoggingIn(false);
            }
        };

        loginAsDemo();
    }, [user, signIn, navigate]);

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-neutral-900 gap-6 px-4">
            {/* Logo */}
            <div className="flex items-center gap-2">
                <img src="/purso-icon.svg" alt="Purso Icon" className="h-10 w-auto" />
                <img src="/purso-text.svg" alt="Purso" className="h-7 w-auto brightness-0 invert" />
            </div>

            {isLoggingIn ? (
                <div className="flex flex-col items-center gap-4 animate-fade-in">
                    <Loader2 size={32} className="animate-spin text-brand-500" />
                    <p className="text-white/60 text-sm font-medium text-center">
                        Preparando ambiente demo...
                    </p>
                </div>
            ) : error ? (
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
            ) : null}

            {/* Disclaimer */}
            <p className="text-white/20 text-[10px] text-center max-w-xs leading-relaxed">
                Modo demonstração — dados fictícios para visualização.
                Alterações podem ser resetadas periodicamente.
            </p>
        </div>
    );
}
