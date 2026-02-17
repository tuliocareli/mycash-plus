import {
    LayoutDashboard,
    ArrowRightLeft,
    CreditCard,
    Target,
    User,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import clsx from 'clsx';
import { SidebarItem } from './SidebarItem';
import { SidebarProfile } from './SidebarProfile';

interface SidebarProps {
    isCollapsed: boolean;
    toggleSidebar: () => void;
}

export function Sidebar({ isCollapsed, toggleSidebar }: SidebarProps) {
    return (
        <aside
            className={clsx(
                'hidden lg:flex flex-col h-screen bg-white border-r border-neutral-200 fixed left-0 top-0 z-40 transition-all duration-300 ease-in-out',
                // Padding 32px (p-8) from Figma
                // Widths: Collapsed 80px (w-20), Expanded ~288px (w-72) to 320px
                isCollapsed ? 'w-24 p-4 items-center' : 'w-80 p-8 items-start'
            )}
            aria-label="Sidebar de Navegação"
        >
            {/* Toggle Button */}
            <button
                onClick={toggleSidebar}
                className="absolute -right-3 top-10 size-6 bg-white border border-neutral-200 rounded-full flex items-center justify-center text-neutral-500 hover:text-brand-700 hover:border-brand-500 transition-colors shadow-sm z-50 focus:outline-none"
                aria-label={isCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
            >
                {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>

            {/* Header / Logo */}
            <div className={clsx(
                'flex items-center h-14 shrink-0 transition-all duration-300',
                isCollapsed ? 'justify-center w-full mb-8' : 'gap-3 mb-14 w-full'
            )}>
                {/* Logo Icon - Vector similar to Figma */}
                <div className="h-8 w-8 bg-black rounded-lg flex items-center justify-center shrink-0">
                    {/* Abstract Logo Shape */}
                    <div className="w-4 h-4 border-2 border-brand-500 rounded-sm transform rotate-45"></div>
                </div>

                {/* Logo Text */}
                <div className={clsx(
                    'overflow-hidden transition-all duration-300',
                    isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
                )}>
                    <span className="font-bold text-2xl tracking-tighter text-neutral-1100">
                        Mycash<span className="text-brand-700">+</span>
                    </span>
                </div>
            </div>

            {/* Navigation Items */}
            <nav className={clsx(
                'flex-1 flex flex-col gap-2 w-full overflow-y-auto overflow-x-hidden',
                // Figma gap appears larger? No, gap-2 (8px) is correct from analysis.
            )}>
                <SidebarItem
                    icon={LayoutDashboard}
                    label="Home" // Figma uses "Home"
                    path="/"
                    isCollapsed={isCollapsed}
                />
                <SidebarItem
                    icon={CreditCard}
                    label="Cartões"
                    path="/cards"
                    isCollapsed={isCollapsed}
                />
                <SidebarItem
                    icon={ArrowRightLeft}
                    label="Transações"
                    path="/transactions"
                    isCollapsed={isCollapsed}
                />
                <SidebarItem
                    icon={Target}
                    label="Objetivos"
                    path="/goals"
                    isCollapsed={isCollapsed}
                />
                <SidebarItem
                    icon={User}
                    label="Perfil"
                    path="/profile"
                    isCollapsed={isCollapsed}
                />
            </nav>

            {/* Footer / Profile Section */}
            <div className="mt-auto w-full pt-6 border-t border-neutral-200/50">
                <SidebarProfile isCollapsed={isCollapsed} />
            </div>
        </aside>
    );
}
