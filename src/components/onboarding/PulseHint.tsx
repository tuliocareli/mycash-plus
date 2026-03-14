
import { useState, ReactNode } from 'react';
import clsx from 'clsx';

interface PulseHintProps {
    children: ReactNode;
    hint: string;
    position?: 'top' | 'bottom' | 'left' | 'right';
    visible?: boolean;
}

export function PulseHint({ children, hint, position = 'top', visible = true }: PulseHintProps) {
    const [isHovered, setIsHovered] = useState(false);

    if (!visible) return <>{children}</>;

    const positionClasses = {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-3',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-3',
        left: 'right-full top-1/2 -translate-y-1/2 mr-3',
        right: 'left-full top-1/2 -translate-y-1/2 ml-3'
    };

    return (
        <div className="relative inline-block" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
            {/* The actual element */}
            {children}

            {/* The Pulse Beacon */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 pointer-events-none">
                <span className="relative flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-brand-500 border-2 border-white shadow-sm"></span>
                </span>
            </div>

            {/* The Tooltip (Visible on Hover) */}
            <div className={clsx(
                "absolute z-50 px-4 py-3 bg-neutral-1100 text-white rounded-2xl text-xs font-bold w-48 shadow-xl transition-all duration-300 pointer-events-none",
                positionClasses[position],
                isHovered ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-2 scale-95"
            )}>
                <div className="flex flex-col gap-1">
                    <span className="text-brand-400 text-[10px] uppercase tracking-wider">DICA RÁPIDA</span>
                    {hint}
                </div>
                {/* Arrow */}
                <div className={clsx(
                    "absolute border-4 border-transparent",
                    position === 'top' && "top-full left-1/2 -translate-x-1/2 border-t-neutral-1100",
                    position === 'bottom' && "bottom-full left-1/2 -translate-x-1/2 border-b-neutral-1100",
                    position === 'left' && "left-full top-1/2 -translate-y-1/2 border-l-neutral-1100",
                    position === 'right' && "right-full top-1/2 -translate-y-1/2 border-r-neutral-1100"
                )} />
            </div>
        </div>
    );
}
