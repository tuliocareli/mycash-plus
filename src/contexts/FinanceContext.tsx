import { createContext, useContext, useState, useEffect, useMemo, ReactNode, useCallback } from 'react';
import {
    Transaction,
    Goal,
    Account,
    FamilyMember,
    DateRange,
    TransactionType,
    Category,
    TransactionStatus
} from '../types';
import { supabase } from '../services/supabase';
import { useAuth } from './AuthContext';
import { startOfMonth, endOfMonth, isWithinInterval, parseISO, addMonths } from 'date-fns';
import { Database } from '../types/supabase';

// Helper to map DB transaction to Frontend Transaction
const mapTransaction = (
    dbTx: Database['public']['Tables']['transactions']['Row'],
    categories: Category[]
): Transaction => {
    const category = categories.find(c => c.id === dbTx.category_id);
    return {
        id: dbTx.id,
        userId: dbTx.user_id,
        type: dbTx.type as TransactionType,
        amount: Number(dbTx.amount),
        description: dbTx.description,
        date: dbTx.date,
        categoryId: dbTx.category_id || undefined,
        category: category?.name || 'Outros', // Fallback name
        accountId: dbTx.account_id || undefined,
        memberId: dbTx.member_id || undefined,
        installmentNumber: dbTx.installment_number || undefined,
        totalInstallments: dbTx.total_installments,
        parentTransactionId: dbTx.parent_transaction_id || undefined,
        isRecurring: dbTx.is_recurring,
        recurringTransactionId: dbTx.recurring_transaction_id || undefined,
        status: (dbTx.status as string).toUpperCase() as TransactionStatus,
        notes: dbTx.notes || undefined,
        createdAt: dbTx.created_at,
        updatedAt: dbTx.updated_at
    };
};

const mapAccount = (dbAcc: Database['public']['Tables']['accounts']['Row']): Account => ({
    id: dbAcc.id,
    userId: dbAcc.user_id,
    type: dbAcc.type as any, // Cast to AccountType
    name: dbAcc.name,
    bank: dbAcc.bank,
    lastDigits: dbAcc.last_digits || undefined,
    holderId: dbAcc.holder_id,
    balance: Number(dbAcc.balance),
    creditLimit: dbAcc.credit_limit ? Number(dbAcc.credit_limit) : undefined,
    currentBill: Number(dbAcc.current_bill),
    dueDay: dbAcc.due_day || undefined,
    closingDay: dbAcc.closing_day || undefined,
    theme: dbAcc.theme,
    logoUrl: dbAcc.logo_url || undefined,
    color: dbAcc.color,
    isActive: dbAcc.is_active
});

const mapFamilyMember = (dbMember: Database['public']['Tables']['family_members']['Row']): FamilyMember => ({
    id: dbMember.id,
    userId: dbMember.user_id,
    name: dbMember.name,
    role: dbMember.role,
    avatarUrl: dbMember.avatar_url || undefined,
    monthlyIncome: Number(dbMember.monthly_income),
    color: dbMember.color,
    isActive: dbMember.is_active
});

const mapGoal = (dbGoal: Database['public']['Tables']['goals']['Row']): Goal => ({
    id: dbGoal.id,
    name: dbGoal.name,
    targetAmount: Number(dbGoal.target_amount),
    currentAmount: Number(dbGoal.current_amount),
    deadline: dbGoal.deadline || undefined,
    icon: dbGoal.icon || undefined,
    color: dbGoal.color || undefined
});

const mapCategory = (dbCat: Database['public']['Tables']['categories']['Row']): Category => ({
    id: dbCat.id,
    userId: dbCat.user_id,
    name: dbCat.name,
    icon: dbCat.icon || '',
    type: dbCat.type as TransactionType,
    color: dbCat.color || '',
    isActive: dbCat.is_active
});

interface FinanceContextData {
    loading: boolean;
    transactions: Transaction[];
    goals: Goal[];
    creditCards: Account[];
    bankAccounts: Account[];
    familyMembers: FamilyMember[];
    categories: Category[];

    // Filters
    selectedMemberId: string | null;
    dateRange: DateRange;
    transactionTypeFilter: 'all' | TransactionType;
    searchText: string;
    categoryIdFilter: string | null;
    accountIdFilter: string | null;
    statusFilter: string | null;

    setSelectedMemberId: (id: string | null) => void;
    setDateRange: (range: DateRange) => void;
    setTransactionTypeFilter: (type: 'all' | TransactionType) => void;
    setSearchText: (text: string) => void;
    setCategoryIdFilter: (id: string | null) => void;
    setAccountIdFilter: (id: string | null) => void;
    setStatusFilter: (status: string | null) => void;

    // CRUD
    addTransaction: (data: Partial<Transaction>) => Promise<void>;
    updateTransaction: (id: string, data: Partial<Transaction>) => Promise<void>;
    deleteTransaction: (id: string) => Promise<void>;

    addGoal: (goal: Partial<Goal>) => Promise<void>;
    updateGoal: (id: string, goal: Partial<Goal>) => Promise<void>;
    deleteGoal: (id: string) => Promise<void>;

    addCreditCard: (card: Partial<Account>) => Promise<void>;
    updateCreditCard: (id: string, card: Partial<Account>) => Promise<void>;
    deleteCreditCard: (id: string) => Promise<void>;

    addBankAccount: (account: Partial<Account>) => Promise<void>;
    updateBankAccount: (id: string, account: Partial<Account>) => Promise<void>;
    deleteBankAccount: (id: string) => Promise<void>;

    addFamilyMember: (member: Partial<FamilyMember>) => Promise<void>;
    updateFamilyMember: (id: string, member: Partial<FamilyMember>) => Promise<void>;
    deleteFamilyMember: (id: string) => Promise<void>;

    addCategory: (data: Partial<Category>) => Promise<void>;
    uploadImage: (bucket: 'avatars' | 'account-logos', file: File) => Promise<string | null>;

    // Derived
    filteredTransactions: Transaction[];
    totalBalance: number;
    totalIncome: number;
    totalExpenses: number;
    expensesByCategory: { category: string; amount: number; percentage: number }[];
    savingsRate: number;
}

const FinanceContext = createContext<FinanceContextData>({} as FinanceContextData);

export function FinanceProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [goals, setGoals] = useState<Goal[]>([]);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    // Filters
    const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
    const [dateRange, setDateRange] = useState<DateRange>({
        startDate: startOfMonth(new Date()),
        endDate: endOfMonth(new Date())
    });
    const [transactionTypeFilter, setTransactionTypeFilter] = useState<'all' | TransactionType>('all');
    const [searchText, setSearchText] = useState('');
    const [categoryIdFilter, setCategoryIdFilter] = useState<string | null>(null);
    const [accountIdFilter, setAccountIdFilter] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<string | null>(null);

    // Fetch Data
    const fetchData = useCallback(async (background = false) => {
        if (!user) return;
        if (!background) setLoading(true);

        try {
            // 1. Ensure User Profile Exists in public.users
            const { error: profileError } = await supabase
                .from('users')
                .select('id')
                .eq('id', user.id)
                .single();

            if (profileError && profileError.code === 'PGRST116') {
                // Profile not found, create it
                const { error: insertError } = await supabase.from('users').insert({
                    id: user.id,
                    email: user.email!,
                    name: user.user_metadata?.name || user.email?.split('@')[0] || 'Usuário',
                });
                if (insertError) console.error('Error creating user profile:', insertError);
            }

            // 2. Fetch all data
            const [txRes, goalsRes, accRes, memRes, catRes] = await Promise.all([
                supabase.from('transactions').select('*').eq('user_id', user.id).order('date', { ascending: false }),
                supabase.from('goals').select('*').eq('user_id', user.id),
                supabase.from('accounts').select('*').eq('user_id', user.id),
                supabase.from('family_members').select('*').eq('user_id', user.id),
                supabase.from('categories').select('*').eq('user_id', user.id)
            ]);

            // Handling Categories & Seeding if needed
            let cats: Category[] = [];
            if (catRes.data) {
                if (catRes.data.length === 0) {
                    // Seed initial categories if none exist
                    const defaultCategories = [
                        { name: 'Alimentação', icon: '🍔', type: 'EXPENSE' as const, color: '#EF4444' },
                        { name: 'Lazer', icon: '🎮', type: 'EXPENSE' as const, color: '#3B82F6' },
                        { name: 'Saúde', icon: '🏥', type: 'EXPENSE' as const, color: '#10B981' },
                        { name: 'Transporte', icon: '🚗', type: 'EXPENSE' as const, color: '#F59E0B' },
                        { name: 'Educação', icon: '📚', type: 'EXPENSE' as const, color: '#8B5CF6' },
                        { name: 'Salário', icon: '💰', type: 'INCOME' as const, color: '#10B981' },
                        { name: 'Investimento', icon: '📈', type: 'INCOME' as const, color: '#3B82F6' },
                        { name: 'Outros', icon: '📦', type: 'EXPENSE' as const, color: '#6B7280' },
                    ];
                    const seedData = defaultCategories.map(c => ({ ...c, user_id: user.id }));
                    const { data: newCats, error: seedError } = await supabase.from('categories').insert(seedData).select();

                    if (seedError) {
                        console.error('Error seeding categories:', seedError);
                    } else if (newCats) {
                        cats = newCats.map(mapCategory);
                    }
                } else {
                    cats = catRes.data.map(mapCategory);
                }
                setCategories(cats);
            }

            // Handling Family Members & Seeding if needed
            let members: FamilyMember[] = [];
            if (memRes.data) {
                if (memRes.data.length === 0) {
                    const defaultMember = {
                        user_id: user.id,
                        name: user.user_metadata?.name || 'Eu',
                        role: 'Principal',
                        color: '#6366F1',
                        monthly_income: 0,
                        is_active: true
                    };
                    const { data: newMem, error: memSeedError } = await supabase.from('family_members').insert(defaultMember).select();
                    if (memSeedError) {
                        console.error('Error seeding family member:', memSeedError);
                    } else if (newMem) {
                        members = newMem.map(mapFamilyMember);
                    }
                } else {
                    members = memRes.data.map(mapFamilyMember);
                }
                setFamilyMembers(members);
            }

            // Update other states
            if (txRes.data) setTransactions(txRes.data.map(t => mapTransaction(t, cats)));
            if (goalsRes.data) setGoals(goalsRes.data.map(mapGoal));
            if (accRes.data) setAccounts(accRes.data.map(mapAccount));

            if (txRes.error) console.error('Error fetching transactions:', txRes.error);
            if (memRes.error) console.error('Error fetching members:', memRes.error);

        } catch (error) {
            console.error('Error in fetchData:', error);
        } finally {
            if (!background) setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            fetchData();
        } else {
            // Clear state on logout
            setTransactions([]);
            setGoals([]);
            setAccounts([]);
            setFamilyMembers([]);
            setCategories([]);
            setLoading(false);
        }
    }, [user, fetchData]);

    // Derived Lists
    const creditCards = useMemo(() => accounts.filter(a => a.type === 'CREDIT_CARD'), [accounts]);
    const bankAccounts = useMemo(() => accounts.filter(a => a.type === 'CHECKING' || a.type === 'SAVINGS'), [accounts]);

    const filteredTransactions = useMemo(() => {
        return transactions.filter(t => {
            if (selectedMemberId && t.memberId !== selectedMemberId) return false;

            // Only filter by date if local date string is valid.
            // Supabase returns YYYY-MM-DD.
            const tDate = parseISO(t.date);
            if (!isWithinInterval(tDate, { start: dateRange.startDate, end: dateRange.endDate })) return false;

            if (transactionTypeFilter !== 'all' && t.type !== transactionTypeFilter) return false;

            if (categoryIdFilter && t.categoryId !== categoryIdFilter) return false;
            if (accountIdFilter && t.accountId !== accountIdFilter) return false;
            if (statusFilter && t.status !== statusFilter) return false;

            if (searchText) {
                const text = searchText.toLowerCase();
                // Check category name safely
                return t.description.toLowerCase().includes(text) || (t.category || '').toLowerCase().includes(text);
            }
            return true;
        }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [transactions, selectedMemberId, dateRange, transactionTypeFilter, searchText, categoryIdFilter, accountIdFilter, statusFilter]);

    const { totalIncome, totalExpenses } = useMemo(() => {
        return filteredTransactions.reduce((acc, t) => {
            // Handle Decimal/Number if needed, but we cast to number in map
            if (t.type === 'INCOME') acc.totalIncome += t.amount;
            if (t.type === 'EXPENSE') acc.totalExpenses += t.amount;
            return acc;
        }, { totalIncome: 0, totalExpenses: 0 });
    }, [filteredTransactions]);

    const totalBalance = useMemo(() => {
        const relevantAccounts = selectedMemberId
            ? accounts.filter(a => a.holderId === selectedMemberId)
            : accounts;

        const assets = relevantAccounts.filter(a => a.type !== 'CREDIT_CARD').reduce((sum, a) => sum + a.balance, 0);
        const liabilities = relevantAccounts.filter(a => a.type === 'CREDIT_CARD').reduce((sum, a) => sum + a.currentBill, 0);
        return assets - liabilities;
    }, [accounts, selectedMemberId]);

    const expensesByCategory = useMemo(() => {
        const catMap: Record<string, number> = {};
        filteredTransactions.forEach(t => {
            if (t.type === 'EXPENSE') {
                const catName = t.category || 'Outros';
                catMap[catName] = (catMap[catName] || 0) + t.amount;
            }
        });
        const total = Object.values(catMap).reduce((a, b) => a + b, 0);
        return Object.entries(catMap)
            .map(([category, amount]) => ({
                category,
                amount,
                percentage: total > 0 ? (amount / total) * 100 : 0
            }))
            .sort((a, b) => b.amount - a.amount);
    }, [filteredTransactions]);

    const savingsRate = useMemo(() => {
        if (totalIncome === 0) return 0;
        return ((totalIncome - totalExpenses) / totalIncome) * 100;
    }, [totalIncome, totalExpenses]);

    // Actions
    const addTransaction = async (data: Partial<Transaction>) => {
        if (!user) return;
        // Map frontend back to snake_case
        // Find categoryId from name if only name provided?
        // UI provides categoryId generally if available, or just string.
        // Assuming strict types:
        let categoryId = data.categoryId;
        if (!categoryId && data.category) {
            const match = categories.find(c => c.name === data.category);
            if (match) categoryId = match.id;
        }
        const totalInstallments = data.totalInstallments || 1;

        // Base payload
        const basePayload = {
            user_id: user.id,
            type: data.type as TransactionType, // 'INCOME' | 'EXPENSE'
            amount: data.amount!,
            description: data.description!,
            date: data.date!, // YYYY-MM-DD
            category_id: categoryId || null,
            account_id: data.accountId || null,
            member_id: data.memberId || null,
            is_recurring: data.isRecurring || false,
            notes: data.notes
        };

        if (totalInstallments > 1 && data.type === 'EXPENSE') {
            // Installment 1
            const { data: firstTx, error: firstError } = await supabase.from('transactions').insert({
                ...basePayload,
                installment_number: 1,
                total_installments: totalInstallments,
                status: (data.status as string)?.toLowerCase() as any || 'completed'
            }).select().single();

            if (firstError) throw firstError;

            // Remaining installments
            const otherInstallments = [];
            const startDate = parseISO(data.date!);

            for (let i = 1; i < totalInstallments; i++) {
                const nextDate = addMonths(startDate, i);
                otherInstallments.push({
                    ...basePayload,
                    date: nextDate.toISOString().split('T')[0], // YYYY-MM-DD
                    installment_number: i + 1,
                    total_installments: totalInstallments,
                    parent_transaction_id: firstTx.id,
                    status: 'pending' // Future installments default to pending
                });
            }

            if (otherInstallments.length > 0) {
                const { error: batchError } = await supabase.from('transactions').insert(otherInstallments);
                if (batchError) console.error('Error creating installments:', batchError);
            }

        } else {
            // Single transaction
            const payload = {
                ...basePayload,
                total_installments: 1,
                installment_number: undefined,
                status: (data.status as string)?.toLowerCase() as any || 'completed'
            };

            const { error } = await supabase.from('transactions').insert(payload);
            if (error) throw error;
        }

        await fetchData(true);
    };

    const updateTransaction = async (id: string, data: Partial<Transaction>) => {
        const payload: any = {};
        if (data.amount) payload.amount = data.amount;
        if (data.description) payload.description = data.description;
        if (data.date) payload.date = data.date;
        if (data.categoryId) payload.category_id = data.categoryId;
        if (data.accountId) payload.account_id = data.accountId;
        if (data.status) payload.status = (data.status as string).toLowerCase();

        const { error } = await supabase.from('transactions').update(payload).eq('id', id);
        if (error) throw error;
        fetchData(true);
    };

    const deleteTransaction = async (id: string) => {
        const { error } = await supabase.from('transactions').delete().eq('id', id);
        if (error) throw error;
        fetchData(true);
    };

    // Goals
    const addGoal = async (data: Partial<Goal>) => {
        if (!user) return;
        const payload = {
            user_id: user.id,
            name: data.name!,
            target_amount: data.targetAmount!,
            current_amount: data.currentAmount || 0,
            deadline: data.deadline,
            icon: data.icon,
            color: data.color
        };
        const { error } = await supabase.from('goals').insert(payload);
        if (error) throw error;
        await fetchData(true);
    };

    const updateGoal = async (id: string, data: Partial<Goal>) => {
        const payload: any = {};
        if (data.currentAmount !== undefined) payload.current_amount = data.currentAmount;
        if (data.name) payload.name = data.name;
        if (data.targetAmount !== undefined) payload.target_amount = data.targetAmount;
        if (data.deadline) payload.deadline = data.deadline;
        if (data.color) payload.color = data.color;
        if (data.icon) payload.icon = data.icon;
        const { error } = await supabase.from('goals').update(payload).eq('id', id);
        if (error) throw error;
        await fetchData(true);
    };

    const deleteGoal = async (id: string) => {
        const { error } = await supabase.from('goals').delete().eq('id', id);
        if (error) throw error;
        await fetchData(true);
    };

    // Accounts
    const addCreditCard = async (card: Partial<Account>) => {
        if (!user) return;
        const payload = {
            user_id: user.id,
            type: 'CREDIT_CARD',
            name: card.name!,
            bank: card.bank || 'Unknown',
            holder_id: card.holderId!,
            current_bill: card.currentBill || 0,
            credit_limit: card.creditLimit,
            closing_day: card.closingDay,
            due_day: card.dueDay,
            color: card.color || '#000000',
            theme: card.theme,
            last_digits: card.lastDigits,
            logo_url: card.logoUrl
        };
        const { error } = await supabase.from('accounts').insert(payload);
        if (error) throw error;
        await fetchData(true);
    };

    const updateCreditCard = async (id: string, data: Partial<Account>) => {
        const payload: any = {};
        if (data.name) payload.name = data.name;
        if (data.currentBill !== undefined) payload.current_bill = data.currentBill;
        if (data.creditLimit !== undefined) payload.credit_limit = data.creditLimit;
        if (data.dueDay !== undefined) payload.due_day = data.dueDay;
        if (data.closingDay !== undefined) payload.closing_day = data.closingDay;
        if (data.theme) payload.theme = data.theme;
        if (data.lastDigits) payload.last_digits = data.lastDigits;
        if (data.logoUrl) payload.logo_url = data.logoUrl;
        if (data.holderId) payload.holder_id = data.holderId;

        const { error } = await supabase.from('accounts').update(payload).eq('id', id);
        if (error) throw error;
        await fetchData(true);
    };

    const deleteCreditCard = async (id: string) => {
        const { error } = await supabase.from('accounts').delete().eq('id', id);
        if (error) throw error;
        await fetchData(true);
    };

    const addBankAccount = async (acc: Partial<Account>) => {
        if (!user) return;
        const { error } = await supabase.from('accounts').insert({
            user_id: user.id,
            type: acc.type || 'CHECKING',
            name: acc.name!,
            balance: acc.balance || 0,
            holder_id: acc.holderId!,
            logo_url: acc.logoUrl,
            bank: acc.bank || 'Unknown',
            color: acc.color, // Retained color
            is_active: true // Retained is_active
        });
        if (error) throw error;
        await fetchData(true);
    };

    const updateBankAccount = async (id: string, data: Partial<Account>) => {
        const payload: any = {};
        if (data.name) payload.name = data.name;
        if (data.balance !== undefined) payload.balance = data.balance;
        if (data.logoUrl) payload.logo_url = data.logoUrl;
        if (data.holderId) payload.holder_id = data.holderId;
        if (data.bank) payload.bank = data.bank;

        const { error } = await supabase.from('accounts').update(payload).eq('id', id);
        if (error) throw error;
        await fetchData(true);
    };

    const deleteBankAccount = async (id: string) => {
        const { error } = await supabase.from('accounts').delete().eq('id', id);
        if (error) throw error;
        await fetchData(true);
    };

    const addFamilyMember = async (member: Partial<FamilyMember>) => {
        if (!user) {
            console.error('Tentativa de adicionar membro sem estar logado.');
            throw new Error('Você precisa estar logado para salvar dados no banco de dados.');
        }

        // Optimistic Update
        const tempId = crypto.randomUUID();
        const newMember: FamilyMember = {
            id: tempId,
            userId: user.id,
            name: member.name!,
            role: member.role!,
            monthlyIncome: member.monthlyIncome || 0,
            avatarUrl: member.avatarUrl,
            color: member.color || '#3247FF',
            isActive: true
        };

        setFamilyMembers(prev => [...prev, newMember]);

        try {
            const payload = {
                user_id: user.id,
                name: member.name!,
                role: member.role!,
                monthly_income: member.monthlyIncome || 0,
                avatar_url: member.avatarUrl,
                color: member.color || '#3247FF',
                is_active: true
            };

            const { error } = await supabase.from('family_members').insert(payload);
            if (error) throw error;

            await fetchData(true);
        } catch (error) {
            // Rollback optimistic update on error
            setFamilyMembers(prev => prev.filter(m => m.id !== tempId));
            throw error;
        }
    };

    const updateFamilyMember = async (id: string, data: Partial<FamilyMember>) => {
        const { error } = await supabase.from('family_members').update({
            name: data.name,
            role: data.role,
            monthly_income: data.monthlyIncome,
            avatar_url: data.avatarUrl
        }).eq('id', id);
        if (error) throw error;
        await fetchData(true);
    };

    const deleteFamilyMember = async (id: string) => {
        const { error } = await supabase.from('family_members').delete().eq('id', id);
        if (error) throw error;
        fetchData(true);
    };

    const addCategory = async (data: Partial<Category>) => {
        if (!user) return;
        const payload = {
            user_id: user.id,
            name: data.name!,
            icon: data.icon || '📦',
            type: data.type || 'EXPENSE',
            color: data.color || '#6B7280'
        };
        const { error } = await supabase.from('categories').insert(payload);
        if (error) throw error;
        fetchData(true);
    };

    const uploadImage = async (bucket: 'avatars' | 'account-logos', file: File): Promise<string | null> => {
        if (!user) return null;
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;

        const { error } = await supabase.storage.from(bucket).upload(fileName, file);
        if (error) {
            console.error('Error uploading image:', error);
            return null;
        }

        const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
        return data.publicUrl;
    };

    return (
        <FinanceContext.Provider value={{
            loading,
            transactions,
            goals,
            creditCards,
            bankAccounts,
            familyMembers,
            categories,
            selectedMemberId,
            dateRange,
            transactionTypeFilter,
            searchText,
            categoryIdFilter,
            accountIdFilter,
            statusFilter,
            setSelectedMemberId,
            setDateRange,
            setTransactionTypeFilter,
            setSearchText,
            setCategoryIdFilter,
            setAccountIdFilter,
            setStatusFilter,
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
            addCategory,
            uploadImage,
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

export function useFinance() {
    const context = useContext(FinanceContext);
    if (!context) {
        throw new Error('useFinance must be used within a FinanceProvider');
    }
    return context;
}
