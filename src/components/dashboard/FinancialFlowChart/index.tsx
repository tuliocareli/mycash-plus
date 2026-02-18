import { TrendingUp } from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { useFinance } from '../../../contexts/FinanceContext';
import { useMemo } from 'react';
import { subMonths, format, startOfMonth, endOfMonth, eachMonthOfInterval, isSameMonth, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const formatYAxis = (value: number) => {
    if (value >= 1000) {
        return `R$ ${(value / 1000).toFixed(0)}k`;
    }
    return `R$ ${value}`;
};

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
};

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-4 border border-neutral-100 rounded-xl shadow-2xl">
                <p className="text-sm font-bold text-neutral-1100 mb-2">{label}</p>
                <p className="text-xs font-semibold text-brand-700">
                    Receitas: {formatCurrency(payload[0].value)}
                </p>
                <p className="text-xs font-semibold text-neutral-1100 mt-1">
                    Despesas: {formatCurrency(payload[1].value)}
                </p>
            </div>
        );
    }
    return null;
};

export function FinancialFlowChart() {
    const {
        transactions,
        selectedMemberId,
        categoryIdFilter,
        accountIdFilter,
        statusFilter,
        searchText
    } = useFinance();

    const chartData = useMemo(() => {
        // Define range: Last 6 months including current
        const end = new Date();
        const start = subMonths(end, 5); // 5 months ago + current = 6

        // Generate all months in interval to ensure x-axis continuity
        const monthsInterval = eachMonthOfInterval({
            start: startOfMonth(start),
            end: endOfMonth(end)
        });

        // Apply filters (except Date) to match Dashboard context
        const relevantTransactions = transactions.filter(t => {
            if (!t) return false;

            if (selectedMemberId && t.memberId !== selectedMemberId) return false;
            // Handle optional categoryId
            if (categoryIdFilter && t.categoryId !== categoryIdFilter) return false;
            // Handle optional accountId
            if (accountIdFilter && t.accountId !== accountIdFilter) return false;
            if (statusFilter && t.status !== statusFilter) return false;

            if (searchText) {
                const text = searchText.toLowerCase();
                const desc = t.description ? t.description.toLowerCase() : '';
                // Ensure category exists before processing
                const cat = t.category ? t.category.toLowerCase() : '';
                return desc.includes(text) || cat.includes(text);
            }
            return true;
        });

        return monthsInterval.map(monthDate => {
            // Find transactions in this month
            const monthlyTransactions = relevantTransactions.filter(t =>
                isSameMonth(parseISO(t.date), monthDate)
            );

            const income = monthlyTransactions
                .filter(t => t.type === 'INCOME')
                .reduce((acc, t) => acc + t.amount, 0);

            const expense = monthlyTransactions
                .filter(t => t.type === 'EXPENSE')
                .reduce((acc, t) => acc + t.amount, 0);

            // Format month name (e.g., 'Jan', 'Fev')
            const monthLabel = format(monthDate, 'MMM', { locale: ptBR });
            // Capitalize first letter logic if needed, or stick to lowercase/default
            const formattedLabel = monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1);

            return {
                month: formattedLabel,
                income,
                expense,
                fullDate: monthDate // useful if needed for sorting, but map preserves order
            };
        });
    }, [transactions, selectedMemberId, categoryIdFilter, accountIdFilter, statusFilter, searchText]);

    return (
        <div className="bg-white border border-neutral-200 rounded-3xl p-8 lg:p-10 w-full h-full flex flex-col shadow-sm">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-neutral-100 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-neutral-1100" />
                    </div>
                    <h2 className="text-lg font-medium text-neutral-1100">Fluxo financeiro</h2>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#DFFE35]" />
                        <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Receitas</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#080B12]" />
                        <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Despesas</span>
                    </div>
                </div>
            </div>

            {/* Chart Area */}
            <div className="w-full flex-1 bg-neutral-50/50 rounded-xl p-4 lg:p-6 min-h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 10, bottom: 25 }}
                    >
                        <defs>
                            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#DFFE35" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#DFFE35" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#080B12" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#080B12" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="#E5E7EB"
                            opacity={0.5}
                        />
                        <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#9CA3AF' }}
                            padding={{ left: 20, right: 20 }}
                            dy={5}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={formatYAxis}
                            tick={{ fontSize: 12, fill: '#9CA3AF' }}
                            tickMargin={10}
                            width={80}
                        />
                        <Tooltip
                            content={<CustomTooltip />}
                            cursor={{ stroke: '#E5E7EB', strokeWidth: 1 }}
                        />
                        <Area
                            type="monotone"
                            dataKey="income"
                            stroke="#DFFE35"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorIncome)"
                        />
                        <Area
                            type="monotone"
                            dataKey="expense"
                            stroke="#080B12"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorExpense)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
