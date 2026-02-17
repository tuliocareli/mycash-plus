import clsx from 'clsx';
import { User as UserIcon } from 'lucide-react';

interface SidebarProfileProps {
    isCollapsed: boolean;
}

export function SidebarProfile({ isCollapsed }: SidebarProfileProps) {
    const user = {
        name: "Lucas Marte",
        email: "lucasmarte@gmail.com",
        avatarUrl: "https://i.pravatar.cc/150?u=lucasmarte" // Placeholder realista para simular a foto
    };

    return (
        <div className={clsx(
            'flex items-center gap-3 w-full transition-all duration-300',
            isCollapsed ? 'justify-center px-0' : 'px-2' // Pequeno padding lateral no modo expandido
        )}>
            {/* Avatar - Imagem circular */}
            <div className="relative shrink-0">
                <div className="size-10 rounded-full bg-neutral-200 overflow-hidden border border-neutral-100">
                    {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-brand-500 text-neutral-1100">
                            <UserIcon size={20} />
                        </div>
                    )}
                </div>
            </div>

            {/* Info Text */}
            {!isCollapsed && (
                <div className="flex-1 min-w-0 flex flex-col justify-center overflow-hidden">
                    <p className="text-[15px] font-bold text-neutral-1100 truncate leading-snug">
                        {user.name}
                    </p>
                    <p className="text-[13px] text-neutral-600 truncate leading-snug font-normal">
                        {user.email}
                    </p>
                </div>
            )}
        </div>
    );
}
