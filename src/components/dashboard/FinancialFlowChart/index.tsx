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

const data = [
    { month: 'Jan', income: 15000, expense: 8000 },
    { month: 'Fev', income: 18000, expense: 9500 },
    { month: 'Mar', income: 16500, expense: 11000 },
    { month: 'Abr', income: 21000, expense: 12000 },
    { month: 'Mai', income: 19000, expense: 10500 },
    { month: 'Jun', income: 24000, expense: 13000 },
    { month: 'Jul', income: 27000, expense: 14500 },
];

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
    return (
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 lg:p-10 w-full">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-neutral-100 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-neutral-1100" />
                    </div>
                    <h2 className="text-lg font-bold text-neutral-1100">Fluxo financeiro</h2>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#DFFE35]" />
                        <span className="text-sm font-medium text-neutral-500">Receitas</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#080B12]" />
                        <span className="text-sm font-medium text-neutral-500">Despesas</span>
                    </div>
                </div>
            </div>

            {/* Chart Area */}
            <div className="w-full h-[320px] bg-neutral-50/50 rounded-xl p-4 lg:p-6">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{ top: 20, right: 30, left: 10, bottom: 10 }}
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
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={formatYAxis}
                            tick={{ fontSize: 12, fill: '#9CA3AF' }}
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
