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
                         {/* Logo Gráfico: Porquinho Neo-Brutalist */}
                         <div className="relative shrink-0 flex items-center justify-center">
                            <div className="size-8 bg-[#D4FF33] rounded-lg flex items-center justify-center border-2 border-black shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] scale-90">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="10" fill="black" fillOpacity="0.05" />
                                    <path d="M19 5c-1.5 0-2.8 1.4-3 3.5" stroke="black" strokeWidth="2" strokeLinecap="round" />
                                    <path d="M7 11c0-2.5 2-4.5 4.5-4.5S16 8.5 16 11c0 2.2-1.3 4-3.5 4.5" stroke="black" strokeWidth="2" strokeLinecap="round" />
                                    <rect x="9" y="14" width="6" height="4" rx="2" stroke="black" strokeWidth="2" />
                                    <circle cx="11" cy="16" r="0.5" fill="black" />
                                    <circle cx="13" cy="16" r="0.5" fill="black" />
                                    <path d="M5 5c1.5 0 2.8 1.4 3 3.5" stroke="black" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </div>
                         </div>
                          <span className="font-['Bebas_Neue'] text-3xl tracking-normal text-neutral-1100 leading-none pt-1">
                              Purso
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
