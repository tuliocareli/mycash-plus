import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import clsx from 'clsx';
import { Sidebar } from './Sidebar';
import { HeaderMobile } from './HeaderMobile';

export function Layout() {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const toggleSidebar = () => setIsSidebarCollapsed(prev => !prev);

    return (
        <div className="min-h-screen bg-neutral-200 flex flex-col lg:flex-row relative">
            {/* Desktop Sidebar (Hidden on Mobile < lg) */}
            <Sidebar
                isCollapsed={isSidebarCollapsed}
                toggleSidebar={toggleSidebar}
            />

            {/* Mobile Header (Hidden on Desktop >= lg) */}
            <HeaderMobile />

            {/* Main Content Wrapper */}
            <main
                className={clsx(
                    "flex-1 w-full transition-all duration-300 ease-in-out",
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
