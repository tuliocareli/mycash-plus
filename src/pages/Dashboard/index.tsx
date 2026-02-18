import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { SummaryCards } from '../../components/dashboard/SummaryCards';
import { CategoryCarousel } from '../../components/dashboard/CategoryCarousel';
import { FinancialFlowChart } from '../../components/dashboard/FinancialFlowChart';
import { CreditCardsWidget } from '../../components/dashboard/CreditCardsWidget';
import { UpcomingExpensesWidget } from '../../components/dashboard/UpcomingExpensesWidget';
import { TransactionsTable } from '../../components/dashboard/TransactionsTable';

export default function Dashboard() {
    return (
        <div className="w-full flex flex-col gap-8">
            <DashboardHeader />
            <CategoryCarousel />
            <SummaryCards />

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Row 1: Flow Chart + Credit Cards */}
                <div className="xl:col-span-2">
                    <FinancialFlowChart />
                </div>
                <div className="xl:col-span-1">
                    <CreditCardsWidget />
                </div>

                {/* Row 2: Transactions Table + Upcoming Expenses */}
                <div className="xl:col-span-2">
                    <TransactionsTable />
                </div>
                <div className="xl:col-span-1">
                    <UpcomingExpensesWidget />
                </div>
            </div>

            {/* Future Widgets Here */}
        </div>
    );
}
