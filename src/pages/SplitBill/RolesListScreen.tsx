import { Plus, ArrowLeft } from 'lucide-react';
import { SplitRole } from './types';

interface RolesListScreenProps {
  roles: SplitRole[];
  onSelectRole: (role: SplitRole) => void;
  onCreateNew: () => void;
  onBack: () => void;
}

export default function RolesListScreen({ roles, onSelectRole, onCreateNew, onBack }: RolesListScreenProps) {
  
  const calculateTotal = (role: SplitRole) => {
    return role.expenses.reduce((acc, curr) => acc + curr.amount, 0);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <div className="flex flex-col h-full bg-white md:rounded-3xl max-w-2xl w-full mx-auto md:mt-10 p-6 shadow-sm border border-neutral-100">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="text-neutral-500 font-semibold text-sm hover:text-neutral-800 transition-colors">
          Voltar
        </button>
        <h2 className="text-xl font-bold text-neutral-1100">Todos os Rolês</h2>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 pb-20">
        {roles.map(role => (
          <div key={role.id} className="flex flex-col items-end gap-2 w-full cursor-pointer" onClick={() => onSelectRole(role)}>
            <p className="text-xs font-semibold text-neutral-600 tracking-wide">{role.date}</p>
            <div className="w-full bg-white border border-neutral-300 rounded-2xl p-4 flex items-center justify-between hover:border-brand-500 transition-colors shadow-sm">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-xl bg-neutral-100 flex items-center justify-center text-2xl">
                  {role.emoji || '🍻'}
                </div>
                <p className="text-xl font-bold text-neutral-800">{role.title}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-sm font-semibold text-neutral-500">Editar</span>
                <span className="text-lg font-bold text-brand-700">{formatCurrency(calculateTotal(role))}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 space-y-3 pt-4 border-t border-neutral-100">
        <button 
          onClick={onCreateNew}
          className="w-full flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-400 text-neutral-1100 font-bold py-4 px-6 rounded-2xl transition-colors"
        >
          <Plus size={24} />
          Criar novo rolê
        </button>
        
        <button 
          onClick={onBack}
          className="w-full flex items-center justify-center gap-2 bg-white border-2 border-neutral-200 hover:bg-neutral-50 text-neutral-1100 font-bold py-4 px-6 rounded-2xl transition-colors"
        >
          <ArrowLeft size={24} />
          Voltar
        </button>
      </div>
    </div>
  );
}
