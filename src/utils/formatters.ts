
import { format, formatDistanceToNow, parseISO, isToday, isYesterday } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
};

export const formatDate = (date: string | Date): string => {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return format(d, 'dd/MM/yyyy');
};

export const formatRelativeDate = (date: string | Date): string => {
    const d = typeof date === 'string' ? parseISO(date) : date;

    if (isToday(d)) return 'Hoje';
    if (isYesterday(d)) return 'Ontem';

    return formatDistanceToNow(d, {
        addSuffix: true,
        locale: ptBR
    });
};

export const formatNumber = (value: number): string => {
    return new Intl.NumberFormat('pt-BR').format(value);
};
