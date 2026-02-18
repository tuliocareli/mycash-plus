import { useState } from 'react';
import { CreditCard as CardIcon, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useFinance } from '../../../contexts/FinanceContext';
import { CreditCard } from '../../../types';
import clsx from 'clsx';

// Helper to format currency
const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
};

export function CreditCardsWidget() {
    const { creditCards } = useFinance();
    const [currentPage, setCurrentPage] = useState(0);
    const cardsPerPage = 3;

    const totalPages = Math.ceil(creditCards.length / cardsPerPage);
    const paginatedCards = creditCards.slice(
        currentPage * cardsPerPage,
        (currentPage + 1) * cardsPerPage
    );

    return (
        <section className="bg-neutral-100 rounded-[32px] p-8 lg:p-10 flex flex-col gap-6 h-full border border-neutral-200/50">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <CardIcon className="size-5 text-neutral-1100" />
                    <h2 className="text-lg font-medium text-neutral-1100">Cartões</h2>
                </div>
                <button
                    onClick={() => console.log('Open Add Card Modal')}
                    className="size-10 rounded-full bg-white flex items-center justify-center text-neutral-1100 shadow-sm border border-neutral-200 hover:bg-neutral-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    title="Novo Cartão"
                >
                    <Plus size={20} />
                </button>
            </div>

            {/* List */}
            <div className="flex flex-col gap-5 flex-1">
                {paginatedCards.map((card) => (
                    <CreditCardItem key={card.id} card={card} />
                ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-neutral-200/60">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                        disabled={currentPage === 0}
                        className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-neutral-1100 disabled:opacity-30 hover:bg-white px-3 py-1.5 rounded-lg transition-all shadow-sm disabled:shadow-none"
                    >
                        <ChevronLeft size={14} strokeWidth={3} />
                        Anterior
                    </button>
                    <div className="flex gap-1.5">
                        {Array.from({ length: totalPages }).map((_, i) => (
                            <div
                                key={i}
                                className={clsx(
                                    "size-1.5 rounded-full transition-all duration-300",
                                    currentPage === i ? "w-4 bg-brand-500" : "bg-neutral-300"
                                )}
                            />
                        ))}
                    </div>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                        disabled={currentPage === totalPages - 1}
                        className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-neutral-1100 disabled:opacity-30 hover:bg-white px-3 py-1.5 rounded-lg transition-all shadow-sm disabled:shadow-none"
                    >
                        Próximo
                        <ChevronRight size={14} strokeWidth={3} />
                    </button>
                </div>
            )}
        </section>
    );
}

function CreditCardItem({ card }: { card: CreditCard }) {
    // Theme styles mapping
    const themeStyles: Record<string, { bg: string; iconColor: string; badgeBg: string; badgeText: string; border?: string }> = {
        black: {
            bg: 'bg-[#080B12]',
            iconColor: 'white',
            badgeBg: 'bg-neutral-100',
            badgeText: 'text-neutral-1100'
        },
        lime: {
            bg: 'bg-[#DFFE35]',
            iconColor: '#080B12',
            badgeBg: 'bg-neutral-100',
            badgeText: 'text-neutral-1100'
        },
        white: {
            bg: 'bg-white',
            border: 'border border-neutral-200',
            iconColor: '#080B12',
            badgeBg: 'bg-neutral-100',
            badgeText: 'text-neutral-1100'
        }
    };

    const currentTheme = themeStyles[card.theme];

    return (
        <button
            onClick={() => console.log('Open Card Details Modal', card.id)}
            className="group w-full bg-white rounded-2xl p-5 lg:p-6 flex items-center gap-5 shadow-sm border border-neutral-100 hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300 relative text-left"
        >
            {/* Left: Icon Block */}
            <div className={clsx(
                "size-12 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105",
                currentTheme.bg,
                currentTheme.border
            )}>
                <CardIcon
                    size={22}
                    strokeWidth={2}
                    style={{ color: currentTheme.iconColor }}
                />
            </div>

            {/* Center: Info */}
            <div className="flex-1 min-w-0 flex flex-col">
                <p className="text-[10px] font-bold text-neutral-500 truncate uppercase tracking-widest mb-0.5">
                    {card.name}
                </p>
                <p className="text-[17px] font-extrabold text-neutral-1100 leading-none mb-1">
                    {formatCurrency(card.currentBill)}
                </p>
                <p className="text-[10px] text-neutral-400 font-semibold tracking-wider">
                    Vence dia {card.dueDay}
                </p>
            </div>

            {/* Right: Numbers Badge */}
            <div className={clsx(
                "min-w-10 px-2.5 py-1.5 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110",
                currentTheme.badgeBg,
                currentTheme.badgeText
            )}>
                <span className="text-[10px] font-black leading-none">
                    •••• {card.lastDigits || '****'}
                </span>
            </div>
        </button>
    );
}
