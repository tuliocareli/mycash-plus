import { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';
import clsx from 'clsx';
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    isWithinInterval,
    startOfWeek,
    endOfWeek,
    startOfYear,
    endOfYear
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useFinance } from '../../contexts/FinanceContext';
import { DateRange } from '../../types';

type ShortcutType = 'thisMonth' | 'lastMonth' | 'last3Months' | 'thisYear';

export function DateSelector() {
    const { dateRange, setDateRange } = useFinance();
    const [isOpen, setIsOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    // Selection State
    const [tempRange, setTempRange] = useState<DateRange>(dateRange);
    const [selectingMode, setSelectingMode] = useState<'start' | 'end'>('start');

    const popoverRef = useRef<HTMLDivElement>(null);

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    // Reset temp range when valid range updates or modal opens
    useEffect(() => {
        if (isOpen) {
            setTempRange(dateRange);
            setCurrentMonth(dateRange.startDate);
            setSelectingMode('start');
        }
    }, [isOpen, dateRange]);


    const handleDayClick = (day: Date) => {
        if (selectingMode === 'start') {
            setTempRange({ startDate: day, endDate: day }); // Temporary until end is picked
            setSelectingMode('end');
        } else {
            // If clicking before start date, reset start
            if (day < tempRange.startDate) {
                setTempRange({ startDate: day, endDate: day });
                setSelectingMode('end');
            } else {
                // Confirm Range
                const newRange = { startDate: tempRange.startDate, endDate: day };
                setDateRange(newRange);
                setIsOpen(false);
            }
        }
    };

    const handleShortcut = (shortcut: ShortcutType) => {
        const now = new Date();
        let newRange: DateRange;

        switch (shortcut) {
            case 'thisMonth':
                newRange = { startDate: startOfMonth(now), endDate: endOfMonth(now) };
                break;
            case 'lastMonth': {
                const last = subMonths(now, 1);
                newRange = { startDate: startOfMonth(last), endDate: endOfMonth(last) };
                break;
            }
            case 'last3Months':
                newRange = { startDate: subMonths(now, 3), endDate: now }; // A bit loose, usually start of 3 months ago to now
                break;
            case 'thisYear':
                newRange = { startDate: startOfYear(now), endDate: endOfYear(now) };
                break;
        }
        setDateRange(newRange);
        setIsOpen(false);
    };

    const renderMonth = (month: Date) => {
        const monthStart = startOfMonth(month);
        const monthEnd = endOfMonth(month);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);

        const days = eachDayOfInterval({ start: startDate, end: endDate });

        return (
            <div className="w-full lg:w-[280px] p-2">
                <div className="flex items-center justify-between mb-4 px-2">
                    <span className="text-base font-semibold text-neutral-1100 capitalize">
                        {format(month, 'MMMM yyyy', { locale: ptBR })}
                    </span>
                    {/* Navigation handled by parent container */}
                </div>

                {/* Weekdays */}
                <div className="grid grid-cols-7 mb-2 text-center">
                    {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
                        <span key={i} className="text-xs font-medium text-neutral-400">{d}</span>
                    ))}
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-y-1">
                    {days.map((day) => {
                        const isSelectedStart = isSameDay(day, tempRange.startDate);
                        const isSelectedEnd = isSameDay(day, tempRange.endDate);
                        const isInRange = isWithinInterval(day, { start: tempRange.startDate, end: tempRange.endDate });
                        const isCurrentMonth = isSameMonth(day, month);

                        return (
                            <button
                                key={day.toISOString()}
                                onClick={() => handleDayClick(day)}
                                className={clsx(
                                    "h-9 w-full flex items-center justify-center text-sm relative group transition-colors rounded-full",
                                    !isCurrentMonth && "text-neutral-300 opacity-50",
                                    isCurrentMonth && !isInRange && "text-neutral-700 hover:bg-neutral-100",
                                    (isSelectedStart || isSelectedEnd) && "bg-neutral-1100 text-white font-bold z-10 shadow-md",
                                    isInRange && !isSelectedStart && !isSelectedEnd && "bg-neutral-100 text-neutral-1100 rounded-none first:rounded-l-full last:rounded-r-full"
                                )}
                            >
                                {format(day, 'd')}
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="relative" ref={popoverRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={clsx(
                    "h-11 pl-6 pr-4 bg-white rounded-full flex items-center gap-3 shadow-sm border border-transparent hover:bg-neutral-50 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 min-w-[240px]",
                    isOpen && "bg-neutral-100 ring-2 ring-brand-500/20"
                )}
            >
                <CalendarIcon className="h-5 w-5 text-neutral-1100" strokeWidth={1.5} />
                <span className="text-sm font-medium text-neutral-1100">
                    {format(dateRange.startDate, "dd MMM", { locale: ptBR })} - {format(dateRange.endDate, "dd MMM yyyy", { locale: ptBR })}
                </span>
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 bg-neutral-1100/20 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsOpen(false)} />

                    <div className={clsx(
                        "absolute left-0 z-50 bg-white border border-neutral-200 shadow-xl rounded-2xl p-6 flex flex-col gap-5 animate-fade-in origin-top-left",
                        "top-full mt-2 w-[calc(100vw-32px)] lg:w-auto"
                    )}>
                        {/* Header Mobile */}
                        <div className="flex items-center justify-between pb-4 border-b border-neutral-200 lg:hidden">
                            <span className="font-semibold text-lg">Selecionar Data</span>
                            <button onClick={() => setIsOpen(false)}><X className="text-neutral-500" /></button>
                        </div>

                        {/* Quick Filters */}
                        <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
                            {[
                                { label: 'Este mês', value: 'thisMonth' },
                                { label: 'Mês passado', value: 'lastMonth' },
                                { label: 'Últimos 3 meses', value: 'last3Months' },
                                { label: 'Este ano', value: 'thisYear' },
                            ].map((btn) => (
                                <button
                                    key={btn.label}
                                    onClick={() => handleShortcut(btn.value as ShortcutType)}
                                    className="px-3 py-1.5 rounded-full bg-neutral-100 text-xs font-semibold text-neutral-600 hover:bg-neutral-200 transition-colors whitespace-nowrap"
                                >
                                    {btn.label}
                                </button>
                            ))}
                        </div>

                        {/* Dual Calendar View (Desktop) / Single (Mobile) */}
                        <div className="flex flex-col lg:flex-row gap-8 items-start relative">
                            {/* Navigation Controls */}
                            <div className="absolute top-1 right-2 flex gap-2 z-10">
                                <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-1 hover:bg-neutral-100 rounded-full">
                                    <ChevronLeft className="h-5 w-5 text-neutral-500" />
                                </button>
                                <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-1 hover:bg-neutral-100 rounded-full">
                                    <ChevronRight className="h-5 w-5 text-neutral-500" />
                                </button>
                            </div>

                            {renderMonth(currentMonth)}
                            <div className="hidden lg:block border-l border-neutral-200 pl-8">
                                {renderMonth(addMonths(currentMonth, 1))}
                            </div>
                            {/* Show 2nd month on mobile too vertically? Maybe just 1 is enough for space. Let's keep 1 on mobile for simplicity as requested 'show one month at a time' */}
                        </div>

                        <button
                            onClick={() => setIsOpen(false)}
                            className="w-full py-3 bg-neutral-1100 text-white font-bold rounded-xl mt-2 hover:bg-black transition-colors lg:hidden"
                        >
                            Confirmar
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
