
import { useState } from 'react';
import { useFinance } from '../../contexts/FinanceContext';
import { useAuth } from '../../contexts/AuthContext';
import {
    User as UserIcon,
    Mail,
    DollarSign,
    Edit2,
    LogOut,
    Plus,
    Moon,
    Globe,
    Calendar,
    Bell,
    Download,
    Trash2,
    Info,
    Smartphone,
    ArrowRight
} from 'lucide-react';
import clsx from 'clsx';
import { EditProfileModal } from '../../components/modals/EditProfileModal';
import { AddMemberModal } from '../../components/modals/AddMemberModal';

export default function Profile() {
    const [activeTab, setActiveTab] = useState<'info' | 'settings'>('info');
    const { familyMembers, categories } = useFinance();
    const { user, signOut: authSignOut } = useAuth();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);

    // Settings State
    const [currency, setCurrency] = useState('BRL');
    const [dateFormat, setDateFormat] = useState('DD/MM/AAAA');
    const [notifications, setNotifications] = useState({
        bills: true,
        limit: true,
        summary: false,
        goals: true
    });

    // The current user's profile is typically the one corresponding to user.id or the first one in familyMembers
    const mainMember = familyMembers[0];

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    const handleLogout = async () => {
        if (confirm('Deseja realmente sair?')) {
            await authSignOut();
        }
    };

    const incomeCategories = categories.filter(c => c.type === 'INCOME');
    const expenseCategories = categories.filter(c => c.type === 'EXPENSE');

    return (
        <div className="p-6 md:p-8 max-w-[1200px] mx-auto animate-fade-in space-y-8 min-h-full flex flex-col">

            {/* Header / Tabs */}
            <div className="flex items-center gap-8 border-b border-neutral-100 pb-px">
                <button
                    onClick={() => setActiveTab('info')}
                    className={clsx(
                        "pb-4 text-sm font-black uppercase tracking-widest transition-all relative",
                        activeTab === 'info' ? "text-neutral-1100" : "text-neutral-400 hover:text-neutral-600"
                    )}
                >
                    Informações
                    {activeTab === 'info' && <div className="absolute bottom-0 left-0 w-full h-1 bg-brand-500 rounded-full" />}
                </button>
                <button
                    onClick={() => setActiveTab('settings')}
                    className={clsx(
                        "pb-4 text-sm font-black uppercase tracking-widest transition-all relative",
                        activeTab === 'settings' ? "text-neutral-1100" : "text-neutral-400 hover:text-neutral-600"
                    )}
                >
                    Configurações
                    {activeTab === 'settings' && <div className="absolute bottom-0 left-0 w-full h-1 bg-brand-500 rounded-full" />}
                </button>
            </div>

            {activeTab === 'info' ? (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    {/* Main Profile Card */}
                    <div className="bg-white rounded-[2.5rem] p-8 lg:p-12 border border-neutral-100 shadow-sm flex flex-col md:flex-row items-center gap-8 lg:gap-12 text-center md:text-left">
                        <div className="relative group shrink-0">
                            <div className="size-32 lg:size-40 rounded-[2.5rem] bg-neutral-100 border-4 border-white shadow-xl overflow-hidden">
                                {mainMember?.avatarUrl ? (
                                    <img src={mainMember.avatarUrl} alt="Avatar" className="size-full object-cover" />
                                ) : (
                                    <div className="size-full flex items-center justify-center bg-brand-50 text-brand-500">
                                        <UserIcon size={64} />
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={() => mainMember && setIsEditModalOpen(true)}
                                className="absolute -bottom-2 -right-2 bg-neutral-1100 text-white p-3 rounded-2xl shadow-lg hover:scale-110 transition-transform"
                            >
                                <Edit2 size={16} />
                            </button>
                        </div>

                        <div className="flex-1 space-y-6 w-full">
                            <div>
                                <h2 className="text-3xl font-black text-neutral-1100">{mainMember?.name || 'Seu Nome'}</h2>
                                <p className="text-neutral-400 font-bold uppercase tracking-widest text-xs mt-1">{mainMember?.role || 'Administrador'}</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-8 pt-6 border-t border-neutral-50">
                                <div className="flex items-center gap-4 group">
                                    <div className="size-12 rounded-2xl bg-neutral-50 flex items-center justify-center text-neutral-400 group-hover:bg-brand-50 group-hover:text-brand-500 transition-colors">
                                        <Mail size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Email</p>
                                        <p className="font-bold text-neutral-1100">{user?.email || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 group">
                                    <div className="size-12 rounded-2xl bg-neutral-50 flex items-center justify-center text-neutral-400 group-hover:bg-green-50 group-hover:text-green-600 transition-colors">
                                        <DollarSign size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Renda Mensal</p>
                                        <p className="font-bold text-neutral-1100">{formatCurrency(mainMember?.monthlyIncome || 0)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="shrink-0">
                            <button
                                onClick={() => mainMember && setIsEditModalOpen(true)}
                                className="px-8 py-4 bg-neutral-50 hover:bg-neutral-100 text-neutral-1100 rounded-full font-black text-sm transition-all uppercase tracking-widest"
                            >
                                Editar Perfil
                            </button>
                        </div>
                    </div>

                    {/* Family Members Section */}
                    <div className="bg-white rounded-[2.5rem] p-8 border border-neutral-100 shadow-sm space-y-8">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-black text-neutral-1100">Membros da Família</h3>
                            <button
                                onClick={() => setIsAddMemberModalOpen(true)}
                                className="flex items-center gap-2 text-brand-600 font-black text-xs uppercase tracking-widest hover:underline"
                            >
                                <Plus size={16} />
                                Adicionar Membro
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {familyMembers.map((member) => (
                                <div key={member.id} className="group flex items-center justify-between p-4 rounded-3xl bg-neutral-50 hover:bg-neutral-100 transition-all cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className="size-12 rounded-2xl bg-white border border-neutral-200 overflow-hidden shadow-sm">
                                            {member.avatarUrl ? (
                                                <img src={member.avatarUrl} alt={member.name} className="size-full object-cover" />
                                            ) : (
                                                <div className="size-full flex items-center justify-center text-neutral-300">
                                                    <UserIcon size={20} />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-black text-neutral-1100">{member.name}</p>
                                            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{member.role}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-black text-neutral-1100">{formatCurrency(member.monthlyIncome)}</p>
                                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Mensal</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {familyMembers.length === 1 && (
                            <div className="text-center py-8">
                                <p className="text-neutral-500 font-bold mb-4">Você ainda não cadastrou outros membros da família.</p>
                                <button className="px-6 py-3 bg-neutral-1100 text-white rounded-full font-black text-xs uppercase tracking-widest shadow-lg active:scale-95">
                                    Convidar Família
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Logout */}
                    <div className="flex justify-end pt-4">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-8 py-4 bg-red-50 text-red-600 rounded-full font-black text-sm hover:bg-red-100 transition-all uppercase tracking-widest"
                        >
                            <LogOut size={20} />
                            Sair do MyCash+
                        </button>
                    </div>
                </div>
            ) : (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Display Preferences */}
                        <div className="bg-white rounded-[2rem] p-8 border border-neutral-100 shadow-sm space-y-6">
                            <h3 className="text-lg font-black text-neutral-1100 flex items-center gap-2">
                                <Smartphone size={20} className="text-brand-500" />
                                Preferências de Exibição
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-2xl">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white rounded-xl shadow-sm"><Moon size={18} className="text-neutral-400" /></div>
                                        <div>
                                            <p className="font-black text-neutral-1100 text-sm">Modo Escuro</p>
                                            <p className="text-[10px] font-bold text-neutral-400 uppercase">Personalize seu visual</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded uppercase font-black">Em breve</span>
                                        <div className="w-12 h-6 bg-neutral-200 rounded-full relative cursor-not-allowed">
                                            <div className="absolute top-1 left-1 size-4 bg-white rounded-full" />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-2xl">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white rounded-xl shadow-sm"><Globe size={18} className="text-neutral-400" /></div>
                                        <div>
                                            <p className="font-black text-neutral-1100 text-sm">Moeda Padrão</p>
                                        </div>
                                    </div>
                                    <select
                                        value={currency}
                                        onChange={(e) => setCurrency(e.target.value)}
                                        className="bg-transparent font-black text-xs text-brand-600 uppercase outline-none cursor-pointer"
                                    >
                                        <option value="BRL">Real (BRL)</option>
                                        <option value="USD">Dólar (USD)</option>
                                    </select>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-2xl">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white rounded-xl shadow-sm"><Calendar size={18} className="text-neutral-400" /></div>
                                        <div>
                                            <p className="font-black text-neutral-1100 text-sm">Formato de Data</p>
                                        </div>
                                    </div>
                                    <select
                                        value={dateFormat}
                                        onChange={(e) => setDateFormat(e.target.value)}
                                        className="bg-transparent font-black text-xs text-brand-600 uppercase outline-none cursor-pointer"
                                    >
                                        <option value="DD/MM/AAAA">DD/MM/AAAA</option>
                                        <option value="MM/DD/AAAA">MM/DD/AAAA</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Notifications */}
                        <div className="bg-white rounded-[2rem] p-8 border border-neutral-100 shadow-sm space-y-6">
                            <h3 className="text-lg font-black text-neutral-1100 flex items-center gap-2">
                                <Bell size={20} className="text-orange-500" />
                                Notificações
                            </h3>
                            <div className="space-y-4">
                                {[
                                    { id: 'bills', label: "Vencimento de contas", active: notifications.bills },
                                    { id: 'limit', label: "Limite de cartão atingido", active: notifications.limit },
                                    { id: 'summary', label: "Resumo semanal", active: notifications.summary },
                                    { id: 'goals', label: "Objetivos conquistados", active: notifications.goals }
                                ].map((n) => (
                                    <div key={n.id} className="flex items-center justify-between">
                                        <span className="text-sm font-bold text-neutral-600 uppercase tracking-wider">{n.label}</span>
                                        <button
                                            onClick={() => setNotifications(prev => ({ ...prev, [n.id]: !n.active }))}
                                            className={clsx(
                                                "w-11 h-6 rounded-full relative transition-all shadow-inner",
                                                n.active ? "bg-brand-500" : "bg-neutral-200"
                                            )}
                                        >
                                            <div className={clsx(
                                                "absolute top-1 size-4 bg-white rounded-full transition-all shadow-sm",
                                                n.active ? "right-1" : "left-1"
                                            )} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Manage Categories */}
                    <div className="bg-white rounded-[2rem] p-8 border border-neutral-100 shadow-sm space-y-8">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-black text-neutral-1100">Gerenciar Categorias</h3>
                            <button className="text-brand-600 font-black text-xs uppercase tracking-widest hover:underline flex items-center gap-2">
                                <Plus size={16} /> Nova Categoria
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] border-b border-neutral-50 pb-2">Receitas</h4>
                                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                                    {incomeCategories.map(cat => (
                                        <div key={cat.id} className="group flex items-center justify-between p-3 hover:bg-neutral-50 rounded-2xl transition-all">
                                            <div className="flex items-center gap-3">
                                                <div className="size-10 rounded-xl flex items-center justify-center text-lg bg-white border border-neutral-100 shadow-sm">
                                                    {cat.icon}
                                                </div>
                                                <span className="text-sm font-black text-neutral-1100">{cat.name}</span>
                                            </div>
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-2 text-neutral-400 hover:text-neutral-1100"><Edit2 size={14} /></button>
                                                <button className="p-2 text-neutral-400 hover:text-red-500"><Trash2 size={14} /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] border-b border-neutral-50 pb-2">Despesas</h4>
                                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                                    {expenseCategories.map(cat => (
                                        <div key={cat.id} className="group flex items-center justify-between p-3 hover:bg-neutral-50 rounded-2xl transition-all">
                                            <div className="flex items-center gap-3">
                                                <div className="size-10 rounded-xl flex items-center justify-center text-lg bg-white border border-neutral-100 shadow-sm">
                                                    {cat.icon}
                                                </div>
                                                <span className="text-sm font-black text-neutral-1100">{cat.name}</span>
                                            </div>
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-2 text-neutral-400 hover:text-neutral-1100"><Edit2 size={14} /></button>
                                                <button className="p-2 text-neutral-400 hover:text-red-500"><Trash2 size={14} /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Data and Privacy */}
                        <div className="bg-white border-2 border-dashed border-neutral-100 rounded-[2rem] p-8 space-y-6">
                            <h3 className="text-lg font-black text-neutral-1100">Dados e Privacidade</h3>
                            <div className="flex flex-col gap-3">
                                <button className="w-full flex items-center justify-between p-4 bg-neutral-1100 text-white rounded-2xl group active:scale-95 transition-all">
                                    <div className="flex items-center gap-3">
                                        <Download size={18} />
                                        <span className="text-xs font-black uppercase tracking-widest">Esportar Todos os Dados</span>
                                    </div>
                                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button className="w-full flex items-center gap-3 p-4 text-red-600 border border-red-100 rounded-2xl hover:bg-red-50 transition-all group">
                                    <Trash2 size={18} />
                                    <span className="text-xs font-black uppercase tracking-widest">Limpar Todos os Dados</span>
                                </button>
                                <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider text-center">Ações irreversíveis • Proceda com cautela</p>
                            </div>
                        </div>

                        {/* About */}
                        <div className="bg-neutral-1100 rounded-[2rem] p-8 text-white space-y-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <Info size={120} />
                            </div>
                            <h3 className="text-lg font-black flex items-center gap-2">
                                <Info size={20} />
                                Sobre o MyCash+
                            </h3>
                            <div className="space-y-4 relative z-10">
                                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                    <span className="text-xs font-bold uppercase tracking-widest text-white/60">Versão</span>
                                    <span className="text-sm font-black">v1.2.0</span>
                                </div>
                                <p className="text-xs font-bold leading-loose text-white/50 uppercase tracking-widest">
                                    Sistema de gestão financeira familiar focado em privacidade e colaboração.
                                </p>
                                <div className="flex gap-6 pt-4">
                                    <a href="#" className="text-[10px] font-black uppercase tracking-widest hover:text-brand-500 transition-colors">Termos de Uso</a>
                                    <a href="#" className="text-[10px] font-black uppercase tracking-widest hover:text-brand-500 transition-colors">Privacidade</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modals */}
            {mainMember && (
                <EditProfileModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    member={mainMember}
                />
            )}

            <AddMemberModal
                isOpen={isAddMemberModalOpen}
                onClose={() => setIsAddMemberModalOpen(false)}
            />
        </div>
    );
}
