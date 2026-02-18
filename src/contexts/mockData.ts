import { FamilyMember, BankAccount, CreditCard, Transaction, Goal } from '../types';

export const mockMembers: FamilyMember[] = [
    { id: '1', name: 'Lucas Marte', role: 'Pai', avatarUrl: 'https://i.pravatar.cc/150?u=lucasmarte', income: 15000 },
    { id: '2', name: 'Ana Marte', role: 'Mãe', avatarUrl: 'https://i.pravatar.cc/150?u=anamarte', income: 12000 },
    { id: '3', name: 'Sofia Marte', role: 'Filha', avatarUrl: 'https://i.pravatar.cc/150?u=sofiamarte', income: 0 }
];

export const mockBankAccounts: BankAccount[] = [
    { id: 'acc1', name: 'Conta Nubank', holderId: '1', balance: 5430.50, type: 'bank' },
    { id: 'acc2', name: 'Conta Inter', holderId: '2', balance: 12890.25, type: 'bank' },
    { id: 'acc3', name: 'Conta Itaú', holderId: '1', balance: 2100.00, type: 'bank' }
];

export const mockCreditCards: CreditCard[] = [
    { id: 'card1', name: 'Nubank Ultravioleta', holderId: '1', limit: 25000, currentBill: 3450.20, closingDay: 15, dueDay: 22, lastDigits: '5897', theme: 'black', type: 'creditCard' },
    { id: 'card2', name: 'Inter Black', holderId: '2', limit: 15000, currentBill: 1200.00, closingDay: 5, dueDay: 12, lastDigits: '1234', theme: 'lime', type: 'creditCard' },
    { id: 'card3', name: 'Itaú Click', holderId: '1', limit: 8000, currentBill: 540.90, closingDay: 20, dueDay: 28, lastDigits: '9876', theme: 'white', type: 'creditCard' }
];

export const mockGoals: Goal[] = [
    { id: 'goal1', name: 'Viagem Disney', targetAmount: 30000, currentAmount: 12500, deadline: '2026-12-31', icon: 'plane', color: 'blue' },
    { id: 'goal2', name: 'Reserva Emergência', targetAmount: 50000, currentAmount: 35000, deadline: '2026-06-30', icon: 'shield', color: 'green' },
    { id: 'goal3', name: 'Carro Novo', targetAmount: 120000, currentAmount: 15000, deadline: '2027-12-31', icon: 'car', color: 'lime' },
    { id: 'goal4', name: 'Reforma Casa', targetAmount: 20000, currentAmount: 2000, deadline: '2026-08-15', icon: 'home', color: 'orange' }
];

const uuid = () => Math.random().toString(36).substring(2, 9) + Date.now().toString(36);

const generateTransactions = (): Transaction[] => {
    // Categories are used implicitly in the data below
    const transactions: Transaction[] = [];

    // Salários de Jan e Fev
    const dates = ['2026-01-05', '2026-02-05'];
    dates.forEach(date => {
        transactions.push({
            id: uuid(),
            date,
            description: 'Salário Mensal',
            amount: 15000,
            type: 'income',
            category: 'Salário',
            accountId: 'acc1',
            memberId: '1',
            status: 'completed',
            isPaid: true
        });
        transactions.push({
            id: uuid(),
            date,
            description: 'Salário Mensal',
            amount: 12000,
            type: 'income',
            category: 'Salário',
            accountId: 'acc2',
            memberId: '2',
            status: 'completed',
            isPaid: true
        });
    });

    // Despesas Fixas
    const fixedExpenses = [
        { description: 'Aluguel', amount: 3500, category: 'Moradia', accountId: 'acc1', day: 10 },
        { description: 'Condomínio', amount: 800, category: 'Moradia', accountId: 'acc1', day: 10 },
        { description: 'Escola Sofia', amount: 1800, category: 'Educação', accountId: 'acc2', day: 8 },
        { description: 'Academia', amount: 120, category: 'Saúde', accountId: 'card1', day: 15 },
        { description: 'Netflix/Spotify', amount: 55.90, category: 'Lazer', accountId: 'card1', day: 20 }
    ];

    ['01', '02'].forEach(month => {
        fixedExpenses.forEach(exp => {
            transactions.push({
                id: uuid(),
                date: `2026-${month}-${String(exp.day).padStart(2, '0')}`,
                description: exp.description,
                amount: exp.amount,
                type: 'expense',
                category: exp.category,
                accountId: exp.accountId,
                memberId: null, // Despesa familiar
                status: 'completed',
                isPaid: true
            });
        });
    });

    // Despesas Variáveis Recentes (Fev)
    const variableExpenses = [
        { desc: 'Supermercado Semanal', amount: 840.50, cat: 'Alimentação', acc: 'card1', day: 2 },
        { desc: 'Uber Trabalho', amount: 24.90, cat: 'Transporte', acc: 'card3', day: 3 },
        { desc: 'Restaurante Fim de Semana', amount: 320.00, cat: 'Lazer', acc: 'card2', day: 7 },
        { desc: 'Combustível', amount: 250.00, cat: 'Transporte', acc: 'card1', day: 8 },
        { desc: 'Farmácia', amount: 85.30, cat: 'Saúde', acc: 'card1', day: 10 },
        { desc: 'Supermercado Extra', amount: 410.20, cat: 'Alimentação', acc: 'card2', day: 12 },
        { desc: 'Cinema + Pipoca', amount: 120.00, cat: 'Lazer', acc: 'card3', day: 14 },
        { desc: 'Ifood Jantar', amount: 95.50, cat: 'Alimentação', acc: 'card1', day: 16 }
    ];

    variableExpenses.forEach(exp => {
        transactions.push({
            id: uuid(),
            date: `2026-02-${String(exp.day).padStart(2, '0')}`,
            description: exp.desc,
            amount: exp.amount,
            type: 'expense',
            category: exp.cat,
            accountId: exp.acc,
            memberId: '1', // Atribuição aleatória ou fixa
            status: 'completed',
            isPaid: true
        });
    });

    // Despesas não pagas (Próximas despesas)
    const unpaidExpenses = [
        { desc: 'Conta de Energia', amount: 342.10, cat: 'Contas', acc: 'acc1', day: 22 },
        { desc: 'Internet Fibra', amount: 159.90, cat: 'Serviços', acc: 'card1', day: 25 },
        { desc: 'Seguro Carro', amount: 450.00, cat: 'Transporte', acc: 'card2', day: 28 },
    ];

    unpaidExpenses.forEach(exp => {
        transactions.push({
            id: uuid(),
            date: `2026-02-${String(exp.day).padStart(2, '0')}`,
            description: exp.desc,
            amount: exp.amount,
            type: 'expense',
            category: exp.cat,
            accountId: exp.acc,
            memberId: null,
            status: 'pending',
            isPaid: false
        });
    });

    return transactions;
};

export const mockTransactions: Transaction[] = generateTransactions();
