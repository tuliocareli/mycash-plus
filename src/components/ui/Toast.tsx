import { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';

interface ToastProps {
    message: string;
    visible: boolean;
    onHide: () => void;
    /** ms before auto-hide. default 2800 */
    duration?: number;
}

export function Toast({ message, visible, onHide, duration = 2800 }: ToastProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        if (visible) {
            setMounted(true);
            const timer = setTimeout(() => {
                setMounted(false);
                setTimeout(onHide, 300); // espera animação sair
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [visible, duration, onHide]);

    if (!visible && !mounted) return null;

    return (
        <div
            className={clsx(
                'flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-lg',
                'bg-[#E8FAF2] border border-[#15BE78]/30',
                'transition-all duration-300',
                mounted ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-95'
            )}
            role="status"
            aria-live="polite"
        >
            <CheckCircle2
                size={20}
                className="shrink-0"
                style={{ color: 'var(--status-success)' }}
            />
            <span
                className="text-sm font-semibold"
                style={{ color: '#0D7A4E' }}
            >
                {message}
            </span>
        </div>
    );
}
