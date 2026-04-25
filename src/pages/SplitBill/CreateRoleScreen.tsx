import { useState } from 'react';
import { Plus, ArrowLeft, Minus } from 'lucide-react';
import { SplitRole, Participant } from './types';
import { format } from 'date-fns';

const COMMON_ICONS = [
    '🍔', '🍕', '🍎', '🏥', '💊', '🚗', '🚌', '✈️',
    '🎮', '🎬', '📚', '🎓', '🏠', '⚡', '🛍️', '🛒',
    '💼', '🖥️', '💰', '💵', '📈', '🏦', '📦', '🏷️',
    '❤️', '🎁', '🐶', '⚽', '💅', '👔', '🧹', '🔧',
    '🍻', '🍹', '🍷', '🥂', '🎉', '🏖️', '🎤', '🎪'
];

interface CreateRoleScreenProps {
  onBack: () => void;
  onCreate: (role: SplitRole) => void;
}

export default function CreateRoleScreen({ onBack, onCreate }: CreateRoleScreenProps) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [emoji, setEmoji] = useState('🍔');
  const [participants, setParticipants] = useState<Participant[]>([
    { id: 'me', name: 'Eu', isMe: true }
  ]);
  const [newPersonName, setNewPersonName] = useState('');
  const [touched, setTouched] = useState(false);

  const isTitleMissing = !title.trim();
  const isValid = !isTitleMissing;

  const handleAddPerson = () => {
    if (newPersonName.trim()) {
      setParticipants([...participants, { id: Date.now().toString(), name: newPersonName.trim() }]);
      setNewPersonName('');
    }
  };

  const handleRemovePerson = (id: string) => {
    if (id === 'me') return;
    setParticipants(participants.filter(p => p.id !== id));
  };

  const handleCreate = () => {
    setTouched(true);
    if (!isValid) return;
    const role: SplitRole = {
      id: Date.now().toString(),
      title,
      date: format(new Date(date), 'dd/MM/yyyy'),
      emoji,
      participants,
      expenses: [],
      createdAt: new Date().toISOString()
    };
    onCreate(role);
  };

  return (
    <div className="flex flex-col h-full bg-white md:rounded-3xl max-w-2xl w-full mx-auto md:mt-10 p-6 shadow-sm border border-neutral-100 overflow-y-auto">
      <div className="flex items-center gap-4 mb-10">
        <button onClick={onBack} className="text-neutral-500 font-semibold text-sm hover:text-neutral-800 transition-colors">
          Cancelar
        </button>
        <h2 className="text-xl font-bold text-neutral-1100">Novo Rolê</h2>
      </div>

      <div className="space-y-6 flex-1">
        {/* Title */}
        <div className="space-y-2">
          <label className="text-base font-semibold text-neutral-500">
            Título <span className="text-red-500">*</span>
          </label>
          <div className="flex-1 flex flex-col w-full">
            <input
              type="text"
              placeholder="Ex: Barzinho do Zé"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className={`flex-1 bg-white border-2 rounded-xl px-4 py-3 text-lg text-neutral-800 outline-none focus:border-brand-500 transition-colors ${touched && isTitleMissing ? 'border-red-400' : 'border-neutral-200'}`}
            />
            {touched && isTitleMissing && (
              <span className="text-xs text-red-500 font-medium mt-1">Campo obrigatório</span>
            )}
          </div>
        </div>

        {/* Icon Picker */}
        <div className="space-y-2 pt-2">
          <label className="text-base font-semibold text-neutral-500">
            Ícone do Rolê
          </label>
          <div className="grid grid-cols-8 gap-2 border-2 border-neutral-100 p-3 rounded-2xl overflow-y-auto max-h-40 bg-neutral-50">
            {COMMON_ICONS.map(i => (
              <button
                key={i}
                type="button"
                onClick={() => setEmoji(i)}
                className={`w-10 h-10 flex items-center justify-center text-xl rounded-xl transition-all ${
                  emoji === i ? "bg-neutral-1100 scale-110 text-white shadow-md z-10" : "hover:bg-neutral-200 bg-white"
                }`}
              >
                {i}
              </button>
            ))}
          </div>
        </div>

        {/* Date */}
        <div className="space-y-2">
          <label className="text-base font-semibold text-neutral-500">Data do Rolê</label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="w-full bg-white border-2 border-neutral-200 rounded-xl px-4 py-3 text-lg text-neutral-800 outline-none focus:border-brand-500 transition-colors"
          />
        </div>

        {/* People */}
        <div className="space-y-2">
          <label className="text-base font-semibold text-neutral-500">Pessoas no rolê</label>
          <div className="bg-white border-2 border-neutral-200 rounded-xl p-4 flex flex-col gap-4">
            {participants.map((p, idx) => (
              <div key={p.id} className="flex flex-col">
                <div className="flex justify-between items-center py-2">
                  <span className="text-lg text-neutral-500">{p.name}</span>
                  {!p.isMe && (
                    <button onClick={() => handleRemovePerson(p.id)} className="text-red-500 hover:text-red-600 p-1">
                      <Minus size={20} />
                    </button>
                  )}
                </div>
                {idx < participants.length - 1 && <hr className="border-neutral-100" />}
              </div>
            ))}

            <hr className="border-neutral-100" />

            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                placeholder="Adicionar outra pessoa"
                value={newPersonName}
                onChange={e => setNewPersonName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddPerson()}
                className="flex-1 text-base text-brand-700 outline-none placeholder-brand-700/50 bg-transparent font-medium"
              />
              <button onClick={handleAddPerson} className="text-brand-700 hover:text-brand-800 p-1">
                <Plus size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 space-y-3 shrink-0 pb-4">
        {touched && !isValid && (
          <p className="text-sm text-red-500 font-medium text-center">
            Preencha os campos obrigatórios marcados com <span className="text-red-500">*</span>
          </p>
        )}
        <button
          onClick={handleCreate}
          className="w-full flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-400 text-neutral-1100 font-bold py-4 px-6 rounded-2xl transition-colors"
        >
          <Plus size={24} />
          Criar novo rolê
        </button>

        <button
          onClick={onBack}
          className="w-full flex items-center justify-center gap-2 bg-white border-2 border-neutral-200 hover:bg-neutral-50 text-neutral-1100 font-bold py-4 px-6 rounded-2xl transition-colors"
        >
          <ArrowLeft size={24} />
          Voltar
        </button>
      </div>
    </div>
  );
}
