
import { TransactionsTable } from '../../components/dashboard/TransactionsTable';
import { TransactionsFilters } from '../../components/transactions/TransactionsFilters';
import { Plus, Download, ArrowDownLeft, ArrowUpRight, Calculator, List } from 'lucide-react';
import { useState } from 'react';
import { NewTransactionModal } from '../../components/modals/NewTransactionModal';
import { useFinance } from '../../contexts/FinanceContext';
import clsx from 'clsx';

export default function Transactions() {
    const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
    const { filteredTransactions, totalIncome, totalExpenses } = useFinance();

    const difference = totalIncome - totalExpenses;
    const count = filteredTransactions.length;

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    const handleExport = () => {
        // Mock export
        const csvContent = "data:text/csv;charset=utf-8,"
            + ["Data,Descrição,Categoria,Valor,Tipo"].join(",") + "\n"
            + filteredTransactions.map(t => `${t.date},${t.description},${t.category},${t.amount},${t.type}`).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `transacoes_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="p-6 md:p-8 max-w-[1600px] mx-auto animate-fade-in space-y-8 min-h-full flex flex-col">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
                <div>
                    <h1 className="text-3xl font-black text-neutral-1100 flex items-center gap-3">
                        <List className="text-brand-500 size-8" />
                        Transações
                    </h1>
                    <p className="text-neutral-500 mt-2 font-bold uppercase tracking-wider text-xs">
                        Histórico completo e filtros avançados.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-5 py-3 border-2 border-neutral-100 rounded-full font-black text-xs text-neutral-600 hover:bg-neutral-50 transition-all uppercase tracking-widest"
                    >
                        <Download size={18} />
                        Exportar
                    </button>
                    <button
                        onClick={() => setIsTransactionModalOpen(true)}
                        className="flex items-center gap-2 bg-neutral-1100 text-white px-6 py-3 rounded-full font-black text-xs hover:bg-neutral-900 transition-all shadow-lg active:scale-95 uppercase tracking-widest"
                    >
                        <Plus size={20} />
                        Nova Transação
                    </button>
                </div>
            </div>

            {/* Advanced Filters */}
            <TransactionsFilters />

            {/* Summary Statistics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
                <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-green-50 text-green-600 rounded-xl">
                            <ArrowDownLeft size={18} />
                        </div>
                        <span className="text-xs font-black text-neutral-400 uppercase tracking-widest text-nowrap">Receitas Filtradas</span>
                    </div>
                    <p className="text-2xl font-black text-green-600">{formatCurrency(totalIncome)}</p>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-red-50 text-red-600 rounded-xl">
                            <ArrowUpRight size={18} />
                        </div>
                        <span className="text-xs font-black text-neutral-400 uppercase tracking-widest text-nowrap">Despesas Filtradas</span>
                    </div>
                    <p className="text-2xl font-black text-neutral-1100">{formatCurrency(totalExpenses)}</p>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className={clsx(
                            "p-2 rounded-xl",
                            difference >= 0 ? "bg-brand-50 text-brand-600" : "bg-red-50 text-red-600"
                        )}>
                            <Calculator size={18} />
                        </div>
                        <span className="text-xs font-black text-neutral-400 uppercase tracking-widest">Saldo do Período</span>
                    </div>
                    <p className={clsx(
                        "text-2xl font-black",
                        difference >= 0 ? "text-brand-600" : "text-red-600"
                    )}>
                        {formatCurrency(difference)}
                    </p>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-neutral-50 text-neutral-600 rounded-xl">
                            <List size={18} />
                        </div>
                        <span className="text-xs font-black text-neutral-400 uppercase tracking-widest">Lançamentos</span>
                    </div>
                    <p className="text-2xl font-black text-neutral-1100">{count}</p>
                </div>
            </div>

            {/* Table */}
            <div className="flex-1 min-h-0 bg-white rounded-3xl border border-neutral-100 shadow-sm p-2">
                <TransactionsTable mode="expanded" hideHeader={true} />
            </div>

            <NewTransactionModal
                isOpen={isTransactionModalOpen}
                onClose={() => setIsTransactionModalOpen(false)}
            />
        </div>
    );
}
