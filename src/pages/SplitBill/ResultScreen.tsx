import { useMemo, useState } from 'react';
import { CheckCircle2, ArrowRight, Loader2, Receipt } from 'lucide-react';
import { SplitRole } from './types';
import { useFinance } from '../../contexts/FinanceContext';
import { format } from 'date-fns';

interface ResultScreenProps {
  role: SplitRole;
  onBack: () => void;
  onFinish: () => void; // Bug 4: navigate to LIST after finishing (role stays)
}

export default function ResultScreen({ role, onBack, onFinish }: ResultScreenProps) {
  const { addTransaction, categories, bankAccounts } = useFinance();
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const calculateTotal = () => {
    return role.expenses.reduce((acc, curr) => acc + curr.amount, 0);
  };

  const settlement = useMemo(() => {
    const balances: Record<string, number> = {};
    role.participants.forEach(p => { balances[p.id] = 0; });

    role.expenses.forEach(exp => {
      if (balances[exp.paidBy] !== undefined) {
        balances[exp.paidBy] += exp.amount;
      }

      const participatingIds = role.participants
        .map(p => p.id)
        .filter(id => !(exp.excludedParticipants || []).includes(id));

      if (participatingIds.length > 0) {
        const costPerPerson = exp.amount / participatingIds.length;
        participatingIds.forEach(id => {
          if (balances[id] !== undefined) balances[id] -= costPerPerson;
        });
      }
    });

    type Debt = { from: string; to: string; amount: number; isMe: boolean };
    const debts: Debt[] = [];

    const debtors = Object.entries(balances)
      .filter(([_, bal]) => bal < -0.01)
      .map(([id, bal]) => ({ id, bal: Math.abs(bal) }))
      .sort((a, b) => b.bal - a.bal);

    const creditors = Object.entries(balances)
      .filter(([_, bal]) => bal > 0.01)
      .map(([id, bal]) => ({ id, bal }))
      .sort((a, b) => b.bal - a.bal);

    let dIdx = 0;
    let cIdx = 0;

    while (dIdx < debtors.length && cIdx < creditors.length) {
      const debtor = debtors[dIdx];
      const creditor = creditors[cIdx];

      const pFrom = role.participants.find(p => p.id === debtor.id);
      const pTo = role.participants.find(p => p.id === creditor.id);
      if (!pFrom || !pTo) break;

      const amountToPay = Math.min(debtor.bal, creditor.bal);
      debts.push({ from: pFrom.name, to: pTo.name, amount: amountToPay, isMe: !!pFrom.isMe });

      debtor.bal -= amountToPay;
      creditor.bal -= amountToPay;

      if (debtor.bal < 0.01) dIdx++;
      if (creditor.bal < 0.01) cIdx++;
    }

    const myId = role.participants.find(p => p.isMe)?.id || 'me';
    const myBalance = balances[myId] || 0;

    return { totalBalances: balances, debts, myBalance };
  }, [role]);

  // Bug 7: Amount "Eu" spent (my share = what I owe, i.e. negative balance)
  const myShare = Math.abs(Math.min(settlement.myBalance, 0));
  // If I paid for others, I have positive balance — that's income to receive, not an expense
  const myExpense = settlement.myBalance < -0.01 ? myShare : 0;

  const handleSaveToWallet = async () => {
    if (saved) return;
    setIsSaving(true);
    try {
      // Find a "Lazer" or "Alimentação" category, or fallback to first expense category
      const lazerCat = categories.find(c => c.type === 'EXPENSE' && c.name.toLowerCase().includes('lazer'));
      const alimCat = categories.find(c => c.type === 'EXPENSE' && c.name.toLowerCase().includes('aliment'));
      const fallbackCat = categories.find(c => c.type === 'EXPENSE');
      const chosenCat = lazerCat || alimCat || fallbackCat;

      // Use first bank account available, or leave undefined
      const account = bankAccounts[0];

      const dateStr = role.date
        ? (() => {
            // role.date is in dd/MM/yyyy format
            const [d, m, y] = role.date.split('/');
            return `${y}-${m}-${d}`;
          })()
        : format(new Date(), 'yyyy-MM-dd');

      if (myExpense > 0) {
        // My portion of the bill = EXPENSE
        await addTransaction({
          type: 'EXPENSE',
          amount: myExpense,
          description: `Rolê: ${role.title}`,
          date: dateStr,
          categoryId: chosenCat?.id,
          accountId: account?.id,
          status: 'COMPLETED',
        });
      } else if (settlement.myBalance > 0.01) {
        // I paid for others and should receive — register as INCOME (to receive)
        await addTransaction({
          type: 'INCOME',
          amount: settlement.myBalance,
          description: `Rolê (reembolso): ${role.title}`,
          date: dateStr,
          categoryId: categories.find(c => c.type === 'INCOME')?.id,
          accountId: account?.id,
          status: 'COMPLETED',
        });
      }

      setSaved(true);
    } catch (err: any) {
      console.error('Error saving to Purso:', err);
      alert('Erro ao salvar na Purso: ' + (err.message || err));
    } finally {
      setIsSaving(false);
    }
  };

  const handleFinish = () => {
    // Bug 4: go to LIST, not clear the role
    onFinish();
  };

  return (
    <div className="flex flex-col h-full bg-white md:rounded-3xl max-w-2xl w-full mx-auto md:mt-10 p-6 shadow-sm border border-neutral-100 overflow-y-auto">

      <div className="flex items-center gap-4 mb-8 pt-2">
        <button onClick={onBack} className="text-neutral-500 font-semibold text-sm hover:text-neutral-800 transition-colors">
          Voltar
        </button>
        <h2 className="text-xl font-bold text-neutral-1100">Resultado</h2>
        <div className="ml-auto text-2xl">{role.emoji || '🍻'}</div>
      </div>

      <div className="flex-1 flex flex-col pt-4">

        <div className="bg-neutral-100 rounded-[24px] p-6 text-center mb-8">
          <p className="text-neutral-500 font-semibold mb-2 text-sm uppercase tracking-wider">Total do Rolê</p>
          <p className="text-4xl font-black text-neutral-1100">{formatCurrency(calculateTotal())}</p>
        </div>

        <div className="bg-brand-50 rounded-[24px] p-6 mb-6 border border-brand-200">
          {settlement.myBalance < -0.01 ? (
            <div>
              <p className="text-brand-800 font-bold text-lg mb-1">Você deve pagar:</p>
              <p className="text-3xl font-black text-brand-700">{formatCurrency(Math.abs(settlement.myBalance))}</p>
            </div>
          ) : settlement.myBalance > 0.01 ? (
            <div>
              <p className="text-emerald-700 font-bold text-lg mb-1">Você deve receber:</p>
              <p className="text-3xl font-black text-emerald-600">{formatCurrency(settlement.myBalance)}</p>
            </div>
          ) : (
            <div className="flex items-center gap-3 text-emerald-700">
              <CheckCircle2 size={32} />
              <p className="font-bold text-lg leading-tight">Você está quite neste rolê!</p>
            </div>
          )}
        </div>

        {/* Bug 7: Save to Purso */}
        {(settlement.myBalance < -0.01 || settlement.myBalance > 0.01) && (
          <button
            onClick={handleSaveToWallet}
            disabled={isSaving || saved}
            className={`w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-bold transition-colors mb-6 ${
              saved
                ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-300'
                : 'bg-white border-2 border-brand-300 text-brand-700 hover:bg-brand-50'
            }`}
          >
            {isSaving ? (
              <><Loader2 size={20} className="animate-spin" /> Salvando na Purso...</>
            ) : saved ? (
              <><CheckCircle2 size={20} /> Salvo na Purso!</>
            ) : (
              <><Receipt size={20} /> Salvar minha parte na Purso</>
            )}
          </button>
        )}

        <h3 className="text-lg font-bold text-neutral-1100 mb-4 px-1">Resumo das transferências</h3>

        {settlement.debts.length === 0 ? (
          <p className="text-neutral-500 px-1">Ninguém deve nada a ninguém. Tudo certo!</p>
        ) : (
          <div className="flex flex-col gap-3 pb-6">
            {settlement.debts.map((debt, i) => (
              <div key={i} className="flex justify-between items-center p-4 rounded-xl border border-neutral-200 bg-white">
                <div className="flex flex-col">
                  <span className={`font-bold text-lg ${debt.isMe ? 'text-brand-700' : 'text-neutral-800'}`}>{debt.from}</span>
                  <span className="text-neutral-500 text-sm font-medium">paga para <span className="text-neutral-700 font-bold">{debt.to}</span></span>
                </div>
                <span className="font-extrabold text-brand-700 text-xl">{formatCurrency(debt.amount)}</span>
              </div>
            ))}
          </div>
        )}

        {/* Bug 4: finish goes to LIST, role is preserved */}
        <div className="mt-6 pb-4">
          <button
            onClick={handleFinish}
            className="w-full flex items-center justify-center gap-2 bg-neutral-1100 hover:bg-neutral-900 text-white font-bold py-4 px-6 rounded-2xl transition-colors"
          >
            Ver todos os rolês
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
