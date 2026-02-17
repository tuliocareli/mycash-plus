import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export function Layout() {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const toggleSidebar = () => setIsSidebarCollapsed(prev => !prev);

    return (
        <div className="min-h-screen bg-neutral-200 flex flex-col lg:flex-row relative">
            {/* Desktop Sidebar */}
            <Sidebar
                isCollapsed={isSidebarCollapsed}
                toggleSidebar={toggleSidebar}
            />

            {/* Main Content Wrapper */}
            <main
                className={`
          flex-1 w-full min-h-screen transition-all duration-300 ease-in-out
          lg:ml-${isSidebarCollapsed ? '24' : '80'} 
          /* Mobile: Sem margin (sidebar hidden) */
          ml-0
        `}
            >
                <div className="container mx-auto px-4 py-8 lg:px-8 max-w-[1920px]">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
