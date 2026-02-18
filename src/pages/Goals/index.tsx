
import { useState } from 'react';
import { Plus, Target, Calendar, Edit2, Trash2 } from 'lucide-react';
import { useFinance } from '../../contexts/FinanceContext';
import { NewGoalModal } from '../../components/modals/NewGoalModal';
import { Goal } from '../../types';
// import clsx from 'clsx';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function Goals() {
    const { goals, deleteGoal } = useFinance();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [goalToEdit, setGoalToEdit] = useState<Goal | undefined>(undefined);

    const handleEdit = (goal: Goal) => {
        setGoalToEdit(goal);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Tem certeza que deseja excluir este objetivo?')) {
            await deleteGoal(id);
        }
    };

    const handleNewGoal = () => {
        setGoalToEdit(undefined);
        setIsModalOpen(true);
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    return (
        <div className="p-6 md:p-8 max-w-[1600px] mx-auto animate-fade-in space-y-8">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-neutral-1100 flex items-center gap-3">
                        <Target className="size-8 text-brand-500" />
                        Objetivos Financeiros
                    </h1>
                    <p className="text-neutral-500 mt-2 font-medium">
                        Acompanhe o progresso das suas metas e sonhos.
                    </p>
                </div>
                <button
                    onClick={handleNewGoal}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-neutral-1100 text-white rounded-full font-bold hover:bg-neutral-900 transition-all shadow-lg active:scale-95"
                >
                    <Plus size={20} />
                    Novo Objetivo
                </button>
            </div>

            {/* Goals Grid */}
            {goals.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-neutral-50 rounded-3xl border-2 border-dashed border-neutral-200">
                    <div className="bg-white p-6 rounded-full shadow-sm mb-6">
                        <Target size={48} className="text-neutral-300" />
                    </div>
                    <h3 className="text-xl font-bold text-neutral-1100 mb-2">Nenhum objetivo criado</h3>
                    <p className="text-neutral-500 mb-8 text-center max-w-md">
                        Defina metas financeiras para organizar seus planos de curto, médio e longo prazo.
                    </p>
                    <button
                        onClick={handleNewGoal}
                        className="text-brand-600 font-bold hover:underline"
                    >
                        Criar meu primeiro objetivo
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {goals.map((goal) => {
                        const progress = (goal.currentAmount / goal.targetAmount) * 100;
                        const remaining = goal.targetAmount - goal.currentAmount;

                        return (
                            <div key={goal.id} className="bg-white rounded-3xl p-6 border border-neutral-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                                {/* Decorative bar */}
                                <div className="absolute top-0 left-0 w-full h-1.5" style={{ backgroundColor: goal.color || '#3B82F6' }} />

                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="size-10 rounded-xl bg-neutral-50 flex items-center justify-center text-xl">
                                            🎯
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-neutral-1100 text-lg">{goal.name}</h3>
                                            {goal.deadline && (
                                                <p className="text-xs font-bold text-neutral-400 flex items-center gap-1 mt-0.5">
                                                    <Calendar size={10} />
                                                    {format(parseISO(goal.deadline), "d 'de' MMM, yyyy", { locale: ptBR })}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Menu Actions */}
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleEdit(goal)}
                                            className="p-2 hover:bg-neutral-50 rounded-lg text-neutral-400 hover:text-neutral-1100 transition-colors"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(goal.id)}
                                            className="p-2 hover:bg-red-50 rounded-lg text-neutral-400 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Guardado</span>
                                            <p className="text-2xl font-bold text-neutral-1100">{formatCurrency(goal.currentAmount)}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Meta</span>
                                            <p className="text-sm font-bold text-neutral-500">{formatCurrency(goal.targetAmount)}</p>
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="relative h-3 bg-neutral-100 rounded-full overflow-hidden">
                                        <div
                                            className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out"
                                            style={{ width: `${Math.min(progress, 100)}%`, backgroundColor: goal.color || '#3B82F6' }}
                                        />
                                    </div>

                                    <div className="flex justify-between items-center text-xs font-bold">
                                        <span className="text-neutral-1100">{progress.toFixed(1)}%</span>
                                        <span className="text-neutral-400">Faltam {formatCurrency(Math.max(0, remaining))}</span>
                                    </div>
                                </div>

                                {/* Quick Add Button (Future feature?) */}
                                {/* <button className="w-full mt-6 py-3 rounded-2xl border border-neutral-200 text-sm font-bold text-neutral-600 hover:bg-neutral-50 flex items-center justify-center gap-2 transition-colors">
                                    <TrendingUp size={16} /> Adicionar Valor
                                </button> */}
                            </div>
                        );
                    })}
                </div>
            )}

            <NewGoalModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                goalToEdit={goalToEdit}
            />

        </div>
    );
}
