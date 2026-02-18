import { useState } from 'react';
import { Plus, CreditCard as CardIcon, Calendar } from 'lucide-react';
import { useFinance } from '../../contexts/FinanceContext';
import { CreditCard } from '../../types';
import { CardDetailsModal } from '../../components/modals/CardDetailsModal';
import { NewTransactionModal } from '../../components/modals/NewTransactionModal';
import { AddAccountModal } from '../../components/modals/AddAccountModal';
import clsx from 'clsx';

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
};

export default function Cards() {
    const { creditCards } = useFinance();
    // Using outlet context to trigger global modals if they were hoisted, 
    // but for now we'll keep local state for details and new transaction, 
    // and assume Add Card is global or local here too.

    // We'll use local state for specific card interactions
    const [selectedCard, setSelectedCard] = useState<CreditCard | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    // "Add Expense" helper state
    const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
    const [preSelectedCardId, setPreSelectedCardId] = useState('');

    // Sort cards: Highest Bill first
    const sortedCards = [...creditCards].sort((a, b) => b.currentBill - a.currentBill);

    const handleOpenDetails = (card: CreditCard) => {
        setSelectedCard(card);
        setIsDetailsOpen(true);
    };

    const handleAddExpense = (cardId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setPreSelectedCardId(cardId);
        setIsTransactionModalOpen(true);
    };

    // Need Context to Open "Add Card" Modal globally? 
    // Let's assume passed via OutletContext or we just import it here if we didn't hoist it yet.
    // For now, let's look at how to trigger "Add Card".
    // Since I haven't modified Layout yet, I can't rely on useOutletContext for modals.
    // I will expect Layout to provide this eventually, but for now I'll use a placeholder or local import if I want to support it here.
    // Wait, Prompt 17 says "View Completa de Cartões". It says "Header com botão Novo Cartão".
    // I should probably hoist AddAccountModal to Layout or include it here.
    // I'll include it here locally for now to ensure it works independent of Layout refactoring.
    const [isAddCardOpen, setIsAddCardOpen] = useState(false);
    // Dynamic import to avoid circular dep issues if any, but regular import is fine.
    // I'll import AddAccountModal at the top (not done yet in this file string, doing it now)

    return (
        <div className="w-full flex flex-col gap-8 pb-20 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-neutral-1100">Cartões de Crédito</h1>
                    <p className="text-neutral-500 mt-1">Gerencie seus limites e faturas.</p>
                </div>
                <button
                    onClick={() => setIsAddCardOpen(true)}
                    className="flex items-center gap-2 bg-neutral-1100 text-white px-5 py-3 rounded-full font-bold hover:bg-neutral-900 transition-colors shadow-lg active:scale-95"
                >
                    <Plus size={20} />
                    <span className="hidden sm:inline">Novo Cartão</span>
                </button>
            </div>

            {/* Cards Grid */}
            {sortedCards.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 bg-neutral-100 rounded-3xl border border-dashed border-neutral-300 text-center gap-4">
                    <div className="p-4 bg-white rounded-full text-neutral-400 shadow-sm">
                        <CardIcon size={32} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-neutral-1100">Nenhum cartão cadastrado</h3>
                        <p className="text-neutral-500 text-sm">Adicione seu primeiro cartão para controlar gastos.</p>
                    </div>
                    <button
                        onClick={() => setIsAddCardOpen(true)}
                        className="mt-2 text-brand-700 font-bold hover:underline"
                    >
                        Cadastrar Primeiro Cartão
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {sortedCards.map(card => {
                        const usage = (card.currentBill / card.limit) * 100;

                        return (
                            <div
                                key={card.id}
                                onClick={() => handleOpenDetails(card)}
                                className="group bg-white rounded-3xl border border-neutral-200 p-6 flex flex-col gap-6 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
                            >
                                {/* Colored Top Border based on Theme */}
                                <div className={clsx(
                                    "absolute top-0 left-0 w-full h-1.5",
                                    card.theme === 'black' ? "bg-neutral-1100" :
                                        card.theme === 'lime' ? "bg-brand-500" : "bg-neutral-200"
                                )} />

                                {/* Card Header */}
                                <div className="flex justify-between items-start pt-2">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-neutral-400 uppercase tracking-wider mb-1">Cartão</span>
                                        <h3 className="text-xl font-bold text-neutral-1100 leading-tight">{card.name}</h3>
                                    </div>
                                    <div className={clsx(
                                        "size-10 rounded-xl flex items-center justify-center shadow-sm border",
                                        card.theme === 'black' ? "bg-neutral-1100 text-white border-transparent" :
                                            card.theme === 'lime' ? "bg-brand-500 text-neutral-1100 border-transparent" :
                                                "bg-white text-neutral-1100 border-neutral-200"
                                    )}>
                                        <CardIcon size={20} />
                                    </div>
                                </div>

                                {/* Values */}
                                <div className="flex flex-col gap-4">
                                    <div className="flex justify-between items-end">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-neutral-400 uppercase">Fatura Atual</span>
                                            <span className={clsx(
                                                "text-2xl font-extrabold tracking-tight",
                                                usage > 80 ? "text-red-500" : "text-neutral-1100"
                                            )}>
                                                {formatCurrency(card.currentBill)}
                                            </span>
                                        </div>
                                        <div className="text-right flex flex-col">
                                            <span className="text-xs font-bold text-neutral-400 uppercase">Limite</span>
                                            <span className="text-sm font-bold text-neutral-600">{formatCurrency(card.limit)}</span>
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="flex flex-col gap-1.5">
                                        <div className="flex justify-between text-[10px] font-bold uppercase text-neutral-400">
                                            <span>Uso</span>
                                            <span>{usage.toFixed(0)}%</span>
                                        </div>
                                        <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                                            <div
                                                className={clsx("h-full rounded-full transition-all duration-1000", usage > 90 ? "bg-red-500" : "bg-neutral-1100")}
                                                style={{ width: `${Math.min(usage, 100)}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-between pt-2">
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-500 bg-neutral-50 px-2 py-1 rounded-lg">
                                            <Calendar size={12} />
                                            Vence dia {card.dueDay}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-500 bg-neutral-50 px-2 py-1 rounded-lg">
                                            <Calendar size={12} />
                                            Fecha dia {card.closingDay}
                                        </div>
                                    </div>
                                </div>

                                {/* Last Digits */}
                                {card.lastDigits && (
                                    <div className="absolute bottom-6 right-6 opacity-10 font-mono text-4xl tracking-widest pointer-events-none font-bold">
                                        {card.lastDigits}
                                    </div>
                                )}

                                {/* Actions Overlay (Hover) - visible on mobile usually? make separate buttons */}
                                <div className="mt-auto pt-4 flex gap-2 z-10">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleOpenDetails(card); }}
                                        className="flex-1 py-3 rounded-xl border border-neutral-200 text-sm font-bold text-neutral-600 hover:bg-neutral-50 transition-colors"
                                    >
                                        Detalhes
                                    </button>
                                    <button
                                        onClick={(e) => handleAddExpense(card.id, e)}
                                        className="flex-1 py-3 rounded-xl bg-neutral-1100 text-sm font-bold text-white hover:bg-neutral-900 transition-colors flex items-center justify-center gap-1"
                                    >
                                        <Plus size={16} /> Despesa
                                    </button>
                                </div>

                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modals */}
            {selectedCard && (
                <CardDetailsModal
                    isOpen={isDetailsOpen}
                    onClose={() => setIsDetailsOpen(false)}
                    card={selectedCard}
                />
            )}

            <NewTransactionModal
                isOpen={isTransactionModalOpen}
                onClose={() => setIsTransactionModalOpen(false)}
                initialAccountId={preSelectedCardId}
            />

            <AddAccountModal
                isOpen={isAddCardOpen}
                onClose={() => setIsAddCardOpen(false)}
            />
        </div>
    );
}
