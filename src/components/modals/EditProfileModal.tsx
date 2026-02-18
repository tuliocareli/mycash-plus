import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, User, Briefcase, DollarSign, Loader2, Camera } from 'lucide-react';
import { useFinance } from '../../contexts/FinanceContext';
import { useAuth } from '../../contexts/AuthContext';
import { FamilyMember } from '../../types';
import clsx from 'clsx';

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    member: FamilyMember;
}

export function EditProfileModal({ isOpen, onClose, member }: EditProfileModalProps) {
    const { updateFamilyMember, uploadImage } = useFinance();
    const { updateUser } = useAuth();
    const [name, setName] = useState(member.name);
    const [role, setRole] = useState(member.role);
    const [monthlyIncome, setMonthlyIncome] = useState(member.monthlyIncome.toString());
    const [avatarUrl, setAvatarUrl] = useState(member.avatarUrl || '');
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setName(member.name);
            setRole(member.role);
            setMonthlyIncome(member.monthlyIncome.toString());
            setAvatarUrl(member.avatarUrl || '');
            setErrors({});
        }
    }, [isOpen, member]);

    if (!isOpen) return null;

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const url = await uploadImage('avatars', file);
            if (url) {
                setAvatarUrl(url);
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Erro ao enviar imagem.');
        } finally {
            setUploading(false);
        }
    };

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!name.trim()) newErrors.name = 'O nome é obrigatório';
        if (!role.trim()) newErrors.role = 'O cargo/papel é obrigatório';
        if (isNaN(Number(monthlyIncome))) newErrors.monthlyIncome = 'Valor inválido';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setSaving(true);
        try {
            // 1. Update Family Member in Database
            await updateFamilyMember(member.id, {
                name,
                role,
                monthlyIncome: Number(monthlyIncome),
                avatarUrl: avatarUrl.trim() || undefined
            });

            // 2. Update Auth Metadata (Sync name and avatar)
            await updateUser({
                data: {
                    name,
                    avatar_url: avatarUrl.trim() || undefined
                }
            });

            onClose();
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Erro ao atualizar perfil. Tente novamente.');
        } finally {
            setSaving(false);
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-neutral-1100/40 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-[600px] bg-white rounded-[3rem] shadow-2xl border border-neutral-100 overflow-hidden animate-fade-in mx-auto flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="px-10 py-8 border-b border-neutral-50 flex items-center justify-between bg-white shrink-0">
                    <div>
                        <h2 className="text-2xl font-black text-neutral-1100">Editar Perfil</h2>
                        <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mt-1">Atualize suas informações</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="size-12 rounded-full bg-neutral-50 border border-neutral-100 flex items-center justify-center text-neutral-400 hover:text-neutral-1100 hover:bg-white hover:border-neutral-200 transition-all shadow-sm"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Form - Scrollable Area */}
                <div className="overflow-y-auto flex-1 p-10">
                    <form id="edit-profile-form" onSubmit={handleSubmit} className="space-y-8">
                        {/* Avatar Upload */}
                        <div className="flex flex-col items-center gap-6 mb-8">
                            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                <div className="size-32 rounded-[2.5rem] bg-neutral-100 border-4 border-white shadow-xl overflow-hidden flex items-center justify-center transition-all group-hover:shadow-2xl group-hover:scale-105">
                                    {avatarUrl ? (
                                        <img src={avatarUrl} alt="Preview" className="size-full object-cover" />
                                    ) : (
                                        <User size={48} className="text-neutral-300" />
                                    )}
                                    {uploading && (
                                        <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                                            <Loader2 className="animate-spin text-brand-600" size={32} />
                                        </div>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    className="absolute -bottom-2 -right-2 bg-neutral-1100 text-white p-3 rounded-2xl shadow-lg group-hover:scale-110 transition-transform"
                                    disabled={uploading}
                                >
                                    <Camera size={20} />
                                </button>
                            </div>
                            <p className="text-xs font-black text-neutral-400 uppercase tracking-widest">Toque para alterar a foto</p>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                className="hidden"
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-8">
                            {/* Name */}
                            <div className="space-y-3">
                                <label className="text-xs font-black text-neutral-500 uppercase tracking-widest ml-1">Nome Completo</label>
                                <div className={clsx(
                                    "relative flex items-center group transition-all",
                                    errors.name ? "ring-2 ring-red-500/20" : "focus-within:ring-4 focus-within:ring-neutral-100"
                                )}>
                                    <User className="absolute left-5 text-neutral-400 group-focus-within:text-neutral-1100 transition-colors" size={20} />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full h-16 pl-14 pr-6 bg-neutral-50 border-2 border-neutral-50 rounded-3xl outline-none focus:bg-white focus:border-neutral-200 font-bold text-lg text-neutral-1100 transition-all placeholder:text-neutral-300"
                                        placeholder="Seu nome"
                                    />
                                </div>
                                {errors.name && <p className="text-[10px] font-bold text-red-500 uppercase ml-1">{errors.name}</p>}
                            </div>

                            {/* Role & Income Row */}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-neutral-500 uppercase tracking-widest ml-1">Papel</label>
                                    <div className="relative flex items-center group">
                                        <Briefcase className="absolute left-5 text-neutral-400 group-focus-within:text-neutral-1100 transition-colors" size={20} />
                                        <input
                                            type="text"
                                            value={role}
                                            onChange={(e) => setRole(e.target.value)}
                                            className="w-full h-16 pl-14 pr-6 bg-neutral-50 border-2 border-neutral-50 rounded-3xl outline-none focus:bg-white focus:border-neutral-200 font-bold text-lg text-neutral-1100 transition-all placeholder:text-neutral-300"
                                            placeholder="Ex: Mãe"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-neutral-500 uppercase tracking-widest ml-1">Renda</label>
                                    <div className="relative flex items-center group">
                                        <DollarSign className="absolute left-5 text-neutral-400 group-focus-within:text-neutral-1100 transition-colors" size={20} />
                                        <input
                                            type="number"
                                            value={monthlyIncome}
                                            onChange={(e) => setMonthlyIncome(e.target.value)}
                                            className="w-full h-16 pl-14 pr-6 bg-neutral-50 border-2 border-neutral-50 rounded-3xl outline-none focus:bg-white focus:border-neutral-200 font-bold text-lg text-neutral-1100 transition-all placeholder:text-neutral-300"
                                            placeholder="3000"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Footer Actions */}
                <div className="p-8 border-t border-neutral-50 bg-neutral-50/30 flex flex-col sm:flex-row gap-4 shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 h-16 bg-white border-2 border-neutral-100 text-neutral-500 rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-neutral-50 hover:border-neutral-200 hover:text-neutral-800 active:scale-95 transition-all"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        form="edit-profile-form"
                        disabled={saving}
                        className="flex-[1.5] h-16 bg-neutral-1100 text-white rounded-3xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-neutral-1100/20 hover:bg-neutral-900 hover:shadow-neutral-1100/30 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? <Loader2 className="animate-spin" size={24} /> : 'Salvar Alterações'}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
