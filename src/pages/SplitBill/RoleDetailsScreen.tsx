import { useState } from 'react';
import { Calculator, Plus, Trash2, ArrowLeft, AlertTriangle, X } from 'lucide-react';
import { SplitRole } from './types';

interface RoleDetailsScreenProps {
  role: SplitRole;
  onBack: () => void;
  onAddExpense: () => void;
  onCalculate: () => void;
  onDeleteRole: () => void;
  onDeleteExpense: (id: string) => void;
}

type ConfirmState =
  | { type: 'delete_role' }
  | { type: 'delete_expense'; id: string; title: string }
  | null;

export default function RoleDetailsScreen({ role, onBack, onAddExpense, onCalculate, onDeleteRole, onDeleteExpense }: RoleDetailsScreenProps) {
  const [confirm, setConfirm] = useState<ConfirmState>(null);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const handleConfirmDelete = () => {
    if (!confirm) return;
    if (confirm.type === 'delete_role') {
      onDeleteRole();
    } else {
      onDeleteExpense(confirm.id);
    }
    setConfirm(null);
  };

  return (
    <div className="flex flex-col h-full bg-white md:rounded-3xl max-w-2xl w-full mx-auto md:mt-10 p-6 shadow-sm border border-neutral-100 overflow-y-auto relative">

      {/* Confirmation overlay */}
      {confirm && (
        <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center p-8 text-center animate-fade-in">
          <div className="size-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle size={40} className="text-red-500" />
          </div>
          <h3 className="text-2xl font-bold text-neutral-900 mb-2">Tem certeza?</h3>
          <p className="text-neutral-500 mb-2 max-w-sm text-lg">
            {confirm.type === 'delete_role'
              ? `Deseja apagar o rolê "${role.title}"?`
              : `Deseja apagar o gasto "${confirm.title}"?`}
          </p>
          <p className="text-sm text-red-500 font-medium mb-8">Esta ação não poderá ser desfeita.</p>
          <div className="flex gap-4 w-full max-w-xs">
            <button
              onClick={() => setConfirm(null)}
              className="flex-1 py-3 rounded-xl border-2 border-neutral-200 font-bold text-neutral-700 hover:bg-neutral-50 transition-colors flex items-center justify-center gap-2"
            >
              <X size={18} />
              Não
            </button>
            <button
              onClick={handleConfirmDelete}
              className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 size={18} />
              Sim, apagar
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="text-neutral-500 font-semibold text-sm hover:text-neutral-800 transition-colors">
          Voltar
        </button>
        <h2 className="text-xl font-bold text-neutral-1100 truncate">{role.title}</h2>
        <div className="ml-auto w-12 h-12 border-2 border-neutral-200 rounded-xl flex items-center justify-center text-xl bg-white shadow-sm shrink-0">
          {role.emoji || '🍻'}
        </div>
      </div>

      {role.expenses.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center mt-12 mb-12">
          <div className="w-64 h-64 mb-6 opacity-80">
            <img src="/porquinho busca.svg" alt="Nada" className="w-full h-full object-contain" />
          </div>
          <h3 className="text-2xl font-bold text-neutral-1100 mb-4">Sem gastos ainda</h3>
          <p className="text-lg text-neutral-500 max-w-[280px]">
            Nenhum gasto adicionado, adicione agora mesmo para começar.
          </p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col gap-4 mt-4 pb-20">
          {role.expenses.map(exp => (
            <div key={exp.id} className="bg-white border border-neutral-300 rounded-xl p-4 flex items-center shadow-sm">
              <div className="size-16 bg-neutral-100 rounded-xl flex items-center justify-center text-2xl mr-4 shrink-0">
                🧾
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xl font-bold text-neutral-800 truncate">{exp.title}</p>
                <p className="text-lg font-semibold text-neutral-600 mt-1">{formatCurrency(exp.amount)}</p>
              </div>
              <button
                onClick={() => setConfirm({ type: 'delete_expense', id: exp.id, title: exp.title })}
                className="text-neutral-400 hover:text-red-500 p-2 transition-colors shrink-0 ml-2"
                title="Apagar despesa"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 space-y-3 shrink-0 pb-4">
        {role.expenses.length > 0 && (
          <button
            onClick={onCalculate}
            className="w-full flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-400 text-neutral-1100 font-bold py-4 px-6 rounded-2xl transition-colors"
          >
            <Calculator size={24} />
            Calcular divisão
          </button>
        )}

        <button
          onClick={onAddExpense}
          className="w-full flex items-center justify-center gap-2 bg-white border-2 border-neutral-200 hover:bg-neutral-50 text-neutral-1100 font-bold py-4 px-6 rounded-2xl transition-colors"
        >
          <Plus size={24} />
          Adicionar gasto
        </button>

        {role.expenses.length === 0 && (
          <button
            onClick={onBack}
            className="w-full flex items-center justify-center gap-2 bg-white border-2 border-transparent hover:bg-neutral-50 text-neutral-500 font-bold py-4 px-6 rounded-2xl transition-colors mt-2"
          >
            <ArrowLeft size={24} />
            Voltar
          </button>
        )}

        {role.expenses.length > 0 && (
          <button
            onClick={() => setConfirm({ type: 'delete_role' })}
            className="w-full flex items-center justify-center gap-2 bg-white hover:bg-red-50 text-red-700 font-bold py-3 px-6 rounded-2xl transition-colors mt-4 border border-transparent"
          >
            <Trash2 size={24} />
            Deletar rolê
          </button>
        )}
      </div>
    </div>
  );
}
