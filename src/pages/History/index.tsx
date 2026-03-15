import { useState, useMemo } from 'react';
import { useFinance } from '../../contexts/FinanceContext';
import { 
    Calendar, 
    ChevronRight, 
    Lock, 
    TrendingUp, 
    TrendingDown, 
    PiggyBank,
    AlertCircle,
    Settings,
    History as HistoryIcon,
    FileText,
    Printer
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { getCyclePeriod, getFinancialCycleRange } from '../../utils/cycles';
import { ClosureReports } from '../../components/history/ClosureReports';
import { exportToCSV, exportToPDF } from '../../utils/export';
import clsx from 'clsx';

export default function HistoryPage() {
    const { 
        monthlyClosings, 
        closingDay, 
        updateClosingDay, 
        closeCycle, 
        totalIncome, 
        totalExpenses,
        totalBalance
    } = useFinance();
    
    const [isEditingClosingDay, setIsEditingClosingDay] = useState(false);
    const [tempClosingDay, setTempClosingDay] = useState(closingDay);

    const currentPeriod = useMemo(() => getCyclePeriod(new Date(), closingDay), [closingDay]);
    const { startDate, endDate } = useMemo(() => getFinancialCycleRange(new Date(), closingDay), [closingDay]);

    const handleSaveClosingDay = async () => {
        await updateClosingDay(tempClosingDay);
        setIsEditingClosingDay(false);
    };

    const handleCloseMonth = async () => {
        if (confirm(`Deseja fechar o ciclo de ${currentPeriod}? Isso arquivará os valores atuais.`)) {
            await closeCycle(currentPeriod, {
                openingBalance: totalBalance - (totalIncome - totalExpenses),
                totalIncome,
                totalExpense: totalExpenses,
                closingBalance: totalBalance
            });
        }
    };

    const handleExportCSV = () => {
        const headers = {
            period: 'Período',
            totalIncome: 'Renda Total',
            totalExpense: 'Despesa Total',
            closingBalance: 'Saldo Final',
            status: 'Status'
        };
        exportToCSV(monthlyClosings, 'relatorio-financeiro-mycash', headers);
    };

    return (
        <div className="flex flex-col gap-8 w-full max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header / Configuração */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-neutral-900">Histórico Financeiro</h1>
                    <p className="text-neutral-500 mt-1">Gerencie seus ciclos e fechamentos mensais</p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    {/* Export Actions */}
                    <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-neutral-200 shadow-sm print:hidden">
                        <button 
                            onClick={handleExportCSV}
                            disabled={monthlyClosings.length === 0}
                            className={clsx(
                                "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all",
                                monthlyClosings.length === 0 
                                    ? "text-neutral-300 cursor-not-allowed" 
                                    : "text-neutral-600 hover:bg-neutral-50 hover:text-brand-600"
                            )}
                            title="Exportar CSV"
                        >
                            <FileText size={18} />
                            <span className="hidden sm:inline">CSV</span>
                        </button>
                        <div className="w-px h-6 bg-neutral-100" />
                        <button 
                            onClick={exportToPDF}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-neutral-600 hover:bg-neutral-50 hover:text-brand-600 transition-all"
                            title="Imprimir / Salvar PDF"
                        >
                            <Printer size={18} />
                            <span className="hidden sm:inline">PDF</span>
                        </button>
                    </div>

                    <div className="flex items-center gap-3 bg-white p-2 pr-4 rounded-2xl border border-neutral-200 shadow-sm print:hidden">
                        <div className="size-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600">
                            <Settings size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider">Início do Ciclo</p>
                            {isEditingClosingDay ? (
                                <div className="flex items-center gap-2 mt-1">
                                    <input 
                                        type="number" 
                                        min="1" 
                                        max="28"
                                        value={tempClosingDay}
                                        onChange={(e) => setTempClosingDay(Number(e.target.value))}
                                        className="w-16 px-2 py-1 border border-neutral-300 rounded-md text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                                    />
                                    <button 
                                        onClick={handleSaveClosingDay}
                                        className="text-xs font-semibold text-brand-600 hover:text-brand-700"
                                    >
                                        Salvar
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="font-bold text-neutral-1100">Todo dia {closingDay}</span>
                                    <button 
                                        onClick={() => setIsEditingClosingDay(true)}
                                        className="text-[10px] font-bold text-brand-600 uppercase tracking-tight hover:underline"
                                    >
                                        Alterar
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Ciclo Atual */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-neutral-1100 rounded-[32px] p-8 text-white shadow-xl relative overflow-hidden group">
                    {/* Decorative Blurs */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-brand-500/20 transition-all duration-700" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-500/5 rounded-full -ml-10 -mb-10 blur-2xl opacity-50" />
                    
                    <div className="relative z-10 h-full flex flex-col">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="size-12 rounded-2xl bg-white/5 backdrop-blur-md flex items-center justify-center text-brand-500 border border-white/10">
                                <Calendar size={24} />
                            </div>
                            <div>
                                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-400">Ciclo Atual</h2>
                                <p className="text-2xl font-black tracking-tightest mt-1">
                                    {format(startDate, "dd 'de' MMM", { locale: ptBR })} - {format(endDate, "dd 'de' MMM", { locale: ptBR })}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mt-auto">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2">Receitas</p>
                                <p className="text-2xl font-black text-brand-500">R$ {totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2">Despesas</p>
                                <p className="text-2xl font-black text-white">R$ {totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                            </div>
                            <div className="hidden md:block">
                                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2">Saldo Previsto</p>
                                <p className="text-2xl font-black text-white opacity-90">R$ {totalBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                            </div>
                        </div>

                        <div className="mt-10 flex flex-wrap gap-4 items-center">
                            <button 
                                onClick={handleCloseMonth}
                                className="px-6 py-3 bg-brand-500 text-neutral-1100 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-brand-700 transition-all flex items-center gap-2 shadow-lg shadow-brand-500/20 active:scale-95"
                            >
                                <Lock size={18} />
                                Fechar Ciclo Agora
                            </button>
                            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-neutral-400 bg-white/5 px-4 py-3 rounded-2xl border border-white/5">
                                <AlertCircle size={14} className="text-brand-500" />
                                Fecha automaticamente em {format(endDate, "dd/MM")}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-[32px] p-8 border border-neutral-200 shadow-sm flex flex-col items-center justify-center text-center">
                    <div className="size-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                        <PiggyBank size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-neutral-1100">Economia no Ciclo</h3>
                    <p className="text-neutral-500 mt-2 text-sm">Você economizou aproximadamente</p>
                    <p className="text-4xl font-black text-emerald-600 mt-2">
                        {totalIncome > 0 ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100) : 0}%
                    </p>
                    <p className="text-xs text-neutral-400 mt-4 max-w-[200px]">
                        Isso é {(totalIncome - totalExpenses).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} a mais no seu bolso.
                    </p>
                </div>
            </div>

            {/* Visualizações e Relatórios */}
            {monthlyClosings.length > 0 && <ClosureReports />}

            {/* Lista de Histórico */}
            <div className="bg-white rounded-[32px] border border-neutral-200 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-neutral-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-neutral-1100">Ciclos Encerrados</h2>
                        <p className="text-sm text-neutral-500 mt-1">Registros de períodos anteriores arquivados</p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {monthlyClosings.length === 0 ? (
                        <div className="p-20 flex flex-col items-center justify-center text-center">
                            <div className="size-16 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-300 mb-4">
                                <HistoryIcon size={32} />
                            </div>
                            <p className="text-neutral-500 font-medium">Nenhum ciclo encerrado ainda.</p>
                            <p className="text-neutral-400 text-sm mt-1">Seus fechamentos aparecerão aqui após você fechar o primeiro ciclo.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-neutral-50/50">
                                    <th className="px-8 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest whitespace-nowrap">Período</th>
                                    <th className="px-8 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest whitespace-nowrap">Status</th>
                                    <th className="px-8 py-4 text-xs font-bold text-neutral-1100 uppercase tracking-widest whitespace-nowrap text-right">Renda</th>
                                    <th className="px-8 py-4 text-xs font-bold text-neutral-1100 uppercase tracking-widest whitespace-nowrap text-right">Gastos</th>
                                    <th className="px-8 py-4 text-xs font-bold text-neutral-1100 uppercase tracking-widest whitespace-nowrap text-right">Saldo Final</th>
                                    <th className="px-8 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest whitespace-nowrap"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {monthlyClosings.map((closing) => (
                                    <tr key={closing.id} className="group hover:bg-neutral-50/50 transition-all border-b border-neutral-100 last:border-0">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="size-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-600 group-hover:bg-white group-hover:shadow-sm transition-all">
                                                    <Calendar size={18} />
                                                </div>
                                                <span className="font-bold text-neutral-1100 uppercase tracking-tighter">
                                                    {closing.period}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 text-neutral-600 w-fit text-xs font-bold uppercase tracking-widest">
                                                <Lock size={12} />
                                                Fechado
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-1.5 text-emerald-600 font-bold">
                                                <TrendingUp size={14} />
                                                {closing.totalIncome.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-1.5 text-rose-600 font-bold">
                                                <TrendingDown size={14} />
                                                {closing.totalExpense.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <span className="font-black text-neutral-1100">
                                                {closing.closingBalance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button className="p-2 rounded-lg text-neutral-400 hover:text-brand-600 hover:bg-brand-50 transition-all">
                                                <ChevronRight size={20} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
