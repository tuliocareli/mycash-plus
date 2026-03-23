
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
                isCollapsed ? 'justify-center w-full' : 'w-full gap-3 px-2'
            )}>
                 <img src="/purso-icon.svg?v=2" alt="Icon" className="size-10 shrink-0" />
                 {!isCollapsed && (
                     <img src="/purso-text.svg?v=2" alt="Purso" className="h-6 w-auto" />
                 )}
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
