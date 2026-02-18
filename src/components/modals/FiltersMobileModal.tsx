import { useState, useEffect } from 'react';
import { X, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import { useFinance } from '../../contexts/FinanceContext';
import { startOfMonth, endOfMonth, subMonths, addMonths, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface FiltersMobileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function FiltersMobileModal({ isOpen, onClose }: FiltersMobileModalProps) {


    const {
        transactionTypeFilter,
        setTransactionTypeFilter,
        selectedMemberId,
        setSelectedMemberId,
        dateRange,
        setDateRange,
        familyMembers
    } = useFinance();

    // Local state for deferred application
    const [localType, setLocalType] = useState(transactionTypeFilter);
    const [localMember, setLocalMember] = useState(selectedMemberId);
    // Simple month selection for mobile instead of complex range picker for now
    const [viewDate, setViewDate] = useState(dateRange.startDate || new Date());

    // Reset local state when opening
    useEffect(() => {
        if (isOpen) {
            setLocalType(transactionTypeFilter);
            setLocalMember(selectedMemberId);
            setViewDate(dateRange.startDate);
        }
    }, [isOpen, transactionTypeFilter, selectedMemberId, dateRange]);

    const handleApply = () => {
        setTransactionTypeFilter(localType);
        setSelectedMemberId(localMember);

        // Apply month range based on viewDate
        setDateRange({
            startDate: startOfMonth(viewDate),
            endDate: endOfMonth(viewDate)
        });

        onClose();
    };

    // Month navigation
    const nextMonth = () => setViewDate(d => addMonths(d, 1));
    const prevMonth = () => setViewDate(d => subMonths(d, 1));

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] lg:hidden flex flex-col justify-end bg-neutral-1100/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white w-full rounded-t-3xl shadow-2xl flex flex-col max-h-[90vh] animate-slide-in-up">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-neutral-100 shrink-0">
                    <h2 className="text-xl font-bold text-neutral-1100">Filtros</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-neutral-50 text-neutral-500 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8">

                    {/* Type Filter */}
                    <div className="flex flex-col gap-3">
                        <span className="text-sm font-bold text-neutral-1100">Tipo de Transação</span>
                        <div className="grid grid-cols-3 gap-3">
                            {(['all', 'INCOME', 'EXPENSE'] as const).map(t => (
                                <button
                                    key={t}
                                    onClick={() => setLocalType(t)}
                                    className={clsx(
                                        "h-12 rounded-2xl text-sm font-bold transition-all border",
                                        localType === t
                                            ? "bg-neutral-1100 text-white border-neutral-1100 shadow-md"
                                            : "bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50"
                                    )}
                                >
                                    {t === 'all' ? 'Todos' : t === 'INCOME' ? 'Receitas' : 'Despesas'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Member Filter */}
                    <div className="flex flex-col gap-3">
                        <span className="text-sm font-bold text-neutral-1100">Membro da Família</span>
                        <div className="flex flex-wrap gap-3">
                            {/* All */}
                            <button
                                onClick={() => setLocalMember(null)}
                                className={clsx(
                                    "px-4 py-2.5 rounded-full text-sm font-bold transition-all border flex items-center gap-2",
                                    localMember === null
                                        ? "bg-neutral-1100 text-white border-neutral-1100 shadow-md"
                                        : "bg-white text-neutral-600 border-neutral-200"
                                )}
                            >
                                Todos
                            </button>
                            {/* Members */}
                            {familyMembers.map(m => (
                                <button
                                    key={m.id}
                                    onClick={() => setLocalMember(m.id)}
                                    className={clsx(
                                        "px-2 py-1.5 pr-4 rounded-full text-sm font-bold transition-all border flex items-center gap-2",
                                        localMember === m.id
                                            ? "bg-neutral-1100 text-white border-neutral-1100 shadow-md"
                                            : "bg-white text-neutral-600 border-neutral-200"
                                    )}
                                >
                                    <div className={clsx("size-8 rounded-full border-2 flex items-center justify-center overflow-hidden bg-neutral-200", localMember === m.id ? "border-white" : "border-transparent")}>
                                        {m.avatarUrl ? (
                                            <img src={m.avatarUrl} alt={m.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-[10px] text-neutral-500 font-black">{m.name[0]}</span>
                                        )}
                                    </div>
                                    {m.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Period (Simplified Month Picker for now) */}
                    <div className="flex flex-col gap-3">
                        <span className="text-sm font-bold text-neutral-1100">Período (Mês)</span>
                        <div className="bg-neutral-50 rounded-2xl p-4 flex items-center justify-between border border-neutral-100">
                            <button onClick={prevMonth} className="p-2 hover:bg-white rounded-lg transition-colors"><ChevronLeft size={20} className="text-neutral-500" /></button>
                            <div className="text-center">
                                <span className="block text-lg font-bold text-neutral-1100 capitalize">
                                    {format(viewDate, 'MMMM yyyy', { locale: ptBR })}
                                </span>
                            </div>
                            <button onClick={nextMonth} className="p-2 hover:bg-white rounded-lg transition-colors"><ChevronRight size={20} className="text-neutral-500" /></button>
                        </div>
                    </div>

                    {/* Spacer for button visibility */}
                    <div className="h-4" />

                </div>

                {/* Footer */}
                <div className="p-6 border-t border-neutral-100 bg-white shrink-0">
                    <button
                        onClick={handleApply}
                        className="w-full h-14 rounded-full bg-neutral-1100 text-white font-bold text-lg hover:bg-neutral-900 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                    >
                        Applicar Filtros <Check size={20} />
                    </button>
                </div>

            </div>
        </div>
    );
}
