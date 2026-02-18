
import {
    Home,        // Icone Home outline
    CreditCard,  // Icone Cartão outline
    ArrowLeftRight, // Icone Transações (setas)
    Target,      // Icone Objetivos
    User,        // Icone Perfil
    ChevronLeft,
    ChevronRight,
    LayoutGrid
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
                'flex flex-col h-screen bg-white border-r border-neutral-200 fixed left-0 top-0 z-40 transition-all duration-300 ease-in-out',
                // Larguras ajustadas para bater com o layout espaçoso da imagem
                isCollapsed ? 'w-[88px] items-center px-4 py-8' : 'w-[280px] items-start px-6 py-8'
            )}
        >
            {/* 
         LOGO SECTION 
         Conforme imagem: Logo "Mycash+" no topo esquerdo.
         Ícone gráfico abstrato + Texto Bold.
      */}
            <div className={clsx(
                'flex items-center mb-12 shrink-0 transition-all duration-300 min-h-[40px]',
                isCollapsed ? 'justify-center w-full pl-0' : 'w-full gap-3'
            )}>
                {/* Simulação do Logo Gráfico da Imagem (S seta dupla) */}
                <div className="relative shrink-0 flex items-center justify-center">
                    {/* Usando SVG inline para simular o logo da imagem com precisão */}
                    <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-neutral-1100">
                        <path d="M10 20C10 14.4772 14.4772 10 20 10H30V20H10Z" fill="black" />
                        <path d="M30 20C30 25.5228 25.5228 30 20 30H10V20H30Z" fill="black" />
                        {/* Abstração simplificada do logo Mycash+ */}
                        <path d="M12 22L18 22" stroke="white" strokeWidth="3" strokeLinecap="round" />
                        <path d="M22 18L28 18" stroke="white" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                </div>

                <div className={clsx(
                    'overflow-hidden whitespace-nowrap transition-all duration-300',
                    isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
                )}>
                    <span className="font-extrabold text-[22px] tracking-tight text-neutral-1100 leading-none">
                        Mycash+
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
                />
                <SidebarItem
                    icon={CreditCard}
                    label="Cartões"
                    path="/cards"
                    isCollapsed={isCollapsed}
                />
                {/* Adicionando outros itens implicitamente necessários ou removendo se a imagem só mostra 2?
            A imagem mostra "Home" e "Cartões". Vou manter os outros mas focando no estilo.
        */}
                <SidebarItem
                    icon={ArrowLeftRight}
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
                    icon={LayoutGrid}
                    label="Categorias"
                    path="/categories"
                    isCollapsed={isCollapsed}
                />
                <SidebarItem
                    icon={User}
                    label="Perfil"
                    path="/profile"
                    isCollapsed={isCollapsed}
                />
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
    );
}
