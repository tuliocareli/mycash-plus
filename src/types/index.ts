export type TransactionType = 'income' | 'expense';
export type TransactionStatus = 'completed' | 'pending';
export type MemberRole = 'Pai' | 'Mãe' | 'Filho' | 'Filha' | 'Avô' | 'Avó' | 'Tio' | 'Tia' | 'Outro';
export type AccountType = 'bank' | 'creditCard';

export interface FamilyMember {
    id: string;
    name: string;
    role: MemberRole;
    avatarUrl?: string; // URL da imagem ou nulo para genérico
    income?: number; // Renda mensal estimada
}

export interface BankAccount {
    id: string;
    name: string;
    holderId: string; // ID do FamilyMember titular
    balance: number;
    type: 'bank';
}

export interface CreditCard {
    id: string;
    name: string;
    holderId: string;
    limit: number;
    currentBill: number;
    closingDay: number; // Dia de fechamento (1-31)
    dueDay: number; // Dia de vencimento (1-31)
    lastDigits?: string;
    theme: 'black' | 'lime' | 'white';
    type: 'creditCard';
}

export interface Transaction {
    id: string;
    date: string; // ISO String ou Date object (preferência ISO para serialização)
    description: string;
    amount: number;
    type: TransactionType;
    category: string;
    accountId: string; // ID de BankAccount ou CreditCard
    memberId?: string | null; // ID do membro responsável ou null para família toda
    status: TransactionStatus;
    installments?: number; // 1 para à vista
    currentInstallment?: number;
    isRecurring?: boolean;
    isPaid: boolean;
}

export interface Goal {
    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    deadline?: string;
    icon?: string;
    color?: string;
}

export interface DateRange {
    startDate: Date;
    endDate: Date;
}
