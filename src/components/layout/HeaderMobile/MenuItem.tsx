import { useNavigate, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { LucideIcon } from 'lucide-react';

interface MenuItemProps {
    icon: LucideIcon;
    label: string;
    path: string;
    onClick: () => void;
}

export function MenuItem({ icon: Icon, label, path, onClick }: MenuItemProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const isActive = location.pathname === path;

    const handleClick = () => {
        navigate(path);
        onClick();
    };

    return (
        <button
            onClick={handleClick}
            className={clsx(
                'w-full flex items-center justify-start px-6 py-3 gap-3 rounded-lg transition-colors',
                isActive
                    ? 'bg-neutral-1100 text-white font-medium shadow-sm'
                    : 'bg-transparent text-neutral-600 font-medium hover:bg-neutral-100'
            )}
        >
            <Icon
                size={20}
                className={clsx(
                    'shrink-0',
                    isActive ? 'text-brand-500' : 'text-current'
                )}
            />
            <span className="text-sm font-sans truncate">{label}</span>
        </button>
    );
}
