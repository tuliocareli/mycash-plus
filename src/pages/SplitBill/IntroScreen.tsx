import { Calculator, ArrowRight } from 'lucide-react';

interface IntroScreenProps {
  onCheckRoles: () => void;
  onCreateNew: () => void;
}

export default function IntroScreen({ onCheckRoles, onCreateNew }: IntroScreenProps) {
  return (
    <div className="flex flex-col h-full bg-white md:rounded-3xl max-w-2xl mx-auto w-full md:mt-10 overflow-hidden shadow-sm border border-neutral-100">
      <div className="w-full h-64 bg-neutral-100 relative overflow-hidden">
        <img 
          src="/purso divisao contas.png" 
          alt="Dividir a conta" 
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      
      <div className="flex flex-col flex-1 p-6 z-10 bg-white -mt-4 rounded-t-[24px]">
        <h1 className="text-3xl font-bold text-neutral-1100 mb-4">
          Bora dividir a conta?
        </h1>
        <p className="text-lg text-neutral-600 mb-10">
          Use nossa Calculadora de rolê para dividir suas contas com seus amigos sem dor de cabeça.
        </p>

        <div className="mt-auto space-y-3">
          <button 
            onClick={onCreateNew}
            className="w-full flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-400 text-neutral-1100 font-bold py-4 px-6 rounded-2xl transition-colors"
          >
            <Calculator size={24} />
            Criar novo rolê
          </button>
          
          <button 
            onClick={onCheckRoles}
            className="w-full flex items-center justify-center gap-2 bg-white border-2 border-neutral-200 hover:bg-neutral-50 text-neutral-1100 font-bold py-4 px-6 rounded-2xl transition-colors"
          >
            Ver rolês anteriores
            <ArrowRight size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
