
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Calendar, Upload, Loader2, Trash2 } from 'lucide-react';
import clsx from 'clsx';
import { useFinance } from '../../contexts/FinanceContext';
// import { AccountType } from '../../types';

import { Account } from '../../types';

interface AddAccountModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialAccount?: Account | null;
    initialType?: 'bank' | 'creditCard';
}

export function AddAccountModal({ isOpen, onClose, initialAccount, initialType }: AddAccountModalProps) {


    const { addBankAccount, addCreditCard, updateBankAccount, updateCreditCard, deleteBankAccount, deleteCreditCard, familyMembers, uploadImage } = useFinance();

    const [type, setType] = useState<'bank' | 'creditCard'>('bank');
    const [name, setName] = useState('');
    const [bank, setBank] = useState('');
    const [holderId, setHolderId] = useState('');

    // Bank specific
    const [balance, setBalance] = useState('');

    // Credit Card specific
    const [closingDay, setClosingDay] = useState('');
    const [dueDay, setDueDay] = useState('');
    const [limit, setLimit] = useState('');
    const [lastDigits, setLastDigits] = useState('');
    const [theme, setTheme] = useState<'black' | 'lime' | 'white'>('black');

    // Logo Upload
    const [logoUrl, setLogoUrl] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        if (isOpen && initialAccount) {
            setType(initialAccount.type === 'CREDIT_CARD' ? 'creditCard' : 'bank');
            setName(initialAccount.name);
            setBank(initialAccount.bank || '');
            setHolderId(initialAccount.holderId);
            setBalance(initialAccount.balance?.toString() || '');
            setClosingDay(initialAccount.closingDay?.toString() || '');
            setDueDay(initialAccount.dueDay?.toString() || '');
            setLimit(initialAccount.creditLimit?.toString() || '');
            setLastDigits(initialAccount.lastDigits || '');
            setTheme((initialAccount.theme as 'black' | 'lime' | 'white') || 'black');
            setLogoUrl(initialAccount.logoUrl || '');
        } else if (isOpen) {
            // Reset for new
            setType(initialType || 'bank');
            setName('');
            setBank('');
            setHolderId('');
            setBalance('');
            setClosingDay('');
            setDueDay('');
            setLimit('');
            setLastDigits('');
            setTheme('black');
            setLogoUrl('');
        }
    }, [isOpen, initialAccount, initialType]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const url = await uploadImage('account-logos', file);
            if (url) {
                setLogoUrl(url);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!name || name.length < 3) newErrors.name = 'Mínimo 3 caracteres';
        if (!bank) newErrors.bank = 'Informe o banco (ex: Nubank)';
        if (!holderId) newErrors.holderId = 'Selecione um titular';

        if (type === 'bank') {
            if (!balance) newErrors.balance = 'Informe o saldo inicial';
        } else {
            if (!closingDay || Number(closingDay) < 1 || Number(closingDay) > 31) newErrors.closingDay = 'Inválido';
            if (!dueDay || Number(dueDay) < 1 || Number(dueDay) > 31) newErrors.dueDay = 'Inválido';
            if (!limit || Number(limit) <= 0) newErrors.limit = 'Inválido';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        setSaving(true);
        try {

            if (initialAccount) {
                if (type === 'bank') {
                    await updateBankAccount(initialAccount.id, {
                        name,
                        bank,
                        holderId,
                        balance: Number(balance),
                        logoUrl: logoUrl || undefined
                    });
                } else {
                    await updateCreditCard(initialAccount.id, {
                        name,
                        bank,
                        holderId,
                        creditLimit: Number(limit),
                        closingDay: Number(closingDay),
                        dueDay: Number(dueDay),
                        theme,
                        lastDigits: lastDigits.slice(0, 4),
                        logoUrl: logoUrl || undefined
                    });
                }
            } else {
                if (type === 'bank') {
                    await addBankAccount({
                        name,
                        bank,
                        holderId,
                        balance: Number(balance),
                        type: 'CHECKING',
                        logoUrl: logoUrl || undefined
                    });
                } else {
                    await addCreditCard({
                        name,
                        bank,
                        holderId,
                        creditLimit: Number(limit),
                        closingDay: Number(closingDay),
                        dueDay: Number(dueDay),
                        currentBill: 0,
                        lastDigits: lastDigits.slice(0, 4),
                        theme,
                        type: 'CREDIT_CARD',
                        logoUrl: logoUrl || undefined
                    });
                }
            }

            // Success: Reset and Close
            setName('');
            setHolderId('');
            setBalance('');
            setClosingDay('');
            setDueDay('');
            setLimit('');
            setLastDigits('');
            setLogoUrl('');
            onClose();
        } catch (error) {
            console.error(error);
            alert('Erro ao salvar. Verifique se todos os campos estão preenchidos corretamente.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!initialAccount) return;

        if (!confirm(`Deseja realmente excluir ${initialAccount.type === 'CREDIT_CARD' ? 'este cartão' : 'esta conta'}? Esta ação não pode ser desfeita.`)) {
            return;
        }

        setDeleting(true);
        try {
            if (initialAccount.type === 'CREDIT_CARD') {
                await deleteCreditCard(initialAccount.id);
            } else {
                await deleteBankAccount(initialAccount.id);
            }
            onClose();
        } catch (error) {
            console.error(error);
            alert('Erro ao excluir. Verifique se existem transações vinculadas.');
        } finally {
            setDeleting(false);
        }
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-neutral-1100/40 backdrop-blur-sm animate-fade-in p-4 overflow-y-auto pt-10 md:pt-24">
            <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-scale-in my-auto max-h-[90vh] flex flex-col">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-neutral-100 shrink-0">
                    <h2 className="text-xl font-bold text-neutral-1100">Adicionar Conta/Cartão</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-neutral-50 text-neutral-500 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8 flex flex-col gap-6 overflow-y-auto">

                    {/* Toggle */}
                    <div className="bg-neutral-100 p-1 rounded-2xl flex shrink-0">
                        <button
                            onClick={() => setType('bank')}
                            className={clsx(
                                "flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-200",
                                type === 'bank' ? "bg-white text-neutral-1100 shadow-sm" : "text-neutral-500 hover:text-neutral-700"
                            )}
                        >
                            Conta Bancária
                        </button>
                        <button
                            onClick={() => setType('creditCard')}
                            className={clsx(
                                "flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-200",
                                type === 'creditCard' ? "bg-black text-white shadow-sm" : "text-neutral-500 hover:text-neutral-700"
                            )}
                        >
                            Cartão de Crédito
                        </button>
                    </div>

                    {/* Common Fields */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-neutral-1100 uppercase tracking-wider">
                            {type === 'bank' ? "Nome da Conta" : "Nome do Cartão"}
                        </label>
                        <div className={clsx(
                            "bg-white border rounded-2xl h-12 overflow-hidden focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-transparent",
                            errors.name ? "border-red-500" : "border-neutral-200"
                        )}>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full h-full p-4 outline-none text-neutral-1100 placeholder:text-neutral-300"
                                placeholder={type === 'bank' ? "Ex: Nubank Conta" : "Ex: Nubank Mastercard"}
                            />
                        </div>
                        {errors.name && <span className="text-xs text-red-500 font-medium ml-1">{errors.name}</span>}
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-neutral-1100 uppercase tracking-wider">
                            Instituição / Banco
                        </label>
                        <div className={clsx(
                            "bg-white border rounded-2xl h-12 overflow-hidden focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-transparent",
                            errors.bank ? "border-red-500" : "border-neutral-200"
                        )}>
                            <input
                                type="text"
                                value={bank}
                                onChange={(e) => setBank(e.target.value)}
                                className="w-full h-full p-4 outline-none text-neutral-1100 placeholder:text-neutral-300"
                                placeholder="Ex: Nubank, Itaú, Bradesco..."
                            />
                        </div>
                        {errors.bank && <span className="text-xs text-red-500 font-medium ml-1">{errors.bank}</span>}
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-neutral-1100 uppercase tracking-wider">Titular</label>
                        <div className={clsx(
                            "relative bg-white border rounded-2xl h-12 overflow-hidden focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-transparent",
                            errors.holderId ? "border-red-500" : "border-neutral-200"
                        )}>
                            <select
                                value={holderId}
                                onChange={(e) => setHolderId(e.target.value)}
                                className="w-full h-full p-4 outline-none text-neutral-1100 font-medium bg-transparent appearance-none"
                            >
                                <option value="" disabled>Selecione</option>
                                {familyMembers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">▼</div>
                        </div>
                        {errors.holderId && <span className="text-xs text-red-500 font-medium ml-1">{errors.holderId}</span>}
                    </div>

                    {/* Logo (Optional) */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-neutral-1100 uppercase tracking-wider flex justify-between">
                            Logo <span className="text-neutral-400 font-normal normal-case text-xs">(Opcional)</span>
                        </label>
                        {logoUrl ? (
                            <div className="relative w-16 h-16 rounded-2xl bg-white border border-neutral-200 overflow-hidden group">
                                <img src={logoUrl} alt="Logo" className="w-full h-full object-contain p-2" />
                                <button
                                    onClick={() => setLogoUrl('')}
                                    className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="text-white" size={20} />
                                </button>
                            </div>
                        ) : (
                            <div
                                className="border-2 border-dashed border-neutral-200 rounded-2xl p-4 flex flex-col items-center justify-center text-center hover:bg-neutral-50 transition-colors cursor-pointer"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                                <Upload size={20} className="text-neutral-400 mb-2" />
                                <span className="text-xs font-bold text-neutral-500">
                                    {uploading ? (
                                        <div className="flex items-center gap-2">
                                            <Loader2 size={16} className="animate-spin text-brand-600" />
                                            <span className="text-brand-600 font-bold">Enviando...</span>
                                        </div>
                                    ) : (
                                        'Upload Logo'
                                    )}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Bank Specific */}
                    {type === 'bank' && (
                        <div className="flex flex-col gap-2 animate-fade-in">
                            <label className="text-sm font-bold text-neutral-1100 uppercase tracking-wider">Saldo Inicial</label>
                            <div className={clsx(
                                "relative flex items-center bg-white border rounded-2xl h-12 overflow-hidden focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-transparent",
                                errors.balance ? "border-red-500" : "border-neutral-200"
                            )}>
                                <span className="pl-4 text-xs font-bold text-neutral-400">R$</span>
                                <input
                                    type="number"
                                    value={balance}
                                    onChange={(e) => setBalance(e.target.value)}
                                    className="w-full h-full p-4 pl-1 outline-none text-neutral-1100 placeholder:text-neutral-300"
                                    placeholder="0,00"
                                />
                            </div>
                            {errors.balance && <span className="text-xs text-red-500 font-medium ml-1">{errors.balance}</span>}
                        </div>
                    )}

                    {/* Credit Card Specific */}
                    {type === 'creditCard' && (
                        <>
                            <div className="grid grid-cols-2 gap-4 animate-fade-in">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-neutral-1100 uppercase tracking-wider flex items-center gap-1">
                                        Vencimento <Calendar size={12} className="text-neutral-400" />
                                    </label>
                                    <div className={clsx("bg-white border rounded-2xl h-12 overflow-hidden focus-within:ring-2 focus-within:ring-brand-500", errors.dueDay ? "border-red-500" : "border-neutral-200")}>
                                        <input
                                            type="number"
                                            value={dueDay}
                                            onChange={(e) => setDueDay(e.target.value)}
                                            className="w-full h-full p-4 outline-none text-neutral-1100"
                                            placeholder="DD"
                                        />
                                    </div>
                                    {errors.dueDay && <span className="text-xs text-red-500 font-medium ml-1">{errors.dueDay}</span>}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-neutral-1100 uppercase tracking-wider flex items-center gap-1">
                                        Fechamento <Calendar size={12} className="text-neutral-400" />
                                    </label>
                                    <div className={clsx("bg-white border rounded-2xl h-12 overflow-hidden focus-within:ring-2 focus-within:ring-brand-500", errors.closingDay ? "border-red-500" : "border-neutral-200")}>
                                        <input
                                            type="number"
                                            value={closingDay}
                                            onChange={(e) => setClosingDay(e.target.value)}
                                            className="w-full h-full p-4 outline-none text-neutral-1100"
                                            placeholder="DD"
                                        />
                                    </div>
                                    {errors.closingDay && <span className="text-xs text-red-500 font-medium ml-1">{errors.closingDay}</span>}
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 animate-fade-in">
                                <label className="text-sm font-bold text-neutral-1100 uppercase tracking-wider">Limite Total</label>
                                <div className={clsx("relative flex items-center bg-white border rounded-2xl h-12 overflow-hidden focus-within:ring-2 focus-within:ring-brand-500", errors.limit ? "border-red-500" : "border-neutral-200")}>
                                    <span className="pl-4 text-xs font-bold text-neutral-400">R$</span>
                                    <input
                                        type="number"
                                        value={limit}
                                        onChange={(e) => setLimit(e.target.value)}
                                        className="w-full h-full p-4 pl-1 outline-none text-neutral-1100"
                                        placeholder="0,00"
                                    />
                                </div>
                                {errors.limit && <span className="text-xs text-red-500 font-medium ml-1">{errors.limit}</span>}
                            </div>

                            <div className="flex flex-col gap-2 animate-fade-in">
                                <label className="text-sm font-bold text-neutral-1100 uppercase tracking-wider">Theme</label>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setTheme('black')}
                                        className={clsx("h-12 w-full rounded-xl bg-[#080B12] text-white font-bold text-xs ring-2 ring-offset-2 transition-all", theme === 'black' ? "ring-brand-500" : "ring-transparent")}
                                    >Black</button>
                                    <button
                                        onClick={() => setTheme('lime')}
                                        className={clsx("h-12 w-full rounded-xl bg-[#DFFE35] text-neutral-1100 font-bold text-xs ring-2 ring-offset-2 transition-all", theme === 'lime' ? "ring-neutral-1100" : "ring-transparent")}
                                    >Lime</button>
                                    <button
                                        onClick={() => setTheme('white')}
                                        className={clsx("h-12 w-full rounded-xl bg-white border border-neutral-200 text-neutral-1100 font-bold text-xs ring-2 ring-offset-2 transition-all", theme === 'white' ? "ring-neutral-1100" : "ring-transparent")}
                                    >White</button>
                                </div>
                            </div>
                        </>
                    )}

                </div>

                {/* Footer */}
                <div className="p-6 border-t border-neutral-100 bg-white flex justify-between gap-3 shrink-0">
                    <div className="flex gap-3">
                        {initialAccount && (
                            <button
                                onClick={handleDelete}
                                disabled={saving || deleting}
                                className="px-5 py-3 rounded-full border border-red-100 text-red-500 font-bold hover:bg-red-50 transition-colors text-sm flex items-center gap-2 disabled:opacity-50"
                                title="Excluir"
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
                            disabled={saving || uploading || deleting}
                            className="px-8 py-3 rounded-full bg-neutral-1100 text-white font-bold hover:bg-neutral-900 transition-all shadow-lg hover:shadow-xl active:scale-95 text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {saving && <Loader2 size={18} className="animate-spin" />}
                            {saving ? (initialAccount ? 'Salvando...' : 'Adicionando...') : (initialAccount ? 'Salvar Alterações' : 'Adicionar')}
                        </button>
                    </div>
                </div>

            </div>
        </div>,
        document.body
    );
}
