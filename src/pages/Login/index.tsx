
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Loader2, ArrowRight, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useFormFunnel } from '../../hooks/useAnalytics';

export default function Login() {
    const { signIn, signInWithGoogle } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Analytics
    const { startForm: startLogin, submitForm: submitLogin } = useFormFunnel('login');
    const { startForm: startRegister, submitForm: submitRegister } = useFormFunnel('register');

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
                const { error: signInError } = await signIn({ email, password });
                if (signInError) throw signInError;
                submitLogin({ email: email }); // Success
                navigate(from, { replace: true });
            } else {
                // Prevent real account creation
                await new Promise(resolve => setTimeout(resolve, 1000)); // Fake loading delay
                submitRegister({ email: email }); // Success
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
                    <div className="flex items-center">
                        <svg className="h-16 w-auto" viewBox="0 0 832.1 249.8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect fill="#DFFE35" x="29.2" y="23" width="197.4" height="197.4" rx="37.2" ry="37.2"/>
                            <g>
                                <path fill="#FFFFFF" d="M194.5,75.5c-7.9-3.2-9.2-7.9-14.8-8.9-5.2-1-11.3,1.8-14.4,6-1.2,1.6-1.9,3.3-2.2,5.1-9.7-11.5-22.3-19.5-36.1-19.5s-26.3,8-36.1,19.5c-.1-.3-.3-.7-.4-1-2.3-4.7-7.8-8.5-13.1-8.4-5.7,0-7.7,4.5-16.1,6.2-4,.8-7.4.7-9.7.4.2,6.1,1.9,10.1,3.5,12.6,2.4,3.9,4,3.6,9.1,9.7,4.4,5.3,4.9,7.4,7.5,8,1.3.3,2.7.1,3.9-.4-2.9,8.2-4.5,16.6-4.5,24.4,0,30.9,25,55.9,55.9,55.9s55.9-25,55.9-55.9-1.7-16.8-4.8-25.3c.3,0,.6,0,.8,0,2.7-.2,3.5-2.2,8.8-6.6,6.1-5.1,7.6-4.6,10.7-8,1.9-2.2,4.4-5.8,5.6-11.8-2.4-.1-5.8-.5-9.5-2Z"/>
                                <path fill="#000000" d="M127.1,187c-31.9,0-57.8-25.9-57.8-57.8s1.2-14.5,3.6-22c-.5,0-1.1,0-1.6-.2-2.4-.6-3.5-2.1-5.2-4.4-.8-1.1-1.8-2.5-3.3-4.3-2.4-2.8-4-4.2-5.3-5.4-1.5-1.3-2.6-2.3-4-4.5-2.3-3.8-3.6-8.3-3.8-13.5v-2.2c0,0,2.1.3,2.1.3,3.1.4,6.2.3,9.1-.4,3.8-.8,6.3-2.2,8.4-3.5,2.4-1.4,4.7-2.7,8-2.8,0,0,0,0,.1,0,5.3,0,10.8,3.3,13.9,8,10.6-11.7,23.2-18.1,35.7-18.1s24.8,6.2,35.3,17.7c.4-.9.9-1.7,1.5-2.5,3.7-5,10.5-7.8,16.2-6.8,3.3.6,5.3,2.3,7.5,4.1,1.9,1.6,4,3.4,7.7,4.9h0c2.8,1.1,5.8,1.8,8.9,1.9h2.2c0,.1-.4,2.2-.4,2.2-1,5.1-3.1,9.4-6,12.7-1.7,1.9-3.1,2.8-4.7,3.8-1.5.9-3.3,2-6.1,4.4-1.8,1.5-3,2.7-4,3.6-1.6,1.5-2.7,2.6-4.3,3.1,2.7,8.1,4.2,16.3,4.2,23.7,0,31.9-25.9,57.8-57.8,57.8ZM78.8,101.7l-1.3,3.8c-2.9,8.1-4.4,16.3-4.4,23.8,0,29.8,24.3,54.1,54.1,54.1s54.1-24.3,54.1-54.1-1.6-16.2-4.7-24.7l-1-2.7,2.9.3c.2,0,.4,0,.6,0,1,0,1.6-.5,3.5-2.4,1-1,2.3-2.3,4.2-3.8,3.1-2.6,5-3.8,6.6-4.7,1.5-.9,2.5-1.5,3.9-3.1,2.1-2.4,3.7-5.4,4.7-8.9-2.8-.3-5.4-1-7.9-2h0c-4.2-1.7-6.7-3.8-8.7-5.5-2-1.7-3.4-2.9-5.7-3.3-4.3-.8-9.7,1.5-12.5,5.3-.9,1.3-1.6,2.7-1.9,4.3l-.7,3.8-2.5-3c-10.2-12.1-22.5-18.8-34.6-18.8s-24.4,6.7-34.6,18.8l-2,2.4-1.1-2.9c-.1-.3-.2-.6-.4-.9-2.1-4.2-7-7.4-11.4-7.4s0,0,0,0c-2.4,0-4,1-6.2,2.3-2.3,1.3-5.1,3-9.5,3.9-2.6.6-5.4.8-8.1.6.4,3.7,1.4,6.9,3.1,9.6,1.1,1.8,2,2.5,3.3,3.7,1.4,1.2,3.1,2.7,5.7,5.8,1.6,1.9,2.6,3.3,3.5,4.5,1.6,2.1,2,2.7,3,2.9.8.2,1.8.1,2.8-.3l3.7-1.4Z"/>
                                <circle fill="#000000" cx="103.9" cy="110.5" r="5.3"/>
                                <circle fill="#000000" cx="143.9" cy="110.5" r="5.3"/>
                                <path fill="#000000" d="M126.3,166.6c-4.6,0-9.1-1.2-13.1-3.5-1.7-1-4.9-2.9-7.2-6.8-3.4-5.9-2.7-13-.4-17.3,2.5-4.8,7.9-8.4,14.6-9.8,7.7-1.6,15.7,0,20.8,4.3,5,4.1,9.4,12,7.1,19.5-1.6,5.4-6,8.2-8.1,9.6-4,2.6-8.9,3.9-13.7,3.9ZM125.9,132.3c-1.7,0-3.4.2-5,.5-5.6,1.1-10.1,4.1-12.1,7.9-1.7,3.3-2.3,9,.4,13.7,1.8,3.1,4.3,4.6,5.9,5.4h0c6.9,4.1,16.4,3.9,23-.4,2-1.3,5.4-3.5,6.6-7.5,1.7-5.6-1.7-12.1-5.9-15.6-3.2-2.6-7.8-4.1-12.7-4.1Z"/>
                                <path fill="#000000" d="M117.7,155.3c-.4,0-.7,0-.9-.1-.8-.2-2.3-1.1-2.6-3.8-.2-1.5,0-3.3.6-5.1.5-1.8,1.4-3.4,2.3-4.6,1.8-2.1,3.4-2,4.3-1.8.8.2,2.3,1.1,2.6,3.8.2,1.5,0,3.3-.6,5.1-.5,1.8-1.4,3.4-2.3,4.6-1.3,1.5-2.5,1.9-3.4,1.9ZM120.3,143.7c-.5.5-1.3,1.6-1.9,3.6s-.5,3.3-.4,4c.5-.5,1.3-1.6,1.9-3.6h0c.6-1.9.5-3.3.4-4Z"/>
                                <path fill="#000000" d="M135.6,155.1c-.8,0-1.9-.3-3.2-1.4-1.1-1-2.2-2.5-3-4.2-2-4.3-1.6-8,.8-9.1.8-.4,2.4-.7,4.5,1.2,1.1,1,2.2,2.5,3,4.2,2,4.3,1.6,8-.8,9.1-.3.1-.8.3-1.3.3ZM132,143.9c0,.7,0,2.1.9,3.9h0c.8,1.8,1.8,2.8,2.4,3.3,0-.7,0-2.1-.9-3.9-.8-1.8-1.8-2.8-2.4-3.3Z"/>
                                <path fill="#000000" d="M171.1,183.3c-2.2-14-3.5-15.3-17.5-17.5v-3.7c14-2.2,15.3-3.5,17.5-17.5h3.7c2.2,14,3.5,15.3,17.5,17.5v3.7c-14,2.2-15.3,3.5-17.5,17.5h-3.7Z"/>
                                <path fill="#DFFE35" d="M172.9,144.9c2.3,14.9,4.2,16.8,19.1,19.1-14.9,2.3-16.8,4.2-19.1,19.1-2.3-14.9-4.2-16.8-19.1-19.1,14.9-2.3,16.8-4.2,19.1-19.1M176.6,144.3h-7.3c-1,6.5-1.9,10.3-3.8,12.2s-5.7,2.8-12.2,3.8v7.3c6.5,1,10.3,1.9,12.2,3.8s2.8,5.7,3.8,12.2h7.3c1-6.5,1.9-10.3,3.8-12.2,1.9-1.9,5.7-2.8,12.2-3.8v-7.3c-6.5-1-10.3-1.9-12.2-3.8-1.9-1.9-2.8-5.7-3.8-12.2h0Z"/>
                            </g>
                            <g fill="#FFFFFF">
                                <path d="M267.2,75.9c.8-.8,2.1-1.3,3.7-1.3h58.3c12.1,0,21.2,1,27.2,3.1,6.1,2.1,10.1,5.3,12.2,9.5s3.1,10.3,3.1,18v1.7c0,8.6-1,15-3.1,19.2-2.1,4.2-6.1,7.2-12.1,8.9s-15.2,2.6-27.7,2.6h-57.9c-1.6,0-2.8-.4-3.7-1.3s-1.3-2.1-1.3-3.7v-53.2c0-1.6.4-2.8,1.3-3.7ZM267.2,167.8c-.8-.8-1.3-2.1-1.3-3.7v-61c0-1.6.4-2.8,1.3-3.7s2.1-1.3,3.7-1.3h16.7c1.6,0,2.8.4,3.7,1.3.8.8,1.3,2.1,1.3,3.7v61c0,1.6-.4,2.8-1.3,3.7-.8.8-2.1,1.3-3.7,1.3h-16.7c-1.6,0-2.8-.4-3.7-1.3ZM343.4,98.5c-1.1-1.5-3.1-2.5-6-3.1-2.9-.6-7.2-.9-13.1-.9h-31.9v23.2h31.9c5.7,0,10-.3,12.9-1,3-.7,5-1.8,6.1-3.3,1.1-1.5,1.7-3.6,1.7-6.4v-1.7c0-3-.6-5.3-1.7-6.8Z"/>
                                <path d="M414.7,99.4c.8.8,1.3,2.1,1.3,3.7v27.2c0,6.4.5,11.2,1.5,14.3,1,3.1,2.5,5.2,4.6,6.3,2.1,1.1,5,1.6,8.9,1.6,5.9,0,10.4-.6,13.5-1.9,3.1-1.3,5.2-3.3,6.4-6,1.2-2.7,1.8-6.6,1.8-11.4l5.2,20.9c-1.9,3.9-4.3,7.2-7,9.7-2.7,2.5-5.9,4.3-9.4,5.5-3.5,1.2-7.5,1.8-11.9,1.8-10.1,0-18-1-23.7-3-5.7-2-9.9-5.4-12.5-10.2-2.6-4.8-3.9-11.6-3.9-20.3v-34.4c0-1.6.4-2.8,1.2-3.7s1.9-1.3,3.4-1.3h17c1.6,0,2.8.4,3.7,1.3ZM477.9,99.4c.8.8,1.3,2.1,1.3,3.7v61c0,1.6-.4,2.8-1.3,3.7s-2.1,1.3-3.7,1.3h-16.7c-1.6,0-2.8-.4-3.7-1.3s-1.3-2.1-1.3-3.7v-61c0-1.6.4-2.8,1.3-3.7s2.1-1.3,3.7-1.3h16.7c1.6,0,2.8.4,3.7,1.3Z"/>
                                <path d="M502.1,167.8c-.8-.8-1.3-2.1-1.3-3.7v-61c0-1.6.4-2.8,1.3-3.7.8-.8,2.1-1.3,3.7-1.3h16.7c1.6,0,2.8.4,3.7,1.3s1.3,2.1,1.3,3.7v61c0,1.6-.4,2.8-1.3,3.7s-2.1,1.3-3.7,1.3h-16.7c-1.6,0-2.8-.4-3.7-1.3ZM561.5,113.8c-.9.6-2.6.9-5,.9-7,0-12.5.7-16.7,2-4.2,1.4-7.2,3.5-9.1,6.3-1.9,2.8-3,6.6-3.2,11.3v-28.6c3-3.9,7.2-6.4,12.5-7.7,5.3-1.2,11.3-1.9,18-1.9s2.9.3,3.7,1.0.8.7,1.2,1.8,1.2,3.3v9.8c0,1.7-.5,2.8-1.4,3.4Z"/>
                                <path d="M597.4,168.3c-6.2-1.4-10.6-3.5-13.2-6.4-2.6-2.8-4.1-6.7-4.6-11.5-.2-1.6.2-2.8,1.1-3.7.9-.9,2.1-1.3,3.8-1.3h14.1c1.6,0,2.8.2,3.6.5.7.3,1.2,1.1,1.5,2.2.5,1.8,1.2,3.1,2.2,4.0,2.9,1.4,5.5,1.8c2.6.3,6.7.5,12.2.5s11.6-.2,14.6-.5c3-.3,4.9-.9,5.7-1.7.9-.8,1.3-2.1,1.3-3.9s-.5-3-1.5-3.9c-1-.9-2.6-1.5-4.9-1.9-2.3-.4-5.6-.6-9.8-.7l-23.2-.3c-6.5,0-11.6-1-15.5-2.6-3.9-1.7-6.7-4.2-8.4-7.4-1.7-3.3-2.6-7.4-2.6-12.5s1.5-10.8,4.4-13.9c2.9-3.1,7.6-5.3,14.1-6.5,6.5-1.2,15.7-1.8,27.7-1.8s19.8.7,26,2.1c6.2,1.4,10.6,3.5,13.2,6.4,2.6,2.8,4.1,6.7,4.6,11.5.2,1.6-.2,2.8-1.1,3.7-.9.9-2.1,1.3-3.8,1.3h14.1c1.6,0,2.8-.2,3.6-.5.7-.3,1.2-1.1,1.5-2.2.5-1.8,1.2-3.1,2.2-4.0,2.9-1.4,5.5-1.8c-2.6-.3-6.7-.5-12.2-.5s-11.6.2-14.6.5c-3.0,.3-4.9.9-5.7,1.7-.9.8-1.3,2.1-1.3,3.9s.5,3,1.5,3.9c1,.9,2.6,1.5,4.9,1.9,2.3.4,5.6.6,9.8.7l23.2.3c6.5,0,11.6,1,15.5,2.6,3.9,1.7,6.7,4.2,8.4,7.4,1.7,3.3,2.6,7.4,2.6,12.5s-1.5,10.8-4.4,13.9c-2.9,3.1-7.6,5.3-14.1,6.5-6.5,1.2-15.7,1.8-27.7,1.8s-19.8-.7-26-2.1Z"/>
                                <path d="M708,167.2c-6.5-2.2-11.3-5.9-14.4-11.2-3.1-5.3-4.7-12.9-4.7-22.6s1.6-17.2,4.7-22.4c3.1-5.2,7.9-8.9,14.3-10.9,6.4-2,15.2-3,26.2-3s19.8,1,26.2,3c6.4,2,11.2,5.7,14.3,10.9,3.1,5.2,4.7,12.7,4.7,22.4s-1.6,17.3-4.7,22.6c-3.1,5.3-7.9,9.1-14.4,11.2-6.5,2.2-15.2,3.2-26.2,3.2s-19.7-1.1-26.2-3.2ZM751.3,122.4c-1-2.5-2.9-4.3-5.5-5.4-2.7-1.1-6.5-1.7-11.6-1.7s-9,0.6-11.6,1.7c-2.7,1.1-4.5,2.9-5.5,5.4-1,2.5-1.5,6.1-1.5,10.8s0.5,8.8,1.5,11.4c1,2.6,2.9,4.5,5.5,5.6.s6.5,1.7,11.6,1.7,9-.6,11.6-1.7,4.5-3,5.5-5.6c1-2.6,1.5-6.4,1.5-11.4s-.5-8.3-1.5-10.8Z"/>
                            </g>
                        </svg>
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
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            isLogin ? startLogin() : startRegister();
                                        }}
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
