import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import clsx from 'clsx';
import { Sidebar } from './Sidebar';
import { HeaderMobile } from './HeaderMobile';

import { useFinance } from '../../contexts/FinanceContext';
import { Loader2 } from 'lucide-react';

export function Layout() {
    const { loading } = useFinance();
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1280);

    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth >= 1280);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => setIsSidebarCollapsed(prev => !prev);

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-neutral-100">
                <Loader2 size={48} className="animate-spin text-neutral-400" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-200 flex flex-col lg:flex-row relative">
            {/* Desktop Sidebar (Render only on Desktop >= 1280px) */}
            {isDesktop && (
                <Sidebar
                    isCollapsed={isSidebarCollapsed}
                    toggleSidebar={toggleSidebar}
                />
            )}

            {/* Mobile Header (Render only on Mobile < 1280px) */}
            {!isDesktop && <HeaderMobile />}

            {/* Main Content Wrapper */}
            <main
                className={clsx(
                    "flex-1 w-full",
                    "lg:ml-[280px]",
                    isSidebarCollapsed && "lg:!ml-[88px]",
                    "ml-0"
                )}
            >
                <div className={clsx(
                    "container mx-auto px-4 py-8 lg:px-10 max-w-[1600px]",
                    "pt-[72px] lg:pt-8 pb-20 lg:pb-8"
                )}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
