import { useState } from 'react';
import { Outlet } from 'react-router-dom';
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
                className={`
          flex-1 w-full min-h-screen transition-all duration-300 ease-in-out
          
          /* Desktop Margins: Sidebar width */
          lg:ml-[280px]
          ${isSidebarCollapsed ? 'lg:!ml-[88px]' : ''}
          
          /* Mobile Margins: Header height compensation */
          ml-0 mt-[72px] lg:mt-0
        `}
            >
                <div className="container mx-auto px-4 py-8 lg:px-10 max-w-[1600px]">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
