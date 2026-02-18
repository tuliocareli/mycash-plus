import { useFinance } from '../../../contexts/FinanceContext';



function formatCurrency(value: number) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        maximumFractionDigits: 0 // No cents for clean look
    }).format(value);
}

// Donut Chart Component using pure SVG
function DonutChart({ percentage, color }: { percentage: number; color: string }) {
    const size = 64;
    const strokeWidth = 8;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            {/* Background Circle */}
            <svg width={size} height={size} className="transform -rotate-90">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="#F3F4F6" // Neutral 100 as track
                    strokeWidth={strokeWidth}
                    fill="transparent"
                />
                {/* Foreground Circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round" // Rounded ends for elegance
                />
            </svg>
            {/* Center Text */}
            <span className="absolute text-xs font-bold text-neutral-1100">
                {Math.round(percentage)}%
            </span>
        </div>
    );
}

export function CategoryCarousel() {
    const { expensesByCategory } = useFinance();

    if (expensesByCategory.length === 0) {
        return null;
    }

    return (
        <section className="mb-8">
            <h2 className="text-lg font-bold text-neutral-1100 mb-4 px-1">Gastos por Categoria</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 w-full pb-4">
                {expensesByCategory.slice(0, 6).map((cat) => (
                    <div
                        key={cat.category}
                        className="bg-white border border-neutral-200 rounded-3xl p-6 flex flex-col items-center justify-center gap-4 hover:shadow-md transition-shadow duration-300 w-full min-h-[160px]"
                    >
                        <DonutChart
                            percentage={cat.percentage}
                            color="#DFFE35"
                        />

                        <div className="text-center w-full">
                            <p className="text-xs text-neutral-500 font-medium truncate w-full" title={cat.category}>
                                {cat.category}
                            </p>
                            <p className="text-sm font-bold text-neutral-1100 mt-1">
                                {formatCurrency(cat.amount)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
