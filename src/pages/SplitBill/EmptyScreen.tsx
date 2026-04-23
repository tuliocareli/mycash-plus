import { Plus, ArrowLeft } from 'lucide-react';

interface EmptyScreenProps {
  onCreateNew: () => void;
  onBack: () => void;
}

export default function EmptyScreen({ onCreateNew, onBack }: EmptyScreenProps) {
  return (
    <div className="flex flex-col h-full bg-white md:rounded-3xl max-w-2xl w-full mx-auto md:mt-10 p-6 shadow-sm border border-neutral-100">
      
      <div className="flex items-center gap-4 mb-10">
        <button onClick={onBack} className="text-neutral-500 font-semibold text-sm hover:text-neutral-800 transition-colors">
          Voltar
        </button>
        <h2 className="text-xl font-bold text-neutral-1100">Calculadora de Rolê</h2>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="w-64 h-64 mb-6">
          <img src="/porquinho busca.svg" alt="Porquinho buscando" className="w-full h-full object-contain" />
        </div>
        <h3 className="text-2xl font-bold text-neutral-1100 mb-4">Nada pra dividir ainda</h3>
        <p className="text-lg text-neutral-600">
          Adicione um rolê clicando no botão abaixo para começar os cálculos.
        </p>
      </div>

      <div className="mt-10 space-y-3">
        <button 
          onClick={onCreateNew}
          className="w-full flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-400 text-neutral-1100 font-bold py-4 px-6 rounded-2xl transition-colors"
        >
          <Plus size={24} />
          Adicionar rolê
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
