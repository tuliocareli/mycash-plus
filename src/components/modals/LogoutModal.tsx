import { createPortal } from 'react-dom';
import { LogOut, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface LogoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
}

export function LogoutModal({ isOpen, onClose, onConfirm }: LogoutModalProps) {
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleConfirm = async () => {
        setIsLoading(true);
        try {
            await onConfirm();
        } catch (error) {
            console.error('Logout failed', error);
            setIsLoading(false); // Only stop loading on error, otherwise we navigate away
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-neutral-1100/40 backdrop-blur-sm transition-opacity" onClick={onClose} />

            <div className="relative w-full max-w-[400px] bg-white rounded-[2.5rem] shadow-2xl border border-neutral-100 overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-8 flex flex-col items-center text-center space-y-6">

                    <div className="size-20 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-2">
                        <LogOut size={40} className="ml-1" />
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-2xl font-black text-neutral-1100">Sair do MyCash+?</h2>
                        <p className="text-sm font-bold text-neutral-400">
                            Você precisará fazer login novamente para acessar seus dados.
                        </p>
                    </div>

                    <div className="flex flex-col w-full gap-3 pt-4">
                        <button
                            onClick={handleConfirm}
                            disabled={isLoading}
                            className="w-full h-14 bg-red-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-red-500/20 hover:bg-red-600 active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Sim, Sair Agora'}
                        </button>
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="w-full h-14 bg-neutral-50 text-neutral-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-neutral-100 active:scale-95 transition-all"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
