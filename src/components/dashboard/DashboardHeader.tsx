import { SearchInput } from './SearchInput';
import { FilterButton } from './FilterButton';
import { DateSelector } from './DateSelector';
import { FamilyMembersWidget } from './FamilyMembersWidget';
import { NewTransactionButton } from './NewTransactionButton';
import { PulseHint } from '../onboarding/PulseHint';
import { useFinance } from '../../contexts/FinanceContext';

interface DashboardHeaderProps {
    onOpenTransaction?: () => void;
    onOpenFilters?: () => void;
    onOpenAddMember?: () => void;
}

export function DashboardHeader({ onOpenTransaction, onOpenFilters, onOpenAddMember }: DashboardHeaderProps) {
    const { transactions } = useFinance();
    const showHint = transactions.length === 0;

    return (
        <header className="flex flex-col gap-6 mb-8">
            {/* 
        Container Principal
        Mobile: Vertical Stack / Grid 
        Desktop: Horizontal Flex Row
      */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-8">

                {/* Left Section: Search & Date & Filters */}
                <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 lg:gap-4 flex-1">
                    <div className="flex gap-3 w-full lg:w-auto">
                        <SearchInput />
                        <FilterButton onOpenFilters={onOpenFilters} />
                    </div>

                    <div className="h-px lg:h-8 w-full lg:w-px bg-neutral-200 lg:mx-2 hidden lg:block" /> {/** Divider Desktop only */}

                    <div className="flex items-center gap-3">
                        <div className="flex-1">
                            <DateSelector />
                        </div>
                        <div className="lg:hidden shrink-0">
                            <FamilyMembersWidget onOpenAddMember={onOpenAddMember} />
                        </div>
                    </div>
                </div>

                {/* Right Section: Action */}
                <div className="flex flex-col lg:flex-row w-full lg:w-auto items-stretch lg:items-center gap-4 lg:gap-6 mt-2 lg:mt-0">
                    <div className="hidden lg:block">
                        <FamilyMembersWidget onOpenAddMember={onOpenAddMember} />
                    </div>
                    <PulseHint 
                        hint="Dica: Registre sua primeira transação aqui para começar a ver seus gráficos!"
                        visible={showHint}
                        position="bottom"
                    >
                        <NewTransactionButton onClick={onOpenTransaction} />
                    </PulseHint>
                </div>
            </div>
        </header>
    );
}
