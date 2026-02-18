import { useState } from 'react';
import clsx from 'clsx';
import { User, Menu } from 'lucide-react';
import { MenuDropdown } from './MenuDropdown';
import { useAuth } from '../../../contexts/AuthContext';

export function HeaderMobile() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const { user } = useAuth();


    return (
        <>
            <header
                className={clsx(
                    "fixed top-0 left-0 w-full h-[72px] z-30 transition-all duration-300 px-6 flex items-center justify-between border-b border-neutral-200 bg-white"
                )}
            >
                {/* Left: Menu Toggle + Logo */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsMenuOpen(true)}
                        className="p-2 -ml-2 text-neutral-500 hover:text-neutral-1100 active:bg-neutral-100 rounded-lg transition-colors"
                        aria-label="Menu"
                    >
                        <Menu size={24} />
                    </button>

                    <div className="flex items-center gap-2">
                        {/* SVG Logo Gráfico simplificado */}
                        <div className="relative shrink-0 flex items-center justify-center">
                            <svg width="28" height="28" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-neutral-1100">
                                <path d="M10 20C10 14.4772 14.4772 10 20 10H30V20H10Z" fill="black" />
                                <path d="M30 20C30 25.5228 25.5228 30 20 30H10V20H30Z" fill="black" />
                                <path d="M12 22L18 22" stroke="white" strokeWidth="3" strokeLinecap="round" />
                                <path d="M22 18L28 18" stroke="white" strokeWidth="3" strokeLinecap="round" />
                            </svg>
                        </div>
                        <span className="font-extrabold text-xl tracking-tight text-neutral-1100 leading-none">
                            Mycash+
                        </span>
                    </div>
                </div>

                {/* Right: Avatar Trigger */}
                <button
                    onClick={() => setIsMenuOpen(true)}
                    className="relative size-10 rounded-full bg-neutral-200 overflow-hidden border border-neutral-100 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
                    aria-label="Perfil"
                >
                    {user?.user_metadata?.avatar_url || user?.email ? (
                        <img
                            src={user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${user?.user_metadata?.full_name || user?.email || 'U'}&background=DFFE35&color=080B12`}
                            alt={user?.user_metadata?.full_name || 'User'}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <User size={20} className="text-neutral-500" />
                    )}
                </button>
            </header>

            {/* Menu Drawer Component */}
            <MenuDropdown
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
                user={{
                    name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuário',
                    email: user?.email || '',
                    avatarUrl: user?.user_metadata?.avatar_url || null
                }}
            />
        </>
    );
}
