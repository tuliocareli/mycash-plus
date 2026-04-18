import { useMemo } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { SplitRole } from './types';

interface ResultScreenProps {
  role: SplitRole;
  onBack: () => void;
}

export default function ResultScreen({ role, onBack }: ResultScreenProps) {
  
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const calculateTotal = () => {
    return role.expenses.reduce((acc, curr) => acc + curr.amount, 0);
  };

  const settlement = useMemo(() => {
    // Calculate balances
    const balances: Record<string, number> = {};
    role.participants.forEach(p => {
      balances[p.id] = 0;
    });

    role.expenses.forEach(exp => {
      // Payer paid the whole amount
      if (balances[exp.paidBy] !== undefined) {
        balances[exp.paidBy] += exp.amount;
      }
      
      const participatingIds = role.participants
        .map(p => p.id)
        .filter(id => !(exp.excludedParticipants || []).includes(id));
      
      if (participatingIds.length > 0) {
        const costPerPerson = exp.amount / participatingIds.length;
        participatingIds.forEach(id => {
          if (balances[id] !== undefined) {
            balances[id] -= costPerPerson;
          }
        });
      }
    });

    // Settle debts
    type Debt = { from: string; to: string; amount: number; isMe: boolean };
    const debts: Debt[] = [];
    
    // Sort debtors and creditors
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
      
      if (!pFrom || !pTo) break; // sanity

      const amountToPay = Math.min(debtor.bal, creditor.bal);
      
      debts.push({
        from: pFrom.name,
        to: pTo.name,
        amount: amountToPay,
        isMe: !!pFrom.isMe
      });

      debtor.bal -= amountToPay;
      creditor.bal -= amountToPay;

      if (debtor.bal < 0.01) dIdx++;
      if (creditor.bal < 0.01) cIdx++;
    }

    // Determine what "Eu" individually needs to do
    const myId = role.participants.find(p => p.isMe)?.id || 'me';
    let myBalance = balances[myId] || 0;

    return { totalBalances: balances, debts, myBalance };
  }, [role]);

  return (
    <div className="flex flex-col h-full bg-white md:rounded-3xl max-w-md w-full mx-auto md:mt-10 p-6 shadow-sm border border-neutral-100 overflow-y-auto">
      
      <div className="flex items-center gap-4 mb-8 pt-2">
        <button onClick={onBack} className="text-neutral-500 font-semibold text-sm hover:text-neutral-800 transition-colors">
          Voltar
        </button>
        <h2 className="text-xl font-bold text-neutral-1100">Resultado</h2>
      </div>

      <div className="flex-1 flex flex-col pt-4">
        
        <div className="bg-neutral-100 rounded-[24px] p-6 text-center mb-8">
          <p className="text-neutral-500 font-semibold mb-2 text-sm uppercase tracking-wider">Total do Rolê</p>
          <p className="text-4xl font-black text-neutral-1100">{formatCurrency(calculateTotal())}</p>
        </div>

        <div className="bg-brand-50 rounded-[24px] p-6 mb-8 border border-brand-200">
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

        <h3 className="text-lg font-bold text-neutral-1100 mb-4 px-1">Resumo das transferências</h3>
        
        {settlement.debts.length === 0 ? (
          <p className="text-neutral-500 px-1">Ninguém deve nada a ninguém. Tudo certo!</p>
        ) : (
          <div className="flex flex-col gap-3 pb-20">
            {settlement.debts.map((debt, i) => (
              <div key={i} className="flex justify-between items-center p-4 rounded-xl border border-neutral-200 bg-white">
                <div className="flex flex-col">
                  <span className="font-bold text-neutral-800 text-lg">{debt.from}</span>
                  <span className="text-neutral-500 text-sm font-medium">paga para <span className="text-neutral-700 font-bold">{debt.to}</span></span>
                </div>
                <span className="font-extrabold text-brand-700 text-xl">{formatCurrency(debt.amount)}</span>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
