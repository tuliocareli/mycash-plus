import { 
    startOfMonth, 
    endOfMonth, 
    subMonths, 
    isBefore, 
    startOfDay, 
    endOfDay 
} from 'date-fns';

/**
 * Calculates the financial cycle range based on a closing day.
 * If closingDay is 1, it returns the standard calendar month.
 * If closingDay is 15, and today is March 20, the cycle is March 15 to April 14.
 * If today is March 10, the cycle is Feb 15 to March 14.
 */
export const getFinancialCycleRange = (date: Date, closingDay: number = 1) => {
    if (closingDay === 1) {
        return {
            startDate: startOfMonth(date),
            endDate: endOfMonth(date)
        };
    }

    const currentYear = date.getFullYear();
    const currentMonth = date.getMonth();
    
    // Potential start date in the current month
    let startDate = startOfDay(new Date(currentYear, currentMonth, closingDay));
    
    // If today is before the closing day, the cycle started in the previous month
    if (isBefore(date, startDate)) {
        startDate = subMonths(startDate, 1);
    }
    
    // The cycle should be 1 month long
    const cycleEnd = endOfDay(new Date(startDate.getFullYear(), startDate.getMonth() + 1, closingDay - 1));

    return {
        startDate,
        endDate: cycleEnd
    };
};

/**
 * Gets the period string (YYYY-MM) for a given date and closing day.
 * For a cycle starting in March, the period is '2026-03'.
 */
export const getCyclePeriod = (date: Date, closingDay: number = 1) => {
    const { startDate } = getFinancialCycleRange(date, closingDay);
    const year = startDate.getFullYear();
    const month = String(startDate.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
};
