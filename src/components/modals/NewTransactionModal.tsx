import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ArrowDownLeft, ArrowUpRight, Calendar, Repeat, Plus } from 'lucide-react';
import clsx from 'clsx';
import { useFinance } from '../../contexts/FinanceContext';
import { TransactionType } from '../../types';

interface NewTransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialAccountId?: string;
}

export function NewTransactionModal({ isOpen, onClose, initialAccountId }: NewTransactionModalProps) {
    if (!isOpen) return null;

    const { addTransaction, familyMembers, bankAccounts, creditCards } = useFinance();

    const [type, setType] = useState<TransactionType>('expense');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [memberId, setMemberId] = useState<string>('');
    const [accountId, setAccountId] = useState(initialAccountId || '');
    const [installments, setInstallments] = useState(1);
    const [isRecurring, setIsRecurring] = useState(false);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    // Validation Errors
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (isOpen) {
            setAccountId(initialAccountId || '');
        }
    }, [isOpen, initialAccountId]);

    useEffect(() => {
        setCategory('');
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

    // Mock Categories
    const incomeCategories = ['Salário', 'Freelance', 'Investimentos', 'Presente', 'Outros'];
    const expenseCategories = ['Moradia', 'Alimentação', 'Transporte', 'Lazer', 'Saúde', 'Educação', 'Compras', 'Outros'];
    const displayedCategories = type === 'income' ? incomeCategories : expenseCategories;

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!amount || Number(amount) <= 0) newErrors.amount = 'Valor inválido';
        if (!description || description.length < 3) newErrors.description = 'Min. 3 caracteres';
        if (!category) newErrors.category = 'Obrigatório';
        if (!accountId) newErrors.accountId = 'Obrigatório';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validate()) return;

        addTransaction({
            type,
            amount: Number(amount),
            description,
            category,
            date,
            memberId: memberId || null,
            accountId,
            installments: type === 'expense' && creditCards.find(c => c.id === accountId) ? installments : 1,
            isRecurring: type === 'expense' ? isRecurring : false,
            status: 'completed',
            isPaid: false,
        });

        handleClose();
    };

    const handleClose = () => {
        // Reset State
        setType('expense');
        setAmount('');
        setDescription('');
        setCategory('');
        setMemberId('');
        setAccountId('');
        setInstallments(1);
        setIsRecurring(false);
        setErrors({});
        onClose();
    };

    const isCreditCardSelected = creditCards.some(c => c.id === accountId);

    return createPortal(
        <div
            className="fixed inset-0 flex items-center justify-center bg-neutral-1100/60 z-[99999]"
            style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}
        >
            {/* Modal Card */}
            <div className="bg-white w-full h-full md:h-auto md:max-h-[90vh] md:max-w-3xl md:rounded-[32px] shadow-2xl flex flex-col overflow-hidden relative">

                {/* Header Top - Title & Close */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-neutral-100 bg-white z-10">
                    <div className="flex items-center gap-4">
                        <div className="size-12 bg-neutral-1100 rounded-full flex items-center justify-center text-white shrink-0">
                            {type === 'income' ? <ArrowDownLeft size={24} /> : <ArrowUpRight size={24} />}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-neutral-1100 leading-tight">Nova Transação</h2>
                            <p className="text-sm text-neutral-500">Registre suas movimentações</p>
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
                                onClick={() => setType('income')}
                                className={clsx(
                                    "flex-1 py-2.5 rounded-full text-sm font-bold transition-all duration-200 text-center",
                                    type === 'income' ? "bg-white text-neutral-1100 shadow-sm ring-1 ring-black/5" : "text-neutral-500 hover:text-neutral-700"
                                )}
                            >
                                Receita
                            </button>
                            <button
                                onClick={() => setType('expense')}
                                className={clsx(
                                    "flex-1 py-2.5 rounded-full text-sm font-bold transition-all duration-200 text-center",
                                    type === 'expense' ? "bg-neutral-1100 text-white shadow-sm" : "text-neutral-500 hover:text-neutral-700"
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
                                <button className="text-[10px] font-bold text-brand-700 bg-brand-500/10 px-2 py-1 rounded hover:bg-brand-500/20 transition-colors uppercase flex items-center gap-1">
                                    <Plus size={12} /> Nova Categoria
                                </button>
                            </div>
                            <div className={clsx(
                                "relative flex items-center h-[52px] bg-white border rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-neutral-900 focus-within:border-transparent transition-all",
                                errors.category ? "border-red-500" : "border-neutral-300"
                            )}>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full h-full px-4 outline-none text-neutral-1100 font-medium bg-transparent appearance-none cursor-pointer z-10"
                                >
                                    <option value="" disabled>Selecione a categoria</option>
                                    {displayedCategories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                                <div className="absolute right-4 text-neutral-400 pointer-events-none">▼</div>
                            </div>
                            {errors.category && <span className="text-xs text-red-500 font-medium">{errors.category}</span>}
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
                                        <optgroup label="Cartões">
                                            {creditCards.map(card => (
                                                <option key={card.id} value={card.id}>{card.name}</option>
                                            ))}
                                        </optgroup>
                                    </select>
                                    <div className="absolute right-4 text-neutral-400 pointer-events-none">▼</div>
                                </div>
                                {errors.accountId && <span className="text-xs text-red-500 font-medium">{errors.accountId}</span>}
                            </div>
                        </div>

                        {/* 6. Installments (If Expense & Credit Card) */}
                        {type === 'expense' && isCreditCardSelected && !isRecurring && (
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
                        {type === 'expense' && (
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
                        className="px-8 py-3.5 rounded-full border border-neutral-300 text-neutral-700 font-bold hover:bg-neutral-50 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-8 py-3.5 rounded-full bg-neutral-1100 text-white font-bold hover:bg-neutral-900 transition-colors shadow-lg hover:shadow-xl active:scale-95"
                    >
                        Salvar transação
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}

