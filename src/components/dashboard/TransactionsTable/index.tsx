import { useState, useMemo, useEffect } from 'react';
import {
    Search,
    ChevronLeft,
    ChevronRight,
    ArrowUpRight,
    ArrowDownLeft,
    User,
    FileSearch
} from 'lucide-react';
import { useFinance } from '../../../contexts/FinanceContext';
import { format, parseISO } from 'date-fns';
import clsx from 'clsx';

export function TransactionsTable() {
    const {
        filteredTransactions,
        bankAccounts,
        creditCards,
        familyMembers
    } = useFinance();

    // Local Filters
    const [localSearch, setLocalSearch] = useState('');
    const [localType, setLocalType] = useState<'all' | 'income' | 'expense'>('all');

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Reset page on filter change
    useEffect(() => {
        setCurrentPage(1);
    }, [localSearch, localType, filteredTransactions]);

    // Apply Local Filtering
    const finalTransactions = useMemo(() => {
        return filteredTransactions.filter(t => {
            // Local Search (Description or Category)
            const matchesSearch = localSearch === '' ||
                t.description.toLowerCase().includes(localSearch.toLowerCase()) ||
                t.category.toLowerCase().includes(localSearch.toLowerCase());

            // Local Type
            const matchesType = localType === 'all' || t.type === localType;

            return matchesSearch && matchesType;
        });
    }, [filteredTransactions, localSearch, localType]);

    // Paginated Data
    const totalItems = finalTransactions.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginatedTransactions = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return finalTransactions.slice(start, start + itemsPerPage);
    }, [finalTransactions, currentPage]);

    const formatCurrency = (amount: number, type: 'income' | 'expense') => {
        const value = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(amount);
        return type === 'income' ? `+ ${value}` : `- ${value}`;
    };

    const getAccountName = (accountId: string) => {
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

    // Scroll to top on page change
    useEffect(() => {
        if (currentPage > 1) {
            const element = document.getElementById('extrato-detalhado');
            element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [currentPage]);

    return (
        <div id="extrato-detalhado" className="bg-white rounded-3xl border border-neutral-200 p-6 lg:p-10 flex flex-col h-full shadow-sm">
            {/* Header / Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 shrink-0">
                <h2 className="text-lg font-medium text-neutral-1100">Extrato detalhado</h2>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                    {/* Search Input */}
                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 size-4" />
                        <input
                            type="text"
                            placeholder="Buscar lançamentos..."
                            value={localSearch}
                            onChange={(e) => setLocalSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-neutral-100 border-neutral-100 rounded-xl text-sm text-neutral-1100 placeholder:text-neutral-400 focus:ring-2 focus:ring-brand-500 transition-all outline-none"
                        />
                    </div>

                    {/* Type Filter */}
                    <select
                        value={localType}
                        onChange={(e) => setLocalType(e.target.value as any)}
                        className="w-full md:w-[160px] px-4 py-3 bg-neutral-100 border-none rounded-xl text-sm font-medium text-neutral-1100 focus:ring-2 focus:ring-brand-500 transition-all outline-none cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:20px_20px] bg-[right_12px_center] bg-no-repeat"
                    >
                        <option value="all">Todos os tipos</option>
                        <option value="income">Apenas Receitas</option>
                        <option value="expense">Apenas Despesas</option>
                    </select>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex flex-col min-h-0">
                {/* Desktop Table View */}
                <div className="hidden md:block relative rounded-2xl border border-neutral-100 overflow-hidden flex-1">
                    <div className="overflow-x-auto h-full">
                        <table className="w-full text-left border-collapse table-fixed">
                            <thead>
                                <tr className="bg-neutral-50/50 border-b border-neutral-100">
                                    <th className="px-6 py-4 text-[11px] font-bold text-neutral-400 uppercase tracking-wider w-[80px]">Membro</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-neutral-400 uppercase tracking-wider w-[120px]">Data</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-neutral-400 uppercase tracking-wider min-w-[200px]">Descrição</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-neutral-400 uppercase tracking-wider w-[150px]">Categoria</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-neutral-400 uppercase tracking-wider w-[160px]">Origem</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-neutral-400 uppercase tracking-wider w-[100px]">Parcelas</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-neutral-400 uppercase tracking-wider text-right w-[150px]">Valor</th>
                                </tr>
                            </thead>
                            <tbody key={currentPage} className="divide-y divide-neutral-100 animate-fade-in">
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
                                                <span className="text-sm font-medium text-neutral-500">
                                                    {format(parseISO(t.date), 'dd/MM/yyyy')}
                                                </span>
                                            </td>

                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className={clsx(
                                                        "size-8 rounded-full flex items-center justify-center shrink-0 shadow-sm",
                                                        t.type === 'income' ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                                                    )}>
                                                        {t.type === 'income' ? (
                                                            <ArrowDownLeft size={16} strokeWidth={2.5} />
                                                        ) : (
                                                            <ArrowUpRight size={16} strokeWidth={2.5} />
                                                        )}
                                                    </div>
                                                    <span className="text-sm font-bold text-neutral-1100 truncate">
                                                        {t.description}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="px-6 py-5">
                                                <span className="inline-flex px-3 py-1.5 rounded-full bg-neutral-100 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                                                    {t.category}
                                                </span>
                                            </td>

                                            <td className="px-6 py-5 text-sm font-medium text-neutral-500 truncate">
                                                {getAccountName(t.accountId)}
                                            </td>

                                            <td className="px-6 py-5 text-sm font-medium text-neutral-500">
                                                {t.installments && t.installments > 1 ? (
                                                    <span className="px-2 py-1 bg-neutral-100 rounded text-xs font-bold text-neutral-600">
                                                        {t.installments}x
                                                    </span>
                                                ) : '-'}
                                            </td>

                                            <td className={clsx(
                                                "px-6 py-5 text-sm font-bold text-right",
                                                t.type === 'income' ? "text-green-600" : "text-neutral-1100"
                                            )}>
                                                {formatCurrency(t.amount, t.type)}
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
                            <div key={t.id} className="bg-white border border-neutral-100 rounded-2xl p-5 shadow-sm active:scale-[0.98] transition-all">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={clsx(
                                            "size-10 rounded-full flex items-center justify-center shrink-0",
                                            t.type === 'income' ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                                        )}>
                                            {t.type === 'income' ? (
                                                <ArrowDownLeft size={20} strokeWidth={2.5} />
                                            ) : (
                                                <ArrowUpRight size={20} strokeWidth={2.5} />
                                            )}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-neutral-1100">{t.description}</span>
                                            <span className="text-xs text-neutral-400 font-medium">{format(parseISO(t.date), 'dd MMM yyyy')}</span>
                                        </div>
                                    </div>
                                    <span className={clsx(
                                        "text-sm font-black",
                                        t.type === 'income' ? "text-green-600" : "text-neutral-1100"
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
                                            {t.category}
                                        </span>
                                    </div>
                                    <span className="text-[11px] font-medium text-neutral-400">{getAccountName(t.accountId)}</span>
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
                        <p className="text-neutral-400 font-medium">Nenhum lançamento encontrado.</p>
                        <button
                            onClick={() => { setLocalSearch(''); setLocalType('all'); }}
                            className="mt-4 text-xs font-bold text-neutral-1100 underline decoration-neutral-200 underline-offset-4"
                        >
                            Limpar filtros
                        </button>
                    </div>
                )}
            </div>

            {/* Pagination / Footer */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mt-4 pt-6 border-t border-neutral-100 shrink-0">
                <p className="text-xs font-semibold text-neutral-500 order-2 md:order-1">
                    Mostrando <span className="text-neutral-1100">{totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> a{' '}
                    <span className="text-neutral-1100">{Math.min(currentPage * itemsPerPage, totalItems)}</span> de{' '}
                    <span className="text-neutral-1100">{totalItems} lançamentos</span>
                </p>

                <div className="flex items-center gap-2 order-1 md:order-2">
                    {/* Prev */}
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="size-10 flex items-center justify-center rounded-xl border border-neutral-100 text-neutral-400 disabled:opacity-30 hover:bg-neutral-50 active:scale-95 transition-all"
                    >
                        <ChevronLeft size={20} />
                    </button>

                    {/* Page Numbers */}
                    <div className="flex items-center gap-1.5 px-2">
                        {getPageNumbers().map((page, i) => (
                            <button
                                key={i}
                                onClick={() => typeof page === 'number' && setCurrentPage(page)}
                                disabled={typeof page !== 'number'}
                                className={clsx(
                                    "min-w-[40px] h-10 px-3 flex items-center justify-center rounded-xl text-xs font-bold transition-all",
                                    currentPage === page
                                        ? "bg-neutral-1100 text-white shadow-lg shadow-neutral-1100/20"
                                        : typeof page === 'number'
                                            ? "text-neutral-500 hover:bg-neutral-50 active:bg-neutral-100"
                                            : "text-neutral-300 cursor-default"
                                )}
                            >
                                {page}
                            </button>
                        ))}
                    </div>

                    {/* Next */}
                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages || totalPages === 0}
                        className="size-10 flex items-center justify-center rounded-xl border border-neutral-100 text-neutral-400 disabled:opacity-30 hover:bg-neutral-50 active:scale-95 transition-all"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}
