import { createPortal } from 'react-dom';
import { AlertTriangle, Loader2 } from 'lucide-react';

interface ConfirmDangerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void | Promise<void>;
    title: string;
    description: string;
    confirmLabel?: string;
    cancelLabel?: string;
    /** Exibe spinner no botão de confirmação */
    isLoading?: boolean;
}

export function ConfirmDangerModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmLabel = 'Confirmar',
    cancelLabel = 'Cancelar',
    isLoading = false,
}: ConfirmDangerModalProps) {
    if (!isOpen) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-[200000] flex items-center justify-center p-4 animate-fade-in"
            style={{ backgroundColor: 'rgba(8,11,18,0.5)', backdropFilter: 'blur(4px)' }}
        >
            <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-scale-in">

                {/* Top danger bar */}
                <div
                    className="h-1.5 w-full"
                    style={{ backgroundColor: 'var(--status-error)' }}
                />

                {/* Body */}
                <div className="p-8 flex flex-col items-center text-center gap-5">
                    {/* Icon */}
                    <div
                        className="size-16 rounded-2xl flex items-center justify-center"
                        style={{ backgroundColor: '#FEE2E2' }}
                    >
                        <AlertTriangle
                            size={28}
                            style={{ color: 'var(--status-error)' }}
                        />
                    </div>

                    {/* Text */}
                    <div className="space-y-2">
                        <h3 className="text-lg font-black text-neutral-1100 tracking-tight">
                            {title}
                        </h3>
                        <p className="text-sm text-neutral-500 font-medium leading-relaxed">
                            {description}
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 pb-6 flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex-1 py-3.5 rounded-2xl border border-neutral-200 text-neutral-600 font-bold hover:bg-neutral-50 transition-colors text-sm disabled:opacity-50"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="flex-1 py-3.5 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-70 hover:opacity-90 active:scale-95"
                        style={{ backgroundColor: 'var(--status-error)' }}
                    >
                        {isLoading && <Loader2 size={16} className="animate-spin" />}
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
