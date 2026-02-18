import clsx from 'clsx';
import {
    Home,
    CreditCard,
    ArrowLeftRight,
    Target,
    User,
    LogOut,
    X
} from 'lucide-react';
import { MenuItem } from './MenuItem';

interface MenuDropdownProps {
    isOpen: boolean;
    onClose: () => void;
    user: {
        name: string;
        email: string;
        avatarUrl: string | null;
    };
}

export function MenuDropdown({ isOpen, onClose, user }: MenuDropdownProps) {
    if (!isOpen) return null;

    return (
        <>
            {/* Overlay Escuro */}
            <div
                className="fixed inset-0 bg-neutral-1100/50 z-40 animate-fade-in backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Dropdown Content */}
            <div
                className={clsx(
                    "fixed top-0 left-0 w-full bg-white z-50 shadow-xl flex flex-col transition-transform duration-300 ease-out origin-top",
                    isOpen ? "translate-y-0" : "-translate-y-full"
                )}
            >
                {/* Header do Menu */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-neutral-200 overflow-hidden border border-neutral-100 flex items-center justify-center">
                            {user.avatarUrl ? (
                                <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                                <User size={20} className="text-neutral-500" />
                            )}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-neutral-1100">{user.name}</span>
                            <span className="text-xs text-neutral-500">{user.email}</span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-neutral-500 hover:text-neutral-1100 hover:bg-neutral-100 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Lista de Navegação */}
                <nav className="flex flex-col p-4 gap-2 border-b border-neutral-200">
                    <MenuItem
                        icon={Home}
                        label="Home"
                        path="/"
                        onClick={onClose}
                    />
                    <MenuItem
                        icon={CreditCard}
                        label="Cartões"
                        path="/cards"
                        onClick={onClose}
                    />
                    <MenuItem
                        icon={ArrowLeftRight}
                        label="Transações"
                        path="/transactions"
                        onClick={onClose}
                    />
                    <MenuItem
                        icon={Target}
                        label="Objetivos"
                        path="/goals"
                        onClick={onClose}
                    />
                    <MenuItem
                        icon={User}
                        label="Perfil"
                        path="/profile"
                        onClick={onClose}
                    />
                </nav>

                {/* Footer / Logout */}
                <div className="p-4 bg-neutral-50">
                    <button
                        className="w-full flex items-center justify-center gap-2 p-3 text-red-600 font-medium hover:bg-white hover:shadow-sm rounded-lg transition-all border border-transparent hover:border-red-100"
                        onClick={() => {
                            // Lógica de logout futura
                            console.log('Logout Clicked');
                            onClose();
                        }}
                    >
                        <LogOut size={18} />
                        <span>Sair da conta</span>
                    </button>
                </div>
            </div>
        </>
    );
}
