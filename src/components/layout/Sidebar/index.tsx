
import {
    Home,        // Icone Home outline
    CreditCard,  // Icone Cartão outline
    ArrowLeftRight, // Icone Transações (setas)
    Target,      // Icone Objetivos
    User,        // Icone Perfil
    ChevronLeft,
    ChevronRight,
    LayoutGrid,
    BarChart3,
    History,
    LifeBuoy
} from 'lucide-react';
import clsx from 'clsx';
import { SidebarItem } from './SidebarItem';
import { SidebarProfile } from './SidebarProfile';
import { useAuth } from '../../../contexts/AuthContext';
import { SupportModal } from '../../modals/SupportModal';
import { useState } from 'react';
import { useInteractionTracker } from '../../../hooks/useAnalytics';

interface SidebarProps {
    isCollapsed: boolean;
    toggleSidebar: () => void;
}

export function Sidebar({ isCollapsed, toggleSidebar }: SidebarProps) {
    const { user } = useAuth();
    const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
    const { trackClick: trackNavClick } = useInteractionTracker('sidebar_nav');
    const { trackClick: trackHelpClick } = useInteractionTracker('sidebar_help');
    
    const ADMIN_EMAILS = ['admin@teste.com', 'tctulio2009@gmail.com'];
    const isAdmin = !!user?.email && ADMIN_EMAILS.some(email => email.toLowerCase() === user.email?.toLowerCase());

    return (
        <>
        <aside
            className={clsx(
                'flex flex-col h-screen bg-white border-r border-neutral-200 fixed left-0 top-0 z-40 transition-all duration-300 ease-in-out',
                // Larguras ajustadas para bater com o layout espaçoso da imagem
                isCollapsed ? 'w-[88px] items-center px-4 py-8' : 'w-[280px] items-start px-6 py-8'
            )}
        >
            {/* 
         LOGO SECTION 
         Conforme imagem: Logo "Purso" no topo esquerdo.
         Ícone gráfico de porquinho minimalista + Texto Bold.
      */}
            <div className={clsx(
                'flex items-center mb-12 shrink-0 transition-all duration-300 min-h-[40px]',
                isCollapsed ? 'justify-center w-full pl-0' : 'w-full gap-3'
            )}>
                {/* Logo Gráfico: Porquinho Neo-Brutalist (mesma vibe do favicon) */}
                <div className="relative shrink-0 flex items-center justify-center">
                    <div className="size-10 bg-[#D4FF33] rounded-xl flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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

                <div className={clsx(
                    'overflow-hidden whitespace-nowrap transition-all duration-300',
                    isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
                )}>
                    <span className="font-['Bebas_Neue'] text-[28px] tracking-normal text-neutral-1100 leading-none pt-1">
                        Purso
                    </span>
                </div>
            </div>

            {/* 
         MENU ITEMS 
         "Os itens do menu sidebar ficam mais acima, junto com o logotipo"
         Gap menor entre items.
      */}
            <nav className="flex flex-col gap-2 w-full">
                <SidebarItem
                    icon={Home}
                    label="Home"
                    path="/"
                    isCollapsed={isCollapsed}
                    onClick={() => trackNavClick({ target: 'home' })}
                />
                <SidebarItem
                    icon={CreditCard}
                    label="Cartões"
                    path="/cards"
                    isCollapsed={isCollapsed}
                    onClick={() => trackNavClick({ target: 'cards' })}
                />
                {/* Adicionando outros itens implicitamente necessários ou removendo se a imagem só mostra 2?
            A imagem mostra "Home" e "Cartões". Vou manter os outros mas focando no estilo.
        */}
                <SidebarItem
                    icon={ArrowLeftRight}
                    label="Transações"
                    path="/transactions"
                    isCollapsed={isCollapsed}
                    onClick={() => trackNavClick({ target: 'transactions' })}
                />
                <SidebarItem
                    icon={Target}
                    label="Objetivos"
                    path="/goals"
                    isCollapsed={isCollapsed}
                    onClick={() => trackNavClick({ target: 'goals' })}
                />
                <SidebarItem
                    icon={LayoutGrid}
                    label="Categorias"
                    path="/categories"
                    isCollapsed={isCollapsed}
                    onClick={() => trackNavClick({ target: 'categories' })}
                />
                <SidebarItem
                    icon={History}
                    label="Histórico"
                    path="/history"
                    isCollapsed={isCollapsed}
                    onClick={() => trackNavClick({ target: 'history' })}
                />
                <SidebarItem
                    icon={User}
                    label="Perfil"
                    path="/profile"
                    isCollapsed={isCollapsed}
                    onClick={() => trackNavClick({ target: 'profile' })}
                />
                {isAdmin && (
                    <SidebarItem
                        icon={BarChart3}
                        label="Analytics"
                        path="/admin"
                        isCollapsed={isCollapsed}
                        onClick={() => trackNavClick({ target: 'admin' })}
                    />
                )}
                
                {/* Fixed Help Button */}
                <button
                    onClick={() => {
                        setIsSupportModalOpen(true);
                        trackHelpClick();
                    }}
                    className={clsx(
                        "flex items-center gap-3 w-full p-4 rounded-2xl transition-all duration-200 group mt-auto hover:bg-brand-50 hover:text-brand-700 text-neutral-500",
                        isCollapsed ? "justify-center" : "px-4"
                    )}
                >
                    <LifeBuoy size={20} className="group-hover:scale-110 transition-transform" />
                    {!isCollapsed && (
                        <span className="text-sm font-bold uppercase tracking-widest">Ajuda</span>
                    )}
                </button>
            </nav>

            {/* SPACER para empurrar perfil para baixo */}
            <div className="flex-1" />

            {/* 
         USER PROFILE 
         Fixado na parte inferior.
      */}
            <div className="w-full shrink-0 pt-4 pb-2">
                <SidebarProfile isCollapsed={isCollapsed} />
            </div>

            {/* 
         TOGGLE BUTTON 
         "Posição fixa ao lado superior direito"
         Absolute, fora do fluxo da sidebar (na borda).
      */}
            <button
                onClick={toggleSidebar}
                className={clsx(
                    "absolute -right-3 top-8 size-7 bg-white border border-neutral-200 rounded-full flex items-center justify-center text-neutral-600 hover:text-brand-700 hover:border-brand-500 transition-all shadow-sm z-50 focus:outline-none",
                )}
                title={isCollapsed ? "Expandir Menu" : "Recolher Menu"}
            >
                {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>

        </aside>

        <SupportModal 
            isOpen={isSupportModalOpen} 
            onClose={() => setIsSupportModalOpen(false)} 
        />
        </>
    );
}
