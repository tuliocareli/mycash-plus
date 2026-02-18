import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, User, Upload, Loader2 } from 'lucide-react';
import clsx from 'clsx';
import { useFinance } from '../../contexts/FinanceContext';
import { MemberRole } from '../../types';

interface AddMemberModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AddMemberModal({ isOpen, onClose }: AddMemberModalProps) {


    const { addFamilyMember, uploadImage } = useFinance();

    const [name, setName] = useState('');
    const [role, setRole] = useState<MemberRole | string>(''); // Allow free text but suggest roles
    const [avatarUrl, setAvatarUrl] = useState('');
    const [income, setIncome] = useState('');
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [avatarTab, setAvatarTab] = useState<'url' | 'upload'>('url');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);

    const suggestedRoles = ['Pai', 'Mãe', 'Filho', 'Filha', 'Avô', 'Avó', 'Tio', 'Tia'];

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!name || name.length < 3) newErrors.name = 'Por favor, insira um nome válido';
        if (!role) newErrors.role = 'Por favor, informe a função na família';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const url = await uploadImage('avatars', file);
            if (url) {
                setAvatarUrl(url);
                setAvatarTab('url');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        setSaving(true);
        try {
            await addFamilyMember({
                name,
                role: role as MemberRole,
                avatarUrl: avatarUrl || undefined,
                monthlyIncome: income ? Number(income) : 0,
            });

            // Reset
            setName('');
            setRole('');
            setAvatarUrl('');
            setIncome('');
            setErrors({});

            console.log("Membro adicionado!");
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-neutral-1100/40 backdrop-blur-sm animate-fade-in p-4 overflow-y-auto pt-10 md:pt-24">
            <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-scale-in my-auto">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-neutral-100">
                    <h2 className="text-xl font-bold text-neutral-1100">Novo familiar</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-neutral-50 text-neutral-500 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8 flex flex-col gap-6">
                    <p className="text-sm text-neutral-500">Adicione alguém para participar do controle financeiro.</p>

                    {/* Name */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-neutral-1100 uppercase tracking-wider">Nome</label>
                        <div className={clsx(
                            "bg-white border rounded-2xl h-12 overflow-hidden focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-transparent",
                            errors.name ? "border-red-500" : "border-neutral-200"
                        )}>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full h-full p-4 outline-none text-neutral-1100 placeholder:text-neutral-300"
                                placeholder="Nome do familiar"
                            />
                        </div>
                        {errors.name && <span className="text-xs text-red-500 font-medium ml-1">{errors.name}</span>}
                    </div>

                    {/* Role & Income Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Role */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-neutral-1100 uppercase tracking-wider">Função / Parentesco</label>
                            <div className={clsx(
                                "bg-white border rounded-2xl h-12 overflow-hidden focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-transparent",
                                errors.role ? "border-red-500" : "border-neutral-200"
                            )}>
                                <input
                                    list="roles-list"
                                    type="text"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="w-full h-full p-4 outline-none text-neutral-1100 placeholder:text-neutral-300"
                                    placeholder="Membro"
                                />
                                <datalist id="roles-list">
                                    {suggestedRoles.map(r => <option key={r} value={r} />)}
                                </datalist>
                            </div>
                            {errors.role && <span className="text-xs text-red-500 font-medium ml-1">{errors.role}</span>}
                        </div>

                        {/* Income */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-neutral-1100 uppercase tracking-wider">Renda</label>
                            <div className="relative flex items-center bg-white border border-neutral-200 rounded-2xl h-12 overflow-hidden focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-transparent">
                                <span className="pl-4 text-xs font-bold text-neutral-400">R$</span>
                                <input
                                    type="number"
                                    value={income}
                                    onChange={(e) => setIncome(e.target.value)}
                                    className="w-full h-full p-4 pl-1 outline-none text-neutral-1100 placeholder:text-neutral-300"
                                    placeholder="0,00"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Avatar (Simplified Tabs) */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-neutral-1100 uppercase tracking-wider flex justify-between">
                            Avatar <span className="text-neutral-400 font-normal normal-case text-xs">(Opcional)</span>
                        </label>
                        <div className="flex bg-neutral-100 p-1 rounded-xl w-fit mb-2">
                            <button
                                onClick={() => setAvatarTab('url')}
                                className={clsx("px-4 py-1.5 rounded-lg text-xs font-bold transition-all", avatarTab === 'url' ? "bg-white text-neutral-1100 shadow-sm" : "text-neutral-500")}
                            >
                                URL
                            </button>
                            <button
                                onClick={() => setAvatarTab('upload')}
                                className={clsx("px-4 py-1.5 rounded-lg text-xs font-bold transition-all", avatarTab === 'upload' ? "bg-white text-neutral-1100 shadow-sm" : "text-neutral-500")}
                            >
                                Upload
                            </button>
                        </div>

                        {avatarTab === 'url' ? (
                            <div className="bg-white border border-neutral-200 rounded-2xl h-12 overflow-hidden focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-transparent flex items-center">
                                <User className="ml-4 text-neutral-400" size={18} />
                                <input
                                    type="text"
                                    value={avatarUrl}
                                    onChange={(e) => setAvatarUrl(e.target.value)}
                                    className="w-full h-full p-4 outline-none text-neutral-1100 placeholder:text-neutral-300 text-sm"
                                    placeholder="https://exemplo.com/foto.jpg"
                                />
                            </div>
                        ) : (
                            <div
                                className="border-2 border-dashed border-neutral-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:bg-neutral-50 transition-colors cursor-pointer group"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                                <div className="p-3 bg-neutral-100 rounded-full mb-2 group-hover:bg-white group-hover:shadow-sm transition-all">
                                    <Upload size={20} className="text-neutral-400 group-hover:text-brand-600" />
                                </div>
                                <span className="text-xs font-bold text-neutral-500 group-hover:text-neutral-800">
                                    {uploading ? (
                                        <div className="flex items-center gap-2">
                                            <Loader2 size={16} className="animate-spin text-brand-600" />
                                            <span className="text-brand-600">Enviando...</span>
                                        </div>
                                    ) : (
                                        'Clique para selecionar imagem'
                                    )}
                                </span>
                            </div>
                        )}
                    </div>

                </div>

                {/* Footer */}
                <div className="p-6 border-t border-neutral-100 bg-white flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 rounded-full border border-neutral-200 text-neutral-600 font-bold hover:bg-neutral-50 transition-colors text-sm"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={saving || uploading}
                        className="px-8 py-3 rounded-full bg-neutral-1100 text-white font-bold hover:bg-neutral-900 transition-all shadow-lg hover:shadow-xl active:scale-95 text-sm flex items-center gap-2 disabled:opacity-50"
                    >
                        {saving && <Loader2 size={16} className="animate-spin" />}
                        {saving ? 'Salvando...' : 'Salvar'}
                    </button>
                </div>

            </div>
        </div>,
        document.body
    );
}
