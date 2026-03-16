
import { useState } from 'react';
import { X, Send, Loader2, MessageSquare, CheckCircle2 } from 'lucide-react';
import { supabase } from '../../services/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { analytics } from '../../services/analytics';

interface SupportModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SupportModal({ isOpen, onClose }: SupportModalProps) {
    const { user } = useAuth();
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setLoading(true);
        try {
            const { error } = await supabase.from('support_messages').insert({
                user_id: user.id,
                subject,
                message,
                status: 'pending'
            });

            if (error) throw error;

            analytics.track({
                category: 'FUNNEL',
                name: 'support_message_sent',
                metadata: { subject }
            });

            setSent(true);
            setTimeout(() => {
                onClose();
                setSent(false);
                setSubject('');
                setMessage('');
            }, 3000);

        } catch (error) {
            console.error('Error sending support message:', error);
            alert('Erro ao enviar mensagem. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div 
                className="absolute inset-0 bg-neutral-1100/40 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            />
            
            <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-8 lg:p-10">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="size-12 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-600">
                                <MessageSquare size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-neutral-1100">Suporte & Feedback</h3>
                                <p className="text-sm font-bold text-neutral-400 uppercase tracking-widest">Fale com o desenvolvedor</p>
                            </div>
                        </div>
                        <button 
                            onClick={onClose}
                            className="p-2 hover:bg-neutral-50 rounded-full text-neutral-400 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {sent ? (
                        <div className="py-12 flex flex-col items-center text-center space-y-4 animate-in fade-in slide-in-from-bottom-4">
                            <div className="size-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center">
                                <CheckCircle2 size={40} />
                            </div>
                            <h4 className="text-2xl font-black text-neutral-1100">Mensagem Enviada!</h4>
                            <p className="text-neutral-500 font-medium max-w-[280px]">
                                Obrigado pelo feedback. O desenvolvedor foi notificado e responderá em breve.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] ml-1">Assunto</label>
                                <input
                                    type="text"
                                    required
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    placeholder="Ex: Sugestão de feature, Problema no saldo..."
                                    className="w-full h-14 px-6 bg-neutral-50 border-2 border-neutral-50 rounded-2xl outline-none focus:bg-white focus:border-neutral-1100 font-bold text-neutral-1100 transition-all placeholder:text-neutral-300 placeholder:font-medium"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] ml-1">Sua Mensagem</label>
                                <textarea
                                    required
                                    rows={5}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Descreva detalhadamente o que aconteceu ou sua ideia..."
                                    className="w-full p-6 bg-neutral-50 border-2 border-neutral-50 rounded-2xl outline-none focus:bg-white focus:border-neutral-1100 font-bold text-neutral-1100 transition-all placeholder:text-neutral-300 placeholder:font-medium resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !subject || !message}
                                className="w-full h-16 bg-neutral-1100 text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-neutral-900 active:scale-[0.98] transition-all disabled:opacity-50 shadow-xl shadow-neutral-1100/10"
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin" size={20} />
                                ) : (
                                    <>
                                        Enviar Mensagem
                                        <Send size={18} />
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
