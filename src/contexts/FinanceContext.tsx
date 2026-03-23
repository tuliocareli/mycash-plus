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
import { isWithinInterval, parseISO, addMonths, startOfDay, endOfDay } from 'date-fns';
import { getFinancialCycleRange } from '../utils/cycles';
import { MonthlyClosing, NotificationPreferences } from '../types';
import { analytics } from '../services/analytics';
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
    accounts: Account[];
    creditCards: Account[];
    bankAccounts: Account[];
    familyMembers: FamilyMember[];
    categories: Category[];
    closingDay: number;
    monthlyClosings: MonthlyClosing[];
    notificationPreferences: NotificationPreferences;

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
    updateCategory: (id: string, data: Partial<Category>) => Promise<void>;
    deleteCategory: (id: string) => Promise<void>;
    uploadImage: (bucket: 'avatars' | 'account-logos', file: File) => Promise<string | null>;

    // Cycles & Closings
    updateClosingDay: (day: number) => Promise<void>;
    closeCycle: (period: string, data: Partial<MonthlyClosing>) => Promise<void>;

    // Derived
    filteredTransactions: Transaction[];
    totalBalance: number;
    totalIncome: number;
    totalExpenses: number;
    expensesByCategory: { category: string; amount: number; percentage: number }[];
    savingsRate: number;
    // Onboarding
    showWelcomeCard: boolean;
    hasSeenOnboarding: boolean;
    setHasSeenOnboarding: (seen: boolean) => Promise<void>;
    clearAllData: () => Promise<void>;
    updateNotificationPreferences: (prefs: Partial<NotificationPreferences>) => Promise<void>;
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
    const [monthlyClosings, setMonthlyClosings] = useState<MonthlyClosing[]>([]);
    const [closingDay, setClosingDay] = useState<number>(1);
    const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreferences>({
        userId: '',
        billsDue: true,
        creditLimit: true,
        weeklySummary: false,
        goalsAchieved: true
    });

    // Filters
    const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
    const [dateRange, setDateRange] = useState<DateRange>(() => {
        return getFinancialCycleRange(new Date(), 1);
    });
    const [transactionTypeFilter, setTransactionTypeFilter] = useState<'all' | TransactionType>('all');
    const [searchText, setSearchText] = useState('');
    const [categoryIdFilter, setCategoryIdFilter] = useState<string | null>(null);
    const [accountIdFilter, setAccountIdFilter] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<string | null>(null);

    // Onboarding state
    const [hasSeenOnboarding, setHasSeenOnboardingState] = useState(false);
    const [showWelcomeCard, setShowWelcomeCard] = useState(false);

    // Fetch Data
    const fetchData = useCallback(async (background = false) => {
        if (!user) return;
        if (!background) setLoading(true);

        try {
            // 1. Ensure User Profile Exists in public.users
            const { data: profile, error: profileError } = await supabase
                .from('users')
                .select('id, has_seen_onboarding, closing_day')
                .eq('id', user.id)
                .single();

            if (profileError && profileError.code === 'PGRST116') {
                // Profile not found, create it
                await supabase.from('users').insert({
                    id: user.id,
                    email: user.email!,
                    name: user.user_metadata?.name || user.email?.split('@')[0] || 'Usuário',
                });
                // New users always show onboarding
                setHasSeenOnboardingState(false);
                setShowWelcomeCard(true);
            } else if (profile) {
                // Check local storage for V1 force-show
                const forcedKey = `onboarding_v1_seen_${user.id}`;
                const hasSeenLocally = localStorage.getItem(forcedKey) === 'true';
                
                // CRITICAL: We determine if we should show NOW from DB/LocalStorage
                const shouldShowNow = !hasSeenLocally || !profile.has_seen_onboarding;
                
                setHasSeenOnboardingState(!shouldShowNow);
                setShowWelcomeCard(shouldShowNow);
                if (profile.closing_day) {
                    setClosingDay(profile.closing_day);
                }
            }

            // 2. Fetch all data
            const [txRes, goalsRes, accRes, memRes, catRes, closingRes, prefRes] = await Promise.all([
                supabase.from('transactions').select('*').eq('user_id', user.id).order('date', { ascending: false }),
                supabase.from('goals').select('*').eq('user_id', user.id),
                supabase.from('accounts').select('*').eq('user_id', user.id),
                supabase.from('family_members').select('*').eq('user_id', user.id),
                supabase.from('categories').select('*').eq('user_id', user.id),
                supabase.from('monthly_closings').select('*').eq('user_id', user.id).order('period', { ascending: false }),
                supabase.from('notification_preferences').select('*').eq('user_id', user.id).maybeSingle()
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
            if (closingRes.data) {
                setMonthlyClosings(closingRes.data.map(c => ({
                    id: c.id,
                    userId: c.user_id,
                    period: c.period,
                    openingBalance: Number(c.opening_balance),
                    totalIncome: Number(c.total_income),
                    totalExpense: Number(c.total_expense),
                    closingBalance: Number(c.closing_balance),
                    status: c.status as 'OPEN' | 'CLOSED',
                    createdAt: c.created_at || ''
                })));
            }

            if (prefRes.data) {
                setNotificationPreferences({
                    userId: prefRes.data.user_id,
                    billsDue: prefRes.data.bills_due,
                    creditLimit: prefRes.data.credit_limit,
                    weeklySummary: prefRes.data.weekly_summary,
                    goalsAchieved: prefRes.data.goals_achieved
                });
            } else {
                // Seed default preferences
                const { data: newPref } = await supabase.from('notification_preferences').insert({ user_id: user.id }).select().single();
                if (newPref) {
                    setNotificationPreferences({
                        userId: newPref.user_id,
                        billsDue: newPref.bills_due,
                        creditLimit: newPref.credit_limit,
                        weeklySummary: newPref.weekly_summary,
                        goalsAchieved: newPref.goals_achieved
                    });
                }
            }

            if (txRes.error) console.error('Error fetching transactions:', txRes.error);
            if (memRes.error) console.error('Error fetching members:', memRes.error);

        } catch (error) {
            console.error('Error in fetchData:', error);
        } finally {
            if (!background) setLoading(false);
        }
    }, [user, hasSeenOnboarding]);

    const setHasSeenOnboarding = async (seen: boolean) => {
        if (!user) return;
        setHasSeenOnboardingState(seen);
        if (seen) {
            setShowWelcomeCard(false);
            localStorage.setItem(`onboarding_v1_seen_${user.id}`, 'true');
        }
        await supabase.from('users').update({ has_seen_onboarding: seen }).eq('id', user.id);
    };

    const updateNotificationPreferences = async (data: Partial<NotificationPreferences>) => {
        if (!user) return;
        const payload: any = {};
        if (data.billsDue !== undefined) payload.bills_due = data.billsDue;
        if (data.creditLimit !== undefined) payload.credit_limit = data.creditLimit;
        if (data.weeklySummary !== undefined) payload.weekly_summary = data.weeklySummary;
        if (data.goalsAchieved !== undefined) payload.goals_achieved = data.goalsAchieved;
        
        // optimistic
        setNotificationPreferences(prev => ({ ...prev, ...data, userId: user.id }));
        
        await supabase.from('notification_preferences').update(payload).eq('user_id', user.id);
    };

    useEffect(() => {
        if (user) {
            analytics.setUserId(user.id);
            fetchData();
        } else {
            // Clear state on logout
            setTransactions([]);
            setGoals([]);
            setAccounts([]);
            setFamilyMembers([]);
            setCategories([]);
            setMonthlyClosings([]);
            setClosingDay(1);
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
            // Normalize dates to ensure full day coverage
            if (!isWithinInterval(tDate, {
                start: startOfDay(dateRange.startDate),
                end: endOfDay(dateRange.endDate)
            })) return false;

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

        // 1. Prepare Data
        let categoryId = data.categoryId;
        if (!categoryId && data.category) {
            const match = categories.find(c => c.name === data.category);
            if (match) categoryId = match.id;
        }

        const totalInstallments = data.totalInstallments || 1;
        const status = (data.status as string)?.toUpperCase() as any || 'COMPLETED';
        const isExpense = data.type === 'EXPENSE';
        const amount = data.amount || 0;

        const basePayload = {
            user_id: user.id,
            type: data.type as TransactionType,
            amount: amount,
            description: data.description!,
            date: data.date!,
            category_id: categoryId || null,
            account_id: data.accountId || null,
            member_id: data.memberId || null,
            is_recurring: data.isRecurring || false,
            notes: data.notes
        };

        // 2. Optimistic UI Update (Immediate Reflection)
        const optimisticTx: Transaction = {
            id: 'temp-' + Date.now(),
            userId: user.id,
            type: basePayload.type as TransactionType,
            amount: amount,
            description: basePayload.description,
            date: basePayload.date,
            categoryId: categoryId || undefined,
            accountId: basePayload.account_id || undefined,
            memberId: basePayload.member_id || undefined,
            isRecurring: basePayload.is_recurring,
            notes: basePayload.notes,
            category: categories.find(c => c.id === categoryId)?.name || 'Outros',
            category_icon: categories.find(c => c.id === categoryId)?.icon,
            category_color: categories.find(c => c.id === categoryId)?.color,
            status: status,
            totalInstallments,
            installmentNumber: 1, // Assume 1st for display
            createdAt: new Date().toISOString()
        };

        setTransactions(prev => [optimisticTx, ...prev]);

        // 3. Database Interactions
        try {
            if (totalInstallments > 1 && isExpense) {
                // Recurring / Installments Logic
                const { data: firstTx, error: firstError } = await supabase.from('transactions').insert({
                    ...basePayload,
                    installment_number: 1,
                    total_installments: totalInstallments,
                    status: status
                }).select().single();

                if (firstError) throw firstError;

                // Generate future installments
                const otherInstallments = [];
                const startDate = parseISO(data.date!);

                for (let i = 1; i < totalInstallments; i++) {
                    const nextDate = addMonths(startDate, i);
                    otherInstallments.push({
                        ...basePayload,
                        date: nextDate.toISOString().split('T')[0],
                        installment_number: i + 1,
                        total_installments: totalInstallments,
                        parent_transaction_id: firstTx.id,
                        status: 'PENDING'
                    });
                }

                if (otherInstallments.length > 0) {
                    await supabase.from('transactions').insert(otherInstallments);
                }

            } else {
                // Single Transaction
                const payload = {
                    ...basePayload,
                    total_installments: 1,
                    status: status
                };

                const { error } = await supabase.from('transactions').insert(payload);
                if (error) throw error;
            }

            // 4. Persistence & Sync
            const startTime = performance.now();
            await fetchData(true);
            const duration = performance.now() - startTime;
            
            analytics.track({
                category: 'PERFORMANCE',
                name: 'add_transaction_sync',
                metadata: { duration_ms: Math.round(duration) }
            });

        } catch (error) {
            console.error('Error adding transaction:', error);
            // DO NOT fetch data here, as it might wipe the optimistic update if DB insert failed
            throw error;
        }
    };


    const updateTransaction = async (id: string, data: Partial<Transaction>) => {
        // 1. Fetch original transaction to revert balance
        const { data: originalTx, error: fetchError } = await supabase
            .from('transactions')
            .select('*')
            .eq('id', id)
            .single();

        if (fetchError || !originalTx) throw new Error('Transaction not found');

        // 2. Prepare Payload
        const payload: any = {};
        if (data.amount !== undefined) payload.amount = data.amount;
        if (data.description !== undefined) payload.description = data.description;
        if (data.date !== undefined) payload.date = data.date;
        if (data.categoryId !== undefined) payload.category_id = data.categoryId;
        if (data.accountId !== undefined) payload.account_id = data.accountId;
        if (data.status !== undefined) payload.status = (data.status as string).toUpperCase();
        if (data.type !== undefined) payload.type = data.type;
        if (data.memberId !== undefined) payload.member_id = data.memberId;
        if (data.totalInstallments !== undefined) payload.total_installments = data.totalInstallments;
        if (data.isRecurring !== undefined) payload.is_recurring = data.isRecurring;

        // 3. Update Transaction
        const { error } = await supabase.from('transactions').update(payload).eq('id', id);
        if (error) throw error;

        fetchData(true);
    };

    const deleteTransaction = async (id: string) => {
        // 1. Fetch transaction to revert balance
        const { data: tx, error: fetchError } = await supabase
            .from('transactions')
            .select('*')
            .eq('id', id)
            .single();

        if (fetchError || !tx) {
            console.error('Transaction not found for deletion');
            throw new Error('Transação não encontrada para exclusão.');
        }

        // 2. Delete
        const { error } = await supabase.from('transactions').delete().eq('id', id);
        if (error) throw error;

        // Balance is handled by DB triggers
        await fetchData(true);
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

    const updateCategory = async (id: string, data: Partial<Category>) => {
        const payload: any = {};
        if (data.name) payload.name = data.name;
        if (data.icon) payload.icon = data.icon;
        if (data.type) payload.type = data.type;
        if (data.color) payload.color = data.color;

        const { error } = await supabase.from('categories').update(payload).eq('id', id);
        if (error) throw error;
        fetchData(true);
    };

    const deleteCategory = async (id: string) => {
        const { error } = await supabase.from('categories').delete().eq('id', id);
        if (error) throw error;
        fetchData(true);
    };

    const clearAllData = async () => {
        if (!user) return;

        try {
            setLoading(true);

            // Deletar em ordem para evitar conflitos (embora RLS lide com isso, é boa prática)
            const tables = [
                'transactions',
                'goals',
                'accounts',
                'categories',
                'family_members',
                'monthly_closings'
            ];

            for (const table of tables) {
                const { error } = await supabase
                    .from(table)
                    .delete()
                    .eq('user_id', user.id);
                
                if (error) {
                    console.error(`Erro ao limpar tabela ${table}:`, error);
                }
            }

            // Resetar HasSeenOnboarding
            await supabase.from('users').update({ has_seen_onboarding: false }).eq('id', user.id);
            setHasSeenOnboardingState(false);
            setShowWelcomeCard(true);

            // Sincronizar estado local
            await fetchData();

            analytics.track({
                category: 'FUNNEL',
                name: 'clear_all_data',
                metadata: { status: 'success' }
            });

        } catch (error) {
            console.error('Erro geral ao limpar dados:', error);
            throw error;
        } finally {
            setLoading(false);
        }
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

    const updateClosingDay = async (day: number) => {
        if (!user) return;
        const { error } = await supabase.from('users').update({ closing_day: day }).eq('id', user.id);
        if (error) throw error;
        setClosingDay(day);
        // Update date range immediately for better UX
        setDateRange(getFinancialCycleRange(new Date(), day));
        fetchData(true);
    };

    const closeCycle = async (period: string, data: Partial<MonthlyClosing>) => {
        if (!user) return;
        
        const payload = {
            user_id: user.id,
            period,
            opening_balance: data.openingBalance || 0,
            total_income: data.totalIncome || 0,
            total_expense: data.totalExpense || 0,
            closing_balance: data.closingBalance || 0,
            status: 'CLOSED'
        };

        const { error } = await supabase.from('monthly_closings').upsert(payload);
        if (error) throw error;
        
        analytics.track({
            category: 'FINANCE',
            name: 'close_cycle',
            metadata: { period }
        });

        fetchData(true);
    };

    return (
        <FinanceContext.Provider value={{
            loading,
            transactions,
            goals,
            accounts,
            creditCards,
            bankAccounts,
            familyMembers,
            categories,
            closingDay,
            monthlyClosings,
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
            updateCategory,
            deleteCategory,
            uploadImage,
            updateClosingDay,
            closeCycle,
            filteredTransactions,
            totalBalance,
            totalIncome,
            totalExpenses,
            expensesByCategory,
            savingsRate,
            showWelcomeCard,
            hasSeenOnboarding,
            setHasSeenOnboarding,
            clearAllData,
            notificationPreferences,
            updateNotificationPreferences
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
