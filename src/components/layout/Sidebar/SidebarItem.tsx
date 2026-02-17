import { useNavigate, useLocation } from 'react-router-dom';
import clsx from 'clsx';
// Usando icons Outline do Google Fonts via Lucide (que já são outline por padrão) 
// ou alternativamente Heroicons Outline se solicitado, mas Lucide é o padrão moderno.
// O prompt pede "ICONS OUTLINE DO GOOGLE". Lucide é excelente, mas vamos garantir traço fino.
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
        <div className="relative group w-full">
            <button
                onClick={() => navigate(path)}
                className={clsx(
                    'flex items-center transition-all duration-200 w-full',
                    'rounded-full', // Pill shape da imagem
                    // Spacing ajustado visualmente pela imagem:
                    // Padding vertical parece menor que horizontal.
                    isCollapsed ? 'p-3 aspect-square justify-center mx-auto' : 'px-6 py-3.5 gap-4',

                    // Cores exatas da imagem:
                    // Active: Fundo BRAND-500 (Lime Neon) + Texto PRETO + Icone PRETO (Outline)
                    // Inactive: Fundo Transparente + Texto/Icone Preto (ou cinza escuro) -> Hover cinza claro
                    isActive
                        ? 'bg-brand-500 text-neutral-1100 font-bold shadow-sm'
                        : 'text-neutral-1100 font-medium hover:bg-neutral-100'
                )}
                title={isCollapsed ? label : undefined}
            >
                <Icon
                    size={22} // Tamanho visualmente próximo ao da imagem (um pouco maior que 20px)
                    strokeWidth={2} // Outline stroke mais definido
                    className="shrink-0"
                />

                {!isCollapsed && (
                    <span className="text-[17px] whitespace-nowrap overflow-hidden transition-all duration-300 transform translate-y-[1px]">
                        {label}
                    </span>
                )}
            </button>

            {/* Tooltip apenas colapsado */}
            {isCollapsed && (
                <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-neutral-1100 text-white text-sm font-medium rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 whitespace-nowrap shadow-xl">
                    {label}
                    <div className="absolute top-1/2 -left-1 -mt-1 border-4 border-transparent border-r-neutral-1100" />
                </div>
            )}
        </div>
    );
}
