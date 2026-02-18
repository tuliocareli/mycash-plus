import { useState, useRef, useEffect } from 'react';
import { Settings2, X } from 'lucide-react';
import clsx from 'clsx';
import { useFinance } from '../../contexts/FinanceContext';
import { TransactionType } from '../../types';

export function FilterButton() {
    const [isOpen, setIsOpen] = useState(false);
    const { transactionTypeFilter, setTransactionTypeFilter } = useFinance();
    const popoverRef = useRef<HTMLDivElement>(null);

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (type: 'all' | TransactionType) => {
        setTransactionTypeFilter(type);
        setIsOpen(false);
    };

    const options: Array<{ label: string; value: 'all' | TransactionType }> = [
        { label: 'Todos', value: 'all' },
        { label: 'Receitas', value: 'income' },
        { label: 'Despesas', value: 'expense' }
    ];

    return (
        <div className="relative" ref={popoverRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={clsx(
                    "size-11 rounded-full bg-white flex items-center justify-center shadow-sm border border-transparent hover:bg-neutral-50 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500",
                    isOpen ? "bg-neutral-100" : ""
                )}
                title="Filtros"
            >
                <Settings2 className="h-5 w-5 text-neutral-1100" strokeWidth={1.5} />
            </button>

            {/* Desktop Popover */}
            {isOpen && (
                <>
                    {/* Overlay Mobile (Backdrop) */}
                    <div className="fixed inset-0 bg-neutral-1100/20 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsOpen(false)} />

                    {/* Modal/Popover Content */}
                    <div className={clsx(
                        "absolute right-0 top-14 z-50 w-72 bg-white/95 backdrop-blur-xl border border-neutral-200 shadow-2xl rounded-3xl p-5 flex flex-col gap-5 animate-fade-in origin-top-right",
                        "lg:origin-top-right", // Desktop adjustment
                        "fixed bottom-0 left-0 right-0 w-full rounded-b-none border-x-0 border-b-0 lg:absolute lg:top-14 lg:left-auto lg:bottom-auto lg:w-72 lg:rounded-3xl lg:border" // Mobile overrides
                    )}>

                        {/* Header Mobile Only */}
                        <div className="flex items-center justify-between pb-3 border-b border-neutral-200 lg:hidden">
                            <span className="font-bold text-lg text-neutral-1100">Filtros</span>
                            <button onClick={() => setIsOpen(false)} className="p-2 -mr-2 text-neutral-500">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex flex-col gap-3">
                            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.1em] px-1">Tipo de Transação</span>
                            <div className="flex flex-col gap-1.5">
                                {options.map((opt) => (
                                    <button
                                        key={opt.value}
                                        onClick={() => handleSelect(opt.value)}
                                        className={clsx(
                                            "flex items-center justify-between px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-300",
                                            transactionTypeFilter === opt.value
                                                ? "bg-neutral-1100 text-white shadow-lg shadow-neutral-1100/20"
                                                : "bg-transparent text-neutral-500 hover:bg-neutral-100"
                                        )}
                                    >
                                        {opt.label}
                                        {transactionTypeFilter === opt.value && (
                                            <div className="size-2 rounded-full bg-brand-500 shadow-[0_0_8px_rgba(223,254,53,0.6)]" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
