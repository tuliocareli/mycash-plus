
import { Transaction } from '../types';

export const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

export const validateTransaction = (data: Partial<Transaction>): string | null => {
    if (!data.description || data.description.trim().length < 3) {
        return 'A descrição deve ter pelo menos 3 caracteres.';
    }

    if (!data.amount || data.amount <= 0) {
        return 'O valor deve ser maior que zero.';
    }

    if (!data.date) {
        return 'A data é obrigatória.';
    }

    if (!data.type) {
        return 'O tipo da transação é obrigatório.';
    }

    if (!data.categoryId) {
        return 'A categoria é obrigatória.';
    }

    if (!data.accountId) {
        return 'A conta de origem é obrigatória.';
    }

    return null;
};
