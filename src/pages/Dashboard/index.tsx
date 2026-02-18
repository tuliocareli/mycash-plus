import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { SummaryCards } from '../../components/dashboard/SummaryCards';
import { CategoryCarousel } from '../../components/dashboard/CategoryCarousel';
import { FinancialFlowChart } from '../../components/dashboard/FinancialFlowChart';
import { CreditCardsWidget } from '../../components/dashboard/CreditCardsWidget';
import { UpcomingExpensesWidget } from '../../components/dashboard/UpcomingExpensesWidget';

export default function Dashboard() {
    return (
        <div className="w-full flex flex-col gap-8">
            <DashboardHeader />
            <CategoryCarousel />
            <SummaryCards />

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2 flex flex-col gap-8">
                    <FinancialFlowChart />
                </div>
                <div className="xl:col-span-1 flex flex-col gap-8">
                    <CreditCardsWidget />
                    <UpcomingExpensesWidget />
                </div>
            </div>
            {/* Future Widgets Here */}
        </div>
    );
}
