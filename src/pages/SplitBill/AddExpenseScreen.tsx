import { useState } from 'react';
import { Check, Camera } from 'lucide-react';
import { SplitRole, Expense } from './types';

interface AddExpenseScreenProps {
  role: SplitRole;
  onBack: () => void;
  onSave: (expense: Expense) => void;
}

export default function AddExpenseScreen({ role, onBack, onSave }: AddExpenseScreenProps) {
  const [title, setTitle] = useState('');
  const [amountStr, setAmountStr] = useState('');
  const [payerId, setPayerId] = useState<string>('me');
  const [excludedIds, setExcludedIds] = useState<string[]>([]);
  
  // Quick fix: if 'me' is not literally in the options, fall back to first person.
  // We assume participants always contain {id: 'me', name: 'Eu', ...}

  const handleToggleExcluded = (id: string) => {
    if (excludedIds.includes(id)) {
      setExcludedIds(excludedIds.filter(eId => eId !== id));
    } else {
      setExcludedIds([...excludedIds, id]);
    }
  };

  const handleSave = () => {
    if (!title.trim() || !amountStr.trim()) return;
    const val = parseFloat(amountStr.replace(',', '.'));
    if (isNaN(val) || val <= 0) return;

    const expense: Expense = {
      id: Date.now().toString(),
      title,
      amount: val,
      paidBy: payerId,
      excludedParticipants: excludedIds
    };
    onSave(expense);
  };

  return (
    <div className="flex flex-col h-full bg-white md:rounded-3xl max-w-md w-full mx-auto md:mt-10 p-6 shadow-sm border border-neutral-100 overflow-y-auto">
      
      <div className="flex items-center gap-4 mb-6 pt-2">
        <button onClick={onBack} className="text-neutral-500 font-semibold text-sm hover:text-neutral-800 transition-colors">
          Cancelar
        </button>
        <h2 className="text-xl font-bold text-neutral-1100">Adicionar Gasto</h2>
      </div>

      <div className="space-y-6 flex-1 pt-4">
        {/* Value */}
        <div className="space-y-2">
          <label className="text-base font-semibold text-neutral-500">Valor</label>
          <div className="flex bg-white border-2 border-neutral-200 rounded-xl relative focus-within:border-brand-500 overflow-hidden items-center group">
            <span className="pl-4 text-neutral-500 text-lg font-medium pr-2">R$</span>
            <input 
              type="text" 
              inputMode="decimal"
              placeholder="0,00"
              value={amountStr}
              onChange={e => setAmountStr(e.target.value)}
              className="flex-1 bg-transparent py-4 text-xl text-neutral-800 outline-none font-semibold w-full"
            />
            {/* The photo scan button concept visually */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-neutral-100 rounded-lg group-hover:bg-neutral-200 transition-colors">
               <Camera size={20} className="text-neutral-600" />
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <label className="text-base font-semibold text-neutral-500">O que é este gasto?</label>
          <input 
            type="text" 
            placeholder="Ex: Cerveja e batata frita"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full bg-white border-2 border-neutral-200 rounded-xl px-4 py-3 text-lg text-neutral-800 outline-none focus:border-brand-500 transition-colors"
          />
        </div>

        {/* Who paid */}
        <div className="space-y-2">
          <label className="text-base font-semibold text-neutral-500">Quem pagou?</label>
          <select 
            value={payerId}
            onChange={(e) => setPayerId(e.target.value)}
            className="w-full bg-white border-2 border-neutral-200 rounded-xl px-4 py-4 text-lg text-neutral-800 outline-none focus:border-brand-500 transition-colors appearance-none"
          >
            {role.participants.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        {/* Exclusions */}
        <div className="space-y-3 pt-2 pb-6">
          <label className="text-base font-semibold text-neutral-500">Alguém NÃO comeu ou bebeu isso?</label>
          <div className="flex flex-col gap-3">
            {role.participants.map(p => {
              const isExcluded = excludedIds.includes(p.id);
              return (
                <div 
                  key={p.id}
                  onClick={() => handleToggleExcluded(p.id)}
                  className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                    isExcluded ? 'border-red-500 bg-red-50/50' : 'border-neutral-200 bg-white hover:bg-neutral-50'
                  }`}
                >
                  <span className={`text-lg font-medium select-none ${isExcluded ? 'text-red-700' : 'text-neutral-800'}`}>
                    {p.name}
                  </span>
                  <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                    isExcluded ? 'border-red-500 bg-red-500 text-white' : 'border-neutral-300'
                  }`}>
                    {isExcluded && <Check size={16} strokeWidth={3} />}
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-sm text-neutral-500 mt-2 px-1">
            Selecione as pessoas que não participaram. O valor será dividido apenas entre o restante.
          </p>
        </div>
      </div>

      <div className="mt-6 shrink-0 pb-4">
        <button 
          onClick={handleSave}
          disabled={!title.trim() || !amountStr.trim() || excludedIds.length === role.participants.length}
          className="w-full flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-400 disabled:opacity-50 text-neutral-1100 font-bold py-4 px-6 rounded-2xl transition-colors"
        >
          Salvar gasto
        </button>
      </div>
    </div>
  );
}
