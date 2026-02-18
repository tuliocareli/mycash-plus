import { Plus } from 'lucide-react';
// import { useFinance } from '../../contexts/FinanceContext';

export function NewTransactionButton({ onClick }: { onClick?: () => void }) {
    // const { addTransaction } = useFinance(); // Removed unused variable

    return (
        <button
            className="bg-neutral-1100 hover:bg-neutral-900 text-white font-bold h-11 px-5 rounded-full flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all w-full lg:w-auto justify-center"
            onClick={onClick}
        >
            <Plus size={20} strokeWidth={2.5} />
            <span className="text-sm lg:text-base">Nova transação</span>
        </button>
    );
}
