import { useNavigate, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { LucideIcon } from 'lucide-react';

interface SidebarItemProps {
    icon: LucideIcon;
    label: string;
    path: string;
    isCollapsed: boolean;
}

export function SidebarItem({ icon: Icon, label, path, isCollapsed }: SidebarItemProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const isActive = location.pathname === path;

    return (
        <div className="relative group flex items-center justify-center w-full">
            <button
                onClick={() => navigate(path)}
                className={clsx(
                    'flex items-center transition-all duration-300',
                    // Shape: Rounded Full (Pill) from Figma
                    'rounded-full',
                    // Spacing: px-4 (16px) py-3 (12px) from Figma
                    isCollapsed ? 'p-3 aspect-square justify-center' : 'px-4 py-3 gap-3 w-full',
                    // Colors: Active = Brand 500 (Lime) + Text Neutral 1100 (Black)
                    isActive
                        ? 'bg-brand-500 text-neutral-1100 shadow-sm'
                        : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-1100'
                )}
                title={isCollapsed ? label : undefined}
            >
                <Icon
                    size={20} // Figma uses ~16-20px visual weight
                    className={clsx(
                        'flex-shrink-0 transition-colors',
                        // Icon color is reliable on text color inheritance
                        'text-current'
                    )}
                />

                {!isCollapsed && (
                    <span className="font-semibold text-lg whitespace-nowrap overflow-hidden transition-all duration-300 font-sans">
                        {label}
                    </span>
                )}
            </button>

            {/* Tooltip for Collapsed State */}
            {isCollapsed && (
                <div className="absolute left-full ml-4 px-3 py-1.5 bg-neutral-1100 text-neutral-0 text-sm font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 whitespace-nowrap shadow-lg">
                    {label}
                    {/* Arrow */}
                    <div className="absolute top-1/2 -left-1 -mt-1 border-4 border-transparent border-r-neutral-1100" />
                </div>
            )}
        </div>
    );
}
