import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { SummaryCards } from '../../components/dashboard/SummaryCards';
import { CategoryCarousel } from '../../components/dashboard/CategoryCarousel';
import { FinancialFlowChart } from '../../components/dashboard/FinancialFlowChart';

export default function Dashboard() {
    return (
        <div className="w-full flex flex-col gap-8">
            <DashboardHeader />
            <CategoryCarousel />
            <SummaryCards />
            <FinancialFlowChart />
            {/* Future Widgets Here */}
        </div>
    );
}
