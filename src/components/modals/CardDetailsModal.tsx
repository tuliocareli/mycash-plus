import { useState, useMemo } from 'react';
import { X, Calendar, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import { useFinance } from '../../contexts/FinanceContext';
import { CreditCard } from '../../types';
import { NewTransactionModal } from './NewTransactionModal';

interface CardDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    card: CreditCard | null;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
};

export function CardDetailsModal({ isOpen, onClose, card }: CardDetailsModalProps) {


    const { transactions } = useFinance();
    const [currentPage, setCurrentPage] = useState(1);
    const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);

    // Pagination
    const itemsPerPage = 5;

    // Filter transactions for this card
    const cardTransactions = useMemo(() => {
        if (!card) return [];
        return transactions.filter(t => t.accountId === card.id && t.type === 'EXPENSE');
    }, [transactions, card]);

    const totalPages = Math.ceil(cardTransactions.length / itemsPerPage);
    const paginatedTransactions = cardTransactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const availableLimit = card ? (card.creditLimit || 0) - card.currentBill : 0;
    const usagePercentage = card ? (card.currentBill / (card.creditLimit || 1)) * 100 : 0;

    if (!isOpen || !card) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-1100/40 backdrop-blur-md animate-fade-in p-4">
            <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden animate-scale-in max-h-[90vh] flex flex-col">

                {/* Header */}
                <div className="flex items-center justify-between p-6 md:p-8 border-b border-neutral-100 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className={clsx("size-12 rounded-xl flex items-center justify-center",
                            card.theme === 'black' ? "bg-neutral-1100 text-white" :
                                card.theme === 'lime' ? "bg-brand-500 text-neutral-1100" :
                                    "bg-white border text-neutral-1100"
                        )}>
                            <span className="font-bold text-xl">{card.name[0]}</span>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-neutral-1100">{card.name}</h2>
                            <p className="text-sm text-neutral-500">**** {card.lastDigits || '****'}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-neutral-50 text-neutral-500 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-neutral-50/50 flex flex-col gap-8">

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm">
                            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Limite Total</span>
                            <p className="text-2xl font-bold text-neutral-1100 mt-1">{formatCurrency(card.creditLimit || 0)}</p>
                        </div>
                        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm relative overflow-hidden">
                            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Fatura Atual</span>
                            <p className="text-2xl font-bold text-red-500 mt-1">{formatCurrency(card.currentBill)}</p>
                            <div className="absolute right-0 top-0 h-full w-1 bg-red-500" style={{ opacity: usagePercentage / 100 }} />
                        </div>
                        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm">
                            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Disponível</span>
                            <p className="text-2xl font-bold text-brand-700 mt-1">{formatCurrency(availableLimit)}</p>
                        </div>
                    </div>

                    {/* Progress Bar & Dates */}
                    <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between text-sm font-bold">
                                <span className="text-neutral-500">Uso do Limite</span>
                                <span className="text-neutral-1100">{usagePercentage.toFixed(1)}%</span>
                            </div>
                            <div className="h-3 w-full bg-neutral-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-neutral-1100 rounded-full transition-all duration-1000 ease-out"
                                    style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                                />
                            </div>
                        </div>

                        <div className="flex justify-between border-t border-neutral-100 pt-4">
                            <div>
                                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block mb-1">Fechamento</span>
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} className="text-neutral-400" />
                                    <span className="font-bold text-neutral-1100">Dia {card.closingDay}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block mb-1">Vencimento</span>
                                <div className="flex items-center gap-2 justify-end">
                                    <Calendar size={16} className="text-neutral-400" />
                                    <span className="font-bold text-neutral-1100">Dia {card.dueDay}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Transactions List */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-neutral-1100">Despesas Recentes</h3>
                            <button onClick={() => setIsTransactionModalOpen(true)} className="text-xs font-bold bg-neutral-1100 text-white px-4 py-2 rounded-full hover:bg-neutral-900 transition-colors flex items-center gap-2">
                                <Plus size={14} /> Adicionar Despesa
                            </button>
                        </div>

                        {cardTransactions.length === 0 ? (
                            <div className="p-8 text-center text-neutral-500 text-sm bg-white rounded-2xl border border-neutral-200 border-dashed">
                                Nenhuma despesa registrada neste cartão.
                            </div>
                        ) : (
                            <div className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-sm">
                                <table className="w-full text-left">
                                    <thead className="bg-neutral-50 border-b border-neutral-100">
                                        <tr>
                                            <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-wider">Data</th>
                                            <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-wider">Descrição</th>
                                            <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-wider text-right">Valor</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-100">
                                        {paginatedTransactions.map(t => (
                                            <tr key={t.id} className="hover:bg-neutral-50/50 transition-colors">
                                                <td className="px-6 py-4 text-sm font-medium text-neutral-500 whitespace-nowrap">
                                                    {new Date(t.date).toLocaleDateString('pt-BR')}
                                                </td>
                                                <td className="px-6 py-4 text-sm font-bold text-neutral-1100">
                                                    {t.description}
                                                    {t.totalInstallments > 1 && (
                                                        <span className="ml-2 px-2 py-0.5 bg-neutral-100 text-[10px] rounded text-neutral-500">
                                                            {t.installmentNumber}/{t.totalInstallments}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-sm font-bold text-neutral-1100 text-right">
                                                    {formatCurrency(t.amount)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex items-center justify-between p-4 border-t border-neutral-100 bg-neutral-50/30">
                                        <button
                                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                            className="p-2 rounded-lg hover:bg-white disabled:opacity-30 transition-all font-bold text-xs text-neutral-600 flex items-center gap-1"
                                        >
                                            <ChevronLeft size={16} /> Ant
                                        </button>
                                        <span className="text-xs font-bold text-neutral-400">Pág {currentPage} de {totalPages}</span>
                                        <button
                                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                            disabled={currentPage === totalPages}
                                            className="p-2 rounded-lg hover:bg-white disabled:opacity-30 transition-all font-bold text-xs text-neutral-600 flex items-center gap-1"
                                        >
                                            Prox <ChevronRight size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                    </div>

                </div>
            </div>

            {/* Nested Modal call - In a real app, handle via context or route to avoid prop drilling */}
            <NewTransactionModal
                isOpen={isTransactionModalOpen}
                onClose={() => setIsTransactionModalOpen(false)}
                initialAccountId={card.id}
            />
        </div>
    );
}
