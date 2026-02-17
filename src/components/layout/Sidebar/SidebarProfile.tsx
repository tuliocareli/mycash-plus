import clsx from 'clsx';
import { User as UserIcon } from 'lucide-react';

interface SidebarProfileProps {
    isCollapsed: boolean;
}

export function SidebarProfile({ isCollapsed }: SidebarProfileProps) {
    const user = {
        name: "Lucas Marte",
        email: "lucasmarte@gmail.com",
        role: "Pai",
        avatarUrl: null
    };

    return (
        <div className={clsx(
            'flex items-center gap-3 transition-all duration-300',
            isCollapsed ? 'justify-center p-0' : 'w-full'
        )}>
            {/* Avatar Container */}
            <div className="relative shrink-0">
                <div className="size-10 rounded-full bg-neutral-200 border border-neutral-300 flex items-center justify-center overflow-hidden">
                    {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                        <UserIcon size={20} className="text-neutral-500" />
                    )}
                </div>
            </div>

            {/* Info (Hidden when collapsed) */}
            {!isCollapsed && (
                <div className="flex-1 min-w-0 flex flex-col items-start gap-1 transition-opacity duration-300">
                    <p className="text-base font-semibold text-neutral-1100 truncate leading-tight">
                        {user.name}
                    </p>
                    <p className="text-sm font-regular text-neutral-1100 truncate leading-tight tracking-wide opacity-80">
                        {user.email}
                    </p>
                </div>
            )}
        </div>
    );
}
