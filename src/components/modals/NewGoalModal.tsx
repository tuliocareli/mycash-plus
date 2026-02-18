
import { useState } from 'react';
import { X, Calendar, Loader2 } from 'lucide-react';
import clsx from 'clsx';
import { useFinance } from '../../contexts/FinanceContext';
import { Goal } from '../../types';

interface NewGoalModalProps {
    isOpen: boolean;
    onClose: () => void;
    goalToEdit?: Goal;
}

export function NewGoalModal({ isOpen, onClose, goalToEdit }: NewGoalModalProps) {


    const { addGoal, updateGoal } = useFinance();

    const [name, setName] = useState(goalToEdit?.name || '');
    const [targetAmount, setTargetAmount] = useState(goalToEdit?.targetAmount?.toString() || '');
    const [currentAmount, setCurrentAmount] = useState(goalToEdit?.currentAmount?.toString() || '');
    const [deadline, setDeadline] = useState(goalToEdit?.deadline ? goalToEdit.deadline.split('T')[0] : '');

    // Optional customization
    const [color, setColor] = useState(goalToEdit?.color || '#3B82F6');
    // const [icon, setIcon] = useState(goalToEdit?.icon || 'target');

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [saving, setSaving] = useState(false);

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!name || name.length < 3) newErrors.name = 'Mínimo 3 caracteres';
        if (!targetAmount || Number(targetAmount) <= 0) newErrors.targetAmount = 'Valor inválido';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        setSaving(true);

        try {
            const goalData = {
                name,
                targetAmount: Number(targetAmount),
                currentAmount: Number(currentAmount) || 0,
                deadline: deadline ? new Date(deadline).toISOString() : undefined,
                color,
                icon: 'target'
            };

            if (goalToEdit) {
                await updateGoal(goalToEdit.id, goalData);
            } else {
                await addGoal(goalData);
            }
            handleClose();
        } catch (error) {
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    const handleClose = () => {
        setName('');
        setTargetAmount('');
        setCurrentAmount('');
        setDeadline('');
        setErrors({});
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-1100/40 backdrop-blur-sm animate-fade-in">
            <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden mx-4 animate-scale-in flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-neutral-100 shrink-0">
                    <h2 className="text-xl font-bold text-neutral-1100">
                        {goalToEdit ? 'Editar Objetivo' : 'Novo Objetivo'}
                    </h2>
                    <button onClick={handleClose} className="p-2 rounded-full hover:bg-neutral-50 text-neutral-500 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8 flex flex-col gap-6 overflow-y-auto">

                    {/* Name */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-neutral-1100 uppercase tracking-wider">Nome do Objetivo</label>
                        <div className={clsx(
                            "bg-white border rounded-2xl h-12 overflow-hidden focus-within:ring-2 focus-within:ring-brand-500",
                            errors.name ? "border-red-500" : "border-neutral-200"
                        )}>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full h-full p-4 outline-none text-neutral-1100"
                                placeholder="Ex: Viagem para Europa"
                            />
                        </div>
                        {errors.name && <span className="text-xs text-red-500 font-medium ml-1">{errors.name}</span>}
                    </div>

                    {/* Amounts */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-neutral-1100 uppercase tracking-wider">Meta (R$)</label>
                            <div className={clsx(
                                "relative flex items-center bg-white border rounded-2xl h-12 overflow-hidden focus-within:ring-2 focus-within:ring-brand-500",
                                errors.targetAmount ? "border-red-500" : "border-neutral-200"
                            )}>
                                <span className="pl-4 text-xs font-bold text-neutral-400">R$</span>
                                <input
                                    type="number"
                                    value={targetAmount}
                                    onChange={(e) => setTargetAmount(e.target.value)}
                                    className="w-full h-full p-4 pl-1 outline-none text-neutral-1100"
                                    placeholder="0,00"
                                />
                            </div>
                            {errors.targetAmount && <span className="text-xs text-red-500 font-medium ml-1">{errors.targetAmount}</span>}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-neutral-1100 uppercase tracking-wider">Guardado (R$)</label>
                            <div className="relative flex items-center bg-white border border-neutral-200 rounded-2xl h-12 overflow-hidden focus-within:ring-2 focus-within:ring-brand-500">
                                <span className="pl-4 text-xs font-bold text-neutral-400">R$</span>
                                <input
                                    type="number"
                                    value={currentAmount}
                                    onChange={(e) => setCurrentAmount(e.target.value)}
                                    className="w-full h-full p-4 pl-1 outline-none text-neutral-1100"
                                    placeholder="0,00"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Deadline */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-neutral-1100 uppercase tracking-wider flex items-center gap-2">
                            Data Limite <Calendar size={14} className="text-neutral-400" />
                        </label>
                        <div className="bg-white border border-neutral-200 rounded-2xl h-12 overflow-hidden focus-within:ring-2 focus-within:ring-brand-500">
                            <input
                                type="date"
                                value={deadline}
                                onChange={(e) => setDeadline(e.target.value)}
                                className="w-full h-full p-4 outline-none text-neutral-1100 bg-transparent uppercase font-medium text-sm"
                            />
                        </div>
                    </div>

                    {/* Color Picker (Simple) */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-neutral-1100 uppercase tracking-wider">Cor</label>
                        <div className="flex gap-2">
                            {['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#080B12'].map(c => (
                                <button
                                    key={c}
                                    onClick={() => setColor(c)}
                                    className={clsx(
                                        "size-8 rounded-full border-2 transition-all",
                                        color === c ? "border-brand-500 scale-110" : "border-transparent hover:scale-105"
                                    )}
                                    style={{ backgroundColor: c }}
                                />
                            ))}
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div className="p-6 border-t border-neutral-100 bg-white flex justify-end gap-3 shrink-0">
                    <button
                        onClick={handleClose}
                        className="px-6 py-3 rounded-full border border-neutral-200 text-neutral-600 font-bold hover:bg-neutral-50 transition-colors text-sm"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={saving}
                        className="px-8 py-3 rounded-full bg-neutral-1100 text-white font-bold hover:bg-neutral-900 transition-all shadow-lg hover:shadow-xl active:scale-95 text-sm flex items-center gap-2 disabled:opacity-50"
                    >
                        {saving && <Loader2 size={16} className="animate-spin" />}
                        {goalToEdit ? (saving ? 'Atualizando...' : 'Atualizar') : (saving ? 'Criando...' : 'Criar Objetivo')}
                    </button>
                </div>

            </div>
        </div>
    );
}
