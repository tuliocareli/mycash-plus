import { useState } from 'react';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { SummaryCards } from '../../components/dashboard/SummaryCards';
import { CategoryCarousel } from '../../components/dashboard/CategoryCarousel';
import { FinancialFlowChart } from '../../components/dashboard/FinancialFlowChart';
import { CreditCardsWidget } from '../../components/dashboard/CreditCardsWidget';
import { UpcomingExpensesWidget } from '../../components/dashboard/UpcomingExpensesWidget';
import { TransactionsTable } from '../../components/dashboard/TransactionsTable';

import { NewTransactionModal } from '../../components/modals/NewTransactionModal';
import { AddMemberModal } from '../../components/modals/AddMemberModal';
import { AddAccountModal } from '../../components/modals/AddAccountModal';
import { CardDetailsModal } from '../../components/modals/CardDetailsModal';
import { FiltersMobileModal } from '../../components/modals/FiltersMobileModal';
import { CreditCard } from '../../types';

export default function Dashboard() {
    // Modals State
    const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
    const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
    const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
    const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);

    // Card Details logic
    const [selectedCard, setSelectedCard] = useState<CreditCard | null>(null);
    const [isCardDetailsModalOpen, setIsCardDetailsModalOpen] = useState(false);

    const handleOpenCardDetails = (card: CreditCard) => {
        setSelectedCard(card);
        setIsCardDetailsModalOpen(true);
    };

    return (
        <div className="w-full flex flex-col gap-8 pb-20 animate-fade-in">
            {/* Header Component */}
            <DashboardHeader
                onOpenTransaction={() => setIsTransactionModalOpen(true)}
                onOpenAddMember={() => setIsMemberModalOpen(true)}
                onOpenFilters={() => setIsFiltersModalOpen(true)}
            />

            {/* Row 1: Categories */}
            <CategoryCarousel />

            {/* Row 2: Summary Cards */}
            <SummaryCards />

            {/* Row 3: Flow & Credit Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full items-stretch">
                <div className="lg:col-span-2 h-full">
                    <FinancialFlowChart />
                </div>
                <div className="lg:col-span-1 h-full">
                    <CreditCardsWidget
                        onOpenAddCard={() => setIsAccountModalOpen(true)}
                        onOpenCardDetails={handleOpenCardDetails}
                    />
                </div>
            </div>

            {/* Row 4: Transactions & Upcoming */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full items-stretch">
                <div className="lg:col-span-2 h-full">
                    <TransactionsTable />
                </div>
                <div className="lg:col-span-1 h-full">
                    <UpcomingExpensesWidget />
                </div>
            </div>

            {/* --- Modals --- */}

            <NewTransactionModal
                isOpen={isTransactionModalOpen}
                onClose={() => setIsTransactionModalOpen(false)}
            />

            <AddMemberModal
                isOpen={isMemberModalOpen}
                onClose={() => setIsMemberModalOpen(false)}
            />

            <AddAccountModal
                isOpen={isAccountModalOpen}
                onClose={() => setIsAccountModalOpen(false)}
            />

            <FiltersMobileModal
                isOpen={isFiltersModalOpen}
                onClose={() => setIsFiltersModalOpen(false)}
            />

            {selectedCard && (
                <CardDetailsModal
                    isOpen={isCardDetailsModalOpen}
                    onClose={() => setIsCardDetailsModalOpen(false)}
                    card={selectedCard}
                />
            )}

        </div>
    );
}
