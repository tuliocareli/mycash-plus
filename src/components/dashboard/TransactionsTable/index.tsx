
import { useState, useMemo, useEffect } from 'react';
import {
    Search,
    ChevronLeft,
    ChevronRight,
    ArrowUpRight,
    ArrowDownLeft,
    User,
    FileSearch,
    ArrowUpDown
} from 'lucide-react';
import { useFinance } from '../../../contexts/FinanceContext';
import { format, parseISO } from 'date-fns';
import clsx from 'clsx';
import { TransactionType, Transaction } from '../../../types';
import { NewTransactionModal } from '../../modals/NewTransactionModal';
import { FileText } from 'lucide-react';

interface TransactionsTableProps {
    mode?: 'dashboard' | 'expanded';
    hideHeader?: boolean;
}

export function TransactionsTable({ mode = 'dashboard', hideHeader = false }: TransactionsTableProps) {
    const {
        filteredTransactions,
        bankAccounts,
        creditCards,
        familyMembers
    } = useFinance();

    // Local Filters
    const [localSearch, setLocalSearch] = useState('');
    const [localType, setLocalType] = useState<'all' | TransactionType>('all');
    // State for editing
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

    // Sort
    const [sortField, setSortField] = useState<'date' | 'amount' | 'description'>('date');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = mode === 'expanded' ? 10 : 5;

    // Reset page on filter change
    useEffect(() => {
        setCurrentPage(1);
    }, [localSearch, localType, filteredTransactions]);

    // Apply Local Filtering and Sorting
    const sortedTransactions = useMemo(() => {
        const filtered = filteredTransactions.filter(t => {
            const matchesSearch = localSearch === '' ||
                t.description.toLowerCase().includes(localSearch.toLowerCase()) ||
                (t.category || '').toLowerCase().includes(localSearch.toLowerCase());
            const matchesType = localType === 'all' || t.type === localType;
            return matchesSearch && matchesType;
        });

        return [...filtered].sort((a, b) => {
            let comparison = 0;
            if (sortField === 'date') {
                comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
            } else if (sortField === 'amount') {
                comparison = a.amount - b.amount;
            } else if (sortField === 'description') {
                comparison = a.description.localeCompare(b.description);
            }
            return sortDirection === 'desc' ? -comparison : comparison;
        });
    }, [filteredTransactions, localSearch, localType, sortField, sortDirection]);

    // Paginated Data
    const totalItems = sortedTransactions.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginatedTransactions = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return sortedTransactions.slice(start, start + itemsPerPage);
    }, [sortedTransactions, currentPage, itemsPerPage]);

    const formatCurrency = (amount: number, type: TransactionType) => {
        const value = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(amount);
        return type === 'INCOME' ? `+ ${value}` : `- ${value}`;
    };

    const getAccountName = (accountId?: string) => {
        if (!accountId) return 'Desconhecido';
        const bank = bankAccounts.find(a => a.id === accountId);
        if (bank) return bank.name;
        const card = creditCards.find(c => c.id === accountId);
        if (card) return card.name;
        return 'Desconhecido';
    };

    const getMemberAvatar = (memberId?: string | null) => {
        if (!memberId) return null;
        const member = familyMembers.find(m => m.id === memberId);
        return member?.avatarUrl || null;
    };

    const handleSort = (field: 'date' | 'amount' | 'description') => {
        if (sortField === field) {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('desc');
        }
    };

    // Pagination numbers logic
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 3) {
                pages.push(1, 2, 3, '...', totalPages - 1, totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1, 2, '...', totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
            }
        }
        return pages;
    };

    return (
        <div id="extrato-detalhado" className={clsx(
            "bg-white rounded-3xl flex flex-col h-full",
            mode === 'dashboard' ? "border border-neutral-200 py-6 px-6 lg:py-10 lg:px-10 shadow-sm" : "p-0"
        )}>
            {/* Header / Toolbar */}
            {!hideHeader && (
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-neutral-100 rounded-lg">
                            <FileText className="w-5 h-5 text-neutral-1100" />
                        </div>
                        <h2 className="text-lg font-medium text-neutral-1100">Extrato detalhado</h2>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative flex-1 md:w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 size-4" />
                            <input
                                type="text"
                                placeholder="Buscar lançamentos..."
                                value={localSearch}
                                onChange={(e) => setLocalSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-neutral-100 border-neutral-100 rounded-xl text-sm text-neutral-1100 placeholder:text-neutral-400 focus:ring-2 focus:ring-brand-500 transition-all outline-none"
                            />
                        </div>

                        <select
                            value={localType}
                            onChange={(e) => setLocalType(e.target.value as any)}
                            className="w-[160px] px-4 py-3 bg-neutral-100 border-none rounded-xl text-sm font-medium text-neutral-1100 focus:ring-2 focus:ring-brand-500 transition-all outline-none cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:20px_20px] bg-[right_12px_center] bg-no-repeat"
                        >
                            <option value="all">Todos os tipos</option>
                            <option value="INCOME">Apenas Receitas</option>
                            <option value="EXPENSE">Apenas Despesas</option>
                        </select>
                    </div>
                </div>
            )}

            {/* Content Area */}
            <div className="flex-1 flex flex-col min-h-0">
                {/* Desktop Table View */}
                <div className="hidden md:block relative rounded-2xl border border-neutral-100 overflow-hidden flex-1">
                    <div className="overflow-x-auto h-full">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-neutral-50/50 border-b border-neutral-100">
                                    <th className="px-6 py-4 text-[11px] font-bold text-neutral-400 uppercase tracking-wider w-[80px] whitespace-nowrap">Membro</th>
                                    <th
                                        className="px-6 py-4 text-[11px] font-bold text-neutral-400 uppercase tracking-wider w-[120px] cursor-pointer hover:bg-neutral-100 transition-colors whitespace-nowrap"
                                        onClick={() => handleSort('date')}
                                    >
                                        <div className="flex items-center gap-2">
                                            Data <ArrowUpDown size={12} className={sortField === 'date' ? 'text-brand-500' : ''} />
                                        </div>
                                    </th>
                                    <th
                                        className="px-6 py-4 text-[11px] font-bold text-neutral-400 uppercase tracking-wider min-w-[300px] cursor-pointer hover:bg-neutral-100 transition-colors"
                                        onClick={() => handleSort('description')}
                                    >
                                        <div className="flex items-center gap-2">
                                            Descrição <ArrowUpDown size={12} className={sortField === 'description' ? 'text-brand-500' : ''} />
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-neutral-400 uppercase tracking-wider w-[150px] whitespace-nowrap">Categoria</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-neutral-400 uppercase tracking-wider w-[160px] whitespace-nowrap">Origem</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-neutral-400 uppercase tracking-wider w-[100px] whitespace-nowrap">Parcelas</th>
                                    <th
                                        className="px-6 py-4 text-[11px] font-bold text-neutral-400 uppercase tracking-wider text-right w-[150px] cursor-pointer hover:bg-neutral-100 transition-colors whitespace-nowrap"
                                        onClick={() => handleSort('amount')}
                                    >
                                        <div className="flex items-center justify-end gap-2">
                                            Valor <ArrowUpDown size={12} className={sortField === 'amount' ? 'text-brand-500' : ''} />
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-neutral-400 uppercase tracking-wider w-[60px] text-center whitespace-nowrap">Ações</th>
                                </tr>
                            </thead>
                            <tbody key={currentPage} className="divide-y divide-neutral-100 animate-fade-in text-neutral-1100">
                                {paginatedTransactions.length > 0 ? (
                                    paginatedTransactions.map((t, idx) => (
                                        <tr
                                            key={t.id}
                                            className={clsx(
                                                "group transition-colors hover:bg-neutral-50/80",
                                                idx % 2 === 0 ? "bg-white" : "bg-neutral-50/20"
                                            )}
                                        >
                                            <td className="px-6 py-5">
                                                <div className="size-8 rounded-full bg-neutral-100 overflow-hidden border border-neutral-200 flex items-center justify-center">
                                                    {getMemberAvatar(t.memberId) ? (
                                                        <img
                                                            src={getMemberAvatar(t.memberId)!}
                                                            alt="Avatar"
                                                            className="size-full object-cover"
                                                        />
                                                    ) : (
                                                        <User size={14} className="text-neutral-400" />
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="text-sm font-bold text-neutral-500">
                                                    {format(parseISO(t.date), 'dd/MM/yyyy')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className={clsx(
                                                        "size-8 rounded-full flex items-center justify-center shrink-0 shadow-sm",
                                                        t.type === 'INCOME' ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                                                    )}>
                                                        {t.type === 'INCOME' ? (
                                                            <ArrowDownLeft size={16} strokeWidth={2.5} />
                                                        ) : (
                                                            <ArrowUpRight size={16} strokeWidth={2.5} />
                                                        )}
                                                    </div>
                                                    <span className="text-sm font-bold whitespace-normal line-clamp-2">
                                                        {t.description}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="inline-flex px-3 py-1.5 rounded-full bg-neutral-100 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                                                    {t.category || 'Outros'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-sm font-bold text-neutral-500 truncate">
                                                {getAccountName(t.accountId)}
                                            </td>
                                            <td className="px-6 py-5 text-sm font-bold text-neutral-500">
                                                {t.installmentNumber ? (
                                                    <span className="px-2 py-1 bg-neutral-100 rounded text-xs font-bold text-neutral-600">
                                                        {t.installmentNumber}/{t.totalInstallments}
                                                    </span>
                                                ) : '-'}
                                            </td>
                                            <td className={clsx(
                                                "px-6 py-5 text-sm font-black text-right",
                                                t.type === 'INCOME' ? "text-green-600" : ""
                                            )}>
                                                {formatCurrency(t.amount, t.type)}
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <button
                                                    onClick={() => setEditingTransaction(t)}
                                                    className="size-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                                                    title="Editar"
                                                >
                                                    <FileSearch size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : null}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden flex flex-col gap-4 flex-1">
                    {paginatedTransactions.length > 0 ? (
                        paginatedTransactions.map((t) => (
                            <div
                                key={t.id}
                                onClick={() => setEditingTransaction(t)}
                                className="bg-white border border-neutral-100 rounded-2xl p-5 shadow-sm active:scale-[0.98] transition-all cursor-pointer relative"
                            >
                                <div className="absolute top-4 right-4 text-neutral-300">
                                    <FileSearch size={16} />
                                </div>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={clsx(
                                            "size-10 rounded-full flex items-center justify-center shrink-0",
                                            t.type === 'INCOME' ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                                        )}>
                                            {t.type === 'INCOME' ? (
                                                <ArrowDownLeft size={20} strokeWidth={2.5} />
                                            ) : (
                                                <ArrowUpRight size={20} strokeWidth={2.5} />
                                            )}
                                        </div>
                                        <div className="flex flex-col text-neutral-1100">
                                            <span className="text-sm font-extrabold">{t.description}</span>
                                            <span className="text-xs text-neutral-400 font-bold">{format(parseISO(t.date), 'dd MMM yyyy')}</span>
                                        </div>
                                    </div>
                                    <span className={clsx(
                                        "text-sm font-black",
                                        t.type === 'INCOME' ? "text-green-600" : "text-neutral-1100"
                                    )}>
                                        {formatCurrency(t.amount, t.type)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between pt-4 border-t border-neutral-50">
                                    <div className="flex items-center gap-2">
                                        <div className="size-5 rounded-full bg-neutral-50 flex items-center justify-center border border-neutral-100">
                                            {getMemberAvatar(t.memberId) ? (
                                                <img src={getMemberAvatar(t.memberId)!} className="size-full object-cover rounded-full" />
                                            ) : <User size={10} className="text-neutral-300" />}
                                        </div>
                                        <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest bg-neutral-50 px-2 py-1 rounded">
                                            {t.category || 'Outros'}
                                        </span>
                                    </div>
                                    <span className="text-[11px] font-bold text-neutral-400 uppercase">{getAccountName(t.accountId)}</span>
                                </div>
                            </div>
                        ))
                    ) : null}
                </div>

                {/* Empty State */}
                {paginatedTransactions.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 px-6 border-2 border-dashed border-neutral-100 rounded-2xl flex-1 min-h-[300px]">
                        <div className="p-5 bg-neutral-50 rounded-full mb-4">
                            <FileSearch size={32} strokeWidth={1.5} className="text-neutral-300" />
                        </div>
                        <p className="text-neutral-400 font-bold">Nenhum lançamento encontrado.</p>
                        <button
                            onClick={() => { setLocalSearch(''); setLocalType('all'); }}
                            className="mt-4 text-xs font-bold text-neutral-1100 underline decoration-neutral-200 underline-offset-4 uppercase tracking-widest"
                        >
                            Limpar filtros
                        </button>
                    </div>
                )}
            </div>

            {/* Pagination / Footer */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mt-4 pt-6 border-t border-neutral-100 shrink-0">
                <p className="text-xs font-bold text-neutral-500 order-2 md:order-1 uppercase tracking-wider">
                    Mostrando <span className="text-neutral-1100 font-black">{totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> a{' '}
                    <span className="text-neutral-1100 font-black">{Math.min(currentPage * itemsPerPage, totalItems)}</span> de{' '}
                    <span className="text-neutral-1100 font-black">{totalItems} lançamentos</span>
                </p>

                <div className="flex items-center gap-2 order-1 md:order-2">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="size-10 flex items-center justify-center rounded-xl border border-neutral-100 text-neutral-400 disabled:opacity-30 hover:bg-neutral-50 active:scale-95 transition-all"
                    >
                        <ChevronLeft size={20} />
                    </button>

                    <div className="flex items-center gap-1.5 px-2">
                        {getPageNumbers().map((page, i) => (
                            <button
                                key={i}
                                onClick={() => typeof page === 'number' && setCurrentPage(page)}
                                disabled={typeof page !== 'number'}
                                className={clsx(
                                    "min-w-[40px] h-10 px-3 flex items-center justify-center rounded-xl text-xs font-black transition-all",
                                    currentPage === page
                                        ? "bg-neutral-1100 text-white shadow-lg"
                                        : typeof page === 'number'
                                            ? "text-neutral-500 hover:bg-neutral-50 active:bg-neutral-100"
                                            : "text-neutral-300 cursor-default"
                                )}
                            >
                                {page}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages || totalPages === 0}
                        className="size-10 flex items-center justify-center rounded-xl border border-neutral-100 text-neutral-400 disabled:opacity-30 hover:bg-neutral-50 active:scale-95 transition-all"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            <NewTransactionModal
                isOpen={!!editingTransaction}
                onClose={() => setEditingTransaction(null)}
                initialData={editingTransaction || undefined}
            />
        </div>
    );
}


