
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Loader2, ArrowRight, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function Login() {
    const { signIn } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const from = location.state?.from?.pathname || "/";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            if (isLogin) {
                const { error: signInError } = await signIn({ email, password });
                if (signInError) throw signInError;
                navigate(from, { replace: true });
            } else {
                // Prevent real account creation
                await new Promise(resolve => setTimeout(resolve, 1000)); // Fake loading delay
                setSuccess('Solicitação recebida! Notificamos o admin, entre em contato para liberar seu acesso.');
                setIsLogin(true);
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
                    <div className="flex items-center gap-4">
                        <div className="size-16 bg-brand-500 rounded-[2rem] flex items-center justify-center shadow-lg shadow-brand-500/20">
                            <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 20C10 14.4772 14.4772 10 20 10H30V20H10Z" fill="black" />
                                <path d="M30 20C30 25.5228 25.5228 30 20 30H10V20H30Z" fill="black" />
                            </svg>
                        </div>
                        <h1 className="text-4xl font-black text-white tracking-tighter">Mycash+</h1>
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
                            <p className="text-xl font-black text-white">Intuitivo</p>
                            <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mt-1">e Fácil</p>
                        </div>
                        <div className="p-6 bg-white/5 rounded-[2rem] border border-white/10 backdrop-blur-md">
                            <p className="text-2xl font-black text-white">Open</p>
                            <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mt-1">Colaborativo</p>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-white/5">
                        <p className="text-[10px] font-bold text-brand-500 uppercase tracking-widest leading-relaxed opacity-60">
                            ⚠️ Aviso Legal: Esta aplicação é uma versão de estudo e testes (Beta).
                            Não utilize para armazenar dados sensíveis, bancários ou informações pessoais relevantes.
                            O banco de dados pode ser resetado a qualquer momento.
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
                            <h3 className="text-2xl font-black text-neutral-1100">{isLogin ? 'Bem-vindo de volta' : 'Criar conta'}</h3>
                            <p className="text-neutral-500 text-sm font-medium mt-2">
                                {isLogin ? 'Acesse sua conta para gerenciar seu patrimônio.' : 'Comece sua jornada financeira hoje mesmo.'}
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
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full h-14 pl-12 pr-4 bg-neutral-50 border-2 border-neutral-50 rounded-2xl outline-none focus:bg-white focus:border-neutral-1100 font-bold text-neutral-1100 transition-all placeholder:text-neutral-300 placeholder:font-medium"
                                        placeholder="seu@email.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] ml-1">Senha de Acesso</label>
                                <div className="relative flex items-center group">
                                    <div className="absolute left-4 text-neutral-400 group-focus-within:text-neutral-1100 transition-colors">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
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

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full h-14 bg-neutral-1100 text-white rounded-2xl font-black text-sm uppercase tracking-[0.15em] flex items-center justify-center gap-2 hover:bg-neutral-900 active:scale-95 transition-all shadow-xl shadow-neutral-1100/10 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin" size={20} />
                                ) : (
                                    <>
                                        {isLogin ? 'Entrar no Sistema' : 'Finalizar Cadastro'}
                                        <ArrowRight size={18} />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 pt-8 border-t border-neutral-50 flex flex-col items-center gap-6">
                            <button
                                onClick={() => {
                                    setIsLogin(!isLogin);
                                    setError(null);
                                    setSuccess(null);
                                }}
                                className="text-xs font-bold text-neutral-400 uppercase tracking-widest hover:text-neutral-1100 transition-colors"
                            >
                                {isLogin ? 'Não possui uma conta? ' : 'Já possui uma conta? '}
                                <span className="text-brand-700 ml-1">Clique aqui</span>
                            </button>

                            <div className="w-full flex items-center justify-center gap-2">
                                <div className="h-px flex-1 bg-neutral-100" />
                                <span className="text-[10px] font-black text-neutral-300 uppercase tracking-widest">Opções</span>
                                <div className="h-px flex-1 bg-neutral-100" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
