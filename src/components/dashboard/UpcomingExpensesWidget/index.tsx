import { useState, useMemo } from 'react';
import { Wallet, Plus, Check, CircleCheck } from 'lucide-react';
import { useFinance } from '../../../contexts/FinanceContext';
import { Transaction } from '../../../types';
import { format, parseISO, addMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import clsx from 'clsx';

export function UpcomingExpensesWidget() {
    const {
        transactions,
        bankAccounts,
        creditCards,
        updateTransaction,
        addTransaction
    } = useFinance();

    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [animatingId, setAnimatingId] = useState<string | null>(null);

    // Filter unpaid expenses
    const upcomingExpenses = useMemo(() => {
        return transactions
            .filter(t => t.type === 'expense' && !t.isPaid)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [transactions]);

    const handleMarkAsPaid = async (transaction: Transaction) => {
        setAnimatingId(transaction.id);

        // Brief delay for animation
        setTimeout(() => {
            // 1. Update status
            updateTransaction(transaction.id, {
                isPaid: true,
                status: 'completed'
            });

            // 2. Recurrence Logic
            if (transaction.isRecurring) {
                const nextDate = addMonths(parseISO(transaction.date), 1);
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { id, ...transactionData } = transaction;
                addTransaction({
                    ...transactionData,
                    date: nextDate.toISOString(),
                    isPaid: false,
                    status: 'pending'
                });
            }

            // 3. Installments Logic
            if (transaction.installments && transaction.currentInstallment) {
                if (transaction.currentInstallment < transaction.installments) {
                    const nextDate = addMonths(parseISO(transaction.date), 1);
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { id, ...transactionData } = transaction;
                    addTransaction({
                        ...transactionData,
                        date: nextDate.toISOString(),
                        currentInstallment: transaction.currentInstallment + 1,
                        isPaid: false,
                        status: 'pending'
                    });
                }
            }

            setSuccessMessage("Despesa marcada como paga!");
            setAnimatingId(null);

            // Hide success message after 3 seconds
            setTimeout(() => setSuccessMessage(null), 3000);
        }, 600);
    };

    const getOriginLabel = (accountId: string) => {
        const bank = bankAccounts.find(a => a.id === accountId);
        if (bank) return `${bank.name} conta`;

        const card = creditCards.find(c => c.id === accountId);
        if (card) return `Crédito ${card.name} •••• ${card.lastDigits || '****'}`;

        return 'Origem não identificada';
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    return (
        <section className="bg-white border border-neutral-200 rounded-3xl p-8 lg:p-10 flex flex-col h-full bg-white shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                    <Wallet className="size-5 text-neutral-1100" />
                    <h2 className="text-lg font-medium text-neutral-1100">Próximas despesas</h2>
                </div>
                <button
                    onClick={() => console.log('Open New Transaction Modal')}
                    className="size-10 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-1100 hover:bg-neutral-50 transition-colors duration-200 shadow-sm"
                >
                    <Plus size={20} />
                </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
                {upcomingExpenses.length > 0 ? (
                    <div className="flex flex-col">
                        {upcomingExpenses.map((expense) => (
                            <div
                                key={expense.id}
                                className={clsx(
                                    "flex items-center justify-between py-5 border-b border-neutral-100 last:border-0 transition-all duration-500",
                                    animatingId === expense.id && "opacity-0 translate-x-10 pointer-events-none"
                                )}
                            >
                                <div className="flex flex-col gap-1">
                                    <span className="text-base font-bold text-neutral-1100">
                                        {expense.description}
                                        {expense.installments && (
                                            <span className="ml-2 text-[10px] text-neutral-400 font-medium bg-neutral-50 px-1.5 py-0.5 rounded border border-neutral-100">
                                                {expense.currentInstallment}/{expense.installments}
                                            </span>
                                        )}
                                    </span>
                                    <span className="text-sm font-medium text-neutral-600">
                                        Vence dia {format(parseISO(expense.date), 'dd/MM', { locale: ptBR })}
                                    </span>
                                    <span className="text-xs text-neutral-400 font-medium">
                                        {getOriginLabel(expense.accountId)}
                                    </span>
                                </div>

                                <div className="flex flex-col items-end gap-3">
                                    <span className="text-lg font-bold text-neutral-1100">
                                        {formatCurrency(expense.amount)}
                                    </span>
                                    <button
                                        onClick={() => handleMarkAsPaid(expense)}
                                        className={clsx(
                                            "size-8 rounded-full border flex items-center justify-center transition-all duration-300",
                                            "border-neutral-200 text-neutral-400 hover:border-green-500 hover:bg-green-50 hover:text-green-600",
                                            animatingId === expense.id && "bg-green-500 border-green-500 text-white rotate-[360deg] scale-110"
                                        )}
                                        title="Marcar como paga"
                                    >
                                        <Check size={18} strokeWidth={3} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 px-6 border-2 border-dashed border-neutral-100 rounded-2xl h-full min-h-[300px]">
                        <div className="p-4 bg-green-50 rounded-full mb-4">
                            <CircleCheck className="size-10 text-green-500" strokeWidth={1.5} />
                        </div>
                        <p className="text-neutral-400 font-medium">Nenhuma despesa pendente</p>
                    </div>
                )}
            </div>

            {/* Success Message Notification */}
            {successMessage && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-neutral-1100 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-slide-up z-[60]">
                    <div className="bg-green-500 rounded-full p-1">
                        <Check size={14} strokeWidth={4} />
                    </div>
                    <span className="text-sm font-bold">{successMessage}</span>
                </div>
            )}
        </section>
    );
}
