import { useFinance } from '../../../contexts/FinanceContext';
import { useMemo } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    LineChart,
    Line,
} from 'recharts';
import { TrendingUp, Award, BarChart3, PieChart } from 'lucide-react';

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
                {payload.map((entry: any, index: number) => (
                    <p key={index} className="text-xs font-semibold" style={{ color: entry.color }}>
                        {entry.name}: {entry.name.includes('%') ? `${entry.value.toFixed(1)}%` : formatCurrency(entry.value)}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export function ClosureReports() {
    const { monthlyClosings } = useFinance();

    // Reverse closings to show chronologically if needed, or keep latest first. 
    // Usually charts go left-to-right (past-to-present).
    const chartData = useMemo(() => {
        return [...monthlyClosings]
            .reverse() // from oldest to newest
            .map(c => {
                const savings = c.totalIncome - c.totalExpense;
                const savingsRate = c.totalIncome > 0 ? (savings / c.totalIncome) * 100 : 0;
                return {
                    period: c.period,
                    income: c.totalIncome,
                    expense: c.totalExpense,
                    savings: Math.max(0, savings),
                    savingsRate: savingsRate
                };
            });
    }, [monthlyClosings]);

    const stats = useMemo(() => {
        if (monthlyClosings.length === 0) return null;

        const totalIncome = monthlyClosings.reduce((acc, c) => acc + c.totalIncome, 0);
        const totalExpense = monthlyClosings.reduce((acc, c) => acc + c.totalExpense, 0);
        const avgIncome = totalIncome / monthlyClosings.length;
        const avgSavings = (totalIncome - totalExpense) / monthlyClosings.length;
        const bestMonth = [...monthlyClosings].sort((a,b) => (b.totalIncome - b.totalExpense) - (a.totalIncome - a.totalExpense))[0];

        return {
            avgIncome,
            avgSavings,
            bestMonth,
            count: monthlyClosings.length
        };
    }, [monthlyClosings]);

    if (monthlyClosings.length < 1) return null;

    return (
        <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            <div className="flex items-center gap-3">
                <div className="size-12 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-600">
                    <BarChart3 size={24} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-neutral-1100">Análise de Desempenho</h2>
                    <p className="text-neutral-500">Insights baseados nos seus ciclos encerrados</p>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-[32px] border border-neutral-200 shadow-sm flex items-center gap-4">
                    <div className="size-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <TrendingUp size={28} />
                    </div>
                    <div>
                        <p className="text-xs text-neutral-400 font-bold uppercase tracking-widest">Média de Renda</p>
                        <p className="text-xl font-black text-neutral-1100">
                            {formatCurrency(stats?.avgIncome || 0)}
                        </p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-[32px] border border-neutral-200 shadow-sm flex items-center gap-4">
                    <div className="size-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
                        <Award size={28} />
                    </div>
                    <div>
                        <p className="text-xs text-neutral-400 font-bold uppercase tracking-widest">Melhor Ciclo</p>
                        <p className="text-xl font-black text-neutral-1100">
                            {stats?.bestMonth?.period || 'N/A'}
                        </p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-[32px] border border-neutral-200 shadow-sm flex items-center gap-4">
                    <div className="size-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <PieChart size={28} />
                    </div>
                    <div>
                        <p className="text-xs text-neutral-400 font-bold uppercase tracking-widest">Média de Economia</p>
                        <p className="text-xl font-black text-neutral-1100">
                            {formatCurrency(stats?.avgSavings || 0)}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Comparison Chart */}
                <div className="bg-white p-8 rounded-[32px] border border-neutral-200 shadow-sm">
                    <h3 className="text-lg font-bold text-neutral-1100 mb-6">Comparativo de Ciclos</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                                <XAxis 
                                    dataKey="period" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fontSize: 12, fill: '#9CA3AF' }}
                                    dy={10}
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fontSize: 10, fill: '#9CA3AF' }}
                                    tickFormatter={(val) => `R$ ${val/1000}k`}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F9FAFB' }} />
                                <Legend 
                                    verticalAlign="top" 
                                    align="right" 
                                    iconType="circle"
                                    wrapperStyle={{ paddingBottom: 20, fontSize: 12, fontWeight: 700 }}
                                />
                                <Bar name="Renda" dataKey="income" fill="#DFFE35" radius={[4, 4, 0, 0]} barSize={24} />
                                <Bar name="Gastos" dataKey="expense" fill="#080B12" radius={[4, 4, 0, 0]} barSize={24} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Savings Rate Chart */}
                <div className="bg-white p-8 rounded-[32px] border border-neutral-200 shadow-sm">
                    <h3 className="text-lg font-bold text-neutral-1100 mb-6">Tendência de Economia (%)</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                                <XAxis 
                                    dataKey="period" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fontSize: 12, fill: '#9CA3AF' }}
                                    dy={10}
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fontSize: 10, fill: '#9CA3AF' }}
                                    tickFormatter={(val) => `${val}%`}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Line 
                                    name="Taxa de Economia %" 
                                    type="monotone" 
                                    dataKey="savingsRate" 
                                    stroke="#DFFE35" 
                                    strokeWidth={4}
                                    dot={{ r: 6, fill: '#DFFE35', strokeWidth: 2, stroke: '#fff' }}
                                    activeDot={{ r: 8, strokeWidth: 0 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
