import { Search } from 'lucide-react';
import { useFinance } from '../../contexts/FinanceContext';

export function SearchInput() {
    const { searchText, setSearchText } = useFinance();

    return (
        <div className="relative w-full lg:w-[320px] transition-all duration-300">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-neutral-400" strokeWidth={1.5} />
            </div>
            <input
                type="text"
                placeholder="Pesquisar"
                className="w-full pl-10 pr-4 py-3 bg-white border border-transparent rounded-full text-base lg:text-sm text-neutral-1100 placeholder-neutral-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 hover:bg-neutral-50 transition-colors"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
            />
        </div>
    );
}
