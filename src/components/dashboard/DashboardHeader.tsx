import { SearchInput } from './SearchInput';
import { FilterButton } from './FilterButton';
import { DateSelector } from './DateSelector';
import { FamilyMembersWidget } from './FamilyMembersWidget';
import { NewTransactionButton } from './NewTransactionButton';

export function DashboardHeader() {
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
                        <FilterButton />
                    </div>

                    <div className="h-px lg:h-8 w-full lg:w-px bg-neutral-200 lg:mx-2 hidden lg:block" /> {/** Divider Desktop only */}

                    <DateSelector />
                </div>

                {/* Right Section: Members & Action */}
                {/* Right Section: Members & Action */}
                <div className="flex flex-col lg:flex-row w-full lg:w-auto items-stretch lg:items-center gap-4 lg:gap-6 mt-2 lg:mt-0">
                    <FamilyMembersWidget />
                    <NewTransactionButton />
                </div>
            </div>
        </header>
    );
}
