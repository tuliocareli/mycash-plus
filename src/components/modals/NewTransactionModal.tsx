
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ArrowDownLeft, ArrowUpRight, Calendar, Repeat, Plus, Loader2, Trash2 } from 'lucide-react';
import clsx from 'clsx';
import { useFinance } from '../../contexts/FinanceContext';
import { Transaction, TransactionType, TransactionStatus } from '../../types';

interface NewTransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialAccountId?: string;
    initialData?: Transaction;
}

export function NewTransactionModal({ isOpen, onClose, initialAccountId, initialData }: NewTransactionModalProps) {
    const { addTransaction, updateTransaction, deleteTransaction, familyMembers, bankAccounts, creditCards, categories, addCategory } = useFinance();

    const [type, setType] = useState<TransactionType>('EXPENSE');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [memberId, setMemberId] = useState<string>('');
    const [accountId, setAccountId] = useState(initialAccountId || '');
    const [installments, setInstallments] = useState(1);
    const [isRecurring, setIsRecurring] = useState(false);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    // Category addition state
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [isSavingCategory, setIsSavingCategory] = useState(false);

    // Validation Errors
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const isEditing = !!initialData;

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                // Populate form for editing
                setType(initialData.type);
                setAmount(String(initialData.amount));
                setDescription(initialData.description);
                setCategoryId(initialData.categoryId || '');
                setMemberId(initialData.memberId || '');
                setAccountId(initialData.accountId || '');
                // Safely handle date parsing
                const rawDate = initialData.date;
                const safeDate = (rawDate && rawDate.includes('T')) ? rawDate.split('T')[0] : (rawDate || new Date().toISOString().split('T')[0]);
                setDate(safeDate);
                setInstallments(initialData.totalInstallments || 1);
                setIsRecurring(initialData.isRecurring || false);
            } else {
                // Reset for new entry
                setAccountId(initialAccountId || '');
                setAmount('');
                setDescription('');
                setCategoryId('');
                setMemberId('');
                setDate(new Date().toISOString().split('T')[0]);
                setInstallments(1);
                setIsRecurring(false);
                setType('EXPENSE');
            }
        }
    }, [isOpen, initialAccountId, initialData]);

    // Reset category when type changes (only if not editing or explicit user change)
    useEffect(() => {
        if (!initialData && !isEditing) {
            setCategoryId('');
            setAccountId('');
        }
    }, [type]);

    const handleRecurringChange = (checked: boolean) => {
        setIsRecurring(checked);
        if (checked) setInstallments(1);
    };

    const handleInstallmentsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = Number(e.target.value);
        setInstallments(val);
        if (val > 1) setIsRecurring(false);
    };

    // Filter categories by type
    const displayedCategories = categories.filter(c => c.type === type);

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!amount || Number(amount) <= 0) newErrors.amount = 'Valor inválido';
        if (!description || description.length < 3) newErrors.description = 'Min. 3 caracteres';
        if (!categoryId && !isAddingCategory) newErrors.category = 'Obrigatório';
        if (!accountId) newErrors.accountId = 'Obrigatório';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAddCategory = async () => {
        if (!newCategoryName || newCategoryName.length < 2) return;
        setIsSavingCategory(true);
        try {
            await addCategory({
                name: newCategoryName,
                type,
                icon: type === 'INCOME' ? '💰' : '📦',
                color: type === 'INCOME' ? '#10B981' : '#6B7280'
            });
            setIsAddingCategory(false);
            setNewCategoryName('');
        } catch (error) {
            console.error(error);
        } finally {
            setIsSavingCategory(false);
        }
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        setSaving(true);
        try {
            const payload = {
                type,
                amount: Number(amount),
                description,
                categoryId,
                date,
                memberId: memberId || undefined,
                accountId,
                totalInstallments: type === 'EXPENSE' && creditCards.find(c => c.id === accountId) ? installments : 1,
                isRecurring: type === 'EXPENSE' ? isRecurring : false,
                status: 'COMPLETED' as TransactionStatus,
            };

            if (isEditing && initialData) {
                await updateTransaction(initialData.id, payload);
            } else {
                await addTransaction(payload);
            }
            handleClose();
        } catch (error: any) {
            console.error(error);
            alert('Erro ao salvar transação: ' + (error.message || 'Erro desconhecido'));
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!initialData) return;
        if (!confirm('Tem certeza que deseja excluir esta transação?')) return;

        setDeleting(true);
        try {
            await deleteTransaction(initialData.id);
            handleClose();
        } catch (error: any) {
            console.error(error);
            alert('Erro ao excluir: ' + error.message);
        } finally {
            setDeleting(false);
        }
    };

    const handleClose = () => {
        // Reset State logic is handled in useEffect[isOpen], but we can clear some here too
        setErrors({});
        onClose();
    };

    const isCreditCardSelected = creditCards.some(c => c.id === accountId);

    if (!isOpen) return null;

    return createPortal(
        <div
            className="fixed inset-0 flex items-start justify-center bg-neutral-1100/40 z-[99999] p-4 pt-10 md:pt-24 overflow-y-auto animate-fade-in backdrop-blur-sm"
            style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}
        >
            {/* Modal Card */}
            <div className="bg-white w-full h-full md:h-auto md:max-h-[90vh] md:max-w-3xl md:rounded-[32px] shadow-2xl flex flex-col overflow-hidden relative my-auto animate-scale-in">

                {/* Header Top - Title & Close */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-neutral-100 bg-white z-10">
                    <div className="flex items-center gap-4">
                        <div className="size-12 bg-neutral-1100 rounded-full flex items-center justify-center text-white shrink-0">
                            {type === 'INCOME' ? <ArrowDownLeft size={24} /> : <ArrowUpRight size={24} />}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-neutral-1100 leading-tight">
                                {isEditing ? 'Editar Transação' : 'Nova Transação'}
                            </h2>
                            <p className="text-sm text-neutral-500">
                                {isEditing ? 'Altere os detalhes abaixo' : 'Registre suas movimentações'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={(e) => { e.stopPropagation(); handleClose(); }}
                        className="size-10 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-500 hover:bg-neutral-50 active:bg-neutral-100 transition-colors cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body - Scrollable Form */}
                <div className="flex-1 overflow-y-auto p-8 bg-white">
                    <div className="flex flex-col gap-6">

                        {/* 1. Toggle Switch (Pill Style) */}
                        <div className="flex p-1 bg-neutral-100 rounded-full border border-neutral-200">
                            <button
                                onClick={() => setType('INCOME')}
                                className={clsx(
                                    "flex-1 py-2.5 rounded-full text-sm font-bold transition-all duration-200 text-center",
                                    type === 'INCOME' ? "bg-white text-neutral-1100 shadow-sm ring-1 ring-black/5" : "text-neutral-500 hover:text-neutral-700"
                                )}
                            >
                                Receita
                            </button>
                            <button
                                onClick={() => setType('EXPENSE')}
                                className={clsx(
                                    "flex-1 py-2.5 rounded-full text-sm font-bold transition-all duration-200 text-center",
                                    type === 'EXPENSE' ? "bg-neutral-1100 text-white shadow-sm" : "text-neutral-500 hover:text-neutral-700"
                                )}
                            >
                                Despesa
                            </button>
                        </div>

                        {/* 2. Value & Date (Side by Side) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Value */}
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-neutral-900 uppercase tracking-wide">Valor da transação</label>
                                <div className={clsx(
                                    "flex items-center h-[52px] px-4 bg-white border rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-neutral-900 focus-within:border-transparent transition-all",
                                    errors.amount ? "border-red-500" : "border-neutral-300"
                                )}>
                                    <span className="text-neutral-400 font-bold mr-2">R$</span>
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="w-full h-full outline-none text-lg font-bold text-neutral-1100 placeholder:text-neutral-300 bg-transparent"
                                        placeholder="0,00"
                                    />
                                </div>
                                {errors.amount && <span className="text-xs text-red-500 font-medium">{errors.amount}</span>}
                            </div>

                            {/* Date */}
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-neutral-900 uppercase tracking-wide">Data</label>
                                <div className="relative flex items-center h-[52px] bg-white border border-neutral-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-neutral-900 focus-within:border-transparent transition-all">
                                    <input
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="w-full h-full px-4 outline-none text-neutral-1100 font-medium bg-transparent z-10"
                                    />
                                    <Calendar className="absolute right-4 text-neutral-400 pointer-events-none" size={18} />
                                </div>
                            </div>
                        </div>

                        {/* 3. Description */}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-neutral-900 uppercase tracking-wide">Descrição</label>
                            <div className={clsx(
                                "flex items-center h-[52px] px-4 bg-white border rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-neutral-900 focus-within:border-transparent transition-all",
                                errors.description ? "border-red-500" : "border-neutral-300"
                            )}>
                                <input
                                    type="text"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full h-full outline-none text-neutral-1100 font-medium placeholder:text-neutral-300 bg-transparent"
                                    placeholder="Ex: Supermercado Semanal"
                                />
                            </div>
                            {errors.description && <span className="text-xs text-red-500 font-medium">{errors.description}</span>}
                        </div>

                        {/* 4. Category */}
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-bold text-neutral-900 uppercase tracking-wide">Categoria</label>
                                <button
                                    onClick={() => setIsAddingCategory(!isAddingCategory)}
                                    className="text-[10px] font-bold text-brand-700 bg-brand-500/10 px-2 py-1 rounded hover:bg-brand-500/20 transition-colors uppercase flex items-center gap-1"
                                >
                                    {isAddingCategory ? <X size={12} /> : <Plus size={12} />}
                                    {isAddingCategory ? 'Cancelar' : 'Nova Categoria'}
                                </button>
                            </div>

                            {isAddingCategory ? (
                                <div className="flex items-center gap-2 animate-fade-in">
                                    <div className="flex-1 h-[52px] bg-white border border-neutral-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-neutral-900 transition-all">
                                        <input
                                            type="text"
                                            value={newCategoryName}
                                            onChange={(e) => setNewCategoryName(e.target.value)}
                                            className="w-full h-full px-4 outline-none text-neutral-1100 font-medium"
                                            placeholder="Nome da categoria..."
                                            autoFocus
                                        />
                                    </div>
                                    <button
                                        onClick={handleAddCategory}
                                        disabled={isSavingCategory || newCategoryName.length < 2}
                                        className="h-[52px] px-4 bg-neutral-1100 text-white rounded-xl font-bold hover:bg-neutral-900 disabled:opacity-50 transition-all flex items-center justify-center min-w-[80px]"
                                    >
                                        {isSavingCategory ? <Loader2 size={18} className="animate-spin" /> : 'Salvar'}
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className={clsx(
                                        "relative flex items-center h-[52px] bg-white border rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-neutral-900 focus-within:border-transparent transition-all",
                                        errors.category ? "border-red-500" : "border-neutral-300"
                                    )}>
                                        <select
                                            value={categoryId}
                                            onChange={(e) => setCategoryId(e.target.value)}
                                            className="w-full h-full px-4 outline-none text-neutral-1100 font-medium bg-transparent appearance-none cursor-pointer z-10"
                                        >
                                            <option value="" disabled>Selecione a categoria</option>
                                            {displayedCategories.map(cat => (
                                                <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                                            ))}
                                        </select>
                                        <div className="absolute right-4 text-neutral-400 pointer-events-none">▼</div>
                                    </div>
                                    {errors.category && <span className="text-xs text-red-500 font-medium">{errors.category}</span>}
                                </>
                            )}
                        </div>

                        {/* 5. User & Account (Grid) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Responsible */}
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-neutral-900 uppercase tracking-wide">Responsável</label>
                                <div className="relative flex items-center h-[52px] bg-white border border-neutral-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-neutral-900 focus-within:border-transparent transition-all">
                                    <select
                                        value={memberId}
                                        onChange={(e) => setMemberId(e.target.value)}
                                        className="w-full h-full px-4 outline-none text-neutral-1100 font-medium bg-transparent appearance-none cursor-pointer z-10"
                                    >
                                        <option value="">Familiar</option>
                                        {familyMembers.map(m => (
                                            <option key={m.id} value={m.id}>{m.name}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 text-neutral-400 pointer-events-none">▼</div>
                                </div>
                            </div>

                            {/* Account/Card */}
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-neutral-900 uppercase tracking-wide">Conta / cartão</label>
                                <div className={clsx(
                                    "relative flex items-center h-[52px] bg-white border rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-neutral-900 focus-within:border-transparent transition-all",
                                    errors.accountId ? "border-red-500" : "border-neutral-300"
                                )}>
                                    <select
                                        value={accountId}
                                        onChange={(e) => setAccountId(e.target.value)}
                                        className="w-full h-full px-4 outline-none text-neutral-1100 font-medium bg-transparent appearance-none cursor-pointer z-10"
                                    >
                                        <option value="" disabled>Selecione</option>
                                        <optgroup label="Contas">
                                            {bankAccounts.map(acc => (
                                                <option key={acc.id} value={acc.id}>{acc.name}</option>
                                            ))}
                                        </optgroup>
                                        {type === 'EXPENSE' && (
                                            <optgroup label="Cartões">
                                                {creditCards.map(card => (
                                                    <option key={card.id} value={card.id}>{card.name}</option>
                                                ))}
                                            </optgroup>
                                        )}
                                    </select>
                                    <div className="absolute right-4 text-neutral-400 pointer-events-none">▼</div>
                                </div>
                                {errors.accountId && <span className="text-xs text-red-500 font-medium">{errors.accountId}</span>}
                            </div>
                        </div>

                        {/* 6. Installments (If Expense & Credit Card) */}
                        {type === 'EXPENSE' && isCreditCardSelected && !isRecurring && (
                            <div className="flex flex-col gap-2 animate-fade-in">
                                <label className="text-xs font-bold text-neutral-900 uppercase tracking-wide">Parcelas</label>
                                <div className="relative flex items-center h-[52px] bg-white border border-neutral-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-neutral-900 focus-within:border-transparent transition-all">
                                    <select
                                        value={installments}
                                        onChange={handleInstallmentsChange}
                                        className="w-full h-full px-4 outline-none text-neutral-1100 font-medium bg-transparent appearance-none cursor-pointer z-10"
                                    >
                                        <option value={1}>À vista (1x)</option>
                                        {Array.from({ length: 11 }, (_, i) => i + 2).map(n => (
                                            <option key={n} value={n}>{n}x</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 text-neutral-400 pointer-events-none">▼</div>
                                </div>
                            </div>
                        )}

                        {/* 7. Recurring Checkbox */}
                        {type === 'EXPENSE' && (
                            <label className={clsx(
                                "flex items-center gap-3 cursor-pointer group mt-2",
                                installments > 1 && "opacity-50 pointer-events-none"
                            )}>
                                <div className={clsx(
                                    "size-6 border-2 rounded flex items-center justify-center transition-all",
                                    isRecurring ? "bg-neutral-1100 border-neutral-1100" : "border-neutral-300 bg-white group-hover:border-neutral-400"
                                )}>
                                    <input
                                        type="checkbox"
                                        className="hidden"
                                        checked={isRecurring}
                                        onChange={(e) => handleRecurringChange(e.target.checked)}
                                        disabled={installments > 1}
                                    />
                                    {isRecurring && <Repeat size={14} className="text-white" />}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-neutral-1100">Despesa recorrente</span>
                                    <span className="text-xs text-neutral-500">Contas que se repetem todo mês (Netflix, Spotify, etc).</span>
                                </div>
                            </label>
                        )}
                    </div>
                </div>

                {/* Footer - Actions */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-neutral-100 bg-white z-10">
                    <button
                        onClick={handleClose}
                        className="px-6 py-3.5 rounded-full border border-neutral-300 text-neutral-700 font-bold hover:bg-neutral-50 transition-colors"
                    >
                        Cancelar
                    </button>

                    {isEditing && (
                        <button
                            onClick={handleDelete}
                            disabled={deleting}
                            className="size-12 rounded-full border border-red-100 bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 hover:border-red-200 transition-colors"
                            title="Excluir Transação"
                        >
                            {deleting ? <Loader2 size={20} className="animate-spin" /> : <Trash2 size={20} />}
                        </button>
                    )}

                    <button
                        onClick={handleSubmit}
                        disabled={saving}
                        className="px-8 py-3.5 rounded-full bg-neutral-1100 text-white font-bold hover:bg-neutral-900 transition-colors shadow-lg hover:shadow-xl active:scale-95 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving && <Loader2 size={18} className="animate-spin" />}
                        {saving ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Salvar')}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
