
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Loader2, ArrowRight, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useFormFunnel } from '../../hooks/useAnalytics';

export default function Login() {
    const { signIn, signInWithGoogle, signInWithMagicLink } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const isLogin = true; // Forced login mode, signup is handled via Magic Link or Google
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [useMagicLink, setUseMagicLink] = useState(false);
    const [isSignUpMode, setIsSignUpMode] = useState(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Analytics
    const { startForm: startLogin, submitForm: submitLogin } = useFormFunnel('login');
    const { startForm: startRegister } = useFormFunnel('register');

    const from = location.state?.from?.pathname || "/";

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError(null);
        try {
            const { error: signInError } = await signInWithGoogle();
            if (signInError) throw signInError;
        } catch (err: any) {
            setError(err.message || 'Erro ao conectar com Google.');
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            if (isLogin) {
                if (useMagicLink) {
                    const { error: magicError } = await signInWithMagicLink(email);
                    if (magicError) throw magicError;
                    setSuccess('Link de acesso enviado! Verifique seu e-mail.');
                    submitLogin({ email: email });
                } else {
                    const { error: signInError } = await signIn({ email, password });
                    if (signInError) throw signInError;
                    submitLogin({ email: email }); // Success
                    navigate(from, { replace: true });
                }
            }
        } catch (err: any) {
            setError(err.message || 'Ocorreu um erro. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="min-h-screen w-full flex flex-col lg:flex-row bg-neutral-200 overflow-hidden">

            {/* Left Side: Branding & Experience */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-neutral-1100 overflow-hidden items-center justify-center p-20">
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-brand-500/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-500/10 rounded-full blur-[100px]" />

                <div className="relative z-10 max-w-md w-full space-y-12">
                    <div className="flex items-center gap-3">
                        <img src="/purso-icon.svg?v=2" alt="Purso Icon" className="h-14 w-auto" />
                        <img src="/purso-text.svg?v=2" alt="Purso" className="h-10 w-auto brightness-0 invert" />
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-5xl font-black text-white leading-[1.1] tracking-tight">
                            Controle suas finanças com <span className="text-brand-500 underline decoration-8 decoration-brand-500/20 underline-offset-8">precisão.</span>
                        </h2>
                        <p className="text-lg text-neutral-400 font-medium leading-relaxed">
                            A plataforma definitiva para gestão familiar. Simples, inteligente e visualmente impecável.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-6 bg-white/5 rounded-[2rem] border border-white/10 backdrop-blur-md">
                            <p className="text-xl font-black text-white">Privado</p>
                            <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mt-1">e Seguro</p>
                        </div>
                        <div className="p-6 bg-white/5 rounded-[2rem] border border-white/10 backdrop-blur-md">
                            <p className="text-2xl font-black text-white">100%</p>
                            <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mt-1">Individual</p>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-white/5">
                        <p className="text-[10px] font-bold text-brand-500 uppercase tracking-widest leading-relaxed opacity-60">
                            ⚠️ Aviso Legal: Esta aplicação é uma versão de estudo e portfólio (Beta).
                            O ambiente é destinado apenas para testes de funcionalidades e interface. 
                            O banco de dados pode ser resetado periodicamente para manutenção.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side: Authentication form */}
            <div className="flex-1 flex items-center justify-center p-6 lg:p-20 relative">
                <div className="absolute top-0 left-0 w-full h-1/3 bg-neutral-1100 lg:hidden -z-10" />

                <div className="w-full max-w-[440px] animate-fade-in">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-black/5 border border-neutral-100 p-8 lg:p-12">

                         <div className="mb-10">
                            <div className="flex items-center gap-2">
                                <h3 className="text-2xl font-black text-neutral-1100">
                                    {isSignUpMode 
                                        ? 'Criar sua conta' 
                                        : (useMagicLink ? 'Entrar sem senha' : 'Bem-vindo de volta')}
                                </h3>
                                <span className="px-2 py-0.5 bg-neutral-100 text-[10px] font-bold text-neutral-400 rounded-full">v1.1.2</span>
                            </div>
                            <p className="text-neutral-500 text-sm font-medium mt-2">
                                {isSignUpMode 
                                    ? 'Enviaremos um link para você começar agora.' 
                                    : (useMagicLink ? 'Enviaremos um link de acesso ao seu e-mail.' : 'Acesse sua conta para gerenciar seu patrimônio.')}
                            </p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 animate-slide-in">
                                <AlertCircle size={18} className="shrink-0" />
                                <p className="text-xs font-bold uppercase tracking-tight leading-tight">{error}</p>
                            </div>
                        )}

                        {success && (
                            <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-2xl flex items-center gap-3 text-green-600 animate-slide-in">
                                <CheckCircle2 size={18} className="shrink-0" />
                                <p className="text-xs font-bold uppercase tracking-tight leading-tight">{success}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] ml-1">E-mail Corporativo</label>
                                <div className="relative flex items-center group">
                                    <div className="absolute left-4 text-neutral-400 group-focus-within:text-neutral-1100 transition-colors">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            isLogin ? startLogin() : startRegister();
                                        }}
                                        className="w-full h-14 pl-12 pr-4 bg-neutral-50 border-2 border-neutral-50 rounded-2xl outline-none focus:bg-white focus:border-neutral-1100 font-bold text-neutral-1100 transition-all placeholder:text-neutral-300 placeholder:font-medium"
                                        placeholder="seu@email.com"
                                    />
                                </div>
                            </div>

                            {!useMagicLink && (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between ml-1">
                                        <label className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">Senha de Acesso</label>
                                        {isLogin && (
                                            <button
                                                type="button"
                                                onClick={() => setUseMagicLink(true)}
                                                className="text-[10px] font-black text-brand-700 uppercase tracking-widest hover:underline"
                                            >
                                                Entrar sem senha
                                            </button>
                                        )}
                                    </div>
                                    <div className="relative flex items-center group">
                                        <div className="absolute left-4 text-neutral-400 group-focus-within:text-neutral-1100 transition-colors">
                                            <Lock size={18} />
                                        </div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            required={!useMagicLink}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full h-14 pl-12 pr-12 bg-neutral-50 border-2 border-neutral-50 rounded-2xl outline-none focus:bg-white focus:border-neutral-1100 font-bold text-neutral-1100 transition-all placeholder:text-neutral-300 placeholder:font-medium"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 text-neutral-400 hover:text-neutral-600 transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                            )}

                             {useMagicLink && (
                                <div className="flex justify-end pr-1">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setUseMagicLink(false);
                                            setIsSignUpMode(false);
                                        }}
                                        className="text-[10px] font-black text-neutral-400 uppercase tracking-widest hover:text-neutral-1100 transition-colors"
                                    >
                                        Prefiro usar minha senha
                                    </button>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full h-14 bg-neutral-1100 text-white rounded-2xl font-black text-sm uppercase tracking-[0.15em] flex items-center justify-center gap-2 hover:bg-neutral-900 active:scale-95 transition-all shadow-xl shadow-neutral-1100/10 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin" size={20} />
                                ) : (
                                    <>
                                        {useMagicLink 
                                            ? (isSignUpMode ? 'Criar minha conta' : 'Receber Link por E-mail')
                                            : 'Entrar no Sistema'}
                                        <ArrowRight size={18} />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 pt-8 border-t border-neutral-50 flex flex-col items-center gap-6">
                            <button
                                onClick={() => {
                                    setUseMagicLink(true);
                                    setIsSignUpMode(true);
                                    setError(null);
                                    setSuccess(null);
                                }}
                                className="text-xs font-bold text-neutral-400 uppercase tracking-widest hover:text-neutral-1100 transition-colors"
                            >
                                Não possui uma conta? 
                                <span className="text-brand-700 ml-1">Clique aqui</span>
                            </button>

                            <div className="w-full flex flex-col gap-3">
                                <button
                                    type="button"
                                    onClick={handleGoogleLogin}
                                    disabled={loading}
                                    className="w-full h-14 bg-white border-2 border-neutral-100 rounded-2xl flex items-center justify-center gap-3 hover:bg-neutral-50 hover:border-neutral-200 active:scale-[0.98] transition-all group disabled:opacity-50"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07L5.84 9.91c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                    <span className="text-xs font-black text-neutral-1100 uppercase tracking-widest">Entrar com Google</span>
                                </button>
                            </div>

                            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest text-center mt-6">
                                Ao entrar, você concorda com nossos <br />
                                <button onClick={() => navigate('/terms')} className="text-brand-700 underline underline-offset-2">Termos de Uso</button> e <button onClick={() => navigate('/terms')} className="text-brand-700 underline underline-offset-2">Privacidade</button>.
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 lg:hidden">
                        <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest leading-relaxed text-center opacity-70">
                            ⚠️ Aviso Legal: Esta aplicação é uma versão de estudo e portfólio (Beta).
                            O ambiente é destinado apenas para testes de funcionalidades e interface. 
                            O banco de dados pode ser resetado periodicamente para manutenção.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
