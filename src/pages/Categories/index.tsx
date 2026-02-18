
import { useState } from 'react';
import { Plus, LayoutGrid, Search, Filter, MoreVertical, Edit2, Trash2, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { useFinance } from '../../contexts/FinanceContext';
import { AddCategoryModal } from '../../components/modals/AddCategoryModal';
import { Category } from '../../types';
import clsx from 'clsx';

export default function Categories() {
    const { categories } = useFinance();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [typeFilter, setTypeFilter] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCategories = categories.filter(cat => {
        const matchesType = typeFilter === 'ALL' || cat.type === typeFilter;
        const matchesSearch = cat.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesType && matchesSearch;
    });

    const incomeCategories = filteredCategories.filter(c => c.type === 'INCOME');
    const expenseCategories = filteredCategories.filter(c => c.type === 'EXPENSE');

    const handleEdit = (category: Category) => {
        setSelectedCategory(category);
        setIsAddModalOpen(true);
    };

    return (
        <div className="flex flex-col gap-6 animate-fade-in pb-20 md:pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-neutral-1100 tracking-tight">Categorias</h1>
                    <p className="text-neutral-500 font-medium">Organize suas transações</p>
                </div>
                <button
                    onClick={() => {
                        setSelectedCategory(null);
                        setIsAddModalOpen(true);
                    }}
                    className="flex items-center justify-center gap-2 bg-neutral-1100 text-white px-6 py-3.5 rounded-2xl font-bold hover:bg-neutral-900 transition-all shadow-lg hover:shadow-xl active:scale-95"
                >
                    <Plus size={20} />
                    <span>Nova Categoria</span>
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-3xl border border-neutral-100 shadow-sm">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-brand-500 transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Buscar categoria..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-neutral-50 border-none rounded-2xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-brand-500/20 text-neutral-1100 font-medium placeholder:text-neutral-400 transition-all"
                    />
                </div>
                <div className="flex gap-2">
                    {(['ALL', 'EXPENSE', 'INCOME'] as const).map((type) => (
                        <button
                            key={type}
                            onClick={() => setTypeFilter(type)}
                            className={clsx(
                                "px-5 py-3 rounded-2xl font-bold text-sm transition-all whitespace-nowrap",
                                typeFilter === type
                                    ? "bg-neutral-1100 text-white shadow-md"
                                    : "bg-neutral-50 text-neutral-500 hover:bg-neutral-100"
                            )}
                        >
                            {type === 'ALL' ? 'Todas' : type === 'EXPENSE' ? 'Despesas' : 'Receitas'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Categories Grid */}
            <div className="space-y-8">
                {/* Income Categories */}
                {(typeFilter === 'ALL' || typeFilter === 'INCOME') && incomeCategories.length > 0 && (
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 text-green-600">
                            <ArrowDownLeft size={20} className="font-bold" />
                            <h2 className="font-black uppercase tracking-widest text-sm">Categorias de Receita</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {incomeCategories.map(cat => (
                                <CategoryCard key={cat.id} category={cat} onEdit={() => handleEdit(cat)} />
                            ))}
                        </div>
                    </section>
                )}

                {/* Expense Categories */}
                {(typeFilter === 'ALL' || typeFilter === 'EXPENSE') && expenseCategories.length > 0 && (
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 text-red-500">
                            <ArrowUpRight size={20} className="font-bold" />
                            <h2 className="font-black uppercase tracking-widest text-sm">Categorias de Despesa</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {expenseCategories.map(cat => (
                                <CategoryCard key={cat.id} category={cat} onEdit={() => handleEdit(cat)} />
                            ))}
                        </div>
                    </section>
                )}

                {filteredCategories.length === 0 && (
                    <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-neutral-200">
                        <div className="size-16 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-4 text-neutral-300">
                            <LayoutGrid size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-neutral-1100">Nenhuma categoria encontrada</h3>
                        <p className="text-neutral-500 max-w-xs mx-auto mt-1">Refine sua busca ou crie uma nova categoria para organizar seus gastos.</p>
                    </div>
                )}
            </div>

            <AddCategoryModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                initialCategory={selectedCategory}
            />
        </div>
    );
}

function CategoryCard({ category, onEdit }: { category: Category; onEdit: () => void }) {
    return (
        <div
            onClick={onEdit}
            className="group bg-white p-5 rounded-3xl border border-neutral-100 shadow-sm hover:shadow-xl hover:border-brand-500/20 transition-all cursor-pointer flex items-center justify-between"
        >
            <div className="flex items-center gap-4">
                <div
                    className="size-14 rounded-2xl flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: `${category.color}15`, color: category.color }}
                >
                    {category.icon}
                </div>
                <div>
                    <h3 className="font-black text-neutral-1100 tracking-tight">{category.name}</h3>
                    <span className={clsx(
                        "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md",
                        category.type === 'INCOME' ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"
                    )}>
                        {category.type === 'INCOME' ? 'Receita' : 'Despesa'}
                    </span>
                </div>
            </div>
            <button className="p-2 text-neutral-300 group-hover:text-neutral-1100 bg-neutral-50 group-hover:bg-neutral-100 rounded-xl transition-all">
                <Edit2 size={18} />
            </button>
        </div>
    );
}
