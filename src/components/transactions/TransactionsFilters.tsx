
import { useFinance } from '../../contexts/FinanceContext';
import { Search, Filter, Calendar, User, Wallet, Tag, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';

export function TransactionsFilters() {
    const {
        familyMembers,
        categories,
        bankAccounts,
        creditCards,
        transactionTypeFilter,
        setTransactionTypeFilter,
        searchText,
        setSearchText,
        categoryIdFilter,
        setCategoryIdFilter,
        accountIdFilter,
        setAccountIdFilter,
        statusFilter,
        setStatusFilter,
        selectedMemberId,
        setSelectedMemberId,
        dateRange,
        setDateRange
    } = useFinance();

    const allAccounts = [...bankAccounts, ...creditCards];

    return (
        <div className="bg-white rounded-3xl border border-neutral-100 p-4 lg:p-6 shadow-sm mb-8 space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-neutral-1100 flex items-center gap-2 uppercase tracking-widest">
                    <Filter size={16} />
                    Filtros Avançados
                </h3>
                <button
                    onClick={() => {
                        setSearchText('');
                        setTransactionTypeFilter('all');
                        setCategoryIdFilter(null);
                        setAccountIdFilter(null);
                        setStatusFilter(null);
                        setSelectedMemberId(null);
                    }}
                    className="text-xs font-bold text-neutral-400 hover:text-brand-500 transition-colors uppercase"
                >
                    Limpar Tudo
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 size-4" />
                    <input
                        type="text"
                        placeholder="Buscar..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-neutral-50 border-none rounded-xl text-sm font-medium text-neutral-1100 placeholder:text-neutral-400 focus:ring-2 focus:ring-brand-500 transition-all outline-none"
                    />
                </div>

                {/* Type */}
                <select
                    value={transactionTypeFilter}
                    onChange={(e) => setTransactionTypeFilter(e.target.value as any)}
                    className="w-full px-4 py-3 bg-neutral-50 border-none rounded-xl text-sm font-bold text-neutral-1100 focus:ring-2 focus:ring-brand-500 transition-all outline-none cursor-pointer appearance-none"
                >
                    <option value="all">Todos os tipos</option>
                    <option value="INCOME">Receitas</option>
                    <option value="EXPENSE">Despesas</option>
                </select>

                {/* Category */}
                <div className="relative">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 size-4 pointer-events-none" />
                    <select
                        value={categoryIdFilter || ''}
                        onChange={(e) => setCategoryIdFilter(e.target.value || null)}
                        className="w-full pl-10 pr-4 py-3 bg-neutral-50 border-none rounded-xl text-sm font-bold text-neutral-1100 focus:ring-2 focus:ring-brand-500 transition-all outline-none cursor-pointer appearance-none"
                    >
                        <option value="">Todas Categorias</option>
                        {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>

                {/* Account */}
                <div className="relative">
                    <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 size-4 pointer-events-none" />
                    <select
                        value={accountIdFilter || ''}
                        onChange={(e) => setAccountIdFilter(e.target.value || null)}
                        className="w-full pl-10 pr-4 py-3 bg-neutral-50 border-none rounded-xl text-sm font-bold text-neutral-1100 focus:ring-2 focus:ring-brand-500 transition-all outline-none cursor-pointer appearance-none"
                    >
                        <option value="">Contas/Cartões</option>
                        {allAccounts.map(a => (
                            <option key={a.id} value={a.id}>{a.name}</option>
                        ))}
                    </select>
                </div>

                {/* Member */}
                <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 size-4 pointer-events-none" />
                    <select
                        value={selectedMemberId || ''}
                        onChange={(e) => setSelectedMemberId(e.target.value || null)}
                        className="w-full pl-10 pr-4 py-3 bg-neutral-50 border-none rounded-xl text-sm font-bold text-neutral-1100 focus:ring-2 focus:ring-brand-500 transition-all outline-none cursor-pointer appearance-none"
                    >
                        <option value="">Responsável</option>
                        {familyMembers.map(m => (
                            <option key={m.id} value={m.id}>{m.name}</option>
                        ))}
                    </select>
                </div>

                {/* Status */}
                <div className="relative">
                    <CheckCircle2 className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 size-4 pointer-events-none" />
                    <select
                        value={statusFilter || ''}
                        onChange={(e) => setStatusFilter(e.target.value || null)}
                        className="w-full pl-10 pr-4 py-3 bg-neutral-50 border-none rounded-xl text-sm font-bold text-neutral-1100 focus:ring-2 focus:ring-brand-500 transition-all outline-none cursor-pointer appearance-none"
                    >
                        <option value="">Status</option>
                        <option value="completed">Concluído</option>
                        <option value="pending">Pendente</option>
                    </select>
                </div>

                {/* Dates (Simplified Range) */}
                <div className="relative lg:col-span-1">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 size-4 pointer-events-none" />
                    <input
                        type="date"
                        value={format(dateRange.startDate, 'yyyy-MM-dd')}
                        onChange={(e) => setDateRange({ ...dateRange, startDate: new Date(e.target.value) })}
                        className="w-full pl-10 pr-4 py-3 bg-neutral-50 border-none rounded-xl text-[10px] font-black text-neutral-1100 focus:ring-2 focus:ring-brand-500 transition-all outline-none"
                    />
                </div>
            </div>
        </div>
    );
}
