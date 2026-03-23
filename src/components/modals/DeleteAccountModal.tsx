import { useState } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, X, Loader2 } from 'lucide-react';
import { supabase } from '../../services/supabase';

interface DeleteAccountModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function DeleteAccountModal({ isOpen, onClose, onSuccess }: DeleteAccountModalProps) {
    const [confirmationText, setConfirmationText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isConfirmed = confirmationText === 'EXCLUIR';

    const handleDelete = async () => {
        if (!isConfirmed) return;
        setIsDeleting(true);
        setError(null);

        try {
            const { data, error: fnError } = await supabase.functions.invoke('delete-account');

            if (fnError || !data?.success) {
                throw new Error(fnError?.message || data?.error || 'Erro ao excluir a conta.');
            }

            // A própria session vai cair ao deslogar da máquina, chamamos onSuccess pra forçar logout
            onSuccess();
        } catch (err: any) {
            console.error('Delete account error:', err);
            setError(err.message || 'Ocorreu um erro ao excluir sua conta. Tente novamente mais tarde.');
            setIsDeleting(false);
        }
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-neutral-1100/40 backdrop-blur-sm" onClick={onClose} />

            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md relative z-10 overflow-hidden animate-slide-up border border-red-100 p-8">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 bg-neutral-50 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-600 transition-colors"
                    disabled={isDeleting}
                >
                    <X size={20} />
                </button>

                <div className="flex flex-col items-center text-center mt-4">
                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
                        <AlertTriangle size={32} />
                    </div>
                    
                    <h3 className="text-xl font-black text-neutral-1100 mb-2">
                        Excluir Conta Permanentemente
                    </h3>
                    
                    <p className="text-sm font-semibold text-neutral-500 mb-6">
                        Esta ação é <span className="text-red-600 font-bold">irreversível</span>. Todos os seus dados, lançamentos, contas e preferências serão apagados para sempre de nossos servidores em conformidade com as diretrizes de privacidade.
                    </p>

                    {error && (
                        <div className="w-full bg-red-50 border border-red-100 text-red-600 text-xs font-bold p-4 rounded-xl mb-6 text-left">
                            {error}
                        </div>
                    )}

                    <div className="w-full mb-8 text-left">
                        <label className="block text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3">
                            Para confirmar, digite EXCLUIR:
                        </label>
                        <input
                            type="text"
                            value={confirmationText}
                            onChange={(e) => setConfirmationText(e.target.value)}
                            placeholder="EXCLUIR"
                            disabled={isDeleting}
                            className="w-full px-5 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl text-sm font-black text-neutral-1100 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all outline-none"
                        />
                    </div>

                    <div className="flex w-full gap-4">
                        <button
                            onClick={onClose}
                            disabled={isDeleting}
                            className="flex-1 px-6 py-4 bg-neutral-100 text-neutral-600 font-black rounded-2xl hover:bg-neutral-200 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={!isConfirmed || isDeleting}
                            className="flex-1 px-6 py-4 bg-red-500 text-white font-black rounded-2xl hover:bg-red-600 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isDeleting ? <Loader2 size={20} className="animate-spin" /> : 'Excluir Conta'}
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
