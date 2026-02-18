import { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import {
    Transaction,
    Goal,
    CreditCard,
    BankAccount,
    FamilyMember,
    DateRange,
    TransactionType
} from '../types';
import {
    mockTransactions,
    mockGoals,
    mockCreditCards,
    mockBankAccounts,
    mockMembers
} from './mockData';
import { startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';

const uuid = () => Math.random().toString(36).substring(2, 9) + Date.now().toString(36);

// --- Interfaces ---

interface FinanceContextData {
    // State
    transactions: Transaction[];
    goals: Goal[];
    creditCards: CreditCard[];
    bankAccounts: BankAccount[];
    familyMembers: FamilyMember[];

    // Filters
    selectedMemberId: string | null; // Null shows all family
    dateRange: DateRange;
    transactionTypeFilter: 'all' | TransactionType;
    searchText: string;

    // Filter Actions
    setSelectedMemberId: (id: string | null) => void;
    setDateRange: (range: DateRange) => void;
    setTransactionTypeFilter: (type: 'all' | TransactionType) => void;
    setSearchText: (text: string) => void;

    // CRUD Actions
    addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
    updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
    deleteTransaction: (id: string) => void;

    addGoal: (goal: Omit<Goal, 'id'>) => void;
    updateGoal: (id: string, goal: Partial<Goal>) => void;
    deleteGoal: (id: string) => void;

    addCreditCard: (card: Omit<CreditCard, 'id'>) => void;
    updateCreditCard: (id: string, card: Partial<CreditCard>) => void;
    deleteCreditCard: (id: string) => void;

    addBankAccount: (account: Omit<BankAccount, 'id'>) => void;
    updateBankAccount: (id: string, account: Partial<BankAccount>) => void;
    deleteBankAccount: (id: string) => void;

    addFamilyMember: (member: Omit<FamilyMember, 'id'>) => void;
    updateFamilyMember: (id: string, member: Partial<FamilyMember>) => void;
    deleteFamilyMember: (id: string) => void;

    // Derived Data (Calculated)
    filteredTransactions: Transaction[];
    totalBalance: number;
    totalIncome: number; // For the filtered period
    totalExpenses: number; // For the filtered period
    expensesByCategory: { category: string; amount: number; percentage: number }[];
    savingsRate: number; // Percentual economizado
}

interface FinanceProviderProps {
    children: ReactNode;
}

// --- Context ---

const FinanceContext = createContext<FinanceContextData>({} as FinanceContextData);

// --- Provider ---

export function FinanceProvider({ children }: FinanceProviderProps) {
    // 1. Core State
    const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
    const [goals, setGoals] = useState<Goal[]>(mockGoals);
    const [creditCards, setCreditCards] = useState<CreditCard[]>(mockCreditCards);
    const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(mockBankAccounts);
    const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(mockMembers);

    // 2. Filter State
    const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
    const [dateRange, setDateRange] = useState<DateRange>({
        startDate: startOfMonth(new Date()), // Default: Current month start
        endDate: endOfMonth(new Date())      // Default: Current month end
    });
    const [transactionTypeFilter, setTransactionTypeFilter] = useState<'all' | TransactionType>('all');
    const [searchText, setSearchText] = useState('');

    // 3. Derived Data Implementation (Memoized for performance)

    const filteredTransactions = useMemo(() => {
        return transactions.filter(transaction => {
            // Filter by Member
            if (selectedMemberId && transaction.memberId !== selectedMemberId && transaction.memberId !== null) {
                return false;
            }

            // Filter by Date Range
            const tDate = parseISO(transaction.date);
            if (!isWithinInterval(tDate, { start: dateRange.startDate, end: dateRange.endDate })) {
                return false;
            }

            // Filter by Type
            if (transactionTypeFilter !== 'all' && transaction.type !== transactionTypeFilter) {
                return false;
            }

            // Filter by Search Text
            if (searchText) {
                const text = searchText.toLowerCase();
                return (
                    transaction.description.toLowerCase().includes(text) ||
                    transaction.category.toLowerCase().includes(text)
                );
            }

            return true;
        }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort Descending Date
    }, [transactions, selectedMemberId, dateRange, transactionTypeFilter, searchText]);

    // Totals based on Filtered Transactions (Dashboard View)
    const { totalIncome, totalExpenses } = useMemo(() => {
        return filteredTransactions.reduce(
            (acc, t) => {
                if (t.type === 'income') acc.totalIncome += t.amount;
                if (t.type === 'expense') acc.totalExpenses += t.amount;
                return acc;
            },
            { totalIncome: 0, totalExpenses: 0 }
        );
    }, [filteredTransactions]);

    // Balance is GLOBAL (Sum of Accounts - Credit Card Bills), not filtered by date, but maybe by member.
    const totalBalance = useMemo(() => {
        const memberAccounts = selectedMemberId
            ? bankAccounts.filter(acc => acc.holderId === selectedMemberId)
            : bankAccounts;

        const memberCards = selectedMemberId
            ? creditCards.filter(card => card.holderId === selectedMemberId)
            : creditCards;

        const assets = memberAccounts.reduce((sum, acc) => sum + acc.balance, 0);
        const liabilities = memberCards.reduce((sum, card) => sum + card.currentBill, 0);

        return assets - liabilities;
    }, [bankAccounts, creditCards, selectedMemberId]);

    const expensesByCategory = useMemo(() => {
        const categories: Record<string, number> = {};

        filteredTransactions.forEach(t => {
            if (t.type === 'expense') {
                categories[t.category] = (categories[t.category] || 0) + t.amount;
            }
        });

        const totalFilteredExpenses = Object.values(categories).reduce((a, b) => a + b, 0);

        return Object.entries(categories)
            .map(([category, amount]) => ({
                category,
                amount,
                percentage: totalFilteredExpenses > 0 ? (amount / totalFilteredExpenses) * 100 : 0
            }))
            .sort((a, b) => b.amount - a.amount);
    }, [filteredTransactions]);

    const savingsRate = useMemo(() => {
        if (totalIncome === 0) return 0;
        return ((totalIncome - totalExpenses) / totalIncome) * 100;
    }, [totalIncome, totalExpenses]);

    // 4. CRUD Actions

    const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
        const newTransaction = { ...transaction, id: uuid() };
        setTransactions(prev => [newTransaction, ...prev]);
    };

    const updateTransaction = (id: string, updatedFields: Partial<Transaction>) => {
        setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updatedFields } : t));
    };

    const deleteTransaction = (id: string) => {
        setTransactions(prev => prev.filter(t => t.id !== id));
    };

    const addGoal = (goal: Omit<Goal, 'id'>) => {
        const newGoal = { ...goal, id: uuid() };
        setGoals(prev => [...prev, newGoal]);
    };

    const updateGoal = (id: string, updatedFields: Partial<Goal>) => {
        setGoals(prev => prev.map(g => g.id === id ? { ...g, ...updatedFields } : g));
    };

    const deleteGoal = (id: string) => {
        setGoals(prev => prev.filter(g => g.id !== id));
    };

    const addCreditCard = (card: Omit<CreditCard, 'id'>) => {
        const newCard = { ...card, id: uuid() };
        setCreditCards(prev => [...prev, newCard]);
    };

    const updateCreditCard = (id: string, updatedFields: Partial<CreditCard>) => {
        setCreditCards(prev => prev.map(c => c.id === id ? { ...c, ...updatedFields } : c));
    };

    const deleteCreditCard = (id: string) => {
        setCreditCards(prev => prev.filter(c => c.id !== id));
    };

    const addBankAccount = (account: Omit<BankAccount, 'id'>) => {
        const newAccount = { ...account, id: uuid() };
        setBankAccounts(prev => [...prev, newAccount]);
    };

    const updateBankAccount = (id: string, updatedFields: Partial<BankAccount>) => {
        setBankAccounts(prev => prev.map(a => a.id === id ? { ...a, ...updatedFields } : a));
    };

    const deleteBankAccount = (id: string) => {
        setBankAccounts(prev => prev.filter(a => a.id !== id));
    };

    const addFamilyMember = (member: Omit<FamilyMember, 'id'>) => {
        const newMember = { ...member, id: uuid() };
        setFamilyMembers(prev => [...prev, newMember]);
    };

    const updateFamilyMember = (id: string, updatedFields: Partial<FamilyMember>) => {
        setFamilyMembers(prev => prev.map(m => m.id === id ? { ...m, ...updatedFields } : m));
    };

    const deleteFamilyMember = (id: string) => {
        setFamilyMembers(prev => prev.filter(m => m.id !== id));
    };

    return (
        <FinanceContext.Provider value={{
            transactions,
            goals,
            creditCards,
            bankAccounts,
            familyMembers,
            selectedMemberId,
            dateRange,
            transactionTypeFilter,
            searchText,
            setSelectedMemberId,
            setDateRange,
            setTransactionTypeFilter,
            setSearchText,
            addTransaction,
            updateTransaction,
            deleteTransaction,
            addGoal,
            updateGoal,
            deleteGoal,
            addCreditCard,
            updateCreditCard,
            deleteCreditCard,
            addBankAccount,
            updateBankAccount,
            deleteBankAccount,
            addFamilyMember,
            updateFamilyMember,
            deleteFamilyMember,
            filteredTransactions,
            totalBalance,
            totalIncome,
            totalExpenses,
            expensesByCategory,
            savingsRate
        }}>
            {children}
        </FinanceContext.Provider>
    );
}

// --- Custom Hook ---

export function useFinance() {
    const context = useContext(FinanceContext);
    if (!context) {
        throw new Error('useFinance must be used within a FinanceProvider');
    }
    return context;
}
