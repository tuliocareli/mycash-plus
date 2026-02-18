
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Loader2, Trash2 } from 'lucide-react';
import clsx from 'clsx';
import { useFinance } from '../../contexts/FinanceContext';
import { Category, TransactionType } from '../../types';

interface AddCategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialCategory?: Category | null;
}

const COMMON_ICONS = [
    '🍔', '🍕', '🍎', '🏥', '💊', '🚗', '🚌', '✈️',
    '🎮', '🎬', '📚', '🎓', '🏠', '⚡', '🛍️', '🛒',
    '💼', '🖥️', '💰', '💵', '📈', '🏦', '📦', '🏷️',
    '❤️', '🎁', '🐶', '⚽', '💅', '👔', '🧹', '🔧'
];

const COMMON_COLORS = [
    '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#6366F1',
    '#8B5CF6', '#EC4899', '#6B7280', '#06B6D4', '#84CC16',
    '#F97316', '#A855F7'
];

export function AddCategoryModal({ isOpen, onClose, initialCategory }: AddCategoryModalProps) {
    const { addCategory, updateCategory, deleteCategory } = useFinance();

    const [name, setName] = useState('');
    const [icon, setIcon] = useState('📦');
    const [type, setType] = useState<TransactionType>('EXPENSE');
    const [color, setColor] = useState('#6B7280');

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        if (isOpen && initialCategory) {
            setName(initialCategory.name);
            setIcon(initialCategory.icon);
            setType(initialCategory.type);
            setColor(initialCategory.color);
        } else if (isOpen) {
            setName('');
            setIcon('📦');
            setType('EXPENSE');
            setColor('#6B7280');
        }
    }, [isOpen, initialCategory]);

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!name || name.length < 2) newErrors.name = 'Mínimo 2 caracteres';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        setSaving(true);
        try {
            if (initialCategory) {
                await updateCategory(initialCategory.id, {
                    name,
                    icon,
                    type,
                    color
                });
            } else {
                await addCategory({
                    name,
                    icon,
                    type,
                    color
                });
            }
            onClose();
        } catch (error) {
            console.error(error);
            alert('Erro ao salvar categoria.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!initialCategory) return;
        if (!confirm(`Deseja realmente excluir a categoria "${initialCategory.name}"?`)) return;

        setDeleting(true);
        try {
            await deleteCategory(initialCategory.id);
            onClose();
        } catch (error) {
            console.error(error);
            alert('Erro ao excluir. Verifique se existem transações nesta categoria.');
        } finally {
            setDeleting(false);
        }
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-neutral-1100/40 backdrop-blur-sm animate-fade-in p-4">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-scale-in flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-neutral-100 shrink-0">
                    <div>
                        <h2 className="text-xl font-black text-neutral-1100 tracking-tight">
                            {initialCategory ? 'Editar Categoria' : 'Nova Categoria'}
                        </h2>
                        <p className="text-sm text-neutral-500 font-medium">Personalize suas categorias</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
                        <X size={24} className="text-neutral-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6 overflow-y-auto">
                    {/* Type Selector */}
                    <div className="flex bg-neutral-100 p-1 rounded-2xl shrink-0">
                        <button
                            onClick={() => setType('EXPENSE')}
                            className={clsx(
                                "flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-200",
                                type === 'EXPENSE' ? "bg-white text-neutral-1100 shadow-sm" : "text-neutral-500 hover:text-neutral-700"
                            )}
                        >
                            Despesa
                        </button>
                        <button
                            onClick={() => setType('INCOME')}
                            className={clsx(
                                "flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-200",
                                type === 'INCOME' ? "bg-white text-neutral-1100 shadow-sm" : "text-neutral-500 hover:text-neutral-700"
                            )}
                        >
                            Receita
                        </button>
                    </div>

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
                                placeholder="Ex: Mercado, Cinema..."
                            />
                        </div>
                        {errors.name && <span className="text-xs text-red-500 font-medium ml-1">{errors.name}</span>}
                    </div>

                    {/* Icon Picker */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-neutral-1100 uppercase tracking-wider">Ícone</label>
                        <div className="grid grid-cols-8 gap-2 border border-neutral-100 p-3 rounded-2xl grow overflow-y-auto max-h-40">
                            {COMMON_ICONS.map(i => (
                                <button
                                    key={i}
                                    onClick={() => setIcon(i)}
                                    className={clsx(
                                        "w-10 h-10 flex items-center justify-center text-xl rounded-xl transition-all",
                                        icon === i ? "bg-neutral-1100 scale-110 text-white" : "hover:bg-neutral-50"
                                    )}
                                >
                                    {i}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Color Picker */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-neutral-1100 uppercase tracking-wider">Cor</label>
                        <div className="flex flex-wrap gap-3">
                            {COMMON_COLORS.map(c => (
                                <button
                                    key={c}
                                    onClick={() => setColor(c)}
                                    className={clsx(
                                        "w-8 h-8 rounded-full transition-all ring-offset-2",
                                        color === c ? "ring-2 ring-neutral-1100 scale-110 shadow-lg" : "hover:scale-105"
                                    )}
                                    style={{ backgroundColor: c }}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-neutral-100 bg-white flex justify-between gap-3 shrink-0">
                    <div>
                        {initialCategory && (
                            <button
                                onClick={handleDelete}
                                disabled={saving || deleting}
                                className="px-5 py-3 rounded-full border border-red-100 text-red-500 font-bold hover:bg-red-50 transition-colors text-sm flex items-center gap-2 disabled:opacity-50"
                            >
                                {deleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                                <span className="hidden sm:inline">Excluir</span>
                            </button>
                        )}
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-6 py-3 rounded-full border border-neutral-200 text-neutral-600 font-bold hover:bg-neutral-50 transition-colors text-sm"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={saving || deleting}
                            className="px-8 py-3 rounded-full bg-neutral-1100 text-white font-bold hover:bg-neutral-900 transition-all shadow-lg hover:shadow-xl active:scale-95 text-sm flex items-center gap-2 disabled:opacity-50"
                        >
                            {saving && <Loader2 size={18} className="animate-spin" />}
                            {saving ? 'Salvando...' : (initialCategory ? 'Salvar' : 'Adicionar')}
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
