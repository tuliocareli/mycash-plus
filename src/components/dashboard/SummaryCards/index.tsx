import { TrendingUp, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { useFinance } from '../../../contexts/FinanceContext';
import { useCountUp } from '../../../hooks/useCountUp';
import { useMemo } from 'react';
import { subDays, isAfter } from 'date-fns';

function formatCurrency(value: number) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

export function SummaryCards() {
    const { totalBalance, totalIncome, totalExpenses, transactions } = useFinance();

    // --- Calculated Values ---

    // Balance Growth Calculation (Last 30 Days)
    const balance30DaysAgo = useMemo(() => {
        const thirtyDaysAgo = subDays(new Date(), 30);

        // Filter transactions strictly within the last 30 days
        const recentTransactions = transactions.filter(t =>
            isAfter(new Date(t.date), thirtyDaysAgo)
        );

        // Calculate net change in last 30 days
        const incomeChange = recentTransactions
            .filter(t => t.type === 'INCOME')
            .reduce((sum, t) => sum + t.amount, 0);

        const expenseChange = recentTransactions
            .filter(t => t.type === 'EXPENSE')
            .reduce((sum, t) => sum + t.amount, 0);

        const netChange = incomeChange - expenseChange;

        // Previous Balance = Current - NetChange
        return totalBalance - netChange;

    }, [totalBalance, transactions]);

    const balanceGrowth = useMemo(() => {
        if (balance30DaysAgo === 0) return 0;
        return ((totalBalance - balance30DaysAgo) / Math.abs(balance30DaysAgo)) * 100;
    }, [totalBalance, balance30DaysAgo]);


    // Use derived balance (Income - Expenses) to ensure consistency with the Flow cards
    const derivedBalance = totalIncome - totalExpenses;

    // Animated Values
    const animatedBalance = useCountUp(derivedBalance, 1000);
    const animatedIncome = useCountUp(totalIncome, 1000);
    const animatedExpenses = useCountUp(totalExpenses, 1000);


    return (
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full mb-8">

            {/* 1. Balance Card (Dark Theme) */}
            <div className="relative overflow-hidden bg-neutral-1100 text-white rounded-3xl p-6 flex flex-col gap-6 min-h-[160px] shadow-lg group hover:shadow-xl transition-all duration-300">

                {/* Decorative Blur */}
                <div className="absolute -right-12 -top-12 w-64 h-64 bg-brand-500/20 blur-[80px] rounded-full pointer-events-none group-hover:bg-brand-500/30 transition-all duration-500" />

                <div className="relative z-10 flex flex-col gap-1">
                    <span className="text-neutral-400 text-[10px] font-black uppercase tracking-[0.2em]">Saldo</span>
                    <span className="text-4xl lg:text-5xl font-black tracking-tightest">
                        {formatCurrency(animatedBalance)}
                    </span>
                </div>

                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/5">
                        <div className="p-1 rounded-full bg-brand-500/20">
                            <TrendingUp size={14} className={balanceGrowth >= 0 ? "text-brand-500" : "text-red-400"} />
                        </div>
                        <span className="text-xs font-semibold">
                            {balanceGrowth > 0 ? '+' : ''}{balanceGrowth.toFixed(1)}% este mês
                        </span>
                    </div>
                </div>
            </div>

            {/* 2. Income Card (Light Theme) */}
            <div className="bg-white border border-neutral-100 rounded-[2.5rem] p-8 flex flex-col gap-6 min-h-[200px] shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex justify-between items-start">
                    <span className="text-neutral-1100 text-[10px] font-black uppercase tracking-[0.2em] opacity-50">Fluxo Entradas</span>
                    <div className="p-2 rounded-full bg-neutral-100">
                        <ArrowDownLeft size={20} className="text-neutral-500" />
                    </div>
                </div>

                <div className="flex-1 flex flex-col justify-end">
                    <span className="text-3xl font-black text-neutral-1100 tracking-tightest">
                        {formatCurrency(animatedIncome)}
                    </span>
                    <span className="text-[10px] text-neutral-400 font-black uppercase tracking-widest mt-1">
                        Total Receitas
                    </span>
                </div>
            </div>

            {/* 3. Expense Card (Light Theme) */}
            <div className="bg-white border border-neutral-100 rounded-[2.5rem] p-8 flex flex-col gap-6 min-h-[200px] shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex justify-between items-start">
                    <span className="text-neutral-1100 text-[10px] font-black uppercase tracking-[0.2em] opacity-50">Fluxo Saídas</span>
                    <div className="p-2 rounded-full bg-red-50">
                        <ArrowUpRight size={20} className="text-red-500" />
                    </div>
                </div>

                <div className="flex-1 flex flex-col justify-end">
                    <span className="text-3xl font-black text-neutral-1100 tracking-tightest">
                        {formatCurrency(animatedExpenses)}
                    </span>
                    <span className="text-[10px] text-neutral-400 font-black uppercase tracking-widest mt-1">
                        Total Despesas
                    </span>
                </div>
            </div>

        </section>
    );
}
