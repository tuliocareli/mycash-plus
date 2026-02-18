
export type TransactionType = 'INCOME' | 'EXPENSE';
export type TransactionStatus = 'COMPLETED' | 'PENDING';
export type AccountType = 'CHECKING' | 'SAVINGS' | 'CREDIT_CARD';
export type RecurrenceFrequency = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
export type MemberRole = 'Pai' | 'Mãe' | 'Filho' | 'Filha' | 'Avô' | 'Avó' | 'Tio' | 'Tia' | string;

export interface User {
    id: string;
    email: string;
    name: string;
    avatarUrl?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface FamilyMember {
    id: string;
    userId: string;
    name: string;
    role: string;
    avatarUrl?: string;
    monthlyIncome: number;
    color: string;
    isActive: boolean;
}

export interface Category {
    id: string;
    userId: string;
    name: string;
    icon: string;
    type: TransactionType;
    color: string;
    isActive: boolean;
}

export interface Account {
    id: string;
    userId: string;
    type: AccountType;
    name: string;
    bank: string;
    lastDigits?: string;
    holderId: string;
    balance: number;
    creditLimit?: number;
    currentBill: number;
    dueDay?: number;
    closingDay?: number;
    theme?: string;
    logoUrl?: string;
    color: string;
    isActive: boolean;
}

export interface Transaction {
    id: string;
    userId: string;
    type: TransactionType;
    amount: number;
    description: string;
    date: string;
    categoryId?: string;
    accountId?: string;
    memberId?: string;
    installmentNumber?: number;
    totalInstallments: number;
    parentTransactionId?: string;
    isRecurring: boolean;
    recurringTransactionId?: string;
    status: TransactionStatus;
    notes?: string;
    createdAt?: string;
    updatedAt?: string;

    // Joined fields (optional)
    category?: string; // Currently UI uses string name often, but let's see. The table stores ID.
    // The previous mocks used category name directly in 'category' field for Transaction.
    // The new schema uses 'categoryId'.
    // To minimize breakage, I'll keep 'category' as the NAME (string) populated by join, and 'categoryId' as the ID.
    category_icon?: string;
    category_color?: string;
}

export interface RecurringTransaction {
    id: string;
    userId: string;
    type: TransactionType;
    amount: number;
    description: string;
    categoryId?: string;
    accountId?: string;
    memberId?: string;
    frequency: RecurrenceFrequency;
    dayOfMonth?: number;
    dayOfWeek?: number;
    startDate: string;
    endDate?: string;
    isActive: boolean;
    notes?: string;
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

// Helpers for backward compatibility
// The UI likely checks "type" to distinguish.
// But we might need to cast Account to CreditCard interface if some code specific properties.
// In this new schema, Account has all properties (some optional).
export type CreditCard = Account;
export type BankAccount = Account;
