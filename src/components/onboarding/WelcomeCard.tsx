
import { useState } from 'react';
import { CheckCircle2, Circle, X, ArrowRight, Sparkles } from 'lucide-react';
import clsx from 'clsx';
import { supabase } from '../../services/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface OnboardingTask {
    id: string;
    label: string;
    completed: boolean;
}

interface WelcomeCardProps {
    userName: string;
    tasks: OnboardingTask[];
    onClose: () => void;
}

export function WelcomeCard({ userName, tasks, onClose }: WelcomeCardProps) {
    const { user } = useAuth();
    const [isVisible, setIsVisible] = useState(true);

    const handleDismiss = async () => {
        setIsVisible(false);
        if (user) {
            await supabase
                .from('users')
                .update({ has_seen_onboarding: true })
                .eq('id', user.id);
        }
        onClose();
    };

    if (!isVisible) return null;

    const completedCount = tasks.filter(t => t.completed).length;
    const progress = Math.round((completedCount / tasks.length) * 100);

    return (
        <div className="relative overflow-hidden bg-gradient-to-br from-neutral-1100 to-neutral-900 rounded-[32px] p-8 mb-8 text-white shadow-2xl animate-fade-in group">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl group-hover:bg-brand-500/20 transition-all duration-700" />
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all duration-700" />

            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="bg-brand-500/20 p-2 rounded-xl">
                            <Sparkles className="text-brand-400" size={20} />
                        </div>
                        <span className="text-brand-400 font-bold text-xs uppercase tracking-widest">Início Rápido</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black mb-3 tracking-tight">
                        Olá, {userName}! <br />
                        <span className="text-neutral-400 text-2xl md:text-3xl">Vamos organizar suas finanças?</span>
                    </h2>
                    <p className="text-neutral-400 font-medium max-w-md">
                        Siga os passos abaixo para começar sua jornada rumo à liberdade financeira com o Mycash+.
                    </p>
                </div>

                <div className="w-full md:w-auto bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 min-w-[320px]">
                    <div className="flex justify-between items-end mb-4">
                        <span className="text-sm font-bold text-neutral-300">Seu Progresso</span>
                        <span className="text-2xl font-black text-brand-400">{progress}%</span>
                    </div>
                    
                    <div className="h-1.5 w-full bg-white/10 rounded-full mb-6 overflow-hidden">
                        <div 
                            className="h-full bg-brand-500 transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(214,255,53,0.5)]"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    <div className="flex flex-col gap-4">
                        {tasks.map((task) => (
                            <div key={task.id} className="flex items-center gap-3 group/item">
                                {task.completed ? (
                                    <CheckCircle2 size={22} className="text-brand-500 shrink-0" />
                                ) : (
                                    <Circle size={22} className="text-white/20 shrink-0 group-hover/item:text-white/40 transition-colors" />
                                )}
                                <span className={clsx(
                                    "text-sm font-bold transition-all",
                                    task.completed ? "text-neutral-400 line-through" : "text-white"
                                )}>
                                    {task.label}
                                </span>
                            </div>
                        ))}
                    </div>

                    {progress === 100 ? (
                        <button 
                            onClick={handleDismiss}
                            className="w-full mt-6 bg-brand-500 hover:bg-brand-400 text-neutral-1100 font-black py-4 rounded-2xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                        >
                            Começar Agora <ArrowRight size={18} />
                        </button>
                    ) : (
                        <button 
                            onClick={handleDismiss}
                            className="w-full mt-6 text-neutral-500 hover:text-neutral-300 font-bold transition-colors text-xs text-center"
                        >
                            Pular Onboarding
                        </button>
                    )}
                </div>
            </div>

            <button 
                onClick={handleDismiss}
                className="absolute top-4 right-4 p-2 text-white/20 hover:text-white/60 transition-colors"
                title="Fechar"
            >
                <X size={20} />
            </button>
        </div>
    );
}
