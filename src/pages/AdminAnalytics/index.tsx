import { useAdminAnalytics } from '../../hooks/useAdminAnalytics';
import { BarChart3, MousePointer2, Timer, Zap, Loader2, RefreshCcw, TrendingUp } from 'lucide-react';
import clsx from 'clsx';
import { useInteractionTracker } from '../../hooks/useAnalytics';

export default function AdminAnalytics() {
    const { summary, loading, isAdmin, refresh } = useAdminAnalytics();
    const { trackClick } = useInteractionTracker('admin_refresh');

    if (!isAdmin) {
        return (
            <div className="flex items-center justify-center h-[70vh]">
                <div className="bg-red-50 p-8 rounded-3xl text-center max-w-md border border-red-100">
                    <h1 className="text-2xl font-bold text-red-600 mb-2">Acesso Negado</h1>
                    <p className="text-red-500">Esta área é restrita a administradores do sistema.</p>
                </div>
            </div>
        );
    }

    if (loading && !summary) {
        return (
            <div className="flex items-center justify-center h-[70vh]">
                <Loader2 className="animate-spin text-brand-600" size={40} />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8 animate-fade-in pb-12">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-neutral-1100 tracking-tight">Analytics do Sistema</h1>
                    <p className="text-neutral-500 font-medium">Monitoramento de UX, performance e funis de conversão.</p>
                </div>
                <button 
                    onClick={() => {
                        refresh();
                        trackClick();
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-1100 font-bold rounded-2xl transition-all active:scale-95 text-sm self-start"
                >
                    <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
                    Atualizar Dados
                </button>
            </header>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard 
                    label="Total de Eventos" 
                    value={summary?.total_events || 0} 
                    icon={Zap} 
                    color="text-amber-500" 
                    bgColor="bg-amber-50"
                />
                <MetricCard 
                    label="Sessões Únicas" 
                    value={summary?.sessions || 0} 
                    icon={TrendingUp} 
                    color="text-emerald-500" 
                    bgColor="bg-emerald-50"
                />
                <MetricCard 
                    label="Ações de Performance" 
                    value={summary?.avg_performance.length || 0} 
                    icon={Timer} 
                    color="text-blue-500" 
                    bgColor="bg-blue-50"
                />
                <MetricCard 
                    label="Funis Ativos" 
                    value={summary?.funnel_stats.length || 0} 
                    icon={BarChart3} 
                    color="text-indigo-500" 
                    bgColor="bg-indigo-50"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Performance Table */}
                <Section title="Performance de Ações" icon={Timer}>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-xs uppercase text-neutral-400 font-bold border-b border-neutral-100">
                                    <th className="py-4 font-bold">Ação</th>
                                    <th className="py-4 font-bold">Latency (Média)</th>
                                    <th className="py-4 font-bold">Amostras</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {summary?.avg_performance.map((perf, i) => (
                                    <tr key={i} className="border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors">
                                        <td className="py-4 font-bold text-neutral-1100">{perf.name}</td>
                                        <td className="py-4">
                                            <span className={clsx(
                                                "font-mono font-bold px-2 py-1 rounded-lg",
                                                perf.avg_duration > 500 ? "text-red-600 bg-red-50" : "text-emerald-600 bg-emerald-50"
                                            )}>
                                                {perf.avg_duration}ms
                                            </span>
                                        </td>
                                        <td className="py-4 text-neutral-500">{perf.count}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Section>

                {/* Funnel Table */}
                <Section title="Funis de Conversão" icon={BarChart3}>
                    <div className="flex flex-col gap-6">
                        {summary?.funnel_stats.map((funnel, i) => (
                            <div key={i} className="flex flex-col gap-2">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <h4 className="font-bold text-neutral-1100 leading-none">{funnel.name}</h4>
                                        <span className="text-xs text-neutral-400">{funnel.submits} de {funnel.starts} concluídos</span>
                                    </div>
                                    <span className="text-lg font-black text-brand-600">{funnel.rate}%</span>
                                </div>
                                <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-brand-600 rounded-full transition-all duration-1000"
                                        style={{ width: `${funnel.rate}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </Section>

                {/* Top Clicks */}
                <Section title="Interações (Top Clicks)" icon={MousePointer2} className="lg:col-span-2">
                    <div className="flex flex-wrap gap-4">
                        {summary?.top_clicks.map((click, i) => (
                            <div key={i} className="flex items-center gap-3 bg-white border border-neutral-200 px-5 py-4 rounded-3xl shadow-sm hover:shadow-md transition-all">
                                <div className="size-10 rounded-2xl bg-neutral-900 flex items-center justify-center text-white font-black">
                                    #{i + 1}
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-neutral-400 uppercase tracking-tighter">Event Name</p>
                                    <p className="text-sm font-bold text-neutral-1100">{click.name}</p>
                                </div>
                                <div className="ml-4 pl-4 border-l border-neutral-100">
                                    <p className="text-xs font-bold text-neutral-400 uppercase tracking-tighter">Cliques</p>
                                    <p className="text-xl font-black text-brand-600">{click.count}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Section>
            </div>
        </div>
    );
}

function MetricCard({ label, value, icon: Icon, color, bgColor }: any) {
    return (
        <div className="bg-white p-6 rounded-[32px] border border-neutral-100 shadow-sm flex items-center gap-5">
            <div className={clsx("size-14 rounded-2xl flex items-center justify-center shrink-0", bgColor)}>
                <Icon className={color} size={28} />
            </div>
            <div>
                <p className="text-sm font-bold text-neutral-500 mb-0.5">{label}</p>
                <p className="text-3xl font-black text-neutral-1100 tracking-tight leading-none">{value}</p>
            </div>
        </div>
    );
}

function Section({ title, icon: Icon, children, className }: any) {
    return (
        <section className={clsx("bg-white p-8 rounded-[40px] border border-neutral-100 shadow-sm flex flex-col gap-6", className)}>
            <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-neutral-1100 flex items-center justify-center text-white">
                    <Icon size={20} />
                </div>
                <h2 className="text-xl font-extrabold text-neutral-1100 tracking-tight">{title}</h2>
            </div>
            {children}
        </section>
    );
}
