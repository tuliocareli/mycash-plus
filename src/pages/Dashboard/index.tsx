import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { SummaryCards } from '../../components/dashboard/SummaryCards';

import { CategoryCarousel } from '../../components/dashboard/CategoryCarousel';

export default function Dashboard() {
    return (
        <div className="w-full">
            <DashboardHeader />
            <CategoryCarousel />
            <SummaryCards />
            {/* Future Widgets Here */}
        </div>
    );
}
