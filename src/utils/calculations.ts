
export const calculateSavingsRate = (income: number, expenses: number): number => {
    if (income <= 0) return 0;
    const rate = ((income - expenses) / income) * 100;
    return Math.max(0, rate);
};

export const calculatePercentage = (value: number, total: number): number => {
    if (total <= 0) return 0;
    return (value / total) * 100;
};

export const formatPercent = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'percent',
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
    }).format(value / 100);
};
